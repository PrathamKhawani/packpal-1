import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';

// Lazy load all page components to reduce build chunk sizes and memory footprint
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const OwnerDashboard = React.lazy(() => import('./pages/OwnerDashboard'));
const SystemLogs = React.lazy(() => import('./pages/SystemLogs'));
const RiskAssessment = React.lazy(() => import('./pages/RiskAssessment'));
const Checklists = React.lazy(() => import('./pages/Checklists'));
const Members = React.lazy(() => import('./pages/Members'));
const Vault = React.lazy(() => import('./pages/Vault'));
const Expenses = React.lazy(() => import('./pages/Expenses'));
const Itinerary = React.lazy(() => import('./pages/Itinerary'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const MissionBrief = React.lazy(() => import('./pages/MissionBrief'));
const TripSetup = React.lazy(() => import('./pages/TripSetup'));
import Layout from './layouts/Layout';

// Fallback loader for Suspense
const PageLoader = () => (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'hsl(var(--bg))', color: 'hsl(var(--p))' }}>
    <div style={{ width: '40px', height: '40px', border: '3px solid hsla(var(--p)/0.2)', borderTopColor: 'hsl(var(--p))', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useApp();
  const { role } = useParams();
  
  if (!currentUser) return <Navigate to="/login" replace />;
  
  // If the URL role doesn't match the user's role, redirect to the correct one
  if (role && role !== currentUser.role) {
    return <Navigate to={`/${currentUser.role}/dashboard`} replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { currentUser, tripConfig } = useApp();

  const renderDashboard = () => {
    if (currentUser?.role === 'admin') return <AdminDashboard />;
    if (currentUser?.role === 'owner') {
      if (!tripConfig?.setupComplete) return <Navigate to={`/${currentUser.role}/trip-setup`} replace />;
      return <OwnerDashboard />;
    }
    return <Dashboard />; // Member fallback
  };

  // For owners: if setup not complete, block all routes except trip-setup
  const ownerSetupGuard = (element) => {
    if (currentUser?.role === 'owner' && !tripConfig?.setupComplete) {
      return <Navigate to="/owner/trip-setup" replace />;
    }
    return element;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} replace /> : <Login />} />
        <Route path="/register" element={currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} replace /> : <Register />} />
        
        {/* Redirect base / to the user's role dashboard */}
        <Route path="/" element={
          currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} replace /> : <Navigate to="/login" replace />
        } />

        <Route path="/:role" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={renderDashboard()} />
          <Route path="checklists" element={ownerSetupGuard(['admin', 'owner', 'member'].includes(currentUser?.role) ? <Checklists /> : <Navigate to="../dashboard" replace />)} />
          <Route path="itinerary" element={ownerSetupGuard(['admin', 'owner', 'member'].includes(currentUser?.role) ? <Itinerary /> : <Navigate to="../dashboard" replace />)} />
          <Route path="expenses" element={ownerSetupGuard(['admin', 'owner'].includes(currentUser?.role) ? <Expenses /> : <Navigate to="../dashboard" replace />)} />
          <Route path="mission-brief" element={ownerSetupGuard(['admin', 'owner'].includes(currentUser?.role) ? <MissionBrief /> : <Navigate to="../dashboard" replace />)} />
          <Route path="trip-setup" element={currentUser?.role === 'owner' ? <TripSetup /> : <Navigate to="../dashboard" replace />} />
          <Route path="vault" element={currentUser?.role === 'admin' ? <Vault /> : <Navigate to="../dashboard" replace />} />
          <Route path="risk-assessment" element={currentUser?.role === 'admin' ? <RiskAssessment /> : <Navigate to="../dashboard" replace />} />
          <Route path="members" element={currentUser?.role === 'admin' ? <Members /> : <Navigate to="../dashboard" replace />} />
          <Route path="system-logs" element={currentUser?.role === 'admin' ? <SystemLogs /> : <Navigate to="../dashboard" replace />} />
          <Route path="analytics" element={currentUser?.role === 'admin' ? <Analytics /> : <Navigate to="../dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  );
}

export default App;
