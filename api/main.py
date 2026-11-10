"""
AyurSetu: FastAPI Application Entrypoint
Exposes Clinical Diagnostic Reasoning, Canonical Brihat Trayi RAG, and AyurGuard Safety API.
"""

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os

from core.models import (
    PatientProfile,
    ClinicalDiagnosticResponse,
    ShlokaCitation,
    SafetyAuditResult
)
from core.ayurparam_engine import AyurParamOrchestrator
from core.rag_engine import CanonicalRAGEngine
from core.guardrails import AyurGuardEngine, VIRUDDHA_AHARA_RULES
from core.classical_corpus import CANONICAL_SHLOKAS, FORMULATION_SAFETY_CATALOG

app = FastAPI(
    title="AyurSetu - AyushTech AI Engine",
    description="Source-grounded, zero-hallucination Clinical Decision Support & Classical Retrieval System powered by AyurParam (2.9B).",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = AyurParamOrchestrator()
rag = CanonicalRAGEngine()
guard = AyurGuardEngine()


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AyurSetu Engine",
        "model": "AyurParam (2.9B Ayurveda LLM)",
        "indexed_shlokas": len(CANONICAL_SHLOKAS),
        "safety_guardrails": "Active (AyurGuard Deterministic Engine)"
    }


@app.post("/api/diagnose", response_model=ClinicalDiagnosticResponse)
def diagnose_patient(profile: PatientProfile):
    """
    Primary clinical endpoint:
    Performs full Ayurvedic Roganirnaya, Samprapti modeling, classical Brihat Trayi grounding,
    and AyurGuard safety & contraindication verification.
    """
    try:
        response = orchestrator.generate_clinical_diagnosis(profile)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnostic reasoning failed: {str(e)}")


@app.get("/api/search", response_model=List[ShlokaCitation])
def search_classical_texts(
    q: str = Query(..., description="Query in English, Sanskrit (IAST), or Devanagari"),
    treatise: Optional[str] = Query(None, description="Filter: Charaka Samhita, Sushruta Samhita, or Ashtanga Hridaya"),
    top_k: int = Query(3, ge=1, le=10)
):
    """
    Direct RAG search across indexed Brihat Trayi treatises.
    """
    results = rag.search(query=q, treatise_filter=treatise, top_k=top_k)
    return results


@app.post("/api/verify-safety")
def verify_safety(
    formulation: str = Query(..., description="Name of formulation, e.g. Simhanada Guggulu"),
    anupana: str = Query(..., description="Intended vehicle, e.g. Warm water or Milk"),
    age: int = Query(35, ge=0, le=120),
    is_pregnant: bool = Query(False),
    season: str = Query("Hemanta")
):
    """
    Standalone AyurGuard verification endpoint for evaluating drug safety and Anupana compatibility.
    """
    dummy_patient = PatientProfile(
        age=age,
        gender="Not Specified",
        is_pregnant=is_pregnant,
        chief_complaints=["Check safety"],
        current_season=season
    )
    is_safe, warnings, contra = guard.verify_formulation_safety(
        formulation_name=formulation,
        prescribed_anupana=anupana,
        patient=dummy_patient
    )
    return {
        "formulation": formulation,
        "anupana_evaluated": anupana,
        "is_safe": is_safe,
        "warnings": warnings,
        "contraindications": contra,
        "disclaimer": "AYURGUARD CLINICAL AUDIT: Always cross-reference with BAMS/MD physician judgment."
    }


@app.get("/api/viruddha-ahara")
def get_viruddha_ahara_rules():
    """Returns canonical incompatible food combination rules."""
    return {"rules": VIRUDDHA_AHARA_RULES}


@app.get("/api/corpus")
def get_corpus():
    """Returns full catalog of indexed canonical shlokas with metadata."""
    return {"count": len(CANONICAL_SHLOKAS), "shlokas": CANONICAL_SHLOKAS}


# Embedded Interactive Dashboard UI
@app.get("/", response_class=HTMLResponse)
def serve_dashboard():
    with open(os.path.join(os.path.dirname(__file__), "..", "static", "index.html"), "r", encoding="utf-8") as f:
        return f.read()

