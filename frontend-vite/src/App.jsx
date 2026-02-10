// src/App.jsx - AÑADIR LAS NUEVAS RUTAS
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Layout from './components/shared/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import JustificationsReview from './components/admin/JustificationsReview';

// Worker Components
import WorkerDashboard from './components/worker/Dashboard';
import ClockHistory from './components/worker/ClockHistory';
import RequestJustification from './components/worker/RequestJustification';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Layout />}>
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/justificantes"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <JustificationsReview />
                </ProtectedRoute>
              }
            />

            {/* Worker Routes */}
            <Route
              path="/worker/dashboard"
              element={
                <ProtectedRoute allowedRoles={['TRABAJADOR']}>
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/historial"
              element={
                <ProtectedRoute allowedRoles={['TRABAJADOR']}>
                  <ClockHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/justificantes"
              element={
                <ProtectedRoute allowedRoles={['TRABAJADOR']}>
                  <RequestJustification />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;