import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  RefreshCw, 
  ArrowRight, 
  Sprout, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { getRotationRecommendation } from '../services/rotationService';
import { getCropVisuals } from '../utils/cropMedia';
import { PREVIOUS_CROPS, SOIL_TYPES, SEASONS } from '../utils/constants';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const CropRotation = () => {
  const location = useLocation();
  const stateData = location.state || {};

  const [formData, setFormData] = useState({
    previousCrop: stateData.previousCrop || 'Rice',
    currentCrop: stateData.currentCrop || 'Wheat',
    soilType: stateData.soilType || 'Loamy',
    season: stateData.season || 'Rabi'
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRotation = async (params) => {
    setLoading(true);
    try {
      const res = await getRotationRecommendation(params);
      setPlan(res.data);
    } catch (err) {
      console.error('Error fetching rotation:', err);
      // Fallback
      setPlan({
        previous_crop: { name: params.previousCrop || 'Rice', season: 'Kharif', soil_impact: 'Depletes' },
        current_crop: { name: params.currentCrop || 'Wheat', season: 'Rabi', soil_impact: 'Depletes' },
        suggested_next: [
          {
            crop_name: 'Chickpea',
            season: 'Rabi / Zaid',
            rotation_benefit: 'Nitrogen fixation restores up to 40 kg/ha active soil nitrogen after wheat.',
            soil_impact: 'Improves',
            nitrogen_fixing: true,
            compatibility_score: 95,
            reason: 'Legume after cereal restores nitrogen and reduces pest vulnerability.'
          },
          {
            crop_name: 'Mustard',
            season: 'Rabi',
            rotation_benefit: 'Deep taproot system loosens subsoil layers.',
            soil_impact: 'Neutral',
            nitrogen_fixing: false,
            compatibility_score: 85,
            reason: 'Breaks monoculture cereal cycle effectively.'
          },
          {
            crop_name: 'Maize',
            season: 'Kharif',
            rotation_benefit: 'High biomass crop returning organic matter.',
            soil_impact: 'Neutral',
            nitrogen_fixing: false,
            compatibility_score: 80,
            reason: 'Standard rotational sequence.'
          }
        ],
        rotation_sequence: [params.previousCrop || 'Rice', params.currentCrop || 'Wheat', 'Chickpea'],
        compatibility: 'Excellent',
        warnings: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRotation(formData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRotation(formData);
  };

  const prevVisual = getCropVisuals(formData.previousCrop);
  const currVisual = getCropVisuals(formData.currentCrop);

  return (
    <div className="space-y-8 fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl shadow-sm">
              🔄
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-[11px] font-bold border border-purple-200 mb-1">
                <span>Soil Health & Nitrogen Restoration Sequence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                Crop Rotation & Succession Planner
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Sequence: Previous → Current → Suggested Next */}
      {plan && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <h3 className="text-base font-bold text-slate-900 font-display mb-6">
            Visual Succession Sequence Flow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* 1. Previous Crop */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Step 1 • Previous Harvest
              </span>
              <div className="flex items-center gap-3">
                <img src={prevVisual.image} alt={prevVisual.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 font-display flex items-center gap-1">
                    <span>{prevVisual.emoji}</span>
                    <span>{formData.previousCrop || 'None'}</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Impact: {plan.previous_crop?.soil_impact || 'Neutral'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Current Crop */}
            <div className="p-5 rounded-2xl bg-[#FAFAF7] border border-[#D4CEBA] relative ring-2 ring-[#E8E6D5] shadow-xs">
              <span className="text-[10px] font-bold text-[#4A4A2E] uppercase tracking-wider block mb-1">
                Step 2 • Current Planned Crop
              </span>
              <div className="flex items-center gap-3">
                <img src={currVisual.image} alt={currVisual.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-[#1A1A11] font-display flex items-center gap-1">
                    <span>{currVisual.emoji}</span>
                    <span>{formData.currentCrop}</span>
                  </h4>
                  <span className="text-[11px] font-bold text-[#333320]">
                    Active Cultivar ({formData.season})
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Next Crop Recommendation */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 relative">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                Step 3 • AI Suggested Next
              </span>
              {plan.suggested_next?.[0] && (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧆</span>
                  <div>
                    <h4 className="font-bold text-purple-950 font-display">
                      {plan.suggested_next[0].crop_name}
                    </h4>
                    <span className="text-[11px] font-bold text-purple-800">
                      {plan.suggested_next[0].compatibility_score}% Compatibility
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 font-display mb-4">
              Configure Sequence
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Previous Crop
                </label>
                <select
                  value={formData.previousCrop}
                  onChange={e => setFormData({ ...formData, previousCrop: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white outline-none"
                >
                  <option value="None">None / Fallow</option>
                  {PREVIOUS_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current Crop
                </label>
                <select
                  value={formData.currentCrop}
                  onChange={e => setFormData({ ...formData, currentCrop: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#262619] focus:bg-white outline-none"
                >
                  {PREVIOUS_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Soil Type
                </label>
                <select
                  value={formData.soilType}
                  onChange={e => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white outline-none"
                >
                  {SOIL_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-950/20 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                <span>{loading ? 'Analyzing...' : 'Generate Succession Plan'}</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Rotation Suggestions (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-display">
            Recommended Next Succession Cultivars
          </h3>

          <div className="space-y-4">
            {plan?.suggested_next?.map((item, idx) => {
              const vis = getCropVisuals(item.crop_name);
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover-lift">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3.5">
                      <img src={vis.image} alt={item.crop_name} className="w-14 h-14 rounded-2xl object-cover border border-slate-100" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-slate-900 font-display flex items-center gap-1">
                            <span>{vis.emoji}</span>
                            <span>{item.crop_name}</span>
                          </h4>
                          {item.nitrogen_fixing && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F4EE] text-[#262619] border border-[#E8E6D5]">
                              🌱 Nitrogen Fixing
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Target Season: {item.season}</p>
                      </div>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-900 font-black text-sm flex items-center justify-center border border-purple-200">
                      {item.compatibility_score}%
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-[#F7FAF5] p-3 rounded-xl border border-slate-200/60 mb-2">
                    <strong>Agri-Benefit:</strong> {item.rotation_benefit}
                  </p>
                  <p className="text-xs text-slate-500 italic">{item.reason}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRotation;
