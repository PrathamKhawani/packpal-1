import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import SystemLogs from './pages/SystemLogs';
import RiskAssessment from './pages/RiskAssessment';
import Checklists from './pages/Checklists';
import Members from './pages/Members';
import Vault from './pages/Vault';
import Expenses from './pages/Expenses';
import Itinerary from './pages/Itinerary';
import Analytics from './pages/Analytics';
import MissionBrief from './pages/MissionBrief';
import Layout from './layouts/Layout';

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
  const { currentUser } = useApp();

  const renderDashboard = () => {
    if (currentUser?.role === 'admin') return <AdminDashboard />;
    if (currentUser?.role === 'owner') return <OwnerDashboard />;
    return <Dashboard />; // Member fallback
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
          <Route path="checklists" element={['admin', 'owner', 'member'].includes(currentUser?.role) ? <Checklists /> : <Navigate to="../dashboard" replace />} />
          <Route path="itinerary" element={['admin', 'owner', 'member'].includes(currentUser?.role) ? <Itinerary /> : <Navigate to="../dashboard" replace />} />
          <Route path="expenses" element={['admin', 'owner'].includes(currentUser?.role) ? <Expenses /> : <Navigate to="../dashboard" replace />} />
          <Route path="mission-brief" element={['admin', 'owner'].includes(currentUser?.role) ? <MissionBrief /> : <Navigate to="../dashboard" replace />} />
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
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
