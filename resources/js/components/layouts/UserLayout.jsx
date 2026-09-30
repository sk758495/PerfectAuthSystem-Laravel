import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Shield,
    LayoutDashboard,
    Lock,
    User as UserIcon,
    LogOut,
    Bell,
    Search,
    Menu,
    X,
    CheckCircle2,
    ShieldAlert,
    ExternalLink,
    ChevronRight,
    Sliders
} from 'lucide-react';
import Badge from '../common/Badge';

const UserLayout = ({
    user,
    onLogout,
    children,
    activeTab,
    setActiveTab,
}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const has2FA = user?.two_factor_secret && user?.two_factor_confirmed_at;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'security', label: '2FA & Security', icon: Lock, badge: has2FA ? 'Secured' : 'Action Required', badgeVariant: has2FA ? 'success' : 'warning' },
        { id: 'profile', label: 'User Profile', icon: UserIcon },
        { id: 'sessions', label: 'Active Sessions', icon: Sliders },
    ];

    return (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col lg:flex-row bg-grid-pattern">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-obsidian-900 border-b border-slate-800 sticky top-0 z-30">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                        <Shield className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-white">Perfect<span className="text-cyan-400">Auth</span></span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Backdrop */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-obsidian-900/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 backdrop-blur-md ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div>
                    {/* Brand */}
                    <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 border border-cyan-400/30">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">
                                    Perfect<span className="text-cyan-400">Auth</span>
                                </h1>
                                <p className="text-[11px] text-slate-400 mt-1">User Workspace</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="p-4 space-y-1.5">
                        <p className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            Main Menu
                        </p>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab ? activeTab === item.id : location.pathname.includes(item.id);

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

                {/* Sidebar Bottom Security Card */}
                <div className="p-4 border-t border-slate-800 space-y-3">
                    <div className="bg-gradient-to-br from-cyan-950/40 to-obsidian-900 border border-cyan-900/40 rounded-2xl p-3.5">
                        <div className="flex items-center gap-2 mb-1.5">
                            {has2FA ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <ShieldAlert className="w-4 h-4 text-amber-400" />
                            )}
                            <span className="text-xs font-bold text-white">
                                {has2FA ? 'Shield Active' : 'Security Alert'}
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                            {has2FA
                                ? 'Your account is protected by 2FA Authenticator.'
                                : 'Enable 2FA to prevent unauthorized account access.'}
                        </p>
                        {!has2FA && setActiveTab && (
                            <button
                                onClick={() => setActiveTab('security')}
                                className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                            >
                                Setup 2FA Now <ChevronRight className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    {/* Admin Switch Link */}
                    <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                        <span>Admin Access?</span>
                        <Link to="/admin/login" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
                            Admin Portal <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navigation Bar */}
                <header className="h-16 bg-obsidian-900/80 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                    {/* Left Search / Info */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span>Session Active: <strong>{user?.email}</strong></span>
                        </div>
                    </div>

                    {/* Right User Actions */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white uppercase shadow-md shadow-cyan-500/20">
                                {user?.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
                                <p className="text-[11px] text-slate-400 leading-tight">{user?.email}</p>
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            title="Sign out"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 transition-colors ml-2 cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Main View Container */}
                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default UserLayout;
