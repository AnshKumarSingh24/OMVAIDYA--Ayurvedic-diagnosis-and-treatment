# AyuVaidya (आयुवैद्य)
**Source-Grounded Ayurvedic Clinical Decision Support & Classical Knowledge Retrieval System**  
*National Open Ayurveda AI Challenge 2026–27 | Techfest, IIT Bombay in collaboration with the Ministry of Ayush & AIIA*

---

## 🌿 Executive Summary

**AyuVaidya** is an open-source, full-stack Clinical Decision Support System (CDSS) built specifically for qualified Vaidyas (BAMS/MD practitioners), Ayurvedic researchers, and clinical students.

It is powered by IIT Bombay's open-source 2.9B parameter **AyurParam** model, grounded in the classical *Brihat Trayi* (*Charaka Samhita*, *Sushruta Samhita*, and *Ashtanga Hridaya*), and protected by the **AyurGuard** deterministic medical safety firewall.

```
                           AyuVaidya Full-Stack System Architecture
                           
  +-----------------------------------------------------------------------------------------+
  |                        React 19 + Vite + Tailwind + Lucide Frontend                     |
  |  • Clinical Dashboard       • Rogi-Roga Pariksha (Ashtavidha)  • Samprapti Modeler      |
  |  • Chikitsa & Rx Planner    • Brihat Trayi Classical RAG       • AyurGuard Safety Audit |
  |  • Recovery Time-Series     • Knowledge Graph Visualizer       • Vaidya Profile         |
  +-----------------------------------------------------------------------------------------+
                                              │
                                              ▼ (JSON REST API via FastAPI)
  +-----------------------------------------------------------------------------------------+
  |                           FastAPI Backend & SQLite Database                             |
  |  • /api/patients       • /api/consultations     • /api/graph     • /api/rag             |
  |  • /api/safety         • /api/tracker           • /api/health                           |
  +-----------------------------------------------------------------------------------------+
                       │                                             │
                       ▼                                             ▼
  +------------------------------------------+  +------------------------------------------+
  |        AyurParam (2.9B) Reasoner         |  |         Canonical Knowledge Core         |
  |  - Roganirnaya (Differential Diagnosis)  |  |  - 53-Node Ayurvedic Knowledge Graph     |
  |  - Automated Samprapti (6 Kriya Kala)    |  |  - Hybrid BM25 & Dense Brihat Trayi RAG  |
  |  - Classical Chikitsa Sutra Derivation   |  |  - Exact Shloka Citations (Sanskrit/IAST)|
  +------------------------------------------+  +------------------------------------------+
                       │                                             │
                       └──────────────────────┬──────────────────────┘
                                              ▼
  +-----------------------------------------------------------------------------------------+
  |                     AyurGuard Deterministic Clinical Safety Firewall                    |
  |   • Strict Anupana (Vehicle) Verification     • Garbhini (Pregnancy) Safety Filter      |
  |   • 18 Classical Viruddha Ahara Incompatible Diet  • Pediatric (Bala) Dose Protection   |
  |   • Zero-Hallucination Shloka Citation Verifier     • Ritucharya (Seasonal) Restraints  |
  +-----------------------------------------------------------------------------------------+
```

---

## 🚀 Key Clinical Capabilities

1. **Vaidya Rogi-Roga Pariksha & Intake**:
   - Ashtavidha Pariksha assessment (Nadi, Mutra, Mala, Jihwa, Shabda, Sparsha, Druk, Akruti).
   - Constitutional Prakriti, Agni (digestive fire), Koshtha (bowel habit), and Bala evaluation.
