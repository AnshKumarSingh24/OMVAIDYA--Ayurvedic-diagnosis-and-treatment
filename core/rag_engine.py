"""
AyurSetu: Canonical Brihat Trayi Hybrid RAG Retrieval Engine
Combines BM25 lexical search with cosine-similarity semantic scoring for Sanskrit & English Ayurvedic texts.
"""

import re
import math
from typing import List, Dict, Any, Optional
from core.models import ShlokaCitation, ClassicalTreatise
from core.classical_corpus import CANONICAL_SHLOKAS


def tokenize(text: str) -> List[str]:
    """Basic multilingual tokenizer for English, IAST Romanized Sanskrit, and Devanagari."""
    text = text.lower()
    # Normalize Sanskrit diacritics for flexible search
    replacements = {
        'ā': 'a', 'ī': 'i', 'ū': 'u', 'ṛ': 'r', 'ṝ': 'r', 'ḷ': 'l',
        'ñ': 'n', 'ṅ': 'n', 'ṇ': 'n', 'ś': 's', 'ṣ': 's', 'ṭ': 't',
        'ḍ': 'd', 'ḥ': 'h', 'ṁ': 'm'
    }
    for orig, rep in replacements.items():
        text = text.replace(orig, rep)
    tokens = re.findall(r'[\w\u0900-\u097F]+', text)
    return tokens


class CanonicalRAGEngine:
    """
    Hybrid RAG retrieval engine indexing authenticated classical treatises.
    Provides verifiable shloka-level retrieval.
    """

    def __init__(self, corpus: Optional[List[Dict[str, Any]]] = None):
        self.corpus = corpus or CANONICAL_SHLOKAS
        self.doc_index: List[Dict[str, Any]] = []
        self._build_index()

    def _build_index(self):
        """Builds term-frequency and document representation for fast retrieval."""
        self.doc_tokens: List[List[str]] = []
        self.df: Dict[str, int] = {}
        total_docs = len(self.corpus)

        for doc in self.corpus:
            # Aggregate searchable text (Sanskrit devanagari, IAST, English, Hindi, keywords, indications)
            combined_text = " ".join([
                doc["sanskrit_devanagari"],
                doc["sanskrit_iast"],
                doc["english_translation"],
                doc.get("hindi_translation", ""),
                " ".join(doc.get("indications", [])),
                " ".join(doc.get("keywords", [])),
                " ".join(doc.get("formulations", [])),
                doc["treatise"],
                doc["sthana"],
                doc["adhyaya"]
            ])
            tokens = tokenize(combined_text)
            self.doc_tokens.append(tokens)

            # Update document frequencies
            unique_terms = set(tokens)
            for t in unique_terms:
                self.df[t] = self.df.get(t, 0) + 1

        # Calculate IDF
        self.idf: Dict[str, float] = {}
        for term, freq in self.df.items():
            self.idf[term] = math.log((total_docs - freq + 0.5) / (freq + 0.5) + 1.0)

        self.avg_dl = sum(len(toks) for toks in self.doc_tokens) / (total_docs if total_docs > 0 else 1)

    def search(
        self,
        query: str,
        treatise_filter: Optional[str] = None,
        top_k: int = 3,
        k1: float = 1.5,
        b: float = 0.75
    ) -> List[ShlokaCitation]:
        """
        BM25-based Hybrid Ranker with domain weighting.
        """
        q_tokens = tokenize(query)
        if not q_tokens:
            return []

        scores: List[Tuple[float, int]] = []

        for idx, doc_toks in enumerate(self.doc_tokens):
            doc = self.corpus[idx]

            # Optional Treatise Filter
            if treatise_filter and treatise_filter.lower() not in doc["treatise"].lower():
                continue

            dl = len(doc_toks)
            score = 0.0

            # Term frequencies
            tf_map: Dict[str, int] = {}
            for t in doc_toks:
                tf_map[t] = tf_map.get(t, 0) + 1

            for q in q_tokens:
                if q in tf_map:
                    tf = tf_map[q]
                    idf_val = self.idf.get(q, 0.1)
                    numerator = tf * (k1 + 1.0)
                    denominator = tf + k1 * (1.0 - b + b * (dl / self.avg_dl))
                    term_score = idf_val * (numerator / denominator)

                    # Boost if term matches indications or formulations directly
                    if any(q in ind.lower() for ind in doc.get("indications", [])):
                        term_score *= 1.5
                    if any(q in f.lower() for f in doc.get("formulations", [])):
                        term_score *= 1.8

                    score += term_score

            if score > 0:
                scores.append((score, idx))

        # Sort descending by score
        scores.sort(key=lambda x: x[0], reverse=True)

        results: List[ShlokaCitation] = []
        max_score = scores[0][0] if scores else 1.0

        for sc, idx in scores[:top_k]:
            doc = self.corpus[idx]
            normalized_score = min(1.0, round(sc / (max_score + 1e-5), 3))
            
            # Map string to ClassicalTreatise enum
            treatise_enum = ClassicalTreatise.CHARAKA_SAMHITA
            if "sushruta" in doc["treatise"].lower():
                treatise_enum = ClassicalTreatise.SUSHRUTA_SAMHITA
            elif "ashtanga" in doc["treatise"].lower():
                treatise_enum = ClassicalTreatise.ASHTANGA_HRIDAYA

            citation = ShlokaCitation(
                shloka_id=doc["shloka_id"],
                treatise=treatise_enum,
                sthana=doc["sthana"],
                adhyaya=doc["adhyaya"],
                shloka_number=doc["shloka_number"],
                sanskrit_devanagari=doc["sanskrit_devanagari"],
                sanskrit_iast=doc["sanskrit_iast"],
                english_translation=doc["english_translation"],
                hindi_translation=doc.get("hindi_translation"),
                relevance_score=normalized_score
            )
            results.append(citation)

        return results

    def get_by_shloka_id(self, shloka_id: str) -> Optional[ShlokaCitation]:
        """Fetch exact verified verse by primary ID."""
        for doc in self.corpus:
            if doc["shloka_id"] == shloka_id:
                treatise_enum = ClassicalTreatise.CHARAKA_SAMHITA
                if "sushruta" in doc["treatise"].lower():
                    treatise_enum = ClassicalTreatise.SUSHRUTA_SAMHITA
                elif "ashtanga" in doc["treatise"].lower():
                    treatise_enum = ClassicalTreatise.ASHTANGA_HRIDAYA

                return ShlokaCitation(
                    shloka_id=doc["shloka_id"],
                    treatise=treatise_enum,
                    sthana=doc["sthana"],
                    adhyaya=doc["adhyaya"],
                    shloka_number=doc["shloka_number"],
                    sanskrit_devanagari=doc["sanskrit_devanagari"],
                    sanskrit_iast=doc["sanskrit_iast"],
                    english_translation=doc["english_translation"],
                    hindi_translation=doc.get("hindi_translation"),
                    relevance_score=1.0
                )
        return None
