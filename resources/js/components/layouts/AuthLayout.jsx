import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, KeyRound, CheckCircle2, Sparkles, ArrowUpRight, Smartphone, ShieldCheck } from 'lucide-react';

const AuthLayout = ({
    children,
    title,
    subtitle,
    badgeText = 'Protected Account',
    isAdmin = false,
}) => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-obsidian-950 selection:bg-cyan-500 selection:text-obsidian-950 relative overflow-hidden bg-grid-pattern">
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

            {/* Left Brand Showcase Panel (Desktop) */}
            <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 mesh-gradient p-12 xl:p-16 flex-col justify-between overflow-hidden border-r border-slate-800/80">
                {/* Top Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white border border-cyan-400/30 animate-float">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tight text-white font-sans">
                            Perfect<span className="text-cyan-400">Auth</span>
                        </span>
                        <p className="text-xs text-slate-400 font-medium">Secure Identity & Access Management</p>
                    </div>
                </div>

                {/* Center Content / Real User Benefits */}
                <div className="relative z-10 max-w-lg space-y-7 my-auto py-8">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide shadow-inner">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span>{badgeText}</span>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight">
                            Simple, Fast & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300">
                                Secure Access.
                            </span>
                        </h1>
                        <p className="text-sm xl:text-base text-slate-300 leading-relaxed font-normal">
                            Sign in to manage your account with multi-layered protection, two-factor verification, and instant security alerts.
                        </p>
                    </div>

                    {/* Clean User Benefits List */}
                    <div className="space-y-3 pt-2">
                        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 flex items-center gap-3.5 shadow-lg">
                            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Two-Factor Authentication</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Protect your account using Google Authenticator or any TOTP app.</p>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-4 border border-cyan-500/20 flex items-center gap-3.5 shadow-lg">
                            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Device & Session Control</h4>
                                <p className="text-xs text-slate-400 mt-0.5">Keep track of your active logins and securely sign out anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="relative z-10 pt-6 flex items-center justify-between border-t border-slate-800/80 text-xs text-slate-400">
                    <div>
                        <span>&copy; {new Date().getFullYear()} PerfectAuth. All rights reserved.</span>
                    </div>
                    <div>
                        {isAdmin ? (
                            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors">
                                Switch to User Login <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        ) : (
                            <Link to="/admin/login" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors">
                                Administrator Sign In <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Auth Form Section */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative z-10">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center gap-2.5 mb-8">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                        <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        Perfect<span className="text-cyan-400">Auth</span>
                    </span>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-md space-y-6">
                    {(title || subtitle) && (
                        <div className="space-y-1.5 text-center sm:text-left">
                            {title && (
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                    {title}
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="glass-card-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/20">
                        {children}
                    </div>

                    <div className="text-center text-xs text-slate-500">
                        <span>Encrypted &bull; Privacy Protected</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
