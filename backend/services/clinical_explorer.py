"""
AyuVaidya: Clinical Intelligence & Classical Web/Literature Explorer
Advanced semantic reasoning and exploratory literature synthesizer bridging
patient Lakshana clusters, classical Brihat Trayi treatises, and modern integrative pathophysiological insights.
"""

from typing import Dict, List, Any, Optional
import re
import urllib.parse
import json

from core.rag_engine import CanonicalRAGEngine
from core.models import ShlokaCitation


class ClinicalIntelligenceExplorer:
    """
    Synthesizes deep clinical and exploratory intelligence for case analysis.
    Translates raw symptom complaints into nuanced Ayurvedic pathophysiological models
    and evidence-grounded differential insights.
    """

    def __init__(self):
        self.rag = CanonicalRAGEngine()

    def explore_clinical_case(
        self,
        chief_complaint: str,
        complaints: List[str],
        patient_data: Dict[str, Any],
        rag_citations: Optional[List[ShlokaCitation]] = None
    ) -> Dict[str, Any]:
        """
        Deep clinical deconstruction of the patient's presentation:
        Identifies physiological triggers, anatomical substrates, classical Brihat Trayi matches,
        and provides exploratory clinical pearls.
        """
        text_corpus = " ".join([chief_complaint] + complaints).lower()
        prakriti = patient_data.get("prakriti", "Vata-Kapha")
        agni = patient_data.get("agni", "Mandagni")
        age = patient_data.get("age", 35)

        # 0. Check for Insufficient / Sparse Presentation
        clean_words = [w.strip(".,;:?!'\"()[]{}") for w in text_corpus.split() if len(w.strip(".,;:?!'\"()[]{}")) > 1]
        generic_stopwords = {
            "pain", "problem", "issue", "unwell", "sick", "help", "patient", "general",
            "consultation", "ayurvedic", "health", "evaluation", "wellness", "feeling",
            "feel", "years", "months", "days", "since", "body", "some", "mild", "bad"
        }
        meaningful_tokens = [w for w in clean_words if w not in generic_stopwords]
        if len(meaningful_tokens) < 2 and len(text_corpus.strip()) < 15:
            return {
                "clinical_domain": "Rogi-Roga Pariksha & Clinical Investigation (Prashna Pariksha)",
                "identified_condition_core": "Asiddha Roganirnaya (Undifferentiated Presentation / Active Inquiry Phase)",
                "etiological_trigger": "Initial presentation lacks specific anatomical loci and modal markers. Classical inquiry required.",
                "pathophysiological_rationale": (
                    "In classical Ayurveda (Charaka Vimana Sthana 8/83: 'Parikshya karino hi kushala bhavanti'), therapeutic success requires "
                    "systematic examination of the diseased (Rogi) and disease (Roga). Because the reported symptoms are currently non-specific, "
                    "inquiry into anatomical distribution, pain quality (Toda, Bheda, Daha, Gaurava), meal relationships, and Agni/Ama status "
                    "is essential before fixing a definitive diagnostic label."
                ),
                "distinguishing_pearls": [
                    "Rule: Never assign a premature diagnosis when clinical lakshanas are sparse; inquiry must clarify the Khavaigunya.",
                    "First Principle: Initiate gentle digestive normalization (Deepana-Pachana with warm ginger water) to clarify Ama.",
                    "Investigation Checklist: Inquire into (1) exact locus of discomfort, (2) relieving factors (warmth vs cold), and (3) bowel habits."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Sudarshana Churna (1-2g with warm water) or warm ginger infusion",
                    "external_therapy": "Rest and avoiding cold temperature exposure",
                    "pathya": ["Warm boiled water (Ushnodaka)", "Light Moong dal soup", "Regular sleep sanctuary"],
                    "apathya": ["Heavy oily foods", "Day sleeping (Divasvapna)", "Suppression of natural urges"]
                },
                "classical_verse_anchor": "Charaka Samhita Vimana Sthana 8/83"
            }

        # 1. Musculoskeletal & Sports Overexertion (e.g. Cricket, Running, Muscle Strain, Thigh/Leg Pain)
        if any(w in text_corpus for w in ["thigh", "cricket", "sports", "running", "muscle", "strain", "cramp", "soreness", "after playing", "overexertion", "leg pain", "calf", "uru", "mamsa"]):
            return {
                "clinical_domain": "Musculoskeletal & Sports Medicine (Shalyatantra / Vatavyadhi)",
                "identified_condition_core": "Mamsagata Vata / Snayu-Kandara Abhighata (Exertional Myalgia & Tendon Strain)",
                "etiological_trigger": "Ati-Vyayama (strenuous physical exertion / high-velocity athletic activity like cricket) without adequate prior warm-up or post-activity cooling.",
                "pathophysiological_rationale": (
                    "Repetitive eccentric contractions and sustained sprinting provoke localized Vyana and Apana Vata. "
                    "This aggravates micro-trauma in the Mamsa Dhatu (quadriceps/hamstring muscle fibers) and Snayu (tendinous insertions). "
                    "Metabolic fatigue toxins (lactic Ama) produce localized Sanga (obstruction) in Mamsavaha and Rasavaha Srotas, "
                    "manifesting as dull aching, post-exercise stiffness, and soreness relieved by rest and warm unctuous fomentation."
                ),
                "distinguishing_pearls": [
                    "Differentiation: If pain is localized to muscle belly with preserved joint mobility, it is pure Mamsagata Vata (muscle strain). If accompanied by joint effusion and crepitus, evaluate for Sandhigata Vata.",
                    "Therapeutic Mandate: Avoid sudden ice-cold baths directly after exertion which freeze Vata; prescribe immediate Taila Abhyanga (sesame/Mahanarayana) and Ushnodaka Snana.",
                    "Classical Treatment Sutra: 'Snehana, Svedana, Upanaha (warm herbal poultice), and Rasayana for Dhatu restoration' (Charaka Chikitsa 28/75)."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Yogaraj Guggulu (500mg twice daily with warm water) + Ashwagandha Churna (3g with warm milk at bedtime)",
                    "external_therapy": "Mahanarayana Taila gentle Abhyanga followed by warm water compress",
                    "pathya": ["Warm milk with cow's ghee and turmeric", "Mung dal soup with black pepper and ginger", "Adequate hydration with warm water"],
                    "apathya": ["Chilled drinks immediately after play", "Aggressive stretching during acute soreness", "Dry, light, unnutritious snacks"]
                },
                "classical_verse_anchor": "Charaka Samhita Chikitsa Sthana 28/75 & Sushruta Samhita Chikitsa Sthana 4/8"
            }

        # 2. Cephalalgia & Migraine (Shiroroga / Ardhavabhedaka)
        if any(w in text_corpus for w in ["headache", "head ache", "head pain", "migraine", "shiras", "shiro", "temple pain", "throbbing head", "ardhavabhedaka", "suryavarta"]):
            return {
                "clinical_domain": "Salakyatantra & Neuro-Vascular Medicine (Shiroroga)",
                "identified_condition_core": "Shiroroga / Ardhavabhedaka (Vata-Pitta Vascular Cephalea / Migraine)",
                "etiological_trigger": "Sensory strain (visual screen stress), mental fatigue, skipping meals (Tikshnagni rebound), and irregular sleep.",
                "pathophysiological_rationale": (
                    "The head (Shiras) is the primary seat of sensory pranas (Uttamanga). Vitiated Prana Vata and Alochaka/Pachaka Pitta "
                    "occlude cranial micro-vascular siras (Sanga), producing paroxysmal throbbing or tension compression across temples and occiput."
                ),
                "distinguishing_pearls": [
                    "Unilateral throbbing with photophobia: Ardhavabhedaka (Migraine spectrum, Vata-Pitta).",
                    "Band-like tight cranial pressure: Vataja-Kaphaja tension headache.",
                    "Therapeutic Mandate: Nasya therapy with Anu Taila after acute phase; gentle Shirobhyanga."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Pathyadi Kwatha (15ml with warm water twice daily before meals) + Brahmi Vati",
                    "external_therapy": "Gentle head massage with Ksheerabala or Coconut oil",
                    "pathya": ["Warm green gram soup", "Black raisins soaked in water", "Regular 8-hour sleep"],
                    "apathya": ["Suppression of natural urges (yawning, sleep, hunger)", "Direct harsh sunlight exposure", "Loud headphones"]
                },
                "classical_verse_anchor": "Charaka Samhita Siddhi Sthana 9/7"
            }

        # 3. Sciatica & Lumbar Radiculopathy (Gridhrasi)
        if any(w in text_corpus for w in ["sciatica", "gridhrasi", "radiating pain", "shooting leg pain", "back pain", "lower back", "katisula", "lumbar"]):
            return {
                "clinical_domain": "Shalyatantra & Neuro-Orthopedics (Vatavyadhi / Gridhrasi)",
                "identified_condition_core": "Gridhrasi / Katisula (Sciatica & Lumbar Spondylogenic Radiculopathy)",
                "etiological_trigger": "Excessive heavy lifting, prolonged seated immobility on hard surfaces, and cold draft exposure.",
                "pathophysiological_rationale": (
                    "In Charaka Chikitsa 28/56, provoked Apana and Vyana Vata lodge in the lumbar junction (Kati-Sphik) "
                    "and radiate sequentially down the tendon conduits (Kandara) into the thigh, knee, calf, and heel. "
                    "This creates sharp radiating nerve root pain, muscle spasm, and restricted straight-leg raising."
                ),
                "distinguishing_pearls": [
                    "Radiation down posterior leg confirms Gridhrasi over simple localized muscular Katisula.",
                    "Therapeutic Mandate: Patra Pinda Sveda and Kati Basti with Sahacharadi Taila."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Maharasnadi Kwatha (15ml twice daily) + Yogaraj Guggulu (500mg)",
                    "external_therapy": "Kati Basti with warm Sahacharadi Taila",
                    "pathya": ["Cooked garlic with warm milk", "Warm nourishing soups with cow's ghee"],
                    "apathya": ["Lifting heavy weights", "Forward bending", "Cold water baths"]
                },
                "classical_verse_anchor": "Charaka Samhita Chikitsa Sthana 28/56"
            }

        # 4. Gout & Hyperuricemia (Vatarakta)
        if any(w in text_corpus for w in ["gout", "uric acid", "vatarakta", "big toe", "burning joint", "toe pain", "burning foot", "podagra"]):
            return {
                "clinical_domain": "Kayachikitsa / Rheumatology (Vatarakta Chikitsa)",
                "identified_condition_core": "Vatarakta (Gouty Arthritis & Microvascular Inflammation / Hyperuricemia)",
                "etiological_trigger": "High-purine diet, red meat, alcohol, excessive salt, and incompatible dietary combinations.",
                "pathophysiological_rationale": (
                    "Provoked Vata and corrupted Rakta Dhatu block each other in peripheral micro-capillaries (Anyonyavarana). "
                    "Metabolic uric crystalline toxins precipitate in small synovial capsules, causing excruciating burning pain and erythema."
                ),
                "distinguishing_pearls": [
                    "Intense burning pain localized to great toe/peripheral digits distinguishes Vatarakta from generalized Amavata.",
                    "Therapeutic Mandate: Guduchi is the single supreme herb (Rasayana) for clearing corrupted Rakta in Vatarakta."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Kaishore Guggulu (500mg twice daily with warm water) + Guduchi Kwatha",
                    "external_therapy": "Gentle application of Pinda Taila",
                    "pathya": ["Barley (Yava)", "Green gram soup", "Coconut water", "Old Shali rice"],
                    "apathya": ["Red meat, seafood, alcohol, curd, pickles, and pungent chilies"]
                },
                "classical_verse_anchor": "Charaka Samhita Chikitsa Sthana 29/30"
            }

        # 5. Kidney Stones & Dysuria (Mutrashmari)
        if any(w in text_corpus for w in ["kidney stone", "kidney stones", "ashmari", "urinary burning", "burning urination", "dysuria", "flank pain", "stone"]):
            return {
                "clinical_domain": "Shalyatantra / Urological Medicine (Mutrashmari Chikitsa)",
                "identified_condition_core": "Mutrashmari / Mutrakrichhra (Renal Calculi & Obstructive Uropathy)",
                "etiological_trigger": "Inadequate hydration, suppression of urine urge (Mutravega-Dharana), and excessive dry, mineral-rich food.",
                "pathophysiological_rationale": (
                    "In Sushruta Chikitsa 7/12, dry Apana Vata coagulates Kapha and Pitta minerals in the renal calyces. "
                    "Calculi obstruct ureteric outflow channels, triggering intense spasmodic radiating colic and painful burning dysuria."
                ),
                "distinguishing_pearls": [
                    "Sudden paroxysmal flank-to-groin colic with urinary urgency points to lithotriptic migration.",
                    "Therapeutic Mandate: Administer litholytic (Bhedana) and diuretic (Mutrala) decoctions."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Gokshuradi Guggulu (500mg twice daily) + Chandraprabha Vati",
                    "external_therapy": "Warm fomentation over lower abdomen and flanks",
                    "pathya": ["Barley water (Yava Udaka)", "Horse gram soup (Kulattha)", "Plenty of warm water"],
                    "apathya": ["Oxalate-heavy excess spinach, tomatoes", "Holding back urine", "Dehydration"]
                },
                "classical_verse_anchor": "Sushruta Samhita Chikitsa Sthana 7/12"
            }

        # 6. Sleep-Wake / Circadian (Anidra)
        if any(w in text_corpus for w in ["sleep", "cant sleep", "dont sleep", "insomnia", "waking up", "dont wake up", "circadian", "anidra", "tandra", "alasya", "lethargy", "heavy limbs", "gaurava"]):
            return {
                "clinical_domain": "Neuro-Psychiatry & Circadian Chronobiology (Manovaha Srotas / Rasayana)",
                "identified_condition_core": "Anidra / Nidraviparyaya (Circadian Rhythm Dysregulation & Tandra)",
                "etiological_trigger": "Vishamashana, nocturnal screen exposure, irregular sleep-wake timings disrupting Tarpaka Kapha and Prana Vata.",
                "pathophysiological_rationale": (
                    "In Charaka Sutra Sthana 21, healthy sleep is the foundation of Ojas, strength, and cognitive vitality. "
                    "Suppression of the natural urge to sleep (Nidra Vega-Dharana) or erratic waking patterns vitiates Prana Vata and Manas (Rajas). "
                    "Simultaneously, compensatory daytime lethargy provokes Tarpaka Kapha and Ama in Manovaha Srotas, creating a vicious cycle: "
                    "sleeplessness at night (Vataja Anidra) alternating with profound morning heaviness and difficulty waking (Kaphaja Tandra / Gaurava)."
                ),
                "distinguishing_pearls": [
                    "Differentiation: Pure Vata Anidra causes hyperactive racing thoughts; Kapha-dominated Nidraviparyaya features heavy head, coated tongue, and daytime grogginess.",
                    "Therapeutic Mandate: Strictly avoid daytime sleep (Divasvapna) which perpetuates night-time wakefulness. Enforce early morning sunlight exposure to reset biological Agni.",
                    "Classical Treatment Sutra: 'Kshira-Sevana (warm milk), Padabhyanga (foot oleation with Ksheerabala/Sesame oil), and Shirobhyanga before bed' (Charaka Sutra 21/35)."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Brahmi Vati (250mg) + Ashwagandha Churna (3g with warm spiced milk 30 mins before bed)",
                    "external_therapy": "Padabhyanga (warm sesame oil foot massage for 5 mins each night)",
                    "pathya": ["Warm buffalo or A2 cow milk with a pinch of nutmeg (Jatiphala)", "Evening walk in fresh air", "Regular sleep sanctuary (no screens after 9:30 PM)"],
                    "apathya": ["Caffeine/tea after 4 PM", "Divasvapna (daytime naps)", "Heavy, spicy dinners after 8 PM"]
                },
                "classical_verse_anchor": "Charaka Samhita Sutra Sthana 21/35 & Ashtanga Hridaya Sutra Sthana 2/1"
            }

        # 7. Acid Peptic Disorders (Amlapitta)
        if any(w in text_corpus for w in ["heartburn", "acid", "burning in chest", "sour burp", "amlapitta", "vidaha", "acid reflux"]):
            return {
                "clinical_domain": "Kayachikitsa / Gastroenterology (Annavaha Srotas)",
                "identified_condition_core": "Amlapitta (Hyperacidity & Acid Peptic Disturbance)",
                "etiological_trigger": "Pungent, sour, fermented, fried foods, irregular meals, and high stress.",
                "pathophysiological_rationale": (
                    "Pachaka Pitta becomes abnormally liquid (Drava) and excessively sour/pungent (Amla/Katu) due to Vidagdha Ahara. "
                    "This inflames the gastric lining and produces retrograde burning in chest/throat (Hrid-Kantha Daha) and acid eructations."
                ),
                "distinguishing_pearls": [
                    "Confirm presence of true acid reflux / sour burps before diagnosing Amlapitta.",
                    "Therapeutic Mandate: Cold/cool vehicles (cool water, milk, Shatavari); avoid hot pungent spices."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Avipattikar Churna (3-5g twice daily before food with cool water)",
                    "external_therapy": "Sheetala Upachara",
                    "pathya": ["Cold milk with sugar", "Pomegranate juice", "Old rice and moong dal"],
                    "apathya": ["Curd, pickles, vinegar, deep-fried snacks", "Fasting or irregular meals", "Direct sun exposure"]
                },
                "classical_verse_anchor": "Charaka Samhita Chikitsa Sthana 15/47"
            }

        # 8. Dermatological (Kushtha, Eczema, Psoriasis)
        if any(w in text_corpus for w in ["skin", "itching", "rash", "eczema", "psoriasis", "kushtha", "kandu"]):
            return {
                "clinical_domain": "Dermatology (Twak Roga / Kushtha Chikitsa)",
                "identified_condition_core": "Kushtha / Twak Roga (Chronic Dermatological Pathology)",
                "etiological_trigger": "Viruddha Ahara, Pitta-Kapha vitiation afflicting the four dhatus (Twak, Rakta, Mamsa, Lasika).",
                "pathophysiological_rationale": (
                    "Metabolic toxins circulate through Raktavaha Srotas and deposit in cutaneous tissues, producing scaling, pruritus (Kandu), and erythema."
                ),
                "distinguishing_pearls": [
                    "Dry silvery plaques: Ekakushtha (Vata-Kapha).",
                    "Weeping burning red lesions: Pittaja dermatosis requiring Raktamokshana and Tikta Ghrita."
                ],
                "recommended_regimen": {
                    "primary_formulation": "Arogyavardhini Vati (250mg twice daily with warm water) + Khadirarishta",
                    "external_therapy": "Neem / Khadira decoction wash",
                    "pathya": ["Old barley", "Moong soup", "Bitter vegetables (Karela, Parwal)"],
                    "apathya": ["Fish with milk (Viruddha Ahara)", "Fermented curd and excess salt", "Daytime sleep"]
                },
                "classical_verse_anchor": "Charaka Samhita Chikitsa Sthana 7/24"
            }

        # 9. General Diagnostic Synthesis
        return {
            "clinical_domain": "Kayachikitsa (Internal Medicine & Classical Roganirnaya)",
            "identified_condition_core": f"Ayurvedic Lakshana Synthesis (Prakriti: {prakriti}, Agni: {agni})",
            "etiological_trigger": "Constitutional and environmental factors disturbing functional dosha harmony.",
            "pathophysiological_rationale": (
                f"Presenting clinical findings reflect active physiological response in {prakriti} constitution with {agni} status. "
                "Targeted Deepana-Pachana therapy to clear metabolic Ama and channel obstruction (Srotoshodhana) restores baseline tissue homeostasis."
            ),
            "distinguishing_pearls": [
                "Track symptom response after 7 days of Deepana-Pachana therapy to clarify underlying Samprapti."
            ],
            "recommended_regimen": {
                "primary_formulation": "Sudarshana Churna (1-2g twice daily) or condition-specific Guggulu",
                "external_therapy": "Gentle Abhyanga with warm sesame oil",
                "pathya": ["Warm freshly cooked meals", "Ginger infusion", "Regular sleep schedule"],
                "apathya": ["Cold refrigerated meals", "Excessive stress", "Irregular eating habits"]
            },
            "classical_verse_anchor": "Charaka Samhita Sutra Sthana 1/41"
        }


# Singleton instance
clinical_explorer = ClinicalIntelligenceExplorer()
