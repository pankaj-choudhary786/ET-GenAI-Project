import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Auth
import SignUp from './pages/public/SignUp';
import SignIn from './pages/public/SignIn';
import ForgotPassword from './pages/public/ForgotPassword';
import AuthCallback from './pages/AuthCallback'; // Updated import
import ToastProvider from './components/Toast'; // Added
import { ProtectedRoute } from './components/ProtectedRoute'; // Added

// App Views
import UserDashboard from './pages/app/UserDashboard';
import Prospecting from './pages/app/Prospecting';
import Pipeline from './pages/app/Pipeline';
import Retention from './pages/app/Retention';
import Battlecards from './pages/app/Battlecards';
import Outbox from './pages/app/Outbox';
import Settings from './pages/app/Settings';

// Admin Views
import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import AgentActivity from './pages/admin/AgentActivity';
import DataSources from './pages/admin/DataSources';

import AdminSettings from './pages/admin/AdminSettings';

import './App.css';

function App() {
  return (
    <>
      <ToastProvider />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/app" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="prospecting" element={<Prospecting />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="retention" element={<Retention />} />
            <Route path="battlecards" element={<Battlecards />} />
            <Route path="outbox" element={<Outbox />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="agents" element={<AgentActivity />} />
            <Route path="data-sources" element={<DataSources />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
