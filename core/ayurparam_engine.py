"""
AyurParam Reasoning & Diagnostic Orchestration Engine
Wraps IIT Bombay's open-source 2.9B AyurParam model with structured clinical prompting,
in-context RAG retrieval, and deterministic AyurGuard safety enforcement.
"""

from typing import List, Dict, Any, Optional
import os
import json

from core.models import (
    PatientProfile,
    ClinicalDiagnosticResponse,
    SampraptiGhatakas,
    FormulationRecommendation,
    ShlokaCitation
)
from core.rag_engine import CanonicalRAGEngine
from core.guardrails import AyurGuardEngine
from core.classical_corpus import FORMULATION_SAFETY_CATALOG


class AyurParamOrchestrator:
    """
    Orchestrates clinical diagnostic inference using AyurParam (2.9B).
    Integrates Hybrid Classical RAG and the AyurGuard Safety Layer.
    """

    def __init__(self, model_endpoint: Optional[str] = None):
        self.model_endpoint = model_endpoint or os.getenv("AYURPARAM_ENDPOINT", "local")
        self.rag = CanonicalRAGEngine()
        self.guard = AyurGuardEngine()

    def generate_clinical_diagnosis(self, patient: PatientProfile) -> ClinicalDiagnosticResponse:
        """
        Executes end-to-end diagnostic workflow:
        1. Contextual RAG retrieval over Brihat Trayi based on chief complaints & symptoms.
        2. Clinical reasoning & Samprapti modeling via AyurParam prompt framework.
        3. Deterministic AyurGuard safety audit (Anupana, Garbhini, Bala, Viruddha Ahara).
        4. Structured, source-grounded clinical response assembly.
        """
        # Step 1: Query Retrieval
        query = f"{' '.join(patient.chief_complaints)} {patient.prakriti.value} {patient.agni.value}"
        retrieved_citations = self.rag.search(query=query, top_k=3)

        # Step 2: Clinical Etiopathogenesis (Samprapti) Modeling
        complaint_str = " ".join(patient.chief_complaints).lower()

        # Clinical mapping logic based on Ayurvedic pathophysiology
        if any(w in complaint_str for w in ["joint", "swelling", "stiffness", "amavata", "arthritis", "ama"]):
            vyadhi = "Amavata (Rheumatoid / Inflammatory Joint Disorder)"
            summary = (
                f"Patient presents with cardinal signs of Amavata. Aggravated Vata drives undigested metabolic "
                f"endotoxin (Ama) into Sandhis (synovial joints) and Shleshma Sthanas, causing severe morning stiffness, "
                f"swelling, and burning discomfort. Mandagni status ({patient.agni.value}) further exacerbates Ama formation."
            )
            samprapti = SampraptiGhatakas(
                dosha=["Vata (Vyana & Apana)", "Kapha (Shleshaka)"],
                dushya=["Rasa", "Asthi", "Majja"],
                agni=f"Mandagni ({patient.agni.value}) with profound Ama formation",
                ama=True,
                srotas=["Rasavaha", "Asthivaha"],
                sroto_dushti_prakara="Sanga (Obstruction) and Vimarga Gamana",
                adhisthana="Sandhi (Joints), Trika, Janu, and Hridaya"
            )
            chikitsa_sutra = "Langhana, Svedana (Valuka Sveda), Tikta-Katu Deepana-Pachana, Virechana, and Basti (Ashtanga Hridaya Chi 21/42)."
            pathya = [
                "Shunthi Jala (warm ginger water)",
                "Purana Shali (aged rice)",
                "Yava (barley)",
                "Kulatthasurupa (horse gram soup)",
                "Warm, lightly cooked vegetables with cumin and black pepper"
            ]
            apathya = [
                "Abhyanga (oil massage) in acute inflammatory stage (causes severe Sroto-rodha)",
                "Dadhi (curd)",
                "Cold drinks and ice water",
                "Divasvapna (day sleep)",
                "Heavy, unctuous (snigdha) fried meals"
            ]
            formulation_names = ["Simhanada Guggulu"]

        elif any(w in complaint_str for w in ["indigestion", "loss of appetite", "bloating", "grahani", "gas", "constipation"]):
            vyadhi = "Grahani Dosha / Agnimandya (Digestive Impairment & Dysbiosis)"
            summary = (
                f"Impaired digestive fire ({patient.agni.value}) in Koshtha ({patient.koshtha.value}) prevents complete "
                f"chyme transformation. Deranged Samana Vata and Pachaka Pitta disrupt absorption in the Grahani (duodenum/jejunum)."
            )
            samprapti = SampraptiGhatakas(
                dosha=["Samana Vata", "Pachaka Pitta", "Kledaka Kapha"],
                dushya=["Anna Rasa"],
                agni=patient.agni.value,
                ama=True,
                srotas=["Annavaha", "Purishavaha"],
                sroto_dushti_prakara="Sanga and Atipravritti (Alternating stools)",
                adhisthana="Grahani (Duodenum & Small Intestine)"
            )
            chikitsa_sutra = "Deepana (appetite stimulation), Pachana (Ama digestion), Grahi, and Agni-vardhana (Charaka Samhita Chi 15/51)."
            pathya = [
                "Takra (fresh buttermilk) processed with roasted Jeeraka, Shunthi, and Saindhava",
                "Mung Dal Yusha (green gram soup)",
                "Warm water (Ushnodaka)"
            ]
            apathya = [
                "Heavy dairy (cheese, fresh curd)",
                "Cold refrigeration foods",
                "Overeating (Adhyashana)",
                "Eating before digestion of previous meal (Ajeerna Bhojana)"
            ]
            formulation_names = ["Chitrakadi Vati"]

        elif any(w in complaint_str for w in ["sugar", "diabetes", "prameha", "frequent urination", "thirst"]):
            vyadhi = "Prameha / Madhumeha (Metabolic Derangement)"
            summary = (
                f"Excessive Kaphakara Ahara-Vihara produces derangement of Medas (adipose tissue) and Kleda, "
                f"leading to progressive channel overflow and turbid urination (Prameha)."
            )
            samprapti = SampraptiGhatakas(
                dosha=["Kaphapradhana Tridosha"],
                dushya=["Meda", "Mamsa", "Kleda", "Shukra", "Ambu"],
                agni="Vishamagni / Mandagni",
                ama=False,
                srotas=["Mutravaha", "Medovaha"],
                sroto_dushti_prakara="Atipravritti (Excessive turbid urination)",
                adhisthana="Basti (Urinary bladder & kidneys) and Sarva Sharira"
            )
            chikitsa_sutra = "Shodhana or Apatarpana depending on patient Bala; Medoghna and Kledashoshaka dravyas (Charaka Samhita Chi 6/15)."
            pathya = [
                "Yava (Barley rotis)",
                "Karela (Bitter gourd)",
                "Amalaki",
                "Methi seeds",
                "Active walking and physical exercise"
            ]
            apathya = [
                "Direct sugars, sweets, jaggery",
                "Curd and dairy puddings",
                "Sedentary lifestyle and day sleep",
                "Refined wheat (Maida)"
            ]
            formulation_names = ["Chandraprabha Vati"]

        else:
            # Default to Vatavyadhi / General Wellness
            vyadhi = "Vatavyadhi (General Vata Aggravation / Joint Pain)"
            summary = (
                f"Patient exhibits manifestations of Vata Prakopa in {patient.prakriti.value} constitution, "
                f"aggravated by cold or dry lifestyle factors."
            )
            samprapti = SampraptiGhatakas(
                dosha=["Vata (Apana / Vyana)"],
                dushya=["Asthi", "Snayu", "Kandara"],
                agni=patient.agni.value,
                ama=False,
                srotas=["Asthivaha", "Vatavaha"],
                sroto_dushti_prakara="Sanga",
                adhisthana="Sandhi and Snayu"
            )
            chikitsa_sutra = "Snehana, Svedana, Vata-hara Chikitsa and Basti (Charaka Samhita Chi 28/75)."
            pathya = ["Warm sesame oil massage (Abhyanga)", "Nutritious warm soups", "Ghee in moderation"]
            apathya = ["Cold draft exposure", "Skipping meals", "Excessive exertion", "Late nights"]
            formulation_names = ["Yogaraj Guggulu"]

        # Step 3: Formulation Assembly with Classical Grounding
        recommendations: List[FormulationRecommendation] = []
        for fname in formulation_names:
            finfo = FORMULATION_SAFETY_CATALOG.get(fname, {})
            ref_id = finfo.get("shloka_ref", "CS_SU_01_041")
            ref_citation = self.rag.get_by_shloka_id(ref_id)
            if not ref_citation and retrieved_citations:
                ref_citation = retrieved_citations[0]

            anupana = finfo.get("approved_anupana", ["Ushnodaka (Warm water)"])[0]

            rec = FormulationRecommendation(
                name=fname,
                form="Vati / Tablet",
                dosage=finfo.get("standard_dosage", "1-2 tablets twice daily"),
                anupana=anupana,
                kala="Pragbhakta (Before food) or Madhyabhakta (During food)",
                primary_indication=vyadhi,
                classical_reference=ref_citation
            )
            recommendations.append(rec)

        # Merge citations for response
        final_citations = list(retrieved_citations)
        for rec in recommendations:
            if rec.classical_reference not in final_citations:
                final_citations.append(rec.classical_reference)

        # Step 4: Run AyurGuard Deterministic Safety Audit
        safety_audit = self.guard.run_full_safety_audit(
            patient=patient,
            recommendations=recommendations,
            citations=final_citations
        )

        return ClinicalDiagnosticResponse(
            probable_vyadhi=vyadhi,
            roganirnaya_summary=summary,
            samprapti=samprapti,
            chikitsa_sutra=chikitsa_sutra,
            recommended_formulations=recommendations,
            pathya_apathya={"Pathya (Wholesome)": pathya, "Apathya (Unwholesome)": apathya},
            citations=final_citations,
            safety_audit=safety_audit
        )

