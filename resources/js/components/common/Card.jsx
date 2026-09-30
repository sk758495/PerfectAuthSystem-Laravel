import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    action,
    footer,
    className = '',
    headerClassName = '',
    bodyClassName = '',
    variant = 'default', // default | glass | dark | gradient
    ...props
}) => {
    const variantStyles = {
        default: 'bg-slate-900/90 backdrop-blur-md border border-slate-800 text-white shadow-xl shadow-slate-950/40',
        glass: 'glass-panel-dark text-white shadow-xl shadow-slate-950/50',
        dark: 'bg-slate-900 border border-slate-800 text-white shadow-2xl shadow-black/40',
        gradient: 'bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 text-white shadow-xl shadow-indigo-950/30',
    };

    return (
        <div
            className={`rounded-2xl transition-all duration-200 ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {(title || subtitle || action) && (
                <div className={`p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4 ${headerClassName}`}>
                    <div>
                        {title && <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
                        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
                    </div>
                    {action && <div className="shrink-0">{action}</div>}
                </div>
            )}
            <div className={`p-6 ${bodyClassName}`}>
                {children}
            </div>
            {footer && (
                <div className="p-4 bg-slate-50/75 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 rounded-b-2xl">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