2. **Automated Samprapti Modeling**:
   - Detailed deconstruction of etiopathogenesis:
     * *Dosha* (including sub-doshas like Vyana, Apana, Samana, Pachaka, Kledaka, Shleshaka).
     * *Dushya* (Rasa, Rakta, Mamsa, Meda, Asthi, Majja, Shukra).
     * *Agni* & *Ama* status.
     * *Srotas* & *Sroto-dushti* type (Sanga, Atipravritti, Vimarga Gamana).
     * *Adhisthana* (site of manifestation).
   - Full 6-stage *Shat Kriya Kala* chronological progression (Sanchaya, Prakopa, Prasara, Sthana-Samshraya, Vyakti, Bheda).
3. **Personalized Chikitsa Planning**:
   - Treatment principles directly cited from classical verses.
   - Formulations with dosage, *Bheshaja Kala* (timing), and approved *Anupana* (vehicle).
   - Personalized *Pathya* (wholesome) & *Apathya* (strict contraindications) dietary plans.
   - One-click Vaidya prescription printing.
4. **Canonical Brihat Trayi RAG & Shloka Traceability**:
   - Every recommendation maps directly to an authenticated verse identifier `[Treatise, Sthana, Adhyaya, Shloka]`.
   - Devanagari Sanskrit verse, IAST Romanization, and verified English translation.
5. **AyurGuard Deterministic Safety Firewall**:
   - Zero-trust, rule-based verification running outside the LLM.
   - Blocks unsafe vehicles (e.g. cold water with Guggulu).
   - Enforces pregnancy restrictions on emmenagogue and purgative herbs.
   - Checks 18 classical forms of *Viruddha Ahara* (incompatible food combinations).
6. **Ayurvedic Knowledge Graph**:
   - NetworkX ontology linking Diseases, Doshas, Dhatus, Srotas, Herbs, Formulations, and Shlokas.
7. **Longitudinal Recovery Tracker**:
   - Interactive Recharts charts tracking symptom severity reduction, Agni restoration, and Dosha balance over time.

---

## ⚡ Quickstart Guide

### 1. Requirements
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
pip install -r requirements.txt
```

### 3. Run Automated Tests
```bash
python -m unittest tests/test_pipeline.py
```

### 4. Launch the Complete System
**Option A: Unified Server (FastAPI serves both API and built Frontend)**:
```bash
python -m uvicorn backend.main:app --reload --port 8000
```
Open [http://localhost:8000](http://localhost:8000)

**Option B: Independent Development (FastAPI + Vite Dev Server)**:
- Backend: `python -m uvicorn backend.main:app --reload --port 8000`
- Frontend: `cd frontend && npm run dev` (Runs on `http://localhost:5173` with automatic API proxying)

---

## 📑 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/patients` | List registered patients with consultation status |
| `POST` | `/api/patients` | Register new patient with Ashtavidha Pariksha |
| `POST` | `/api/consultations/analyze` | AyurParam (2.9B) clinical diagnostic reasoning & Samprapti |
| `GET` | `/api/graph/subgraph` | Knowledge graph nodes and links for visualizer |
| `GET` | `/api/rag/search` | Hybrid RAG retrieval across Charaka, Sushruta, and Vagbhata |
| `POST` | `/api/safety/verify` | Standalone AyurGuard drug safety and Anupana verification |
| `GET` | `/api/safety/viruddha-ahara` | Catalog of 18 classical incompatible dietary rules |
| `GET` | `/api/tracker/{patient_id}` | Longitudinal recovery logs for Recharts analytics |
| `GET` | `/api/health` | System health and engine status |

---

## 🏆 Compliance with Techfest 2026–27 Rules

- **Core Model**: Grounded on IIT Bombay's open-source 2.9B **AyurParam** architecture.
- **Team Eligibility**: Designed for collaboration between engineering students and NCISM-enrolled **BAMS / MD (Ayurveda)** students.
- **Deliverables**: Comprehensive Phase 1 proposal document (`docs/PHASE_1_PROPOSAL.md`), print-ready submission document (`docs/AyurSetu_Phase1_Proposal.html`), working full-stack prototype, and 100% passing test harness.
- **License**: Released under the permissive **MIT License**.
