"""
AyuVaidya: Knowledge Graph Routes
"""

from fastapi import APIRouter, Query
from typing import Optional, Dict, Any
from backend.knowledge_graph.ayur_graph import ayur_kg

router = APIRouter(prefix="/graph", tags=["Ayurvedic Knowledge Graph"])


@router.get("/subgraph")
def get_subgraph(
    center: Optional[str] = Query(None, description="Center node (e.g. Amavata, Vata, Guggulu)"),
    depth: int = Query(1, ge=1, le=3)
):
    """
    Returns node-link data formatted for interactive visualizers.
    """
    return ayur_kg.export_subgraph(center_node=center, depth=depth)


@router.get("/samprapti/{disease_id}")
def trace_disease_samprapti(disease_id: str):
    """
    Traces etiopathogenesis network: Dosha -> Dhatu -> Srotas -> Disease -> Treatment.
    """
    return ayur_kg.trace_samprapti(disease_id)

