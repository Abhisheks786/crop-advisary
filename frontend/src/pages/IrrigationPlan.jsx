import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Droplets, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Clock,
  ArrowRight,
  TrendingUp,
  Info,
  Layers,
  FileText
} from 'lucide-react';
import { calculateIrrigation } from '../services/irrigationService';
import { getCropVisuals } from '../utils/cropMedia';
import { WATER_LEVELS, IRRIGATION_METHODS } from '../utils/constants';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import { useLanguage } from '../context/LanguageContext';

const IrrigationPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const stateData = location.state || {};

  const [unitMode, setUnitMode] = useState('liters'); // 'liters' or 'gallons'
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
      // Fallback calculation
      setPlan({
        crop_name: params.crop_name,
        land_area: { value: parseFloat(params.landArea), unit: params.landUnit },
        irrigation_method: { name: params.irrigationMethod, efficiency: 0.55 },
        total_water_required_liters: 320000,
        water_available_liters: 300000,
        water_surplus_deficit: -20000,
        water_status: 'Slight Deficit',
        schedule: [
          { stage_name: 'Crown Root Initiation (CRI)', day: 21, water_mm: 60, water_liters: 64000, status: 'Critical' },
          { stage_name: 'Tillering Stage', day: 45, water_mm: 65, water_liters: 70000, status: 'Important' },
          { stage_name: 'Jointing Stage', day: 65, water_mm: 65, water_liters: 70000, status: 'Important' },
          { stage_name: 'Flowering Stage', day: 85, water_mm: 70, water_liters: 75000, status: 'Critical' },
          { stage_name: 'Milk / Dough Stage', day: 105, water_mm: 50, water_liters: 53000, status: 'Critical' },
        ],
        critical_stages: ['Crown Root Initiation (CRI)', 'Flowering Stage'],
        frequency: 'Every 15-20 days',
        warnings: ['Slight water deficit detected (-6%). Consider switching to sprinkler or drip to eliminate deficit.'],
        alternatives: [
          { crop_name: 'Mustard', water_savings: '35% less water', reason: 'Drought-hardy taproot system' },
          { crop_name: 'Chickpea', water_savings: '40% less water', reason: 'Deep rooting legume requiring only 2-3 irrigations' }
        ]
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

  // Conversion helper
  const formatVol = (liters = 0) => {
    if (unitMode === 'gallons') {
      const gals = Math.round(liters * 0.264172);
      return `${gals.toLocaleString('en-IN')} Gal`;
    }
    return `${liters.toLocaleString('en-IN')} L`;
  };

  const reqL = plan?.total_water_required_liters || 320000;
  const availL = plan?.water_available_liters || 300000;
  const balancePct = Math.min(100, Math.round((availL / reqL) * 100));
  const deficit = plan?.water_surplus_deficit || (availL - reqL);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & CROP CONTEXT                               */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E6D5] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center text-3xl shrink-0 shadow-xs">
            💧
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0284C7]/10 text-[#0284C7] text-xs font-bold border border-[#0284C7]/20 mb-1">
              <span>Precision Irrigation & Hydrological Scheduling</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262619] tracking-tight">
              Irrigation & Water Planner
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div className="flex items-center bg-[#F5F4EE] p-1 rounded-xl border border-[#E8E6D5] text-xs font-bold">
            <button
              onClick={() => setUnitMode('liters')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                unitMode === 'liters' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-[#6B6B47]'
              }`}
            >
              Liters
            </button>
            <button
              onClick={() => setUnitMode('gallons')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                unitMode === 'gallons' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-[#6B6B47]'
              }`}
            >
              Gallons
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={() => navigate('/plan', { state: { cropName: formData.crop_name } })}
          >
            Consolidated Plan
          </Button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. "IRRIGATE NEXT" URGENCY ALERT CARD                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#0284C7] to-[#0369A1] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
              <Clock size={14} />
              Immediate Action Alert
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Next Critical Watering: Crown Root Initiation (CRI)
            </h2>
            <p className="text-white/80 text-sm max-w-xl">
              Scheduled around <strong>Day 21</strong> after sowing. Applying irrigation during this phase ensures vigorous root crown development and prevents tillering failure.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 min-w-[180px]">
            <span className="text-xs uppercase tracking-wider text-white/80 block font-bold">Recommended Depth</span>
            <span className="text-3xl font-black block my-0.5">60 mm</span>
            <span className="text-xs text-white/90 font-mono font-semibold">{formatVol(64000)} for {formData.landArea} {formData.landUnit}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Adjustments & Alternatives (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E8E6D5] space-y-4">
            <h3 className="text-base font-bold text-[#262619] flex items-center gap-2">
              <span>Field Parameters</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A2E] mb-1.5">
                  Target Crop
                </label>
                <input 
                  type="text"
                  value={formData.crop_name}
                  onChange={e => setFormData({ ...formData, crop_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm font-bold text-[#262619] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A2E] mb-1.5">
                  Land Area
                </label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={formData.landArea}
                    onChange={e => setFormData({ ...formData, landArea: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm font-bold text-[#262619] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none"
                  />
                  <select
                    value={formData.landUnit}
                    onChange={e => setFormData({ ...formData, landUnit: e.target.value })}
                    className="w-28 px-3 py-2.5 rounded-xl border border-[#E8E6D5] bg-[#F5F4EE] text-xs font-bold text-[#4A4A2E] outline-none"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A2E] mb-1.5">
                  Water Availability
                </label>
                <select
                  value={formData.waterAvailability}
                  onChange={e => setFormData({ ...formData, waterAvailability: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm font-semibold text-[#0284C7] outline-none"
                >
                  {WATER_LEVELS.map(w => (
                    <option key={w} value={w}>{w} Water Supply</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4A2E] mb-1.5">
                  Irrigation Technique
                </label>
                <select
                  value={formData.irrigationMethod}
                  onChange={e => setFormData({ ...formData, irrigationMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm font-medium text-[#262619] outline-none"
                >
                  {IRRIGATION_METHODS.map(m => (
                    <option key={m} value={m}>{m} Irrigation</option>
                  ))}
                </select>
              </div>

              <Button
                variant="primary"
                type="submit"
                size="md"
                fullWidth
                loading={loading}
                icon={Droplets}
              >
                Recalculate Water Plan
              </Button>
            </form>
          </div>

          {/* Alternative Crops for Water Deficit */}
          {deficit < 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E6A900]/40 space-y-3">
              <div className="flex items-center gap-2 text-[#E6A900] font-bold text-sm">
                <AlertTriangle size={18} />
                <span>Low-Water Alternatives</span>
              </div>
              <p className="text-xs text-[#6B6B47]">
                Your available water is slightly below the crop requirement. Consider these drought-resilient crops:
              </p>
              <div className="space-y-2 pt-1">
                {(plan?.alternatives || [
                  { crop_name: 'Mustard', water_savings: '35% less water', reason: 'Drought hardy' },
                  { crop_name: 'Chickpea', water_savings: '40% less water', reason: '2-3 waterings only' }
                ]).map((alt, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#262619]">{alt.crop_name}</span>
                      <p className="text-[11px] text-[#5FA83D] font-medium">{alt.water_savings}</p>
                    </div>
                    <button
                      onClick={() => {
                        setFormData({ ...formData, crop_name: alt.crop_name });
                        fetchPlan({ ...formData, crop_name: alt.crop_name });
                      }}
                      className="text-xs font-bold text-[#0284C7] hover:underline"
                    >
                      Plan →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Water Balance Progress & Timeline (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {plan && (
            <>
              {/* ────────────────────────────────────────────────────────── */}
              {/* 3. WATER BALANCE PROGRESS BAR & CARDS                      */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E6D5] space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#262619]">
                    Water Balance & Requirement Analysis
                  </h3>
                  <p className="text-xs text-[#6B6B47] mt-0.5">
                    Comparison between available groundwater/canal quota and crop evapotranspiration demand
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B47] block">Available Water</span>
                    <p className="text-2xl font-black text-[#0284C7] mt-1 font-mono">
                      {formatVol(availL)}
                    </p>
                    <span className="text-xs text-[#6B6B47]">Estimated supply quota</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B47] block">Total Required</span>
                    <p className="text-2xl font-black text-[#262619] mt-1 font-mono">
                      {formatVol(reqL)}
                    </p>
                    <span className="text-xs text-[#6B6B47]">5 critical growth cycles</span>
                  </div>

                  <div className={`p-4 rounded-2xl border ${
                    deficit >= 0 
                      ? 'bg-[#5FA83D]/10 border-[#5FA83D]/30' 
                      : 'bg-[#E6A900]/10 border-[#E6A900]/30'
                  }`}>
                    <span className={`text-xs font-bold uppercase tracking-wider block ${
                      deficit >= 0 ? 'text-[#5FA83D]' : 'text-[#E6A900]'
                    }`}>
                      {deficit >= 0 ? 'Water Surplus' : 'Water Deficit'}
                    </span>
                    <p className={`text-2xl font-black mt-1 font-mono ${
                      deficit >= 0 ? 'text-[#4A4A2E]' : 'text-[#B8860B]'
                    }`}>
                      {deficit < 0 ? '-' : '+'}{formatVol(Math.abs(deficit))}
                    </p>
                    <span className="text-xs font-semibold text-[#6B6B47]">
                      {deficit >= 0 ? 'Optimal Reserve' : 'Deficit of ~6%'}
                    </span>
                  </div>
                </div>

                {/* Visual Water Balance Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#262619]">Water Coverage Level</span>
                    <span className="font-mono text-[#0284C7]">{balancePct}%</span>
                  </div>
                  <div className="w-full bg-[#E8E6D5] h-3.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        deficit >= 0 ? 'bg-[#5FA83D]' : 'bg-[#0284C7]'
                      }`}
                      style={{ width: `${balancePct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* 4. STAGE-WISE TIMELINE WITH CRITICAL BADGES                */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E6D5] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E6D5]">
                  <div>
                    <h3 className="text-lg font-bold text-[#262619]">
                      Stage-by-Stage Irrigation Timeline
                    </h3>
                    <p className="text-xs text-[#6B6B47]">
                      Water application schedule by plant phenology for {formData.crop_name}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#F5F4EE] text-[#4A4A2E] border border-[#E8E6D5] self-start sm:self-auto">
                    Frequency: {plan.frequency || 'Every 15-20 days'}
                  </span>
                </div>

                <div className="space-y-3">
                  {(plan.schedule || []).map((stage, idx) => {
                    const isCritical = stage.status === 'Critical' || (plan.critical_stages || []).some(s => s.toLowerCase().includes(stage.stage_name?.toLowerCase()));

                    return (
                      <div 
                        key={idx}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isCritical 
                            ? 'bg-[#E6A900]/5 border-[#E6A900]/40' 
                            : 'bg-white border-[#E8E6D5] hover:border-[#D1CDBC]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-2xl font-bold flex items-center justify-center text-sm shrink-0 ${
                            isCritical ? 'bg-[#E6A900] text-white shadow-xs' : 'bg-[#0284C7] text-white'
                          }`}>
                            D{stage.day}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#262619]">{stage.stage_name || stage.stage}</h4>
                              {isCritical && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  Critical Stage
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#6B6B47] mt-0.5">Approx. Day {stage.day} post-germination</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E8E6D5]">
                          <div>
                            <span className="text-[10px] text-[#6B6B47] font-bold uppercase block">Water Volume</span>
                            <span className="text-sm font-extrabold text-[#0284C7] font-mono">
                              {formatVol(stage.water_liters || 60000)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#6B6B47] font-bold uppercase block">Application Depth</span>
                            <span className="text-sm font-extrabold text-[#262619] font-mono">
                              {stage.water_mm} mm
                            </span>
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
