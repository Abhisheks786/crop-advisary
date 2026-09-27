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
  FileText,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
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
import VoiceSpeaker from '../components/UI/VoiceSpeaker';
import WhatsAppShare from '../components/UI/WhatsAppShare';

const Dashboard = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentRecs, setRecentRecs] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Interactive farmer field tasks
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      titleEn: 'First Irrigation: Crown Root Initiation Stage (Day 21)', 
      titleHi: 'पहली सिंचाई: ताज मूल (CRI) अवस्था (21वें दिन) - 3 घंटे ट्यूबवेल चलाएं',
      dueEn: 'Tomorrow Morning',
      dueHi: 'कल सुबह',
      completed: false, 
      priority: 'high', 
      icon: Droplets, 
      color: 'text-[#0284C7]' 
    },
    { 
      id: 2, 
      titleEn: 'Apply Urea First Top-Dressing (30 kg/acre)', 
      titleHi: 'यूरिया की पहली खुराक डालें (30 किलो प्रति एकड़)',
      dueEn: 'In 5 days',
      dueHi: '5 दिन बाद',
      completed: false, 
      priority: 'medium', 
      icon: Sprout, 
      color: 'text-[#5FA83D]' 
    },
    { 
      id: 3, 
      titleEn: 'Inspect crop leaves for early yellow rust symptoms', 
      titleHi: 'पत्तियों पर पीला रतुआ (Yellow Rust) के लक्षण जांचें',
      dueEn: 'In 8 days',
      dueHi: '8 दिन बाद',
      completed: false, 
      priority: 'normal', 
      icon: AlertCircle, 
      color: 'text-[#E6A900]' 
    },
    { 
      id: 4, 
      titleEn: 'Clean tube-well pump & drip irrigation filters', 
      titleHi: 'ट्यूबवेल पंप एवं ड्रिप सिंचाई फिल्टर की सफाई',
      dueEn: 'Done',
      dueHi: 'पूर्ण हुआ',
      completed: true, 
      priority: 'done', 
      icon: CheckCircle2, 
      color: 'text-[#6B6B47]' 
    },
  ]);

  // Dynamic greeting in local language
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'hi') {
      if (hour < 12) return 'राम राम / शुभ प्रभात';
      if (hour < 17) return 'नमस्ते';
      return 'शुभ संध्या';
    }
    if (language === 'pa') {
      return 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ';
    }
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
              input: { 
                state: 'Punjab', 
                district: 'Ludhiana', 
                soilType: 'Loamy', 
                soilPH: 6.8, 
                season: 'Rabi', 
                landArea: 5, 
                landUnit: 'acres', 
                waterAvailability: 'Medium' 
              },
              recommendedCrops: [
                { 
                  crop_name: 'Wheat', 
                  suitability_score: 96, 
                  suitability_label: 'Highly Suitable', 
                  category: 'Cereal', 
                  risk_level: 'Low', 
                  expected_yield: 45, 
                  water_requirement: 'Medium' 
                },
                { 
                  crop_name: 'Mustard', 
                  suitability_score: 91, 
                  suitability_label: 'Highly Suitable', 
                  category: 'Oilseed', 
                  risk_level: 'Low', 
                  expected_yield: 20, 
                  water_requirement: 'Low' 
                },
                { 
                  crop_name: 'Chickpea', 
                  suitability_score: 88, 
                  suitability_label: 'Suitable', 
                  category: 'Pulse', 
                  risk_level: 'Low', 
                  expected_yield: 25, 
                  water_requirement: 'Low' 
                }
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
  const farmInput = topRec?.input || { 
    landArea: 5, 
    landUnit: 'acres', 
    soilType: 'Loamy', 
    soilPH: 6.8, 
    season: 'Rabi', 
    state: 'Punjab',
    district: 'Ludhiana'
  };

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

  // Natural speech text in Hindi or English for 1-click audio reading
  const spokenText = language === 'hi'
    ? `नमस्ते किसान भाई। आपके ${farmInput.landArea || 5} एकड़ खेत और ${farmInput.soilType || 'दोमट'} मिट्टी के लिए सर्वश्रेष्ठ फसल ${cropVisual.hindiName || 'गेहूं'} है। इसकी उपयुक्तता ${primaryCrop.suitability_score} प्रतिशत है। गेहूं के लिए कुल 4 से 5 बार सिंचाई की आवश्यकता होगी, और प्रति एकड़ लगभग 3 से 4 घंटे ट्यूबवेल चलाना होगा। आपकी अनुमानित कुल लागत 42 हज़ार रुपये और अनुमानित शुद्ध बचत 60 हज़ार 375 रुपये होगी। कल सुबह ताज मूल अवस्था पर पहली सिंचाई अवश्य करें।`
    : `Hello farmer. For your ${farmInput.landArea || 5} acres of ${farmInput.soilType || 'Loamy'} soil, the top recommended crop is ${primaryCrop.crop_name} with ${primaryCrop.suitability_score}% suitability. You will need 4 to 5 watering rounds, running your tubewell pump for about 3 to 4 hours per acre. Estimated cost is 42 thousand rupees with an expected net profit of 60 thousand rupees. Tomorrow's task: schedule first irrigation at crown root stage.`;

  // WhatsApp share message
  const whatsappMessage = `🌾 *स्मार्ट फसल सलाह (SmartCrop AI)* 🌾\n📍 खेत: ${farmInput.landArea || 5} एकड़ | ${farmInput.soilType || 'दोमट मिट्टी'} | ${farmInput.season || 'रबी'}\n🌱 सर्वश्रेष्ठ फसल: ${primaryCrop.crop_name} (${cropVisual.hindiName}) - ${primaryCrop.suitability_score}% अनुकूल\n💧 सिंचाई: 4-5 बार पानी (~3-4 घंटे प्रति एकड़ ट्यूबवेल)\n💰 अनुमानित खर्च: ₹42,000 | शुद्ध बचत: ₹60,375\n📋 आज का कार्य: ताज मूल (CRI) अवस्था पर पहली सिंचाई\n\nपूरी योजना देखें: ${window.location.origin}/plan/${topRec?._id || ''}`;

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
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 font-sans">
      
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. FARMER WELCOME & VOICE/WHATSAPP ACTION STRIP            */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E8E6D5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C7A3C] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#5FA83D] animate-pulse"></span>
            <span>{language === 'hi' ? 'दैनिक कृषि सलाहकार' : 'Active Field Advisory'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#262619] tracking-tight">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : (language === 'hi' ? 'किसान मित्र' : 'Farmer')} 👋
          </h1>
          <p className="text-sm text-[#6B6B47] mt-1">
            {language === 'hi' 
              ? 'आज आपके खेत की स्थिति, सही फसल और दैनिक कार्यों का विवरण' 
              : 'Real-time crop intelligence, water schedule, and daily tasks'}
          </p>
        </div>

        {/* 1-Tap Voice & WhatsApp & CTA cluster */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Audio Speaker Button (Reads aloud in Hindi/English) */}
          <VoiceSpeaker 
            text={spokenText} 
            title={language === 'hi' ? "सलाह सुनें" : "Listen (बोलकर)"} 
            size="lg" 
          />

          {/* WhatsApp Share Button */}
          <WhatsAppShare 
            text={whatsappMessage} 
            title={language === 'hi' ? "व्हाट्सएप" : "Share"} 
            size="lg" 
          />

          {/* Primary New Advisory Button */}
          <Button 
            variant="primary" 
            size="lg" 
            icon={Sprout}
            onClick={() => navigate('/recommend')}
            className="shadow-sm"
          >
            {t('generateAdvisory') || 'New Advisory'}
          </Button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. "YOUR FARM" PROFILE STRIP (CLEAN & VISUAL)              */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-[#F5F4EE] rounded-2xl border border-[#E8E6D5] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B6B47]">
          <Layers size={17} className="text-[#5C7A3C]" />
          <span>{t('yourFarm') || 'खेत की प्रोफाइल'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center divide-x-0 sm:divide-x divide-[#E8E6D5] flex-1">
          <div className="bg-white sm:bg-transparent p-2.5 rounded-xl sm:p-0">
            <span className="block text-[11px] text-[#6B6B47] font-semibold">{language === 'hi' ? 'जमीन का रकबा' : 'Land Area'}</span>
            <span className="text-sm sm:text-base font-extrabold text-[#262619]">
              {farmInput.landArea} {language === 'hi' ? 'एकड़' : (farmInput.landUnit || 'acres')}
            </span>
          </div>

          <div className="bg-white sm:bg-transparent p-2.5 rounded-xl sm:p-0">
            <span className="block text-[11px] text-[#6B6B47] font-semibold">{language === 'hi' ? 'मिट्टी का प्रकार' : 'Soil Type'}</span>
            <span className="text-sm sm:text-base font-extrabold text-[#262619]">
              {farmInput.soilType === 'Loamy' ? (language === 'hi' ? 'दोमट मिट्टी' : 'Loamy') : farmInput.soilType}
            </span>
          </div>

          <div className="bg-white sm:bg-transparent p-2.5 rounded-xl sm:p-0">
            <span className="block text-[11px] text-[#6B6B47] font-semibold">{language === 'hi' ? 'सक्रिय मौसम' : 'Active Season'}</span>
            <span className="text-sm sm:text-base font-extrabold text-[#262619]">
              {farmInput.season === 'Rabi' ? (language === 'hi' ? 'रबी (सर्दियां)' : 'Rabi Season') : farmInput.season}
            </span>
          </div>

          <div className="bg-white sm:bg-transparent p-2.5 rounded-xl sm:p-0">
            <span className="block text-[11px] text-[#6B6B47] font-semibold">{language === 'hi' ? 'स्थान' : 'Location'}</span>
            <span className="text-sm sm:text-base font-extrabold text-[#262619] truncate">
              {farmInput.district || 'Ludhiana'}, {farmInput.state || 'Punjab'}
            </span>
          </div>
        </div>

        <Link 
          to="/recommend" 
          className="text-xs font-bold text-[#5C7A3C] hover:text-[#4A4A2E] underline self-end md:self-auto shrink-0"
        >
          {language === 'hi' ? 'खेत बदलें' : 'Change Details'}
        </Link>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. HERO QUESTION 1: WHAT SHOULD I PLANT? (TOP CROP)        */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-2 border-[#5FA83D]/40 shadow-sm p-5 sm:p-7 relative overflow-hidden">
        {/* Card Header Strip: Badge + Active Advisory indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-[#E8E6D5]/70">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5FA83D]/15 text-[#2E4A1E] text-xs font-bold border border-[#5FA83D]/30">
            <Sparkles size={14} className="text-[#5FA83D]" />
            <span>{language === 'hi' ? '🌾 सर्वश्रेष्ठ फसल सिफारिश' : 'TOP AI CROP RECOMMENDATION'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B6B47]">
            <span className="w-2 h-2 rounded-full bg-[#5FA83D] animate-ping" />
            <span>{language === 'hi' ? 'उपयुक्तता सत्यापित' : 'Suitability Verified'}</span>
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
                  {cropVisual.hindiName ? `${cropVisual.hindiName} (${primaryCrop.crop_name})` : primaryCrop.crop_name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#F5F4EE] text-[#4A4A2E] border border-[#E8E6D5]">
                  {primaryCrop.category || 'Cereal / अनाज'}
                </span>
              </div>
              
              <p className="text-sm text-[#6B6B47] leading-relaxed max-w-xl">
                {language === 'hi' 
                  ? `आपकी ${farmInput.soilType === 'Loamy' ? 'दोमट' : farmInput.soilType} मिट्टी और रबी सीजन के लिए सबसे उत्तम फसल। कम जोखिम में उच्च पैदावार और स्थिर बाजार भाव।` 
                  : `Best match for ${farmInput.soilType} soil during ${farmInput.season || 'Rabi'} with reliable MSP and high yield.`}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1.5">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#5FA83D]/10 text-[#2E4A1E] border border-[#5FA83D]/30 flex items-center gap-1">
                  <Check size={13} className="text-[#5FA83D]" /> {language === 'hi' ? 'दोमट मिट्टी अनुकूल' : 'Loamy compatible'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#5FA83D]/10 text-[#2E4A1E] border border-[#5FA83D]/30 flex items-center gap-1">
                  <Check size={13} className="text-[#5FA83D]" /> {language === 'hi' ? 'रबी सीजन (सर्दियां)' : 'Rabi season'}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#0284C7]/10 text-[#0284C7] border border-[#0284C7]/30 flex items-center gap-1">
                  <Droplets size={13} /> {language === 'hi' ? '4-5 बार पानी (~3-4 घंटे/एकड़)' : '4-5 watering rounds'}
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
                  {language === 'hi' ? 'सर्वश्रेष्ठ उपयुक्त' : (primaryCrop.suitability_label || 'Highly Suitable')}
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
                {t('viewAdvisory') || 'View Advisory'}
              </Button>
              <Button 
                variant="primary" 
                size="md" 
                icon={FileText}
                onClick={() => navigate(topRec?._id ? `/plan/${topRec._id}` : '/plan')}
                className="flex-1 sm:flex-none justify-center shadow-sm"
              >
                {t('viewFullPlan') || 'Farm Plan'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. PRACTICAL WATER, COST & PROFIT METRICS STRIP            */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Water in Farmer Units (Watering rounds & pump hours) */}
        <div className="bg-white rounded-2xl border border-[#E8E6D5] p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0284C7]">
            <span>{language === 'hi' ? 'सिंचाई एवं मोटर का समय' : 'Water & Pump Hours'}</span>
            <Droplets size={18} />
          </div>
          
          <div className="text-2xl font-black text-[#262619]">
            {language === 'hi' ? '4 से 5 बार पानी' : '4 to 5 Waterings'}
          </div>

          <div className="p-2.5 rounded-xl bg-[#0284C7]/10 text-xs font-semibold text-[#0284C7] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock size={13} />
              <span>{language === 'hi' ? 'प्रति एकड़ ~3-4 घंटे ट्यूबवेल चलाएं' : '~3-4 hours pump run per acre'}</span>
            </div>
            <p className="text-[11px] text-[#0369A1]">
              {language === 'hi' ? 'पर्याप्त जल स्तर उपलब्ध (कोई कमी नहीं)' : 'Adequate ground water available'}
            </p>
          </div>

          <div className="text-xs text-[#6B6B47] flex justify-between pt-0.5">
            <span>{language === 'hi' ? 'अगला पानी:' : 'Next Irrigation:'}</span>
            <span className="font-bold text-[#0284C7]">{language === 'hi' ? 'कल सुबह (21वां दिन)' : 'Tomorrow (Day 21)'}</span>
          </div>
        </div>

        {/* Metric 2: Estimated Net Margin & Cost */}
        <div className="bg-white rounded-2xl border border-[#E8E6D5] p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#5FA83D]">
            <span>{language === 'hi' ? 'अनुमानित शुद्ध बचत (मुनाफा)' : 'Estimated Net Profit'}</span>
            <TrendingUp size={18} />
          </div>

          <div className="text-2xl font-black text-[#5FA83D]">
            ₹60,375 <span className="text-xs font-semibold text-[#6B6B47]">{language === 'hi' ? '(5 एकड़)' : '(5 acres)'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#5FA83D]/10 text-xs font-semibold text-[#2E4A1E] space-y-0.5">
            <div>{language === 'hi' ? 'कुल खर्च: ₹42,000 (~₹8,400/एकड़)' : 'Total Cost: ₹42,000 (~₹8,400/acre)'}</div>
            <div className="text-[11px] text-[#6B6B47]">{language === 'hi' ? 'बीज ₹4.5k, खाद ₹12k, लेबर ₹18k' : 'Seeds ₹4.5k, Fert ₹12k, Labour ₹18k'}</div>
          </div>

          <div className="text-xs text-[#6B6B47] flex justify-between pt-0.5">
            <span>{language === 'hi' ? 'बजट स्थिति:' : 'Budget Status:'}</span>
            <span className="font-bold text-[#5FA83D]">{language === 'hi' ? 'उत्तम लाभ श्रेणी' : 'High Margin Tier'}</span>
          </div>
        </div>

        {/* Metric 3: Expected Harvest & Mandi Value */}
        <div className="bg-white rounded-2xl border border-[#E8E6D5] p-5 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#E6A900]">
            <span>{language === 'hi' ? 'अनुमानित पैदावार एवं मंडी भाव' : 'Expected Yield & Mandi'}</span>
            <IndianRupee size={18} />
          </div>

          <div className="text-2xl font-black text-[#262619]">
            45 <span className="text-sm font-semibold text-[#6B6B47]">{language === 'hi' ? 'क्विंटल' : 'quintals'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#E6A900]/10 text-xs font-semibold text-[#8C6500] space-y-0.5">
            <div>{language === 'hi' ? 'कुल अनुमानित बिक्री: ₹1,02,375' : 'Total Revenue: ₹1,02,375'}</div>
            <div className="text-[11px] text-[#8C6500]">{language === 'hi' ? 'सरकारी समर्थन मूल्य (MSP): ₹2,275/क्विंटल' : 'Govt MSP Rate: ₹2,275/q'}</div>
          </div>

          <div className="text-xs text-[#6B6B47] flex justify-between pt-0.5">
            <span>{language === 'hi' ? 'औसत उत्पादन:' : 'Average Output:'}</span>
            <span className="font-bold text-[#262619]">9 quintals / acre</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. QUESTION 3: TODAY'S FIELD ACTIONS (CHECKLIST)           */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#E8E6D5] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E6D5]">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#262619] flex items-center gap-2">
              <Calendar size={22} className="text-[#5C7A3C]" />
              <span>{language === 'hi' ? 'आज खेत में क्या काम करें?' : "Today's Field Action Plan"}</span>
            </h3>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' 
                ? 'गेहूं की फसल के लिए समय पर करने योग्य कार्य (पूरा होने पर टिक करें)' 
                : 'Time-sensitive field tasks for optimal crop development'}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#F5F4EE] text-[#4A4A2E] border border-[#E8E6D5]">
            {tasks.filter(t => !t.completed).length} {language === 'hi' ? 'बकाया कार्य' : 'pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tasks.map((task) => {
            const Icon = task.icon;
            const taskTitle = language === 'hi' ? task.titleHi : task.titleEn;
            const taskDue = language === 'hi' ? task.dueHi : task.dueEn;

            return (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3.5 ${
                  task.completed 
                    ? 'bg-[#FAFAF7] border-[#E8E6D5] opacity-60' 
                    : 'bg-white border-[#E8E6D5] hover:border-[#5C7A3C] shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed 
                      ? 'bg-[#5FA83D] border-[#5FA83D] text-white' 
                      : 'border-[#C2BEAD] bg-[#FAFAF7]'
                  }`}>
                    {task.completed && <Check size={16} className="stroke-[3]" />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${task.completed ? 'line-through text-[#6B6B47]' : 'text-[#262619]'}`}>
                      {taskTitle}
                    </p>
                    <span className="text-xs text-[#6B6B47] flex items-center gap-1.5 mt-0.5 font-medium">
                      <Clock size={12} /> {taskDue}
                    </span>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl bg-[#F5F4EE] ${task.color} shrink-0`}>
                  <Icon size={19} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 6. QUICK TOOLS GRID FOR FARM OPERATIONS                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <Link 
          to="/irrigation" 
          className="p-5 rounded-2xl bg-white border border-[#E8E6D5] hover:border-[#0284C7] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="w-12 h-12 rounded-xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Droplets size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#262619] group-hover:text-[#0284C7] transition-colors">
              {language === 'hi' ? 'सिंचाई योजना' : 'Irrigation Plan'}
            </h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' ? 'मोटर का समय एवं पानी' : 'Water balance & scheduling'}
            </p>
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
            <h4 className="font-bold text-[#262619] group-hover:text-[#5FA83D] transition-colors">
              {language === 'hi' ? 'फसल चक्र' : 'Crop Rotation'}
            </h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' ? 'मिट्टी की उर्वरता एवं दलहन' : 'Soil health & nitrogen'}
            </p>
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
            <h4 className="font-bold text-[#262619] group-hover:text-[#E6A900] transition-colors">
              {language === 'hi' ? 'खाद एवं बीज खर्च' : 'Resource Budget'}
            </h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' ? 'बीज, यूरिया एवं लेबर खर्च' : 'Seeds, fertilizer & labor'}
            </p>
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
            <h4 className="font-bold text-white">
              {language === 'hi' ? 'सम्पूर्ण कृषि योजना' : 'Full Farm Plan'}
            </h4>
            <p className="text-xs text-[#D4CEBA] mt-0.5">
              {language === 'hi' ? 'प्रिंट एवं शेयर रिपोर्ट' : 'Printable operational plan'}
            </p>
          </div>
        </Link>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 7. SECONDARY ANALYTICS (EXPANDABLE SO NOT OVERWHELMING)    */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#E8E6D5] shadow-xs overflow-hidden">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FAFAF7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F5F4EE] text-[#5C7A3C]">
              <BarChart3 size={20} />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#262619]">
                {language === 'hi' ? 'विस्तृत तकनीकी आंकड़े और ग्राफ (Detailed Agronomy Analytics)' : 'Regional Agricultural Trends & Analytics'}
              </h4>
              <p className="text-xs text-[#6B6B47]">
                {language === 'hi' ? 'वैज्ञानिक डेटा, जल संतुलन और 6 महीने के रुझान' : 'Seasonal adoption, water demand, and historical scores'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5C7A3C]">
            <span>{showAnalytics ? (language === 'hi' ? 'ग्राफ छिपाएं' : 'Hide Analytics') : (language === 'hi' ? 'ग्राफ देखें' : 'View Analytics')}</span>
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
