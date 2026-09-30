import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    Users,
    KeyRound,
    Activity,
    Server,
    CheckCircle2,
    Clock,
    Lock,
    Search,
    Shield,
    Terminal,
    ArrowUpRight,
    RefreshCw
} from 'lucide-react';
import AdminLayout from '../../components/layouts/AdminLayout';
import Card from '../../components/common/Card';
import StatsCard from '../../components/common/StatsCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/ToastContext';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchAdmin = async () => {
            const token = localStorage.getItem('admin_access_token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await axios.get('/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdmin(response.data.admin);
            } catch (error) {
                console.error('Failed to fetch admin', error);
                localStorage.removeItem('admin_access_token');
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem('admin_access_token');
        try {
            await axios.post('/api/admin/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Admin session terminated safely.');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('admin_access_token');
            navigate('/admin/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Securing administrative clearance...</p>
            </div>
        );
    }

    return (
        <AdminLayout
            admin={admin}
            onLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            <div className="space-y-8 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            {activeTab === 'overview' && 'Admin Dashboard'}
                            {activeTab === 'users' && 'User Directory'}
                            {activeTab === 'security' && 'Security Activity'}
                            {activeTab === 'telemetry' && 'System Settings'}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Manage user accounts, view recent security events, and configure authentication rules.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="primary" size="md" dot>
                            Verified Admin
                        </Badge>
                    </div>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <StatsCard
                                title="System Status"
                                value="Operational"
                                change="All Services Online"
                                trend="up"
                                icon={ShieldCheck}
                                color="emerald"
                            />
                            <StatsCard
                                title="Access Clearance"
                                value="Administrator"
                                change="Full Privileges"
                                trend="up"
                                icon={KeyRound}
                                color="cyan"
                            />
                            <StatsCard
                                title="OTP Security"
                                value="Enforced"
                                change="Dual-Factor"
                                trend="up"
                                icon={Lock}
                                color="blue"
                            />
                            <StatsCard
                                title="Active Session"
                                value="Verified"
                                change="Secured"
                                trend="up"
                                icon={Activity}
                                color="emerald"
                            />
                        </div>

                        {/* Admin Info Card */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card
                                title="Administrator Profile"
                                subtitle="Current credentials and permissions"
                                className="lg:col-span-1"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-cyan-500/30 flex items-center justify-center font-bold text-xl text-cyan-300 shadow-md">
                                            {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-white">{admin?.name}</h4>
                                            <p className="text-xs text-slate-400">{admin?.email}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-400">Admin ID:</span>
                                            <span className="font-mono text-cyan-300 font-bold">#{admin?.id}</span>
                                        </div>
                                        {admin?.mobile && (
                                            <div className="flex justify-between py-1">
                                                <span className="text-slate-400">Mobile Contact:</span>
                                                <span className="text-slate-200">{admin.mobile}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-400">Two-Step Status:</span>
                                            <Badge variant="success" size="sm" dot>OTP Verified</Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card
                                title="Administrative Control Center"
                                subtitle="System management and security overview"
                                className="lg:col-span-2"
                            >
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-obsidian-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Session Protection
                                            </span>
                                            <p className="text-sm font-bold text-white">Dual-Factor Verification</p>
                                            <p className="text-xs text-slate-400">Protected with timed OTP challenge</p>
                                        </div>
                                        <div className="bg-obsidian-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Identity Safeguards
                                            </span>
                                            <p className="text-sm font-bold text-white">Encrypted Credentials</p>
                                            <p className="text-xs text-slate-400">Protected user data & account records</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Terminal className="w-5 h-5 text-cyan-400" />
                                            <div>
                                                <h5 className="text-xs font-bold text-white">Security & Audit History</h5>
                                                <p className="text-[11px] text-slate-300">
                                                    Review recent sign-in events and administrative verification logs.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setActiveTab('security')}
                                        >
                                            View Logs
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <Card
                            title="Registered User Identities"
                            subtitle="Directory of user accounts and authentication profiles"
                        >
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">Multi-Tenant User Accounts</h4>
                                            <p className="text-xs text-slate-400">All registered users are encrypted and isolated under database schema.</p>
                                        </div>
                                    </div>
                                    <Badge variant="info" size="sm">Database Synced</Badge>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* SECURITY & OTP TAB */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <Card
                            title="Security Audit & OTP Events"
                            subtitle="Immutable record of administrative login and OTP verification cycles"
                        >
                            <div className="space-y-3">
                                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        <div>
                                            <span className="font-semibold text-white">Admin OTP Authenticated</span>
                                            <p className="text-slate-400">{admin?.email} &bull; Session Token Issued</p>
                                        </div>
                                    </div>
                                    <span className="text-slate-500 font-mono">Just Now</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* SYSTEM TAB */}
                {activeTab === 'telemetry' && (
                    <div className="space-y-6">
                        <Card
                            title="System Status & Health"
                            subtitle="Overview of platform services and connectivity"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 bg-obsidian-950/80 border border-slate-800 rounded-xl space-y-1">
                                    <span className="text-xs font-semibold text-slate-400">Authentication Service</span>
                                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4" /> Operational
                                    </p>
                                </div>
                                <div className="p-4 bg-obsidian-950/80 border border-slate-800 rounded-xl space-y-1">
                                    <span className="text-xs font-semibold text-slate-400">Database Connection</span>
                                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4" /> Connected
                                    </p>
                                </div>
                                <div className="p-4 bg-obsidian-950/80 border border-slate-800 rounded-xl space-y-1">
                                    <span className="text-xs font-semibold text-slate-400">2FA / OTP Verification</span>
                                    <p className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4" /> Enforced
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
