"""
AyuVaidya: Longitudinal Patient Recovery Tracker Routes
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from backend.database.connection import get_db
from backend.database.models import Patient, RecoveryLog

router = APIRouter(prefix="/tracker", tags=["Recovery Tracker"])


class RecoveryLogIn(BaseModel):
    symptom_severity_score: float  # 0.0 to 10.0
    agni_rating: float             # 1.0 to 5.0
    dosha_balance_score: float     # 1.0 to 10.0
    clinical_notes: Optional[str] = None


@router.get("/{patient_id}")
@router.get("/patient/{patient_id}")
def get_patient_recovery_history(patient_id: int, db: Session = Depends(get_db)):
    """
    Returns time-series logs for Recharts visualization of clinical progress.
    """
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")

    logs = db.query(RecoveryLog).filter(RecoveryLog.patient_id == patient_id).order_by(RecoveryLog.log_date.asc()).all()

    timeline = []
    for l in logs:
        timeline.append({
            "id": l.id,
            "date": l.log_date.strftime("%d %b"),
            "severity": l.symptom_severity_score,
            "agni": l.agni_rating,
            "dosha_balance": l.dosha_balance_score,
            "notes": l.clinical_notes
        })

    return {
        "patient_id": p.id,
        "patient_name": p.full_name,
        "total_checkins": len(logs),
        "timeline": timeline
    }


@router.post("/{patient_id}")
@router.post("/patient/{patient_id}")
@router.post("/patient/{patient_id}/log")
def add_recovery_log(patient_id: int, data: RecoveryLogIn, db: Session = Depends(get_db)):
    """
    Records a follow-up consultation recovery assessment.
    """
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")

    log = RecoveryLog(
        patient_id=p.id,
        symptom_severity_score=data.symptom_severity_score,
        agni_rating=data.agni_rating,
        dosha_balance_score=data.dosha_balance_score,
        clinical_notes=data.clinical_notes
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    return {"status": "success", "log_id": log.id, "recorded_at": log.log_date.isoformat()}

