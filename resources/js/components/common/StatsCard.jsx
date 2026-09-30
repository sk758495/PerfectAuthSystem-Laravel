import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({
    title,
    value,
    change,
    trend = 'up', // up | down
    period = 'vs last month',
    icon: Icon,
    color = 'indigo', // indigo | emerald | amber | rose | sky | violet
    className = '',
}) => {
    const colorSchemes = {
        cyan: {
            bg: 'bg-cyan-500/15',
            text: 'text-cyan-400',
            border: 'border-cyan-500/30',
            glow: 'from-cyan-500/15 to-transparent',
        },
        blue: {
            bg: 'bg-blue-500/15',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            glow: 'from-blue-500/15 to-transparent',
        },
        indigo: {
            bg: 'bg-cyan-500/15',
            text: 'text-cyan-400',
            border: 'border-cyan-500/30',
            glow: 'from-cyan-500/15 to-transparent',
        },
        emerald: {
            bg: 'bg-emerald-500/15',
            text: 'text-emerald-400',
            border: 'border-emerald-500/30',
            glow: 'from-emerald-500/15 to-transparent',
        },
        amber: {
            bg: 'bg-amber-500/15',
            text: 'text-amber-400',
            border: 'border-amber-500/30',
            glow: 'from-amber-500/15 to-transparent',
        },
        rose: {
            bg: 'bg-rose-500/15',
            text: 'text-rose-400',
            border: 'border-rose-500/30',
            glow: 'from-rose-500/15 to-transparent',
        },
        sky: {
            bg: 'bg-sky-500/15',
            text: 'text-sky-400',
            border: 'border-sky-500/30',
            glow: 'from-sky-500/15 to-transparent',
        },
        violet: {
            bg: 'bg-blue-500/15',
            text: 'text-blue-400',
            border: 'border-blue-500/30',
            glow: 'from-blue-500/15 to-transparent',
        },
    };

    const scheme = colorSchemes[color] || colorSchemes.cyan;

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm shadow-slate-200/40 dark:shadow-none hover:shadow-md transition-all duration-200 ${className}`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${scheme.glow} rounded-bl-full pointer-events-none`} />

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {title}
                    </p>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                        {value}
                    </h4>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} ${scheme.border} border`}>
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>

            {change && (
                <div className="mt-4 flex items-center gap-2 text-xs">
                    <span
                        className={`inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full ${
                            trend === 'up'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                    >
                        {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {change}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">{period}</span>
                </div>
            )}
        </div>
    );
};

export default StatsCard;
