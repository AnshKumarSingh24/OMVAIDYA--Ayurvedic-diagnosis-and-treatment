"""
Unit tests for AyuVaidya Active Case Workspace & Structured Dialogue
"""

import unittest
import os
os.environ["DISABLE_SQLALCHEMY_CEXT"] = "1"

from fastapi.testclient import TestClient
from backend.main import app
from backend.database.connection import Base, engine, SessionLocal
from backend.database.seed_data import seed_database
from backend.database.models import Patient, CaseSession, CaseFact, AnalysisSnapshot


class TestCaseWorkspace(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
        cls.client = TestClient(app)

    def test_01_create_patient_and_case(self):
        """Test creating a patient and initializing a structured active case session."""
        p_res = self.client.post("/api/patients/", json={
            "full_name": "Smt. Kamala Devi",
            "age": 52,
            "gender": "Female",
            "prakriti": "Vata-Kapha",
            "agni": "Mandagni",
            "koshtha": "Madhyama",
            "bala": "Madhyama",
            "is_pregnant": False,
            "is_lactating": False
        })
        self.assertEqual(p_res.status_code, 200)
        patient_id = p_res.json()["patient_id"]

        # Create active case
        case_res = self.client.post("/api/cases/", json={
            "patient_id": patient_id,
            "chief_problem": "Severe morning knee stiffness and swelling",
            "duration": "2 months",
            "initial_facts": [
                {"category": "symptom", "key": "swelling_location", "value": "Bilateral knees"}
            ]
        })
        self.assertEqual(case_res.status_code, 200)
        case_data = case_res.json()
        self.assertEqual(case_data["patient_id"], patient_id)
        self.assertEqual(case_data["status"], "in_clarification")
        self.assertTrue(len(case_data["facts"]) >= 4)
        self.assertTrue(len(case_data["turns"]) >= 1)

        case_id = case_data["id"]

        # Test context-aware next-question
        q_res = self.client.post(f"/api/cases/{case_id}/next-question")
        self.assertEqual(q_res.status_code, 200)
        q_data = q_res.json()
        self.assertTrue(q_data["has_next"])
        self.assertEqual(q_data["question_key"], "morning_stiffness_duration")

        # Answer question via conversation turn
        turn_res = self.client.post(f"/api/cases/{case_id}/conversation", json={
            "role": "vaidya",
            "message": "Greater than 1 hour with swollen joints",
            "question_key": "morning_stiffness_duration"
        })
        self.assertEqual(turn_res.status_code, 200)

        # Assert second fact: coated tongue (Ama)
        fact_res = self.client.post(f"/api/cases/{case_id}/facts", json={
            "category": "pariksha",
            "key": "appetite_and_tongue",
            "value": "Thick white coating on tongue + poor appetite",
            "source_type": "clinician_observed",
            "confidence": 1.0,
            "confirmed_by_clinician": True
        })
        self.assertEqual(fact_res.status_code, 200)

        # Run analysis
        analyze_res = self.client.post(f"/api/cases/{case_id}/analyze")
        self.assertEqual(analyze_res.status_code, 200)
        snapshot = analyze_res.json()
        self.assertEqual(snapshot["version"], 1)
        self.assertIn(snapshot["engine_status"], ["local_fallback", "live_model"])
        self.assertEqual(snapshot["safety_status"], "passed")

        analysis = snapshot["analysis"]
        self.assertEqual(analysis["disease_key"], "Amavata")
        self.assertIn("more consistent with", analysis["confidence_level"].lower())
        self.assertTrue(len(analysis["citations"]) >= 1)
        self.assertTrue(len(analysis["prescriptions"]) >= 1)

        # Check that Amavata rx is Simhanada Guggulu with Ushnodaka
        rx = analysis["prescriptions"][0]
        self.assertEqual(rx["name"], "Simhanada Guggulu")
        self.assertTrue(rx["is_safe"])

    def test_02_pregnancy_safety_hold(self):
        """Test that pregnancy flags enforce AyurGuard safety warnings and holds."""
        p_res = self.client.post("/api/patients/", json={
            "full_name": "Ananya Roy",
            "age": 28,
            "gender": "Female",
            "prakriti": "Pitta-Kapha",
            "agni": "Mandagni",
            "koshtha": "Mridu",
            "bala": "Madhyama",
            "is_pregnant": True,
            "is_lactating": False
        })
        patient_id = p_res.json()["patient_id"]

        case_res = self.client.post("/api/cases/", json={
            "patient_id": patient_id,
            "chief_problem": "Chronic skin itching and scaling lesions"
        })
        case_id = case_res.json()["id"]

        analyze_res = self.client.post(f"/api/cases/{case_id}/analyze")
        snapshot = analyze_res.json()
        self.assertEqual(snapshot["safety_status"], "safety_hold")

        analysis = snapshot["analysis"]
        self.assertEqual(analysis["disease_key"], "Kushtha")
        # Arogyavardhini Vati is contraindicated in pregnancy
        rx = analysis["prescriptions"][0]
        self.assertFalse(rx["is_safe"])
        self.assertIn("Garbhini", " ".join(rx["contraindications"]))

    def test_03_differential_distinction(self):
        """Test distinction between Amavata and degenerative Sandhigata Vata."""
        p_res = self.client.post("/api/patients/", json={
            "full_name": "Elderly Patient",
            "age": 74,
            "gender": "Male",
            "prakriti": "Vata",
            "agni": "Vishamagni",
            "koshtha": "Krura",
            "bala": "Alpa"
        })
        patient_id = p_res.json()["patient_id"]

        case_res = self.client.post("/api/cases/", json={
            "patient_id": patient_id,
            "chief_problem": "Knee crepitus, grating sounds, stiffness < 30 mins, relieved by warm oil massage"
        })
        case_id = case_res.json()["id"]

        analyze_res = self.client.post(f"/api/cases/{case_id}/analyze")
        snapshot = analyze_res.json()
        analysis = snapshot["analysis"]
        self.assertEqual(analysis["disease_key"], "Sandhigata Vata")
        rx = analysis["prescriptions"][0]
        self.assertEqual(rx["name"], "Yogaraj Guggulu")


if __name__ == "__main__":
    unittest.main()

