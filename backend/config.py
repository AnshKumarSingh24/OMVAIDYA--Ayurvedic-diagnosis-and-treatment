"""
AyuVaidya: Configuration & Settings
Configures the core Ayurvedic Clinical AI engine, AyurParam (2.9B), database, and RAG pipelines.
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "AyuVaidya"
    PROJECT_TITLE: str = "AyuVaidya — Source-Grounded Ayurvedic Clinical Intelligence"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ayuvaidya.db")

    # AyurParam LLM Engine (IIT Bombay Open-Source 2.9B Model)
    AYURPARAM_MODEL_ID: str = os.getenv("AYURPARAM_MODEL_ID", "iitbombay/ayurparam-2.9b")
    AYURPARAM_ENDPOINT: str = os.getenv("AYURPARAM_ENDPOINT", "local")
    AYURPARAM_MAX_TOKENS: int = 1500
    AYURPARAM_TEMPERATURE: float = 0.2  # Low temperature for deterministic medical reasoning

    # Hybrid RAG & Knowledge Graph
    RAG_TOP_K: int = 4
    RAG_SIMILARITY_THRESHOLD: float = 0.65
    ENABLE_KNOWLEDGE_GRAPH: bool = True

    # AyurGuard Safety
    ENFORCE_STRICT_ANUPANA: bool = True
    ENFORCE_GARBHINI_PROTECTION: bool = True
    ENFORCE_BALA_PROTECTION: bool = True

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

