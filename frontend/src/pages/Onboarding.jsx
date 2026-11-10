import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, User, Sparkles, HeartPulse, Stethoscope, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export default function Onboarding({ onPatientCreated }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    age: 38,
    gender: 'Female',
    contact: '',
    prakriti: 'Vata-Kapha',
    agni: 'Mandagni (Sluggish / Kapha dominant)',
    koshtha: 'Madhyama (Moderate)',
    bala: 'Madhyama (Moderate Strength)',
    current_season: 'Hemanta (Early Winter)',
    is_pregnant: false,
    is_lactating: false,
    chief_complaints: '',
    duration: '1 month',
    triggering_nidana: '',
    // Ashtavidha Pariksha
    ashtavidha: {
      nadi: 'Manda / Kaphaja Gati (Slow, heavy)',
      mutra: 'Avila (Slightly turbid, normal frequency)',
      mala: 'Saama (Sticky, unformed, foul odor)',
      jihwa: 'Saama (Thick white coated tongue)',
      shabda: 'Prakruta (Normal tone)',
      sparsha: 'Sheetala (Cold to touch)',
      druk: 'Alpa Avila (Slightly dull eyes)',
      akruti: 'Madhyama (Moderate build)',
      notes: ''
    }
  });

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAshtavidhaChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      ashtavidha: { ...prev.ashtavidha, [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Patient in Database
      const patientPayload = {
        full_name: formData.full_name || 'Anonymous Patient',
        age: Number(formData.age),
        gender: formData.gender,
        contact: formData.contact,
        prakriti: formData.prakriti,
        agni: formData.agni,
        koshtha: formData.koshtha,
        bala: formData.bala,
        current_season: formData.current_season,
        is_pregnant: formData.is_pregnant,
        is_lactating: formData.is_lactating,
        ashtavidha: formData.ashtavidha
      };

      const pRes = await api.createPatient(patientPayload);
      const newPatientId = pRes.patient_id;

      // 2. Run AyurParam 2.9B Clinical Analysis & Save Consultation
      const consultPayload = {
        patient_id: newPatientId,
        patient_name: formData.full_name,
        age: Number(formData.age),
        gender: formData.gender,
        is_pregnant: formData.is_pregnant,
        is_lactating: formData.is_lactating,
        prakriti: formData.prakriti,
        agni: formData.agni,
        koshtha: formData.koshtha,
        bala: formData.bala,
        current_season: formData.current_season,
        chief_complaints: [formData.chief_complaints || 'General wellness & joint stiffness'],
        duration: formData.duration,
        triggering_nidana: formData.triggering_nidana,
        save_to_patient: true
      };

      await api.analyzeConsultation(consultPayload);

      if (onPatientCreated) {
        onPatientCreated(newPatientId);
      }

      navigate('/');
    } catch (err) {
      alert('Failed to save patient intake: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Step Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
            Personalized Clinical Intake
          </span>
          <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            Rogi-Roga Pariksha &amp; Case Setup
          </h1>
        </div>
        <div className="flex items-center space-x-1 text-xs font-bold text-stone-500">
          <span>Step {step} of 4</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-8 shadow-sm space-y-6">

        {/* STEP 1: DEMOGRAPHICS */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
              <User className="w-4 h-4 text-emerald-600" />
              1. Patient Demographics &amp; Vulnerability Status
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Full Name:</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => handleTextChange('full_name', e.target.value)}
                placeholder="e.g. Radhika Sharma"
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Age (Years):</label>
                <input
                  type="number"
                  min="1"
                  max="115"
                  value={formData.age}
                  onChange={(e) => handleTextChange('age', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Gender:</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleTextChange('gender', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Contact / Registration #:</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleTextChange('contact', e.target.value)}
                  placeholder="+91..."
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Current Season (Ritu):</label>
                <select
                  value={formData.current_season}
                  onChange={(e) => handleTextChange('current_season', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Hemanta (Early Winter)">Hemanta (Early Winter)</option>
                  <option value="Shishira (Late Winter)">Shishira (Late Winter)</option>
                  <option value="Vasanta (Spring)">Vasanta (Spring)</option>
                  <option value="Grishma (Summer)">Grishma (Summer)</option>
                  <option value="Varsha (Monsoon)">Varsha (Monsoon)</option>
                  <option value="Sharad (Autumn)">Sharad (Autumn)</option>
                </select>
              </div>
            </div>

            {/* Vulnerability Check */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
              <span className="text-[11px] font-bold uppercase text-amber-900 dark:text-amber-300 block">
                AyurGuard Vulnerability Guardrails
              </span>
              <label className="flex items-center space-x-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_pregnant}
                  onChange={(e) => handleTextChange('is_pregnant', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold">Patient is Pregnant (Garbhini) — Triggers strict emmenagogue &amp; purgative blocking</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_lactating}
                  onChange={(e) => handleTextChange('is_lactating', e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold">Patient is Lactating (Sutika)</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: CONSTITUTION & PHYSIOLOGY */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              2. Ayurvedic Constitution (Prakriti, Agni &amp; Koshtha)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Baseline Prakriti:</label>
                <select
                  value={formData.prakriti}
                  onChange={(e) => handleTextChange('prakriti', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Vata-Kapha">Vata-Kapha</option>
                  <option value="Vata-Pitta">Vata-Pitta</option>
                  <option value="Pitta-Kapha">Pitta-Kapha</option>
                  <option value="Vata">Vata</option>
                  <option value="Pitta">Pitta</option>
                  <option value="Kapha">Kapha</option>
                  <option value="Tridoshaja (Sannipata)">Tridoshaja (Sannipata)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Agni (Digestive Fire):</label>
                <select
                  value={formData.agni}
                  onChange={(e) => handleTextChange('agni', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Mandagni (Sluggish / Kapha dominant)">Mandagni (Sluggish / Kapha)</option>
                  <option value="Vishamagni (Irregular / Vata dominant)">Vishamagni (Irregular / Vata)</option>
                  <option value="Tikshnagni (Hyperactive / Pitta dominant)">Tikshnagni (Hyperactive / Pitta)</option>
                  <option value="Samagni (Balanced / Healthy)">Samagni (Balanced)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Koshtha (Bowel Habit):</label>
                <select
                  value={formData.koshtha}
                  onChange={(e) => handleTextChange('koshtha', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Madhyama (Moderate)">Madhyama (Moderate)</option>
                  <option value="Krura (Hard / Constipated)">Krura (Hard / Constipated)</option>
                  <option value="Mridu (Soft / Sensitive)">Mridu (Soft / Loose)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Bala (Constitutional Strength):</label>
                <select
                  value={formData.bala}
                  onChange={(e) => handleTextChange('bala', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Madhyama (Moderate Strength)">Madhyama (Moderate)</option>
                  <option value="Pravara (Superior Strength)">Pravara (Superior)</option>
                  <option value="Avara (Poor / Debilitated)">Avara (Poor / Debilitated)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ASHTAVIDHA PARIKSHA */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              3. Ashtavidha Pariksha (Eight-Fold Clinical Examination)
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Nadi (Pulse Gati):</label>
                <input
                  type="text"
                  value={formData.ashtavidha.nadi}
                  onChange={(e) => handleAshtavidhaChange('nadi', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Jihwa (Tongue / Ama):</label>
                <input
                  type="text"
                  value={formData.ashtavidha.jihwa}
                  onChange={(e) => handleAshtavidhaChange('jihwa', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Mala (Stool Habit):</label>
                <input
                  type="text"
                  value={formData.ashtavidha.mala}
                  onChange={(e) => handleAshtavidhaChange('mala', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Mutra (Urine Character):</label>
                <input
                  type="text"
                  value={formData.ashtavidha.mutra}
                  onChange={(e) => handleAshtavidhaChange('mutra', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Sparsha (Skin / Temperature):</label>
                <input
                  type="text"
                  value={formData.ashtavidha.sparsha}
                  onChange={(e) => handleAshtavidhaChange('sparsha', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Druk (Eyes &amp; Sclera):</label>
                <input
                  type="text"
                  value={formData.ashtavidha.druk}
                  onChange={(e) => handleAshtavidhaChange('druk', e.target.value)}
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: CHIEF COMPLAINTS & NIDANA */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              4. Chief Complaints (Lakshanas) &amp; Triggering Factors (Nidana)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Chief Complaints / Symptoms:
              </label>
              <textarea
                rows="4"
                required
                value={formData.chief_complaints}
                onChange={(e) => handleTextChange('chief_complaints', e.target.value)}
                placeholder="e.g. Severe morning joint stiffness in knees and wrists, fatigue, loss of appetite, feeling of heavy limbs (Gaurava)..."
                className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Duration of Complaints:</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleTextChange('duration', e.target.value)}
                  placeholder="e.g. 2 months"
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Suspected Triggering Nidana:</label>
                <input
                  type="text"
                  value={formData.triggering_nidana}
                  onChange={(e) => handleTextChange('triggering_nidana', e.target.value)}
                  placeholder="e.g. Curd at night, cold weather, stress"
                  className="w-full border border-stone-300 dark:border-stone-700 dark:bg-stone-800 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 flex items-center space-x-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : <div></div>}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-extrabold flex items-center space-x-2 shadow-lg transition"
            >
              {loading ? (
                <span>Synthesizing with AyurParam 2.9B...</span>
              ) : (
                <>
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Execute Roganirnaya &amp; Generate Case</span>
                </>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

