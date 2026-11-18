/**
 * AyuVaidya: Clinical Data Normalization, Canonical Mapping, and Ordering Utilities
 * Enforces single source of truth, eliminates duplicates, and provides deterministic clinical hierarchy.
 */

/**
 * Normalizes user-entered clinical text:
 * - Trims leading/trailing whitespace
 * - Collapses repeated spaces, tabs, and newlines
 * - Converts ALL-CAPS strings into clean Sentence Case for display
 * - Deduplicates repeated tokens/phrases separated by commas or semicolons
 */
export function normalizeClinicalText(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text.trim().replace(/\s+/g, ' ');

  // If text is ALL-CAPS (or mostly uppercase letters), convert to Sentence Case
  const letters = cleaned.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 3 && letters === letters.toUpperCase()) {
    cleaned = cleaned.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  }

  // Deduplicate phrases separated by commas or semicolons (e.g. "headache, headache" -> "Headache")
  const parts = cleaned.split(/[,;]+/).map(p => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const seen = new Set();
    const unique = [];
    for (const part of parts) {
      const lower = part.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        unique.push(part);
      }
    }
    cleaned = unique.join(', ');
  }

  // Ensure first character is capitalized
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Maps synonymous field keys to a canonical key to prevent duplicate facts
 */
export function canonicalizeFactKey(key) {
  if (!key) return 'general_observation';
  const k = key.toLowerCase().trim().replace(/[\s-]+/g, '_');

  const synMap = {
    chief_problem: 'chief_complaint',
    reported_symptoms: 'chief_complaint',
    primary_complaint: 'chief_complaint',
    complaints: 'chief_complaint',
    symptoms: 'chief_complaint',
    constitution: 'prakriti',
    digestive_fire: 'agni',
    bowel_nature: 'koshtha',
    bowel_habit: 'koshtha',
    stiffness: 'morning_stiffness',
    stiffness_duration: 'morning_stiffness_duration',
    aggravating: 'aggravating_factors',
    relieving: 'relieving_factors'
  };

  if (synMap[k]) return synMap[k];

  // If key represents a prakriti value mistakenly used as a key
  if (k.includes('vata') || k.includes('pitta') || k.includes('kapha')) {
    return 'prakriti';
  }

  return k;
}

/**
 * Human-readable display label for fact keys
 */
