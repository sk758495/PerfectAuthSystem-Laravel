import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '../css/app.css';
import { ToastProvider } from './components/common/ToastContext';

// User Pages
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Dashboard from './pages/Dashboard';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminRegister from './pages/admin/Register';
import AdminVerifyOtp from './pages/admin/VerifyOtp';
import AdminDashboard from './pages/admin/Dashboard';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/login" />;
};

const AdminPrivateRoute = ({ children }) => {
    const token = localStorage.getItem('admin_access_token');
    return token ? children : <Navigate to="/admin/login" />;
};

const App = () => {
    return (
        <ToastProvider>
            <Router>
                <Routes>
                    {/* User Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOtp />} />
                    <Route path="/dashboard" element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/register" element={<AdminRegister />} />
                    <Route path="/admin/verify-otp" element={<AdminVerifyOtp />} />
                    <Route path="/admin/dashboard" element={
                        <AdminPrivateRoute>
                            <AdminDashboard />
                        </AdminPrivateRoute>
                    } />

                    {/* Default Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </ToastProvider>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

