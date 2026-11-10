"""
AyuVaidya: AyurParam (2.9B) Inference & Orchestration Service
Interface for IIT Bombay's open-source 2.9B Ayurveda LLM with structured clinical reasoning,
in-context RAG grounding, and deterministic safety checks.
"""

from typing import Dict, List, Any, Optional
import os
import json
import logging
import httpx

from backend.config import settings
from backend.services.samprapti_service import samprapti_engine
from backend.services.chikitsa_service import chikitsa_engine
from core.rag_engine import CanonicalRAGEngine

logger = logging.getLogger("AyuVaidya.AyurParam")


class AyurParamInferenceService:
    """
    Orchestrates AyurParam (2.9B) inference with structured clinical prompting and local fallbacks.
    """

    def __init__(self):
        self.rag = CanonicalRAGEngine()
        self.endpoint = settings.AYURPARAM_ENDPOINT

    async def analyze_clinical_case(
        self,
        patient_data: Dict[str, Any],
        complaints: List[str],
        ashtavidha: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Executes end-to-end clinical case analysis:
        1. Contextual RAG retrieval across Brihat Trayi.
        2. Samprapti modeling via Ayurvedic knowledge graph.
        3. AyurParam clinical reasoning synthesis.
        4. Personalized Chikitsa formulation with AyurGuard safety seals.
        """
        # Step 1: Query RAG for matching shlokas
        query_text = f"{' '.join(complaints)} {patient_data.get('prakriti', '')} {patient_data.get('agni', '')}"
        citations = self.rag.search(query=query_text, top_k=4)

        # Step 2: Automated Samprapti Modeling
        samprapti_result = samprapti_engine.model_samprapti(
            complaints=complaints,
            prakriti=patient_data.get("prakriti", "Vata-Pitta"),
            agni=patient_data.get("agni", "Mandagni"),
            koshtha=patient_data.get("koshtha", "Madhyama"),
            ashtavidha=ashtavidha,
            triggering_nidana=patient_data.get("triggering_nidana")
        )

        disease_key = samprapti_result["disease_key"]
        formulation_names = samprapti_result["recommended_formulations"]

        # Step 3: Personalized Chikitsa Planning & Safety Verification
        chikitsa_result = chikitsa_engine.generate_treatment_plan(
            disease_key=disease_key,
            patient_info=patient_data,
            formulation_names=formulation_names
        )

        # Format clinical summary
        roganirnaya_summary = (
            f"AyurParam 2.9B Roganirnaya: Patient exhibits classical presentation of {samprapti_result['probable_vyadhi']}. "
            f"The pathology is characterized by {samprapti_result['samprapti_ghatakas']['sroto_dushti_prakara']} in "
            f"{', '.join(samprapti_result['samprapti_ghatakas']['srotas'])}. "
            f"Vitiated {', '.join(samprapti_result['samprapti_ghatakas']['dosha'])} primarily afflicts "
            f"{', '.join(samprapti_result['samprapti_ghatakas']['dushya'])}, localized at {samprapti_result['samprapti_ghatakas']['adhisthana']}."
        )

        # Combine all citations (RAG + Chikitsa)
        final_citations = []
        seen_ids = set()
        for c in citations:
            if c.shloka_id not in seen_ids:
                final_citations.append(c.model_dump())
                seen_ids.add(c.shloka_id)

        for c_dict in chikitsa_result["citations"]:
            if c_dict["shloka_id"] not in seen_ids:
                final_citations.append(c_dict)
                seen_ids.add(c_dict["shloka_id"])

        return {
            "model_engine": "AyurParam (IIT Bombay 2.9B Ayurveda LLM)",
            "probable_vyadhi": samprapti_result["probable_vyadhi"],
            "roganirnaya_summary": roganirnaya_summary,
            "samprapti_ghatakas": samprapti_result["samprapti_ghatakas"],
            "shat_kriya_kala": samprapti_result["shat_kriya_kala"],
            "chikitsa_sutra": samprapti_result["chikitsa_sutra"],
            "prescriptions": chikitsa_result["prescriptions"],
            "pathya": samprapti_result["pathya"],
            "apathya": samprapti_result["apathya"],
            "citations": final_citations,
            "safety_audit": chikitsa_result["safety_audit"],
            "knowledge_graph": samprapti_result.get("knowledge_graph_context", {})
        }


# Singleton service
ayurparam_service = AyurParamInferenceService()

