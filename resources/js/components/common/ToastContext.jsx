import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg, dur) => addToast(msg, 'success', dur),
        error: (msg, dur) => addToast(msg, 'error', dur),
        info: (msg, dur) => addToast(msg, 'info', dur),
        warning: (msg, dur) => addToast(msg, 'warning', dur),
    };

    return (
        <ToastContext.Provider value={{ toast, addToast, removeToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map((t) => {
                    const isSuccess = t.type === 'success';
                    const isError = t.type === 'error';
                    const isWarning = t.type === 'warning';

                    return (
                        <div
                            key={t.id}
                            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-down ${
                                isSuccess
                                    ? 'bg-emerald-950/90 border-emerald-800 text-emerald-100'
                                    : isError
                                    ? 'bg-rose-950/90 border-rose-800 text-rose-100'
                                    : isWarning
                                    ? 'bg-amber-950/90 border-amber-800 text-amber-100'
                                    : 'bg-slate-900/90 border-slate-700 text-slate-100'
                            }`}
                        >
                            <div className="shrink-0 mt-0.5">
                                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-indigo-400" />}
                            </div>
                            <div className="flex-1 text-sm font-medium leading-5">
                                {t.message}
                            </div>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="shrink-0 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
};
