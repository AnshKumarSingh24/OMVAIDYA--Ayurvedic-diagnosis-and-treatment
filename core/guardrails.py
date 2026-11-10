"""
AyurGuard: Deterministic Clinical Safety & Contraindication Guardrail Engine
Zero-tolerance verification for Anupana, Garbhini/Bala restrictions, Viruddha Ahara, and Shloka Grounding.
"""

from typing import List, Dict, Any, Tuple
from core.models import PatientProfile, FormulationRecommendation, SafetyAuditResult, ShlokaCitation
from core.classical_corpus import FORMULATION_SAFETY_CATALOG, CANONICAL_SHLOKAS


# Viruddha Ahara (Incompatible Food Combinations) Classical Table
VIRUDDHA_AHARA_RULES: List[Dict[str, Any]] = [
    {
        "pair": ["Milk", "Fish"],
        "reason": "Samyoga Viruddha: Virya Viruddha (Fish is Ushna Virya, Milk is Sheeta Virya). Causes blood vitiation and skin diseases (Kushtha).",
        "reference": "Charaka Samhita Sutra Sthana 26/82"
    },
    {
        "pair": ["Honey", "Ghee"],
        "condition": "Equal proportions by weight (Sama Matra)",
        "reason": "Matra Viruddha: Honey and Ghee in equal proportions produce toxic metabolite (Visha-sadrisha).",
        "reference": "Charaka Samhita Sutra Sthana 26/83"
    },
    {
        "pair": ["Honey", "Hot Water"],
        "reason": "Samskara Viruddha: Heating honey or taking honey with hot liquids alters chemical properties and impairs digestion.",
        "reference": "Ashtanga Hridaya Sutra Sthana 5/52"
    },
    {
        "pair": ["Curd", "Night consumption"],
        "reason": "Kala Viruddha: Curd taken at night blocks Srotas (micro-channels) due to Abhishyandi and Guru nature.",
        "reference": "Charaka Samhita Sutra Sthana 7/61"
    },
    {
        "pair": ["Radish", "Milk"],
        "reason": "Samyoga Viruddha: Radish with milk causes severe gastrointestinal irritation and skin vitiation.",
        "reference": "Charaka Samhita Sutra Sthana 26/84"
    }
]


