import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Layout from './components/shared/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ScheduleManagement from './components/admin/ScheduleManagement';
import PayrollManagement from './components/admin/PayrollManagement';
import NFCMgmt from './components/admin/NFCMgmt';
import ScheduleView from './components/worker/ScheduleView';
import PayrollView from './components/worker/PayrollView';
import AdminDashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import JustificationsReview from './components/admin/JustificationsReview';
import WorkerDashboard from './components/worker/Dashboard';
import ClockHistory from './components/worker/ClockHistory';
import RequestJustification from './components/worker/RequestJustification';
import WorkerJustificantesAdmin from './components/admin/WorkerJustificantesAdmin';
import WorkerHistorialAdmin from './components/admin/WorkerHistorialAdmin';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<Layout />}>
                        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
                        <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
                        <Route path="/admin/justificantes" element={<ProtectedRoute allowedRoles={['ADMIN']}><JustificationsReview /></ProtectedRoute>} />
                        <Route path="/admin/historial/trabajador/:usuarioId" element={<ProtectedRoute allowedRoles={['ADMIN']}><WorkerHistorialAdmin /></ProtectedRoute>} />
                        <Route path="/admin/justificantes/trabajador/:usuarioId" element={<ProtectedRoute allowedRoles={['ADMIN']}><WorkerJustificantesAdmin /></ProtectedRoute>} />
                        <Route path="/admin/horarios" element={<ProtectedRoute allowedRoles={['ADMIN']}><ScheduleManagement /></ProtectedRoute>} />
                        <Route path="/admin/nominas" element={<ProtectedRoute allowedRoles={['ADMIN']}><PayrollManagement /></ProtectedRoute>} />
                        <Route path="/admin/nfc" element={<ProtectedRoute allowedRoles={['ADMIN']}><NFCMgmt /></ProtectedRoute>} />
                        <Route path="/worker/dashboard" element={<ProtectedRoute allowedRoles={['TRABAJADOR']}><WorkerDashboard /></ProtectedRoute>} />
                        <Route path="/worker/historial" element={<ProtectedRoute allowedRoles={['TRABAJADOR']}><ClockHistory /></ProtectedRoute>} />
                        <Route path="/worker/justificantes" element={<ProtectedRoute allowedRoles={['TRABAJADOR']}><RequestJustification /></ProtectedRoute>} />
                        <Route path="/worker/horarios" element={<ProtectedRoute allowedRoles={['TRABAJADOR']}><ScheduleView /></ProtectedRoute>} />
                        <Route path="/worker/nominas" element={<ProtectedRoute allowedRoles={['TRABAJADOR']}><PayrollView /></ProtectedRoute>} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;