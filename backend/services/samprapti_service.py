"""
AyuVaidya: Automated Samprapti (Pathology) Modeling Engine
Performs classical deconstruction of etiopathogenesis:
Sanchaya -> Prakopa -> Prasara -> Sthana-Samshraya (Khavaigunya) -> Vyakti -> Bheda.
"""

from typing import Dict, List, Any, Optional
from backend.knowledge_graph.ayur_graph import ayur_kg


class SampraptiModelingService:
    """
    Automated Samprapti derivation aligning patient Lakshanas (symptoms),
    Ashtavidha Pariksha, and classical Brihat Trayi pathology models.
    """

    def __init__(self):
        self.kg = ayur_kg

    def model_samprapti(
        self,
        complaints: List[str],
        prakriti: str,
        agni: str,
        koshtha: str,
        ashtavidha: Optional[Dict[str, str]] = None,
        triggering_nidana: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Derives complete Samprapti Ghatakas and Shat Kriya Kala staging.
        """
        complaint_text = " ".join(complaints).lower()

        # 1. Disease Mapping
        if any(w in complaint_text for w in ["joint", "swelling", "stiffness", "amavata", "arthritis", "rheumatoid"]):
            vyadhi = "Amavata (Rheumatoid / Inflammatory Joint Pathology)"
            disease_key = "Amavata"
            dosha_list = ["Vata (Vyana & Apana)", "Kapha (Shleshaka)"]
            dushya_list = ["Rasa Dhatu", "Asthi Dhatu", "Majja Dhatu"]
            srotas_list = ["Rasavaha Srotas", "Asthivaha Srotas"]
            sroto_dushti = "Sanga (Obstruction) and Vimarga Gamana (Errant Flow)"
            adhisthana = "Sandhi (Synovial Joint Cavities) & Hridaya"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Accumulation of Ama in Amashaya due to Mandagni & unwholesome diet.",
                "2_prakopa": "Provocation of Vata by cold climate and dry/incompatible foods.",
                "3_prasara": "Vitiated Vata propels Ama into systemic circulation via Rasavaha Srotas.",
                "4_sthana_samshraya": "Ama lodges in joints with Khavaigunya (pre-existing micro-defect).",
                "5_vyakti": "Manifestation of severe morning stiffness, joint swelling, and pain.",
                "6_bheda": "Chronic joint deformities and subcutaneous nodule formation."
            }
            chikitsa_sutra = "Langhana, Svedana (Valuka Sveda), Tikta-Katu Deepana-Pachana, Virechana, and Basti (Ashtanga Hridaya Chi 21/42)."
            pathya = [
                "Shunthi Jala (warm ginger water) as primary drinking water",
                "Purana Shali (aged rice) and Yava (barley rotis)",
                "Kulattha Yusha (horse gram soup) with black pepper and cumin",
                "Dry heat fomentation (Valuka Sveda) over swollen joints"
            ]
            apathya = [
                "Abhyanga (oil massage) during acute inflammatory phase (causes severe Srotorodha)",
                "Dadhi (curd), fermented foods, cold milk, and heavy sweets",
                "Divasvapna (daytime sleep) which severely aggravates Kapha and Ama",
                "Cold showers and exposure to cold wind (Sheetala Vata)"
            ]
            recommended_formulations = ["Simhanada Guggulu"]

        elif any(w in complaint_text for w in ["indigestion", "bloating", "grahani", "loose stool", "ibs", "appetite"]):
            vyadhi = "Grahani Dosha / Agnimandya (Malabsorption & Gut Dysbiosis)"
            disease_key = "Grahani Dosha"
            dosha_list = ["Samana Vata", "Pachaka Pitta", "Kledaka Kapha"]
            dushya_list = ["Anna Rasa Dhatu"]
            srotas_list = ["Annavaha Srotas", "Purishavaha Srotas"]
            sroto_dushti = "Sanga and Atipravritti (Alternating bowel habits)"
            adhisthana = "Grahani (Duodenum & Upper Gastrointestinal Tract)"
            ama_present = True
            kriya_kala = {
                "1_sanchaya": "Accumulation of impaired chyme in Grahani due to irregular meal timing.",
                "2_prakopa": "Vitiation of Samana Vata and extinction of Pachaka Pitta (Agnimandya).",
                "3_prasara": "Circulation of undigested toxins across the digestive mucosa.",
                "4_sthana_samshraya": "Mucosal inflammation and altered bowel motility in the gut.",
                "5_vyakti": "Alternating constipation and diarrhea with loud gurgling (Antrakujana).",
                "6_bheda": "Severe nutritional emaciation, chronic fatigue, and food intolerances."
            }
            chikitsa_sutra = "Deepana (appetite stimulation), Pachana (Ama digestion), Grahi, and Agni-vardhana (Charaka Samhita Chi 15/51)."
            pathya = [
                "Fresh buttermilk (Takra) churned without butter and infused with roasted cumin and rock salt",
                "Mung Dal soup (Mudga Yusha) with a pinch of Hing (asafoetida)",
                "Small, easily digestible warm meals at fixed hours"
            ]
            apathya = [
                "Heavy dairy (cheese, fresh curd, ice creams)",
                "Eating before digestion of the previous meal (Adhyashana)",
                "Cold refrigeration beverages and carbonated sodas",
                "Suppression of natural urges (Vega Dharana)"
            ]
            recommended_formulations = ["Chitrakadi Vati"]

        elif any(w in complaint_text for w in ["diabetes", "sugar", "prameha", "frequent urine", "thirst"]):
            vyadhi = "Prameha / Madhumeha (Metabolic Disorder & Glycemic Imbalance)"
            disease_key = "Prameha"
            dosha_list = ["Kaphapradhana Tridosha", "Pitta"]
            dushya_list = ["Meda (Adipose)", "Mamsa", "Kleda (Fluid matrix)", "Shukra"]
            srotas_list = ["Mutravaha Srotas", "Medovaha Srotas"]
            sroto_dushti = "Atipravritti (Excessive turbid urination) and Sanga"
            adhisthana = "Basti (Kidneys & Urinary Bladder) and Sarva Sharira"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Meda and Kapha accumulate due to excessive sedentary habits and sweets.",
                "2_prakopa": "Kapha vitiates Kleda and overflows into micro-channels.",
                "3_prasara": "Dissemination of metabolic fluid throughout bodily tissue beds.",
                "4_sthana_samshraya": "Deposition in Basti and urinary system.",
                "5_vyakti": "Turbid, frequent urination (Prabhuta Avila Mutrata) and fatigue.",
                "6_bheda": "Progression to Madhumeha (sweet urine) with neuropathic complications."
            }
            chikitsa_sutra = "Apatarpana (depleting therapy) for Sthula (obese); Santarpana with caution for Krisha (emaciated); Medoghna herbs (Charaka Samhita Chi 6/15)."
            pathya = [
                "Yava (Barley rotis), Mudga (Green gram), and Bitter gourd (Karela)",
                "Amalaki juice with a pinch of Haridra (turmeric)",
                "Regular brisk walking (Vyahara) and Surya Namaskar"
            ]
            apathya = [
                "Sugar, refined jaggery, bakery foods, and sweetened drinks",
                "Curd (Dadhi) and day sleep (Divasvapna)",
                "Sedentary lifestyle without physical exertion"
            ]
            recommended_formulations = ["Chandraprabha Vati"]

        elif any(w in complaint_text for w in ["anemia", "weakness", "pale", "pandu", "fatigue", "breathless"]):
            vyadhi = "Pandu Roga (Anemia & Hepato-Splenic Dysfunction)"
            disease_key = "Pandu Roga"
            dosha_list = ["Sadhaka & Ranjaka Pitta", "Vata"]
            dushya_list = ["Rasa", "Rakta Dhatu", "Ojas"]
            srotas_list = ["Raktavaha Srotas", "Rasavaha Srotas"]
            sroto_dushti = "Kshaya (Depletion of essence) and Sanga"
            adhisthana = "Hridaya (Heart) and Dashadhamani (Major vessels)"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Pitta accumulates due to excessive sour, salty, and pungent foods.",
                "2_prakopa": "Pitta vitiates the essence of Rakta Dhatu in the liver and spleen.",
                "3_prasara": "Impaired Rakta circulates, depriving peripheral tissues of nourishment.",
                "4_sthana_samshraya": "Localization in skin, nails, and conjunctiva causing pallor.",
                "5_vyakti": "Generalized pallor, palpitation (Hrid-drava), and exertional fatigue.",
                "6_bheda": "Deep-seated organ failure and generalized edema (Shotha)."
            }
            chikitsa_sutra = "Gentle Shodhana (Virechana), followed by Pitta-shamana and Rakta-vardhana formulations (Charaka Samhita Chi 16/34)."
            pathya = [
                "Pomegranate (Dadima), Munakka (Black raisins), and Beetroot",
                "Takra processed with Triphala",
                "Amla and iron-rich leafy greens"
            ]
            apathya = [
                "Excessive sour (Amla), salty (Lavana), and spicy foods",
                "Direct exposure to harsh sun and dry heat",
                "Heavy physical exhaustion without adequate rest"
            ]
            recommended_formulations = ["Punarnava Mandur"]

        else:
            vyadhi = "Vatavyadhi (General Vata Aggravation & Joint Stiffness)"
            disease_key = "Vatavyadhi"
            dosha_list = ["Vyana Vata", "Apana Vata"]
            dushya_list = ["Asthi Dhatu", "Snayu", "Kandara"]
            srotas_list = ["Asthivaha Srotas", "Vatavaha Srotas"]
            sroto_dushti = "Sanga (Obstruction)",
            adhisthana = "Sandhi (Joints) and Asthi"
            ama_present = False
            kriya_kala = {
                "1_sanchaya": "Vata accumulates due to dryness, aging, or cold exposure.",
                "2_prakopa": "Aggravation of dry, mobile attributes of Vata.",
                "3_prasara": "Vitiated Vata travels through hollow tissue spaces.",
                "4_sthana_samshraya": "Settles in depleted joint spaces causing degenerative attrition.",
                "5_vyakti": "Crepitus (Sandhi Sphutana), stiffness, and movement pain.",
                "6_bheda": "Severe osteoarthritis, restricted mobility, and deformities."
            }
            chikitsa_sutra = "Snehana (internal & external oleation), Svedana (sudation), and Basti (Charaka Samhita Chi 28/75)."
            pathya = [
                "Warm sesame oil massage (Abhyanga)",
                "Nutritious warm soups with cow's ghee",
                "Warm, moist, grounding diet"
            ]
            apathya = [
                "Cold draft exposure and fasting",
                "Dry, crunchy, stale, and cold foods",
                "Excessive exertion and sleep deprivation"
            ]
            recommended_formulations = ["Yogaraj Guggulu"]

        # Retrieve knowledge graph connections
        graph_data = self.kg.trace_samprapti(disease_key)

        return {
            "probable_vyadhi": vyadhi,
            "disease_key": disease_key,
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