export function humanizeFactKey(key) {
  const canonical = canonicalizeFactKey(key);
  const labelMap = {
    chief_complaint: 'Chief Complaint',
    prakriti: 'Constitutional Prakriti',
    agni: 'Digestive Fire (Agni)',
    koshtha: 'Bowel Tendency (Koshtha)',
    duration: 'Duration of Symptoms',
    morning_stiffness: 'Morning Stiffness (Stambha)',
    morning_stiffness_duration: 'Stiffness Duration',
    aggravating_factors: 'Aggravating Factors (Nidana)',
    relieving_factors: 'Relieving Factors (Upashaya)',
    prakriti_frame_energy: 'Frame & Energy Baseline',
    stress_response: 'Stress & Emotional Baseline',
    tongue_coating: 'Tongue Examination (Jihva Pariksha)',
    pulse_quality: 'Nadi Pariksha (Pulse Quality)',
    is_pregnant: 'Maternal Status (Garbhini)'
  };

  if (labelMap[canonical]) return labelMap[canonical];

  // Convert snake_case or camelCase to Title Case
  return canonical
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Generates a stable, deterministic hash ID for a fact based on category, key, and value
 */
export function generateFactId(category, canonicalKey, canonicalValue) {
  const str = `${category || 'symptom'}|${canonicalKey}|${canonicalValue || ''}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `fact-${Math.abs(hash).toString(36)}`;
}

/**
 * 12 Fixed Clinical Sections defined by the Ayurvedic clinical hierarchy
 */
export const CLINICAL_SECTIONS = [
  { id: 'chief_complaint', title: '1. Chief Complaint', order: 1 },
  { id: 'symptoms', title: '2. Cardinal Symptoms (Lakshanas)', order: 2 },
  { id: 'timing', title: '3. Timing & Duration (Kala)', order: 3 },
  { id: 'severity', title: '4. Severity & Functional Impact', order: 4 },
  { id: 'aggravating_relieving', title: '5. Aggravating & Relieving Factors', order: 5 },
  { id: 'associated_symptoms', title: '6. Associated Symptoms (Upadrava)', order: 6 },
  { id: 'prakriti_agni', title: '7. Prakriti, Agni & Koshtha', order: 7 },
  { id: 'lifestyle', title: '8. Lifestyle & Routine (Ahara-Vihara)', order: 8 },
  { id: 'medical_history', title: '9. Medical History & Purva Rupa', order: 9 },
  { id: 'medicines_allergies', title: '10. Medicines & Allergies', order: 10 },
  { id: 'pariksha', title: '11. Pariksha Observations (Ashtavidha)', order: 11 },
  { id: 'unknowns', title: '12. Unknowns & Pending Questions', order: 12 }
];

/**
 * Determines which of the 12 clinical sections a fact belongs to
 */
export function getSectionForFact(fact) {
  const cat = (fact.category || '').toLowerCase();
  const key = canonicalizeFactKey(fact.key || '');

  if (key === 'chief_complaint') return 'chief_complaint';
  if (key.includes('duration') || key.includes('timing') || cat === 'timing' || key.includes('onset')) return 'timing';
  if (key.includes('severity') || key.includes('score') || key.includes('impact') || cat === 'severity') return 'severity';
  if (key.includes('aggravat') || key.includes('reliev') || cat === 'nidana' || cat === 'upashaya') return 'aggravating_relieving';
  if (key === 'prakriti' || key === 'agni' || key === 'koshtha' || cat === 'prakriti' || cat === 'agni' || cat === 'koshtha') return 'prakriti_agni';
  if (cat === 'pariksha' || key.includes('tongue') || key.includes('pulse') || key.includes('nadi') || key.includes('mutra') || key.includes('mala')) return 'pariksha';
  if (cat === 'lifestyle' || key.includes('diet') || key.includes('stress') || key.includes('energy') || key.includes('sleep')) return 'lifestyle';
  if (cat === 'red_flag' || key.includes('history') || key.includes('prior') || key.includes('purva_rupa')) return 'medical_history';
  if (cat === 'medicine' || key.includes('allergy') || key.includes('drug') || cat === 'allergy') return 'medicines_allergies';
  if (cat === 'upadrava' || key.includes('associated')) return 'associated_symptoms';
  if (cat === 'unknown') return 'unknowns';

  return 'symptoms';
}

/**
 * Deduplicates, normalizes, and groups facts into the canonical 12 sections.
 * Guarantees that:
 * 1. Synonymous keys (e.g. chief_problem vs reported_symptoms) are collapsed into a single fact.
 * 2. Raw input is cleaned into Sentence Case and deduplicated.
 * 3. Each fact has a deterministic ID.
 * 4. Facts are grouped in the exact 12-section order.
 */
export function deduplicateAndGroupFacts(rawFacts = []) {
  if (!Array.isArray(rawFacts)) return [];

  // Map to hold unique facts by canonical category + canonical key
  const factMap = new Map();

  for (const f of rawFacts) {
    if (!f || !f.key) continue;

    const canonicalKey = canonicalizeFactKey(f.key);
    let category = (f.category || 'symptom').toLowerCase();
    
    // Normalize category according to canonical key
    if (canonicalKey === 'chief_complaint') category = 'symptom';
    else if (canonicalKey === 'prakriti') category = 'prakriti';
    else if (canonicalKey === 'agni') category = 'agni';
    else if (canonicalKey === 'koshtha') category = 'koshtha';

    const normalizedVal = normalizeClinicalText(f.value || f.normalized_value || '');
    if (!normalizedVal) continue;

    // Stable dedup ID based on canonical key
    const dedupKey = canonicalKey;

    if (!factMap.has(dedupKey)) {
      factMap.set(dedupKey, {
        id: f.id ? `db-${f.id}` : generateFactId(category, canonicalKey, normalizedVal),
        dbId: f.id,
        category: category,
        key: canonicalKey,
        rawKey: f.key,
        humanKey: humanizeFactKey(canonicalKey),
        value: normalizedVal,
        source_type: f.source_type || 'patient_reported',
        confidence: f.confidence || 1.0,
        confirmed_by_clinician: Boolean(f.confirmed_by_clinician),
        created_at: f.created_at || new Date().toISOString(),
        referenceCount: 1,
        sectionId: getSectionForFact({ category, key: canonicalKey })
      });
    } else {
      const existing = factMap.get(dedupKey);
      existing.referenceCount += 1;
      if (f.confirmed_by_clinician && !existing.confirmed_by_clinician) {
        existing.confirmed_by_clinician = true;
      }
      // If the incoming value has different content, merge or retain longer description
      if (normalizedVal !== existing.value && !existing.value.toLowerCase().includes(normalizedVal.toLowerCase())) {
        existing.value = `${existing.value}; ${normalizedVal}`;
      }
    }
  }

  // Group facts by section in fixed canonical order (1 to 12)
  const sectionsWithFacts = CLINICAL_SECTIONS.map(sec => {
    const factsInSection = Array.from(factMap.values())
      .filter(f => f.sectionId === sec.id)
      .sort((a, b) => {
        // Clinically confirmed first
        if (a.confirmed_by_clinician !== b.confirmed_by_clinician) {
          return a.confirmed_by_clinician ? -1 : 1;
        }
        // Most recently confirmed / created second
        return (b.created_at || '').localeCompare(a.created_at || '');
      });

    return {
      ...sec,
      facts: factsInSection
    };
  }).filter(sec => sec.facts.length > 0);

  return sectionsWithFacts;
}

/**
 * Extracts list of expected but not yet recorded observations
 */
export function getPendingUnknowns(facts = []) {
  const existingKeys = new Set(facts.map(f => canonicalizeFactKey(f.key)));
  const checklist = [
    { key: 'morning_stiffness_duration', label: 'Duration of morning stiffness (> 1 hour vs transient)' },
    { key: 'tongue_coating', label: 'Tongue coating & digestive Ama assessment (Jihva Pariksha)' },
    { key: 'aggravating_factors', label: 'Aggravating factors with food, weather, or exertion' },
    { key: 'relieving_factors', label: 'Relieving factors (heat vs cold applications)' },
    { key: 'appetite_nature', label: 'Appetite consistency and post-meal heaviness' }
  ];

  return checklist.filter(item => !existingKeys.has(canonicalizeFactKey(item.key)));
}
