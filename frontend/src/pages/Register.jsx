import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import { Sprout, Loader2, AlertCircle, ArrowRight, CheckCircle2, Sparkles, User, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { INDIAN_STATES } from '../utils/constants';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    region: 'Punjab'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        region: formData.region
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7FAF5] font-sans">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#12372A] text-white p-12 flex-col justify-between overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1400&q=80" 
          alt="Golden Wheat Harvest" 
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2C22] via-[#12372A]/90 to-[#15803D]/60" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9D9678] to-lime-400 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-[#12372A] rounded-[14px] flex items-center justify-center text-2xl">
              🌾
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight font-display">SmartCrop</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400/20 text-lime-300 border border-lime-400/30">AI</span>
            </div>
            <p className="text-xs text-[#D4CEBA] font-medium tracking-wider uppercase">Rural Agriculture Portal</p>
          </div>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-5">
          <h2 className="text-3xl font-extrabold tracking-tight font-display text-white">
            Join thousands of smart farmers and agricultural officers.
          </h2>
          <p className="text-sm text-[#F5F4EE]/85 leading-relaxed">
            Register your farm profile to get personalized crop planning advisories, precise irrigation timings, and optimized resource budgeting.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-3 text-xs font-medium text-[#F5F4EE]">
              <CheckCircle2 size={17} className="text-lime-400 shrink-0" />
              <span>Full crop rotation sequencing & soil restorative tips</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-[#F5F4EE]">
              <CheckCircle2 size={17} className="text-lime-400 shrink-0" />
              <span>Stage-by-stage water volume & deficit calculations</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-[#F5F4EE]">
              <CheckCircle2 size={17} className="text-lime-400 shrink-0" />
              <span>Free offline demonstration mode</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#D4CEBA]/70">
          Smart Crop Advisory System • Secure Rural AgriTech Platform
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-200/80">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Create an account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Start receiving precision crop recommendations today.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Abhishek Kumar"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#262619] focus:bg-white outline-none"
                >
                  <option value="farmer">Farmer</option>
                  <option value="admin">Agricultural Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary State
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white outline-none"
                >
                  {Object.keys(INDIAN_STATES).map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              className="w-full mt-2 justify-center"
              icon={ArrowRight}
              iconPosition="right"
            >
              Complete Registration
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#4A4A2E] hover:text-[#333320] underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
