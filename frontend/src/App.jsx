import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider } from './context/LanguageContext';

// Lazy load components
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const RecommendationForm = lazy(() => import('./pages/RecommendationForm'));
const Results = lazy(() => import('./pages/Results'));
const IrrigationPlan = lazy(() => import('./pages/IrrigationPlan'));
const CropRotation = lazy(() => import('./pages/CropRotation'));
const ResourcePlan = lazy(() => import('./pages/ResourcePlan'));
const FarmPlan = lazy(() => import('./pages/FarmPlan'));
const History = lazy(() => import('./pages/History'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminCrops = lazy(() => import('./pages/AdminCrops'));
const AdminStatistics = lazy(() => import('./pages/AdminStatistics'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MainLayout = lazy(() => import('./components/Layout/MainLayout'));

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A4A2E]"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  
  return (
    <Suspense fallback={
      <div className="flex h-full min-h-[400px] items-center justify-center bg-[#FAFAF7]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4A4A2E]"></div>
      </div>
    }>
      {children}
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-[#FAFAF7]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A4A2E]"></div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="recommend" element={<RecommendationForm />} />
                <Route path="results/:id?" element={<Results />} />
                <Route path="plan/:id?" element={<FarmPlan />} />
                <Route path="irrigation/:id?" element={<IrrigationPlan />} />
                <Route path="rotation/:id?" element={<CropRotation />} />
                <Route path="resources/:id?" element={<ResourcePlan />} />
                <Route path="history" element={<History />} />
                
                {/* Admin Routes */}
                <Route path="admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
                <Route path="admin/crops" element={<ProtectedRoute requireAdmin={true}><AdminCrops /></ProtectedRoute>} />
                <Route path="admin/statistics" element={<ProtectedRoute requireAdmin={true}><AdminStatistics /></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;
