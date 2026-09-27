import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
  Compass, 
  MapPin, 
  Sparkles, 
  Activity, 
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentRecs, setRecentRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, recsRes] = await Promise.all([
          getStatistics().catch(() => ({ data: null })),
          getRecentRecommendations().catch(() => ({ data: [] }))
        ]);

        const statsData = statsRes.data || {};
        const recsData = Array.isArray(recsRes.data) ? recsRes.data : [];

        // Fallback realistic metrics if empty
        setStats({
          totalRecommendations: statsData.totalRecommendations || (recsData.length || 14),
          mostRecommendedCrop: statsData.mostRecommendedCrop || 'Wheat',
          averageScore: statsData.averageScore || 89,
          totalRegions: statsData.totalRegions || 15,
          activeFarms: 8,
          healthScore: 92,
          topCrops: statsData.topCrops || [
            { name: 'Wheat', count: 42 },
            { name: 'Chickpea', count: 28 },
            { name: 'Mustard', count: 24 },
            { name: 'Rice', count: 18 },
            { name: 'Maize', count: 15 },
          ]
        });

        if (recsData.length > 0) {
          setRecentRecs(recsData);
        } else {
          // Curated initial recommendations for demonstration
          setRecentRecs([
            {
              _id: 'rec-01',
              createdAt: new Date().toISOString(),
              input: { state: 'Punjab', district: 'Ludhiana', soilType: 'Loamy', season: 'Rabi' },
              recommendedCrops: [
                { crop_name: 'Wheat', suitability_score: 96, suitability_label: 'Highly Suitable', risk_level: 'Low' },
                { crop_name: 'Mustard', suitability_score: 82, suitability_label: 'Suitable', risk_level: 'Low' }
              ]
            },
            {
              _id: 'rec-02',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              input: { state: 'Haryana', district: 'Karnal', soilType: 'Clay Loam', season: 'Rabi' },
              recommendedCrops: [
                { crop_name: 'Chickpea', suitability_score: 88, suitability_label: 'Suitable', risk_level: 'Low' }
              ]
            },
            {
              _id: 'rec-03',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              input: { state: 'Maharashtra', district: 'Nashik', soilType: 'Black Soil', season: 'Kharif' },
              recommendedCrops: [
                { crop_name: 'Soybean', suitability_score: 85, suitability_label: 'Suitable', risk_level: 'Low' }
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

  // Trend Chart Data
  const trendData = [
    { month: 'Jun', count: 8, avgMatch: 82 },
    { month: 'Jul', count: 14, avgMatch: 86 },
    { month: 'Aug', count: 19, avgMatch: 84 },
    { month: 'Sep', count: 26, avgMatch: 91 },
    { month: 'Oct', count: 34, avgMatch: 89 },
    { month: 'Nov', count: 42, avgMatch: 94 },
  ];

  // Water requirement distribution
  const waterData = [
    { name: 'Low (Drought Hardy)', value: 35, color: '#10B981' },
    { name: 'Medium (Optimal)', value: 45, color: '#0284C7' },
    { name: 'High (Water Intensive)', value: 20, color: '#F59E0B' },
  ];

  const topCropVisual = getCropVisuals(stats?.mostRecommendedCrop || 'Wheat');

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#6B6B47] border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-[#333320] font-display">Loading Smart Farm Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. HERO / AI INSIGHT CARD                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#12372A] via-[#164434] to-[#14532D] text-white p-6 sm:p-8 shadow-xl border border-[#333320]/40">
        {/* Decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#9D9678]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-16 w-60 h-60 rounded-full bg-lime-400/15 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 text-xs font-bold border border-lime-400/30 mb-3">
              <Sparkles size={14} className="animate-spin" />
              <span>AI Agri-Advisory Ready • Current Season: Rabi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Your field conditions are primed for <span className="text-lime-300 underline decoration-lime-400/50 underline-offset-4">{stats?.mostRecommendedCrop || 'Wheat'}</span>
            </h1>
            <p className="text-sm sm:text-base text-[#F5F4EE]/90 mt-2.5 leading-relaxed">
              Based on current soil metrics, regional rainfall trends, and seasonal moisture levels, your land demonstrates a <strong className="text-white font-bold">{stats?.averageScore}% suitability match</strong> for high-yield cultivation.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-5">
              <ButtonGroup>
                <Button
                  variant="primary"
                  onClick={() => navigate('/recommend')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-lime-400 to-[#B8B098] text-[#1A1A11] font-bold text-sm hover:from-lime-300 hover:to-[#D4CEBA] transition-all duration-200 shadow-lg shadow-[#1A1A11]/40 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sprout size={18} />
                  <span>Run New Field Analysis</span>
                  <ArrowRight size={16} />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate('/irrigation')}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 backdrop-blur-sm transition-all"
                >
                  <Droplets size={17} className="text-sky-300" />
                  <span>Calculate Irrigation Plan</span>
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Top Crop Quick Badge Preview */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[240px]">
            <img 
              src={topCropVisual.image} 
              alt={topCropVisual.name} 
              className="w-16 h-16 rounded-xl object-cover shadow-md border border-white/20"
            />
            <div>
              <span className="text-[11px] font-bold text-[#D4CEBA] uppercase tracking-wider">Top Recommended</span>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                <span>{topCropVisual.emoji}</span>
                <span>{topCropVisual.name}</span>
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-lime-400 text-[#1A1A11]">
                  {stats?.averageScore}% Match
                </span>
                <span className="text-xs text-[#E8E6D5]/80">{topCropVisual.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. FARM HEALTH & LIVE WEATHER SCORECARDS                  */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Health Scorecard (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 hover-lift">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F5F4EE] text-[#4A4A2E] flex items-center justify-center font-bold">
                <Activity size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Farm Environmental Health</h3>
                <p className="text-xs text-slate-500">Continuous aggregated index across soil, water & climate</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F5F4EE] text-[#333320] border border-[#E8E6D5]">
              Optimal Condition
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5">
            <div className="p-3.5 rounded-2xl bg-[#F7FAF5] border border-[#F5F4EE]">
              <span className="text-xs font-medium text-slate-500">Soil Quality</span>
              <p className="text-xl font-extrabold text-[#4A4A2E] font-display mt-0.5">94%</p>
              <div className="w-full bg-[#E8E6D5]/60 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-[#6B6B47] h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
              <span className="text-xs font-medium text-slate-500">Water Balance</span>
              <p className="text-xl font-extrabold text-sky-700 font-display mt-0.5">88%</p>
              <div className="w-full bg-sky-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-sky-600 h-full rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-xs font-medium text-slate-500">Season Fit</span>
              <p className="text-xl font-extrabold text-amber-700 font-display mt-0.5">96%</p>
              <div className="w-full bg-amber-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
              <span className="text-xs font-medium text-slate-500">Rotation Health</span>
              <p className="text-xl font-extrabold text-purple-700 font-display mt-0.5">90%</p>
              <div className="w-full bg-purple-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAFAF7] to-lime-50 border border-[#E8E6D5]/70 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p className="text-xs text-[#1A1A11] font-medium leading-relaxed">
              <strong>Agri-Advisor Tip:</strong> Available moisture is balanced for wheat and mustard. If cultivating rice previously, rotate with Chickpea to rebuild natural nitrogen reserves before the next summer cycle.
            </p>
          </div>
        </div>

        {/* Live Weather Forecast Widget (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden hover-lift">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-amber-200" />
              <span className="text-sm font-bold tracking-wide">Punjab / North-West Zone</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-sm">
              Today
            </span>
          </div>

          <div className="my-5 flex items-center justify-between">
            <div>
              <div className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight">28°C</div>
              <p className="text-sm font-medium text-amber-100 mt-1">Partly Cloudy • Sunny Intervals</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              ☀️
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center text-xs">
            <div className="bg-white/10 rounded-xl p-2">
              <p className="text-[10px] text-amber-200">Precipitation</p>
              <p className="font-bold text-sm mt-0.5">20%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <p className="text-[10px] text-amber-200">Humidity</p>
              <p className="font-bold text-sm mt-0.5">58%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <p className="text-[10px] text-amber-200">Wind</p>
              <p className="font-bold text-sm mt-0.5">11 km/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. YOUR FARM OVERVIEW KPI CARDS                           */}
      {/* ────────────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Farm Activity & Overview</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover-lift flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F4EE] text-[#4A4A2E] flex items-center justify-center text-xl font-bold">
              🌱
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">{stats?.totalRecommendations || 14}</p>
              <span className="text-xs font-semibold text-slate-500">Advisories Generated</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover-lift flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
              🌾
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-display truncate max-w-[120px]">{stats?.mostRecommendedCrop || 'Wheat'}</p>
              <span className="text-xs font-semibold text-slate-500">Most Popular Crop</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover-lift flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center text-xl font-bold">
              📈
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">{stats?.averageScore || 89}%</p>
              <span className="text-xs font-semibold text-slate-500">Avg Match Score</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 hover-lift flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl font-bold">
              📍
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 font-display">{stats?.totalRegions || 15}</p>
              <span className="text-xs font-semibold text-slate-500">Mapped Regions</span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. CHARTS & QUICK ACTIONS                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recommendation Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Recommendation Trends & Activity</h3>
              <p className="text-xs text-slate-500">Monthly advisory volume and average suitability score</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-[#4A4A2E] bg-[#FAFAF7] px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-[#9D9678]"></span> Advisories
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="advisoryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803D" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#15803D" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  formatter={(value, name) => [value, name === 'count' ? 'Advisories Generated' : 'Avg Score %']}
                />
                <Area type="monotone" dataKey="count" stroke="#15803D" strokeWidth={3} fillOpacity={1} fill="url(#advisoryGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display mb-1 flex items-center gap-2">
              <span>⚡ Quick Farm Actions</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">Direct shortcuts to precision planning modules</p>

            <div className="space-y-2.5">
              <Button
                variant="outline"
                onClick={() => navigate('/recommend')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FAFAF7] hover:bg-[#F5F4EE]/80 border border-[#E8E6D5]/60 text-[#262619] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#6B6B47] text-white shadow-xs">
                    <Sprout size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">New Crop Advisory</p>
                    <p className="text-[11px] text-[#333320]">4-Step Soil & Climate Wizard</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#6B6B47] group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/irrigation')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/60 text-sky-900 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
                    <Droplets size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Irrigation Planner</p>
                    <p className="text-[11px] text-sky-800">Stage Timelines & Deficit Alert</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-sky-600 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/rotation')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-purple-50 hover:bg-purple-100/80 border border-purple-200/60 text-purple-900 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Crop Rotation</p>
                    <p className="text-[11px] text-purple-800">Soil Health & Nitrogen Sequences</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate('/resources')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/60 text-amber-900 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Resource Planner</p>
                    <p className="text-[11px] text-amber-800">Seed, Labor & Cost Estimation</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-amber-600 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. RECENT FIELD RECOMMENDATIONS TABLE                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Recent Field Advisories</h3>
            <p className="text-xs text-slate-500">History of calculated crop suitability scores and regional insights</p>
          </div>
          <Link 
            to="/history" 
            className="text-xs font-bold text-[#4A4A2E] hover:text-[#333320] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#F5F4EE] transition-colors"
          >
            <span>View Full History</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-4">Date</th>
                <th className="pb-3 px-4">Location & Soil</th>
                <th className="pb-3 px-4">Season</th>
                <th className="pb-3 px-4">Top Recommended Crop</th>
                <th className="pb-3 px-4">Compatibility</th>
                <th className="pb-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentRecs.slice(0, 5).map((rec, i) => {
                const topCrop = rec.recommendedCrops?.[0] || { crop_name: 'Wheat', suitability_score: 92, suitability_label: 'Highly Suitable' };
                const cropVisual = getCropVisuals(topCrop.crop_name);
                const recDate = new Date(rec.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });

                return (
                  <tr key={rec._id || i} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-4 text-slate-600 font-medium whitespace-nowrap">
                      {recDate}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900">
                        {rec.input?.state || 'Punjab'}{rec.input?.district ? `, ${rec.input.district}` : ''}
                      </div>
                      <span className="text-[11px] text-slate-500">Soil: {rec.input?.soilType || 'Loamy'}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {rec.input?.season || 'Rabi'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{cropVisual.emoji}</span>
                        <div>
                          <p className="font-bold text-slate-900 font-display">{topCrop.crop_name}</p>
                          <span className="text-[10px] text-slate-400">{cropVisual.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#F5F4EE] text-[#333320] font-extrabold flex items-center justify-center text-xs">
                          {topCrop.suitability_score}%
                        </div>
                        <span className="hidden sm:inline text-xs font-semibold text-[#4A4A2E]">
                          {topCrop.suitability_label || 'Suitable'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/results/${rec._id}`)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FAFAF7] hover:bg-[#6B6B47] text-[#4A4A2E] hover:text-white font-bold text-xs transition-all shadow-xs"
                      >
                        View Plan →
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
