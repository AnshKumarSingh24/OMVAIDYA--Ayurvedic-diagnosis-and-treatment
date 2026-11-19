"""
AyuVaidya: Case Workspace & Structured Dialogue Routes
Persistent case sessions, clinical fact ledger, context-aware clarifying questions,
and versioned analysis snapshots.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
import json
import hashlib

from backend.database.connection import get_db
from backend.database.models import (
    Patient,
    CaseSession,
    CaseFact,
    ConversationTurn,
    AnalysisSnapshot,
    Consultation,
    AshtavidhaPariksha
)
from backend.services.ayurparam_service import ayurparam_service

router = APIRouter(prefix="/cases", tags=["Case Sessions & Clinical Workspace"])


# --- Schemas ---

class FactIn(BaseModel):
    category: str
    key: str
    value: str
    normalized_value: Optional[str] = None
    source_type: str = "clinician_observed"
    confidence: float = 1.0
    confirmed_by_clinician: bool = True


class FactUpdateIn(BaseModel):
    value: Optional[str] = None
    normalized_value: Optional[str] = None
    source_type: Optional[str] = None
    confidence: Optional[float] = None
    confirmed_by_clinician: Optional[bool] = None


class CaseCreateIn(BaseModel):
    patient_id: int
    chief_problem: str
    duration: Optional[str] = "1-3 months"
    initial_facts: Optional[List[Dict[str, Any]]] = None


class ConversationTurnIn(BaseModel):
    role: str = "vaidya"  # assistant, vaidya, patient
    message: str
    question_key: Optional[str] = None
    answer_payload: Optional[str] = None


# --- Helper Functions ---

CANONICAL_KEY_MAP = {
    "chief_problem": "chief_complaint",
    "reported_symptoms": "chief_complaint",
    "primary_complaint": "chief_complaint",
    "complaints": "chief_complaint",
    "symptoms": "chief_complaint",
    "constitution": "prakriti",
    "digestive_fire": "agni",
    "bowel_nature": "koshtha",
    "bowel_habit": "koshtha",
    "stiffness": "morning_stiffness",
    "stiffness_duration": "morning_stiffness_duration",
    "aggravating": "aggravating_factors",
    "relieving": "relieving_factors",
}

def canonicalize_key(key: str) -> str:
    """Standardizes synonymous clinical keys to canonical forms."""
    if not key:
        return "general_observation"
    k = key.lower().strip().replace(" ", "_").replace("-", "_")
    return CANONICAL_KEY_MAP.get(k, k)

def normalize_clinical_text(text: str) -> str:
    """Normalizes raw user input: collapses spaces, converts ALL-CAPS to sentence case, deduplicates comma/semicolon phrases."""
    if not text:
        return ""
    import re
    cleaned = " ".join(text.strip().split())

    # If text is ALL-CAPS (or mostly uppercase letters), convert to Sentence Case
    letters = [c for c in cleaned if c.isalpha()]
    if len(letters) > 3 and all(c.isupper() for c in letters):
        cleaned = cleaned.lower()
        cleaned = re.sub(r'(^\s*\w|[.!?]\s*\w)', lambda m: m.group(1).upper(), cleaned)

    # Deduplicate comma or semicolon separated repeated phrases
    parts = [p.strip() for p in re.split(r'[,;]+', cleaned) if p.strip()]
    if len(parts) > 1:
        seen = set()
        unique = []
        for p in parts:
            p_lower = p.lower()
            if p_lower not in seen:
                seen.add(p_lower)
                unique.append(p)
        cleaned = ", ".join(unique)

    if cleaned and cleaned[0].islower():
        cleaned = cleaned[0].upper() + cleaned[1:]
    return cleaned


def serialize_case(case: CaseSession, db: Session) -> Dict[str, Any]:
    """Helper to serialize full case session with deduplicated facts, turns, and active analysis."""
    p = case.patient

    # Sort turns strictly chronological: created_at asc, id asc
    sorted_turns = sorted(
        case.conversation_turns,
        key=lambda t: (t.created_at or datetime.min, t.id or 0)
    )

    # Deduplicate and canonicalize facts on serialization
    deduped_facts_map = {}
    for f in case.facts:
        c_key = canonicalize_key(f.key)
        cat = f.category or "symptom"
        if c_key == "prakriti":
            cat = "prakriti"
        elif c_key == "agni":
            cat = "agni"
        elif c_key == "koshtha":
            cat = "koshtha"
        elif c_key == "chief_complaint":
            cat = "symptom"

        norm_val = normalize_clinical_text(f.normalized_value or f.value or "")
        if not norm_val:
            continue

        dedup_k = f"{cat}|{c_key}"
        if dedup_k not in deduped_facts_map:
            deduped_facts_map[dedup_k] = {
                "id": f.id,
                "category": cat,
                "key": c_key,
                "raw_key": f.key,
                "value": norm_val,
                "normalized_value": norm_val,
                "source_type": f.source_type or "patient_reported",
                "confidence": f.confidence or 1.0,
                "confirmed_by_clinician": bool(f.confirmed_by_clinician),
                "created_at": f.created_at.isoformat() if f.created_at else None
            }
        else:
            existing = deduped_facts_map[dedup_k]
            if f.confirmed_by_clinician and not existing["confirmed_by_clinician"]:
                existing["confirmed_by_clinician"] = True
            if norm_val != existing["value"] and norm_val not in existing["value"]:
                existing["value"] = f"{existing['value']}; {norm_val}"
                existing["normalized_value"] = existing["value"]

    facts_list = list(deduped_facts_map.values())

    turns_list = [
        {
            "id": t.id,
            "role": t.role,
            "message": t.message,
            "question_key": t.question_key,
            "answer_payload": t.answer_payload,
            "created_at": t.created_at.isoformat() if t.created_at else None
        }
        for t in sorted_turns
    ]

    active_analysis = None
    if case.active_analysis_id:
        snap = db.query(AnalysisSnapshot).filter(AnalysisSnapshot.id == case.active_analysis_id).first()
        if snap:
            active_analysis = {
                "id": snap.id,
                "version": snap.version,
                "engine_status": snap.engine_status,
                "safety_status": snap.safety_status,
                "created_at": snap.created_at.isoformat() if snap.created_at else None,
                "analysis": json.loads(snap.analysis_json)
            }

    return {
        "id": case.id,
        "patient_id": case.patient_id,
        "status": case.status,
        "chief_problem_plain_language": case.chief_problem_plain_language,
        "current_step": case.current_step,
        "red_flag_status": case.red_flag_status,
        "red_flag_details": case.red_flag_details,
        "created_at": case.created_at.isoformat() if case.created_at else None,
        "updated_at": case.updated_at.isoformat() if case.updated_at else None,
        "patient": {
            "id": p.id,
            "full_name": p.full_name,
            "age": p.age,
            "gender": p.gender,
            "prakriti": p.prakriti,
            "agni": p.agni,
            "koshtha": p.koshtha,
            "bala": p.bala,
            "current_season": p.current_season,
            "is_pregnant": p.is_pregnant,
            "is_lactating": p.is_lactating
        } if p else None,
        "facts": facts_list,
        "turns": turns_list,
        "active_analysis": active_analysis
    }


# --- Endpoints ---

@router.post("/")
def create_case(data: CaseCreateIn, db: Session = Depends(get_db)):
    """Create a new persistent active case session for a patient."""
    patient = db.query(Patient).filter(Patient.id == data.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    clean_chief = normalize_clinical_text(data.chief_problem)
    clean_duration = normalize_clinical_text(data.duration) if data.duration else "1-3 months"

    case = CaseSession(
        patient_id=patient.id,
        chief_problem_plain_language=clean_chief,
        status="in_clarification",
        current_step="clarification",
        red_flag_status="none"
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    # Insert baseline facts with deduplication
    existing_keys = set(["constitution", "digestive_fire", "chief_problem", "reported_symptoms", "duration"])
    facts_to_add = [
        CaseFact(case_id=case.id, category="prakriti", key="constitution", value=patient.prakriti, source_type="patient_reported", confirmed_by_clinician=True),
        CaseFact(case_id=case.id, category="agni", key="digestive_fire", value=patient.agni, source_type="patient_reported", confirmed_by_clinician=True),
        CaseFact(case_id=case.id, category="symptom", key="chief_problem", value=clean_chief, source_type="patient_reported", confirmed_by_clinician=True),
        CaseFact(case_id=case.id, category="timing", key="duration", value=clean_duration, source_type="patient_reported", confirmed_by_clinician=False)
    ]

    if patient.is_pregnant:
        facts_to_add.append(
            CaseFact(case_id=case.id, category="red_flag", key="is_pregnant", value="True (Garbhini)", source_type="patient_reported", confirmed_by_clinician=True)
        )
        case.red_flag_status = "warning"
        case.red_flag_details = "Patient is pregnant (Garbhini). Formulation safety checks strictly enforced."
        existing_keys.add("is_pregnant")

    if data.initial_facts:
        for f in data.initial_facts:
            k = f.get("key", "").strip()
            if not k or k in existing_keys:
                continue
            val = normalize_clinical_text(str(f.get("value", "")))
            if not val:
                continue
            existing_keys.add(k)
            facts_to_add.append(
                CaseFact(
                    case_id=case.id,
                    category=f.get("category", "symptom"),
                    key=k,
                    value=val,
                    normalized_value=val,
                    source_type=f.get("source_type", "patient_reported"),
                    confidence=float(f.get("confidence", 1.0)),
                    confirmed_by_clinician=bool(f.get("confirmed_by_clinician", False))
                )
            )

    db.add_all(facts_to_add)

    # Add initial greeting turn from Vaidya companion
    greeting_turn = ConversationTurn(
        case_id=case.id,
        role="assistant",
        message=(
            f"Namaste. I have initialized the active case workspace for {patient.full_name} "
            f"presenting with '{data.chief_problem}'. Let us conduct a structured inquiry to ground our clinical reasoning "
            f"in the classical Brihat Trayi."
        )
    )
    db.add(greeting_turn)
    db.commit()
    db.refresh(case)

    return serialize_case(case, db)


@router.get("/patient/{patient_id}")
def get_case_for_patient(patient_id: int, db: Session = Depends(get_db)):
    """Fetch active or latest case session for a patient, or create one if none exists."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Look for most recent case session
    case = db.query(CaseSession).filter(CaseSession.patient_id == patient_id).order_by(CaseSession.created_at.desc()).first()

    # If no case exists, create an initial one from patient's consultation or complaints
    if not case:
        recent_c = db.query(Consultation).filter(Consultation.patient_id == patient_id).order_by(Consultation.created_at.desc()).first()
        complaint = "General clinical consultation"
        if recent_c and recent_c.chief_complaints:
            try:
                c_list = json.loads(recent_c.chief_complaints)
                complaint = ", ".join(c_list)
            except Exception:
                complaint = recent_c.chief_complaints

        case = CaseSession(
            patient_id=patient_id,
            chief_problem_plain_language=complaint,
            status="ready_for_analysis" if recent_c else "in_clarification",
            current_step="clarification",
            red_flag_status="warning" if patient.is_pregnant else "none",
            red_flag_details="Pregnancy contraindications enforced." if patient.is_pregnant else None
        )
        db.add(case)
        db.commit()
        db.refresh(case)

        # Baseline facts
        facts = [
            CaseFact(case_id=case.id, category="prakriti", key="constitution", value=patient.prakriti, source_type="patient_reported", confirmed_by_clinician=True),
            CaseFact(case_id=case.id, category="agni", key="digestive_fire", value=patient.agni, source_type="patient_reported", confirmed_by_clinician=True),
            CaseFact(case_id=case.id, category="symptom", key="chief_problem", value=complaint, source_type="patient_reported", confirmed_by_clinician=True)
        ]
        db.add_all(facts)

        welcome_msg = ConversationTurn(
            case_id=case.id,
            role="assistant",
            message=f"Welcome to the clinical decision workspace for {patient.full_name}. What observations would you like to review?"
        )
        db.add(welcome_msg)
        db.commit()
        db.refresh(case)

    return serialize_case(case, db)


