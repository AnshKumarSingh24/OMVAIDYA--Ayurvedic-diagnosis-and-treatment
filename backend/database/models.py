"""
AyuVaidya: Database ORM Models
Defines persistent entities for Patients, Ashtavidha Pariksha, Consultations,
Classical Brihat Trayi Verses, and Recovery Logs.
"""

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from backend.database.connection import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    contact = Column(String(50), nullable=True)
    
    # Ayurvedic Constitutional Parameters
    prakriti = Column(String(50), default="Vata-Pitta")
    agni = Column(String(100), default="Mandagni (Sluggish)")
    koshtha = Column(String(50), default="Madhyama (Moderate)")
    bala = Column(String(50), default="Madhyama (Moderate Strength)")
    current_season = Column(String(50), default="Hemanta (Early Winter)")
    
    # Vulnerable Status
    is_pregnant = Column(Boolean, default=False)
    is_lactating = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    consultations = relationship("Consultation", back_populates="patient", cascade="all, delete-orphan")
    ashtavidha_parikshas = relationship("AshtavidhaPariksha", back_populates="patient", cascade="all, delete-orphan")
    recovery_logs = relationship("RecoveryLog", back_populates="patient", cascade="all, delete-orphan")


class AshtavidhaPariksha(Base):
    __tablename__ = "ashtavidha_parikshas"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    
    nadi = Column(String(100), nullable=True)     # Pulse assessment (Vata/Pitta/Kapha gati)
    mutra = Column(String(100), nullable=True)    # Urine assessment
    mala = Column(String(100), nullable=True)     # Stool & Ama assessment
    jihwa = Column(String(100), nullable=True)    # Tongue coating & color
    shabda = Column(String(100), nullable=True)   # Speech & voice
    sparsha = Column(String(100), nullable=True)  # Skin touch & temperature
    druk = Column(String(100), nullable=True)     # Eyes & vision
    akruti = Column(String(100), nullable=True)   # Body frame & build
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="ashtavidha_parikshas")


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    
    # Clinical Intake
    chief_complaints = Column(Text, nullable=False)  # JSON or newline-separated
    duration = Column(String(100), nullable=True)
    triggering_nidana = Column(Text, nullable=True)
    
    # AyurParam AI Reasoning & Diagnosis
    probable_vyadhi = Column(String(150), nullable=False)
    roganirnaya_summary = Column(Text, nullable=False)
    
    # Structured Samprapti Ghatakas (JSON string)
    samprapti_json = Column(Text, nullable=False)
    
    # Classical Chikitsa Planning
    chikitsa_sutra = Column(Text, nullable=False)
    formulations_json = Column(Text, nullable=False)
    pathya_json = Column(Text, nullable=True)
    apathya_json = Column(Text, nullable=True)
    
    # Source Grounding & AyurGuard Audit
    citations_json = Column(Text, nullable=False)
    safety_audit_json = Column(Text, nullable=False)
    
    status = Column(String(50), default="Active")
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="consultations")
    recovery_logs = relationship("RecoveryLog", back_populates="consultation", cascade="all, delete-orphan")


class RecoveryLog(Base):
    __tablename__ = "recovery_logs"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    consultation_id = Column(Integer, ForeignKey("consultations.id"), nullable=True)
    
    log_date = Column(DateTime, default=datetime.utcnow)
    symptom_severity_score = Column(Float, default=5.0)  # 0 (None) to 10 (Severe)
    agni_rating = Column(Float, default=3.0)             # 1 (Poor) to 5 (Optimal)
    dosha_balance_score = Column(Float, default=6.0)     # 1 (Critical Imbalance) to 10 (Samyata)
    clinical_notes = Column(Text, nullable=True)

    patient = relationship("Patient", back_populates="recovery_logs")
    consultation = relationship("Consultation", back_populates="recovery_logs")


class ClassicalVerse(Base):
    __tablename__ = "classical_verses"

    id = Column(Integer, primary_key=True, index=True)
    shloka_id = Column(String(50), unique=True, index=True, nullable=False)
    treatise = Column(String(100), nullable=False)
    sthana = Column(String(100), nullable=False)
    adhyaya = Column(String(150), nullable=False)
    shloka_number = Column(String(50), nullable=False)
    
    sanskrit_devanagari = Column(Text, nullable=False)
    sanskrit_iast = Column(Text, nullable=False)
    english_translation = Column(Text, nullable=False)
    hindi_translation = Column(Text, nullable=True)
    
    dosha_association = Column(String(150), nullable=True)
    indications = Column(Text, nullable=True)      # JSON list
    formulations = Column(Text, nullable=True)     # JSON list
    contraindications = Column(Text, nullable=True)# JSON list
    keywords = Column(Text, nullable=True)

