import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Droplets, 
  RefreshCw, 
  Package, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  Layers, 
  ChevronRight, 
  FileText,
  IndianRupee,
  Check,
  Clock,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { getRecommendationById } from '../services/recommendationService';
import { getCropVisuals } from '../utils/cropMedia';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import ReasoningList from '../components/Recommendation/ReasoningList';
import { useLanguage } from '../context/LanguageContext';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();

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
            { factor: 'Soil Compatibility', score: 100, weight: 0.25, status: 'positive', message: 'Loamy soil provides optimal aeration and moisture holding for Wheat root crown initiation.' },
            { factor: 'Season Match', score: 100, weight: 0.20, status: 'positive', message: 'Rabi winter season with cool germination temps is ideal for Wheat tillering.' },
            { factor: 'Water Availability', score: 90, weight: 0.20, status: 'positive', message: 'Medium water supply reliably covers the 400-450mm requirement across 5 stages.' },
            { factor: 'Soil pH Window', score: 95, weight: 0.10, status: 'positive', message: 'Soil pH 6.8 is within the peak nutrient absorption window (6.0 - 7.5).' },
            { factor: 'Crop Rotation Benefit', score: 85, weight: 0.10, status: 'positive', message: 'Excellent rotation: Planting Wheat after Rice effectively uses residual field moisture.' },
            { factor: 'Temperature Adaptability', score: 95, weight: 0.10, status: 'positive', message: 'Ambient 20°C fits Wheat vegetative development (ideal 15°C - 25°C).' },
            { factor: 'Rainfall Adequacy', score: 80, weight: 0.05, status: 'positive', message: 'Medium seasonal rainfall complements scheduled canal or tube-well irrigation.' },
          ],
          warnings: []
        },
        {
          crop_name: 'Mustard',
          category: 'Oilseed',
          suitability_score: 91,
          suitability_label: 'Highly Suitable',
          risk_level: 'Low',
          water_requirement: 'Low',
          crop_duration: 110,
          expected_yield: 22,
          irrigation_frequency: 'Every 25-30 days',
          description: 'Low-water golden oilseed crop with strong market value and high drought resilience.',
          reasoning: [
            { factor: 'Soil Compatibility', score: 100, weight: 0.25, status: 'positive', message: 'Loamy soil allows deep root expansion for taproots.' },
            { factor: 'Season Match', score: 100, weight: 0.20, status: 'positive', message: 'Rabi season aligns with mustard flowering.' },
            { factor: 'Water Availability', score: 100, weight: 0.20, status: 'positive', message: 'Low water requirement; extremely drought hardy choice.' },
            { factor: 'Soil pH Window', score: 100, weight: 0.10, status: 'positive', message: 'pH 6.8 is ideal.' },
            { factor: 'Crop Rotation Benefit', score: 80, weight: 0.10, status: 'positive', message: 'Acceptable rotation after rice.' },
            { factor: 'Temperature Adaptability', score: 85, weight: 0.10, status: 'positive', message: 'Optimal cool weather compatibility.' },
            { factor: 'Rainfall Adequacy', score: 75, weight: 0.05, status: 'positive', message: 'Dry spell resistance is very high.' }
          ],
          warnings: []
        },
        {
          crop_name: 'Chickpea',
          category: 'Pulse',
          suitability_score: 86,
          suitability_label: 'Suitable',
          risk_level: 'Low',
          water_requirement: 'Low',
          crop_duration: 100,
          expected_yield: 20,
          irrigation_frequency: 'Every 30 days',
          description: 'Nitrogen-fixing legume that enhances soil organic nitrogen and enriches the field.',
          reasoning: [
            { factor: 'Soil Compatibility', score: 85, weight: 0.25, status: 'positive', message: 'Loamy soil supports root nodule formation.' },
            { factor: 'Season Match', score: 100, weight: 0.20, status: 'positive', message: 'Standard Rabi pulse crop.' },
            { factor: 'Water Availability', score: 95, weight: 0.20, status: 'positive', message: 'Low water demand.' },
            { factor: 'Soil pH Window', score: 90, weight: 0.10, status: 'positive', message: 'Tolerant to neutral-alkaline pH.' },
            { factor: 'Crop Rotation Benefit', score: 100, weight: 0.10, status: 'positive', message: 'Restores nitrogen after cereal crops.' },
            { factor: 'Temperature Adaptability', score: 80, weight: 0.10, status: 'positive', message: 'Moderately cool climate suitable.' },
            { factor: 'Rainfall Adequacy', score: 70, weight: 0.05, status: 'positive', message: 'Avoid waterlogging.' }
          ],
          warnings: []
        },
        {
          crop_name: 'Lentil',
          category: 'Pulse',
          suitability_score: 82,
          suitability_label: 'Suitable',
          risk_level: 'Low',
          water_requirement: 'Low',
          crop_duration: 95,
          expected_yield: 18,
          irrigation_frequency: 'Every 30-35 days',
          description: 'Short-duration pulse crop with low input requirements and great soil conditioning.',
          reasoning: [
            { factor: 'Soil Compatibility', score: 80, weight: 0.25, status: 'positive', message: 'Well drained loamy soil prevents root diseases.' },
            { factor: 'Season Match', score: 95, weight: 0.20, status: 'positive', message: 'Cool winter crop.' },
            { factor: 'Water Availability', score: 100, weight: 0.20, status: 'positive', message: 'Requires minimal supplemental water.' }
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
          <div className="w-12 h-12 rounded-full border-4 border-[#5C7A3C] border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-[#333320]">Analyzing Multi-Factor Crop Suitability...</p>
        </div>
      </div>
    );
  }

  const crops = recommendation.recommendedCrops || [];
  const activeCrop = crops[selectedCropIndex] || crops[0] || {};
  const activeVisual = getCropVisuals(activeCrop.crop_name);
  const input = recommendation.input || {};

  // Financial estimations
  const landArea = input.landArea || 5;
  const yieldPerAcre = Math.round((activeCrop.expected_yield || 45) / 2.2); // ~q/acre
  const totalYield = Math.round(yieldPerAcre * landArea);
  const pricePerQ = activeCrop.crop_name === 'Wheat' ? 2275 : activeCrop.crop_name === 'Mustard' ? 5650 : activeCrop.crop_name === 'Chickpea' ? 5440 : 2500;
  const grossRevenue = totalYield * pricePerQ;
  const estimatedCost = landArea * 8400;
  const estimatedProfit = Math.max(0, grossRevenue - estimatedCost);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP BAR & BREADCRUMB                                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/recommend')}
            className="inline-flex items-center text-xs font-bold text-[#6B6B47] hover:text-[#262619] transition-colors mb-2"
          >
            <ArrowLeft size={14} className="mr-1.5" />
            Modify Farm Inputs
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262619] tracking-tight">
              Crop Advisory Recommendations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAFAF7] text-[#4A4A2E] border border-[#E8E6D5]">
              {crops.length} Suitable Matches
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6B6B47] mt-1">
            Evaluated for {input.state || 'Punjab'} • {landArea} {input.landUnit || 'acres'} • {input.soilType || 'Loamy'} Soil • {input.season || 'Rabi'}
          </p>
        </div>

        <ButtonGroup spacing="sm" responsive={false}>
          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={() => navigate(recommendation._id ? `/plan/${recommendation._id}` : '/plan', { state: { recommendation } })}
          >
            {t('viewFullPlan')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Droplets}
            onClick={() => navigate('/irrigation', { state: { cropName: activeCrop.crop_name, landArea, landUnit: input.landUnit } })}
          >
            Water Schedule
          </Button>
        </ButtonGroup>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. PRIMARY RECOMMENDATION HERO CARD                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-[#5FA83D]/40 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E6D5]">
          {/* Crop Image & Score Ring (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAFAF7]/60">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C7A3C] bg-[#5FA83D]/10 px-3 py-1 rounded-full border border-[#5FA83D]/30">
                  Rank #{selectedCropIndex + 1} Recommendation
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#E8E6D5] text-[#262619]">
                  {activeCrop.category || 'Cereal'}
                </span>
              </div>

              {/* Photo & Emoji Badge */}
              <div className="relative rounded-2xl overflow-hidden aspect-video sm:aspect-4/3 w-full border border-[#E8E6D5] shadow-xs bg-white">
                {activeVisual.imageUrl ? (
                  <img 
                    src={activeVisual.imageUrl} 
                    alt={activeCrop.crop_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl">
                    {activeVisual.emoji}
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-xs font-bold px-2.5 py-1 rounded-xl shadow-xs">
                  {activeVisual.emoji} {activeVisual.hindiName}
                </div>
              </div>
            </div>

            {/* Circular Suitability Score */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E8E6D5]">
              <div>
                <span className="text-xs font-bold text-[#6B6B47] uppercase tracking-wider block">Suitability Rating</span>
                <span className="text-sm font-bold text-[#262619]">{activeCrop.suitability_label || 'Highly Suitable'}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center border-4 border-[#5FA83D] bg-[#FAFAF7]">
                  <span className="text-lg font-black text-[#4A4A2E]">{activeCrop.suitability_score}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Specs, Best Matches & Actions (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-extrabold text-[#262619]">
                    {activeCrop.crop_name}
                  </h2>
                  <span className="text-base font-semibold text-[#6B6B47]">
                    ({activeVisual.hindiName})
                  </span>
                </div>
                <p className="text-sm text-[#6B6B47] mt-1 leading-relaxed">
                  {activeCrop.description || `${activeCrop.crop_name} is perfectly suited for your soil texture and current moisture availability.`}
                </p>
              </div>

              {/* Best Matches Checklist */}
              <div>
                <span className="text-xs font-bold text-[#4A4A2E] uppercase tracking-wider block mb-2">
                  Best Matches Checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5]">
                    <Check size={16} className="text-[#5FA83D] shrink-0" />
                    <span><strong>{input.soilType || 'Loamy'}</strong> Soil Match</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5]">
                    <Check size={16} className="text-[#5FA83D] shrink-0" />
                    <span><strong>{input.season || 'Rabi'}</strong> Optimal Cycle</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5]">
                    <Check size={16} className="text-[#5FA83D] shrink-0" />
                    <span><strong>{activeCrop.water_requirement || 'Medium'}</strong> Water Availability</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5]">
                    <Check size={16} className="text-[#5FA83D] shrink-0" />
                    <span>pH <strong>{input.soilPH || '6.8'}</strong> in Optimal Range</span>
                  </div>
                </div>
              </div>

              {/* Vital Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5] text-center">
                  <span className="text-[10px] font-bold text-[#6B6B47] uppercase block">Water Need</span>
                  <p className="text-sm font-extrabold text-[#0284C7] mt-0.5">{activeCrop.water_requirement || 'Medium'}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5] text-center">
                  <span className="text-[10px] font-bold text-[#6B6B47] uppercase block">Duration</span>
                  <p className="text-sm font-extrabold text-[#262619] mt-0.5">{activeCrop.crop_duration || 120} days</p>
                </div>
                <div className="p-3 rounded-xl bg-[#FAFAF7] border border-[#E8E6D5] text-center">
                  <span className="text-[10px] font-bold text-[#6B6B47] uppercase block">Expected Yield</span>
                  <p className="text-sm font-extrabold text-[#5FA83D] mt-0.5">{yieldPerAcre} q/acre</p>
                </div>
                <div className="p-3 rounded-xl bg-[#5FA83D]/10 border border-[#5FA83D]/30 text-center">
                  <span className="text-[10px] font-bold text-[#5C7A3C] uppercase block">Est. Net Profit</span>
                  <p className="text-sm font-black text-[#4A4A2E] mt-0.5">₹{Math.round(estimatedProfit / 1000)}k</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-[#E8E6D5]">
              <ButtonGroup spacing="md">
                <Button
                  variant="primary"
                  size="lg"
                  icon={FileText}
                  onClick={() => navigate(recommendation._id ? `/plan/${recommendation._id}` : '/plan', { state: { recommendation } })}
                  className="flex-1"
                >
                  {t('viewFullPlan')}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={Scale}
                  onClick={() => toggleCompare(activeCrop.crop_name)}
                >
                  {comparedCropNames.includes(activeCrop.crop_name) ? 'Remove Compare' : 'Add to Compare'}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. VISUAL EXPLAINABLE SCORING BREAKDOWN                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <ReasoningList 
        reasoning={activeCrop.reasoning || []} 
        title={`Visual 7-Factor Scoring Engine for ${activeCrop.crop_name}`}
      />

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. ALTERNATIVE CROP RECOMMENDATIONS                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#262619]">
              Alternative Recommended Crops
            </h3>
            <p className="text-xs text-[#6B6B47]">
              Other viable choices ranked by our agricultural compatibility model
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {crops.map((crop, idx) => {
            const isSelected = idx === selectedCropIndex;
            const visual = getCropVisuals(crop.crop_name);
            const isCompared = comparedCropNames.includes(crop.crop_name);

            return (
              <div 
                key={crop.crop_name}
                onClick={() => setSelectedCropIndex(idx)}
                className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected 
                    ? 'border-[#5C7A3C] ring-2 ring-[#5C7A3C]/20 bg-white shadow-md' 
                    : 'border-[#E8E6D5] bg-white hover:border-[#D1CDBC] shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FAFAF7] border border-[#E8E6D5] text-[#6B6B47]">
                      #{idx + 1} {idx === 0 ? 'Primary' : 'Alternative'}
                    </span>
                    <span className="text-sm font-black text-[#5FA83D]">
                      {crop.suitability_score}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{visual.emoji}</span>
                    <div>
                      <h4 className="font-extrabold text-[#262619]">{crop.crop_name}</h4>
                      <p className="text-xs text-[#6B6B47]">{crop.category} • {visual.hindiName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-[#E8E6D5] mb-3">
                    <div>
                      <span className="text-[10px] text-[#6B6B47] block">Water:</span>
                      <strong className="text-[#262619]">{crop.water_requirement || 'Medium'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B6B47] block">Yield:</span>
                      <strong className="text-[#262619]">{crop.expected_yield || 35} q/ha</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setSelectedCropIndex(idx)}
                    className={`text-xs font-bold ${isSelected ? 'text-[#5C7A3C]' : 'text-[#6B6B47] hover:text-[#262619]'}`}
                  >
                    {isSelected ? '✓ Active Selection' : 'Inspect Crop →'}
                  </button>

                  <label className="flex items-center gap-1.5 text-xs text-[#6B6B47] cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(crop.crop_name)}
                      className="rounded border-[#D1CDBC] text-[#5C7A3C] focus:ring-[#5C7A3C]"
                    />
                    <span>Compare</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. SIDE-BY-SIDE CROP COMPARISON TABLE                      */}
      {/* ────────────────────────────────────────────────────────── */}
      {comparedCropNames.length > 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E8E6D5] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E6D5]">
            <div>
              <h3 className="text-base font-bold text-[#262619]">Side-by-Side Trade-off Comparison</h3>
              <p className="text-xs text-[#6B6B47]">Evaluate key suitability metrics across your selected crops</p>
            </div>
            <span className="text-xs font-bold text-[#4A4A2E] bg-[#FAFAF7] px-3 py-1 rounded-full border border-[#E8E6D5]">
              {comparedCropNames.length} Crops Selected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8E6D5] text-[11px] font-bold text-[#6B6B47] uppercase bg-[#FAFAF7]">
                  <th className="py-3 px-4">Feature / Metric</th>
                  {comparedCropNames.map(name => {
                    const vis = getCropVisuals(name);
                    return (
                      <th key={name} className="py-3 px-4 font-bold text-[#262619] text-sm">
                        <div className="flex items-center gap-1.5">
                          <span>{vis.emoji}</span>
                          <span>{name}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6D5]/60">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#262619]">Suitability Match</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 font-black text-[#5FA83D] text-sm">
                        {c?.suitability_score || '--'}%
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#262619]">Water Requirement</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 font-semibold text-[#0284C7]">
                        {c?.water_requirement || 'Medium'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#262619]">Growing Duration</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 text-[#6B6B47] font-medium">
                        {c?.crop_duration || 120} Days
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#262619]">Expected Yield</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4 text-[#6B6B47] font-medium">
                        {c?.expected_yield || 35} Quintals / Ha
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#262619]">Risk Level</td>
                  {comparedCropNames.map(name => {
                    const c = crops.find(item => item.crop_name === name);
                    return (
                      <td key={name} className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F5F4EE] text-[#4A4A2E]">
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
