import React from 'react';

const Badge = ({
    children,
    variant = 'neutral', // success | danger | warning | info | primary | neutral
    size = 'md', // sm | md
    dot = false,
    className = '',
}) => {
    const variantStyles = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
        danger: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
        warning: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
        info: 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
        primary: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
        neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    };

    const dotColors = {
        success: 'bg-emerald-500',
        danger: 'bg-rose-500',
        warning: 'bg-amber-500',
        info: 'bg-sky-500',
        primary: 'bg-indigo-500',
        neutral: 'bg-slate-400',
    };

    const sizeStyles = {
        sm: 'px-2 py-0.5 text-[10px] gap-1',
        md: 'px-2.5 py-1 text-xs gap-1.5',
    };

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
            )}
            {children}
        </span>
    );
};

export default Badge;
