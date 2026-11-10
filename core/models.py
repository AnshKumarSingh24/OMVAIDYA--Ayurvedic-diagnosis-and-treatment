"""
AyurSetu: Data Schemas and Clinical Models
Core definitions for Ayurvedic Clinical Diagnostic Modeling and Source Traceability.
"""

from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


class DoshaType(str, Enum):
    VATA = "Vata"
    PITTA = "Pitta"
    KAPHA = "Kapha"
    VATA_PITTA = "Vata-Pitta"
    PITTA_KAPHA = "Pitta-Kapha"
    VATA_KAPHA = "Vata-Kapha"
    TRIDOSHA = "Tridosha (Sannipata)"


class AgniStatus(str, Enum):
    SAMAGNI = "Samagni (Balanced)"
    VISHAMAGNI = "Vishamagni (Irregular / Vata dominant)"
    TIKSHNAGNI = "Tikshnagni (Hyperactive / Pitta dominant)"
    MANDAGNI = "Mandagni (Sluggish / Kapha dominant)"


class KoshthaType(str, Enum):
    MRIDU = "Mridu (Soft / Sensitive)"
    MADHYAMA = "Madhyama (Moderate)"
    KRURA = "Krura (Hard / Constipated)"


class ClassicalTreatise(str, Enum):
    CHARAKA_SAMHITA = "Charaka Samhita"
    SUSHRUTA_SAMHITA = "Sushruta Samhita"
    ASHTANGA_HRIDAYA = "Ashtanga Hridaya"


class ShlokaCitation(BaseModel):
    """Immutable classical treatise citation schema."""
    shloka_id: str = Field(..., description="Unique verse key, e.g. CS_CHI_01_024")
    treatise: ClassicalTreatise = Field(..., description="Canonical text name")
    sthana: str = Field(..., description="Sthana (Section), e.g. Sutra, Nidana, Chikitsa")
    adhyaya: str = Field(..., description="Adhyaya (Chapter) name or number")
    shloka_number: str = Field(..., description="Specific shloka number or range")
    sanskrit_devanagari: str = Field(..., description="Original Sanskrit verse in Devanagari")
    sanskrit_iast: str = Field(..., description="IAST Romanized Sanskrit transliteration")
    english_translation: str = Field(..., description="Verified clinical English translation")
    hindi_translation: Optional[str] = Field(None, description="Hindi translation")
    relevance_score: float = Field(default=1.0, description="Retrieval similarity score [0.0 - 1.0]")


class PatientProfile(BaseModel):
    """Clinical patient intake attributes."""
    age: int = Field(..., ge=0, le=120, description="Patient age in years")
    gender: str = Field(..., description="Male, Female, or Other")
    is_pregnant: bool = Field(default=False, description="Whether patient is currently pregnant (Garbhini)")
    is_lactating: bool = Field(default=False, description="Whether patient is lactating (Sutika)")
    prakriti: DoshaType = Field(default=DoshaType.VATA_PITTA, description="Baseline constitutional Prakriti")
    agni: AgniStatus = Field(default=AgniStatus.MANDAGNI, description="Digestive fire status")
    koshtha: KoshthaType = Field(default=KoshthaType.MADHYAMA, description="Bowel habit")
    chief_complaints: List[str] = Field(..., description="List of primary symptoms/complaints reported")
    duration: Optional[str] = Field(None, description="Duration of symptoms")
    current_season: Optional[str] = Field("Hemanta (Early Winter)", description="Current Ayurvedic Ritu")


class SampraptiGhatakas(BaseModel):
    """Ayurvedic Etiopathogenesis (Samprapti) components."""
    dosha: List[str] = Field(default_factory=list, description="Aggravated Doshas")
    dushya: List[str] = Field(default_factory=list, description="Affected tissues/elements (Rasa, Rakta, etc.)")
    agni: str = Field(..., description="State of Agni in pathology")
    ama: bool = Field(default=False, description="Presence of metabolic endotoxin (Ama)")
    srotas: List[str] = Field(default_factory=list, description="Affected microcirculatory channels")
    sroto_dushti_prakara: str = Field(..., description="Type of channel pathology (Sanga, Atipravritti, etc.)")
    adhisthana: str = Field(..., description="Site of manifestation")


class FormulationRecommendation(BaseModel):
    """Prescribed Ayurvedic formulation with clinical parameters."""
    name: str = Field(..., description="Classical or proprietary formulation name")
    form: str = Field(..., description="Dosage form: Churna, Vati, Kwatha, Asava, Taila, Ghrita")
    dosage: str = Field(..., description="Standard recommended adult/pediatric dosage")
    anupana: str = Field(..., description="Mandatory vehicle/adjuvant (e.g. Ushnodaka, Madhu, Ghrita)")
    kala: str = Field(..., description="Time of administration (Bheshaja Kala, e.g. Pragbhakta, Adhobhakta)")
    primary_indication: str = Field(..., description="Classical disease or symptom indication")
    classical_reference: ShlokaCitation = Field(..., description="Authenticated shloka backing this formulation")


class SafetyAuditResult(BaseModel):
    """Deterministic medical safety & contraindication verification."""
    is_safe: bool = Field(..., description="Overall approval status from AyurGuard")
    warnings: List[str] = Field(default_factory=list, description="Clinical warnings & alerts")
    contraindications_detected: List[str] = Field(default_factory=list, description="Identified contraindications")
    anupana_validations: List[str] = Field(default_factory=list, description="Verification of prescribed vehicles")
    age_pregnancy_flags: List[str] = Field(default_factory=list, description="Flags for Bala/Garbhini patients")
    disclaimer: str = Field(
        default="AYURGUARD SAFETY NOTICE: This decision support output is generated for qualified Vaidyas (BAMS/MD). Not a substitute for in-person clinical diagnosis."
    )


class ClinicalDiagnosticResponse(BaseModel):
    """Complete diagnostic and treatment output generated by AyurSetu."""
    probable_vyadhi: str = Field(..., description="Probable Ayurvedic disease diagnosis (Vyadhi)")
    roganirnaya_summary: str = Field(..., description="Clinical reasoning and diagnostic summary")
    samprapti: SampraptiGhatakas = Field(..., description="Structured etiopathogenesis")
    chikitsa_sutra: str = Field(..., description="Governing classical treatment principle")
    recommended_formulations: List[FormulationRecommendation] = Field(default_factory=list)
    pathya_apathya: Dict[str, List[str]] = Field(
        default_factory=dict,
        description="Wholesome (Pathya) and unwholesome (Apathya) dietary/lifestyle regimens"
    )
    citations: List[ShlokaCitation] = Field(default_factory=list, description="Grounded Brihat Trayi verses")
    safety_audit: SafetyAuditResult = Field(..., description="Deterministic safety evaluation")
