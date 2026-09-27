import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  Wheat, 
  BarChart3, 
  SlidersHorizontal, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Database,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminStatistics, getScoringWeights, updateScoringWeights } from '../services/adminService';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [weights, setWeights] = useState({
    soil: 0.25,
    season: 0.20,
    water: 0.20,
    ph: 0.10,
    rotation: 0.10,
    temperature: 0.10,
    rainfall: 0.05
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStatistics().catch(() => ({ data: {} })),
      getScoringWeights().catch(() => ({ data: weights }))
    ])
      .then(([statsRes, weightsRes]) => {
        setStats(statsRes.data || {});
        if (weightsRes.data && typeof weightsRes.data === 'object') {
          setWeights(prev => ({ ...prev, ...weightsRes.data }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleWeightChange = (key, val) => {
    const floatVal = parseFloat(val) / 100;
    setWeights(prev => ({ ...prev, [key]: floatVal }));
  };

  const totalSum = Object.values(weights).reduce((a, b) => a + b, 0);
  const isValidSum = Math.abs(totalSum - 1.0) < 0.015;

  const handleSaveWeights = async () => {
    try {
      await updateScoringWeights(weights);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update weights:', err);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-sm">
            🛡️
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-1">
              <span>Agricultural Administration & Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              AgriTech Admin Command Console
            </h1>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
          <span className="text-2xl">🌾</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Active Crops</p>
          <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">{stats?.totalCrops || 14}</p>
          <span className="text-[11px] text-[#4A4A2E] font-semibold">In Offline Catalog</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
          <span className="text-2xl">🌱</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Total Advisories</p>
          <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">{stats?.totalRecommendations || 28}</p>
          <span className="text-[11px] text-[#4A4A2E] font-semibold">Generated Plans</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
          <span className="text-2xl">👥</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Registered Users</p>
          <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">{stats?.totalUsers || 2}</p>
          <span className="text-[11px] text-slate-500 font-semibold">Farmers & Officers</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
          <span className="text-2xl">📍</span>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Coverage</p>
          <p className="text-2xl font-extrabold text-slate-900 font-display mt-0.5">{stats?.totalRegions || 15}</p>
          <span className="text-[11px] text-purple-700 font-semibold">Indian Agro-Zones</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Management Tools (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
            <h3 className="text-base font-bold text-slate-900 font-display mb-2">Management Links</h3>

            <Link
              to="/admin/crops"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAFAF7] hover:bg-[#F5F4EE]/80 border border-[#E8E6D5]/70 text-[#1A1A11] font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Wheat size={18} className="text-[#4A4A2E]" />
                <span>Crop Dataset Catalog (CRUD)</span>
              </div>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/admin/statistics"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/70 text-sky-950 font-bold text-xs transition-all"
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 size={18} className="text-sky-700" />
                <span>Regional Analytics & Distributions</span>
              </div>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Algorithm Weight Tuner (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#4A4A2E]" />
                <span>Recommendation Algorithm Weight Tuning</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calibrate the multi-factor scoring weightings. Total sum must equal 100%.
              </p>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-black ${
              isValidSum ? 'bg-[#F5F4EE] text-[#333320]' : 'bg-red-100 text-red-800'
            }`}>
              Total: {Math.round(totalSum * 100)}% {isValidSum ? '✓' : '(Invalid)'}
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3.5 bg-[#FAFAF7] text-[#333320] border border-[#E8E6D5] rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#6B6B47]" />
              <span>Algorithm weights saved & cache invalidated successfully.</span>
            </div>
          )}

          <div className="space-y-4">
            {[
              { key: 'soil', label: 'Soil Type Compatibility', desc: 'Exact physical and mechanical texture alignment' },
              { key: 'season', label: 'Seasonal Sowing Fit', desc: 'Alignment with Kharif, Rabi, or Zaid cycles' },
              { key: 'water', label: 'Water Availability Match', desc: 'Water volume requirement fulfillment' },
              { key: 'ph', label: 'Soil pH Chemistry', desc: 'Optimum absorption range alignment' },
              { key: 'rotation', label: 'Crop Rotation & Nitrogen', desc: 'Benefit of nitrogen-fixing predecessors' },
              { key: 'temperature', label: 'Temperature Adaptability', desc: 'Thermal deviation tolerance' },
              { key: 'rainfall', label: 'Rainfall Category', desc: 'Regional precipitation alignment' }
            ].map(factor => (
              <div key={factor.key} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-bold text-slate-900">{factor.label}</span>
                  <span className="font-black text-[#4A4A2E]">{Math.round((weights[factor.key] || 0) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={Math.round((weights[factor.key] || 0) * 100)}
                  onChange={e => handleWeightChange(factor.key, e.target.value)}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4A4A2E]"
                />
                <p className="text-[10px] text-slate-400 mt-1">{factor.desc}</p>
              </div>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={handleSaveWeights}
            disabled={!isValidSum}
            className="w-full py-3 px-6 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-50"
          >
            Save Calibrated Algorithm Weights
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
