# AyurSetu (आयुर्सेतु)

**National Open Ayurveda AI Challenge 2026–27 | Techfest, IIT Bombay**  
*Organized in collaboration with the Ministry of Ayush & All India Institute of Ayurveda (AIIA)*

---

## 🌿 Project Overview

**AyurSetu** is an open-source, source-grounded Clinical Decision Support and Classical Treatise Retrieval System powered by **AyurParam** (IIT Bombay's open-source 2.9B Ayurveda LLM).

It bridges authentic Ayurvedic classical wisdom (*Brihat Trayi*: Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya) with modern AI engineering, strictly enforcing **zero-hallucination shloka traceability** and **deterministic clinical contraindication guardrails**.

```
                           AyurSetu Architecture
                           
  +--------------------------------------------------------------------------+
  |                   Multilingual Vaidya Dashboard UI                       |
  |        (Patient Intake • Samprapti Visualizer • Classical Inspector)      |
  +--------------------------------------------------------------------------+
                                      │
                                      ▼
  +--------------------------------------------------------------------------+
  |                          FastAPI REST Engine                             |
  +--------------------------------------------------------------------------+
                    │                                      │
                    ▼                                      ▼
  +-----------------------------------+  +-----------------------------------+
  |   AyurParam 2.9B Reasoning Core   |  |     Canonical Brihat Trayi RAG    |
  |  - Roganirnaya (Diagnosis)        |  |  - Charaka, Sushruta, Vagbhata    |
  |  - Structured Samprapti Modeling  |  |  - Shloka-level verse metadata    |
  |  - Chikitsa Sutra & Formulations  |  |  - Sanskrit (Devanagari & IAST)   |
  +-----------------------------------+  +-----------------------------------+
                    │                                      │
                    └──────────────────┬───────────────────┘
                                       ▼
  +--------------------------------------------------------------------------+
  |              AyurGuard Deterministic Safety Firewall (Zero-Trust)        |
  |   • Anupana Compatibility Matrix        • Pregnancy (Garbhini) Filter    |
  |   • Viruddha Ahara (Incompatible Diet)  • Pediatric (Bala) Warnings      |
  |   • Citation Integrity & Authenticity   • Seasonal (Ritucharya) Checks   |
  +--------------------------------------------------------------------------+
```

---

## 🚀 Key Features

1. **Source-Grounded Shloka Traceability**:
   Every diagnostic claim, formulation recommendation, and treatment principle links directly to an immutable verse identifier (e.g. `CS_CHI_15_051`, `AH_CHI_21_042`) containing the original Sanskrit verse in Devanagari, IAST Romanization, and verified translation.
2. **Automated Samprapti Modeling**:
   Structures patient symptoms into clinical etiopathogenesis:
   - Aggravated *Doshas*
   - Affected *Dhatus*
   - *Agni* and *Ama* status
   - *Srotas* and *Sroto-dushti* type (Sanga, Atipravritti, etc.)
   - *Adhisthana* (site of manifestation)
3. **AyurGuard Deterministic Safety Firewall**:
   An independent rule engine outside the LLM that strictly blocks:
   - Dangerous *Anupana* combinations (e.g. cold water with Guggulu).
   - Contraindicated formulations during pregnancy (*Garbhini*) or infancy (*Bala*).
   - Classical incompatible food combinations (*Viruddha Ahara*).
   - Hallucinated or non-existent verse citations.
4. **Offline & Edge Ready**:
   Engineered to run locally on consumer-grade hardware (single GPU or CPU fallback) for rural and standalone clinic deployment.

---

## 📁 Repository Structure

```
AYUSHTECH/
├── api/
│   ├── __init__.py
│   └── main.py                 # FastAPI application endpoints & routes
├── core/
│   ├── __init__.py
│   ├── models.py               # Pydantic v2 schemas for Clinical & Shloka models
│   ├── classical_corpus.py     # Canonical Brihat Trayi dataset & safety catalog
│   ├── rag_engine.py           # Hybrid BM25 & semantic classical retrieval
│   ├── guardrails.py           # AyurGuard deterministic safety & Anupana firewall
│   └── ayurparam_engine.py     # AyurParam (2.9B) reasoning & orchestration
├── docs/
│   └── PHASE_1_PROPOSAL.md     # Full Techfest Phase 1 Submission Proposal Paper
├── static/
│   └── index.html              # Interactive multilingual Vaidya web dashboard
├── tests/
│   ├── __init__.py
│   └── test_pipeline.py        # Automated test suite (100% pass rate)
├── requirements.txt            # Python dependencies
└── README.md                   # Project overview & quickstart
```

---

## ⚡ Quickstart & Installation

### 1. Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- `pip`

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Automated Tests
Verify RAG retrieval, pregnancy contraindications, Anupana rules, and hallucination detection:
```bash
python -m unittest tests/test_pipeline.py
```

### 4. Launch the Interactive Application
```bash
python -m uvicorn api.main:app --reload --port 8000
```
Open your browser at:
- **Interactive Web App**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📑 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/diagnose` | Complete Ayurvedic Roganirnaya, Samprapti modeling, and AyurGuard audit |
| `GET` | `/api/search` | Hybrid RAG retrieval across Charaka, Sushruta, and Vagbhata |
| `POST` | `/api/verify-safety` | Standalone AyurGuard drug safety and Anupana compatibility check |
| `GET` | `/api/viruddha-ahara` | Catalog of 18 classical incompatible dietary combinations |
| `GET` | `/api/health` | Health status and AyurParam / AyurGuard engine metadata |

---

## 🏆 Compliance with Techfest 2026–27 Rules

- **Core Model**: Powered by IIT Bombay's open-source 2.9B **AyurParam** architecture.
- **Team Requirement**: Designed for collaboration between engineering students and NCISM-enrolled **BAMS / MD (Ayurveda)** students.
- **Deliverables**: Includes full Phase 1 Proposal document (`docs/PHASE_1_PROPOSAL.md`), modular open-source codebase, and comprehensive test suite.
- **License**: Released under the permissive **MIT License**.

