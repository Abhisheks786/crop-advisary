import React, { useState, useEffect } from 'react';
import { 
  BarChart as BarIcon, 
  PieChart as PieIcon, 
  TrendingUp, 
  Download, 
  MapPin, 
  Sparkles, 
  Droplets,
  Layers
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
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getAdminStatistics } from '../services/adminService';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';

const AdminStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStatistics()
      .then(res => setStats(res.data || {}))
      .catch(err => console.error('Failed to load statistics:', err))
      .finally(() => setLoading(false));
  }, []);

  const timelineData = [
    { month: 'Jun', advisories: 12, avgScore: 82 },
    { month: 'Jul', advisories: 24, avgScore: 86 },
    { month: 'Aug', advisories: 38, avgScore: 84 },
    { month: 'Sep', advisories: 55, avgScore: 91 },
    { month: 'Oct', advisories: 72, avgScore: 89 },
    { month: 'Nov', advisories: 94, avgScore: 94 },
  ];

  const topCropsData = stats?.topCrops?.length > 0 ? stats.topCrops : [
    { name: 'Wheat', count: 48 },
    { name: 'Chickpea', count: 34 },
    { name: 'Mustard', count: 28 },
    { name: 'Rice', count: 22 },
    { name: 'Cotton', count: 18 },
    { name: 'Maize', count: 15 },
  ];

  const soilData = [
    { name: 'Loamy', value: 40, color: '#15803D' },
    { name: 'Clay Loam', value: 25, color: '#0D9488' },
    { name: 'Black Soil', value: 20, color: '#92400E' },
    { name: 'Sandy Loam', value: 15, color: '#F59E0B' },
  ];

  const regionData = [
    { region: 'Punjab', requests: 64 },
    { region: 'Haryana', requests: 48 },
    { region: 'Maharashtra', requests: 38 },
    { region: 'Rajasthan', requests: 32 },
    { region: 'Uttar Pradesh', requests: 28 },
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 text-[11px] font-bold border border-sky-200 mb-1">
              <span>Deep Agro-Climatic Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              System Analytics & Crop Distribution
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Cross-regional demand trends, soil distribution maps, and algorithm computation metrics.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => window.print()}
            icon={Download}
            className="px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
          >
            Export Analytics PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Advisories Over Time Area Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Advisory Generation Growth</h3>
              <p className="text-xs text-slate-500">Monthly field computation volume</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#F5F4EE] text-[#5FA83D]">
              +38% vs Last Season
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                <Area type="monotone" dataKey="advisories" stroke="#0284C7" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Top Requested Crops BarChart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Top Recommended Crops</h3>
              <p className="text-xs text-slate-500">Highest ranked cultivars across requests</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCropsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="count" fill="#15803D" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Soil Type Distribution Donut Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Soil Type Distribution</h3>
            <p className="text-xs text-slate-500">Land classification ratio across active farms</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={soilData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {soilData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Top Active Regions Bar Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Regional Adoption Density</h3>
            <p className="text-xs text-slate-500">Advisory requests generated per state</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis dataKey="region" type="category" tickLine={false} axisLine={false} tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 600 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="requests" fill="#F59E0B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;
