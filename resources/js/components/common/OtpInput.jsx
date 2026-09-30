import React, { useRef, useEffect } from 'react';

const OtpInput = ({
    value = '',
    onChange,
    length = 6,
    disabled = false,
    autoFocus = true,
    error = false,
}) => {
    const inputsRef = useRef([]);

    // Split value into array of digits
    const digits = Array.from({ length }, (_, i) => value[i] || '');

    useEffect(() => {
        if (autoFocus && inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (e, index) => {
        const val = e.target.value.replace(/\D/g, ''); // numbers only
        if (!val) {
            // cleared
            const newDigits = [...digits];
            newDigits[index] = '';
            onChange(newDigits.join(''));
            return;
        }

        // If multiple digits pasted
        if (val.length > 1) {
            const pastedDigits = val.slice(0, length);
            onChange(pastedDigits);
            const focusIdx = Math.min(pastedDigits.length, length - 1);
            inputsRef.current[focusIdx]?.focus();
            return;
        }

        const newDigits = [...digits];
        newDigits[index] = val[val.length - 1];
        onChange(newDigits.join(''));

        // Focus next input
        if (index < length - 1 && val) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!digits[index] && index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputsRef.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (pastedData) {
            onChange(pastedData);
            const focusIdx = Math.min(pastedData.length, length - 1);
            inputsRef.current[focusIdx]?.focus();
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
                <input
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={disabled}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-black font-mono rounded-xl border transition-all duration-200 focus:outline-none ${
                        digit
                            ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md shadow-cyan-500/20 scale-105'
                            : 'border-slate-700 bg-obsidian-900/90 text-white hover:border-slate-600'
                    } ${
                        error ? 'border-rose-500 bg-rose-950/30 text-rose-300' : 'focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30'
                    }`}
                />
            ))}
        </div>
    );
};

export default OtpInput;
