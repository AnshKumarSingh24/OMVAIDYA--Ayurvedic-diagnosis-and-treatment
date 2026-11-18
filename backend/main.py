"""
AyuVaidya: Main FastAPI Application Entrypoint
National Open Ayurveda AI Challenge | Techfest, IIT Bombay & Ministry of Ayush
"""

import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from contextlib import asynccontextmanager
import os

from backend.config import settings
from backend.database.connection import engine, Base, SessionLocal
from backend.database.seed_data import seed_database
from backend.routes import (
    patients,
    consultation,
    cases,
    knowledge_graph,
    rag,
    safety,
    tracker
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables & seed database
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title=settings.PROJECT_TITLE,
    description="Source-grounded Ayurvedic Clinical Decision Support & Classical Knowledge Retrieval System powered by AyurParam (2.9B).",
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for Vite frontend (ports 5173, 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(patients.router, prefix=settings.API_PREFIX)
app.include_router(cases.router, prefix=settings.API_PREFIX)
app.include_router(consultation.router, prefix=settings.API_PREFIX)
app.include_router(knowledge_graph.router, prefix=settings.API_PREFIX)
app.include_router(rag.router, prefix=settings.API_PREFIX)
app.include_router(safety.router, prefix=settings.API_PREFIX)
app.include_router(tracker.router, prefix=settings.API_PREFIX)


@app.get("/api/health")
def health_status():
    return {
        "status": "online",
        "system": settings.PROJECT_TITLE,
        "version": settings.VERSION,
        "llm_engine": "AyurParam (IIT Bombay 2.9B Ayurveda LLM)",
        "grounding_layer": "Canonical Brihat Trayi (Charaka, Sushruta, Vagbhata)",
        "safety_firewall": "AyurGuard Deterministic Engine (Active)"
    }


# Static Frontend Serving (if built in frontend/dist)
frontend_dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}", response_class=HTMLResponse)
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "api":
            raise HTTPException(status_code=404, detail="API route not found")
        index_file = os.path.join(frontend_dist_path, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file, headers={"Cache-Control": "no-cache, no-store, must-revalidate"})
        return HTMLResponse("<h1>AyuVaidya Frontend Building...</h1>")
else:
    # Serve embedded static dashboard if dist not yet compiled
    static_file_path = os.path.join(os.path.dirname(__file__), "..", "static", "index.html")
    if os.path.exists(static_file_path):
        @app.get("/", response_class=HTMLResponse)
        def serve_embedded_dashboard():
            with open(static_file_path, "r", encoding="utf-8") as f:
                return f.read()
