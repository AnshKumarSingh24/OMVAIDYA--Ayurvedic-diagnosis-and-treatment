"""
AyurSetu: Canonical Classical Corpus (Brihat Trayi)
Authentic shlokas and clinical metadata from Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya.
"""

from typing import List, Dict, Any

CANONICAL_SHLOKAS: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # CHARAKA SAMHITA - SUTRA STHANA
    # -------------------------------------------------------------
    {
        "shloka_id": "CS_SU_01_041",
        "treatise": "Charaka Samhita",
        "sthana": "Sutra Sthana",
        "adhyaya": "Dirghanjivitiya Adhyaya (Chapter 1)",
        "shloka_number": "41",
        "sanskrit_devanagari": "हेतुलिङ्गाौषधज्ञानं स्वस्थातुरपरायणम्। त्रिसूत्रं शाश्वतं पुण्यं बुबुधे यं पितामहः॥",
        "sanskrit_iast": "hetuliṅgauṣadhajñānaṁ svasthāturaparāyaṇam | trisūtraṁ śāśvataṁ puṇyaṁ bubudhe yaṁ pitāmahaḥ ||",
        "english_translation": "Ayurveda consists of the knowledge of Hetu (etiology/causation), Linga (symptomatology), and Aushadha (therapeutics) for the healthy and diseased, known as Trisutra.",
        "hindi_translation": "हेतु (कारण), लिंग (लक्षण) और औषध (उपचार) का ज्ञान जो स्वस्थ और रोगी दोनों के लिए परायण है, त्रिसूत्र कहलाता है।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["General Health", "Diagnostic Fundamentals", "Trisutra"],
        "formulations": [],
        "contraindications": [],
        "keywords": ["trisutra", "hetu", "linga", "aushadha", "principles"]
    },
    {
        "shloka_id": "CS_SU_01_057",
        "treatise": "Charaka Samhita",
        "sthana": "Sutra Sthana",
        "adhyaya": "Dirghanjivitiya Adhyaya (Chapter 1)",
        "shloka_number": "57",
        "sanskrit_devanagari": "वायुः पित्तं कफश्चोक्तः शारीरो दोषसंग्रहः। मानसः पुनरुद्दिष्टो रजश्च तम एव च॥",
        "sanskrit_iast": "vāyuḥ pittaṁ kaphaścoktaḥ śārīro doṣasaṁgrahaḥ | mānasaḥ punaruddiṣṭo rajaśca tama eva ca ||",
        "english_translation": "Vata, Pitta, and Kapha are the bodily doshas. Rajas and Tamas are the mental doshas.",
        "hindi_translation": "वात, पित्त और कफ शरीर के दोष हैं। रज और तम मन के दोष कहे गए हैं।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["Dosha fundamentals", "Physiology", "Sharira Dosha"],
        "formulations": [],
        "contraindications": [],
        "keywords": ["vata", "pitta", "kapha", "dosha", "rajas", "tamas"]
    },
    {
        "shloka_id": "CS_SU_05_003",
        "treatise": "Charaka Samhita",
        "sthana": "Sutra Sthana",
        "adhyaya": "Matrashitiya Adhyaya (Chapter 5)",
        "shloka_number": "3",
        "sanskrit_devanagari": "मात्राशी स्यात्। आहारमात्रा पुनरग्निबलापेक्षिणी॥",
        "sanskrit_iast": "mātrāśī syāt | āhāramātrā punaragnibalāpekṣiṇī ||",
        "english_translation": "One should always consume food in proper quantity. The proper quantity of food depends strictly on the strength of digestive fire (Agni).",
        "hindi_translation": "मनुष्य को उचित मात्रा में भोजन करना चाहिए। भोजन की उचित मात्रा जठराग्नि के बल पर निर्भर करती है।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["Agni", "Ahara", "Dietetics", "Indigestion", "Mandagni"],
        "formulations": [],
        "contraindications": ["Adhyashana", "Vishmashana"],
        "keywords": ["matrashitiya", "ahara", "agni", "digestion", "quantity"]
    },

    # -------------------------------------------------------------
    # CHARAKA SAMHITA - CHIKITSA STHANA
    # -------------------------------------------------------------
    {
        "shloka_id": "CS_CHI_03_142",
        "treatise": "Charaka Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Jwara Chikitsa (Chapter 3)",
        "shloka_number": "142",
        "sanskrit_devanagari": "ज्वरादौ लङ्घनं प्रोक्तं ज्वरमध्ये तु पाचनम्। ज्वरान्ते भेषजं दद्यात् ज्वरमुक्तस्य सर्पिषः॥",
        "sanskrit_iast": "jvarādau laṅghanaṁ proktaṁ jvaramadhye tu pācanam | jvarānte bheṣajaṁ dadyāt jvaramuktasya sarpiṣaḥ ||",
        "english_translation": "In the initial stage of fever (Jwara), Langhana (fasting/lightness) is indicated. In the middle stage, Pachana (digestive herbs) should be given. In the concluding stage, medicinal formulations, and after relief, Medicated Ghee (Ghrita) should be administered.",
        "hindi_translation": "ज्वर के आरम्भ में लंघन, मध्य में पाचन, अंत में औषध तथा ज्वरमुक्त होने पर सिद्ध घृत का सेवन करना चाहिए।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["Jwara", "Fever", "Ama Jwara", "Taruna Jwara"],
        "formulations": ["Sudarshana Churna", "Amritarishta", "Shadangodaka"],
        "contraindications": ["Heavy diet", "Snigdha Ahara in acute fever", "Cold water bath"],
        "anupana_rules": ["Ushnodaka (Warm water)"],
        "keywords": ["jwara", "fever", "langhana", "pachana", "amritarishta", "sudharshana churna"]
    },
    {
        "shloka_id": "CS_CHI_15_051",
        "treatise": "Charaka Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Grahani Dosha Chikitsa (Chapter 15)",
        "shloka_number": "51",
        "sanskrit_devanagari": "शान्तेऽग्नौ म्रियते, युक्ते चिरं जीवत्यनामयः। रोगी स्याद्विकृते, मूलमग्निस्तस्मान्निरुच्यते॥",
        "sanskrit_iast": "śānte'gnau mriyate, yukte ciraṁ jīvatyanāmayaḥ | rogī syādvikṛte, mūlamagnistasmānnirucyate ||",
        "english_translation": "When Agni is extinguished, the person dies; when it is balanced, one lives a long and disease-free life; when it is deranged, one suffers from diseases. Therefore, Agni is the root cause of health and longevity.",
        "hindi_translation": "अग्नि के शांत हो जाने पर मनुष्य की मृत्यु हो जाती है, सम होने पर वह स्वस्थ रहकर दीर्घायु होता है, और विकृत होने पर रोगी हो जाता है। अतः अग्नि ही सबका मूल है।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["Grahani", "Mandagni", "Agnimandya", "IBS", "Indigestion"],
        "formulations": ["Takrarishta", "Chitrakadi Vati", "Panchamrit Parpati"],
        "contraindications": ["Heavy greasy foods", "Cold drinks", "Day sleep"],
        "anupana_rules": ["Takra (Buttermilk)", "Warm water"],
        "keywords": ["grahani", "agni", "mandagni", "chitrakadi vati", "takrarishta", "ibs", "gut"]
    },
    {
        "shloka_id": "CS_CHI_16_034",
        "treatise": "Charaka Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Pandu Roga Chikitsa (Chapter 16)",
        "shloka_number": "34",
        "sanskrit_devanagari": "पाण्डुरोगेषु सर्वेषु तीक्ष्णं संशोधनं हितम्। विशुद्धकोष्ठस्य शमः क्रमेण विधीयते॥",
        "sanskrit_iast": "pāṇḍurogeṣu sarveṣu tīkṣṇaṁ saṁśodhanaṁ hitam | viśuddhakoṣṭhasya śamaḥ krameṇa vidhīyate ||",
        "english_translation": "In all types of Pandu Roga (Anemia/Pallor), gentle purification (Shodhana) is beneficial. Once the gastrointestinal tract (Koshtha) is cleansed, pacifying medicines (Shamana) should be administered sequentially.",
        "hindi_translation": "समस्त पाण्डु रोगों में कोष्ठ शुद्धि (संशोधन) हितकारी है। कोष्ठ शुद्ध हो जाने के पश्चात क्रमशः शमन औषधियाँ देनी चाहिए।",
        "dosha_association": ["Pitta", "Vata"],
        "indications": ["Pandu", "Anemia", "Kamala", "Jaundice", "Liver disorders"],
        "formulations": ["Punarnava Mandur", "Lohasava", "Arogyavardhini Vati"],
        "contraindications": ["Excess sour, salty and spicy foods", "Alcohol", "Excessive sunlight"],
        "anupana_rules": ["Takra (Buttermilk)", "Honey and warm water"],
        "keywords": ["pandu", "anemia", "punarnava mandur", "lohasava", "arogyavardhini", "pitta"]
    },
    {
        "shloka_id": "CS_CHI_28_075",
        "treatise": "Charaka Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Vatavyadhi Chikitsa (Chapter 28)",
        "shloka_number": "75",
        "sanskrit_devanagari": "स्नेहनं स्वेदनं चैव वस्तयः सविरेचनाः। वातव्याधौ प्रशस्यन्ते तथा चोपनाहनानि च॥",
        "sanskrit_iast": "snehanaṁ svedanaṁ caiva vastayaḥ savirecanāḥ | vātavyādhau praśasyante tathā copanāhanāni ca ||",
        "english_translation": "In all Vata disorders (Vatavyadhi), Snehana (oleation), Svedana (sudation), Basti (medicated enema), mild Virechana (purgation), and Upanaha (warm poultices) are highly praised.",
        "hindi_translation": "वातव्याधियों में स्नेहन, स्वेदन, बस्ति, मृदु विरेचन और उपनाह अत्यधिक प्रशंसित हैं।",
        "dosha_association": ["Vata"],
        "indications": ["Vatavyadhi", "Joint Pain", "Sciatica", "Osteoarthritis", "Gridhrasi", "Sandhigatavata"],
        "formulations": ["Yogaraj Guggulu", "Mahanarayana Taila", "Balarishta", "Rasnasaptaka Kwatha"],
        "contraindications": ["Ruksha (dry) foods", "Excessive exercise", "Night awakening", "Cold exposure"],
        "anupana_rules": ["Ushnodaka (Warm water)", "Rasna Kwatha"],
        "keywords": ["vatavyadhi", "joint pain", "sandhigata vata", "sciatica", "yogaraj guggulu", "mahanarayana taila"]
    },

    # -------------------------------------------------------------
    # SUSHRUTA SAMHITA
    # -------------------------------------------------------------
    {
        "shloka_id": "SS_SU_15_041",
        "treatise": "Sushruta Samhita",
        "sthana": "Sutra Sthana",
        "adhyaya": "Dosha Dhatu Mala Kshaya Vriddhi Vijnaniya (Chapter 15)",
        "shloka_number": "41",
        "sanskrit_devanagari": "समदोषः समाग्निश्च समधातुमलक्रियः। प्रसन्नात्मेन्द्रियमनाः स्वस्थ इत्यभिधीयते॥",
        "sanskrit_iast": "samadoṣaḥ samāgniśca samadhātumalakriyaḥ | prasannātmendriyamanaḥ svastha ityabhidhīyate ||",
        "english_translation": "One whose Doshas (Vata, Pitta, Kapha), Agni (digestive fire), Dhatus (tissues), and Malas (excretory functions) are in dynamic equilibrium, and whose Atman (soul), Indriyas (senses), and Manas (mind) are contented and serene, is declared 'Svastha' (Healthy).",
        "hindi_translation": "जिसके दोष सम हों, अग्नि सम हो, धातु और मल की क्रियाएं सम हों, तथा जिसकी आत्मा, इन्द्रियाँ और मन प्रसन्न हों, वही स्वस्थ कहलाता है।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["Definition of Health", "Holistic Wellness", "Svasthavritta"],
        "formulations": [],
        "contraindications": [],
        "keywords": ["svastha", "health", "definition", "equilibrium", "who definition"]
    },
    {
        "shloka_id": "SS_CHI_04_008",
        "treatise": "Sushruta Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Vatavyadhi Chikitsa (Chapter 4)",
        "shloka_number": "8",
        "sanskrit_devanagari": "सर्वेषु वातविकारेषु तैलमेव परं मतम्। तैलं शमयते वातं स्निग्धोष्णगुरुसंयुतम्॥",
        "sanskrit_iast": "sarveṣu vātavikāreṣu tailameva paraṁ matam | tailaṁ śamayate vātaṁ snigdhoṣṇagurusaṁyutam ||",
        "english_translation": "In all Vata disorders, Sesame Oil (Taila) is considered supreme. Due to its unctuous (Snigdha), hot (Ushna), and heavy (Guru) attributes, it pacifies Vata effectively.",
        "hindi_translation": "समस्त वात विकारों में तैल ही सर्वश्रेष्ठ माना गया है। स्निग्ध, उष्ण और गुरु गुणों से युक्त होने के कारण तैल वात का शमन करता है।",
        "dosha_association": ["Vata"],
        "indications": ["Vata disorders", "Dryness", "Joint stiffness", "Neuropathy"],
        "formulations": ["Tila Taila", "Ksheerabala Taila", "Dhanwantaram Taila"],
        "contraindications": ["Acute Ama states", "Severe Kapha congestion"],
        "anupana_rules": ["Warm milk", "Warm water"],
        "keywords": ["taila", "sesame oil", "vata", "snigdha", "ushna", "ksheerabala"]
    },

    # -------------------------------------------------------------
    # ASHTANGA HRIDAYA
    # -------------------------------------------------------------
    {
        "shloka_id": "AH_SU_01_007",
        "treatise": "Ashtanga Hridaya",
        "sthana": "Sutra Sthana",
        "adhyaya": "Ayushkamiya Adhyaya (Chapter 1)",
        "shloka_number": "7",
        "sanskrit_devanagari": "आयुःकामयमानेन धर्मार्थसुखसाधनम्। आयुर्वेदोपदेशेषु विधेयः परमादरः॥",
        "sanskrit_iast": "āyuḥkāmayamānena dharmārthasukhasādhanam | āyurvedopadeśeṣu vidheyaḥ paramādaraḥ ||",
        "english_translation": "One who desires long life as a means to achieve Dharma (righteousness), Artha (wealth), and Sukha (happiness) must hold the teachings of Ayurveda in highest esteem.",
        "hindi_translation": "जो व्यक्ति धर्म, अर्थ और सुख के साधन रूप दीर्घायु की कामना करता है, उसे आयुर्वेद के उपदेशों का परम आदर करना चाहिए।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["Ayushkamiya", "Longevity", "Preventive Healthcare"],
        "formulations": [],
        "contraindications": [],
        "keywords": ["ayushkamiya", "dharma", "artha", "sukha", "longevity"]
    },
    {
        "shloka_id": "AH_SU_02_001",
        "treatise": "Ashtanga Hridaya",
        "sthana": "Sutra Sthana",
        "adhyaya": "Dinacharya Adhyaya (Chapter 2)",
        "shloka_number": "1",
        "sanskrit_devanagari": "ब्राह्मे मुहूर्ते उत्तिष्ठेत् स्वस्थो रक्षार्थमायुषः। शरीरचिन्तां निर्वर्त्य कृतशौचविधिस्ततः॥",
        "sanskrit_iast": "brāhme muhūrte uttiṣṭhet svastho rakṣārthamāyuṣaḥ | śarīracintāṁ nirvartya kṛtaśaucavidhistataḥ ||",
        "english_translation": "A healthy individual should wake up during Brahma Muhurta (approx. 48 minutes before sunrise) to preserve life and vitality. After reflecting on bodily needs, one should attend to natural urges.",
        "hindi_translation": "स्वस्थ व्यक्ति को अपनी आयु की रक्षा के लिए ब्रह्म मुहूर्त में उठना चाहिए। शरीर की स्थिति का विचार कर शौच आदि कर्म करने चाहिए।",
        "dosha_association": ["Vata", "Pitta", "Kapha"],
        "indications": ["Dinacharya", "Daily Regimen", "Circadian Rhythm", "Preventive Health"],
        "formulations": [],
        "contraindications": ["Late night sleeping"],
        "keywords": ["brahma muhurta", "dinacharya", "waking up", "circadian", "lifestyle"]
    },
    {
        "shloka_id": "AH_CHI_21_042",
        "treatise": "Ashtanga Hridaya",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Amavata / Sandhigata Vata Chikitsa (Chapter 21)",
        "shloka_number": "42",
        "sanskrit_devanagari": "लङ्घनं स्वेदनं तिक्तं दीपनानि कटूनि च। विरेचनं स्नेहपानं बस्तयश्चाममारुते॥",
        "sanskrit_iast": "laṅghanaṁ svedanaṁ tiktaṁ dīpanāni kaṭūni ca | virecanaṁ snehapānaṁ vastayaścāmamārute ||",
        "english_translation": "In Amavata (Rheumatoid Arthritis / systemic inflammatory joint disorder), Langhana (fasting), Svedana (dry fomentation/Valuka Sveda), bitter (Tikta) and pungent (Katu) appetizers (Deepana-Pachana), followed by Virechana (purgation), specialized Snehapana, and Kshara Bastis are indicated.",
        "hindi_translation": "आमवात में लंघन, स्वेदन (वालुका स्वेद), तिक्त एवं कटु दीपन-पाचन द्रव्य, विरेचन, स्नेहपान और बस्ति कर्म विधान कहे गए हैं।",
        "dosha_association": ["Vata", "Kapha"],
        "indications": ["Amavata", "Rheumatoid Arthritis", "Joint Swelling", "Morning Stiffness", "Ama"],
        "formulations": ["Simhanada Guggulu", "Rasnadi Kwatha", "Shunthi Churna", "Castor Oil (Eranda Taila)"],
        "contraindications": ["Oil massage in acute swelling (Abhyanga is contraindicated in acute Ama)", "Curd", "Heavy meals"],
        "anupana_rules": ["Ushnodaka (Hot water)", "Shunthi Jala (Ginger infused water)"],
        "keywords": ["amavata", "rheumatoid arthritis", "simhanada guggulu", "langhana", "valuka sveda", "ama"]
    },
    {
        "shloka_id": "CS_CHI_06_015",
        "treatise": "Charaka Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Prameha Chikitsa (Chapter 6)",
        "shloka_number": "15",
        "sanskrit_devanagari": "आस्यासुखं स्वप्नसुखं दधीनि ग्राम्योदकानूपरसाः पयांसि। नवान्नपानं गुडवैकृतं च प्रमेहहेतुः कफकृच्च सर्वम्॥",
        "sanskrit_iast": "āsyāsukhaṁ svapnasukhaṁ dadhīni grāmyodakānūparasāḥ payāṁsi | navānnapānaṁ guḍavaikṛtaṁ ca pramehahetuḥ kaphakṛcca sarvam ||",
        "english_translation": "Sedentary lifestyle, excessive sleep (day sleep), excessive consumption of curd, meat of aquatic and marshy animals, fresh grains, jaggery/sugar preparations, and all Kapha-aggravating substances are the primary causes of Prameha (Diabetes / Metabolic Syndrome).",
        "hindi_translation": "आलस्यपूर्वक बैठे रहना, अधिक सोना, दही, दलदली पशुओं का मांस, नया अन्न, गुड़ और मीठे पदार्थ तथा कफवर्धक आहार-विहार प्रमेह के प्रमुख कारण हैं।",
        "dosha_association": ["Kapha", "Pitta"],
        "indications": ["Prameha", "Madhumeha", "Diabetes Mellitus", "Metabolic Syndrome", "Medoroga"],
        "formulations": ["Chandraprabha Vati", "Nishamalaki Churna", "Vasantakusumakara Rasa", "Asanadi Kwatha"],
        "contraindications": ["Sugar", "Sweets", "Refined flour", "Day sleep", "Sedentary habits"],
        "anupana_rules": ["Warm water", "Amalaki juice with Madhu (in moderation)"],
        "keywords": ["prameha", "diabetes", "madhumeha", "chandraprabha vati", "nishamalaki", "kapha", "curd"]
    },
    {
        "shloka_id": "CS_CHI_17_070",
        "treatise": "Charaka Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Hikka Shwasa Chikitsa (Chapter 17)",
        "shloka_number": "70",
        "sanskrit_devanagari": "प्रतिलोमं यदा वायुः स्रोतांसि प्रतिपद्यते। कफमुद्गोचयन् कृच्छ्रात् श्वासं जनयति दारुणम्॥",
        "sanskrit_iast": "pratilomaṁ yadā vāyuḥ srotāṁsi pratipadyate | kaphamudgocayan kṛcchrāt śvāsaṁ janayati dāruṇam ||",
        "english_translation": "When Vata moves in an upward, retrograde direction (Pratiloma), it obstructs the Pranavaha channels and mobilizes Kapha, producing severe respiratory distress and breathless wheezing (Tamaka Shwasa / Bronchial Asthma).",
        "hindi_translation": "जब वायु प्रतिलोम गति में होकर प्राणवह स्रोतों को अवरुद्ध करती है और कफ को उभारती है, तब कष्टसाध्य दारुण तमक श्वास (अस्थमा) उत्पन्न होता है।",
        "dosha_association": ["Vata", "Kapha"],
        "indications": ["Tamaka Shwasa", "Bronchial Asthma", "Dyspnea", "Wheezing", "Cough"],
        "formulations": ["Sitopaladi Churna", "Kanakasava", "Shvasakasa Chintamani"],
        "contraindications": ["Cold water bath", "Dust exposure", "Heavy kapha diet"],
        "anupana_rules": ["Warm water", "Honey with ginger juice"],
        "keywords": ["shwasa", "asthma", "tamaka shwasa", "sitopaladi", "wheezing", "pratiloma vata"]
    },
    {
        "shloka_id": "CS_CHI_07_024",
        "treatise": "Charaka Samhita",
        "sthana": "Chikitsa Sthana",
        "adhyaya": "Kushtha Chikitsa (Chapter 7)",
        "shloka_number": "24",
        "sanskrit_devanagari": "वातोत्तरेषु सर्पिर्वमनं श्लेष्मोत्तरेषु कुष्ठेषु। पित्तोत्तरेषु मोक्षो रक्तस्य विरेचनं श्रेष्ठम्॥",
        "sanskrit_iast": "vātottareṣu sarpirvamanaṁ śleṣmottareṣu kuṣṭheṣu | pittottareṣu mokṣo raktasya virecanaṁ śreṣṭham ||",
        "english_translation": "In Kushtha (Skin disorders), if Vata is predominant, Medicated Ghee (Tikta Ghrita) is supreme; if Kapha is predominant, emesis (Vamana) is indicated; if Pitta is predominant, bloodletting (Raktamokshana) and purgation (Virechana) are the treatments of choice.",
        "hindi_translation": "कुष्ठ में वात प्रधान होने पर घृत, कफ प्रधान होने पर वमन, और पित्त प्रधान होने पर रक्तमोक्षण तथा विरेचन सर्वश्रेष्ठ चिकित्सा है।",
        "dosha_association": ["Tridosha", "Pitta", "Kapha"],
        "indications": ["Kushtha", "Skin disorders", "Psoriasis", "Eczema", "Dermatitis"],
        "formulations": ["Arogyavardhini Vati", "Khadirarishta", "Mahatiktaka Ghrita"],
        "contraindications": ["Curd with fish", "Incompatible diet", "Excess salt"],
        "anupana_rules": ["Khadira Kwatha", "Warm water"],
        "keywords": ["kushtha", "skin", "eczema", "psoriasis", "arogyavardhini", "khadirarishta"]
    }
]


