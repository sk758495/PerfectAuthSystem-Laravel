import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error,
    helperText,
    icon: Icon,
    className = '',
    maxLength,
    autoFocus,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wider text-slate-200">
                    {label} {required && <span className="text-rose-400 font-bold">*</span>}
                </label>
            )}
            <div className="relative rounded-xl shadow-sm">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    className={`block w-full rounded-xl border text-sm transition-all duration-200 placeholder-slate-500 bg-obsidian-900/90 border-slate-700/80 text-white ${
                        Icon ? 'pl-11' : 'pl-4'
                    } ${isPassword ? 'pr-11' : 'pr-4'} py-3 ${
                        error
                            ? 'border-rose-500 text-rose-100 focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500'
                            : 'focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400'
                    } disabled:bg-slate-800 disabled:text-slate-500 ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
            {error && (
                <p className="text-xs font-semibold text-rose-400 mt-1 flex items-center gap-1 animate-fade-in">
                    {error}
                </p>
            )}
            {!error && helperText && (
                <p className="text-xs text-slate-400 mt-1">{helperText}</p>
            )}
        </div>
    );
};

export default Input;

