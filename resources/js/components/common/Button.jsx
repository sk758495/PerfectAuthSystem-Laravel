import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    type = 'button',
    variant = 'primary', // primary | secondary | outline | danger | success | ghost | dark
    size = 'md', // sm | md | lg
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3.5 text-base gap-2.5 shadow-md',
    };

    const variantStyles = {
        primary: 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-blue-500/25 shadow-lg focus:ring-cyan-400 border border-cyan-400/20',
        secondary: 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 focus:ring-cyan-500 border border-slate-700/60 shadow-sm',
        outline: 'border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 focus:ring-cyan-400 bg-transparent',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/25 shadow-lg focus:ring-rose-500 border border-transparent',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25 shadow-lg focus:ring-emerald-500 border border-transparent',
        ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white focus:ring-cyan-400',
        dark: 'bg-obsidian-900 hover:bg-obsidian-850 text-white shadow-lg focus:ring-cyan-500 border border-slate-700/50',
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
            <span>{children}</span>
            {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </button>
    );
};

export default Button;
