"""
AyuVaidya: AyurGuard Deterministic Clinical Safety Routes
"""

from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from core.guardrails import AyurGuardEngine, VIRUDDHA_AHARA_RULES
from core.classical_corpus import FORMULATION_SAFETY_CATALOG
from core.models import PatientProfile, DoshaType, AgniStatus, KoshthaType

router = APIRouter(prefix="/safety", tags=["AyurGuard Safety Firewall"])

guard = AyurGuardEngine()


class SafetyVerifyIn(BaseModel):
    formulation_name: str
    prescribed_anupana: str
    age: int = 35
    gender: str = "Female"
    is_pregnant: bool = False
    is_lactating: bool = False
    season: str = "Hemanta"


@router.post("/verify")
def verify_prescription_safety(data: SafetyVerifyIn):
    """
    Evaluates drug safety, Anupana compatibility, and demographic contraindications.
    """
    patient = PatientProfile(
        age=data.age,
        gender=data.gender,
        is_pregnant=data.is_pregnant,
        is_lactating=data.is_lactating,
        prakriti=DoshaType.VATA_PITTA,
        agni=AgniStatus.MANDAGNI,
        koshtha=KoshthaType.MADHYAMA,
        chief_complaints=["Safety Audit"],
        current_season=data.season
    )

    is_safe, warnings, contra = guard.verify_formulation_safety(
        formulation_name=data.formulation_name,
        prescribed_anupana=data.prescribed_anupana,
        patient=patient
    )

    return {
        "formulation": data.formulation_name,
        "anupana_evaluated": data.prescribed_anupana,
        "is_safe": is_safe,
        "warnings": warnings,
        "contraindications": contra,
        "ayurguard_seal": "APPROVED" if is_safe else "REJECTED_CONTRAINDICATED",
        "disclaimer": "AYURGUARD DETERMINISTIC AUDIT: Non-probabilistic clinical validation."
    }


@router.get("/viruddha-ahara")
def list_viruddha_ahara():
    """
    Returns canonical incompatible food combinations from Charaka & Ashtanga Hridaya.
    """
    return {"count": len(VIRUDDHA_AHARA_RULES), "rules": VIRUDDHA_AHARA_RULES}


@router.get("/formulation-registry")
def list_formulation_safety_registry():
    """
    Lists formulations in the certified safety database with approved vehicles.
    """
    return {"catalog": FORMULATION_SAFETY_CATALOG}

