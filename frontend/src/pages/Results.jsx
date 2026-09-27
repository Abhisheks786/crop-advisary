import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Droplets, 
  RefreshCw, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Calendar, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { getRecommendationById } from '../services/recommendationService';
import { getCropVisuals } from '../utils/cropMedia';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [recommendation, setRecommendation] = useState(null);
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [comparedCropNames, setComparedCropNames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Check if passed via route state
    if (location.state?.recommendation) {
      setRecommendation(location.state.recommendation);
      if (location.state.recommendation.recommendedCrops?.length > 0) {
        setComparedCropNames(location.state.recommendation.recommendedCrops.slice(0, 3).map(c => c.crop_name));
      }
      return;
    }

    // 2. Fetch by ID if parameter provided
    if (id) {
      setLoading(true);
      getRecommendationById(id)
        .then(res => {
          setRecommendation(res.data);
          if (res.data.recommendedCrops?.length > 0) {
            setComparedCropNames(res.data.recommendedCrops.slice(0, 3).map(c => c.crop_name));
          }
        })
        .catch(err => console.error('Error fetching recommendation:', err))
        .finally(() => setLoading(false));
      return;
    }

    // 3. Fallback default recommendation state for immediate visual exploration
    const defaultData = {
      _id: 'rec-demo-default',
      input: {
        state: 'Punjab',
        district: 'Ludhiana',
        landArea: 5,
        landUnit: 'acres',
        soilType: 'Loamy',
        soilPH: 6.8,
        previousCrop: 'Rice',
        season: 'Rabi',
        waterAvailability: 'Medium',
        irrigationMethod: 'Flood',
        temperature: 20,
        rainfall: 'Medium'
      },
      recommendedCrops: [
        {
          crop_name: 'Wheat',
          category: 'Cereal',
          suitability_score: 96,
          suitability_label: 'Highly Suitable',
          risk_level: 'Low',
          water_requirement: 'Medium',
          crop_duration: 120,
          expected_yield: 45,
          irrigation_frequency: 'Every 15-20 days',
          description: 'Major staple golden Rabi cereal crop with optimal yield in loamy soils.',
          reasoning: [
            { factor: 'Soil Type', score: 100, weight: 0.25, status: 'positive', message: 'Loamy soil provides optimal root aeration and moisture balance for Wheat.' },
            { factor: 'Season Match', score: 100, weight: 0.20, status: 'positive', message: 'Rabi winter season with cool germination temps is ideal for Wheat.' },
            { factor: 'Water Availability', score: 100, weight: 0.20, status: 'positive', message: 'Medium water supply fully covers the 450mm requirement across 5 stages.' },
            { factor: 'Soil pH Chemistry', score: 100, weight: 0.10, status: 'positive', message: 'Soil pH 6.8 is within the peak absorption window (6.0 - 7.5).' },
            { factor: 'Crop Rotation', score: 100, weight: 0.10, status: 'positive', message: 'Excellent rotation: Rice → Wheat utilizes residual moisture effectively.' },
            { factor: 'Temperature Adaptability', score: 100, weight: 0.10, status: 'positive', message: 'Ambient 20°C fits Wheat vegetative development (10°C - 25°C).' },
            { factor: 'Rainfall Category', score: 80, weight: 0.05, status: 'positive', message: 'Medium rainfall complements scheduled irrigation cycles.' },
          ],
          warnings: []
        },
        {
          crop_name: 'Mustard',
          category: 'Oilseed',
          suitability_score: 84,
          suitability_label: 'Suitable',
          risk_level: 'Low',
          water_requirement: 'Low',
          crop_duration: 110,
          expected_yield: 22,
          irrigation_frequency: 'Every 25-30 days',
          description: 'Low-water golden oilseed crop with strong market value.',
          reasoning: [
            { factor: 'Soil Type', score: 100, weight: 0.25, status: 'positive', message: 'Loamy soil allows deep root expansion for Mustard.' },
            { factor: 'Season Match', score: 100, weight: 0.20, status: 'positive', message: 'Rabi season aligns with mustard flowering.' },
            { factor: 'Water Availability', score: 100, weight: 0.20, status: 'positive', message: 'Low water requirement; very water efficient choice.' },
            { factor: 'Soil pH Chemistry', score: 100, weight: 0.10, status: 'positive', message: 'pH 6.8 is ideal.' },
            { factor: 'Crop Rotation', score: 80, weight: 0.10, status: 'positive', message: 'Acceptable rotation after rice.' },
            { factor: 'Temperature Adaptability', score: 85, weight: 0.10, status: 'positive', message: 'Optimal cool weather compatibility.' },
            { factor: 'Rainfall Category', score: 70, weight: 0.05, status: 'positive', message: 'Dry spell resistance is high.' }
          ],
          warnings: []
        },
        {
          crop_name: 'Chickpea',
          category: 'Pulse',
          suitability_score: 79,
          suitability_label: 'Suitable',
          risk_level: 'Low',
          water_requirement: 'Low',
          crop_duration: 100,
          expected_yield: 20,
          irrigation_frequency: 'Every 30 days',
          description: 'Nitrogen-fixing legume that enhances soil organic nitrogen.',
          reasoning: [
            { factor: 'Soil Type', score: 85, weight: 0.25, status: 'positive', message: 'Loamy soil supports nodule formation.' },
            { factor: 'Season Match', score: 100, weight: 0.20, status: 'positive', message: 'Standard Rabi pulse crop.' },
            { factor: 'Water Availability', score: 100, weight: 0.20, status: 'positive', message: 'Low water demand.' },
            { factor: 'Soil pH Chemistry', score: 95, weight: 0.10, status: 'positive', message: 'Tolerant to neutral-alkaline pH.' },
            { factor: 'Crop Rotation', score: 100, weight: 0.10, status: 'positive', message: 'Restores nitrogen after cereal crops.' },
            { factor: 'Temperature Adaptability', score: 80, weight: 0.10, status: 'positive', message: 'Moderately cool climate suitable.' },
            { factor: 'Rainfall Category', score: 70, weight: 0.05, status: 'positive', message: 'Avoid waterlogging.' }
          ],
          warnings: []
        }
      ]
    };

    setRecommendation(defaultData);
    setComparedCropNames(['Wheat', 'Mustard', 'Chickpea']);
  }, [location.state, id]);

  const toggleCompare = (cropName) => {
    setComparedCropNames(prev => {
      if (prev.includes(cropName)) {
        return prev.filter(n => n !== cropName);
      } else {
        if (prev.length >= 3) {
          return [...prev.slice(1), cropName];
        }
        return [...prev, cropName];
      }
    });
  };

  if (loading || !recommendation) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#6B6B47] border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-[#333320] font-display">Analyzing Multi-Factor Crop Suitability...</p>
        </div>
      </div>
    );
  }

  const crops = recommendation.recommendedCrops || [];
  const activeCrop = crops[selectedCropIndex] || crops[0] || {};
  const activeVisual = getCropVisuals(activeCrop.crop_name);
  const input = recommendation.input || {};

  return (
    <div className="space-y-8 fade-in">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP BAR WITH BREADCRUMB & SUMMARY PILLS                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/recommend')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#4A4A2E] transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Modify Field Inputs</span>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Field Advisory Results
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F5F4EE] text-[#333320] border border-[#E8E6D5]">
              {crops.length} Suitable Matches
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Precision suitability computed for {input.state || 'Punjab'} • {input.landArea || 5} {input.landUnit || 'acres'} • {input.soilType || 'Loamy'} Soil • {input.season || 'Rabi'}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/irrigation', { state: { cropName: activeCrop.crop_name, landArea: input.landArea, landUnit: input.landUnit } })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 transition-colors"
            >
              <Droplets size={15} />
              <span>Water Schedule</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/rotation', { state: { currentCrop: activeCrop.crop_name, previousCrop: input.previousCrop } })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs border border-purple-200 transition-colors"
            >
              <RefreshCw size={15} />
              <span>Rotation Sequence</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/resources', { state: { cropName: activeCrop.crop_name, landArea: input.landArea, landUnit: input.landUnit } })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors"
            >
              <Package size={15} />
              <span>Resource Plan</span>
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. FLAGSHIP HERO MATCH CARD                                */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200/90 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Real Crop Photo & Match Badge (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[420px]">
            <img 
              src={activeVisual.image} 
              alt={activeVisual.name}
              className="absolute inset-0 w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12372A]/90 via-[#12372A]/40 to-transparent"></div>

            {/* Floating Top Rank Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-lime-400 text-[#1A1A11] shadow-md">
                <Sparkles size={14} />
                <span>{selectedCropIndex === 0 ? '🏆 TOP RECOMMENDED MATCH' : `RANK #${selectedCropIndex + 1} MATCH`}</span>
              </span>
            </div>

            {/* Bottom Crop Name & Tagline */}
            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
              <span className="text-xs font-bold text-lime-300 uppercase tracking-wider">{activeVisual.category}</span>
              <h2 className="text-3xl font-black font-display tracking-tight flex items-center gap-2">
                <span>{activeVisual.emoji}</span>
                <span>{activeCrop.crop_name}</span>
                {activeVisual.hindiName && (
                  <span className="text-base font-normal text-[#E8E6D5]/80">({activeVisual.hindiName})</span>
                )}
              </h2>
              <p className="text-xs text-[#F5F4EE]/90 mt-1">{activeVisual.tagline}</p>
            </div>
          </div>

          {/* Right Column: Compatibility Analytics & Highlights (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Compatibility Score Centerpiece */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Match Index</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-4xl sm:text-5xl font-black text-[#4A4A2E] font-display">
                      {activeCrop.suitability_score}%
                    </span>
                    <span className="text-xs font-bold text-[#333320] bg-[#F5F4EE] px-3 py-1 rounded-full">
                      {activeCrop.suitability_label || 'Highly Suitable'}
                    </span>
                  </div>
                </div>

                {/* Animated progress ring preview */}
                <div className="w-16 h-16 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5] flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-[#4A4A2E] uppercase">Risk Level</span>
                  <span className="text-xs font-black text-[#1A1A11] capitalize">{activeCrop.risk_level || 'Low'}</span>
                </div>
              </div>

              {/* Key Highlights / Checks */}
              <div className="mt-5 space-y-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">Key Compatibility Factors:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7FAF5] border border-[#F5F4EE] text-xs font-medium text-[#262619]">
                    <CheckCircle2 size={16} className="text-[#6B6B47] shrink-0" />
                    <span>Suitable with {input.soilType || 'Loamy'} Soil</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7FAF5] border border-[#F5F4EE] text-xs font-medium text-[#262619]">
                    <CheckCircle2 size={16} className="text-[#6B6B47] shrink-0" />
                    <span>Ideal for {input.season || 'Rabi'} Growing Cycle</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7FAF5] border border-[#F5F4EE] text-xs font-medium text-[#262619]">
                    <CheckCircle2 size={16} className="text-[#6B6B47] shrink-0" />
                    <span>{activeCrop.water_requirement || 'Medium'} Water Requirement</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F7FAF5] border border-[#F5F4EE] text-xs font-medium text-[#262619]">
                    <CheckCircle2 size={16} className="text-[#6B6B47] shrink-0" />
                    <span>Compatible with {input.previousCrop || 'Previous Crop'}</span>
                  </div>
                </div>
              </div>

              {/* Vital Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Expected Yield</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">{activeCrop.expected_yield || 45} q/ha</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Crop Duration</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5">{activeCrop.crop_duration || 120} Days</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Water Frequency</span>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">{activeCrop.irrigation_frequency || '15-20 days'}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <ButtonGroup>
                <Button
                  variant="primary"
                  onClick={() => navigate('/irrigation', { state: { cropName: activeCrop.crop_name, landArea: input.landArea, landUnit: input.landUnit } })}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#4A4A2E] hover:bg-[#333320] text-white font-bold text-xs sm:text-sm text-center transition-all shadow-sm shadow-[#1A1A11]/20 flex items-center justify-center gap-2"
                >
                  <span>View Full Stage Irrigation Plan</span>
                  <ChevronRight size={16} />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/resources', { state: { cropName: activeCrop.crop_name, landArea: input.landArea, landUnit: input.landUnit } })}
                  className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-700 transition-colors"
                >
                  View Input Budget
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. 🤖 AI EXPLANATION SECTION ("Why We Recommend Crop")    */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F4EE] text-[#333320] flex items-center justify-center font-bold text-xl">
              🤖
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Explainable AI Scoring Breakdown for {activeCrop.crop_name}
              </h3>
              <p className="text-xs text-slate-500">Transparent factor weightings and reasoning justifications</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#333320] bg-[#FAFAF7] px-3 py-1 rounded-full border border-[#E8E6D5]">
            <ShieldCheck size={16} />
            <span>Deterministic Scoring</span>
          </div>
        </div>

        {/* AI Insight Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAFAF7] via-[#FAFAF7]/70 to-lime-50 border border-[#E8E6D5]/80 text-xs sm:text-sm leading-relaxed text-[#1A1A11] flex items-start gap-3.5">
          <span className="text-xl shrink-0">✨</span>
          <div>
            <strong className="font-bold text-[#262619]">AI Agri-Insight: </strong>
            {activeCrop.crop_name} is ranked with a high suitability score of {activeCrop.suitability_score}% because your land's {input.soilType || 'Loamy'} soil structure provides optimal drainage and nutrient retention. The active {input.season || 'Rabi'} weather patterns align directly with vegetative and tillering stages.
          </div>
        </div>

        {/* Reasoning Factor Progress Bars & Messages */}
        <div className="space-y-3.5">
          {(activeCrop.reasoning || []).map((reason, idx) => {
            const isPositive = reason.status === 'positive' || reason.score >= 70;
            const isWarning = reason.status === 'warning' || (reason.score >= 40 && reason.score < 70);

            return (
              <div 
                key={idx} 
                className="p-3.5 sm:p-4 rounded-2xl bg-[#F7FAF5] border border-slate-200/70 hover:bg-white hover:border-[#E8E6D5] transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <CheckCircle2 size={17} className="text-[#6B6B47] shrink-0" />
                    ) : isWarning ? (
                      <AlertTriangle size={17} className="text-amber-500 shrink-0" />
                    ) : (
                      <XCircle size={17} className="text-red-500 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-800">{reason.factor}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">({Math.round((reason.weight || 0.15) * 100)}% Weight)</span>
                  </div>

                  <span className={`text-xs font-black ${
                    isPositive ? 'text-[#4A4A2E]' : isWarning ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {reason.score}% Score
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isPositive ? 'bg-[#6B6B47]' : isWarning ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${reason.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{reason.message}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. ALTERNATIVE SUITABLE CROPS CAROUSEL / GRID             */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Alternative Suitable Cultivars</h3>
            <p className="text-xs text-slate-500">Click any crop card to load full factor analysis and irrigation plan</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Select to compare</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {crops.map((crop, idx) => {
            const visual = getCropVisuals(crop.crop_name);
            const isSelected = idx === selectedCropIndex;
            const isCompared = comparedCropNames.includes(crop.crop_name);

            return (
              <div 
                key={crop.crop_name}
                onClick={() => setSelectedCropIndex(idx)}
                className={`rounded-2xl p-5 border transition-all cursor-pointer bg-white relative hover-lift ${
                  isSelected 
                    ? 'ring-2 ring-[#6B6B47] border-[#9D9678] shadow-md' 
                    : 'border-slate-200/80 hover:border-[#D4CEBA] shadow-xs'
                }`}
              >
                {/* Header with image & score */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={visual.image} 
                      alt={crop.crop_name} 
                      className="w-12 h-12 rounded-xl object-cover shadow-xs border border-slate-100" 
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 font-display flex items-center gap-1">
                        <span>{visual.emoji}</span>
                        <span>{crop.crop_name}</span>
                      </h4>
                      <span className="text-[11px] text-slate-400">{visual.category}</span>
                    </div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-[#FAFAF7] border border-[#E8E6D5] text-[#333320] font-black text-xs flex items-center justify-center">
                    {crop.suitability_score}%
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400">Water Need:</span>
                    <p className="font-bold text-slate-800">{crop.water_requirement || 'Medium'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Yield:</span>
                    <p className="font-bold text-slate-800">{crop.expected_yield || 35} q/ha</p>
                  </div>
                </div>

                {/* Footer Selection / Compare Toggle */}
                <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCropIndex(idx)}
                    className={`text-xs font-bold ${isSelected ? 'text-[#4A4A2E]' : 'text-slate-500 hover:text-[#4A4A2E]'}`}
                  >
                    {isSelected ? '✓ Active Selection' : 'Inspect Crop →'}
                  </Button>

                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(crop.crop_name)}
                      className="rounded border-slate-300 text-[#6B6B47] focus:ring-[#9D9678]"
                    />
                    <span className="text-[11px]">Compare</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. SIDE-BY-SIDE CROP COMPARISON MATRIX                     */}
      {/* ────────────────────────────────────────────────────────── */}
      {comparedCropNames.length > 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Side-by-Side Trade-off Comparison</h3>
              <p className="text-xs text-slate-500">Evaluate key suitability metrics across your selected crops</p>
            </div>
            <span className="text-xs font-bold text-[#4A4A2E] bg-[#FAFAF7] px-3 py-1 rounded-full border border-[#E8E6D5]">
              {comparedCropNames.length} Crops Selected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-3 px-4">Feature / Metric</th>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name) || { crop_name: name };
                    const vis = getCropVisuals(name);
                    return (
                      <th key={name} className="py-3 px-4 font-bold text-slate-900 text-sm font-display">
                        <div className="flex items-center gap-1.5">
                          <span>{vis.emoji}</span>
                          <span>{name}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700">Suitability Match</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 font-extrabold text-[#4A4A2E] text-sm">
                        {c?.suitability_score || '--'}%
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700">Water Consumption</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 font-semibold text-slate-800">
                        {c?.water_requirement || 'Medium'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700">Crop Duration</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 text-slate-700 font-medium">
                        {c?.crop_duration || 120} Days
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700">Expected Yield</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 text-slate-700 font-medium">
                        {c?.expected_yield || 35} Quintal / Hectare
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700">Risk Profile</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F4EE] text-[#262619]">
                          {c?.risk_level || 'Low'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
