import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Checklists from './pages/Checklists';
import Members from './pages/Members';
import Vault from './pages/Vault';
import Expenses from './pages/Expenses';
import Itinerary from './pages/Itinerary';
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to={`/${currentUser.role}/dashboard`} replace /> : <Login />} />
        
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
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="checklists" element={<Checklists />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="members" element={<Members />} />
          <Route path="vault" element={<Vault />} />
          <Route path="expenses" element={<Expenses />} />
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
