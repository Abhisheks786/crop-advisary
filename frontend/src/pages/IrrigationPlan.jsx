import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Droplets, 
  Info, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { calculateIrrigation } from '../services/irrigationService';
import { getCropVisuals } from '../utils/cropMedia';
import { WATER_LEVELS, IRRIGATION_METHODS } from '../utils/constants';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const IrrigationPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateData = location.state || {};

  const [formData, setFormData] = useState({
    crop_name: stateData.cropName || 'Wheat',
    landArea: stateData.landArea || '5',
    landUnit: stateData.landUnit || 'acres',
    waterAvailability: stateData.waterAvailability || 'Medium',
    irrigationMethod: stateData.irrigationMethod || 'Flood',
    season: stateData.season || 'Rabi'
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPlan = async (params) => {
    setLoading(true);
    try {
      const res = await calculateIrrigation(params);
      setPlan(res.data);
    } catch (err) {
      console.error('Error fetching irrigation plan:', err);
      // Fallback default calculation
      setPlan({
        crop_name: params.crop_name,
        land_area: { value: parseFloat(params.landArea), unit: params.landUnit },
        irrigation_method: { name: params.irrigationMethod, efficiency: 0.55 },
        total_water_required_liters: 320000,
        water_available_liters: 350000,
        water_surplus_deficit: 30000,
        water_status: 'Optimal',
        schedule: [
          { stage: 'Crown Root Initiation', day: 21, water_mm: 60, water_liters: 72000, status: 'Critical' },
          { stage: 'Tillering', day: 45, water_mm: 70, water_liters: 84000, status: 'Important' },
          { stage: 'Jointing', day: 65, water_mm: 70, water_liters: 84000, status: 'Important' },
          { stage: 'Flowering Stage', day: 85, water_mm: 80, water_liters: 96000, status: 'Critical' },
          { stage: 'Grain Filling', day: 105, water_mm: 60, water_liters: 72000, status: 'Important' },
        ],
        critical_stages: ['Crown Root Initiation', 'Flowering Stage'],
        frequency: 'Every 15-20 days',
        warnings: [],
        alternatives: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan(formData);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPlan(formData);
  };

  const cropVisual = getCropVisuals(formData.crop_name);

  return (
    <div className="space-y-8 fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-2xl shadow-sm">
              💧
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200 mb-1">
                <span>Precision Water Scheduling & Hydrological Modeling</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                Smart Irrigation & Moisture Schedule
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
              <img src={cropVisual.image} alt={cropVisual.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-bold text-slate-900">{cropVisual.name}</p>
                <span className="text-[10px] text-slate-500">{formData.landArea} {formData.landUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Parameter Form (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 font-display mb-4 flex items-center gap-2">
              <span>🎛️ Adjust Field Parameters</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Crop
                </label>
                <input 
                  type="text"
                  value={formData.crop_name}
                  onChange={e => setFormData({ ...formData, crop_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Land Area
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.landArea}
                    onChange={e => setFormData({ ...formData, landArea: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white focus:border-sky-500 outline-none"
                  />
                  <select
                    value={formData.landUnit}
                    onChange={e => setFormData({ ...formData, landUnit: e.target.value })}
                    className="w-28 px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Available Water Supply
                </label>
                <select
                  value={formData.waterAvailability}
                  onChange={e => setFormData({ ...formData, waterAvailability: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-sky-900 focus:bg-white outline-none"
                >
                  {WATER_LEVELS.map(w => (
                    <option key={w} value={w}>{w} Water Supply</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Irrigation Technique
                </label>
                <select
                  value={formData.irrigationMethod}
                  onChange={e => setFormData({ ...formData, irrigationMethod: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:bg-white outline-none"
                >
                  {IRRIGATION_METHODS.map(m => (
                    <option key={m} value={m}>{m} Irrigation</option>
                  ))}
                </select>
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-950/20 transition-all flex items-center justify-center gap-2"
              >
                <Droplets size={16} />
                <span>{loading ? 'Re-calculating...' : 'Recalculate Water Plan'}</span>
              </Button>
            </form>
          </div>

          {/* Efficiency Insight */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 text-xs space-y-2 text-sky-950">
            <div className="flex items-center gap-2 font-bold text-sky-900">
              <Sparkles size={16} className="text-sky-600" />
              <span>Water Saving Suggestion</span>
            </div>
            <p className="leading-relaxed text-sky-900/90">
              Upgrading from conventional flood irrigation to drip or micro-sprinklers can improve water delivery efficiency from <strong>50% to 90%</strong>, saving over 140,000 Liters per acre.
            </p>
          </div>
        </div>

        {/* Right Column: Hydrological Analysis & Stage Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {plan && (
            <>
              {/* Water Balance Summary Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 font-display mb-4">
                  Hydrological Volume & Water Balance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Total Required</span>
                    <p className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                      {(plan.total_water_required_liters || 0).toLocaleString()} <span className="text-xs font-normal">L</span>
                    </p>
                    <span className="text-[11px] text-slate-500">For full crop cycle</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                    <span className="text-[11px] font-bold text-sky-600 uppercase">Available Supply</span>
                    <p className="text-xl font-extrabold text-sky-900 font-display mt-0.5">
                      {(plan.water_available_liters || 0).toLocaleString()} <span className="text-xs font-normal">L</span>
                    </p>
                    <span className="text-[11px] text-sky-700">Estimated capacity</span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    (plan.water_surplus_deficit || 0) >= 0 
                      ? 'bg-[#FAFAF7] border-[#E8E6D5] text-[#1A1A11]' 
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}>
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {(plan.water_surplus_deficit || 0) >= 0 ? 'Water Surplus' : 'Water Deficit'}
                    </span>
                    <p className={`text-xl font-extrabold font-display mt-0.5 ${
                      (plan.water_surplus_deficit || 0) >= 0 ? 'text-[#4A4A2E]' : 'text-red-600'
                    }`}>
                      {Math.abs(plan.water_surplus_deficit || 0).toLocaleString()} <span className="text-xs font-normal">L</span>
                    </p>
                    <span className="text-[11px] font-semibold">{plan.water_status || 'Optimal'}</span>
                  </div>
                </div>

                {/* Warnings */}
                {plan.warnings?.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 mb-4">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      {plan.warnings.map((w, i) => <p key={i} className="font-semibold">{w}</p>)}
                    </div>
                  </div>
                )}
              </div>

              {/* Stage-wise Irrigation Timeline */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Stage-by-Stage Irrigation Timeline
                    </h3>
                    <p className="text-xs text-slate-500">Application timings and water distribution per growth phase</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                    Frequency: {plan.frequency}
                  </span>
                </div>

                <div className="space-y-4">
                  {(plan.schedule || []).map((stage, idx) => {
                    const isCritical = stage.status === 'Critical' || (plan.critical_stages || []).includes(stage.stage);
                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isCritical 
                            ? 'bg-amber-50/70 border-amber-300/80 shadow-xs' 
                            : 'bg-slate-50/70 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm ${
                            isCritical ? 'bg-amber-500 text-white' : 'bg-sky-600 text-white'
                          }`}>
                            D{stage.day}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{stage.stage}</h4>
                              {isCritical && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                                  Critical Stage
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Approx. Day {stage.day} after sowing</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-right sm:text-right">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Volume</span>
                            <p className="text-sm font-extrabold text-slate-900 font-display">
                              {(stage.water_liters || 0).toLocaleString()} <span className="text-xs font-normal">L</span>
                            </p>
                          </div>
                          <div className="min-w-[70px]">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Depth</span>
                            <p className="text-sm font-extrabold text-sky-700 font-display">
                              {stage.water_mm} mm
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IrrigationPlan;
