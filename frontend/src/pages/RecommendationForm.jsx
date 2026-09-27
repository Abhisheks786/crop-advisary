import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Sprout, 
  Droplets, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  FlaskConical,
  Trees,
  Layers,
  Zap
} from 'lucide-react';
import { generateRecommendation } from '../services/recommendationService';
import { INDIAN_STATES, SOIL_TYPES, SEASONS, WATER_LEVELS, IRRIGATION_METHODS, PREVIOUS_CROPS, RAINFALL_CATEGORIES } from '../utils/constants';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const RecommendationForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Samrala',
    landArea: '5',
    landUnit: 'acres',
    soilType: 'Loamy',
    soilPH: '6.8',
    previousCrop: 'Rice',
    season: 'Rabi',
    waterAvailability: 'Medium',
    irrigationMethod: 'Flood',
    availableFertilizer: 'Adequate',
    availableLabour: 'Sufficient',
    budget: '50000',
    temperature: '20',
    rainfall: 'Medium',
    humidity: 'Medium'
  });

  const steps = [
    { title: 'Location', desc: 'State, district & region', icon: MapPin },
    { title: 'Farm Details', desc: 'Soil, area & season', icon: Sprout },
    { title: 'Resources', desc: 'Water & irrigation type', icon: Droplets },
    { title: 'Environment', desc: 'Climate & temperature', icon: Sun },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const applyPreset = (presetName) => {
    if (presetName === 'punjab-wheat') {
      setFormData({
        state: 'Punjab',
        district: 'Ludhiana',
        village: 'Khanna',
        landArea: '5',
        landUnit: 'acres',
        soilType: 'Loamy',
        soilPH: '6.8',
        previousCrop: 'Rice',
        season: 'Rabi',
        waterAvailability: 'Medium',
        irrigationMethod: 'Flood',
        availableFertilizer: 'Adequate',
        availableLabour: 'Sufficient',
        budget: '60000',
        temperature: '20',
        rainfall: 'Medium',
        humidity: 'Medium'
      });
    } else if (presetName === 'maharashtra-cotton') {
      setFormData({
        state: 'Maharashtra',
        district: 'Nagpur',
        village: 'Katol',
        landArea: '8',
        landUnit: 'acres',
        soilType: 'Black Soil',
        soilPH: '7.4',
        previousCrop: 'Soybean',
        season: 'Kharif',
        waterAvailability: 'Medium',
        irrigationMethod: 'Drip',
        availableFertilizer: 'Adequate',
        availableLabour: 'Moderate',
        budget: '80000',
        temperature: '30',
        rainfall: 'High',
        humidity: 'High'
      });
    } else if (presetName === 'rajasthan-mustard') {
      setFormData({
        state: 'Rajasthan',
        district: 'Jaipur',
        village: 'Chomu',
        landArea: '4',
        landUnit: 'acres',
        soilType: 'Sandy Loam',
        soilPH: '7.2',
        previousCrop: 'Bajra',
        season: 'Rabi',
        waterAvailability: 'Low',
        irrigationMethod: 'Sprinkler',
        availableFertilizer: 'Limited',
        availableLabour: 'Moderate',
        budget: '35000',
        temperature: '22',
        rainfall: 'Low',
        humidity: 'Low'
      });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      if (!formData.state) newErrors.state = 'Please select your state';
      if (!formData.district) newErrors.district = 'Please select or enter district';
    } else if (currentStep === 1) {
      if (!formData.landArea || parseFloat(formData.landArea) <= 0) newErrors.landArea = 'Enter valid positive land area';
      if (!formData.soilType) newErrors.soilType = 'Select soil classification';
      if (!formData.season) newErrors.season = 'Select active cultivation season';
      if (formData.soilPH && (parseFloat(formData.soilPH) < 3 || parseFloat(formData.soilPH) > 11)) {
        newErrors.soilPH = 'Agricultural soil pH is typically between 3.5 and 10.0';
      }
    } else if (currentStep === 2) {
      if (!formData.waterAvailability) newErrors.waterAvailability = 'Specify water availability';
      if (!formData.irrigationMethod) newErrors.irrigationMethod = 'Select primary irrigation technique';
    } else if (currentStep === 3) {
      if (!formData.temperature) newErrors.temperature = 'Temperature is required';
      if (!formData.rainfall) newErrors.rainfall = 'Rainfall category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const payload = {
        state: formData.state,
        district: formData.district,
        village: formData.village,
        landArea: parseFloat(formData.landArea) || 5,
        landUnit: formData.landUnit || 'acres',
        soilType: formData.soilType,
        soilPH: parseFloat(formData.soilPH) || 6.8,
        previousCrop: formData.previousCrop || 'None',
        season: formData.season,
        waterAvailability: formData.waterAvailability,
        irrigationMethod: formData.irrigationMethod,
        temperature: parseFloat(formData.temperature) || 24,
        rainfall: formData.rainfall,
        humidity: formData.humidity,
        budget: parseFloat(formData.budget) || 0
      };

      const response = await generateRecommendation(payload);
      const resultData = response.data;

      // Navigate to Results page with recommendation state
      navigate('/results', { 
        state: { 
          recommendation: resultData,
          input: payload 
        } 
      });
    } catch (err) {
      console.error('Error calculating recommendations:', err);
      // Fallback direct calculation route
      navigate('/results', { 
        state: { 
          input: formData 
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  const currentDistricts = INDIAN_STATES[formData.state] || ['Central District', 'North District', 'South District'];
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in">
      {/* ────────────────────────────────────────────────────────── */}
      {/* HEADER & QUICK PRESETS                                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAF7] text-[#333320] text-xs font-bold border border-[#E8E6D5]/60 mb-2">
              <Sparkles size={14} className="text-[#6B6B47]" />
              <span>Multi-Factor Explainable Scoring Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Precision Crop Advisory Wizard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Enter your farm metrics to receive ranked crop matches, stage-wise irrigation, and input resource plans.
            </p>
          </div>

          {/* 1-Click Demonstration Presets */}
          <div className="flex sm:flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap size={13} className="text-amber-500" /> Quick Presets:
            </span>
            <ButtonGroup>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset('punjab-wheat')}
              >
                🌾 Punjab Wheat
              </Button>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset('maharashtra-cotton')}
              >
                🌱 MH Cotton
              </Button>
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset('rajasthan-mustard')}
              >
                🌼 RJ Mustard
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────── */}
        {/* STEPPER PROGRESS BAR                                       */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#333320] uppercase tracking-wider">
              Step {currentStep + 1} of {steps.length}: <span className="text-slate-900">{steps[currentStep].title}</span>
            </span>
            <span className="text-xs font-bold text-[#4A4A2E] bg-[#FAFAF7] px-2.5 py-0.5 rounded-full border border-[#E8E6D5]">
              {Math.round(progressPercent)}% Completed
            </span>
          </div>

          {/* Continuous Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-gradient-to-r from-[#6B6B47] to-lime-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {steps.map((step, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <Button
                  key={step.title}
                  type="button"
                  variant="ghost"
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  disabled={idx > currentStep}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                    isCurrent 
                      ? 'bg-[#FAFAF7] border-[#9D9678]/80 ring-2 ring-[#E8E6D5] shadow-xs' 
                      : isDone 
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                        : 'bg-slate-50/50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isCurrent 
                      ? 'bg-[#6B6B47] text-white shadow-sm' 
                      : isDone 
                        ? 'bg-[#F5F4EE] text-[#333320]' 
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isDone ? <CheckCircle2 size={16} /> : `0${idx + 1}`}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isCurrent ? 'text-[#1A1A11] font-display' : 'text-slate-700'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate hidden sm:block">{step.desc}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* FORM STEPS CONTENT                                         */}
      {/* ────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        {/* STEP 1: LOCATION */}
        {currentStep === 0 && (
          <div className="space-y-6 fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <MapPin className="text-[#6B6B47]" size={20} />
                <span>Geographic Location</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Helps identify regional agro-climatic zones, soil baselines, and seasonal rainfall distributions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  State <span className="text-[#6B6B47]">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={(e) => {
                    const newState = e.target.value;
                    const districts = INDIAN_STATES[newState] || [];
                    setFormData(prev => ({ 
                      ...prev, 
                      state: newState, 
                      district: districts[0] || '' 
                    }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
                >
                  {Object.keys(INDIAN_STATES).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {errors.state && <p className="text-xs text-red-600 mt-1 font-medium">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  District <span className="text-[#6B6B47]">*</span>
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
                >
                  {currentDistricts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                {errors.district && <p className="text-xs text-red-600 mt-1 font-medium">{errors.district}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Village / Tehsil / Field Identifier <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g., North Block Farm #3"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FARM DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6 fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Sprout className="text-[#6B6B47]" size={20} />
                <span>Soil & Cultivation Parameters</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Core soil physical properties, pH chemistry, land dimensions, and active season.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Land Area with Unit Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🌾 Total Cultivation Land Area <span className="text-[#6B6B47]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    placeholder="5.0"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-bold text-slate-900"
                  />
                  <select
                    name="landUnit"
                    value={formData.landUnit}
                    onChange={handleChange}
                    className="w-32 px-3 py-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white outline-none"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
                {errors.landArea && <p className="text-xs text-red-600 mt-1 font-medium">{errors.landArea}</p>}
              </div>

              {/* Season Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  📅 Target Cultivation Season <span className="text-[#6B6B47]">*</span>
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none text-[#262619]"
                >
                  {SEASONS.map(s => (
                    <option key={s} value={s}>{s} Season</option>
                  ))}
                </select>
                {errors.season && <p className="text-xs text-red-600 mt-1 font-medium">{errors.season}</p>}
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🟤 Primary Soil Type <span className="text-[#6B6B47]">*</span>
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
                >
                  {SOIL_TYPES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {errors.soilType && <p className="text-xs text-red-600 mt-1 font-medium">{errors.soilType}</p>}
              </div>

              {/* Soil pH with helper range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🧪 Soil pH Value
                  </label>
                  <span className="text-[11px] text-slate-500">Ideal range: 6.0 – 7.5</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="11.0"
                  name="soilPH"
                  value={formData.soilPH}
                  onChange={handleChange}
                  placeholder="6.8"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-bold"
                />
                {errors.soilPH && <p className="text-xs text-red-600 mt-1 font-medium">{errors.soilPH}</p>}
              </div>

              {/* Previous Crop for Rotation */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🔄 Previously Harvested Crop <span className="text-slate-400 font-normal">(Used for Nitrogen & Rotation Scoring)</span>
                </label>
                <select
                  name="previousCrop"
                  value={formData.previousCrop}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
                >
                  <option value="None">None / Fallow Land</option>
                  {PREVIOUS_CROPS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RESOURCES */}
        {currentStep === 2 && (
          <div className="space-y-6 fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Droplets className="text-sky-600" size={20} />
                <span>Irrigation & Farm Resources</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Helps calculate water balance surplus/deficit and determine feasible input resource plans.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  💧 Water Availability Level <span className="text-[#6B6B47]">*</span>
                </label>
                <select
                  name="waterAvailability"
                  value={formData.waterAvailability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-sky-900 focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  {WATER_LEVELS.map(w => (
                    <option key={w} value={w}>{w} Water Supply</option>
                  ))}
                </select>
                {errors.waterAvailability && <p className="text-xs text-red-600 mt-1 font-medium">{errors.waterAvailability}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🚿 Irrigation Technique <span className="text-[#6B6B47]">*</span>
                </label>
                <select
                  name="irrigationMethod"
                  value={formData.irrigationMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
                >
                  {IRRIGATION_METHODS.map(m => (
                    <option key={m} value={m}>{m} Irrigation</option>
                  ))}
                </select>
                {errors.irrigationMethod && <p className="text-xs text-red-600 mt-1 font-medium">{errors.irrigationMethod}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🧪 Fertilizer Availability
                </label>
                <select
                  name="availableFertilizer"
                  value={formData.availableFertilizer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  <option value="None">None / Organic Only</option>
                  <option value="Limited">Limited (Basic NPK)</option>
                  <option value="Adequate">Adequate (Standard Supply)</option>
                  <option value="Abundant">Abundant (Full Nutrient Pack)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  👥 Farm Labour Availability
                </label>
                <select
                  name="availableLabour"
                  value={formData.availableLabour}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  <option value="Limited">Limited (Mechanized / Family only)</option>
                  <option value="Moderate">Moderate (Partial hired labor)</option>
                  <option value="Sufficient">Sufficient (Full field crew)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  💰 Optional Input Budget (₹ INR)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ENVIRONMENT */}
        {currentStep === 3 && (
          <div className="space-y-6 fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Sun className="text-amber-500" size={20} />
                <span>Climatic & Environmental Metrics</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Seasonal average temperatures and rainfall categories for thermal suitability modeling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🌡️ Average Ambient Temperature (°C) <span className="text-[#6B6B47]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="22"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-bold text-amber-900"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">°C</span>
                </div>
                {errors.temperature && <p className="text-xs text-red-600 mt-1 font-medium">{errors.temperature}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🌧️ Expected Rainfall Category <span className="text-[#6B6B47]">*</span>
                </label>
                <select
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
                >
                  {RAINFALL_CATEGORIES.map(r => (
                    <option key={r} value={r}>{r} Rainfall</option>
                  ))}
                </select>
                {errors.rainfall && <p className="text-xs text-red-600 mt-1 font-medium">{errors.rainfall}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  🌦 Relative Humidity Band
                </label>
                <select
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  <option value="Low">Low (&lt; 40%)</option>
                  <option value="Medium">Medium (40% - 70%)</option>
                  <option value="High">High (&gt; 70%)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* WIZARD NAVIGATION FOOTER WITH BUTTONGROUP                  */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-[#E6E4D7]">
          <ButtonGroup align="between" spacing="md" responsive>
            {currentStep > 0 ? (
              <Button
                variant="outline"
                size="md"
                onClick={handlePrev}
                icon={ArrowLeft}
              >
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {currentStep < steps.length - 1 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                icon={ArrowRight}
                iconPosition="right"
              >
                Continue Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="accent"
                size="lg"
                loading={loading}
                icon={Sparkles}
                iconPosition="right"
              >
                Generate Farm Advisory Plan
              </Button>
            )}
          </ButtonGroup>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;

