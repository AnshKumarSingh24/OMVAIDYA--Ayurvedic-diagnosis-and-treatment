"""
AyuVaidya: Seed Data Initializer
Populates database with authenticated Brihat Trayi verses, formulation registries, and demo clinical cases.
"""

import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.database.models import Patient, AshtavidhaPariksha, Consultation, RecoveryLog, ClassicalVerse
from core.classical_corpus import CANONICAL_SHLOKAS, FORMULATION_SAFETY_CATALOG


def seed_database(db: Session):
    """Populates classical verses, demo patients, and consultations if database is empty."""
    # 1. Seed Classical Verses
    if db.query(ClassicalVerse).count() == 0:
        for item in CANONICAL_SHLOKAS:
            verse = ClassicalVerse(
                shloka_id=item["shloka_id"],
                treatise=item["treatise"],
                sthana=item["sthana"],
                adhyaya=item["adhyaya"],
                shloka_number=item["shloka_number"],
                sanskrit_devanagari=item["sanskrit_devanagari"],
                sanskrit_iast=item["sanskrit_iast"],
                english_translation=item["english_translation"],
                hindi_translation=item.get("hindi_translation", ""),
                dosha_association=",".join(item.get("dosha_association", [])),
                indications=json.dumps(item.get("indications", [])),
                formulations=json.dumps(item.get("formulations", [])),
                contraindications=json.dumps(item.get("contraindications", [])),
                keywords=",".join(item.get("keywords", []))
            )
            db.add(verse)
        db.commit()

    # 2. Seed Demo Patients if none exist
    if db.query(Patient).count() == 0:
        # Patient 1: Amavata (Rheumatoid arthritis presentation)
        p1 = Patient(
            full_name="Meenakshi Sundaram",
            age=42,
            gender="Female",
            contact="+91 98765 43210",
            prakriti="Vata-Kapha",
            agni="Mandagni (Sluggish / Kapha dominant)",
            koshtha="Madhyama (Moderate)",
            bala="Madhyama (Moderate Strength)",
            current_season="Hemanta (Early Winter)",
            is_pregnant=False,
            is_lactating=False
        )
        db.add(p1)
        db.flush()

        # Ashtavidha Pariksha for P1
        ap1 = AshtavidhaPariksha(
            patient_id=p1.id,
            nadi="Manda & Kaphaja (Slow, heavy pulse with Ama)",
            mutra="Avila (Slightly turbid, normal frequency)",
            mala="Sama Purisha (Sticky, unformed, foul-smelling)",
            jihwa="Saama (Thick white coated tongue, impaired taste)",
            shabda="Prakruta (Normal speech)",
            sparsha="Sheetala & Shopha (Cold to touch with peri-articular swelling)",
            druk="Alpa Avila (Slight morning dullness)",
            akruti="Madhyama with joint deformities in proximal interphalangeal joints",
            notes="Morning stiffness exceeding 90 minutes. Joint tenderness graded 3/4."
        )
        db.add(ap1)

        # Consultation 1 for P1
        c1 = Consultation(
            patient_id=p1.id,
            chief_complaints=json.dumps([
                "Severe morning stiffness in bilateral knee and wrist joints (> 90 mins)",
                "Joint swelling with migratory pain (Sandhi Shoola & Shopha)",
                "Complete loss of appetite (Aruchi) and feeling of heavy limbs (Gaurava)"
            ]),
            duration="4 months",
            triggering_nidana="Excessive intake of curd at night, sedentary habits, exposure to cold rainy weather.",
            probable_vyadhi="Amavata (Rheumatoid / Inflammatory Joint Pathology)",
            roganirnaya_summary=(
                "Patient presents with classic cardinal symptoms of Amavata. Impaired Jatharagni leads to systemic "
                "accumulation of Ama (toxic metabolic byproduct). Aggravated Vata propels Ama into Shleshma Sthanas "
                "(synovial cavities), obstructing Rasavaha and Asthivaha micro-channels (Sroto-rodha)."
            ),
            samprapti_json=json.dumps({
                "dosha": ["Vata (Vyana & Apana)", "Kapha (Shleshaka)"],
                "dushya": ["Rasa Dhatu", "Asthi Dhatu", "Majja Dhatu"],
                "agni": "Mandagni with severe Ama formation",
                "ama": True,
                "srotas": ["Rasavaha Srotas", "Asthivaha Srotas"],
                "sroto_dushti_prakara": "Sanga (Obstruction) and Vimarga Gamana",
                "adhisthana": "Janu (Knee), Mani-bandha (Wrist), and Sarva Sandhi"
            }),
            chikitsa_sutra="Langhana, Valuka Sveda (Dry sand fomentation), Tikta-Katu Deepana-Pachana, Virechana, and Basti (Ashtanga Hridaya Chi 21/42).",
            formulations_json=json.dumps([
                {
                    "name": "Simhanada Guggulu",
                    "form": "Vati / Tablet",
                    "dosage": "2 tablets (500mg each) twice daily",
                    "anupana": "Ushnodaka (Warm water) or Shunthi Kwatha",
                    "kala": "Madhyabhakta (Mid-meals)",
                    "shloka_ref": "AH_CHI_21_042"
                }
            ]),
            pathya_json=json.dumps([
                "Shunthi Jala (warm ginger water) for all drinking needs",
                "Purana Yava (aged barley) and Kulattha Yusha (horse gram soup)",
                "Dry fomentation (Valuka Sveda) over swollen joints"
            ]),
            apathya_json=json.dumps([
                "Abhyanga (oil massage) in acute inflammatory stage (strictly contraindicated)",
                "Dadhi (curd), cold milk, ice creams, and fermented batters",
                "Divasvapna (day sleep) and night awakening"
            ]),
            citations_json=json.dumps([
                {
                    "shloka_id": "AH_CHI_21_042",
                    "treatise": "Ashtanga Hridaya",
                    "sthana": "Chikitsa Sthana",
                    "adhyaya": "Amavata Chikitsa (Chapter 21)",
                    "shloka_number": "42",
                    "sanskrit_devanagari": "लङ्घनं स्वेदनं तिक्तं दीपनानि कटूनि च। विरेचनं स्नेहपानं बस्तयश्चाममारुते॥",
                    "sanskrit_iast": "laṅghanaṁ svedanaṁ tiktaṁ dīpanāni kaṭūni ca | virecanaṁ snehapānaṁ vastayaścāmamārute ||",
                    "english_translation": "In Amavata, fasting (Langhana), dry sweating (Svedana), bitter and pungent appetizers, purgation, medicated oleation, and basti are indicated."
                }
            ]),
            safety_audit_json=json.dumps({
                "is_safe": True,
                "warnings": ["Monitor for GI tolerance. Ensure dry warmth is applied instead of oil."],
                "contraindications_detected": [],
                "anupana_validations": ["Simhanada Guggulu: Checked Anupana 'Ushnodaka' -> APPROVED"],
                "age_pregnancy_flags": ["Non-pregnant adult female. Cleared for Simhanada Guggulu."]
            }),
            status="Active"
        )
        db.add(c1)
        db.flush()

        # Recovery logs for P1
        today = datetime.utcnow()
        for i in range(5):
            log = RecoveryLog(
                patient_id=p1.id,
                consultation_id=c1.id,
                log_date=today - timedelta(days=(4 - i) * 5),
                symptom_severity_score=max(2.0, 8.5 - (i * 1.3)),
                agni_rating=min(4.8, 2.0 + (i * 0.6)),
                dosha_balance_score=min(8.5, 4.0 + (i * 0.9)),
                clinical_notes=f"Week {i+1} follow-up. Tongue coating reduced, morning stiffness down to {90 - (i*15)} minutes."
            )
            db.add(log)

        # Patient 2: Grahani Dosha (IBS / Agnimandya)
        p2 = Patient(
            full_name="Rajesh Sharma",
            age=36,
            gender="Male",
            contact="+91 94455 11223",
            prakriti="Vata-Pitta",
            agni="Vishamagni (Irregular / Vata dominant)",
            koshtha="Krura (Hard / Constipated)",
            bala="Madhyama (Moderate Strength)",
            current_season="Hemanta",
            is_pregnant=False
        )
        db.add(p2)

        # Patient 3: Prameha (Metabolic / Diabetic support)
        p3 = Patient(
            full_name="Kavita Deshmukh",
            age=55,
            gender="Female",
            contact="+91 91234 56789",
            prakriti="Kapha",
            agni="Mandagni (Sluggish)",
            koshtha="Madhyama",
            bala="Pravara (Good)",
            current_season="Hemanta",
            is_pregnant=False
        )
        db.add(p3)

        db.commit()

