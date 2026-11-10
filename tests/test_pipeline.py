"""
Unit & Integration Tests for AyurSetu AI Pipeline
Verifies RAG precision, AyurGuard deterministic safety checks, and clinical reasoning.
"""

import unittest
from core.models import PatientProfile, DoshaType, AgniStatus, KoshthaType, ShlokaCitation, ClassicalTreatise
from core.rag_engine import CanonicalRAGEngine
from core.guardrails import AyurGuardEngine
from core.ayurparam_engine import AyurParamOrchestrator


class TestAyurSetuPipeline(unittest.TestCase):

    def setUp(self):
        self.rag = CanonicalRAGEngine()
        self.guard = AyurGuardEngine()
        self.orchestrator = AyurParamOrchestrator()

    def test_rag_retrieval_jwara(self):
        """Verify that searching for fever/jwara returns Charaka Samhita Jwara Chikitsa."""
        results = self.rag.search("Jwara fever langhana", top_k=3)
        self.assertGreater(len(results), 0)
        top_res = results[0]
        self.assertIn("Jwara", top_res.adhyaya)
        self.assertEqual(top_res.shloka_id, "CS_CHI_03_142")

    def test_rag_retrieval_amavata(self):
        """Verify that searching for rheumatoid/amavata returns Ashtanga Hridaya Chi 21/42."""
        results = self.rag.search("Amavata joint swelling valuka sveda", top_k=3)
        self.assertGreater(len(results), 0)
        shloka_ids = [r.shloka_id for r in results]
        self.assertIn("AH_CHI_21_042", shloka_ids)

    def test_ayurguard_pregnancy_contraindication(self):
        """Verify that Simhanada Guggulu is strictly blocked for pregnant patients."""
        pregnant_patient = PatientProfile(
            age=28,
            gender="Female",
            is_pregnant=True,
            chief_complaints=["Severe joint pain"],
            current_season="Hemanta"
        )
        is_safe, warnings, contra = self.guard.verify_formulation_safety(
            formulation_name="Simhanada Guggulu",
            prescribed_anupana="Warm water",
            patient=pregnant_patient
        )
        self.assertFalse(is_safe, "Simhanada Guggulu must be rejected during pregnancy!")
        self.assertTrue(any("pregnant" in c.lower() or "garbhini" in c.lower() for c in contra))

    def test_ayurguard_anupana_violation(self):
        """Verify that prescribing a disallowed Anupana (e.g. Cold Water for Simhanada Guggulu) is caught."""
        adult_patient = PatientProfile(
            age=45,
            gender="Male",
            is_pregnant=False,
            chief_complaints=["Joint stiffness"]
        )
        is_safe, warnings, contra = self.guard.verify_formulation_safety(
            formulation_name="Simhanada Guggulu",
            prescribed_anupana="Cold water",
            patient=adult_patient
        )
        self.assertFalse(is_safe, "Cold water must be flagged as an Anupana violation for Simhanada Guggulu!")
        self.assertTrue(any("anupana violation" in c.lower() for c in contra))

    def test_ayurguard_hallucination_detection(self):
        """Verify that synthetic/hallucinated shloka citations are rejected."""
        fake_citation = ShlokaCitation(
            shloka_id="FAKE_SHLOKA_999",
            treatise=ClassicalTreatise.CHARAKA_SAMHITA,
            sthana="Sutra",
            adhyaya="Imaginary Chapter",
            shloka_number="999",
            sanskrit_devanagari="कदाचित्...",
            sanskrit_iast="kadacit...",
            english_translation="Fictional verse",
            relevance_score=0.9
        )
        is_valid, msg = self.guard.verify_citation_traceability(fake_citation)
        self.assertFalse(is_valid, "Fake citation must fail verification!")
        self.assertIn("HALLUCINATION ALERT", msg)

    def test_end_to_end_diagnostic_workflow(self):
        """Verify full clinical diagnosis and Samprapti generation."""
        patient = PatientProfile(
            age=40,
            gender="Female",
            is_pregnant=False,
            prakriti=DoshaType.VATA_KAPHA,
            agni=AgniStatus.MANDAGNI,
            koshtha=KoshthaType.MADHYAMA,
            chief_complaints=["Morning stiffness", "Bilateral joint pain", "Loss of appetite"]
        )
        response = self.orchestrator.generate_clinical_diagnosis(patient)
        self.assertIn("Amavata", response.probable_vyadhi)
        self.assertTrue(response.samprapti.ama)
        self.assertGreater(len(response.citations), 0)
        self.assertTrue(response.safety_audit.is_safe)


if __name__ == "__main__":
    unittest.main()
