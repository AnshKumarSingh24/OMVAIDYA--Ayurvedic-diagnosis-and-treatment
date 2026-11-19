"""
AyuVaidya: Canonical Ayurvedic Knowledge Graph
NetworkX graph mapping classical Brihat Trayi entities:
Diseases (Vyadhi), Doshas, Dhatus, Srotas, Dravyas, Formulations, and Shloka citations.
"""

from typing import Dict, List, Any, Optional
import networkx as nx


class AyurvedicKnowledgeGraph:
    """
    Graph ontology bridging classical Ayurvedic pathology and therapeutics.
    """

    def __init__(self):
        self.graph = nx.MultiDiGraph()
        self._populate_canonical_ontology()

    def _populate_canonical_ontology(self):
        """Constructs canonical nodes and relationships across Brihat Trayi treatises."""
        g = self.graph

        # -------------------------------------------------------------
        # 1. DOSHA NODES
        # -------------------------------------------------------------
        doshas = [
            ("Vata", {"type": "Dosha", "guna": ["Laghu", "Ruksha", "Sheeta", "Khara", "Chala"], "color": "#0284c7"}),
            ("Pitta", {"type": "Dosha", "guna": ["Sasneha", "Ushna", "Tikshna", "Drava", "Amla"], "color": "#ea580c"}),
            ("Kapha", {"type": "Dosha", "guna": ["Guru", "Sheeta", "Mridu", "Snigdha", "Sthira"], "color": "#16a34a"}),
        ]
        for node_id, attrs in doshas:
            g.add_node(node_id, **attrs)

        # Sub-doshas
        subdoshas = [
            ("Vyana Vata", {"type": "SubDosha", "parent": "Vata", "function": "Circulation & Joint Movement"}),
            ("Apana Vata", {"type": "SubDosha", "parent": "Vata", "function": "Elimination & Pelvic Organs"}),
            ("Samana Vata", {"type": "SubDosha", "parent": "Vata", "function": "Digestive Fire Assimilation"}),
            ("Pachaka Pitta", {"type": "SubDosha", "parent": "Pitta", "function": "Core Digestion & Thermal Fire"}),
            ("Kledaka Kapha", {"type": "SubDosha", "parent": "Kapha", "function": "Gastric Moistening"}),
            ("Shleshaka Kapha", {"type": "SubDosha", "parent": "Kapha", "function": "Joint Lubrication & Synovial Fluid"})
        ]
        for node_id, attrs in subdoshas:
            g.add_node(node_id, **attrs)
            g.add_edge(attrs["parent"], node_id, relation="SUB_DIVISION")

        # -------------------------------------------------------------
        # 2. DHATU (TISSUE) NODES
        # -------------------------------------------------------------
        dhatus = ["Rasa", "Rakta", "Mamsa", "Meda", "Asthi", "Majja", "Shukra"]
        for d in dhatus:
            g.add_node(d, type="Dhatu", color="#8b5cf6")

        # Dhatu Posana Sequence
        for i in range(len(dhatus) - 1):
            g.add_edge(dhatus[i], dhatus[i+1], relation="NOURISHES")

        # -------------------------------------------------------------
        # 3. SROTAS (CHANNEL) NODES
        # -------------------------------------------------------------
        srotas_list = ["Rasavaha Srotas", "Raktavaha Srotas", "Annavaha Srotas", "Asthivaha Srotas", "Mutravaha Srotas", "Purishavaha Srotas"]
        for s in srotas_list:
            g.add_node(s, type="Srotas", color="#059669")

        # -------------------------------------------------------------
        # 4. DISEASE (VYADHI) NODES & SAMPRAPTI RELATIONS
        # -------------------------------------------------------------
        diseases = [
            {
                "id": "Amavata",
                "name": "Amavata (Rheumatoid / Inflammatory Joint Disorder)",
                "aggravates": ["Vata", "Kapha", "Shleshaka Kapha", "Vyana Vata"],
                "affects_dhatu": ["Rasa", "Asthi", "Majja"],
                "affects_srotas": ["Rasavaha Srotas", "Asthivaha Srotas"],
                "ama_involvement": True,
                "adhisthana": "Sandhi (Joints)",
                "shloka_ref": "AH_CHI_21_042"
            },
            {
                "id": "Grahani Dosha",
                "name": "Grahani Dosha (Malabsorption & Agnimandya)",
                "aggravates": ["Samana Vata", "Pachaka Pitta", "Kledaka Kapha"],
                "affects_dhatu": ["Rasa"],
                "affects_srotas": ["Annavaha Srotas", "Purishavaha Srotas"],
                "ama_involvement": True,
                "adhisthana": "Grahani (Duodenum)",
                "shloka_ref": "CS_CHI_15_051"
            },
            {
                "id": "Prameha",
                "name": "Prameha (Metabolic Syndrome & Diabetes)",
                "aggravates": ["Kapha", "Pitta"],
                "affects_dhatu": ["Meda", "Mamsa", "Rasa"],
                "affects_srotas": ["Mutravaha Srotas", "Rasavaha Srotas"],
                "ama_involvement": False,
                "adhisthana": "Basti (Bladder & Kidneys)",
                "shloka_ref": "CS_CHI_06_015"
            },
            {
                "id": "Pandu Roga",
                "name": "Pandu Roga (Anemia & Hepato-biliary Sluggishness)",
                "aggravates": ["Pitta", "Vata"],
                "affects_dhatu": ["Rakta", "Rasa", "Mamsa"],
                "affects_srotas": ["Raktavaha Srotas", "Rasavaha Srotas"],
                "ama_involvement": False,
                "adhisthana": "Hridaya and Dashadhamani",
                "shloka_ref": "CS_CHI_16_034"
            },
            {
                "id": "Vatavyadhi",
                "name": "Vatavyadhi (Degenerative Joint & Nerve Pain)",
                "aggravates": ["Vata", "Vyana Vata", "Apana Vata"],
                "affects_dhatu": ["Asthi", "Majja"],
                "affects_srotas": ["Asthivaha Srotas"],
                "ama_involvement": False,
                "adhisthana": "Sandhi and Snayu",
                "shloka_ref": "CS_CHI_28_075"
            },
            {
                "id": "Karshya",
                "name": "Karshya & Atyagni (Hypermetabolic Dhatukshaya & Emaciation)",
                "aggravates": ["Vata", "Samana Vata", "Pitta"],
                "affects_dhatu": ["Rasa", "Mamsa", "Meda"],
                "affects_srotas": ["Rasavaha Srotas", "Mamsavaha Srotas"],
                "ama_involvement": False,
                "adhisthana": "Amashaya and Dhatus",
                "shloka_ref": "CS_SUT_21_011"
            }
        ]

        for d in diseases:
            g.add_node(d["id"], type="Disease", name=d["name"], color="#dc2626", adhisthana=d["adhisthana"])
            for dosha in d["aggravates"]:
                g.add_edge(dosha, d["id"], relation="AGGRAVATES")
            for dhatu in d["affects_dhatu"]:
                g.add_edge(d["id"], dhatu, relation="VITIATES_DHATU")
            for srotas in d["affects_srotas"]:
                g.add_edge(d["id"], srotas, relation="OCCLUDES_CHANNEL")

        # -------------------------------------------------------------
        # 5. FORMULATION & DRAVYA (HERB) NODES
        # -------------------------------------------------------------
        formulations = [
            {
                "id": "Simhanada Guggulu",
                "treats": ["Amavata"],
                "palliates": ["Vata", "Kapha"],
                "approved_anupana": ["Warm water", "Shunthi Kwatha"],
                "contraindications": ["Pregnancy", "Diarrhea", "Cold water"],
                "shloka_ref": "AH_CHI_21_042",
                "herbs": ["Guggulu", "Triphala", "Gandhaka", "Eranda Taila"]
            },
            {
                "id": "Chitrakadi Vati",
                "treats": ["Grahani Dosha"],
                "palliates": ["Kapha", "Vata"],
                "approved_anupana": ["Warm water", "Takra"],
                "contraindications": ["Active ulcer", "Pregnancy"],
                "shloka_ref": "CS_CHI_15_051",
                "herbs": ["Chitraka", "Pippali", "Shunthi", "Yavakshara"]
            },
            {
                "id": "Chandraprabha Vati",
                "treats": ["Prameha"],
                "palliates": ["Kapha", "Pitta", "Vata"],
                "approved_anupana": ["Warm water", "Amalaki Juice", "Milk"],
                "contraindications": ["Iron hypersensitivity", "Pregnancy"],
                "shloka_ref": "CS_CHI_06_015",
                "herbs": ["Shilajit", "Guggulu", "Lauha Bhasma", "Haridra"]
            },
            {
                "id": "Punarnava Mandur",
                "treats": ["Pandu Roga"],
                "palliates": ["Pitta", "Kapha"],
                "approved_anupana": ["Takra", "Warm water"],
                "contraindications": ["Alcohol", "Excess sour foods"],
                "shloka_ref": "CS_CHI_16_034",
                "herbs": ["Punarnava", "Mandura Bhasma", "Triphala"]
            },
            {
                "id": "Yogaraj Guggulu",
                "treats": ["Vatavyadhi"],
                "palliates": ["Vata"],
                "approved_anupana": ["Warm water", "Rasna Kwatha"],
                "contraindications": ["Gastric ulcer", "Pregnancy"],
                "shloka_ref": "CS_CHI_28_075",
                "herbs": ["Guggulu", "Chitraka", "Rasna", "Ajwain"]
            }
        ]

        for f in formulations:
            g.add_node(f["id"], type="Formulation", color="#d97706", anupana=",".join(f["approved_anupana"]))
            for disease in f["treats"]:
                g.add_edge(f["id"], disease, relation="TREATS")
            for dosha in f["palliates"]:
                g.add_edge(f["id"], dosha, relation="PACIFIES")
            for h in f["herbs"]:
                g.add_node(h, type="Dravya", color="#10b981")
                g.add_edge(f["id"], h, relation="CONTAINS_HERB")

        # -------------------------------------------------------------
        # 6. SHLOKA CITATION NODES
        # -------------------------------------------------------------
        shlokas = [
            ("AH_CHI_21_042", "Ashtanga Hridaya Chi 21/42 (Amavata Chikitsa)"),
            ("CS_CHI_15_051", "Charaka Samhita Chi 15/51 (Grahani Agni Chikitsa)"),
            ("CS_CHI_06_015", "Charaka Samhita Chi 6/15 (Prameha Hetu & Chikitsa)"),
            ("CS_CHI_16_034", "Charaka Samhita Chi 16/34 (Pandu Chikitsa)"),
            ("CS_CHI_28_075", "Charaka Samhita Chi 28/75 (Vatavyadhi Chikitsa)"),
            ("SS_SU_15_041", "Sushruta Samhita Su 15/41 (Definition of Svastha)")
        ]
        for sid, label in shlokas:
            g.add_node(sid, type="Shloka", label=label, color="#4b5563")

        # Connect formulations and diseases to authenticated verses
        g.add_edge("Simhanada Guggulu", "AH_CHI_21_042", relation="AUTHENTICATED_BY")
        g.add_edge("Amavata", "AH_CHI_21_042", relation="GROUNDED_IN")
        g.add_edge("Chitrakadi Vati", "CS_CHI_15_051", relation="AUTHENTICATED_BY")
        g.add_edge("Grahani Dosha", "CS_CHI_15_051", relation="GROUNDED_IN")
        g.add_edge("Chandraprabha Vati", "CS_CHI_06_015", relation="AUTHENTICATED_BY")
        g.add_edge("Prameha", "CS_CHI_06_015", relation="GROUNDED_IN")
        g.add_edge("Punarnava Mandur", "CS_CHI_16_034", relation="AUTHENTICATED_BY")
        g.add_edge("Pandu Roga", "CS_CHI_16_034", relation="GROUNDED_IN")
        g.add_edge("Yogaraj Guggulu", "CS_CHI_28_075", relation="AUTHENTICATED_BY")
        g.add_edge("Vatavyadhi", "CS_CHI_28_075", relation="GROUNDED_IN")

    def trace_samprapti(self, disease_id: str) -> Dict[str, Any]:
        """
        Traces the complete etiopathogenesis path for a disease:
        Etiology -> Aggravated Dosha -> Vitiated Dhatu -> Occluded Srotas -> Manifested Disease -> Treatment.
        """
        if disease_id not in self.graph:
            return {"error": f"Disease '{disease_id}' not found in Ayurvedic Knowledge Graph"}

        g = self.graph
        doshas = [u for u, v, d in g.in_edges(disease_id, data=True) if d.get("relation") == "AGGRAVATES"]
        dhatus = [v for u, v, d in g.out_edges(disease_id, data=True) if d.get("relation") == "VITIATES_DHATU"]
        srotas = [v for u, v, d in g.out_edges(disease_id, data=True) if d.get("relation") == "OCCLUDES_CHANNEL"]
        formulations = [u for u, v, d in g.in_edges(disease_id, data=True) if d.get("relation") == "TREATS"]
        citations = [v for u, v, d in g.out_edges(disease_id, data=True) if d.get("relation") == "GROUNDED_IN"]

        return {
            "disease_id": disease_id,
            "disease_name": g.nodes[disease_id].get("name", disease_id),
            "adhisthana": g.nodes[disease_id].get("adhisthana", ""),
            "doshas_involved": doshas,
            "dhatus_vitiated": dhatus,
            "srotas_occluded": srotas,
            "recommended_formulations": formulations,
            "grounding_citations": citations
        }

    def export_subgraph(self, center_node: Optional[str] = None, depth: int = 1) -> Dict[str, Any]:
        """
        Exports nodes and links in a format ready for React visualizers.
        """
        g = self.graph
        if center_node and center_node in g:
            # Extract ego network
            sub_nodes = set([center_node])
            current = set([center_node])
            for _ in range(depth):
                nxt = set()
                for n in current:
                    nxt.update(g.neighbors(n))
                    nxt.update(g.predecessors(n))
                sub_nodes.update(nxt)
                current = nxt
            subg = g.subgraph(sub_nodes)
        else:
            subg = g

        nodes = []
        for n, attrs in subg.nodes(data=True):
            nodes.append({
                "id": str(n),
                "label": attrs.get("name", attrs.get("label", str(n))),
                "type": attrs.get("type", "Entity"),
                "color": attrs.get("color", "#64748b")
            })

        links = []
        for u, v, data in subg.edges(data=True):
            links.append({
                "source": str(u),
                "target": str(v),
                "relation": data.get("relation", "RELATED_TO")
            })

        return {"nodes": nodes, "links": links, "total_nodes": len(nodes), "total_edges": len(links)}


# Singleton instance
ayur_kg = AyurvedicKnowledgeGraph()

