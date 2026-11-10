"""
AyuVaidya: Patients & Ashtavidha Pariksha Routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from backend.database.connection import get_db
from backend.database.models import Patient, AshtavidhaPariksha, Consultation, RecoveryLog

router = APIRouter(prefix="/patients", tags=["Patients & Pariksha"])


class AshtavidhaIn(BaseModel):
    nadi: Optional[str] = None
    mutra: Optional[str] = None
    mala: Optional[str] = None
    jihwa: Optional[str] = None
    shabda: Optional[str] = None
    sparsha: Optional[str] = None
    druk: Optional[str] = None
    akruti: Optional[str] = None
    notes: Optional[str] = None


class PatientCreateIn(BaseModel):
    full_name: str
    age: int
    gender: str
    contact: Optional[str] = None
    prakriti: str = "Vata-Pitta"
    agni: str = "Mandagni"
    koshtha: str = "Madhyama"
    bala: str = "Madhyama"
    current_season: str = "Hemanta"
    is_pregnant: bool = False
    is_lactating: bool = False
    ashtavidha: Optional[AshtavidhaIn] = None


@router.get("/")
def list_patients(db: Session = Depends(get_db)):
    """List all registered patients with their active consultation count."""
    patients = db.query(Patient).order_by(Patient.updated_at.desc()).all()
    results = []
    for p in patients:
        recent_c = db.query(Consultation).filter(Consultation.patient_id == p.id).order_by(Consultation.created_at.desc()).first()
        results.append({
            "id": p.id,
            "full_name": p.full_name,
            "age": p.age,
            "gender": p.gender,
            "contact": p.contact,
            "prakriti": p.prakriti,
            "agni": p.agni,
            "is_pregnant": p.is_pregnant,
            "latest_vyadhi": recent_c.probable_vyadhi if recent_c else "No consultation yet",
            "created_at": p.created_at.isoformat() if p.created_at else None
        })
    return results


@router.get("/{patient_id}")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    """Fetch complete patient record, including Ashtavidha Pariksha and consultations."""
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")

    pariksha = db.query(AshtavidhaPariksha).filter(AshtavidhaPariksha.patient_id == p.id).order_by(AshtavidhaPariksha.created_at.desc()).first()
    consultations = db.query(Consultation).filter(Consultation.patient_id == p.id).order_by(Consultation.created_at.desc()).all()

    return {
        "id": p.id,
        "full_name": p.full_name,
        "age": p.age,
        "gender": p.gender,
        "contact": p.contact,
        "prakriti": p.prakriti,
        "agni": p.agni,
        "koshtha": p.koshtha,
        "bala": p.bala,
        "current_season": p.current_season,
        "is_pregnant": p.is_pregnant,
        "is_lactating": p.is_lactating,
        "ashtavidha": {
            "nadi": pariksha.nadi if pariksha else None,
            "mutra": pariksha.mutra if pariksha else None,
            "mala": pariksha.mala if pariksha else None,
            "jihwa": pariksha.jihwa if pariksha else None,
            "shabda": pariksha.shabda if pariksha else None,
            "sparsha": pariksha.sparsha if pariksha else None,
            "druk": pariksha.druk if pariksha else None,
            "akruti": pariksha.akruti if pariksha else None,
            "notes": pariksha.notes if pariksha else None,
        } if pariksha else None,
        "consultations_count": len(consultations)
    }


@router.post("/")
def create_patient(data: PatientCreateIn, db: Session = Depends(get_db)):
    """Register a new patient with optional baseline Ashtavidha Pariksha."""
    p = Patient(
        full_name=data.full_name,
        age=data.age,
        gender=data.gender,
        contact=data.contact,
        prakriti=data.prakriti,
        agni=data.agni,
        koshtha=data.koshtha,
        bala=data.bala,
        current_season=data.current_season,
        is_pregnant=data.is_pregnant,
        is_lactating=data.is_lactating
    )
    db.add(p)
    db.commit()
    db.refresh(p)

    if data.ashtavidha:
        ap = AshtavidhaPariksha(
            patient_id=p.id,
            nadi=data.ashtavidha.nadi,
            mutra=data.ashtavidha.mutra,
            mala=data.ashtavidha.mala,
            jihwa=data.ashtavidha.jihwa,
            shabda=data.ashtavidha.shabda,
            sparsha=data.ashtavidha.sparsha,
            druk=data.ashtavidha.druk,
            akruti=data.ashtavidha.akruti,
            notes=data.ashtavidha.notes
        )
        db.add(ap)
        db.commit()

    return {"status": "success", "patient_id": p.id, "full_name": p.full_name}