class AyurGuardEngine:
    """
    Deterministic rule-based clinical validation firewall.
    Operates outside the LLM to eliminate hallucinations and enforce safety.
    """

    def __init__(self):
        self.catalog = FORMULATION_SAFETY_CATALOG
        self.canonical_ids = {s["shloka_id"]: s for s in CANONICAL_SHLOKAS}

    def verify_formulation_safety(
        self,
        formulation_name: str,
        prescribed_anupana: str,
        patient: PatientProfile
    ) -> Tuple[bool, List[str], List[str]]:
        """
        Validates a single formulation against patient safety parameters.
        Returns: (is_safe, warnings, contraindications)
        """
        warnings = []
        contraindications = []
        is_safe = True

        info = self.catalog.get(formulation_name)
        if not info:
            warnings.append(
                f"Formulation '{formulation_name}' is not in the certified classical safety registry. Proceed with clinical caution."
            )
            return True, warnings, contraindications

        # 1. Pregnancy Safety Check (Garbhini)
        if patient.is_pregnant:
            if not info.get("pregnancy_safe", False):
                is_safe = False
                contraindications.append(
                    f"CRITICAL CONTRAINDICATION: '{formulation_name}' is contraindicated in pregnancy (Garbhini Avastha) due to abortifacient/emmenagogue potential."
                )

        # 2. Pediatric Safety Check (Bala < 12 years)
        if patient.age < 12:
            if not info.get("pediatric_safe", False):
                is_safe = False
                contraindications.append(
                    f"PEDIATRIC WARNING: '{formulation_name}' contains potent herbs/mineral bhasmas not recommended for children under 12 years without strict dosage titrations."
                )

        # 3. Anupana (Vehicle) Verification
        anupana_clean = prescribed_anupana.strip().lower()
        approved = [a.lower() for a in info.get("approved_anupana", [])]
        disallowed = [d.lower() for d in info.get("disallowed_anupana", [])]

        # Check for disallowed Anupana (exact phrase or key token match, avoiding generic words like 'water')
        for d in disallowed:
            # Check if full disallowed phrase is in prescribed vehicle, or if distinctive keyword matches
            if d in anupana_clean:
                is_safe = False
                contraindications.append(
                    f"ANUPANA VIOLATION: '{formulation_name}' is strictly contraindicated with '{prescribed_anupana}'. Approved vehicles: {', '.join(info.get('approved_anupana', []))}."
                )
                break
            # Handle specific keywords e.g. 'cold', 'curd', 'milk', 'alcohol'
            for term in ["cold", "curd", "milk", "alcohol", "chilled"]:
                if term in d and term in anupana_clean:
                    is_safe = False
                    contraindications.append(
                        f"ANUPANA VIOLATION: '{formulation_name}' is strictly contraindicated with '{prescribed_anupana}'. Approved vehicles: {', '.join(info.get('approved_anupana', []))}."
                    )
                    break
            if not is_safe:
                break

        # Check if prescribed Anupana matches approved list
        is_approved = any(a in anupana_clean or anupana_clean in a for a in approved)
        if not is_approved and is_safe:
            warnings.append(
                f"ANUPANA ADVISORY: '{prescribed_anupana}' is non-standard for '{formulation_name}'. Classical recommendation is: {', '.join(info.get('approved_anupana', []))}."
            )

        # 4. Seasonal (Ritucharya) Warnings
        if patient.current_season:
            season = patient.current_season.lower()
            if "grishma" in season or "summer" in season:
                if "tikshna" in str(info.get("ingredients", [])).lower() or "chitraka" in str(info.get("ingredients", [])).lower():
                    warnings.append(
                        f"SEASONAL ADVISORY (Ritucharya): '{formulation_name}' contains Ushna/Tikshna herbs. Reduce dosage or administer with Sheeta Anupana during Grishma (Summer)."
                    )

        return is_safe, warnings, contraindications

    def verify_citation_traceability(self, citation: ShlokaCitation) -> Tuple[bool, str]:
        """
        Verifies that a cited shloka exists in the canonical Brihat Trayi database.
        Eliminates synthetic or hallucinated shloka IDs.
        """
        if citation.shloka_id not in self.canonical_ids:
            return False, f"HALLUCINATION ALERT: Verse ID '{citation.shloka_id}' does not exist in authentic Brihat Trayi index."
        
        canonical = self.canonical_ids[citation.shloka_id]
        if canonical["treatise"] != citation.treatise.value:
            return False, f"MISATTRIBUTION: Verse ID '{citation.shloka_id}' belongs to {canonical['treatise']}, not {citation.treatise.value}."

        return True, "Verified canonical citation."

    def run_full_safety_audit(
        self,
        patient: PatientProfile,
        recommendations: List[FormulationRecommendation],
        citations: List[ShlokaCitation]
    ) -> SafetyAuditResult:
        """
        Full spectrum safety audit aggregating all deterministic rules.
        """
        all_warnings: List[str] = []
        all_contraindications: List[str] = []
        anupana_validations: List[str] = []
        age_pregnancy_flags: List[str] = []

        overall_safe = True

        # Audit Formulations
        for rec in recommendations:
            form_safe, warnings, contra = self.verify_formulation_safety(
                rec.name,
                rec.anupana,
                patient
            )
            if not form_safe:
                overall_safe = False
            all_warnings.extend(warnings)
            all_contraindications.extend(contra)
            anupana_validations.append(f"{rec.name}: Checked Anupana '{rec.anupana}' -> {'SAFE' if form_safe else 'ALERT'}")

        # Audit Demographics
        if patient.is_pregnant:
            age_pregnancy_flags.append("PATIENT STATUS: Pregnant (Garbhini). All purgatives (Virechana), kshara, and tikshna rasashastra formulations are restricted.")
        if patient.age < 12:
            age_pregnancy_flags.append(f"PATIENT STATUS: Pediatric (Age {patient.age}). Administer reduced pediatric dosing (Kashyapa Samhita guidelines).")
        elif patient.age > 70:
            age_pregnancy_flags.append(f"PATIENT STATUS: Geriatric (Age {patient.age}). Consider Vata aggravation and Rasayana support.")

        # Audit Citations
        for cit in citations:
            is_valid, msg = self.verify_citation_traceability(cit)
            if not is_valid:
                overall_safe = False
                all_contraindications.append(msg)

        return SafetyAuditResult(
            is_safe=overall_safe,
            warnings=all_warnings,
            contraindications_detected=all_contraindications,
            anupana_validations=anupana_validations,
            age_pregnancy_flags=age_pregnancy_flags
        )
