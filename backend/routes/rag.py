"""
AyuVaidya: Canonical Brihat Trayi RAG Routes
"""

from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from core.rag_engine import CanonicalRAGEngine
from core.models import ShlokaCitation
from core.classical_corpus import CANONICAL_SHLOKAS

router = APIRouter(prefix="/rag", tags=["Brihat Trayi RAG"])

rag_engine = CanonicalRAGEngine()


@router.get("/search", response_model=List[ShlokaCitation])
def search_treatises(
    q: str = Query(..., description="Query in English, Sanskrit (IAST), or Devanagari"),
    treatise: Optional[str] = Query(None, description="Charaka Samhita, Sushruta Samhita, or Ashtanga Hridaya"),
    top_k: int = Query(4, ge=1, le=10)
):
    """
    Executes hybrid sparse-dense retrieval over canonical Brihat Trayi verses.
    """
    return rag_engine.search(query=q, treatise_filter=treatise, top_k=top_k)


@router.get("/shloka/{shloka_id}")
def get_shloka(shloka_id: str):
    """
    Fetches exact verified verse by primary ID.
    """
    citation = rag_engine.get_by_shloka_id(shloka_id)
    if not citation:
        raise HTTPException(status_code=404, detail=f"Shloka ID '{shloka_id}' not found in canonical index")
    return citation


@router.get("/corpus-stats")
def get_corpus_stats():
    """
    Returns corpus composition across Brihat Trayi.
    """
    treatises = {}
    for s in CANONICAL_SHLOKAS:
        t = s["treatise"]
        treatises[t] = treatises.get(t, 0) + 1

    return {
        "total_verses": len(CANONICAL_SHLOKAS),
        "treatises": treatises,
        "supported_scripts": ["Devanagari", "IAST Romanization", "English", "Hindi"],
        "source_grounding_level": "Granular Shloka ID"
    }

