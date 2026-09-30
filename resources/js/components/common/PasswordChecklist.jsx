import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordChecklist = ({ password = '' }) => {
    const rules = [
        { label: 'At least 8 characters', valid: password.length >= 8 },
        { label: 'Contains uppercase letter', valid: /[A-Z]/.test(password) },
        { label: 'Contains a number', valid: /[0-9]/.test(password) },
        { label: 'Contains a special symbol', valid: /[^A-Za-z0-9]/.test(password) },
    ];

    const totalValid = rules.filter((r) => r.valid).length;

    return (
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Security Requirements</span>
                <span className={`font-bold ${
                    totalValid === 4 ? 'text-emerald-400' : totalValid >= 2 ? 'text-amber-400' : 'text-slate-500'
                }`}>
                    {totalValid} of 4 Met
                </span>
            </div>

            {/* Progress bar */}
            <div className="grid grid-cols-4 gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                            step <= totalValid
                                ? totalValid === 4
                                    ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                                    : totalValid >= 2
                                    ? 'bg-indigo-500'
                                    : 'bg-rose-500'
                                : 'bg-slate-800'
                        }`}
                    />
                ))}
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                {rules.map((rule, idx) => (
                    <div
                        key={idx}
                        className={`flex items-center gap-1.5 transition-colors duration-200 ${
                            rule.valid ? 'text-emerald-300 font-medium' : 'text-slate-500'
                        }`}
                    >
                        <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                                rule.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'
                            }`}
                        >
                            {rule.valid ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <X className="w-2.5 h-2.5" />}
                        </div>
                        <span>{rule.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordChecklist;
