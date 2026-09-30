import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    ShieldCheck,
    LayoutDashboard,
    Users,
    KeyRound,
    Activity,
    Server,
    LogOut,
    Menu,
    X,
    ExternalLink,
    Terminal,
    AlertCircle
} from 'lucide-react';
import Badge from '../common/Badge';

const AdminLayout = ({
    admin,
    onLogout,
    children,
    activeTab,
    setActiveTab,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
        { id: 'users', label: 'Identity Directory', icon: Users, badge: 'Live', badgeVariant: 'info' },
        { id: 'security', label: 'Security & OTP Logs', icon: KeyRound, badge: 'Enforced', badgeVariant: 'success' },
        { id: 'telemetry', label: 'System Telemetry', icon: Activity },
    ];

    return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col lg:flex-row font-sans bg-grid-pattern">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-obsidian-900 border-b border-slate-800 sticky top-0 z-30">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-white">Admin<span className="text-cyan-400">Hub</span></span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-obsidian-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div>
                    {/* Brand */}
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-cyan-400/30">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-extrabold text-base text-white tracking-tight leading-none">
                                    Admin<span className="text-cyan-400">Hub</span>
                                </h1>
                                <p className="text-[11px] text-slate-400 mt-1">Control Plane</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="p-4 space-y-1.5">
                        <p className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Management
                        </p>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab ? activeTab === item.id : false;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (setActiveTab) setActiveTab(item.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        isActive
                                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <Badge variant={item.badgeVariant} size="sm">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Bottom System Status Widget */}
                <div className="p-4 border-t border-slate-800 space-y-3">
                    <div className="bg-obsidian-950/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs font-semibold text-slate-300">System Online</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">Encrypted</span>
                    </div>

                    {/* Switch to User App */}
                    <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                        <span>User Portal</span>
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
                            User Login <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-obsidian-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <Badge variant="primary" size="md">
                            Administrator Session
                        </Badge>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 text-right">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white uppercase shadow-md shadow-cyan-500/20">
                                {admin?.name ? admin.name.charAt(0) : 'A'}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs font-bold text-white leading-tight">{admin?.name}</p>
                                <p className="text-[11px] text-slate-400 leading-tight">{admin?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition-colors ml-2 cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