# Verified Botanical & Formulation Safety Dictionary
FORMULATION_SAFETY_CATALOG: Dict[str, Dict[str, Any]] = {
    "Sitopaladi Churna": {
        "ingredients": ["Mishri", "Vamshalochana", "Pippali", "Ela", "Tvak"],
        "indications": ["Kasa", "Shwasa", "Tamaka Shwasa", "Mandagni", "Bronchitis"],
        "standard_dosage": "2-3 grams twice daily with honey or ghee",
        "approved_anupana": ["Madhu (Honey)", "Ghee", "Warm water"],
        "disallowed_anupana": ["Cold water", "Sour curd"],
        "contraindications": ["Uncontrolled diabetes (due to Mishri content)"],
        "pediatric_safe": True,
        "pregnancy_safe": True,
        "shloka_ref": "CS_CHI_17_070"
    },
    "Arogyavardhini Vati": {
        "ingredients": ["Shuddha Parada", "Shuddha Gandhaka", "Lauha Bhasma", "Abhraka Bhasma", "Tamra Bhasma", "Triphala", "Shilajit", "Guggulu", "Chitraka", "Katuki"],
        "indications": ["Kushtha", "Yakrit Roga", "Kamala", "Jaundice", "Obesity", "Skin disorders"],
        "standard_dosage": "1-2 tablets (250mg - 500mg) twice daily after food",
        "approved_anupana": ["Warm water", "Neem Kwatha"],
        "disallowed_anupana": ["Cold water", "Milk"],
        "contraindications": ["Pregnancy (Strictly contraindicated due to Tamra/Parada)", "Severe renal failure"],
        "pediatric_safe": False,
        "pregnancy_safe": False,
        "shloka_ref": "CS_CHI_07_024"
    },
    "Simhanada Guggulu": {
        "ingredients": ["Shuddha Guggulu", "Triphala", "Shuddha Gandhaka", "Eranda Taila"],
        "indications": ["Amavata", "Rheumatoid Arthritis", "Vatarakta", "Skin diseases"],
        "standard_dosage": "1-2 tablets (500mg - 1g) twice daily",
        "approved_anupana": ["Warm water", "Shunthi Kwatha"],
        "disallowed_anupana": ["Cold water", "Milk", "Curd"],
        "contraindications": ["Pregnancy (Garbhini)", "Severe diarrhea (Atisara)", "Bleeding disorders"],
        "pediatric_safe": False,
        "pregnancy_safe": False,
        "shloka_ref": "AH_CHI_21_042"
    },
    "Chitrakadi Vati": {
        "ingredients": ["Chitraka", "Pippalimula", "Yavakshara", "Sauvarchala Lavana", "Panchalavana", "Shunthi"],
        "indications": ["Mandagni", "Agnimandya", "Grahani", "Ama Dosha", "Loss of appetite"],
        "standard_dosage": "1-2 tablets (250mg - 500mg) before meals",
        "approved_anupana": ["Warm water", "Takra (Buttermilk)"],
        "disallowed_anupana": ["Hot milk", "Cold drinks"],
        "contraindications": ["Active peptic ulcer", "Severe hyperacidity (Amlapitta with burning sensation)", "Pregnancy"],
        "pediatric_safe": False,
        "pregnancy_safe": False,
        "shloka_ref": "CS_CHI_15_051"
    },
    "Punarnava Mandur": {
        "ingredients": ["Punarnava", "Mandura Bhasma", "Trikatu", "Triphala", "Vidanga", "Chitraka"],
        "indications": ["Pandu", "Anemia", "Shotha (Edema)", "Splenomegaly", "Liver sluggishness"],
        "standard_dosage": "1-2 tablets (500mg) twice daily after food",
        "approved_anupana": ["Takra (Buttermilk)", "Warm water"],
        "disallowed_anupana": ["Alcohol", "Excessive sour substances"],
        "contraindications": ["Severe renal failure without monitoring", "Iron overload / Hemochromatosis"],
        "pediatric_safe": True,
        "pregnancy_safe": True,  # Often used under physician guidance for anemia in pregnancy
        "shloka_ref": "CS_CHI_16_034"
    },
    "Yogaraj Guggulu": {
        "ingredients": ["Chitraka", "Pippalimula", "Ajwain", "Vidanga", "Guggulu", "Rasna", "Gokshura"],
        "indications": ["Vatavyadhi", "Sandhigata Vata", "Osteoarthritis", "Backache", "Joint stiffness"],
        "standard_dosage": "1-2 tablets (500mg) twice daily",
        "approved_anupana": ["Warm water", "Rasna Kwatha", "Warm milk"],
        "disallowed_anupana": ["Chilled beverages"],
        "contraindications": ["Active gastritis/ulcer", "Pregnancy (contains mild emmenagogue herbs)"],
        "pediatric_safe": False,
        "pregnancy_safe": False,
        "shloka_ref": "CS_CHI_28_075"
    },
    "Chandraprabha Vati": {
        "ingredients": ["Shilajit", "Guggulu", "Karpura", "Vacha", "Musta", "Haridra", "Daruharidra", "Lauha Bhasma"],
        "indications": ["Prameha", "UTI (Mutrakrichhra)", "Diabetes support", "Weakness", "Prostate enlargement"],
        "standard_dosage": "1-2 tablets (500mg) twice daily",
        "approved_anupana": ["Warm water", "Milk", "Amalaki Swarasa"],
        "disallowed_anupana": ["Alcohol"],
        "contraindications": ["Severe iron hypersensitivity", "Uric acid nephropathy with acute obstruction"],
        "pediatric_safe": True,
        "pregnancy_safe": False,
        "shloka_ref": "CS_CHI_06_015"
    },
    "Sudarshana Churna": {
        "ingredients": ["Kiratatikta", "Haritaki", "Vibhitaki", "Amalaki", "Haridra", "Daruharidra", "Kantakari"],
        "indications": ["Jwara", "Acute & chronic fever", "Yakrit-Pliha vriddhi", "Malaria/Viral fever support"],
        "standard_dosage": "2-4 grams twice daily with warm water",
        "approved_anupana": ["Ushnodaka (Warm water)"],
        "disallowed_anupana": ["Cold water", "Sugary syrups"],
        "contraindications": ["Severe emaciation without fever"],
        "pediatric_safe": True,
        "pregnancy_safe": True,
        "shloka_ref": "CS_CHI_03_142"
    }
}

