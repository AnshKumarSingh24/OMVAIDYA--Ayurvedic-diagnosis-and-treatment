"""
AyuVaidya: Automated Samprapti (Pathology) Modeling Engine
Performs classical deconstruction of etiopathogenesis:
Sanchaya -> Prakopa -> Prasara -> Sthana-Samshraya (Khavaigunya) -> Vyakti -> Bheda.

Data-driven differential scoring with calibrated confidence:
- 'more consistent with'
- 'possible'
- 'insufficient information'

Integrated with Canonical Brihat Trayi Hybrid RAG and Clinical Intelligence Explorer.
Supports 28+ Classical Ayurvedic Disease Spectrums + Dynamic Clinical Synthesis + Insufficient Data Protocol.
"""

from typing import Dict, List, Any, Optional
from backend.knowledge_graph.ayur_graph import ayur_kg
from core.rag_engine import CanonicalRAGEngine
from backend.services.clinical_explorer import clinical_explorer


class SampraptiModelingService:
    """
    Automated Samprapti derivation aligning patient Lakshanas (symptoms),
    Ashtavidha Pariksha, and classical Brihat Trayi pathology models.
    """

    def __init__(self):
        self.kg = ayur_kg
        self.rag = CanonicalRAGEngine()

    def model_samprapti(
        self,
        complaints: List[str],
        prakriti: str = "Vata-Kapha",
        agni: str = "Mandagni",
        koshtha: str = "Madhyama",
        ashtavidha: Optional[Dict[str, str]] = None,
        triggering_nidana: Optional[str] = None,
        structured_facts: Optional[List[Dict[str, Any]]] = None,
        duration: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Derives complete Samprapti Ghatakas, differential possibilities,
        and Shat Kriya Kala staging from complaints and structured case facts.
        """
        ashtavidha = ashtavidha or {}
        structured_facts = structured_facts or []

        # Aggregate all text for context-aware scoring
        combined_text_list = list(complaints)
        for f in structured_facts:
            val = f.get("value", "")
            if isinstance(val, str):
                combined_text_list.append(val)
            elif isinstance(val, list):
                combined_text_list.extend(str(x) for x in val)

        text_corpus = " ".join(combined_text_list).lower()
        if triggering_nidana:
            text_corpus += f" {triggering_nidana.lower()}"

        # Pariksha signals
        jihwa = ashtavidha.get("jihwa", "").lower()
        mala = ashtavidha.get("mala", "").lower()
        mutra = ashtavidha.get("mutra", "").lower()
        nadi = ashtavidha.get("nadi", "").lower()

        for f in structured_facts:
            k = f.get("key", "").lower()
            v = str(f.get("value", "")).lower()
            if "jihwa" in k or "tongue" in k:
                jihwa += f" {v}"
            elif "mala" in k or "bowel" in k or "stool" in k:
                mala += f" {v}"
            elif "mutra" in k or "urine" in k:
                mutra += f" {v}"
            elif "nadi" in k or "pulse" in k:
                nadi += f" {v}"

        # ------------------------------------------------------------------
        # STEP 0: INSUFFICIENT / SPARSE INFORMATION DETECTION
        # ------------------------------------------------------------------
        # If the input is empty, extremely brief, or only contains generic non-specific words
        clean_words = [w.strip(".,;:?!'\"()[]{}") for w in text_corpus.split() if len(w.strip(".,;:?!'\"()[]{}")) > 1]
        generic_stopwords = {
            "pain", "problem", "issue", "unwell", "sick", "help", "patient", "general",
            "consultation", "ayurvedic", "health", "evaluation", "wellness", "feeling",
            "feel", "years", "months", "days", "since", "body", "some", "mild", "bad"
        }
        meaningful_tokens = [w for w in clean_words if w not in generic_stopwords]
        is_sparse_presentation = len(meaningful_tokens) < 2 and len(text_corpus.strip()) < 15

        if is_sparse_presentation:
            raw_preview = text_corpus[:80].strip() or "General inquiry"
            return {
                "probable_vyadhi": "Asiddha Roganirnaya — Lakshana Clarification Needed (Undifferentiated Clinical Presentation)",
                "disease_key": "Asiddha Roganirnaya",
                "confidence_level": "insufficient information",
                "differentials": [
                    {
                        "disease_key": "Asiddha Roganirnaya",
                        "label": "Undifferentiated Presentation (Requires Structured Prashna Pariksha)",
                        "confidence": "insufficient information",
                        "score": 0,
                        "hallmarks": ["Sparse or non-specific clinical data presented so far"],
                        "distinguishing_factors": ["Pending anatomical locus (Sthana), sensory character (Vedana Svarupa), and Agni assessment"]
                    }
                ],
                "uncertainty_notes": [
                    f"Sparse Lakshana Presentation: Clinical data collected so far ('{raw_preview}') is non-specific. In classical Ayurveda (Charaka Vimana 8/83: 'Parikshya karino hi kushala bhavanti'), diagnostic certainty requires exploring anatomical location, pain character, meal/weather triggers, and digestive fire."
                ],
                "samprapti_ghatakas": {
                    "dosha": ["Anirdharita Dosha (Pending Clinical Clarification)"],
                    "dushya": ["Anirdharita Dushya"],
                    "agni": agni or "Vishamagni",
                    "ama": False,
                    "srotas": ["Sarva Sharira"],
                    "sroto_dushti_prakara": "Prashna Pariksha Apekshita (Inquiry Required)",
                    "adhisthana": "Undifferentiated"
                },
                "shat_kriya_kala": {
                    "1_sanchaya": "Mild early Dosha accumulation suspected; specific vitiated Dosha pending clinical clarification.",
                    "2_prakopa": "Provocation markers not yet anatomically localized.",
                    "3_prasara": "Circulation through systemic channels without marked localized Khavaigunya.",
                    "4_sthana_samshraya": "Site of anatomical lodgment requires inquiry into exact pain/symptom distribution.",
                    "5_vyakti": "Current manifestation consists of non-specific general symptoms.",
                    "6_bheda": "Chronicity and complication stage to be evaluated following clinical examination."
                },
                "chikitsa_sutra": "Prashna Pariksha, Rogi-Roga Pariksha, Deepana-Pachana (Shunthi-Sadhita Jala), and Nidana Parivarjana (Charaka Vimana Sthana 8/83).",
                "pathya": [
                    "Drink warm water boiled with fresh ginger (Shunthi Jala) to support baseline Agni",
                    "Freshly prepared, easily digestible warm vegetarian meals (Moong dal khichdi)",
                    "Maintain regular sleep hours and avoid extreme temperature drafts until evaluation"
                ],
                "apathya": [
                    "Heavy, oily, stale, or refrigerated foods",
                    "Daytime sleep (Divasvapna) and staying awake past midnight",
                    "Suppression of natural physiological urges (Vega-Dharana)"
                ],
                "recommended_formulations": ["Sudarshana Churna"],
                "knowledge_graph_context": self.kg.trace_samprapti("Jwara")
            }

        # ------------------------------------------------------------------
        # DIFFERENTIAL SCORING ENGINE (COMPREHENSIVE CLASSICAL SPECTRUM)
        # ------------------------------------------------------------------
        candidates = {
            "Mamsagata Vata": {
                "name": "Mamsagata Vata / Snayu-Kandara Abhighata (Exertional Myalgia & Muscle Strain)",
                "disease_key": "Mamsagata Vata",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Anidra": {
                "name": "Anidra / Nidraviparyaya (Circadian Rhythm Dysregulation & Tandra)",
                "disease_key": "Anidra",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Shiroroga": {
                "name": "Shiroroga / Ardhavabhedaka (Cephalea, Migraine & Vascular Headache Spectrum)",
                "disease_key": "Shiroroga",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Amavata": {
                "name": "Amavata (Inflammatory Joint Pathology / Rheumatoid Spectrum)",
                "disease_key": "Amavata",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Sandhigata Vata": {
                "name": "Sandhigata Vata (Degenerative Joint Disease / Osteoarthritis)",
                "disease_key": "Sandhigata Vata",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Gridhrasi": {
                "name": "Gridhrasi / Katisula (Sciatica & Lumbar Radiculopathy)",
                "disease_key": "Gridhrasi",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Vatarakta": {
                "name": "Vatarakta (Gouty Arthritis & Microvascular Inflammation / Hyperuricemia)",
                "disease_key": "Vatarakta",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Apabahuka": {
                "name": "Apabahuka / Manyastambha (Frozen Shoulder & Cervical Spondylosis)",
                "disease_key": "Apabahuka",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Kampavata": {
                "name": "Kampavata / Vepathu (Tremors, Parkinsonism & Motor Incoordination)",
                "disease_key": "Kampavata",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Grahani Dosha": {
                "name": "Grahani Dosha / Agnimandya (Malabsorption & Gut Dysbiosis / IBS)",
                "disease_key": "Grahani Dosha",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Amlapitta": {
                "name": "Amlapitta (Hyperacidity / Acid Peptic Disorder & GERD)",
                "disease_key": "Amlapitta",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Pravahika": {
                "name": "Pravahika / Raktatisara (Colitis, Dysentery & Mucus Diarrhea)",
                "disease_key": "Pravahika",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Arshas": {
                "name": "Arshas / Parikartika (Hemorrhoids, Piles & Anal Fissures)",
                "disease_key": "Arshas",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Kamala": {
                "name": "Kamala / Yakrit Roga (Hepato-Biliary Jaundice & Liver Sluggishness)",
                "disease_key": "Kamala",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Prameha": {
                "name": "Prameha / Madhumeha (Metabolic Glycemic Imbalance & Diabetes)",
                "disease_key": "Prameha",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Sthaulya": {
                "name": "Sthaulya / Medoroga (Obesity, Dyslipidemia & Metabolic Sluggishness)",
                "disease_key": "Sthaulya",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Pandu Roga": {
                "name": "Pandu Roga (Anemia & Hepato-Splenic Dysfunction / Tissue Hypoxia)",
                "disease_key": "Pandu Roga",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Tamaka Shwasa": {
                "name": "Tamaka Shwasa (Bronchial Asthma & Paroxysmal Wheezing)",
                "disease_key": "Tamaka Shwasa",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Kasa": {
                "name": "Kasa / Pratishyaya (Chronic Cough, Bronchitis & Allergic Sinusitis)",
                "disease_key": "Kasa",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Kushtha": {
                "name": "Kushtha / Kitibha (Psoriasis, Eczema & Chronic Dermatological Pathology)",
                "disease_key": "Kushtha",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Khalitya": {
                "name": "Khalitya / Indralupta (Alopecia, Hair Fall & Scalp Dermatitis)",
                "disease_key": "Khalitya",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Mutrashmari": {
                "name": "Mutrashmari / Mutrakrichhra (Renal Calculi, Kidney Stones & Dysuria)",
                "disease_key": "Mutrashmari",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Galaganda": {
                "name": "Galaganda / Gandamala (Thyroid Goiter, Nodules & Glandular Swelling)",
                "disease_key": "Galaganda",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Chittodvega": {
                "name": "Chittodvega / Manovaha Srotodushti (Anxiety, Panic Attacks & Palpitations)",
                "disease_key": "Chittodvega",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Jwara": {
                "name": "Jwara / Taruna Jwara (Acute Pyrexia & Systemic Ama)",
                "disease_key": "Jwara",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            },
            "Karshya": {
                "name": "Karshya & Atyagni / Bhasmaka Roga (Hypermetabolic Dhatukshaya & Inability to Gain Weight)",
                "disease_key": "Karshya",
                "score": 0,
                "hallmarks": [],
                "distinguishing_positives": [],
                "distinguishing_negatives": []
            }
        }

        # ------------------------------------------------------------------
        # CLINICAL SCORING RULES
        # ------------------------------------------------------------------
        # 1. Musculoskeletal & Sports Overexertion
        has_sports = any(w in text_corpus for w in [
            "thigh", "cricket", "sports", "running", "playing", "after playing",
            "muscle", "strain", "soreness", "cramp", "cramps", "calf", "leg pain",
            "uru", "mamsa", "overexertion", "sprain"
        ])
        if has_sports:
            candidates["Mamsagata Vata"]["score"] += 4
            candidates["Mamsagata Vata"]["hallmarks"].append("Exertional myalgia and localized muscle soreness following physical activity")
            if any(w in text_corpus for w in ["thigh", "uru", "quadriceps", "hamstring"]):
                candidates["Mamsagata Vata"]["score"] += 2
                candidates["Mamsagata Vata"]["distinguishing_positives"].append("Anatomical localization to Uru muscle belly without primary joint effusion confirms Mamsagata Vata")

        # 2. Sleep / Circadian / Anidra
        has_sleep = any(w in text_corpus for w in [
            "sleep", "cant sleep", "dont sleep", "insomnia", "waking up", "dont wake up",
            "anidra", "tandra", "alasya", "circadian", "sleepiness", "drowsy"
        ])
        if has_sleep:
            candidates["Anidra"]["score"] += 4
            candidates["Anidra"]["hallmarks"].append("Disrupted circadian sleep-wake rhythm (Anidra / Nidraviparyaya)")
            if any(w in text_corpus for w in ["heavy limbs", "gaurava", "lethargy", "morning sluggishness"]):
                candidates["Anidra"]["score"] += 2
                candidates["Anidra"]["distinguishing_positives"].append("Nocturnal sleep onset delay with morning heaviness indicates inverted circadian Tandra")

        # 3. Cephalalgia & Migraine (Shiroroga / Ardhavabhedaka)
        has_headache = any(w in text_corpus for w in [
            "headache", "head ache", "head pain", "migraine", "shiras", "shiro",
            "temple pain", "throbbing head", "ardhavabhedaka", "suryavarta", "half head"
        ])
        if has_headache:
            candidates["Shiroroga"]["score"] += 4
            candidates["Shiroroga"]["hallmarks"].append("Shiroruk / Shirashula (cranial pain, throbbing sensation and temporal sensitivity)")
            if any(w in text_corpus for w in ["migraine", "one side", "half", "throbbing", "nausea", "light sensitivity", "photophobia", "vomiting"]):
                candidates["Shiroroga"]["score"] += 3
                candidates["Shiroroga"]["distinguishing_positives"].append("Unilateral throbbing pain with sensory photophobia characterizes classical Ardhavabhedaka")

        # 4. Joint Rheumatism (Amavata)
        has_joint = any(w in text_corpus for w in ["joint", "sandhi", "knee", "wrist", "ankle", "finger", "elbow", "joints", "knees", "wrists", "arthritis", "rheumatoid"])
        has_stiffness = any(w in text_corpus for w in ["stiff", "stiffness", "stabdhata", "graha"])
        has_swelling = any(w in text_corpus for w in ["swell", "swelling", "shotha", "edema", "inflamm"])
        if (has_joint and (has_stiffness or has_swelling)) or "amavata" in text_corpus:
            candidates["Amavata"]["score"] += 3
            candidates["Amavata"]["hallmarks"].append("Joint pain with active swelling and morning stiffness")
            if any(w in text_corpus for w in ["stiffness > 1 hour", "morning stiffness > 1 hour", "> 1 hour", ">1 hour", "greater than 1 hour"]):
                candidates["Amavata"]["score"] += 2
                candidates["Amavata"]["distinguishing_positives"].append("Prolonged morning stiffness (>1 hr) classically distinguishes Amavata from simple Sandhigata Vata")

        # 5. Degenerative Osteoarthritis (Sandhigata Vata)
        if any(w in text_corpus for w in ["crepitus", "grating", "crackling", "wear and tear", "degenerative", "osteoarthritis", "sandhigata"]):
            candidates["Sandhigata Vata"]["score"] += 4
            candidates["Sandhigata Vata"]["hallmarks"].append("Crepitus (Sandhi Sphutana) on movement")
            if any(w in text_corpus for w in ["relieved by oil", "relieved by warmth", "abhyanga helps"]):
                candidates["Sandhigata Vata"]["score"] += 2

        # 6. Sciatica & Lumbar Pain (Gridhrasi)
        if any(w in text_corpus for w in ["sciatica", "gridhrasi", "radiating pain", "shooting leg pain", "back pain", "lower back", "katisula", "lumbar", "disc"]):
            candidates["Gridhrasi"]["score"] += 5
            candidates["Gridhrasi"]["hallmarks"].append("Kati-Prishta shula radiating down posterior aspect of thigh and calf (Gridhrasi)")

        # 7. Gout & Uric Acid (Vatarakta)
        if any(w in text_corpus for w in ["gout", "uric acid", "vatarakta", "big toe", "burning joint", "toe pain", "burning foot", "podagra"]):
            candidates["Vatarakta"]["score"] += 5
            candidates["Vatarakta"]["hallmarks"].append("Severe acute burning joint pain localized to peripheral digits (Vatarakta)")

        # 8. Frozen Shoulder & Cervical (Apabahuka)
        if any(w in text_corpus for w in ["frozen shoulder", "shoulder pain", "shoulder stiffness", "apabahuka", "arm pain", "cannot lift arm", "cervical", "neck pain", "manyastambha"]):
            candidates["Apabahuka"]["score"] += 5
            candidates["Apabahuka"]["hallmarks"].append("Severe restriction of arm elevation and shoulder joint stiffness (Apabahuka)")

        # 9. Tremors & Parkinsonism (Kampavata)
        if any(w in text_corpus for w in ["tremor", "tremors", "shaking hand", "shaking hands", "kampavata", "trembling", "parkinson", "involuntary movement", "vepathu"]):
            candidates["Kampavata"]["score"] += 5
            candidates["Kampavata"]["hallmarks"].append("Involuntary rhythmic tremors and motor instability (Kampavata / Vepathu)")

        # 10. Malabsorption & Gut (Grahani Dosha)
        if any(w in text_corpus for w in ["bloat", "indigestion", "loose stool", "grahani", "ibs", "alternating bowel", "undigested", "gas", "post-meal bloating"]):
            candidates["Grahani Dosha"]["score"] += 4
            candidates["Grahani Dosha"]["hallmarks"].append("Post-prandial bloating and altered bowel evacuation")

        # 11. Acid Reflux (Amlapitta)
        if any(w in text_corpus for w in ["heartburn", "acid", "burning in chest", "sour burp", "amlapitta", "vidaha", "acid reflux", "sour taste", "acidity"]):
            candidates["Amlapitta"]["score"] += 5
            candidates["Amlapitta"]["hallmarks"].append("Hrid-kantha daha (burning in chest/throat) and sour eructations")

        # 12. Colitis & Dysentery (Pravahika)
        if any(w in text_corpus for w in ["colitis", "mucus in stool", "pravahika", "ulcerative colitis", "blood in stool", "tenesmus", "cramping stool", "dysentery"]):
            candidates["Pravahika"]["score"] += 5
            candidates["Pravahika"]["hallmarks"].append("Cramping rectal urgency with mucus and blood evacuation (Pravahika / Raktatisara)")

        # 13. Piles & Fissures (Arshas)
        if any(w in text_corpus for w in ["piles", "hemorrhoid", "hemorrhoids", "arshas", "fissure", "anal fissure", "rectal pain", "bleeding during stool"]):
            candidates["Arshas"]["score"] += 5
            candidates["Arshas"]["hallmarks"].append("Anorectal mass, painful evacuation and rectal bleeding (Arshas / Parikartika)")

        # 14. Jaundice & Hepatic (Kamala)
        if any(w in text_corpus for w in ["jaundice", "kamala", "yellow eyes", "yellow skin", "dark urine", "liver", "hepatitis", "fatty liver"]):
            candidates["Kamala"]["score"] += 5
            candidates["Kamala"]["hallmarks"].append("Haridra Netra / Mutra (jaundice sclera) with sluggish Pitta elimination")

        # 15. Diabetes & Glycemic (Prameha)
        if any(w in text_corpus for w in ["frequent urine", "turbid urine", "thirst", "diabetes", "prameha", "sugar", "excessive thirst", "sweet urine"]):
            candidates["Prameha"]["score"] += 4
            candidates["Prameha"]["hallmarks"].append("Prabhuta-avila mutrata (frequent turbid urination) and polydipsia")

        # 16. Obesity & Weight (Sthaulya)
        if any(w in text_corpus for w in ["weight gain", "obese", "obesity", "sthaulya", "medoroga", "heavy body", "fat", "excessive fat"]):
            candidates["Sthaulya"]["score"] += 4
            candidates["Sthaulya"]["hallmarks"].append("Excessive adipose deposition (Medas) with exertional breathlessness")

        # 17. Anemia (Pandu Roga)
        if any(w in text_corpus for w in ["pallor", "pale", "anemia", "pandu", "low hemoglobin"]) and not has_sports:
            candidates["Pandu Roga"]["score"] += 4
            candidates["Pandu Roga"]["hallmarks"].append("Generalized pallor (Panduta) and exertional exhaustion")

        # 18. Asthma & Wheezing (Tamaka Shwasa)
        if any(w in text_corpus for w in ["wheezing", "breathlessness", "asthma", "tamaka shwasa", "cannot breathe in night", "orthopnea"]):
            candidates["Tamaka Shwasa"]["score"] += 5
            candidates["Tamaka Shwasa"]["hallmarks"].append("Pratiloma Vata causing wheezing and breathlessness relieved sitting upright")

        # 19. Cough & Bronchitis (Kasa / Pratishyaya)
        if any(w in text_corpus for w in ["cough", "dry cough", "kasa", "throat irritation", "sinusitis", "runny nose", "sneezing", "pratishyaya"]):
            candidates["Kasa"]["score"] += 4
            candidates["Kasa"]["hallmarks"].append("Urdhva Vata irritation in Pranavaha channels causing persistent cough and nasal discharge")

        # 20. Psoriasis & Eczema (Kushtha)
        if any(w in text_corpus for w in ["skin", "itching", "rash", "eczema", "psoriasis", "kushtha", "kandu", "scaling", "silvery scales"]):
            candidates["Kushtha"]["score"] += 5
            candidates["Kushtha"]["hallmarks"].append("Kandu (itching), discoloration (Vaivarnya), scaling and cutaneous plaques")

        # 21. Alopecia & Hair Loss (Khalitya)
        if any(w in text_corpus for w in ["hair fall", "hair loss", "khalitya", "baldness", "indralupta", "hair thinning", "dandruff"]):
            candidates["Khalitya"]["score"] += 5
            candidates["Khalitya"]["hallmarks"].append("Roma-kupa obstruction with accelerated hair follicular shedding (Khalitya)")

        # 22. Renal Stones & Dysuria (Mutrashmari)
        if any(w in text_corpus for w in ["kidney stone", "kidney stones", "ashmari", "urinary burning", "burning urination", "dysuria", "flank pain", "stone"]):
            candidates["Mutrashmari"]["score"] += 5
            candidates["Mutrashmari"]["hallmarks"].append("Lithotriptic colic in Basti and severe dysuria (Mutrashmari / Mutrakrichhra)")

        # 23. Thyroid Goiter & Glands (Galaganda)
        if any(w in text_corpus for w in ["thyroid", "goiter", "galaganda", "neck swelling", "gland", "gandamala", "hypothyroid"]):
            candidates["Galaganda"]["score"] += 5
            candidates["Galaganda"]["hallmarks"].append("Glandular swelling in Jatru-Urdhva region with metabolic sluggishness (Galaganda)")

        # 24. Anxiety & Panic (Chittodvega)
        if any(w in text_corpus for w in ["anxiety", "panic", "palpitations", "chittodvega", "restless", "nervous", "fear", "racing heart"]):
            candidates["Chittodvega"]["score"] += 4
            candidates["Chittodvega"]["hallmarks"].append("Manovaha Srotodushti with Prana Vata and Rajas excitation causing anxiety and tachycardia")

        # 25. Fever (Jwara)
        if any(w in text_corpus for w in ["fever", "chills", "high temperature", "jwara", "shivering", "feverish"]):
            candidates["Jwara"]["score"] += 5
            candidates["Jwara"]["hallmarks"].append("Santapa (elevated body temperature) and Swedavaha Srotorodha")

        # 26. Hypermetabolism / Inability to Gain Weight (Karshya / Atyagni / Bhasmaka)
        has_karshya = any(w in text_corpus for w in [
            "metabolism", "fast metabolism", "hyperactive metabolism", "cannot gain weight",
            "unable to gain weight", "unable to put on weight", "not gaining weight",
            "weight", "underweight", "thin", "skinny", "karshya", "atyagni", "bhasmaka",
            "eat a lot", "eat so much", "hungry all the time", "always hungry",
            "ravenous", "emaciat", "atiagni", "dhatu kshaya", "dhatukshaya"
        ])
        if has_karshya:
            candidates["Karshya"]["score"] += 6
            candidates["Karshya"]["hallmarks"].append("Hypermetabolic Atyagni / Bhasmaka — food consumed rapidly without Dhatu nourishment (Dhatukshaya)")
            if any(w in text_corpus for w in ["metabolism", "fast metabolism", "hyperactive metabolism"]):
                candidates["Karshya"]["score"] += 3
                candidates["Karshya"]["distinguishing_positives"].append("Explicit self-reporting of fast or hyperactive metabolism (Tikshna Jatharagni) with inability to gain weight is pathognomonic of Atyagni / Bhasmaka Roga")
            if any(w in text_corpus for w in ["weight", "gain weight", "unable to gain", "cannot gain"]):
                candidates["Karshya"]["score"] += 2
                candidates["Karshya"]["distinguishing_positives"].append("Inability to gain weight despite adequate intake indicates Dhatu-Paka Vikruti (tissue-nourishment failure)")
            if any(w in text_corpus for w in ["always hungry", "ravenous", "eat a lot", "eat so much"]):
                candidates["Karshya"]["score"] += 2
                candidates["Karshya"]["distinguishing_positives"].append("Excessive appetite (Bhasmaka) despite emaciation confirms Tikshna Agni / Vata-Pitta hyperactivity")

        # ------------------------------------------------------------------
        # RAG SEMANTIC GROUNDING BOOST
        # ------------------------------------------------------------------
        try:
            rag_results = self.rag.search(query=text_corpus, top_k=3)
            for r in rag_results:
                if r.relevance_score >= 0.7:
                    if r.shloka_id == "CS_SID_09_007" and candidates["Shiroroga"]["score"] > 0:
                        candidates["Shiroroga"]["score"] += 2
                        candidates["Shiroroga"]["distinguishing_positives"].append("Grounded in Charaka Siddhi 9/7 (Ardhavabhedaka / Migraine)")
                    elif r.shloka_id == "CS_CHI_28_056" and candidates["Gridhrasi"]["score"] > 0:
                        candidates["Gridhrasi"]["score"] += 2
                    elif r.shloka_id == "CS_CHI_29_030" and candidates["Vatarakta"]["score"] > 0:
                        candidates["Vatarakta"]["score"] += 2
                    elif r.shloka_id == "SS_CHI_07_012" and candidates["Mutrashmari"]["score"] > 0:
                        candidates["Mutrashmari"]["score"] += 2
        except Exception:
            pass

        # ------------------------------------------------------------------
        # RANKING & DECISION
        # ------------------------------------------------------------------
        sorted_candidates = sorted(candidates.values(), key=lambda c: c["score"], reverse=True)
        top = sorted_candidates[0]
        second = sorted_candidates[1] if len(sorted_candidates) > 1 else None

        if top["score"] >= 4:
            disease_key = top["disease_key"]
            confidence_level = "more consistent with"
        elif top["score"] >= 2:
            disease_key = top["disease_key"]
            confidence_level = "possible"
        else:
            # DYNAMIC EXTRACTION: If user typed specific complaints that didn't match pre-coded candidates
            # Do NOT default to Vatavyadhi! We detect whether Vata, Pitta, or Kapha signs are described.
            has_vata_signs = any(w in text_corpus for w in ["pain", "stiff", "dry", "numb", "cold", "cramp", "ache", "weak"])
            has_pitta_signs = any(w in text_corpus for w in ["burn", "burning", "hot", "heat", "red", "acidity", "sour", "fever"])
            has_kapha_signs = any(w in text_corpus for w in ["heavy", "heaviness", "swell", "swelling", "mucus", "sluggish", "itching"])

            if has_pitta_signs and has_vata_signs:
                disease_key = "Shiroroga" if any(w in text_corpus for w in ["head", "eye", "temple"]) else "Vatarakta"
                confidence_level = "possible"
            elif has_pitta_signs:
                disease_key = "Amlapitta"
                confidence_level = "possible"
            elif has_vata_signs:
                disease_key = "Gridhrasi" if any(w in text_corpus for w in ["back", "leg", "sciatica"]) else ("Mamsagata Vata" if has_sports else "Sandhigata Vata")
                confidence_level = "possible"
            elif has_kapha_signs:
                disease_key = "Grahani Dosha"
                confidence_level = "possible"
            else:
                # Still insufficient -> use the clean undifferentiated presentation protocol
                disease_key = "Asiddha Roganirnaya"
                confidence_level = "insufficient information"

        # If undifferentiated was chosen by fallback
        if disease_key == "Asiddha Roganirnaya":
            return {
                "probable_vyadhi": "Asiddha Roganirnaya — Lakshana Clarification Needed (Undifferentiated Clinical Presentation)",
                "disease_key": "Asiddha Roganirnaya",
                "confidence_level": "insufficient information",
                "differentials": [
                    {
                        "disease_key": "Asiddha Roganirnaya",
                        "label": "Undifferentiated Presentation (Requires Structured Prashna Pariksha)",
                        "confidence": "insufficient information",
                        "score": 0,
                        "hallmarks": ["Sparse or non-specific clinical data presented so far"],
                        "distinguishing_factors": ["Pending anatomical locus (Sthana), sensory character (Vedana Svarupa), and Agni assessment"]
                    }
                ],
                "uncertainty_notes": [
                    f"Sparse Lakshana Presentation: Clinical data collected so far ('{text_corpus[:80]}...') lacks specific anatomical loci and modal triggers. Complete the active inquiry below to establish an authentic classical diagnosis."
                ],
                "samprapti_ghatakas": {
                    "dosha": ["Anirdharita Dosha (Pending Clinical Clarification)"],
                    "dushya": ["Anirdharita Dushya"],
                    "agni": agni or "Vishamagni",
                    "ama": False,
                    "srotas": ["Sarva Sharira"],
                    "sroto_dushti_prakara": "Prashna Pariksha Apekshita (Inquiry Required)",
                    "adhisthana": "Undifferentiated"
                },
                "shat_kriya_kala": {
                    "1_sanchaya": "Mild early Dosha accumulation suspected; specific vitiated Dosha pending clinical clarification.",
                    "2_prakopa": "Provocation markers not yet anatomically localized.",
                    "3_prasara": "Circulation through systemic channels without marked localized Khavaigunya.",
                    "4_sthana_samshraya": "Site of anatomical lodgment requires inquiry into exact pain/symptom distribution.",
                    "5_vyakti": "Current manifestation consists of non-specific general symptoms.",
                    "6_bheda": "Chronicity and complication stage to be evaluated following clinical examination."
                },
                "chikitsa_sutra": "Prashna Pariksha, Rogi-Roga Pariksha, Deepana-Pachana (Shunthi-Sadhita Jala), and Nidana Parivarjana (Charaka Vimana Sthana 8/83).",
                "pathya": [
                    "Drink warm water boiled with fresh ginger (Shunthi Jala) to support baseline Agni",
                    "Freshly prepared, easily digestible warm vegetarian meals (Moong dal khichdi)",
                    "Maintain regular sleep hours and avoid extreme temperature drafts until evaluation"
                ],
                "apathya": [
                    "Heavy, oily, stale, or refrigerated foods",
                    "Daytime sleep (Divasvapna) and staying awake past midnight",
                    "Suppression of natural physiological urges (Vega-Dharana)"
                ],
                "recommended_formulations": ["Sudarshana Churna"],
                "knowledge_graph_context": self.kg.trace_samprapti("Jwara")
            }

        # Build differential items list
        differential_list = []
        for c in sorted_candidates:
            if c["score"] > 0:
                conf = "more consistent with" if c["score"] >= 4 else ("possible" if c["score"] >= 2 else "low probability")
                differential_list.append({
                    "disease_key": c["disease_key"],
                    "label": c["name"],
                    "confidence": conf,
                    "score": c["score"],
                    "hallmarks": c["hallmarks"],
                    "distinguishing_factors": c["distinguishing_positives"]
                })

        # Uncertainty & distinguishing notes
        uncertainty_notes = []
        if disease_key == "Shiroroga":
            uncertainty_notes.append("Clinical Distinction: Unilateral throbbing pain worse with sunlight, noise, and hunger indicates Ardhavabhedaka (Vata-Pitta). If diffuse band-like occipital ache without nausea dominates, evaluate for Vata-Kaphaja tension cephalalgia.")
        elif disease_key == "Gridhrasi":
            uncertainty_notes.append("Clinical Distinction: Pain radiating from lower back down the posterior thigh and calf characterizes Gridhrasi. Assess whether coughing or sneezing increases radicular pain (Vataja compression).")
        elif disease_key == "Vatarakta":
            uncertainty_notes.append("Clinical Distinction: Sudden severe burning pain and erythema in peripheral joints (great toe/ankle) indicates Vatarakta. Strictly rule out simple trauma or septic monoarthritis.")
        elif disease_key == "Apabahuka":
            uncertainty_notes.append("Clinical Distinction: Restricted active and passive glenohumeral elevation indicates Apabahuka. Differentiate from cervical radicular pain radiating into forearm.")
        elif disease_key == "Mutrashmari":
            uncertainty_notes.append("Clinical Distinction: Acute spasmodic flank pain radiating toward groins with dysuria suggests urinary calculi (Mutrashmari). Verify absence of hematuria.")
        elif disease_key == "Chittodvega":
            uncertainty_notes.append("Clinical Distinction: Palpitations and restlessness arising from mental worry indicate Manovaha Srotodushti. Ensure organic cardiac etiologies have been clinically excluded.")
        elif disease_key == "Mamsagata Vata":
            uncertainty_notes.append("Clinical Distinction: Muscle strain following athletic exertion shows pain on active muscle contraction with preserved joint space. If joint effusion is present, evaluate for Sandhigata Vata.")
        elif disease_key == "Amavata":
            uncertainty_notes.append("Clinical Distinction: Amavata is characterized by inflammatory swelling and morning stiffness lasting > 1 hour with positive Ama signs (coated tongue, Mandagni).")

        # ------------------------------------------------------------------
        # PATHOLOGY GHATAKAS & SHAT KRIYA KALA DERIVATION
        # ------------------------------------------------------------------
        if disease_key == "Shiroroga":
            vyadhi = "Shiroroga / Ardhavabhedaka (Vata-Pitta Vascular Cephalea / Migraine)"
            dosha_list = ["Prana Vata", "Pachaka / Alochaka Pitta"]
            dushya_list = ["Rakta Dhatu", "Majja Dhatu", "Sira", "Snayu"]
            srotas_list = ["Raktavaha Srotas", "Majjavaha Srotas", "Manovaha Srotas"]
            sroto_dushti = "Sanga (Micro-vascular Spasm) and Vimarga Gamana"
            adhisthana = "Uttamanga (Shiras / Cranial Vasculature)"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Vata and Pitta accumulate from mental strain, irregular sleep, skipping meals, and screen fatigue.",
                "2_prakopa": "Provocation of hot, sharp Pitta and mobile Vata causing vascular reactivity.",
                "3_prasara": "Vitiated Doshas circulate through cephalic siras (cranial blood vessels).",
                "4_sthana_samshraya": "Doshas lodge in one half of the cranial vault (Khavaigunya in cranial vessels).",
                "5_vyakti": "Manifestation of unilateral throbbing pain, nausea, photophobia, and temporal tenderness.",
                "6_bheda": "Chronic recurring migraine attacks, sensory hypersensitivity, and cognitive fatigue."
            }
            chikitsa_sutra = "Nidana Parivarjana, Shirobhyanga, Nasya, Sheetala-Snigdha Ahara, and Pathyadi Kwatha (Charaka Siddhi Sthana 9/7)."
            pathya = [
                "Consume warm A2 cow ghee with meals to pacify both Vata and Pitta",
                "Black raisins (Draksha), pomegranate (Dadima), and sweet seasonal fruits",
                "Gentle head massage with warm coconut oil before sleep; restful dark room during attacks",
                "Regular meal times — strictly avoid fasting or skipping breakfast"
            ]
            apathya = [
                "Pungent chilies, fermented foods, vinegar, and sour curd",
                "Direct exposure to harsh sunlight (Atapa) and hot dry winds",
                "Staying awake late at night and prolonged screen viewing without breaks",
                "Suppression of hunger, sleep, or emotional tears (Vegadharana)"
            ]
            recommended_formulations = ["Pathyadi Kwatha", "Brahmi Vati"]

        elif disease_key == "Gridhrasi":
            vyadhi = "Gridhrasi / Katisula (Sciatica & Lumbar Spondylogenic Radiculopathy)"
            dosha_list = ["Apana Vata", "Vyana Vata", "Kapha (in Vata-Kaphaja type)"]
            dushya_list = ["Asthi Dhatu", "Majja Dhatu", "Kandara", "Snayu"]
            srotas_list = ["Asthivaha Srotas", "Majjavaha Srotas", "Vatavaha Srotas"]
            sroto_dushti = "Sanga (Nerve Root Entrapment) and Sankocha"
            adhisthana = "Kati (Lumbar Region), Sphik (Gluteus), and Pada (Lower Extremity)"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Vata accumulates in lumbar spine due to heavy lifting, prolonged sitting, and cold drafts.",
                "2_prakopa": "Aggravation of dry, cold, rough qualities of Vata in the lumbar vertebrae.",
                "3_prasara": "Provoked Apana Vata radiates into major sciatic nerve conduits (Kandara).",
                "4_sthana_samshraya": "Lodgment in lumbosacral junction and sciatic pathway (Khavaigunya).",
                "5_vyakti": "Sharp shooting pain radiating from gluteal region down posterior thigh, calf, and heel.",
                "6_bheda": "Motor weakness, foot drop, numbness, and chronic postural gait deformity."
            }
            chikitsa_sutra = "Snehana, Svedana (Patra Pinda), Basti Chikitsa, Siravyadha / Agnikarma, and Maharasnadi Kwatha (Charaka Chikitsa 28/56)."
            pathya = [
                "Local warm oil application with Sahacharadi or Mahanarayana Taila followed by hot fomentation",
                "Warm cooked foods seasoned with garlic (Lashuna), ginger, and cow's ghee",
                "Gentle lumbar support, firm sleeping mattress, and ergonomic posture"
            ]
            apathya = [
                "Lifting heavy weights, sudden bending forward, and running on uneven ground",
                "Cold showers, air-conditioned drafts directly on back, and fasting",
                "Dry, rough, stale, and refrigerated foods"
            ]
            recommended_formulations = ["Maharasnadi Kwatha", "Yogaraj Guggulu"]

        elif disease_key == "Vatarakta":
            vyadhi = "Vatarakta (Gouty Arthritis & Microvascular Inflammation / Hyperuricemia)"
            dosha_list = ["Vyana Vata", "Ranjaka / Bhrajaka Pitta", "Rakta Dhatu"]
            dushya_list = ["Rakta Dhatu", "Sandhi Snayu", "Kandara"]
            srotas_list = ["Raktavaha Srotas", "Asthivaha Srotas"]
            sroto_dushti = "Vimarga Gamana and Sanga (Micro-crystal Deposition)"
            adhisthana = "Padangushta (Great Toe), Gulpha (Ankle), and Peripheral Joints"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Excessive intake of sour, salty, pungent food, and alcohol accumulates Pitta and Rakta.",
                "2_prakopa": "Simultaneous aggravation of Vata due to erratic lifestyle blocks blood channels.",
                "3_prasara": "Vitiated Rakta and Vata circulate together throughout peripheral micro-vessels.",
                "4_sthana_samshraya": "Crystals lodge in small joint capsules of toes, ankles, and fingers (Khavaigunya).",
                "5_vyakti": "Intense burning pain, erythema, swelling, and extreme touch sensitivity in great toe/joint.",
                "6_bheda": "Tophi formation, joint destruction, and recurrent chronic inflammatory gout."
            }
            chikitsa_sutra = "Raktamokshana, Virechana, Guduchi Rasayana, and Kaishore Guggulu (Charaka Chikitsa 29/30)."
            pathya = [
                "Old barley (Yava), Shali rice, and green gram (Mudga) soup",
                "Guduchi decoction and fresh coconut water to clear metabolic uric toxins",
                "Pinda Taila external gentle application for soothing burning sensations"
            ]
            apathya = [
                "Red meat, seafood, curd, fermented batters, and alcohol",
                "Pungent chilies, vinegar, and excessive salt",
                "Day sleep and sudden exposure to heat followed by ice"
            ]
            recommended_formulations = ["Kaishore Guggulu"]

        elif disease_key == "Apabahuka":
            vyadhi = "Apabahuka / Manyastambha (Frozen Shoulder & Cervical Spondylosis)"
            dosha_list = ["Vata (Vyana & Udana)", "Kapha (Shleshaka)"]
            dushya_list = ["Snayu", "Kandara", "Mamsa Dhatu", "Amsa Sandhi"]
            srotas_list = ["Asthivaha Srotas", "Mamsavaha Srotas"]
            sroto_dushti = "Sankocha (Contracture) and Sanga"
            adhisthana = "Amsa Sandhi (Glenohumeral Joint) and Manya (Cervical Spine)"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Vata accumulates in shoulder girdle from repetitive strain, poor neck posture, or cold exposure.",
                "2_prakopa": "Vata provokes depletion of Shleshaka Kapha (synovial fluid) in glenohumeral capsule.",
                "3_prasara": "Vitiated Vyana Vata causes spasm in pericapsular tendons and ligaments.",
                "4_sthana_samshraya": "Lodges in Amsa Sandhi ligaments producing fibrous capsular contraction.",
                "5_vyakti": "Progressive restriction of arm abduction and external rotation with nocturnal aching.",
                "6_bheda": "Complete capsular fibrosis (frozen shoulder) and deltoid muscle disuse atrophy."
            }
            chikitsa_sutra = "Nasya, Greeva Basti, Patra Pinda Sveda, Taila Abhyanga, and Maharasnadi Kwatha (Sushruta Nidana 1/82)."
            pathya = [
                "Local massage with warm Karpasastyadi or Mahamasha oil followed by steam fomentation",
                "Gentle pendulum and wall-climbing mobility exercises within pain-free range",
                "Warm nourishing soups seasoned with garlic, cumin, and cow's ghee"
            ]
            apathya = [
                "Sleeping with high/hard pillows or sleeping on the affected shoulder",
                "Cold water baths and direct exposure to air conditioning drafts",
                "Sudden jerky overhead lifting"
            ]
            recommended_formulations = ["Maharasnadi Kwatha", "Yogaraj Guggulu"]

        elif disease_key == "Mutrashmari":
            vyadhi = "Mutrashmari / Mutrakrichhra (Renal Calculi, Nephrolithiasis & Dysuria)"
            dosha_list = ["Apana Vata", "Kapha", "Pitta"]
            dushya_list = ["Mutra", "Meda Dhatu", "Kleda"]
            srotas_list = ["Mutravaha Srotas"]
            sroto_dushti = "Sanga (Urinary Tract Obstruction) and Vidaha"
            adhisthana = "Basti (Kidneys & Urinary Bladder), Mutramarga"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Insufficient water intake and dry, incompatible diet precipitate metabolic crystal nuclei.",
                "2_prakopa": "Apana Vata drying action coagulates Kapha and Pitta minerals in renal calyces.",
                "3_prasara": "Crystals coalesce into calculus aggregates moving into ureteric passages.",
                "4_sthana_samshraya": "Stone lodges in ureter or bladder neck causing spasm and acute obstruction (Khavaigunya).",
                "5_vyakti": "Severe colicky flank pain radiating to groin, painful burning urination, and turbid urine.",
                "6_bheda": "Hydronephrosis, hematuria, and chronic recurrent urolithiasis."
            }
            chikitsa_sutra = "Bhedana (lithotripsy), Mutrala (diuresis), Vatanulomana, and Gokshuradi Guggulu (Sushruta Chikitsa 7/12)."
            pathya = [
                "Abundant warm water, barley water (Yava Udaka), and fresh tender coconut water",
                "Kulatthasurupa (horse gram soup) which acts as a classical litholytic food",
                "Cooked bottle gourd, cucumber, and watermelon"
            ]
            apathya = [
                "Dehydration, holding back urine urge (Mutravega-Dharana), and excessive dry roasted snacks",
                "Oxalate-rich excess spinach, tomatoes, and red meat",
                "Excessive sedentary habits under direct heat"
            ]
            recommended_formulations = ["Gokshuradi Guggulu", "Chandraprabha Vati"]

        elif disease_key == "Chittodvega":
            vyadhi = "Chittodvega / Manovaha Srotodushti (Generalized Anxiety, Panic & Palpitations)"
            dosha_list = ["Prana Vata", "Sadhaka Pitta", "Rajas Manas"]
            dushya_list = ["Manas", "Rasa Dhatu", "Ojas", "Hridaya"]
            srotas_list = ["Manovaha Srotas", "Rasavaha Srotas"]
            sroto_dushti = "Vimarga Gamana and Atipravritti (Hyper-reactive Nervous Signaling)"
            adhisthana = "Hridaya (Seat of Chetana) and Mastishka (Brain Conduits)"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Mental stress, chronic worry, and lack of sleep accumulate Rajas and Vata in Manas.",
                "2_prakopa": "Provocation of Prana Vata disturbs neuro-cardiac equilibrium.",
                "3_prasara": "Agitated Vata circulates through the ten Dhamanis originating from the Hridaya.",
                "4_sthana_samshraya": "Lodges in cardiac sensory nodes and cerebral conduits (Khavaigunya).",
                "5_vyakti": "Paroxysms of anxiety, sudden palpitations (Hrit-kampa), fearfulness, and tremors.",
                "6_bheda": "Chronic anxiety neurosis, phobias, and severe autonomic dysregulation."
            }
            chikitsa_sutra = "Daivavyapashraya, Satvavajaya, Medhya Rasayana, Shirodhara, and Saraswatarishta (Charaka Sharira 4/36)."
            pathya = [
                "Warm A2 cow's milk with 1/2 tsp cow's ghee and a pinch of cardamom and nutmeg before sleep",
                "Daily 15 minutes of Pranayama (Anuloma-Viloma & Bhramari) to calm agitated Prana",
                "Shiro-Abhyanga and Padabhyanga (head and foot oil massage) with sesame oil"
            ]
            apathya = [
                "Caffeine, coffee, energy drinks, and excessive screen news",
                "Skipping meals, eating on the run, and late-night bingeing",
                "Isolation, overworking without rest, and staying awake past midnight"
            ]
            recommended_formulations = ["Brahmi Vati", "Ashwagandha Churna"]

        elif disease_key == "Khalitya":
            vyadhi = "Khalitya / Indralupta (Alopecia, Hair Fall & Scalp Dermatitis)"
            dosha_list = ["Bhrajaka Pitta", "Vyana Vata", "Kapha (blocks hair pores)"]
            dushya_list = ["Asthi Dhatu", "Rakta Dhatu", "Roma-Kupa (Hair Follicles)"]
            srotas_list = ["Asthivaha Srotas", "Swedavaha Srotas"]
            sroto_dushti = "Sanga (Follicular Duct Blockage)"
            adhisthana = "Shiro-Twak (Scalp Skin & Hair Follicles)"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Excessive heat, stress, and salty/sour diet accumulate Pitta in the scalp.",
                "2_prakopa": "Pitta combined with Vata scorches the hair roots (Dahana of Roma-Kupa).",
                "3_prasara": "Kapha and Rakta subsequently block the pores preventing new hair generation.",
                "4_sthana_samshraya": "Obstruction firmly established in the scalp dermal layers.",
                "5_vyakti": "Accelerated hair shedding, thinning, scalp itching, and dandruff flakes.",
                "6_bheda": "Complete follicular atrophy, patchy baldness (Indralupta), or generalized alopecia."
            }
            chikitsa_sutra = "Shiro-Abhyanga, Nasya, Asthidhatu-Poshana, Pitta-Shamana, and Bhringaraja formulations (Ashtanga Hridaya Uttara 23/28)."
            pathya = [
                "Regular gentle scalp massage with Bhringamalakadi or Coconut oil 2-3 times a week",
                "Amalaki (Indian gooseberry) juice or powder daily to nourish Asthi and Rakta",
                "Adequate protein intake via green gram soup and soaked almonds"
            ]
            apathya = [
                "Harsh chemical shampoos, frequent blow-drying, and washing hair with very hot water",
                "Excessively salty, fermented, and deeply fried foods",
                "Unmanaged chronic stress and lack of sleep"
            ]
            recommended_formulations = ["Arogyavardhini Vati", "Ashwagandha Churna"]

        elif disease_key == "Arshas":
            vyadhi = "Arshas / Parikartika (Hemorrhoidal Pathology & Anal Fissures)"
            dosha_list = ["Apana Vata", "Pachaka Pitta", "Kaphaja Mamsa"]
            dushya_list = ["Mamsa Dhatu", "Meda Dhatu", "Twak", "Guda Valis"]
            srotas_list = ["Purishavaha Srotas", "Raktavaha Srotas"]
            sroto_dushti = "Sanga (Venous Congestion) and Granthi"
            adhisthana = "Guda (Anal Canal & Sphincter Valis)"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Chronic constipation, straining, and low-fiber dry food accumulate Apana Vata.",
                "2_prakopa": "Straining forces downward pressure on the three Guda Valis.",
                "3_prasara": "Venous plexuses dilate under chronic rectal hypertension.",
                "4_sthana_samshraya": "Venous and muscular engorgement in anal cushions (Khavaigunya).",
                "5_vyakti": "Painful bowel evacuation, bleeding per rectum, prolapse, and burning fissure pain.",
                "6_bheda": "Thrombosis, ulceration, chronic skin tags, and secondary anemia."
            }
            chikitsa_sutra = "Vatanulomana, Deepana, Agni-Vardhana, Avagaha Sveda (Sitz bath), and Triphala formulations (Charaka Chikitsa 14/52)."
            pathya = [
                "Abundant soluble dietary fiber: Papaya, soaked prunes, figs, and green leafy vegetables",
                "Warm water Sitz bath (Avagaha) for 10 minutes post-evacuation to relieve sphincter spasm",
                "Fresh buttermilk (Takra) seasoned with roasted cumin and rock salt"
            ]
            apathya = [
                "Straining at stool, sitting on toilet for prolonged periods with smartphone",
                "Excessive chili, dried meat, baked bakery items, and dry snacks",
                "Suppression of defecation urges (Purisha Vega-Dharana)"
            ]
            recommended_formulations = ["Triphala Guggulu", "Avipattikar Churna"]

        elif disease_key == "Mamsagata Vata":
            vyadhi = "Mamsagata Vata / Snayu-Kandara Abhighata (Exertional Myalgia & Sports Strain)"
            dosha_list = ["Vyana Vata", "Apana Vata"]
            dushya_list = ["Mamsa Dhatu", "Snayu", "Kandara"]
            srotas_list = ["Mamsavaha Srotas", "Vatavaha Srotas", "Rasavaha Srotas"]
            sroto_dushti = "Sanga (Lactic & Metabolic Stagnation) and Kshaya (Micro-fiber Depletion)"
            adhisthana = "Uru (Thigh Musculature), Pindika (Calves), Snayu Bandhana"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Vata accumulation due to strenuous physical activity, rapid sprints, and dehydration.",
                "2_prakopa": "Provocation of cold, dry, mobile properties of Vata in skeletal muscle tissues.",
                "3_prasara": "Vitiated Vyana Vata spreads through Mamsavaha channels.",
                "4_sthana_samshraya": "Lodgment in stressed quadriceps/hamstring muscle fibers and tendinous insertions (Khavaigunya).",
                "5_vyakti": "Manifestation of localized thigh soreness, cramping (Pindikodveshtana), pain during gait, and post-exertional stiffness.",
                "6_bheda": "Chronic muscle weakness, myofascial trigger points, and recurrent strain vulnerability."
            }
            chikitsa_sutra = "Snehana (Taila Abhyanga), Svedana (Patra Pinda / Nadi Sveda), Mamsa-Balam, and Vatahara Chikitsa (Charaka Samhita Chi 28/75 & Sushruta Chi 4/8)."
            pathya = [
                "Local gentle massage with warm Mahanarayana or Sesame oil followed by warm water compress",
                "Warm A2 cow's milk with 1 tsp cow's ghee and a pinch of turmeric and Ashwagandha",
                "Nutritious warm green gram (Mudga) soup seasoned with ginger and cumin",
                "Adequate rest and gradual reconditioning before returning to competitive sports"
            ]
            apathya = [
                "Cold showers or ice-water baths immediately following hot exertion (causes severe Vata Sroto-rodha)",
                "Continuing strenuous sprinting or jumping without allowing muscle recovery",
                "Dry, cold, stale, and refrigerated foods"
            ]
            recommended_formulations = ["Yogaraj Guggulu", "Ashwagandha Churna"]

        elif disease_key == "Anidra":
            vyadhi = "Anidra / Nidraviparyaya (Circadian Rhythm Inversion & Kaphaja Tandra)"
            dosha_list = ["Prana Vata", "Tarpaka Kapha", "Rajas Manas"]
            dushya_list = ["Rasa Dhatu", "Majja Dhatu", "Manovaha Srotas"]
            srotas_list = ["Manovaha Srotas", "Rasavaha Srotas"]
            sroto_dushti = "Vimarga Gamana (Reversal of Circadian Flow) and Sanga"
            adhisthana = "Mastishka (Cranial Conduits), Hridaya (Seat of Chetana), Sarva Sharira"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Nocturnal Vata and mental Rajas accumulate due to late nights, screen stimulation, and erratic meal hours.",
                "2_prakopa": "Suppression of sleep urge (Nidra Vega-Dharana) severely provokes Prana Vata.",
                "3_prasara": "Vitiated Vata agitates the Manovaha channels and displaces Tarpaka Kapha.",
                "4_sthana_samshraya": "Lodges in the cerebral sensory faculties and seat of consciousness.",
                "5_vyakti": "Inability to initiate sleep at night, alternating with morning drowsiness, heavy head, and extreme lethargy (Gaurava).",
                "6_bheda": "Chronic circadian rhythm sleep disorder, cognitive fatigue, and impaired immune resilience."
            }
            chikitsa_sutra = "Padabhyanga, Shirobhyanga, Snigdha-Kshira Sevana, Dinacharya, and Nidra-Janana Chikitsa (Charaka Sutra 21/35 & Ashtanga Hridaya Su 2/1)."
            pathya = [
                "Padabhyanga: 5-minute warm sesame oil foot massage before sleep to draw agitated Prana downward",
                "Warm A2 milk boiled with a pinch of nutmeg (Jatiphala), cardamom, and 1/2 tsp ghee 30 mins before bed",
                "Morning exposure to direct sunlight within 30 minutes of waking to anchor the circadian cycle",
                "Consistent bedtime (by 10:30 PM) and wake time (by 6:30 AM)"
            ]
            apathya = [
                "Divasvapna (daytime naps), which perpetuate night-time sleep latency",
                "Screens, smartphones, and bright blue light in bed after 9:30 PM",
                "Caffeine, heavy fried dinners, and vigorous late-night exercise"
            ]
            recommended_formulations = ["Brahmi Vati", "Ashwagandha Churna"]

        elif disease_key == "Amavata":
            vyadhi = "Amavata (Rheumatoid / Inflammatory Joint Pathology)"
            dosha_list = ["Vata (Vyana & Apana)", "Kapha (Shleshaka)"]
            dushya_list = ["Rasa Dhatu", "Asthi Dhatu", "Sandhi Snayu"]
            srotas_list = ["Rasavaha Srotas", "Asthivaha Srotas"]
            sroto_dushti = "Sanga (Obstruction) and Vimarga Gamana"
            adhisthana = "Sandhi (Joints), Trika, Janu, and Hridaya"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Impaired Agni generates systemic endotoxin (Ama) in the gastrointestinal tract.",
                "2_prakopa": "Provoked Vata circulates Ama throughout the systemic bloodstream.",
                "3_prasara": "Ama and Vata spread via Rasavaha channels to peripheral joints.",
                "4_sthana_samshraya": "Lodgment in Shleshaka Kapha seats (synovial membranes and joint capsules).",
                "5_vyakti": "Bilateral morning stiffness lasting > 1 hour, pain (Vrishchika Damshavat), and warm swelling.",
                "6_bheda": "Joint ankylosis, deformities, and chronic inflammatory joint destruction."
            }
            chikitsa_sutra = "Langhana, Svedana (Valuka Sveda / Dry heat), Tikta-Deepana, Virechana, and Simhanada Guggulu (Ashtanga Hridaya Chi 21/42)."
            pathya = [
                "Warm ginger water (Shunthi Jala) and horse gram (Kulattha) soup",
                "Old barley (Purana Yava), garlic, and bitter gourd (Karela)",
                "Dry heat application (Valuka Sveda / warm sand bag fomentation)"
            ]
            apathya = [
                "Direct oil massage (Abhyanga) on actively swollen joints during acute inflammatory stage",
                "Curd (Dadhi), fish, cold water, and heavy unctuous foods",
                "Daytime sleeping (Divasvapna) which promotes Ama"
            ]
            recommended_formulations = ["Simhanada Guggulu"]

        elif disease_key == "Sandhigata Vata":
            vyadhi = "Sandhigata Vata (Osteoarthritis / Degenerative Joint Disease)"
            dosha_list = ["Vyana Vata", "Apana Vata"]
            dushya_list = ["Asthi Dhatu", "Majja Dhatu", "Sandhi Snayu"]
            srotas_list = ["Asthivaha Srotas", "Vatavaha Srotas"]
            sroto_dushti = "Kshaya (Depletion of Synovial Fluid) and Sanga"
            adhisthana = "Janu Sandhi (Knees), Kati, and Weight-bearing Joints"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Age-related Vata accumulation and wear-and-tear in cartilage.",
                "2_prakopa": "Aggravation of dry, cold, light properties of Vata.",
                "3_prasara": "Vata exhausts the unctuous Shleshaka Kapha in joint spaces.",
                "4_sthana_samshraya": "Erosion of articular cartilage and reduction of joint space.",
                "5_vyakti": "Crepitus (Sandhi Sphutana) on flexion/extension, dull ache, and brief morning stiffness.",
                "6_bheda": "Osteophyte formation, joint contracture, and gait restriction."
            }
            chikitsa_sutra = "Snehana (Taila Abhyanga), Svedana (Nadi / Janu Basti), Vata-hara Chikitsa, and Yogaraj Guggulu (Charaka Samhita Chi 28/75)."
            pathya = [
                "Daily warm sesame or Mahanarayana oil massage followed by warm fomentation",
                "Nutritious warm soups with cow's ghee and mild spices",
                "Gentle non-impact joint range-of-motion exercises"
            ]
            apathya = [
                "Cold baths, running on hard pavement, and prolonged standing",
                "Dry, rough, stale, and refrigerated foods",
                "Excessive fasting and skipping meals"
            ]
            recommended_formulations = ["Yogaraj Guggulu"]

        elif disease_key == "Grahani Dosha":
            vyadhi = "Grahani Dosha / Agnimandya (Malabsorption & Gut Dysbiosis)"
            dosha_list = ["Samana Vata", "Pachaka Pitta", "Kledaka Kapha"]
            dushya_list = ["Anna Rasa", "Purisha"]
            srotas_list = ["Annavaha Srotas", "Purishavaha Srotas"]
            sroto_dushti = "Sanga and Atipravritti (Alternating bowel habits)"
            adhisthana = "Grahani (Duodenum / Small Intestine)"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Irregular eating habits (Vishamashana) and stress suppress digestive fire (Agnimandya).",
                "2_prakopa": "Undigested food (Ama) and deranged Samana Vata accumulate in small bowel.",
                "3_prasara": "Fermenting chyme moves irregularly through the gastrointestinal tract.",
                "4_sthana_samshraya": "Disruption of mucosal absorption in Grahani.",
                "5_vyakti": "Post-meal bloating, alternating loose and constipated stools, intestinal rumbling.",
                "6_bheda": "Chronic malabsorption, nutritional deficiencies, and emaciation."
            }
            chikitsa_sutra = "Deepana, Pachana, Grahi, Takra Sevana, and Chitrakadi Vati (Charaka Samhita Chi 15/51)."
            pathya = [
                "Fresh churned buttermilk (Takra) seasoned with roasted cumin and ginger",
                "Warm moong dal soup and light khichdi",
                "Pomegranate juice and cooked apple"
            ]
            apathya = [
                "Heavy fried foods, bakery products, raw salads, and cold beverages",
                "Milk, fermented curds, and eating before previous meal is digested",
                "Excessive stress and irregular eating hours"
            ]
            recommended_formulations = ["Chitrakadi Vati"]

        elif disease_key == "Amlapitta":
            vyadhi = "Amlapitta (Hyperacidity & Gastro-Esophageal Reflux)"
            dosha_list = ["Pachaka Pitta (Drava & Amla Vriddhi)", "Samana Vata"]
            dushya_list = ["Anna Rasa", "Rakta Dhatu"]
            srotas_list = ["Annavaha Srotas", "Purishavaha Srotas"]
            sroto_dushti = "Atipravritti (Hyper-secretion) and Vidaha"
            adhisthana = "Amashaya (Stomach) & Urdhva Srotas"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Accumulation of hot, sharp, sour Pitta from excess chilies, fried food, and stress.",
                "2_prakopa": "Provocation of liquid, sour properties of Pitta.",
                "3_prasara": "Regurgitation of burning acidic contents into esophagus.",
                "4_sthana_samshraya": "Irritation and erosion of gastro-esophageal junction (Khavaigunya).",
                "5_vyakti": "Heartburn (Hrid-daha), sour eructations (Tikta-Amla Udgara), nausea, and epigastric discomfort.",
                "6_bheda": "Peptic ulceration, gastritis, and chronic acid reflux."
            }
            chikitsa_sutra = "Vamana (if Urdhva), Virechana (if Adho), Pitta-Shamana, Tikta-Madhura Rasa, and Avipattikar Churna (Charaka Samhita Chi 15/47)."
            pathya = [
                "Old barley (Yava), Shali rice, and green gram soup",
                "Cold milk with rock sugar, soaked raisins (Draksha), and Dadima (pomegranate)",
                "Coconut water and Amalaki powder"
            ]
            apathya = [
                "Excessive chili, garlic, fermented batters, and sour curd",
                "Skipping meals or erratic fasting followed by bingeing",
                "Alcohol, smoking, and staying awake late at night"
            ]
            recommended_formulations = ["Avipattikar Churna"]

        elif disease_key == "Prameha":
            vyadhi = "Prameha / Madhumeha (Metabolic Glycemic Imbalance)"
            dosha_list = ["Kaphapradhana Tridosha"]
            dushya_list = ["Meda Dhatu", "Mamsa Dhatu", "Kleda", "Ambu"]
            srotas_list = ["Mutravaha Srotas", "Medovaha Srotas"]
            sroto_dushti = "Atipravritti (Excessive turbid urination)"
            adhisthana = "Basti (Bladder & Kidneys) & Sarva Sharira"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Sedentary lifestyle and excess sweet/unctuous food accumulates Kapha and Medas.",
                "2_prakopa": "Aggravation of Kapha and liquid tissues.",
                "3_prasara": "Kleda diffuses through channels into the urinary tract.",
                "4_sthana_samshraya": "Deposition in Basti and renal filtration barriers.",
                "5_vyakti": "Frequent, turbid urination (Prabhuta-Avila Mutrata), sweet urine, and excessive thirst.",
                "6_bheda": "Madhumeha with tissue wasting, diabetic micro-vascular complications."
            }
            chikitsa_sutra = "Apatarpana, Shodhana (if balavan), Medoghna, Kledashoshaka, and Chandraprabha Vati (Charaka Samhita Chi 6/15)."
            pathya = [
                "Yava (barley rotis) and brown rice",
                "Tikta Shaka: Bitter gourd (Karela), Fenugreek (Methi), and Amalaki",
                "Regular brisk walking and aerobic movement"
            ]
            apathya = [
                "Direct sugar, sweets, sugarcane juice, and jaggery",
                "Fresh curd, dairy puddings, and day sleeping",
                "Sedentary habits without physical exertion"
            ]
            recommended_formulations = ["Chandraprabha Vati"]

        elif disease_key == "Kushtha":
            vyadhi = "Kushtha / Kitibha (Chronic Dermatological Pathology & Psoriasis)"
            dosha_list = ["Tridosha (Pitta-Kapha dominant)", "Vata"]
            dushya_list = ["Twak (Skin)", "Rakta (Blood)", "Mamsa (Muscle)", "Lasika (Lymph)"]
            srotas_list = ["Swedavaha Srotas", "Raktavaha Srotas"]
            sroto_dushti = "Sanga and Atipravritti (Exudation / Scaling)"
            adhisthana = "Twak & Bahya Roga Marga"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Tridosha accumulation from incompatible diet (Viruddha Ahara like milk + fish).",
                "2_prakopa": "Pitta and Kapha provoke skin vascular reactivity and micro-inflammation.",
                "3_prasara": "Dissemination of metabolic toxins via Raktavaha channels to skin layers.",
                "4_sthana_samshraya": "Lodgment in Twak, Rakta, Mamsa, and Lasika (Chaturdhatus).",
                "5_vyakti": "Erythema, scaling plaques, pruritus (Kandu), and exudation.",
                "6_bheda": "Ulceration, hyperkeratosis, lichenification, and chronicity."
            }
            chikitsa_sutra = "Vata-predominant: Ghrita; Kapha-predominant: Vamana; Pitta-predominant: Virechana & Raktamokshana (Charaka Samhita Chi 7/24)."
            pathya = [
                "Purana Yava (Old barley), Mudga Yusha (Moong soup), and Tikta Shaka (bitter vegetables)",
                "Khadira Kwatha wash and Neem water baths",
                "Light, dry, non-greasy foods"
            ]
            apathya = [
                "Viruddha Ahara (fish with milk, honey with hot substances)",
                "Curd, sour foods, excess jaggery, and sesame",
                "Day sleep and sudden cold water baths after sun exposure"
            ]
            recommended_formulations = ["Arogyavardhini Vati"]

        elif disease_key == "Jwara":
            vyadhi = "Jwara / Taruna Jwara (Acute Pyrexia & Systemic Ama)"
            dosha_list = ["Pachaka Pitta", "Samana Vata", "Kledaka Kapha"]
            dushya_list = ["Rasa Dhatu", "Sweda"]
            srotas_list = ["Swedavaha Srotas", "Rasavaha Srotas"]
            sroto_dushti = "Sanga (Sweat Channel Occlusion)"
            adhisthana = "Amashaya & Sarva Sharira"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Ama accumulates in Amashaya due to Agnimandya.",
                "2_prakopa": "Ama displaces Pachaka Pitta from its primary seat.",
                "3_prasara": "Circulates through Rasavaha Srotas to the exterior.",
                "4_sthana_samshraya": "Blocks Swedavaha Srotas, suppressing sweat.",
                "5_vyakti": "Fever, chills, body ache, coated tongue, loss of taste, and absence of perspiration.",
                "6_bheda": "Chronic Vishama Jwara if untreated."
            }
            chikitsa_sutra = "Jwaradau Langhanam, Swedanam, Kalo Yavagushcha Tiktako Rasa (Charaka Chikitsa 3/142)."
            pathya = ["Langhana (therapeutic fasting)", "Warm ginger water", "Shadanga Paniya", "Light rice gruel (Peya)"]
            apathya = ["Heavy meals, dairy, curd", "Cold water bath", "Day sleep", "Physical exertion"]
            recommended_formulations = ["Sudarshana Churna"]

        elif disease_key == "Karshya":
            vyadhi = "Karshya & Atyagni / Bhasmaka Roga (Hypermetabolic Dhatukshaya — Inability to Gain Weight)"
            dosha_list = ["Samana Vata", "Pachaka Pitta (Tikshna Agni)", "Vyana Vata"]
            dushya_list = ["Rasa Dhatu", "Mamsa Dhatu", "Meda Dhatu", "Shukra / Ojas"]
            srotas_list = ["Rasavaha Srotas", "Mamsavaha Srotas", "Annavahasrotas"]
            sroto_dushti = "Atipravritti (Hyperactive over-processing of ingested food — Dhatu Paka Vikruti)"
            adhisthana = "Amashaya (Jatharagni Seat) & Sarva Dhatu Vaha"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Excessive Tikshna (sharp) and Teekshna Agni accumulates due to genetic constitution, Vata-Pitta Prakriti, or chronic stress / irregular eating habits.",
                "2_prakopa": "Samana Vata fans the digestive fire (Jatharagni) excessively, triggering Atyagni (Bhasmaka Agni — a voraciously burning hypermetabolic state).",
                "3_prasara": "Food is digested and absorbed abnormally rapidly through Rasavaha and Annavahasrotas without adequate Stambhana (consolidation) for Dhatu nourishment.",
                "4_sthana_samshraya": "Dhatus (especially Rasa, Mamsa, Meda) are perpetually depleted faster than they can be built, causing progressive Dhatukshaya (tissue loss).",
                "5_vyakti": "Manifests as constitutional inability to gain weight, rapid hunger return despite adequate intake, prominent body-frame thinness, reduced stamina, and dryness.",
                "6_bheda": "Chronic Karshya leads to Ojakshaya (immune depletion), reproductive weakness, fatigue, and neurological fragility if Brimhana therapy is not initiated."
            }
            chikitsa_sutra = "Santarpana Chikitsa (Brimhana Therapy), Snigdha-Guru-Madura Ahara, Ashwagandhadi Rasayana, and Medicated Ghee Protocols (Charaka Sutra 21/11-20 & Charaka Chikitsa 15/217-219)."
            pathya = [
                "Warm A2 cow's milk with 2 tsp cow's ghee and a pinch of Ashwagandha and cardamom twice daily",
                "High-caloric anabolic diet: Urad dal khichdi with ghee, soaked almonds, dates, figs and banana",
                "Nourishing warm root vegetables: Yam (Surana), Sweet potato and cooked Taro with rock salt and ghee",
                "Avoid skipping meals; eat at consistent intervals every 3 hours to prevent Jatharagni over-kindles",
                "Oil massage (Abhyanga) with warm Sesame or Bala taila daily before bathing to anchor Vata and build Mamsa"
            ]
            apathya = [
                "Fasting, skipping meals, or intermittent fasting — contraindicated in Atyagni / Karshya",
                "Pungent, dry, bitter, and astringent foods that further sharpen Agni (raw salads, spicy curries, roasted snacks)",
                "Excessive aerobic cardio exercise (jogging, cycling) without adequate caloric surplus",
                "Caffeine, energy drinks, and excessive screen time / mental stress aggravate Vata-Pitta"
            ]
            recommended_formulations = ["Ashwagandhadi Lehyam", "Shatavari Ghritham", "Draksharishta"]

        else:
            # Fallback if clinical features remain undifferentiated or incomplete
            vyadhi = "Asiddha Roganirnaya — Lakshana Clarification Needed (Undifferentiated Clinical Presentation)"
            confidence_level = "insufficient information"
            dosha_list = ["Anirdharita Dosha (Pending Clinical Clarification)"]
            dushya_list = ["Anirdharita Dushya"]
            srotas_list = ["Sarva Sharira"]
            sroto_dushti = "Prashna Pariksha Apekshita (Inquiry Required)"
            adhisthana = "Undifferentiated / Generalized"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Early Dosha accumulation suspected; specific vitiated Dosha pending clinical clarification.",
                "2_prakopa": "Provocation markers not yet anatomically localized.",
                "3_prasara": "Circulation through systemic channels without marked localized Khavaigunya.",
                "4_sthana_samshraya": "Site of anatomical lodgment requires inquiry into exact pain/symptom distribution.",
                "5_vyakti": "Current manifestation consists of non-specific general symptoms.",
                "6_bheda": "Chronicity and complication stage to be evaluated following clinical examination."
            }
            chikitsa_sutra = "Prashna Pariksha, Rogi-Roga Pariksha, Deepana-Pachana (Shunthi-Sadhita Jala), and Nidana Parivarjana (Charaka Vimana Sthana 8/83)."
            pathya = [
                "Drink warm water boiled with fresh ginger (Shunthi Jala)",
                "Light, fresh cooked meals (Moong dal khichdi)",
                "Adequate rest and regular sleep schedule"
            ]
            apathya = [
                "Heavy, oily, stale, or packaged foods",
                "Daytime sleep (Divasvapna)",
                "Suppression of natural urges (Vega Dharana)"
            ]
            recommended_formulations = ["Sudarshana Churna"]

        # Tracing in knowledge graph
        graph_key = disease_key if disease_key in ["Amavata", "Sandhigata Vata", "Amlapitta", "Grahani Dosha", "Prameha", "Jwara", "Karshya"] else "Vatavyadhi"
        graph_data = self.kg.trace_samprapti(graph_key)

        return {
            "probable_vyadhi": vyadhi,
            "disease_key": disease_key,
            "confidence_level": confidence_level,
            "differentials": differential_list,
            "uncertainty_notes": uncertainty_notes,
            "samprapti_ghatakas": {
                "dosha": dosha_list,
                "dushya": dushya_list,
                "agni": agni,
                "ama": ama_present,
                "srotas": srotas_list,
                "sroto_dushti_prakara": sroto_dushti,
                "adhisthana": adhisthana
            },
            "shat_kriya_kala": kriya_kala,
            "chikitsa_sutra": chikitsa_sutra,
            "pathya": pathya,
            "apathya": apathya,
            "recommended_formulations": recommended_formulations,
            "knowledge_graph_context": graph_data
        }


# Singleton service
samprapti_engine = SampraptiModelingService()
