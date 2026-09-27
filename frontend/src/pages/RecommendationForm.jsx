import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Sprout, 
  Droplets, 
  Sun, 
  CheckCircle2, 
  HelpCircle,
  FlaskConical,
  Layers,
  Sparkles,
  ClipboardCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { generateRecommendation } from '../services/recommendationService';
import { INDIAN_STATES, SOIL_TYPES, SEASONS, WATER_LEVELS, IRRIGATION_METHODS, PREVIOUS_CROPS, RAINFALL_CATEGORIES } from '../utils/constants';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import { useLanguage } from '../context/LanguageContext';

const RecommendationForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    { title: '1. Farm Details', desc: 'Location & land area', icon: MapPin },
    { title: '2. Soil Info', desc: 'Type, pH & rotation', icon: Layers },
    { title: '3. Water & Tech', desc: 'Volume & irrigation', icon: Droplets },
    { title: '4. Season & Climate', desc: 'Cycle & temperatures', icon: Sun },
    { title: '5. Review & Submit', desc: 'Verify before generating', icon: ClipboardCheck },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const applyDemoPreset = (presetKey = 'punjab-wheat') => {
    if (presetKey === 'punjab-wheat') {
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
        budget: '50000',
        temperature: '20',
        rainfall: 'Medium',
        humidity: 'Medium'
      });
    } else if (presetKey === 'maharashtra-cotton') {
      setFormData({
        state: 'Maharashtra',
        district: 'Nagpur',
        village: 'Katol',
        landArea: '6',
        landUnit: 'acres',
        soilType: 'Black Soil',
        soilPH: '7.4',
        previousCrop: 'Soybean',
        season: 'Kharif',
        waterAvailability: 'Medium',
        irrigationMethod: 'Drip',
        availableFertilizer: 'Adequate',
        availableLabour: 'Moderate',
        budget: '65000',
        temperature: '28',
        rainfall: 'High',
        humidity: 'High'
      });
    } else if (presetKey === 'up-wheat') {
      setFormData({
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        village: 'Rohaniya',
        landArea: '4',
        landUnit: 'acres',
        soilType: 'Alluvial Soil',
        soilPH: '7.0',
        previousCrop: 'Rice',
        season: 'Rabi',
        waterAvailability: 'High',
        irrigationMethod: 'Flood',
        availableFertilizer: 'Adequate',
        availableLabour: 'Sufficient',
        budget: '45000',
        temperature: '21',
        rainfall: 'Medium',
        humidity: 'Medium'
      });
    } else {
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
        availableLabour: 'Sufficient',
        budget: '35000',
        temperature: '22',
        rainfall: 'Low',
        humidity: 'Low'
      });
    }
    setErrors({});
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 0) {
      if (!formData.state) newErrors.state = 'Please select a state';
      if (!formData.district) newErrors.district = 'Please select a district';
      if (!formData.landArea || Number(formData.landArea) <= 0) {
        newErrors.landArea = 'Enter a valid land area (e.g. 5 acres)';
      }
    } else if (currentStep === 1) {
      if (!formData.soilType) newErrors.soilType = 'Please select your soil type';
      const ph = Number(formData.soilPH);
      if (isNaN(ph) || ph < 3.5 || ph > 10.5) {
        newErrors.soilPH = 'Enter a realistic pH value between 4.0 and 9.5';
      }
    } else if (currentStep === 2) {
      if (!formData.waterAvailability) newErrors.waterAvailability = 'Select water availability level';
      if (!formData.irrigationMethod) newErrors.irrigationMethod = 'Select primary irrigation method';
    } else if (currentStep === 3) {
      if (!formData.season) newErrors.season = 'Select crop season (Kharif, Rabi, or Zaid)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(steps.length - 1, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    try {
      setLoading(true);
      const payload = {
        ...formData,
        landArea: Number(formData.landArea),
        soilPH: Number(formData.soilPH),
        budget: Number(formData.budget) || 0,
        temperature: Number(formData.temperature) || 25,
      };

      const res = await generateRecommendation(payload);
      if (res.data) {
        navigate('/results', { state: { recommendation: res.data } });
      }
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setErrors({ submit: 'Could not connect to advisory engine. Try using demo mode values.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedStateObj = INDIAN_STATES.find(s => s.name === formData.state);
  const districts = selectedStateObj ? selectedStateObj.districts : ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-4 space-y-8 font-sans">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & QUICK DEMO PRESETS                         */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E8E6D5] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#262619] tracking-tight">
              {language === 'hi' ? 'खेत सलाहकार फॉर्म (5 आसान चरण)' : 'Farm Advisory Wizard'}
            </h1>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' 
                ? 'अपने खेत की जानकारी चुनें और वैज्ञानिक फसल व सिंचाई सलाह प्राप्त करें' 
                : 'Select your farm conditions for tailored crop recommendations'}
            </p>
          </div>
        </div>

        {/* 1-Tap Quick Presets for Farmers */}
        <div className="pt-2 border-t border-[#E8E6D5] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#6B6B47]">
            {language === 'hi' ? 'त्वरित उदाहरण:' : 'Quick Presets:'}
          </span>
          <button
            type="button"
            onClick={() => applyDemoPreset('punjab-wheat')}
            className="px-3 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F5F4EE] border border-[#E8E6D5] text-xs font-bold text-[#262619] flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>🌾 पंजाब (गेहूं)</span>
          </button>
          <button
            type="button"
            onClick={() => applyDemoPreset('maharashtra-cotton')}
            className="px-3 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F5F4EE] border border-[#E8E6D5] text-xs font-bold text-[#262619] flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>🌿 महाराष्ट्र (कपास/सोयाबीन)</span>
          </button>
          <button
            type="button"
            onClick={() => applyDemoPreset('up-wheat')}
            className="px-3 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F5F4EE] border border-[#E8E6D5] text-xs font-bold text-[#262619] flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>🌾 यू.पी. (धान-गेहूं)</span>
          </button>
          <button
            type="button"
            onClick={() => applyDemoPreset('rajasthan-mustard')}
            className="px-3 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F5F4EE] border border-[#E8E6D5] text-xs font-bold text-[#262619] flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>☀️ राजस्थान (बाजरा/सरसों)</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. PROGRESS STEPPER (5 VISIBLE STEPS)                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8E6D5] p-3 sm:p-5 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px] gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <React.Fragment key={idx}>
                <div 
                  onClick={() => { if (idx < currentStep) setCurrentStep(idx); }}
                  className={`flex items-center gap-2.5 cursor-pointer select-none ${
                    idx < currentStep ? 'opacity-90 hover:opacity-100' : ''
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isCompleted 
                      ? 'bg-[#5FA83D] text-white shadow-xs' 
                      : isActive 
                      ? 'bg-[#4A4A2E] text-white ring-4 ring-[#4A4A2E]/15 shadow-xs' 
                      : 'bg-[#F5F4EE] text-[#6B6B47] border border-[#E8E6D5]'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={16} />}
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-tight ${isActive ? 'text-[#262619]' : 'text-[#6B6B47]'}`}>
                      {step.title}
                    </p>
                    <p className="text-[10px] text-[#6B6B47] hidden sm:block">{step.desc}</p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 min-w-[20px] rounded-full ${
                    idx < currentStep ? 'bg-[#5FA83D]' : 'bg-[#E8E6D5]'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. STEP CONTENT FORMS                                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#E8E6D5] p-6 sm:p-8 shadow-xs space-y-6">
        {/* STEP 1: FARM DETAILS & LOCATION */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E6D5] pb-4">
              <h2 className="text-xl font-bold text-[#262619] flex items-center gap-2">
                <MapPin size={22} className="text-[#5C7A3C]" />
                Step 1: Farm Location & Land Area
              </h2>
              <p className="text-xs text-[#6B6B47] mt-1">
                Tell us where your farm is located so we can map localized climate and soil baselines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* State */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  State / Province *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                {errors.state && <p className="text-xs text-red-600 font-medium">{errors.state}</p>}
                <p className="text-[11px] text-[#6B6B47]">e.g. Punjab, Maharashtra, Rajasthan</p>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <p className="text-xs text-red-600 font-medium">{errors.district}</p>}
                <p className="text-[11px] text-[#6B6B47]">e.g. Ludhiana, Nashik, Jaipur</p>
              </div>

              {/* Village */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Village or Taluka (Optional)
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Samrala, Katol"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                />
              </div>

              {/* Land Area with Unit Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Land Area *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    name="landArea"
                    value={formData.landArea}
                    onChange={handleChange}
                    className="flex-1 h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-bold focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                  />
                  <select
                    name="landUnit"
                    value={formData.landUnit}
                    onChange={handleChange}
                    className="w-28 h-11 px-3 rounded-xl border border-[#E8E6D5] bg-[#F5F4EE] text-xs font-bold text-[#4A4A2E] focus:outline-none"
                  >
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
                {errors.landArea && <p className="text-xs text-red-600 font-medium">{errors.landArea}</p>}
                <p className="text-[11px] text-[#6B6B47]">Clear unit: {formData.landArea || 5} {formData.landUnit || 'acres'}</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SOIL INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E6D5] pb-4">
              <h2 className="text-xl font-bold text-[#262619] flex items-center gap-2">
                <Layers size={22} className="text-[#5C7A3C]" />
                Step 2: Soil Profile & History
              </h2>
              <p className="text-xs text-[#6B6B47] mt-1">
                Your soil's texture, pH balance, and crop rotation history dictate crop suitability.
              </p>
            </div>

            {/* 1-Tap Visual Soil Cards for Farmers */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                {language === 'hi' ? 'अपनी मिट्टी चुनें (कार्ड पर क्लिक करें):' : 'Select Soil Type (Tap card to choose):'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'Loamy', labelHi: 'दोमट मिट्टी', emoji: '🟤', desc: 'गेहूं व सब्जियां (उपजाऊ)', ph: '6.8' },
                  { name: 'Black Soil', labelHi: 'काली मिट्टी', emoji: '⚫', desc: 'कपास व सोयाबीन', ph: '7.4' },
                  { name: 'Sandy Loam', labelHi: 'बलुई / रेतीली', emoji: '🟡', desc: 'बाजरा व सरसों', ph: '7.2' },
                  { name: 'Alluvial Soil', labelHi: 'जलोढ़ मिट्टी', emoji: '🌾', desc: 'नहर क्षेत्र, धान-गेहूं', ph: '7.0' },
                  { name: 'Red Soil', labelHi: 'लाल मिट्टी', emoji: '🔴', desc: 'दलहन व तिलहन', ph: '6.5' },
                  { name: 'Clay Soil', labelHi: 'चिकनी मिट्टी', emoji: '🧱', desc: 'धान व जलभराव', ph: '6.9' },
                ].map((s) => {
                  const isSelected = formData.soilType === s.name;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, soilType: s.name, soilPH: s.ph }));
                        if (errors.soilType) setErrors(prev => ({ ...prev, soilType: '' }));
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'border-[#5FA83D] bg-[#5FA83D]/10 ring-2 ring-[#5FA83D]/30 shadow-xs' 
                          : 'border-[#E8E6D5] bg-[#FAFAF7] hover:bg-[#F5F4EE]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{s.emoji}</div>
                      <p className="text-xs font-extrabold text-[#262619]">
                        {language === 'hi' ? s.labelHi : s.name}
                      </p>
                      <p className="text-[10px] text-[#6B6B47] mt-0.5 leading-tight">{s.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Soil Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Soil Type Dropdown *
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  {SOIL_TYPES.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
                {errors.soilType && <p className="text-xs text-red-600 font-medium">{errors.soilType}</p>}
              </div>

              {/* Soil pH */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                    Soil pH Level *
                  </label>
                  <span className="text-xs font-mono font-bold text-[#5C7A3C] bg-[#5FA83D]/10 px-2 py-0.5 rounded">
                    pH {formData.soilPH}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="9.5"
                  name="soilPH"
                  value={formData.soilPH}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-bold focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                />
                {errors.soilPH && <p className="text-xs text-red-600 font-medium">{errors.soilPH}</p>}
                <p className="text-[11px] text-[#6B6B47]">
                  Range: 6.0 to 7.5 is neutral to ideal for most Indian crops.
                </p>
              </div>

              {/* Previous Crop */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Previously Harvested Crop
                </label>
                <select
                  name="previousCrop"
                  value={formData.previousCrop}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  <option value="None">None / Fallow Land</option>
                  {PREVIOUS_CROPS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6B6B47]">
                  Enables crop rotation algorithm to recommend nitrogen-replenishing companion crops.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: WATER & IRRIGATION */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E6D5] pb-4">
              <h2 className="text-xl font-bold text-[#262619] flex items-center gap-2">
                <Droplets size={22} className="text-[#0284C7]" />
                Step 3: Water Availability & Irrigation Method
              </h2>
              <p className="text-xs text-[#6B6B47] mt-1">
                Ensures we do not recommend water-hungry crops if your water availability is limited.
              </p>
            </div>

            {/* 1-Tap Visual Water Cards for Farmers */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                {language === 'hi' ? 'पानी की उपलब्धता (कार्ड पर क्लिक करें):' : 'Water Availability (Tap card to choose):'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { level: 'High', labelHi: 'प्रचुर पानी (नहर / बोरवेल)', emoji: '🌊', desc: 'धान व गन्ने जैसी फसलों के लिए पर्याप्त' },
                  { level: 'Medium', labelHi: 'मध्यम पानी (ट्यूबवेल)', emoji: '💧', desc: 'गेहूं व सरसों के लिए 4-5 सिंचाई' },
                  { level: 'Low', labelHi: 'कम पानी (वर्षा / सूखा)', emoji: '🌧️', desc: 'चना, बाजरा व सरसों (कम पानी वाली फसलें)' },
                ].map((w) => {
                  const isSelected = formData.waterAvailability === w.level;
                  return (
                    <button
                      key={w.level}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, waterAvailability: w.level }));
                        if (errors.waterAvailability) setErrors(prev => ({ ...prev, waterAvailability: '' }));
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected 
                          ? 'border-[#0284C7] bg-[#0284C7]/10 ring-2 ring-[#0284C7]/30 shadow-xs' 
                          : 'border-[#E8E6D5] bg-[#FAFAF7] hover:bg-[#F5F4EE]'
                      }`}
                    >
                      <div className="text-2xl mb-1">{w.emoji}</div>
                      <p className="text-xs font-extrabold text-[#262619]">
                        {language === 'hi' ? w.labelHi : `${w.level} Water`}
                      </p>
                      <p className="text-[10px] text-[#6B6B47] mt-0.5 leading-tight">{w.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Water Availability */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Water Availability Dropdown *
                </label>
                <select
                  name="waterAvailability"
                  value={formData.waterAvailability}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  {WATER_LEVELS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                {errors.waterAvailability && <p className="text-xs text-red-600 font-medium">{errors.waterAvailability}</p>}
              </div>

              {/* Irrigation Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Primary Irrigation Method *
                </label>
                <select
                  name="irrigationMethod"
                  value={formData.irrigationMethod}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  {IRRIGATION_METHODS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {errors.irrigationMethod && <p className="text-xs text-red-600 font-medium">{errors.irrigationMethod}</p>}
                <p className="text-[11px] text-[#6B6B47]">
                  {formData.irrigationMethod === 'Drip' && 'Efficiency: 90%. Maximizes water savings.'}
                  {formData.irrigationMethod === 'Flood' && 'Efficiency: 45%. Traditional furrow/canal flooding.'}
                  {formData.irrigationMethod === 'Sprinkler' && 'Efficiency: 75%. Even water distribution.'}
                </p>
              </div>

              {/* Fertilizer & Labour Availability */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Fertilizer Access
                </label>
                <select
                  name="availableFertilizer"
                  value={formData.availableFertilizer}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:outline-none"
                >
                  <option value="Limited">Limited (Basic Urea only)</option>
                  <option value="Adequate">Adequate (NPK, Urea, DAP accessible)</option>
                  <option value="Abundant">Abundant (Full micronutrients & organic compost)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Field Labour Availability
                </label>
                <select
                  name="availableLabour"
                  value={formData.availableLabour}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:outline-none"
                >
                  <option value="Limited">Limited (Owner operator / family only)</option>
                  <option value="Moderate">Moderate (Seasonal casual workers)</option>
                  <option value="Sufficient">Sufficient (Full field crew available)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SEASON & CLIMATE */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E6D5] pb-4">
              <h2 className="text-xl font-bold text-[#262619] flex items-center gap-2">
                <Sun size={22} className="text-[#E6A900]" />
                Step 4: Target Season & Climate
              </h2>
              <p className="text-xs text-[#6B6B47] mt-1">
                Aligns crop biological calendars with your local agricultural calendar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Season */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Target Season *
                </label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                >
                  {SEASONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.season && <p className="text-xs text-red-600 font-medium">{errors.season}</p>}
                <p className="text-[11px] text-[#6B6B47]">
                  {formData.season === 'Rabi' && 'Rabi: Winter season (Nov-Mar), cool nights.'}
                  {formData.season === 'Kharif' && 'Kharif: Monsoon season (Jun-Oct), warm rain.'}
                  {formData.season === 'Zaid' && 'Zaid: Summer window (Apr-Jun), dry heat.'}
                </p>
              </div>

              {/* Temperature */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Avg. Ambient Temp (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-bold focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                />
                <p className="text-[11px] text-[#6B6B47]">e.g. 20 °C for north India winter</p>
              </div>

              {/* Rainfall Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A2E] block">
                  Expected Rainfall
                </label>
                <select
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E6D5] bg-[#FAFAF7] text-sm text-[#262619] font-medium focus:outline-none"
                >
                  {RAINFALL_CATEGORIES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <p className="text-[11px] text-[#6B6B47]">Low (&lt;400mm), Med (400-800mm), High (&gt;800mm)</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & GENERATE */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-[#E8E6D5] pb-4">
              <h2 className="text-xl font-bold text-[#262619] flex items-center gap-2">
                <ClipboardCheck size={22} className="text-[#5FA83D]" />
                Step 5: Review Farm Inputs
              </h2>
              <p className="text-xs text-[#6B6B47] mt-1">
                Verify all parameters before our 7-factor engine computes your tailored crop recommendations.
              </p>
            </div>

            {errors.submit && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errors.submit}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C7A3C] block">
                  Location & Scale
                </span>
                <p className="text-sm font-bold text-[#262619]">{formData.district}, {formData.state}</p>
                <p className="text-xs text-[#6B6B47]">Area: {formData.landArea} {formData.landUnit}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C7A3C] block">
                  Soil Chemistry
                </span>
                <p className="text-sm font-bold text-[#262619]">{formData.soilType} Soil</p>
                <p className="text-xs text-[#6B6B47]">pH {formData.soilPH} • Prev: {formData.previousCrop}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] block">
                  Water & Method
                </span>
                <p className="text-sm font-bold text-[#262619]">{formData.waterAvailability} Availability</p>
                <p className="text-xs text-[#6B6B47]">Method: {formData.irrigationMethod} Irrigation</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E6A900] block">
                  Cycle & Temperature
                </span>
                <p className="text-sm font-bold text-[#262619]">{formData.season} Season</p>
                <p className="text-xs text-[#6B6B47]">{formData.temperature} °C • {formData.rainfall} Rainfall</p>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* 4. NAVIGATION BUTTONS (STICKY BOTTOM)                      */}
        {/* ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E8E6D5]">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={handlePrev}
            >
              {t('previous')}
            </Button>
          ) : <div />}

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleNext}
            >
              {t('next')}
            </Button>
          ) : (
            <Button
              variant="accent"
              size="lg"
              icon={Sparkles}
              type="submit"
              loading={loading}
            >
              {loading ? t('loadingAdvisory') : t('generateNow')}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;
