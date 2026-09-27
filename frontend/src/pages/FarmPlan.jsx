import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Printer, 
  Share2, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Droplets, 
  Calendar, 
  TrendingUp, 
  IndianRupee, 
  Users, 
  Beaker, 
  Sprout, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import { getRecommendationById, getRecommendations } from '../services/recommendationService';
import { getCropVisuals } from '../utils/cropMedia';
import { useLanguage } from '../context/LanguageContext';
import SkeletonCard from '../components/UI/Skeleton';

const FarmPlan = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPlanData = async () => {
      setLoading(true);
      try {
        // Priority 1: State passed from Results page
        if (location.state?.recommendation) {
          setRecommendation(location.state.recommendation);
          setLoading(false);
          return;
        }

        // Priority 2: Fetch by ID
        if (id) {
          const res = await getRecommendationById(id);
          if (res.data) {
            setRecommendation(res.data);
            setLoading(false);
            return;
          }
        }

        // Priority 3: Fetch most recent
        const recList = await getRecommendations();
        if (recList.data && recList.data.length > 0) {
          setRecommendation(recList.data[0]);
        } else {
          // Demo fallback
          setRecommendation(getDemoPlan());
        }
      } catch (err) {
        console.warn('Falling back to sample plan:', err.message);
        setRecommendation(getDemoPlan());
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, [id, location.state]);

  const getDemoPlan = () => ({
    _id: 'demo-plan-wheat',
    createdAt: new Date().toISOString(),
    input: {
      state: 'Punjab',
      district: 'Ludhiana',
      landArea: 5,
      landUnit: 'acres',
      soilType: 'Loamy',
      soilPH: 6.8,
      season: 'Rabi',
      waterAvailability: 'Medium',
      irrigationMethod: 'Flood',
      previousCrop: 'Rice'
    },
    selectedCrop: 'Wheat',
    recommendedCrops: [
      {
        crop_name: 'Wheat',
        suitability_score: 96,
        category: 'Cereal',
        expected_yield: 45,
        water_requirement: 'Medium',
        crop_duration: 120,
        risk_level: 'Low'
      }
    ],
    irrigationPlan: {
      totalWaterRequired: 320000,
      waterAvailable: 300000,
      waterSurplusDeficit: -20000,
      criticalStages: ['Crown Root Initiation', 'Flowering', 'Milk Stage'],
      schedule: [
        { stage_name: 'Crown Root Initiation (CRI)', day: 21, water_mm: 30, water_liters: 60000, status: 'Critical' },
        { stage_name: 'Tillering Stage', day: 42, water_mm: 25, water_liters: 50000, status: 'Important' },
        { stage_name: 'Late Jointing Stage', day: 65, water_mm: 25, water_liters: 50000, status: 'Normal' },
        { stage_name: 'Flowering Stage', day: 85, water_mm: 35, water_liters: 70000, status: 'Critical' },
        { stage_name: 'Milk / Dough Stage', day: 105, water_mm: 30, water_liters: 60000, status: 'Critical' }
      ]
    },
    resourcePlan: {
      seeds_kg: 225,
      water_liters: 320000,
      fertilizer_kg: 320,
      fertilizer_type: ['Urea (46% N)', 'DAP (18-46-0)', 'MOP (60% K2O)'],
      labour_days: 35,
      estimated_cost: 42500,
      expected_yield_quintals: 110
    },
    rotationPlan: {
      rotation_sequence: ['Rice', 'Wheat', 'Chickpea (Gram)'],
      compatibility: 'Optimal Nitrogen Balancing',
      suggested_next: [
        { crop_name: 'Chickpea', benefit: 'Fixes atmospheric nitrogen, restoring soil fertility after intensive cereal cultivation.' }
      ]
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Farm Advisory Plan',
      text: `Smart Crop Advisory Farm Plan for ${recommendation?.selectedCrop || 'Wheat'} on ${recommendation?.input?.landArea || 5} acres.`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const cropName = recommendation?.selectedCrop || recommendation?.recommendedCrops?.[0]?.crop_name || 'Wheat';
  const cropVisuals = getCropVisuals(cropName);
  const input = recommendation?.input || {};
  const resPlan = recommendation?.resourcePlan || {};
  const irrPlan = recommendation?.irrigationPlan || {};
  const rotPlan = recommendation?.rotationPlan || {};

  // Financial calculations
  const totalCost = resPlan.estimated_cost || 42000;
  const expectedYieldQ = resPlan.expected_yield_quintals || (input.landArea || 5) * 22;
  const mspPricePerQuintal = cropName === 'Wheat' ? 2275 : cropName === 'Mustard' ? 5650 : 2500;
  const estimatedGrossRevenue = Math.round(expectedYieldQ * mspPricePerQuintal);
  const estimatedNetProfit = Math.max(0, estimatedGrossRevenue - totalCost);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 font-sans print:p-0 print:m-0 print:max-w-full">
      {/* Top Bar - Hidden when printing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-bold text-[#6B6B47] hover:text-[#262619] transition-colors"
        >
          <ArrowLeft size={16} className="mr-1.5" />
          Back to Recommendations
        </button>

        <ButtonGroup spacing="sm" responsive={false} className="w-auto">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            {t('printPlan')}
          </Button>
          <Button variant="outline" size="sm" icon={Share2} onClick={handleShare}>
            {copied ? 'Link Copied!' : t('sharePlan')}
          </Button>
          <Button variant="primary" size="sm" icon={Download} onClick={handlePrint}>
            {t('downloadPlan')}
          </Button>
        </ButtonGroup>
      </div>

      {/* Plan Document Container */}
      <div className="bg-white rounded-3xl border border-[#E8E6D5] shadow-sm overflow-hidden print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="bg-[#4A4A2E] text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5FA83D]/30 border border-[#5FA83D]/50 text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} className="text-[#8BC563]" />
                Official Farm Advisory Plan
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {cropName} Crop Production & Resource Plan
              </h1>
              <p className="text-[#D4CEBA] text-sm max-w-xl">
                Customized agronomic roadmap tailored for {input.landArea || 5} {input.landUnit || 'acres'} in {input.district || 'Ludhiana'}, {input.state || 'Punjab'}.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0">
              <span className="text-4xl">{cropVisuals.emoji}</span>
              <div>
                <p className="text-xs text-[#D4CEBA] uppercase tracking-wider font-semibold">Recommended Crop</p>
                <p className="text-xl font-bold">{cropName}</p>
                <p className="text-xs text-[#8BC563]">{cropVisuals.hindiName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Farm Parameters Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#E8E6D5] bg-[#FAFAF7] border-b border-[#E8E6D5] text-center">
          <div className="p-4">
            <span className="block text-xs text-[#6B6B47] uppercase font-bold tracking-wider">Land Holding</span>
            <span className="text-base font-extrabold text-[#262619]">{input.landArea || 5} {input.landUnit || 'acres'}</span>
          </div>
          <div className="p-4">
            <span className="block text-xs text-[#6B6B47] uppercase font-bold tracking-wider">Soil Profile</span>
            <span className="text-base font-extrabold text-[#262619]">{input.soilType || 'Loamy'} (pH {input.soilPH || '6.8'})</span>
          </div>
          <div className="p-4">
            <span className="block text-xs text-[#6B6B47] uppercase font-bold tracking-wider">Target Season</span>
            <span className="text-base font-extrabold text-[#262619]">{input.season || 'Rabi'}</span>
          </div>
          <div className="p-4">
            <span className="block text-xs text-[#6B6B47] uppercase font-bold tracking-wider">Preceding Crop</span>
            <span className="text-base font-extrabold text-[#262619]">{input.previousCrop || 'Rice'}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Financial & Yield Outlook */}
          <div>
            <h3 className="text-lg font-bold text-[#262619] flex items-center gap-2 mb-4 pb-2 border-b border-[#E8E6D5]">
              <TrendingUp className="text-[#5C7A3C]" size={20} />
              1. Financial & Yield Projections
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#F5F4EE] border border-[#E8E6D5]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B47]">Total Input Cost</span>
                  <IndianRupee size={16} className="text-[#6B6B47]" />
                </div>
                <div className="text-2xl font-extrabold text-[#262619]">
                  ₹{totalCost.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-[#6B6B47] mt-1">Includes seeds, fertilizer, labour, irrigation</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F4EE] border border-[#E8E6D5]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B47]">Expected Harvest</span>
                  <Sprout size={16} className="text-[#5FA83D]" />
                </div>
                <div className="text-2xl font-extrabold text-[#262619]">
                  {expectedYieldQ} <span className="text-sm font-semibold">quintals</span>
                </div>
                <p className="text-xs text-[#6B6B47] mt-1">~{Math.round(expectedYieldQ / (input.landArea || 5))} quintals per acre</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#5FA83D]/10 border border-[#5FA83D]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5FA83D]">Estimated Net Margin</span>
                  <CheckCircle2 size={16} className="text-[#5FA83D]" />
                </div>
                <div className="text-2xl font-extrabold text-[#4A4A2E]">
                  ₹{estimatedNetProfit.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-[#5C7A3C] mt-1 font-medium">Based on current MSP & market benchmark</p>
              </div>
            </div>
          </div>

          {/* Section 2: Input & Resource Requirements */}
          <div>
            <h3 className="text-lg font-bold text-[#262619] flex items-center gap-2 mb-4 pb-2 border-b border-[#E8E6D5]">
              <Beaker className="text-[#5C7A3C]" size={20} />
              2. Seed, Fertilizer & Labour Dosage
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-[#E8E6D5] space-y-2">
                <span className="text-xs font-bold text-[#6B6B47] uppercase tracking-wider block">Certified Seeds</span>
                <p className="text-xl font-bold text-[#262619]">{resPlan.seeds_kg || 225} kg</p>
                <p className="text-xs text-[#6B6B47]">Treated with Thiram/Bavistin at 2.5g/kg before sowing.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#E8E6D5] space-y-2">
                <span className="text-xs font-bold text-[#6B6B47] uppercase tracking-wider block">Recommended NPK Fertilizers</span>
                <p className="text-xl font-bold text-[#262619]">{resPlan.fertilizer_kg || 320} kg Total</p>
                <div className="text-xs text-[#6B6B47] space-y-0.5">
                  <p>• Urea: 110 kg (split into basal + 2 top dressings)</p>
                  <p>• DAP: 55 kg at final land preparation</p>
                  <p>• MOP: 20 kg for potash deficiency protection</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E8E6D5] space-y-2">
                <span className="text-xs font-bold text-[#6B6B47] uppercase tracking-wider block">Field Labour Requirement</span>
                <p className="text-xl font-bold text-[#262619]">{resPlan.labour_days || 35} Worker-Days</p>
                <p className="text-xs text-[#6B6B47]">Primary peaks: Sowing, weed management, and harvesting.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Stage-by-Stage Irrigation Timeline */}
          <div>
            <h3 className="text-lg font-bold text-[#262619] flex items-center gap-2 mb-4 pb-2 border-b border-[#E8E6D5]">
              <Droplets className="text-[#0284C7]" size={20} />
              3. Critical Irrigation Timeline
            </h3>

            <div className="p-4 rounded-2xl bg-[#0284C7]/5 border border-[#0284C7]/20 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">Water Balance Summary</span>
                <p className="text-base font-bold text-[#262619]">
                  {(irrPlan.totalWaterRequired || 320000).toLocaleString('en-IN')} L Required • Method: {input.irrigationMethod || 'Flood'}
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-[#0284C7] text-white">
                5 Planned Waterings
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E6D5] bg-[#FAFAF7] text-xs font-bold text-[#6B6B47] uppercase">
                    <th className="py-3 px-4">Growth Stage</th>
                    <th className="py-3 px-4">Day Window</th>
                    <th className="py-3 px-4">Depth (mm)</th>
                    <th className="py-3 px-4">Water Volume</th>
                    <th className="py-3 px-4">Priority Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6D5]/60">
                  {(irrPlan.schedule || [
                    { stage_name: 'Crown Root Initiation (CRI)', day: 21, water_mm: 30, water_liters: 60000, status: 'Critical' },
                    { stage_name: 'Tillering Stage', day: 42, water_mm: 25, water_liters: 50000, status: 'Important' },
                    { stage_name: 'Jointing Stage', day: 65, water_mm: 25, water_liters: 50000, status: 'Normal' },
                    { stage_name: 'Flowering Stage', day: 85, water_mm: 35, water_liters: 70000, status: 'Critical' },
                    { stage_name: 'Milk Stage', day: 105, water_mm: 30, water_liters: 60000, status: 'Critical' }
                  ]).map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FAFAF7]">
                      <td className="py-3 px-4 font-bold text-[#262619]">{item.stage_name}</td>
                      <td className="py-3 px-4 text-[#6B6B47]">Day {item.day}</td>
                      <td className="py-3 px-4 font-mono">{item.water_mm} mm</td>
                      <td className="py-3 px-4 font-mono text-[#0284C7] font-semibold">{item.water_liters?.toLocaleString('en-IN')} L</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          item.status === 'Critical'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-[#5FA83D]/10 text-[#5C7A3C] border border-[#5FA83D]/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Crop Rotation Strategy */}
          <div>
            <h3 className="text-lg font-bold text-[#262619] flex items-center gap-2 mb-4 pb-2 border-b border-[#E8E6D5]">
              <RefreshCw className="text-[#5FA83D]" size={20} />
              4. Sustainable Crop Rotation Sequence
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-[#FAFAF7] border border-[#E8E6D5] gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-[#6B6B47] uppercase tracking-wider block">Preceding Season</span>
                <span className="text-base font-bold text-[#262619]">{input.previousCrop || 'Rice'}</span>
                <span className="text-xs text-[#DC2626] block font-medium">Nitrogen Depleting</span>
              </div>

              <div className="text-[#5FA83D] font-bold text-lg hidden sm:block">➔</div>

              <div className="text-center p-3 rounded-xl bg-white border border-[#5FA83D] shadow-xs">
                <span className="text-xs font-bold text-[#5FA83D] uppercase tracking-wider block">Current Plan</span>
                <span className="text-base font-extrabold text-[#4A4A2E]">{cropName}</span>
                <span className="text-xs text-[#6B6B47] block font-medium">Cereal Staple</span>
              </div>

              <div className="text-[#5FA83D] font-bold text-lg hidden sm:block">➔</div>

              <div className="text-center sm:text-right">
                <span className="text-xs font-bold text-[#6B6B47] uppercase tracking-wider block">Recommended Next</span>
                <span className="text-base font-bold text-[#5C7A3C]">Chickpea (Gram)</span>
                <span className="text-xs text-[#5FA83D] block font-medium">Legume / Nitrogen-Fixing</span>
              </div>
            </div>

            <p className="text-xs text-[#6B6B47] mt-3">
              Following this sequence protects soil microbial biodiversity, prevents soil nutrient depletion, and reduces next season's fertilizer expenses by up to 25%.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-6 bg-[#F5F4EE] border-t border-[#E8E6D5] text-xs text-[#6B6B47] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#5C7A3C]" />
            <span>Generated by Smart Crop Advisory & Resource Planner v2.0 • Valid for agricultural year 2026-27</span>
          </div>
          <div className="font-mono text-[#4A4A2E]">
            Advisory ID: #{recommendation?._id?.substring(0, 10) || 'DEMO-786'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmPlan;
