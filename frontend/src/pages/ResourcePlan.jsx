import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Package, 
  Droplets, 
  Users, 
  FlaskConical, 
  IndianRupee, 
  TrendingUp, 
  Printer, 
  Sprout, 
  Sparkles,
  PieChart as PieIcon,
  Layers,
  ArrowRight
} from 'lucide-react';
import { getCropVisuals } from '../utils/cropMedia';
import { PREVIOUS_CROPS } from '../utils/constants';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const ResourcePlan = () => {
  const location = useLocation();
  const stateData = location.state || {};

  const [formData, setFormData] = useState({
    crop_name: stateData.cropName || 'Wheat',
    landArea: stateData.landArea || '5',
    landUnit: stateData.landUnit || 'acres'
  });

  const [plan, setPlan] = useState(null);

  const calculatePlan = (cropName, areaVal, unit) => {
    const area = parseFloat(areaVal) || 5;
    const hectares = unit === 'hectares' ? area : area / 2.47105;

    // Standard baseline values per hectare for Indian agriculture
    const seedKg = Math.round(100 * hectares);
    const waterLiters = Math.round(450 * 10000 * hectares);
    const fertKg = Math.round(120 * hectares);
    const laborDays = Math.round(45 * hectares);
    const expYield = Math.round(35 * hectares * 10) / 10;

    const seedCost = seedKg * 40;
    const fertCost = fertKg * 25;
    const laborCost = laborDays * 400;
    const waterCost = Math.round(hectares * 5000);
    const miscCost = Math.round(hectares * 3000);
    const totalCost = seedCost + fertCost + laborCost + waterCost + miscCost;

    setPlan({
      crop_name: cropName,
      land_area: { value: area, unit: unit },
      land_area_hectares: Math.round(hectares * 100) / 100,
      resources: {
        seeds: { quantity: seedKg, unit: 'kg', cost: seedCost, desc: 'High-germination certified seed requirement' },
        water: { quantity: waterLiters, unit: 'Liters', cost: waterCost, desc: 'Total water across 5 irrigation stages' },
        fertilizer: { quantity: fertKg, unit: 'kg', cost: fertCost, desc: 'Balanced NPK (Urea, DAP, MOP) nutrient mix' },
        labour: { quantity: laborDays, unit: 'worker-days', cost: laborCost, desc: 'Sowing, weeding, field care & harvesting' },
        expected_yield: { quantity: expYield, unit: 'Quintals', desc: 'Projected output based on optimal practices' },
        total_cost: { amount: totalCost, currency: 'INR' }
      },
      cost_breakdown: [
        { label: 'Seeds', amount: seedCost, percent: Math.round((seedCost / totalCost) * 100), color: '#15803D' },
        { label: 'Fertilizers & Nutrients', amount: fertCost, percent: Math.round((fertCost / totalCost) * 100), color: '#0D9488' },
        { label: 'Field Labour', amount: laborCost, percent: Math.round((laborCost / totalCost) * 100), color: '#F59E0B' },
        { label: 'Irrigation Energy', amount: waterCost, percent: Math.round((waterCost / totalCost) * 100), color: '#0284C7' },
        { label: 'Machinery & Misc', amount: miscCost, percent: Math.round((miscCost / totalCost) * 100), color: '#64748B' },
      ]
    });
  };

  useEffect(() => {
    calculatePlan(formData.crop_name, formData.landArea, formData.landUnit);
  }, [formData.crop_name, formData.landArea, formData.landUnit]);

  const cropVisual = getCropVisuals(formData.crop_name);

  return (
    <div className="space-y-8 fade-in">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-sm">
              📦
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-1">
                <span>Input Budgeting, Seeds & Labor Estimation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                Farm Resource & Input Budget Planner
              </h1>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors print:hidden"
          >
            <Printer size={16} />
            <span>Print Estimation Plan</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <h3 className="text-base font-bold text-slate-900 font-display mb-4">
              Configure Crop Parameters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Crop
                </label>
                <select
                  value={formData.crop_name}
                  onChange={e => setFormData({ ...formData, crop_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#262619] focus:bg-white outline-none"
                >
                  {PREVIOUS_CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
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
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:bg-white outline-none"
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
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-[#FAFAF7] border border-[#E8E6D5] text-xs space-y-2 text-[#1A1A11]">
            <div className="flex items-center gap-2 font-bold text-[#262619]">
              <Sparkles size={16} className="text-[#6B6B47]" />
              <span>Bulk Purchasing Advice</span>
            </div>
            <p className="leading-relaxed">
              Purchasing certified seeds and bio-fertilizers in agricultural cooperative bulk pools typically saves 12–15% on input procurement.
            </p>
          </div>
        </div>

        {/* Resource Cards & Cost Breakdown (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {plan && (
            <>
              {/* Six KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Seeds */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
                  <span className="text-2xl">🌾</span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Seeds Required</p>
                  <p className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                    {plan.resources.seeds.quantity} {plan.resources.seeds.unit}
                  </p>
                  <span className="text-[11px] text-[#4A4A2E] font-bold">₹{plan.resources.seeds.cost.toLocaleString()}</span>
                </div>

                {/* Water */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
                  <span className="text-2xl">💧</span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Water Needed</p>
                  <p className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                    {(plan.resources.water.quantity / 1000).toLocaleString()} <span className="text-xs">kL</span>
                  </p>
                  <span className="text-[11px] text-sky-700 font-bold">₹{plan.resources.water.cost.toLocaleString()}</span>
                </div>

                {/* Fertilizer */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
                  <span className="text-2xl">🧪</span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Fertilizer (NPK)</p>
                  <p className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                    {plan.resources.fertilizer.quantity} {plan.resources.fertilizer.unit}
                  </p>
                  <span className="text-[11px] text-teal-700 font-bold">₹{plan.resources.fertilizer.cost.toLocaleString()}</span>
                </div>

                {/* Labour */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
                  <span className="text-2xl">👥</span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Field Labour</p>
                  <p className="text-xl font-extrabold text-slate-900 font-display mt-0.5">
                    {plan.resources.labour.quantity} <span className="text-xs">days</span>
                  </p>
                  <span className="text-[11px] text-amber-700 font-bold">₹{plan.resources.labour.cost.toLocaleString()}</span>
                </div>

                {/* Expected Yield */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover-lift">
                  <span className="text-2xl">📈</span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Expected Yield</p>
                  <p className="text-xl font-extrabold text-[#333320] font-display mt-0.5">
                    {plan.resources.expected_yield.quantity} <span className="text-xs">Quintals</span>
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">Optimal Conditions</span>
                </div>

                {/* Total Cost */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-[#333320] to-[#12372A] text-white shadow-sm hover-lift">
                  <span className="text-2xl">💰</span>
                  <p className="text-xs font-bold text-[#D4CEBA] uppercase tracking-wider mt-2">Total Estimated Cost</p>
                  <p className="text-2xl font-black font-display mt-0.5">
                    ₹{plan.resources.total_cost.amount.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-[#E8E6D5]/80">Entire crop cycle</span>
                </div>
              </div>

              {/* Cost Breakdown Progress Bar */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-5">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Input Cost Distribution Breakdown
                </h3>

                {/* Stacked Bar */}
                <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
                  {plan.cost_breakdown.map((item, i) => (
                    <div
                      key={i}
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      title={`${item.label}: ₹${item.amount.toLocaleString()} (${item.percent}%)`}
                      className="h-full transition-all"
                    />
                  ))}
                </div>

                {/* Legend List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {plan.cost_breakdown.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-800">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">₹{item.amount.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({item.percent}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcePlan;
