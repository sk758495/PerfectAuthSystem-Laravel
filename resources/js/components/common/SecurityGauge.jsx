import React from 'react';
import { ShieldCheck, ShieldAlert, Zap } from 'lucide-react';

const SecurityGauge = ({ score = 50, has2FA = false, onFix }) => {
    // Score can be 50 or 100
    const strokeDashoffset = 283 - (283 * score) / 100;
    const isMax = score >= 100;

    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 border border-cyan-500/20 shadow-xl">
            {/* Ambient Background Glow */}
            <div
                className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-25 ${
                    isMax ? 'bg-emerald-500' : 'bg-cyan-500'
                }`}
            />

            {/* Left Score Gauge */}
            <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="transparent"
                            stroke="rgba(255, 255, 255, 0.08)"
                            strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="42"
                            fill="transparent"
                            stroke={isMax ? '#10b981' : '#06b6d4'}
                            strokeWidth="8"
                            strokeDasharray="264"
                            strokeDashoffset={264 - (264 * score) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-black text-white font-mono tracking-tight leading-none">
                            {score}%
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Rating</span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        {isMax ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <ShieldCheck className="w-3.5 h-3.5" /> High Security
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                                <ShieldAlert className="w-3.5 h-3.5" /> Action Recommended
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                        {isMax ? 'Account Fully Protected' : 'Enhance Account Security'}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md">
                        {isMax
                            ? 'Two-factor authentication is active and keeping your account safe.'
                            : 'Turn on two-factor authentication to reach 100% security and protect your logins.'}
                    </p>
                </div>
            </div>

            {/* Right Action */}
            {!isMax && onFix && (
                <button
                    onClick={onFix}
                    className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer border border-cyan-300/30"
                >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Enable 2FA</span>
                </button>
            )}
        </div>
    );
};

export default SecurityGauge;
