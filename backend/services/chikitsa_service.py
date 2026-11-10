"""
AyuVaidya: Personalized Chikitsa (Treatment) Planning Service
Formulates classical prescriptions, dosage timing (Bheshaja Kala), approved Anupana,
and coordinates with AyurGuard for deterministic clinical safety.
"""

from typing import Dict, List, Any, Optional
from core.classical_corpus import FORMULATION_SAFETY_CATALOG
from core.rag_engine import CanonicalRAGEngine
from core.guardrails import AyurGuardEngine
from core.models import PatientProfile, DoshaType, AgniStatus, KoshthaType, ShlokaCitation


class ChikitsaPlanningService:
    """
    Personalized Ayurvedic therapeutics and formulation synthesis.
    """

    def __init__(self):
        self.rag = CanonicalRAGEngine()
        self.guard = AyurGuardEngine()

    def generate_treatment_plan(
        self,
        disease_key: str,
        patient_info: Dict[str, Any],
        formulation_names: List[str]
    ) -> Dict[str, Any]:
        """
        Builds complete treatment plan with dosage, vehicles, and AyurGuard safety audit.
        """
        age = patient_info.get("age", 35)
        is_pregnant = patient_info.get("is_pregnant", False)
        is_lactating = patient_info.get("is_lactating", False)
        current_season = patient_info.get("current_season", "Hemanta")

        # Create PatientProfile for AyurGuard verification
        p_profile = PatientProfile(
            age=age,
            gender=patient_info.get("gender", "Female"),
            is_pregnant=is_pregnant,
            is_lactating=is_lactating,
            prakriti=DoshaType.VATA_PITTA,
            agni=AgniStatus.MANDAGNI,
            koshtha=KoshthaType.MADHYAMA,
            chief_complaints=[disease_key],
            current_season=current_season
        )

        prescriptions = []
        cited_shlokas: List[ShlokaCitation] = []

        for fname in formulation_names:
            info = FORMULATION_SAFETY_CATALOG.get(fname, {})
            ref_id = info.get("shloka_ref", "CS_SU_01_041")
            citation = self.rag.get_by_shloka_id(ref_id)
            if citation and citation not in cited_shlokas:
                cited_shlokas.append(citation)

            approved_anupana = info.get("approved_anupana", ["Ushnodaka (Warm water)"])
            chosen_anupana = approved_anupana[0] if approved_anupana else "Warm water"

            # Determine Bheshaja Kala based on disease
            if "Amavata" in disease_key or "Grahani" in disease_key:
                kala = "Madhyabhakta (During mid-meal) or Pragbhakta (Before food)"
            else:
                kala = "Adhobhakta (After food) twice daily"

            # Dosage titration for pediatric or geriatric
            base_dosage = info.get("standard_dosage", "1-2 tablets twice daily")
            if age < 12:
                dosage = "1/2 tablet (approx. 250mg) twice daily or Kashyapa pediatric guidelines"
            elif age > 70:
                dosage = "1 tablet (approx. 500mg) twice daily with light warm vehicle"
            else:
                dosage = base_dosage

            # Verify with AyurGuard
            is_safe, warnings, contra = self.guard.verify_formulation_safety(
                formulation_name=fname,
                prescribed_anupana=chosen_anupana,
                patient=p_profile
            )

            prescriptions.append({
                "name": fname,
                "dosage": dosage,
                "anupana": chosen_anupana,
                "kala": kala,
                "is_safe": is_safe,
                "warnings": warnings,
                "contraindications": contra,
                "ingredients": info.get("ingredients", []),
                "shloka_ref": ref_id,
                "citation": citation.model_dump() if citation else None
            })

        # Run complete AyurGuard safety audit
        overall_safe = all(p["is_safe"] for p in prescriptions)
        all_contra = [c for p in prescriptions for c in p["contraindications"]]
        all_warnings = [w for p in prescriptions for w in p["warnings"]]

        if is_pregnant:
            all_warnings.append("PATIENT STATUS: Pregnant (Garbhini). All purgatives (Virechana), kshara, and tikshna formulations are restricted.")

        return {
            "disease_key": disease_key,
            "prescriptions": prescriptions,
            "citations": [c.model_dump() for c in cited_shlokas],
            "safety_audit": {
                "is_safe": overall_safe,
                "contraindications": all_contra,
                "warnings": all_warnings,
                "disclaimer": "AYURGUARD CLINICAL SAFETY SEAL: This prescription must be supervised by an NCISM-registered BAMS/MD Vaidya."
            }
        }


# Singleton service
chikitsa_engine = ChikitsaPlanningService()

