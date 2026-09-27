import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  Droplets, 
  RefreshCw, 
  Package, 
  ArrowRight, 
  TrendingUp, 
  CloudSun, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  IndianRupee,
  Clock,
  Check,
  BarChart3,
  ChevronDown,
  ChevronUp,
  FileText,
  MapPin,
  Wind,
  CloudRain,
  Leaf
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
import { getRecentRecommendations } from '../services/dashboardService';
import { getCropVisuals } from '../utils/cropMedia';
import Button from '../components/UI/Button';
import { SkeletonHeroCard, SkeletonCard } from '../components/UI/Skeleton';
import VoiceSpeaker from '../components/UI/VoiceSpeaker';
import WhatsAppShare from '../components/UI/WhatsAppShare';

const Dashboard = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [recentRecs, setRecentRecs] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      titleEn: 'Irrigate field', 
      titleHi: 'खेत की सिंचाई करें',
      detailEn: 'Crown root stage (Day 21) — 3 hrs tubewell',
      detailHi: 'ताज मूल अवस्था (21वां दिन) — 3 घंटे ट्यूबवेल',
      dueEn: 'Tomorrow morning',
      dueHi: 'कल सुबह',
      completed: false, 
      icon: Droplets, 
      tone: 'info'
    },
    { 
      id: 2, 
      titleEn: 'Apply urea', 
      titleHi: 'यूरिया डालें',
      detailEn: 'First top-dressing — 30 kg/acre',
      detailHi: 'पहली खुराक — 30 किलो प्रति एकड़',
      dueEn: 'In 5 days',
      dueHi: '5 दिन बाद',
      completed: false, 
      icon: Sprout, 
      tone: 'accent'
    },
    { 
      id: 3, 
      titleEn: 'Inspect for yellow rust', 
      titleHi: 'पीला रतुआ जांचें',
      detailEn: 'Check leaves for early symptoms',
      detailHi: 'पत्तियों पर शुरुआती लक्षण देखें',
      dueEn: 'In 8 days',
      dueHi: '8 दिन बाद',
      completed: false, 
      icon: AlertCircle, 
      tone: 'warning'
    },
    { 
      id: 4, 
      titleEn: 'Clean irrigation filters', 
      titleHi: 'सिंचाई फिल्टर साफ करें',
      detailEn: 'Tube-well pump & drip filters',
      detailHi: 'ट्यूबवेल पंप एवं ड्रिप फिल्टर',
      dueEn: 'Completed',
      dueHi: 'पूर्ण हुआ',
      completed: true, 
      icon: CheckCircle2, 
      tone: 'muted'
    },
  ]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'hi') {
      if (hour < 12) return 'शुभ प्रभात';
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
        const [recentRes] = await Promise.all([
          getRecentRecommendations().catch(() => null),
        ]);

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

  useEffect(() => {
    if (location.hash === '#analytics') {
      setShowAnalytics(true);
      requestAnimationFrame(() => {
        document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash, loading]);

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

  const landArea = farmInput.landArea || 5;
  const soilLabel = farmInput.soilType === 'Loamy'
    ? (language === 'hi' ? 'दोमट' : 'Loamy')
    : farmInput.soilType;
  const seasonLabel = farmInput.season === 'Rabi'
    ? (language === 'hi' ? 'रबी' : 'Rabi')
    : farmInput.season;
  const soilHealth = [
    { key: 'n', label: language === 'hi' ? 'नाइट्रोजन' : 'Nitrogen', value: 78, display: '78%' },
    { key: 'm', label: language === 'hi' ? 'नमी' : 'Moisture', value: 62, display: '62%' },
    { key: 'p', label: 'pH', value: 71, display: String(farmInput.soilPH || 7.1) },
  ];

  const growthDay = 21;
  const growthTotal = 120;
  const growthPct = Math.min(100, Math.round((growthDay / growthTotal) * 100));

  const pendingCount = tasks.filter(t => !t.completed).length;
  const visibleTasks = showAllTasks ? tasks : tasks.slice(0, 3);

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

  const spokenText = language === 'hi'
    ? `नमस्ते किसान भाई। आपके ${landArea} एकड़ खेत और ${farmInput.soilType || 'दोमट'} मिट्टी के लिए सर्वश्रेष्ठ फसल ${cropVisual.hindiName || 'गेहूं'} है। इसकी उपयुक्तता ${primaryCrop.suitability_score} प्रतिशत है। गेहूं के लिए कुल 4 से 5 सिंचाई चक्र की आवश्यकता होगी, और प्रति एकड़ लगभग 3 से 4 घंटे ट्यूबवेल चलाना होगा। आपकी अनुमानित शुद्ध बचत 60 हज़ार 375 रुपये होगी। कल सुबह ताज मूल अवस्था पर पहली सिंचाई अवश्य करें।`
    : `Hello farmer. For your ${landArea} acres of ${farmInput.soilType || 'Loamy'} soil, the top recommended crop is ${primaryCrop.crop_name} with ${primaryCrop.suitability_score}% suitability. You will need 4 to 5 irrigation cycles, running your tubewell pump for about 3 to 4 hours per acre. Expected net profit is 60 thousand rupees. Tomorrow's task: schedule first irrigation at crown root stage.`;

  const whatsappMessage = `🌾 *स्मार्ट फसल सलाह (SmartCrop AI)* 🌾\n📍 खेत: ${landArea} एकड़ | ${farmInput.soilType || 'दोमट मिट्टी'} | ${farmInput.season || 'रबी'}\n🌱 सर्वश्रेष्ठ फसल: ${primaryCrop.crop_name} (${cropVisual.hindiName}) - ${primaryCrop.suitability_score}% अनुकूल\n💧 सिंचाई: 4–5 चक्र (~3–4 घंटे प्रति एकड़)\n💰 शुद्ध बचत: ₹60,375\n📋 आज का कार्य: ताज मूल अवस्था पर पहली सिंचाई\n\nपूरी योजना देखें: ${window.location.origin}/plan/${topRec?._id || ''}`;

  const iconTone = {
    info: 'text-[#0284C7] bg-[#0284C7]/8',
    accent: 'text-[#5FA83D] bg-[#5FA83D]/8',
    warning: 'text-[#E6A900] bg-[#E6A900]/10',
    muted: 'text-[#6B6B47] bg-[#F5F4EE]',
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-5 py-4">
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
    <div className="max-w-5xl mx-auto space-y-7 pb-16 font-sans">
      
      {/* 1. Farm status */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#1C3824] tracking-tight leading-tight font-display">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : (language === 'hi' ? 'किसान' : 'Demo')} 👋
          </h1>
          <p className="mt-1.5 text-sm text-[#6B6B47] flex flex-wrap items-center gap-x-2 gap-y-1">
            <MapPin size={14} className="text-[#5C7A3C] shrink-0" />
            <span>{farmInput.state || 'Punjab'}</span>
            <span className="text-[#C2BEAD]">•</span>
            <span>{landArea} {language === 'hi' ? 'एकड़' : (farmInput.landUnit || 'acres')}</span>
            <span className="text-[#C2BEAD]">•</span>
            <span>{soilLabel} {language === 'hi' ? 'मिट्टी' : 'soil'}</span>
            <span className="text-[#C2BEAD]">•</span>
            <span>{seasonLabel} {language === 'hi' ? 'सीजन' : 'season'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/recommend')}
            className="text-xs text-[#5C7A3C] hover:bg-white border border-[#E6E4D7]"
          >
            {language === 'hi' ? 'खेत बदलें' : 'Change farm'}
          </Button>
        </div>
      </div>

      {/* 2. AI recommendation hero */}
      <section className="bg-white rounded-2xl border border-[#E6E4D7] shadow-[0_1px_2px_rgba(28,56,36,0.04)] p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#274D27]">
            <Sparkles size={14} className="text-[#5FA83D]" />
            <span>{language === 'hi' ? 'एआई सिफारिश' : 'AI Recommendation'}</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-[#366921] leading-none">{primaryCrop.suitability_score}%</div>
            <div className="text-[11px] text-[#6B6B47] mt-0.5 uppercase tracking-wide">
              {language === 'hi' ? 'मैच' : 'Match'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-[#E6E4D7] bg-[#FAFAF7] shrink-0 flex items-center justify-center text-3xl">
            {cropVisual.imageUrl ? (
              <img src={cropVisual.imageUrl} alt={primaryCrop.crop_name} className="w-full h-full object-cover" />
            ) : (
              cropVisual.emoji
            )}
          </div>
          <div>
            <h2 className="text-2xl sm:text-[28px] font-semibold text-[#1C3824] tracking-tight font-display">
              {cropVisual.hindiName
                ? `${cropVisual.hindiName} (${primaryCrop.crop_name})`
                : primaryCrop.crop_name}
            </h2>
            <p className="text-sm text-[#6B6B47] mt-1">
              {language === 'hi'
                ? `आपके ${landArea} एकड़ खेत के लिए सबसे उपयुक्त`
                : `Best suited for your ${landArea}-acre farm`}
            </p>
            <p className="text-xs text-[#6B6B47] mt-2">
              {soilLabel} {language === 'hi' ? 'मिट्टी' : 'Soil'}
              <span className="mx-2 text-[#C2BEAD]">•</span>
              {seasonLabel}
              <span className="mx-2 text-[#C2BEAD]">•</span>
              {farmInput.state || 'Punjab'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6 py-4 border-y border-[#E6E4D7]">
          <div>
            <p className="text-[11px] text-[#6B6B47] mb-1">{language === 'hi' ? 'अनुमानित पैदावार' : 'Expected yield'}</p>
            <p className="text-lg sm:text-xl font-semibold text-[#1C3824]">9 q/acre</p>
          </div>
          <div>
            <p className="text-[11px] text-[#6B6B47] mb-1">{language === 'hi' ? 'सिंचाई' : 'Water'}</p>
            <p className="text-lg sm:text-xl font-semibold text-[#1C3824]">
              {language === 'hi' ? '4–5 चक्र' : '4–5 cycles'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-[#6B6B47] mb-1">{language === 'hi' ? 'अनुमानित लाभ' : 'Est. profit'}</p>
            <p className="text-lg sm:text-xl font-semibold text-[#366921]">₹60,375</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="primary" 
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => navigate(topRec?._id ? `/results/${topRec._id}` : '/results')}
          >
            {t('viewAdvisory') || (language === 'hi' ? 'पूरी सलाह देखें' : 'View Full Advisory')}
          </Button>
          <VoiceSpeaker 
            text={spokenText} 
            title={language === 'hi' ? 'सलाह सुनें' : 'Listen'} 
            size="md" 
          />
          <WhatsAppShare 
            text={whatsappMessage} 
            title={language === 'hi' ? 'व्हाट्सएप शेयर' : 'Share'} 
            size="md" 
          />
        </div>
      </section>

      {/* 3. Today's actions */}
      <section className="bg-white rounded-2xl border border-[#E6E4D7] shadow-[0_1px_2px_rgba(28,56,36,0.04)] overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-[#1C3824] font-display">
            {language === 'hi' ? 'आज के कार्य' : "Today's Actions"}
          </h3>
          <span className="text-xs text-[#6B6B47]">
            {pendingCount} {language === 'hi' ? 'बाकी' : 'pending'}
          </span>
        </div>

        <ul className="divide-y divide-[#E6E4D7]">
          {visibleTasks.map((task) => {
            const Icon = task.icon;
            const taskTitle = language === 'hi' ? task.titleHi : task.titleEn;
            const taskDetail = language === 'hi' ? task.detailHi : task.detailEn;
            const taskDue = language === 'hi' ? task.dueHi : task.dueEn;

            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className="w-full px-5 sm:px-6 py-4 flex items-center gap-3.5 text-left hover:bg-[#FAFAF7] transition-colors"
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    task.completed
                      ? 'bg-[#5FA83D] border-[#5FA83D] text-white'
                      : 'border-[#C2BEAD] bg-white'
                  }`}>
                    {task.completed && <Check size={12} className="stroke-[3]" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-[#9D9678]' : 'text-[#1C3824]'}`}>
                      {taskTitle}
                    </p>
                    <p className="text-xs text-[#6B6B47] mt-0.5 truncate">{taskDetail}</p>
                  </div>
                  <span className={`text-xs shrink-0 ${task.completed ? 'text-[#5FA83D]' : 'text-[#6B6B47]'}`}>
                    {taskDue}
                  </span>
                  <span className={`hidden sm:flex w-8 h-8 rounded-xl items-center justify-center shrink-0 ${iconTone[task.tone]}`}>
                    {task.completed ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {tasks.length > 3 && (
          <div className="px-5 sm:px-6 py-3 border-t border-[#E6E4D7] text-center">
            <button
              type="button"
              onClick={() => setShowAllTasks(!showAllTasks)}
              className="text-sm font-medium text-[#274D27] hover:text-[#1C3824]"
            >
              {showAllTasks
                ? (language === 'hi' ? 'कम दिखाएं' : 'Show less')
                : (language === 'hi' ? 'सभी कार्य देखें' : 'View all tasks')}
            </button>
          </div>
        )}
      </section>

      {/* 4. Key metrics — soil / weather / finance (Number-first hierarchy) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Soil Health */}
        <div className="bg-white rounded-2xl border border-[#E6E4D7] p-5 shadow-[0_1px_2px_rgba(28,56,36,0.04)] flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#6B6B47] mb-2 flex items-center gap-1.5 font-medium">
              <Leaf size={14} className="text-[#5FA83D]" />
              {language === 'hi' ? 'मिट्टी स्वास्थ्य' : 'Soil Health Index'}
            </p>
            <p className="text-[32px] font-semibold text-[#1C3824] leading-none tracking-tight">78%</p>
            <p className="text-xs text-[#5FA83D] mt-2 font-medium">
              {language === 'hi' ? 'दोमट मिट्टी • संतुलित उर्वरता' : 'Optimal fertility · Loamy soil'}
            </p>
          </div>
          <div className="space-y-2.5 pt-4 border-t border-[#E6E4D7] mt-3">
            {soilHealth.map((row) => (
              <div key={row.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#6B6B47]">{row.label}</span>
                  <span className="font-semibold text-[#1C3824]">{row.display}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F5F4EE] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5FA83D]"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metric 2: Today's Weather */}
        <div className="bg-white rounded-2xl border border-[#E6E4D7] p-5 shadow-[0_1px_2px_rgba(28,56,36,0.04)] flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#6B6B47] mb-2 flex items-center gap-1.5 font-medium">
              <CloudSun size={14} className="text-[#E6A900]" />
              {language === 'hi' ? 'आज का मौसम' : 'Today · Weather'}
            </p>
            <p className="text-[32px] font-semibold text-[#1C3824] leading-none tracking-tight">24°C</p>
            <p className="text-xs text-[#6B6B47] mt-2 font-medium">
              {language === 'hi' ? 'आंशिक बादल • बुवाई अनुकूल' : 'Partly cloudy · Sowing window'}
            </p>
          </div>
          <div className="space-y-1.5 text-xs text-[#6B6B47] pt-4 border-t border-[#E6E4D7] mt-3">
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><CloudRain size={12} /> {language === 'hi' ? 'बारिश' : 'Rain'}</span>
              <span className="text-[#1C3824] font-semibold">10%</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'नमी' : 'Humidity'}</span>
              <span className="text-[#1C3824] font-semibold">64%</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><Wind size={12} /> {language === 'hi' ? 'हवा' : 'Wind'}</span>
              <span className="text-[#1C3824] font-semibold">12 km/h</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Estimated Net Profit & Yield */}
        <div className="bg-white rounded-2xl border border-[#E6E4D7] p-5 shadow-[0_1px_2px_rgba(28,56,36,0.04)] flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#6B6B47] mb-2 font-medium">
              {language === 'hi' ? 'अनुमानित शुद्ध लाभ' : 'Estimated Net Profit'}
            </p>
            <p className="text-[32px] font-semibold text-[#366921] leading-none tracking-tight">₹60,375</p>
            <p className="text-xs text-[#5FA83D] mt-2 flex items-center gap-1 font-medium">
              <TrendingUp size={13} />
              {language === 'hi' ? 'पिछले सीजन से 12% अधिक' : '↑ 12% vs previous season'}
            </p>
          </div>
          <div className="space-y-1.5 text-xs text-[#6B6B47] pt-4 border-t border-[#E6E4D7] mt-3">
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'पैदावार' : 'Expected Yield'}</span>
              <span className="text-[#1C3824] font-semibold">9 q/acre</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'बाजार भाव (MSP)' : 'Market Outlook (MSP)'}</span>
              <span className="text-[#1C3824] font-semibold">₹2,275/q</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'hi' ? 'सिंचाई चक्र' : 'Irrigation cycles'}</span>
              <span className="text-[#1C3824] font-semibold">4–5 cycles</span>
            </div>
            <p className="text-[11px] text-[#6B6B47] pt-0.5">
              {language === 'hi' ? '~3–4 घंटे पंप / एकड़' : '3–4 hrs pump runtime / acre'}
            </p>
          </div>
        </div>
      </section>

      {/* Crop growth */}
      <section className="bg-white rounded-2xl border border-[#E6E4D7] p-5 sm:p-6 shadow-[0_1px_2px_rgba(28,56,36,0.04)]">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-base font-medium text-[#1C3824]">
            {language === 'hi' ? `${cropVisual.hindiName || 'गेहूँ'} की वृद्धि` : `${primaryCrop.crop_name} Growth`}
          </h3>
          <span className="text-xs text-[#6B6B47]">
            {language === 'hi' ? `दिन ${growthDay} / ${growthTotal}` : `Day ${growthDay} of ${growthTotal}`}
          </span>
        </div>
        <div className="relative pt-6 pb-2">
          <div className="h-1 rounded-full bg-[#E6E4D7]" />
          <div
            className="absolute top-6 left-0 h-1 rounded-full bg-[#5FA83D]"
            style={{ width: `${growthPct}%` }}
          />
          <div
            className="absolute top-[18px] w-3 h-3 rounded-full bg-[#274D27] border-2 border-white shadow-sm -translate-x-1/2"
            style={{ left: `${growthPct}%` }}
          />
          <div
            className="absolute top-0 text-[11px] font-medium text-[#274D27] -translate-x-1/2"
            style={{ left: `${growthPct}%` }}
          >
            {language === 'hi' ? 'अभी' : 'Now'}
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-[#6B6B47] mt-2">
          <span>{language === 'hi' ? 'बुवाई' : 'Sowing'}</span>
          <span>{language === 'hi' ? 'कटाई' : 'Harvest'}</span>
        </div>
      </section>

      {/* 5. Secondary tools */}
      <section>
        <h3 className="text-sm font-medium text-[#6B6B47] mb-3 tracking-wide">
          {language === 'hi' ? 'अन्य उपकरण' : 'Tools'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link 
            to="/irrigation" 
            className="p-4 rounded-2xl bg-white border border-[#E6E4D7] hover:border-[#0284C7]/40 transition-colors"
          >
            <Droplets size={18} className="text-[#0284C7] mb-2" />
            <h4 className="text-sm font-medium text-[#1C3824]">
              {language === 'hi' ? 'सिंचाई' : 'Irrigation'}
            </h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' ? 'समय और जल संतुलन' : 'Schedule & water balance'}
            </p>
          </Link>

          <Link 
            to="/rotation" 
            className="p-4 rounded-2xl bg-white border border-[#E6E4D7] hover:border-[#5FA83D]/40 transition-colors"
          >
            <RefreshCw size={18} className="text-[#5FA83D] mb-2" />
            <h4 className="text-sm font-medium text-[#1C3824]">
              {language === 'hi' ? 'फसल चक्र' : 'Crop Rotation'}
            </h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' ? 'मिट्टी की उर्वरता' : 'Soil health & nitrogen'}
            </p>
          </Link>

          <Link 
            to="/resources" 
            className="p-4 rounded-2xl bg-white border border-[#E6E4D7] hover:border-[#E6A900]/40 transition-colors"
          >
            <Package size={18} className="text-[#E6A900] mb-2" />
            <h4 className="text-sm font-medium text-[#1C3824]">
              {language === 'hi' ? 'संसाधन बजट' : 'Resource Budget'}
            </h4>
            <p className="text-xs text-[#6B6B47] mt-0.5">
              {language === 'hi' ? 'बीज, खाद, लेबर' : 'Seeds, fertilizer & labor'}
            </p>
          </Link>

          <Link 
            to={topRec?._id ? `/plan/${topRec._id}` : '/plan'} 
            className="p-4 rounded-2xl bg-white border border-[#E6E4D7] hover:border-[#274D27]/30 transition-colors flex flex-col"
          >
            <FileText size={18} className="text-[#274D27] mb-2" />
            <h4 className="text-sm font-medium text-[#1C3824]">
              {language === 'hi' ? 'पूर्ण कृषि योजना' : 'Full Farm Plan'}
            </h4>
            <p className="text-xs text-[#6B6B47] mt-0.5 mb-3 flex-1">
              {language === 'hi'
                ? 'फसल, सिंचाई, खाद और बजट'
                : 'Crop, irrigation, fertilizer and budget'}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#274D27]">
              {language === 'hi' ? 'योजना खोलें' : 'Open Plan'}
              <ArrowRight size={12} />
            </span>
          </Link>
        </div>
      </section>

      {/* Analytics */}
      <section id="analytics" className="bg-white rounded-2xl border border-[#E6E4D7] overflow-hidden scroll-mt-24">
        <button
          type="button"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAFAF7] transition-colors"
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={18} className="text-[#6B6B47]" />
            <div>
              <h4 className="text-sm font-medium text-[#1C3824]">
                {language === 'hi' ? 'क्षेत्रीय कृषि विश्लेषण' : 'Regional Agricultural Analytics'}
              </h4>
              <p className="text-xs text-[#6B6B47]">
                {language === 'hi' ? 'मौसमी रुझान और जल मांग' : 'Seasonal adoption and water demand'}
              </p>
            </div>
          </div>
          {showAnalytics ? <ChevronUp size={16} className="text-[#6B6B47]" /> : <ChevronDown size={16} className="text-[#6B6B47]" />}
        </button>

        {showAnalytics && (
          <div className="p-5 border-t border-[#E6E4D7] bg-[#FAFAF7] grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E6E4D7]">
              <h5 className="text-sm font-medium text-[#1C3824] mb-4">Advisory suitability (6 months)</h5>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5FA83D" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#5FA83D" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E6E4D7" />
                    <XAxis dataKey="month" stroke="#6B6B47" fontSize={12} />
                    <YAxis stroke="#6B6B47" domain={[70, 100]} fontSize={12} />
                    <Tooltip />
                    <Area type="monotone" dataKey="avgMatch" stroke="#5FA83D" strokeWidth={2} fill="url(#matchGrad)" name="Avg Match %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E6E4D7]">
              <h5 className="text-sm font-medium text-[#1C3824] mb-4">Water demand across crops</h5>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={waterData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
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
      </section>
    </div>
  );
};

export default Dashboard;
