"""
AyuVaidya: Consultation & Diagnostic Reasoning Routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import json

from backend.database.connection import get_db
from backend.database.models import Patient, Consultation
from backend.services.ayurparam_service import ayurparam_service

router = APIRouter(prefix="/consultations", tags=["Consultation & Reasoning"])


class ConsultationAnalyzeIn(BaseModel):
    patient_id: Optional[int] = None
    patient_name: Optional[str] = "Walk-in Patient"
    age: int = 38
    gender: str = "Female"
    is_pregnant: bool = False
    is_lactating: bool = False
    prakriti: str = "Vata-Kapha"
    agni: str = "Mandagni"
    koshtha: str = "Madhyama"
    bala: str = "Madhyama"
    current_season: str = "Hemanta"
    chief_complaints: List[str]
    duration: Optional[str] = "3 weeks"
    triggering_nidana: Optional[str] = None
    save_to_patient: bool = False


@router.post("/analyze")
async def analyze_consultation(data: ConsultationAnalyzeIn, db: Session = Depends(get_db)):
    """
    Primary clinical reasoning endpoint:
    Invokes AyurParam (2.9B) + Brihat Trayi RAG + AyurGuard Deterministic Firewall.
    """
    patient_data = {
        "full_name": data.patient_name,
        "age": data.age,
        "gender": data.gender,
        "is_pregnant": data.is_pregnant,
        "is_lactating": data.is_lactating,
        "prakriti": data.prakriti,
        "agni": data.agni,
        "koshtha": data.koshtha,
        "bala": data.bala,
        "current_season": data.current_season,
        "triggering_nidana": data.triggering_nidana
    }

    # Run AyurParam 2.9B clinical pipeline
    result = await ayurparam_service.analyze_clinical_case(
        patient_data=patient_data,
        complaints=data.chief_complaints
    )

    # Optionally persist consultation
    consultation_id = None
    if data.save_to_patient and data.patient_id:
        p = db.query(Patient).filter(Patient.id == data.patient_id).first()
        if p:
            c = Consultation(
                patient_id=p.id,
                chief_complaints=json.dumps(data.chief_complaints),
                duration=data.duration,
                triggering_nidana=data.triggering_nidana,
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
            db.add(c)
            db.commit()
            db.refresh(c)
            consultation_id = c.id

    result["consultation_id"] = consultation_id
    return result


@router.get("/{consultation_id}")
def get_consultation(consultation_id: int, db: Session = Depends(get_db)):
    """Fetch stored clinical consultation by ID."""
    c = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Consultation record not found")

    return {
        "id": c.id,
        "patient_id": c.patient_id,
        "chief_complaints": json.loads(c.chief_complaints) if c.chief_complaints else [],
        "duration": c.duration,
        "triggering_nidana": c.triggering_nidana,
        "probable_vyadhi": c.probable_vyadhi,
        "roganirnaya_summary": c.roganirnaya_summary,
        "samprapti": json.loads(c.samprapti_json) if c.samprapti_json else {},
        "chikitsa_sutra": c.chikitsa_sutra,
        "prescriptions": json.loads(c.formulations_json) if c.formulations_json else [],
        "pathya": json.loads(c.pathya_json) if c.pathya_json else [],
        "apathya": json.loads(c.apathya_json) if c.apathya_json else [],
        "citations": json.loads(c.citations_json) if c.citations_json else [],
        "safety_audit": json.loads(c.safety_audit_json) if c.safety_audit_json else {},
        "created_at": c.created_at.isoformat() if c.created_at else None
    }

