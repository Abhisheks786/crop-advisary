import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Button from '../components/UI/Button';
import ButtonGroup from '../components/UI/ButtonGroup';
import { 
  Sprout, 
  Loader2, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Droplets, 
  RefreshCw, 
  Sparkles, 
  Shield, 
  User 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('farmer@demo.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'farmer') {
      setEmail('farmer@demo.com');
      setPassword('password');
    } else {
      setEmail('admin@demo.com');
      setPassword('password');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7FAF5] font-sans">
      {/* Left Hero Brand Panel (5 cols) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#12372A] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Background Image with Dark Gradient Overlay */}
        <img 
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80" 
          alt="Lush Agricultural Field" 
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2C22] via-[#12372A]/90 to-[#15803D]/60" />

        {/* Brand Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9D9678] to-lime-400 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#12372A] rounded-[14px] flex items-center justify-center text-2xl">
                🌿
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight font-display">SmartCrop</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-400/20 text-lime-300 border border-lime-400/30">AI</span>
              </div>
              <p className="text-xs text-[#D4CEBA] font-medium tracking-wider uppercase">Rural Crop Advisory & Resource Planner</p>
            </div>
          </div>
        </div>

        {/* Center Tagline & Features */}
        <div className="relative z-10 max-w-md my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/20 text-lime-300 text-xs font-bold border border-lime-400/30">
            <Sparkles size={14} />
            <span>AI Precision Agriculture Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
            Grow smarter. <br />
            <span className="text-lime-300 underline decoration-lime-400/40">Farm with confidence.</span>
          </h2>

          <p className="text-sm text-[#F5F4EE]/85 leading-relaxed">
            Empowering farmers and agricultural officers with explainable crop recommendations, stage-wise irrigation calculations, and input resource budgeting.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs font-medium text-[#F5F4EE]">
              <CheckCircle2 size={18} className="text-lime-400 shrink-0" />
              <span>Deterministic multi-factor scoring (soil, season, water, pH)</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-[#F5F4EE]">
              <CheckCircle2 size={18} className="text-lime-400 shrink-0" />
              <span>Precision stage-wise irrigation scheduling & deficit warning</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-[#F5F4EE]">
              <CheckCircle2 size={18} className="text-lime-400 shrink-0" />
              <span>Full offline datasets support with zero paid API dependencies</span>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 text-xs text-[#D4CEBA]/70">
          Smart Crop Advisory System • 100% Offline Capstone Edition
        </div>
      </div>

      {/* Right Login Form Panel (7 cols) */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-200/80">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <h2 className="text-xl font-bold text-slate-900 font-display">SmartCrop AI</h2>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sign in to manage your farm profile and view crop advisories.
            </p>
          </div>

          {/* 1-Click Demo Credentials Quick Fill */}
          <div className="p-3.5 rounded-2xl bg-[#F7FAF5] border border-[#E8E6D5]/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              ⚡ 1-Click Demo Quick Sign-in:
            </span>
            <ButtonGroup>
              <Button
                type="button"
                variant={email === 'farmer@demo.com' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleQuickLogin('farmer')}
                icon={User}
                className="w-full justify-center"
              >
                Farmer Demo
              </Button>

              <Button
                type="button"
                variant={email === 'admin@demo.com' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleQuickLogin('admin')}
                icon={Shield}
                className="w-full justify-center"
              >
                Admin Officer
              </Button>
            </ButtonGroup>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@demo.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Demo: password</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-[#5FA83D] focus:ring-2 focus:ring-[#8BC56340] outline-none font-medium"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              className="w-full justify-center"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#4A4A2E] hover:text-[#333320] underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
