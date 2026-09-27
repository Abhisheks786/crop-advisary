import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  Droplets, 
  RefreshCw, 
  Package, 
  ArrowRight, 
  TrendingUp, 
  Sun, 
  CloudSun, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  IndianRupee,
  Clock,
  Check,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getStatistics, getRecentRecommendations } from '../services/dashboardService';
import { getCropVisuals } from '../utils/cropMedia';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import { SkeletonHeroCard, SkeletonCard } from '../components/UI/Skeleton';
import EmptyState from '../components/UI/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentRecs, setRecentRecs] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Irrigate Wheat (Crown Root Stage)', due: 'Tomorrow', completed: false, priority: 'high', icon: Droplets, color: 'text-[#0284C7]' },
    { id: 2, title: 'Apply Urea First Top-Dressing (30 kg/acre)', due: 'In 5 days', completed: false, priority: 'medium', icon: Sprout, color: 'text-[#5FA83D]' },
    { id: 3, title: 'Inspect leaves for yellow rust symptoms', due: 'In 8 days', completed: false, priority: 'normal', icon: AlertCircle, color: 'text-[#E6A900]' },
    { id: 4, title: 'Clean and flush drip irrigation filters', due: 'Completed', completed: true, priority: 'done', icon: CheckCircle2, color: 'text-[#6B6B47]' },
  ]);

  // Dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, recentRes] = await Promise.all([
          getStatistics().catch(() => null),
          getRecentRecommendations().catch(() => null),
        ]);

        if (statsRes?.data) {
          setStats(statsRes.data);
        } else {
          setStats({
            totalRecommendations: 12,
            mostRecommendedCrop: 'Wheat',
            averageSuitabilityScore: 92,
            uniqueRegions: 8,
            waterSavingCount: 9,
          });
        }

        if (recentRes?.data && recentRes.data.length > 0) {
          setRecentRecs(recentRes.data);
        } else {
          setRecentRecs([
            {
              _id: 'rec-01',
              createdAt: new Date().toISOString(),
              input: { state: 'Punjab', district: 'Ludhiana', soilType: 'Loamy', soilPH: 6.8, season: 'Rabi', landArea: 5, landUnit: 'acres', waterAvailability: 'Medium' },
              recommendedCrops: [
                { crop_name: 'Wheat', suitability_score: 96, suitability_label: 'Highly Suitable', category: 'Cereal', risk_level: 'Low', expected_yield: 45, water_requirement: 'Medium' },
                { crop_name: 'Mustard', suitability_score: 91, suitability_label: 'Highly Suitable', category: 'Oilseed', risk_level: 'Low', expected_yield: 20, water_requirement: 'Low' },
                { crop_name: 'Chickpea', suitability_score: 88, suitability_label: 'Suitable', category: 'Pulse', risk_level: 'Low', expected_yield: 25, water_requirement: 'Low' }
              ]
            },
            {
              _id: 'rec-02',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              input: { state: 'Haryana', district: 'Karnal', soilType: 'Alluvial Soil', soilPH: 7.2, season: 'Rabi', landArea: 4, landUnit: 'acres', waterAvailability: 'High' },
              recommendedCrops: [
                { crop_name: 'Mustard', suitability_score: 94, suitability_label: 'Highly Suitable', category: 'Oilseed', risk_level: 'Low' }
              ]
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const toggleTask = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const topRec = recentRecs[0];
  const primaryCrop = topRec?.recommendedCrops?.[0] || {
    crop_name: 'Wheat',
    suitability_score: 96,
    suitability_label: 'Highly Suitable',
    category: 'Cereal',
    expected_yield: 45,
    water_requirement: 'Medium'
  };

  const cropVisual = getCropVisuals(primaryCrop.crop_name);
  const farmInput = topRec?.input || { landArea: 5, landUnit: 'acres', soilType: 'Loamy', soilPH: 6.8, season: 'Rabi', state: 'Punjab' };

  // Trend & Distribution Data for expandable analytics
  const trendData = [
    { month: 'Jun', count: 8, avgMatch: 82 },
    { month: 'Jul', count: 14, avgMatch: 86 },
    { month: 'Aug', count: 19, avgMatch: 84 },
    { month: 'Sep', count: 26, avgMatch: 91 },
    { month: 'Oct', count: 34, avgMatch: 89 },
    { month: 'Nov', count: 42, avgMatch: 94 },
  ];

  const waterData = [
    { name: 'Low (Drought Hardy)', value: 35, color: '#5FA83D' },
    { name: 'Medium (Optimal)', value: 45, color: '#0284C7' },
    { name: 'High (Water Intensive)', value: 20, color: '#E6A900' },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 py-6 px-4">
        <SkeletonHeroCard />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. HEADER & GREETING + PRIMARY CTA                         */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8E6D5] shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262619] tracking-tight">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'Farmer'} 👋
          </h1>
          <p className="text-sm text-[#6B6B47] mt-1">
            Real-time agricultural intelligence and daily farm operations
          </p>
        </div>

        <Button 
          variant="primary" 
          size="lg" 
          icon={Sprout}
          onClick={() => navigate('/recommend')}
          className="shadow-md"
        >
          {t('generateAdvisory')}
        </Button>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. "YOUR FARM" PROFILE STRIP                               */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-[#F5F4EE] rounded-2xl border border-[#E8E6D5] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B6B47]">
          <Layers size={16} className="text-[#5C7A3C]" />
          <span>{t('yourFarm')}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-6 text-center divide-x divide-[#E8E6D5] flex-1">
          <div className="px-2">
            <span className="block text-xs text-[#6B6B47] font-medium">Area</span>
            <span className="text-sm sm:text-base font-extrabold text-[#262619]">
              {farmInput.landArea} {farmInput.landUnit || 'acres'}
            </span>
          </div>

          <div className="px-2">
            <span className="block text-xs text-[#6B6B47] font-medium">Soil Type</span>
            <span className="text-sm sm:text-base font-extrabold text-[#262619]">
              {farmInput.soilType} {farmInput.soilPH ? `(pH ${farmInput.soilPH})` : ''}
            </span>
          </div>

          <div className="px-2">
            <span className="block text-xs text-[#6B6B47] font-medium">Active Season</span>
            <span className="text-sm sm:text-base font-extrabold text-[#262619]">
              {farmInput.season || 'Rabi'}
            </span>
          </div>
        </div>

        <Link 
          to="/recommend" 
          className="text-xs font-bold text-[#5C7A3C] hover:text-[#4A4A2E] underline text-right self-end md:self-auto"
        >
          Update Farm Details
        </Link>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. QUESTION 1: WHAT SHOULD I PLANT? (HERO CARD)           */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-2 border-[#5FA83D]/40 shadow-sm p-5 sm:p-7 relative overflow-hidden">
        {/* Card Header Strip: Badge + Active Advisory indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-[#E8E6D5]/70">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5FA83D]/15 text-[#2E4A1E] text-xs font-bold border border-[#5FA83D]/30">
            <Sparkles size={14} className="text-[#5FA83D]" />
            <span>{t('whatShouldIPlant') || 'TOP CROP RECOMMENDATION'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6B47]">
            <span className="w-2 h-2 rounded-full bg-[#5FA83D] animate-ping" />
            <span>AI Computed Advisory</span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Left: Image & Crop Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0">
            {/* Crop Photo / Visual */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-[#E8E6D5] shadow-xs shrink-0 bg-[#FAFAF7]">
              {cropVisual.imageUrl ? (
                <img 
                  src={cropVisual.imageUrl} 
                  alt={primaryCrop.crop_name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {cropVisual.emoji}
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-white/95 shadow-xs text-xs px-1.5 py-0.5 rounded-md font-bold text-[#262619]">
                {cropVisual.emoji}
              </div>
            </div>

            {/* Crop Information */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#262619] tracking-tight">
                  {primaryCrop.crop_name}
                </h2>
                <span className="text-sm font-semibold text-[#6B6B47]">
                  ({cropVisual.hindiName})
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#F5F4EE] text-[#4A4A2E] border border-[#E8E6D5]">
                  {primaryCrop.category || 'Cereal'}
                </span>
              </div>
              
              <p className="text-sm text-[#6B6B47] leading-relaxed max-w-xl">
                Best match for <strong className="text-[#262619]">{farmInput.soilType}</strong> soil during <strong className="text-[#262619]">{farmInput.season || 'Rabi'}</strong> season with <strong className="text-[#262619]">{farmInput.waterAvailability || 'Medium'}</strong> water availability.
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1.5">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#5FA83D]/10 text-[#2E4A1E] border border-[#5FA83D]/30 flex items-center gap-1">
                  <Check size={13} className="text-[#5FA83D]" /> {farmInput.soilType} compatible
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#5FA83D]/10 text-[#2E4A1E] border border-[#5FA83D]/30 flex items-center gap-1">
                  <Check size={13} className="text-[#5FA83D]" /> {farmInput.season || 'Rabi'} season
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/30 flex items-center gap-1">
                  <Droplets size={13} /> {primaryCrop.water_requirement || 'Medium'} water
                </span>
              </div>
            </div>
          </div>

          {/* Right: Score Card & Action Buttons */}
          <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between gap-4 pt-4 xl:pt-0 border-t xl:border-t-0 border-[#E8E6D5] shrink-0">
            {/* Score Pill */}
            <div className="flex items-center gap-3 bg-[#FAFAF7] p-2.5 sm:p-3 rounded-2xl border border-[#E8E6D5]">
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-black text-[#5FA83D] leading-none">
                  {primaryCrop.suitability_score}%
                </div>
                <div className="text-[11px] font-bold text-[#6B6B47] uppercase tracking-wider mt-0.5">
                  {primaryCrop.suitability_label || 'Highly Suitable'}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#5FA83D]/15 border border-[#5FA83D]/30 flex items-center justify-center text-[#5FA83D]">
                <Sparkles size={24} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="md" 
                onClick={() => navigate(topRec?._id ? `/results/${topRec._id}` : '/results')}
                className="flex-1 sm:flex-none justify-center"
              >
                {t('viewAdvisory')}
              </Button>
              <Button 
                variant="primary" 
                size="md" 
                icon={FileText}
                onClick={() => navigate(topRec?._id ? `/plan/${topRec._id}` : '/plan')}
                className="flex-1 sm:flex-none justify-center shadow-sm"
              >
                {t('viewFullPlan')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. QUESTIONS 2, 4: WATER, COST, AND YIELD METRICS STRIP   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Water Status */}
        <div className="bg-white rounded-2xl border border-[#E8E6D5] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0284C7]">
            <span>{t('howMuchWater')}</span>
            <Droplets size={18} />
          </div>
          <div className="text-2xl font-black text-[#262619]">
            300,000 <span className="text-sm font-semibold text-[#6B6B47]">Liters</span>
          </div>
          <div className="w-full bg-[#E8E6D5]/60 h-2 rounded-full overflow-hidden">
            <div className="bg-[#0284C7] h-full rounded-full" style={{ width: '94%' }} />
          </div>
          <div className="flex justify-between items-center text-xs text-[#6B6B47] pt-1">
            <span>Req: 320,000 L</span>
            <span className="text-[#E6A900] font-bold">Deficit: 20k L (-6%)</span>
          </div>
        </div>

        {/* Metric 2: Estimated Cost */}
        <div className="bg-white rounded-2xl border border-[#E8E6D5] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6B6B47]">
            <span>{t('estimatedCost')}</span>
            <IndianRupee size={18} />
          </div>
          <div className="text-2xl font-black text-[#262619]">
            ₹42,000
          </div>
          <p className="text-xs text-[#6B6B47]">
            ₹8,400 per acre (seeds ₹4.5k, fertilizer ₹12k, labour ₹18k)
          </p>
          <div className="text-xs font-bold text-[#5C7A3C] pt-1">
            Budget status: Well within optimal tier
          </div>
        </div>

        {/* Metric 3: Expected Yield */}
        <div className="bg-white rounded-2xl border border-[#E8E6D5] p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5FA83D]">
            <span>{t('expectedYield')}</span>
            <TrendingUp size={18} />
          </div>
          <div className="text-2xl font-black text-[#262619]">
            45 <span className="text-sm font-semibold text-[#6B6B47]">quintals</span>
          </div>
          <p className="text-xs text-[#6B6B47]">
            Estimated market value: ₹1,02,375 @ MSP ₹2,275/q
          </p>
          <div className="text-xs font-bold text-[#5FA83D] pt-1">
            Est. Net Profit: ₹60,375
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. QUESTION 3: WHAT SHOULD I DO TODAY? (UPCOMING TASKS)   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#E8E6D5] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E6D5]">
          <div>
            <h3 className="text-lg font-bold text-[#262619] flex items-center gap-2">
              <Calendar size={20} className="text-[#5C7A3C]" />
              <span>{t('whatToDoToday')}</span>
            </h3>
            <p className="text-xs text-[#6B6B47]">
              Time-sensitive agronomic tasks recommended for your {primaryCrop.crop_name} crop
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F5F4EE] text-[#4A4A2E] border border-[#E8E6D5]">
            {tasks.filter(t => !t.completed).length} pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((task) => {
            const Icon = task.icon;
            return (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  task.completed 
                    ? 'bg-[#FAFAF7] border-[#E8E6D5] opacity-60' 
                    : 'bg-white border-[#E8E6D5] hover:border-[#5C7A3C] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                    task.completed 
                      ? 'bg-[#5FA83D] border-[#5FA83D] text-white' 
                      : 'border-[#D1CDBC] bg-white'
                  }`}>
                    {task.completed && <Check size={14} />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${task.completed ? 'line-through text-[#6B6B47]' : 'text-[#262619]'}`}>
                      {task.title}
                    </p>
                    <span className="text-xs text-[#6B6B47] flex items-center gap-1 mt-0.5">
                      <Clock size={12} /> {task.due}
                    </span>
                  </div>
                </div>

                <div className={`p-2 rounded-xl bg-[#F5F4EE] ${task.color}`}>
                  <Icon size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 6. QUICK TOOLS NAVIGATION GRID                            */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link 
          to="/irrigation" 
          className="p-5 rounded-2xl bg-white border border-[#E8E6D5] hover:border-[#0284C7] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Droplets size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#262619] group-hover:text-[#0284C7] transition-colors">Irrigation Plan</h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">Water balance & scheduling</p>
          </div>
        </Link>

        <Link 
          to="/rotation" 
          className="p-5 rounded-2xl bg-white border border-[#E8E6D5] hover:border-[#5FA83D] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-xl bg-[#5FA83D]/10 text-[#5FA83D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#262619] group-hover:text-[#5FA83D] transition-colors">Crop Rotation</h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">Soil health & nitrogen fixing</p>
          </div>
        </Link>

        <Link 
          to="/resources" 
          className="p-5 rounded-2xl bg-white border border-[#E8E6D5] hover:border-[#E6A900] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-xl bg-[#E6A900]/10 text-[#E6A900] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Package size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#262619] group-hover:text-[#E6A900] transition-colors">Resource Budget</h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">Seeds, fertilizer & labour</p>
          </div>
        </Link>

        <Link 
          to="/plan" 
          className="p-5 rounded-2xl bg-[#4A4A2E] text-white border border-[#4A4A2E] hover:bg-[#363622] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText size={24} />
          </div>
          <div>
            <h4 className="font-bold text-white">Full Farm Plan</h4>
            <p className="text-xs text-[#D4CEBA] mt-0.5">Consolidated advisory report</p>
          </div>
        </Link>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 7. SECONDARY ANALYTICS (EXPANDABLE)                       */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#E8E6D5] shadow-xs overflow-hidden">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FAFAF7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F5F4EE] text-[#5C7A3C]">
              <BarChart3 size={20} />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#262619]">
                Regional Agricultural Trends & Analytics
              </h4>
              <p className="text-xs text-[#6B6B47]">
                Seasonal adoption and regional water requirements
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5C7A3C]">
            <span>{showAnalytics ? 'Hide Analytics' : 'View Analytics'}</span>
            {showAnalytics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showAnalytics && (
          <div className="p-6 border-t border-[#E8E6D5] bg-[#FAFAF7] grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E6D5]">
              <h5 className="text-sm font-bold text-[#262619] mb-4">Advisory Suitability Scores (Last 6 Months)</h5>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5FA83D" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5FA83D" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E6D5" />
                    <XAxis dataKey="month" stroke="#6B6B47" fontSize={12} />
                    <YAxis stroke="#6B6B47" domain={[70, 100]} fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="avgMatch" stroke="#5FA83D" strokeWidth={2} fill="url(#matchGrad)" name="Avg Match %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E8E6D5]">
              <h5 className="text-sm font-bold text-[#262619] mb-4">Water Demand Profiles Across Crops</h5>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={waterData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label>
                      {waterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