@router.get("/{case_id}")
def get_case(case_id: int, db: Session = Depends(get_db)):
    """Fetch complete case session record by ID."""
    case = db.query(CaseSession).filter(CaseSession.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case session not found")
    return serialize_case(case, db)


@router.post("/{case_id}/facts")
def add_fact(case_id: int, data: FactIn, db: Session = Depends(get_db)):
    """Add or assert a new structured clinical fact to the active case."""
    case = db.query(CaseSession).filter(CaseSession.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    norm_val = normalize_clinical_text(data.value)
    
    # Check if a fact with this category and key already exists in this case
    c_key = canonicalize_key(data.key)
    existing_fact = db.query(CaseFact).filter(
        CaseFact.case_id == case.id,
        (CaseFact.key == c_key) | (CaseFact.key == data.key)
    ).first()

    if existing_fact:
        existing_fact.key = c_key
        existing_fact.value = norm_val
        existing_fact.normalized_value = norm_val
        existing_fact.confirmed_by_clinician = data.confirmed_by_clinician
        existing_fact.source_type = data.source_type
        fact = existing_fact
    else:
        fact = CaseFact(
            case_id=case.id,
            category=data.category,
            key=c_key,
            value=norm_val,
            normalized_value=norm_val,
            source_type=data.source_type,
            confidence=data.confidence,
            confirmed_by_clinician=data.confirmed_by_clinician
        )
        db.add(fact)

    # Check for red flag triggers
    val_lower = data.value.lower()
    if "fever" in val_lower and ("hot" in val_lower or "redness" in val_lower or "swelling" in val_lower):
        case.red_flag_status = "alert"
        case.red_flag_details = "Potential acute septic arthritis or severe inflammatory exacerbation detected."
    elif "blood" in val_lower and ("stool" in val_lower or "vomit" in val_lower):
        case.red_flag_status = "alert"
        case.red_flag_details = "Gastrointestinal bleeding signs reported."

    db.commit()
    db.refresh(fact)

    return {
        "fact_id": fact.id,
        "category": fact.category,
        "key": fact.key,
        "value": fact.value,
        "confirmed_by_clinician": fact.confirmed_by_clinician,
        "red_flag_status": case.red_flag_status
    }


@router.patch("/{case_id}/facts/{fact_id}")
def update_fact(case_id: int, fact_id: int, data: FactUpdateIn, db: Session = Depends(get_db)):
    """Update an existing fact (confirm, reject, edit value, or mark unknown)."""
    fact = db.query(CaseFact).filter(CaseFact.id == fact_id, CaseFact.case_id == case_id).first()
    if not fact:
        raise HTTPException(status_code=404, detail="Fact not found in this case")

    if data.value is not None:
        fact.value = data.value
    if data.normalized_value is not None:
        fact.normalized_value = data.normalized_value
    if data.source_type is not None:
        fact.source_type = data.source_type
    if data.confidence is not None:
        fact.confidence = data.confidence
    if data.confirmed_by_clinician is not None:
        fact.confirmed_by_clinician = data.confirmed_by_clinician

    db.commit()
    db.refresh(fact)

    return {
        "fact_id": fact.id,
        "key": fact.key,
        "value": fact.value,
        "confirmed_by_clinician": fact.confirmed_by_clinician
    }


@router.delete("/{case_id}/facts/{fact_id}")
def delete_fact(case_id: int, fact_id: int, db: Session = Depends(get_db)):
    """Delete a fact from the active case."""
    fact = db.query(CaseFact).filter(CaseFact.id == fact_id, CaseFact.case_id == case_id).first()
    if not fact:
        raise HTTPException(status_code=404, detail="Fact not found")
    db.delete(fact)
    db.commit()
    return {"status": "success", "deleted_fact_id": fact_id}


@router.get("/{case_id}/conversation")
def get_conversation(case_id: int, db: Session = Depends(get_db)):
    """Get conversation turns for this case."""
    turns = db.query(ConversationTurn).filter(ConversationTurn.case_id == case_id).order_by(ConversationTurn.created_at.asc()).all()
    return [
        {
            "id": t.id,
            "role": t.role,
            "message": t.message,
            "question_key": t.question_key,
            "answer_payload": t.answer_payload,
            "created_at": t.created_at.isoformat() if t.created_at else None
        }
        for t in turns
    ]


@router.post("/{case_id}/conversation")
def add_conversation_turn(case_id: int, data: ConversationTurnIn, db: Session = Depends(get_db)):
    """Record a conversation turn (Vaidya note, answer to question, or instruction)."""
    case = db.query(CaseSession).filter(CaseSession.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    norm_msg = normalize_clinical_text(data.message)
    turn = ConversationTurn(
        case_id=case.id,
        role=data.role,
        message=norm_msg,
        question_key=data.question_key,
        answer_payload=data.answer_payload
    )
    db.add(turn)

    # If this turn is an answer to a question, assert it as a case fact
    if data.question_key and norm_msg:
        existing_fact = db.query(CaseFact).filter(CaseFact.case_id == case.id, CaseFact.key == data.question_key).first()
        if existing_fact:
            existing_fact.value = norm_msg
            existing_fact.normalized_value = norm_msg
            existing_fact.confirmed_by_clinician = True
        else:
            category = "symptom"
            if "stiffness" in data.question_key or "duration" in data.question_key:
                category = "timing"
            elif "tongue" in data.question_key or "pulse" in data.question_key or "pariksha" in data.question_key:
                category = "pariksha"
            elif "food" in data.question_key or "diet" in data.question_key:
                category = "lifestyle"
            elif "red_flag" in data.question_key:
                category = "red_flag"

            new_f = CaseFact(
                case_id=case.id,
                category=category,
                key=data.question_key,
                value=norm_msg,
                normalized_value=norm_msg,
                source_type="clinician_observed",
                confirmed_by_clinician=True
            )
            db.add(new_f)

    db.commit()
    db.refresh(turn)

    return {
        "turn_id": turn.id,
        "role": turn.role,
        "message": turn.message,
        "question_key": turn.question_key
    }


@router.post("/{case_id}/next-question")
def get_next_clarifying_question(case_id: int, db: Session = Depends(get_db)):
    """
    Context-aware clinical follow-up question generator.
    Scans known facts and returns the highest priority missing diagnostic fact.
    """
    case = db.query(CaseSession).filter(CaseSession.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    known_keys = {f.key.lower() for f in case.facts}
    all_facts_text = " ".join([f.value for f in case.facts] + [case.chief_problem_plain_language]).lower()

    # Rule 0: Musculoskeletal & Sports Overexertion (Cricket, Thigh/Leg Pain, Muscle Strain)
    if any(w in all_facts_text for w in ["thigh", "cricket", "sports", "running", "muscle", "strain", "soreness", "cramp", "playing", "after playing", "uru", "mamsa"]):
        if "sports_exertion_character" not in known_keys:
            return {
                "has_next": True,
                "question_key": "sports_exertion_character",
                "category": "symptom",
                "question_text": "Did this thigh or muscle pain develop as progressive soreness after playing cricket/sports, or was there an acute sudden pop or pull during play?",
                "clinical_rationale": "In Sushruta Chikitsa 4/8, delayed aching soreness and stiffness after physical exertion indicates Mamsagata Vata (exertional myalgia with metabolic fatigue); an acute pop indicates Snayu-Kandara Abhighata (tendon/muscle tear).",
                "options": [
                    "Deep aching soreness, heaviness and stiffness developing after playing cricket/sports",
                    "Sudden sharp pulling pain during a fast sprint or bowling stride",
                    "Dull aching pain that worsens with standing and relieves with rest"
                ],
                "allow_custom": True
            }

        if "relief_by_oil_warmth" not in known_keys:
            return {
                "has_next": True,
                "question_key": "relief_by_oil_warmth",
                "category": "symptom",
                "question_text": "Does applying warm oil (Abhyanga) and warm water compresses bring noticeable relief to the thighs or aching muscles?",
                "clinical_rationale": "Marked relief with warm unctuous fomentation (Sneha-Sweda Priyata) confirms Vata aggravation in muscle tissue (Mamsagata Vata) rather than acute inflammatory effusion.",
                "options": [
                    "Yes, warm oil and warm compress provide significant soothing relief",
                    "Warmth makes it feel throbbing; cold packs feel better",
                    "No noticeable change with warmth; only rest helps"
                ],
                "allow_custom": True
            }

    # Rule 0.5: Sleep / Circadian Inversion / Chronic Lethargy & Heavy Limbs (Anidra & Tandra)
    if any(w in all_facts_text for w in ["sleep", "cant sleep", "dont sleep", "insomnia", "waking up", "dont wake up", "anidra", "tandra", "alasya", "lethargy", "heavy limbs", "gaurava"]):
        if "circadian_sleep_pattern" not in known_keys:
            return {
                "has_next": True,
                "question_key": "circadian_sleep_pattern",
                "category": "symptom",
                "question_text": "Do you struggle to fall asleep at night, and then experience heavy limbs and extreme difficulty waking up in the morning (Gaurava & Tandra)?",
                "clinical_rationale": "In Charaka Sutra 21/35, difficulty initiating sleep at night combined with daytime grogginess and heavy limbs confirms circadian cycle inversion (Nidraviparyaya / Kaphaja Tandra).",
                "options": [
                    "Yes, cannot fall asleep until late night, then wake up feeling exhausted and heavy",
                    "Fall asleep quickly but wake up frequently throughout the night",
                    "Feel sleepy, lethargic and unrefreshed throughout the entire day"
                ],
                "allow_custom": True
            }

        if "daytime_habits" not in known_keys:
            return {
                "has_next": True,
                "question_key": "daytime_habits",
                "category": "lifestyle",
                "question_text": "Do you take daytime naps (Divasvapna), or spend extended time viewing phone or laptop screens before bed?",
                "clinical_rationale": "Divasvapna aggravates Kapha and promotes Ama in Manovaha channels, while nocturnal screen stimulation vitiates Prana Vata, driving chronic sleep dysregulation.",
                "options": [
                    "Yes, frequently nap in the afternoon and use screens late in bed",
                    "No daytime naps, but high screen usage before sleeping",
                    "Neither, but schedule is irregular"
                ],
                "allow_custom": True
            }

    # Rule 1: Morning stiffness duration for Joint / Rheumatic complaints
    if any(w in all_facts_text for w in ["joint", "stiffness", "swelling", "knee", "wrist", "arthritis", "amavata"]):
        if "morning_stiffness_duration" not in known_keys:
            return {
                "has_next": True,
                "question_key": "morning_stiffness_duration",
                "category": "timing",
                "question_text": "How long does your joint stiffness persist after waking up in the morning?",
                "clinical_rationale": "In Ayurveda, morning stiffness exceeding 1 hour indicates inflammatory Amavata with systemic Ama; stiffness under 30 minutes indicates degenerative Sandhigata Vata.",
                "options": [
                    "Greater than 1 hour with swollen joints",
                    "15 to 30 minutes, eases with gentle movement",
                    "No morning stiffness"
                ],
                "allow_custom": True
            }

        if "appetite_and_tongue" not in known_keys:
            return {
                "has_next": True,
                "question_key": "appetite_and_tongue",
                "category": "pariksha",
                "question_text": "How is your appetite, and is there a noticeable white or thick coating on your tongue (Jihwa)?",
                "clinical_rationale": "A coated tongue (Sama Jihwa) and sluggish appetite (Mandagni) indicate undigested metabolic toxins (Ama) as the primary etiopathogenetic driver.",
                "options": [
                    "Thick white coating on tongue + poor appetite",
                    "Tongue is clean + appetite is good",
                    "Irregular appetite with dry tongue"
                ],
                "allow_custom": True
            }

        if "red_flag_joint_infection" not in known_keys:
            return {
                "has_next": True,
                "question_key": "red_flag_joint_infection",
                "category": "red_flag",
                "question_text": "Is there sudden intense redness, acute heat in a single joint, or accompanying high fever?",
                "clinical_rationale": "Red Flag Triage: Acute hot monoarthritis with fever may represent septic arthritis requiring urgent emergency orthopaedic drainage.",
                "options": [
                    "No, multiple joints with dull ache and coldness",
                    "Yes, sudden severe heat, redness and fever"
                ],
                "allow_custom": False
            }

    # Rule 2: Digestive / Gut Complaints
    if any(w in all_facts_text for w in ["bloat", "indigestion", "stool", "grahani", "ibs", "gas", "bowel"]):
        if "bowel_timing_consistency" not in known_keys:
            return {
                "has_next": True,
                "question_key": "bowel_timing_consistency",
                "category": "symptom",
                "question_text": "Do your bowel movements alternate between loose and hard stools, accompanied by loud intestinal rumbling (Antrakujana)?",
                "clinical_rationale": "Alternating bowel habits and Antrakujana are classical cardinal signs of Grahani Dosha.",
                "options": [
                    "Yes, alternates between loose and constipated with gurgling",
                    "Predominantly hard, dry stools with straining",
                    "Burning loose watery stools"
                ],
                "allow_custom": True
            }

        if "red_flag_digestive" not in known_keys:
            return {
                "has_next": True,
                "question_key": "red_flag_digestive",
                "category": "red_flag",
                "question_text": "Have you noticed any visible blood in the stool, unexplained weight loss, or difficulty swallowing?",
                "clinical_rationale": "Red Flag Triage: Gastrointestinal bleeding or rapid unintentional cachexia demands urgent endoscopic evaluation.",
                "options": [
                    "No blood or drastic weight loss",
                    "Yes, blood observed in stool or vomit"
                ],
                "allow_custom": False
            }

    # Rule 3: Metabolic & Urinary Complaints
    if any(w in all_facts_text for w in ["sugar", "diabetes", "urine", "thirst", "prameha"]):
        if "urination_pattern" not in known_keys:
            return {
                "has_next": True,
                "question_key": "urination_pattern",
                "category": "symptom",
                "question_text": "Do you experience profuse, turbid urination (Prabhuta-Avila Mutrata), especially waking multiple times at night?",
                "clinical_rationale": "Frequent, turbid urination is the pathognomonic sign of Prameha (glycemic dysregulation).",
                "options": [
                    "Yes, profuse turbid urination during day and night",
                    "Frequent but clear urine",
                    "Burning urination in small quantities"
                ],
                "allow_custom": True
            }

    # Rule 4: Respiratory Complaints
    if any(w in all_facts_text for w in ["cough", "breathless", "asthma", "wheez", "shwasa"]):
        if "breathlessness_timing" not in known_keys:
            return {
                "has_next": True,
                "question_key": "breathlessness_timing",
                "category": "timing",
                "question_text": "Does breathlessness worsen during early night or cold weather, and does sitting upright provide relief?",
                "clinical_rationale": "Pratiloma Vata in Tamaka Shwasa characteristically aggravates in cold drafts with orthopnea (Asino Labhate Saukhyam).",
                "options": [
                    "Worse at night and in cold; relieved sitting upright",
                    "Only on strenuous exertion",
                    "Continuous breathlessness regardless of posture"
                ],
                "allow_custom": True
            }

    # Rule 5: Skin Complaints
    if any(w in all_facts_text for w in ["skin", "rash", "itching", "eczema", "psoriasis", "kushtha"]):
        if "skin_characteristics" not in known_keys:
            return {
                "has_next": True,
                "question_key": "skin_characteristics",
                "category": "symptom",
                "question_text": "Are the skin lesions dry with silvery scaling, or wet with oozing fluid and intense burning?",
                "clinical_rationale": "Scaling dry plaques indicate Vata-Kapha dominance (Ekakushtha / Psoriasis); weeping burning lesions indicate Pitta-Rakta involvement.",
                "options": [
                    "Dry scaling plaques with itching",
                    "Oozing, red lesions with severe burning sensation",
                    "Small raised itchy hives"
                ],
                "allow_custom": True
            }

    # Rule 6: Headache / Shiroroga Complaints
    if any(w in all_facts_text for w in ["headache", "head ache", "head pain", "migraine", "shiras", "shiro"]):
        if "headache_character_timing" not in known_keys:
            return {
                "has_next": True,
                "question_key": "headache_character_timing",
                "category": "symptom",
                "question_text": "Is your headache throbbing and localized to one side (Ardhavabhedaka), or a tight band-like compression around the entire head?",
                "clinical_rationale": "In Charaka Siddhi Sthana 9, unilateral throbbing pain indicates Vata-Pitta vascular involvement (Ardhavabhedaka / Migraine), whereas diffuse band-like compression indicates Vataja-Kaphaja tension cephalalgia.",
                "options": [
                    "Throbbing, pulsating or one-sided pain worse with bright light or noise",
                    "Dull, heavy pressure around the forehead and temples",
                    "Burning sensation behind the eyes with neck stiffness"
                ],
                "allow_custom": True
            }

    # Rule 7: Sciatica / Lumbar Radiculopathy (Gridhrasi)
    if any(w in all_facts_text for w in ["sciatica", "gridhrasi", "radiating pain", "shooting leg", "back pain", "lower back", "katisula", "lumbar"]):
        if "sciatica_radiation_pattern" not in known_keys:
            return {
                "has_next": True,
                "question_key": "sciatica_radiation_pattern",
                "category": "symptom",
                "question_text": "Does your pain originate in the lower back or gluteal area and radiate sharply down the posterior thigh into the calf or heel (Gridhrasi)?",
                "clinical_rationale": "In Charaka Chikitsa 28/56, radiation from Sphik (buttock) along the Kandara nerve tract distinguishes classical Gridhrasi from non-radicular local Katisula.",
                "options": [
                    "Yes, sharp shooting pain radiating down the back of the leg to the calf/foot",
                    "Aching localized strictly to the lower back without leg radiation",
                    "Pain across both hips worse after prolonged sitting"
                ],
                "allow_custom": True
            }

    # Rule 8: Gout & Uric Acid / Burning Joint (Vatarakta)
    if any(w in all_facts_text for w in ["gout", "uric acid", "vatarakta", "big toe", "burning joint", "toe pain"]):
        if "gout_burning_character" not in known_keys:
            return {
                "has_next": True,
                "question_key": "gout_burning_character",
                "category": "symptom",
                "question_text": "Did the joint discomfort begin with intense burning heat, redness, and extreme touch sensitivity in the great toe or ankle (Vatarakta)?",
                "clinical_rationale": "In Charaka Chikitsa 29/30, severe burning with hyperesthesia in peripheral small joints indicates Rakta-Pitta corruption (Vatarakta / Gout).",
                "options": [
                    "Yes, intense burning pain and redness in the big toe/ankle, sensitive to touch",
                    "Dull aching joint pain without burning or redness",
                    "Symmetrical joint stiffness in morning"
                ],
                "allow_custom": True
            }

    # Rule 9: Kidney Stones & Dysuria (Mutrashmari)
    if any(w in all_facts_text for w in ["kidney stone", "ashmari", "urinary burning", "burning urination", "dysuria", "flank"]):
        if "stone_colic_radiation" not in known_keys:
            return {
                "has_next": True,
                "question_key": "stone_colic_radiation",
                "category": "symptom",
                "question_text": "Do you experience severe spasmodic pain in the flank or lower abdomen radiating down toward the groin, accompanied by painful burning urination (Mutrashmari)?",
                "clinical_rationale": "In Sushruta Chikitsa 7/12, spasmodic flank-to-groin colic with dysuria confirms calculus migration through Mutravaha channels.",
                "options": [
                    "Yes, intense spasmodic pain from flank radiating to groin with burning urine",
                    "Constant dull ache in lower back with cloudy urine",
                    "Burning sensation only at the end of urination"
                ],
                "allow_custom": True
            }

    # Rule 10: Frozen Shoulder & Shoulder Joint (Apabahuka)
    if any(w in all_facts_text for w in ["frozen shoulder", "shoulder", "apabahuka", "arm pain", "cannot lift arm"]):
        if "shoulder_mobility_restriction" not in known_keys:
            return {
                "has_next": True,
                "question_key": "shoulder_mobility_restriction",
                "category": "symptom",
                "question_text": "Is your shoulder stiffness restricting you from raising your arm overhead or reaching behind your back, especially with nocturnal aching (Apabahuka)?",
                "clinical_rationale": "In Sushruta Nidana 1/82, capsular restriction of arm elevation characterizes Apabahuka (Vataja shoulder contracture).",
                "options": [
                    "Yes, severe stiffness cannot lift arm above shoulder height",
                    "Pain on movement but full range of motion preserved",
                    "Pain radiating from neck into fingers with numbness"
                ],
                "allow_custom": True
            }

    # Rule 10.5: Hyperactive Metabolism / Inability to Gain Weight (Karshya / Atyagni / Bhasmaka)
    if any(w in all_facts_text for w in [
        "metabolism", "fast metabolism", "hyperactive metabolism", "unable to gain weight",
        "cannot gain weight", "not gaining weight", "weight", "underweight", "thin", "skinny",
        "karshya", "atyagni", "bhasmaka", "eat a lot", "always hungry", "ravenous",
        "emaciat", "dhatukshaya", "dhatu kshaya"
    ]):
        if "atyagni_hunger_pattern" not in known_keys:
            return {
                "has_next": True,
                "question_key": "atyagni_hunger_pattern",
                "category": "symptom",
                "question_text": "Do you feel intense hunger again within 1-2 hours after a full meal, and despite eating well, find it very difficult or impossible to gain body weight?",
                "clinical_rationale": "In Charaka Chikitsa 15/217-219, rapid return of hunger after a full meal combined with inability to gain weight is the hallmark of Atyagni (Bhasmaka Roga) — a hyperactive Jatharagni state where food is consumed by the digestive fire before it can nourish the Dhatus.",
                "options": [
                    "Yes, hungry again within 1-2 hours of eating and weight stays the same despite high intake",
                    "Appetite is normal, but metabolism just feels fast",
                    "No excessive hunger, but weight does not increase at all"
                ],
                "allow_custom": True
            }

        if "atyagni_body_signs" not in known_keys:
            return {
                "has_next": True,
                "question_key": "atyagni_body_signs",
                "category": "symptom",
                "question_text": "Is the difficulty in gaining weight accompanied by dryness, prominent joints and veins, reduced stamina, or restlessness — signs of Dhatu depletion (Dhatukshaya)?",
                "clinical_rationale": "In Charaka Sutra 21/11-20, prominent body frame, Rasa-Mamsa-Meda Dhatu depletion, Ojakshaya (immune fragility), and hyperactive Vata-Pitta confirm Karshya / Atyagni pattern rather than a simple constitutional thin build.",
                "options": [
                    "Yes, prominent joints, dry skin, restlessness, easy fatigue and low stamina",
                    "Thin but energy is good and no dryness noticed",
                    "Thin with feeling of excessive heat, burning sensation and irritability"
                ],
                "allow_custom": True
            }

    # Rule 11: General Undifferentiated / Unlisted Lakshana Inquiry (Prashna Pariksha)
    if "problem_location_character" not in known_keys:
        return {
            "has_next": True,
            "question_key": "problem_location_character",
            "category": "symptom",
            "question_text": "What is the primary anatomical location of your discomfort, and what is the exact sensation (e.g. sharp shooting, burning, throbbing, dull aching, heavy numb)?",
            "clinical_rationale": "In Charaka Vimana 8/83 (Prashna Pariksha), identifying anatomical Khavaigunya (Sthana) and qualitative sensory attributes (Vedana Svarupa) is essential to determine the specific involved Dosha.",
            "options": [
                "Sharp piercing or shooting pain (Toda - Vata dominant)",
                "Burning heat, inflammation, or acid sensation (Daha/Vidaha - Pitta dominant)",
                "Heavy, dull, sluggish, or congested feeling (Gaurava - Kapha dominant)",
                "Mixed or alternating sensations depending on time of day"
            ],
            "allow_custom": True
        }

    # General trigger inquiry if none of the above are pending
    if "aggravating_factors" not in known_keys:
        return {
            "has_next": True,
            "question_key": "aggravating_factors",
            "category": "lifestyle",
            "question_text": "Which foods or environmental conditions noticeably aggravate your symptoms?",
            "clinical_rationale": "Nidana Parivarjana: Identifying specific dietary and environmental triggers is the essential cornerstone of Ayurvedic Chikitsa.",
            "options": [
                "Cold drinks, curd, and cloudy weather",
                "Spicy, oily, and sour foods",
                "Stress, late nights, and irregular eating",
                "No clear aggravating pattern"
            ],
            "allow_custom": True
        }

    return {
        "has_next": False,
        "message": "Clinical data collection complete. All distinguishing Lakshana factors are recorded. Ready to synthesize AyurParam case analysis."
    }


@router.post("/{case_id}/analyze")
async def analyze_case(case_id: int, db: Session = Depends(get_db)):
    """
    Primary case analysis execution:
    Synthesizes current facts, verifies Brihat Trayi RAG, executes AyurGuard deterministic rules,
    creates versioned AnalysisSnapshot, and updates Consultation record.
    """
    case = db.query(CaseSession).filter(CaseSession.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case session not found")

    patient = case.patient
    if not patient:
        raise HTTPException(status_code=404, detail="Patient associated with case not found")

    # Gather all facts
    facts = db.query(CaseFact).filter(CaseFact.case_id == case.id).all()
    facts_data = [
        {
            "category": f.category,
            "key": f.key,
            "value": f.value,
            "confirmed_by_clinician": f.confirmed_by_clinician
        }
        for f in facts
    ]

    # Build complaints list from symptoms
    complaints = [case.chief_problem_plain_language]
    duration = "1-3 months"
    ashtavidha = {}

    for f in facts:
        if f.category == "symptom" and f.value not in complaints:
            complaints.append(f.value)
        elif f.category == "timing" and "duration" in f.key:
            duration = f.value
        elif f.category == "pariksha":
            ashtavidha[f.key] = f.value

    # Compute facts hash to track changes across versions
    hash_str = json.dumps(facts_data, sort_keys=True)
    input_hash = hashlib.sha256(hash_str.encode()).hexdigest()[:16]

    # Determine snapshot version
    prev_snapshots = db.query(AnalysisSnapshot).filter(AnalysisSnapshot.case_id == case.id).order_by(AnalysisSnapshot.version.desc()).all()
    next_version = (prev_snapshots[0].version + 1) if prev_snapshots else 1
    prev_id = prev_snapshots[0].id if prev_snapshots else None

    # Execute AyurParam Inference Service
    patient_dict = {
        "full_name": patient.full_name,
        "age": patient.age,
        "gender": patient.gender,
        "prakriti": patient.prakriti,
        "agni": patient.agni,
        "koshtha": patient.koshtha,
        "bala": patient.bala,
        "current_season": patient.current_season,
        "is_pregnant": patient.is_pregnant,
        "is_lactating": patient.is_lactating
    }

    result = await ayurparam_service.analyze_clinical_case(
        patient_data=patient_dict,
        complaints=complaints,
        ashtavidha=ashtavidha,
        structured_facts=facts_data,
        duration=duration
    )

    # Safety status from AyurGuard
    safety_audit = result.get("safety_audit", {})
    is_safe = safety_audit.get("is_safe", True)
    safety_status = "passed" if is_safe else "safety_hold"
    if case.red_flag_status == "alert":
        safety_status = "safety_hold"
    elif case.red_flag_status == "warning" and safety_status != "safety_hold":
        safety_status = "warning"

    # Save AnalysisSnapshot
    snapshot = AnalysisSnapshot(
        case_id=case.id,
        version=next_version,
        input_hash=input_hash,
        engine_status=result.get("engine_status", "local_fallback"),
        safety_status=safety_status,
        analysis_json=json.dumps(result),
        supersedes_id=prev_id
    )
    db.add(snapshot)
    db.commit()
    db.refresh(snapshot)

    # Update CaseSession status
    case.active_analysis_id = snapshot.id
    case.status = "analyzed"
    case.current_step = "reviewed"
    db.commit()

    # Sync with Consultation table for backward compatibility & consultation history
    existing_consultation = db.query(Consultation).filter(Consultation.patient_id == patient.id).order_by(Consultation.created_at.desc()).first()
    if existing_consultation:
        existing_consultation.probable_vyadhi = result["probable_vyadhi"]
        existing_consultation.roganirnaya_summary = result["roganirnaya_summary"]
        existing_consultation.samprapti_json = json.dumps(result["samprapti_ghatakas"])
        existing_consultation.chikitsa_sutra = result["chikitsa_sutra"]
        existing_consultation.formulations_json = json.dumps(result["prescriptions"])
        existing_consultation.pathya_json = json.dumps(result["pathya"])
        existing_consultation.apathya_json = json.dumps(result["apathya"])
        existing_consultation.citations_json = json.dumps(result["citations"])
        existing_consultation.safety_audit_json = json.dumps(result["safety_audit"])
    else:
        new_c = Consultation(
            patient_id=patient.id,
            chief_complaints=json.dumps(complaints),
            duration=duration,
            probable_vyadhi=result["probable_vyadhi"],
            roganirnaya_summary=result["roganirnaya_summary"],
            samprapti_json=json.dumps(result["samprapti_ghatakas"]),
            chikitsa_sutra=result["chikitsa_sutra"],
            formulations_json=json.dumps(result["prescriptions"]),
            pathya_json=json.dumps(result["pathya"]),
            apathya_json=json.dumps(result["apathya"]),
            citations_json=json.dumps(result["citations"]),
            safety_audit_json=json.dumps(result["safety_audit"]),
            status="Active"
        )
        db.add(new_c)

    db.commit()

    return {
        "snapshot_id": snapshot.id,
        "version": snapshot.version,
        "engine_status": snapshot.engine_status,
        "safety_status": snapshot.safety_status,
        "created_at": snapshot.created_at.isoformat(),
        "analysis": result
    }


@router.get("/{case_id}/analyses")
def list_analyses(case_id: int, db: Session = Depends(get_db)):
    """List all versioned analysis snapshots for this case."""
    snaps = db.query(AnalysisSnapshot).filter(AnalysisSnapshot.case_id == case_id).order_by(AnalysisSnapshot.version.desc()).all()
    return [
        {
            "id": s.id,
            "version": s.version,
            "input_hash": s.input_hash,
            "engine_status": s.engine_status,
            "safety_status": s.safety_status,
            "supersedes_id": s.supersedes_id,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "analysis": json.loads(s.analysis_json)
        }
        for s in snaps
    ]

