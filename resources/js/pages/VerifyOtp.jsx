import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import { KeyRound, ShieldCheck, Mail, ArrowLeft, AlertCircle, Inbox } from 'lucide-react';
import AuthLayout from '../components/layouts/AuthLayout';
import Button from '../components/common/Button';
import OtpInput from '../components/common/OtpInput';
import { useToast } from '../components/common/ToastContext';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const email = location.state?.email;

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    if (!email) {
        return <Navigate to="/login" />;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            toast.warning('Please enter all 6 digits of the code.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/api/otp/verify', {
                email,
                otp
            });

            if (response.data.requires_2fa) {
                toast.info('Email verified! Please enter your 2FA Authenticator code.');
                navigate('/login', {
                    state: {
                        requires_2fa: true,
                        temp_token: response.data.temp_token,
                        email
                    }
                });
            } else {
                localStorage.setItem('access_token', response.data.access_token);
                toast.success('Email verified successfully! Welcome to your dashboard.');
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid or expired verification code.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setResending(true);
        try {
            const response = await axios.post('/api/otp/resend', { email });
            toast.success(response.data.message || 'A new verification code has been sent.');
            setCountdown(60);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to resend code. Please try again.';
            toast.error(msg);
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout
            title="Verify Your Email"
            subtitle={`We sent a 6-digit verification code to ${email}.`}
            badgeText="Email Verification"
        >
            <form className="space-y-6 animate-slide-up" onSubmit={handleVerify}>
                <div className="flex justify-center my-1">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-950/60 animate-bounce">
                        <Mail className="w-8 h-8" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 text-center">
                        Enter 6-Digit Verification Code
                    </label>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        length={6}
                        autoFocus
                    />
                </div>

                {/* Spam Folder Notice Card */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/25 flex items-start gap-3 text-xs shadow-inner">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 leading-relaxed">
                        <span className="font-bold text-white block">
                            Can't find the email in your Inbox?
                        </span>
                        <p className="text-slate-300">
                            Please check your <strong>Spam</strong> or <strong>Junk</strong> folder. Sometimes one-time verification emails get redirected there by mail filters.
                        </p>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full shadow-cyan-500/25"
                        size="lg"
                        variant="primary"
                        icon={ShieldCheck}
                    >
                        {loading ? 'Verifying...' : 'Verify Code & Continue'}
                    </Button>

                    <div className="text-center text-xs">
                        <button
                            type="button"
                            disabled={countdown > 0 || resending}
                            onClick={handleResend}
                            className="font-bold text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {countdown > 0
                                ? `Resend code in ${countdown}s`
                                : resending
                                ? 'Sending code...'
                                : 'Resend Verification Code'}
                        </button>
                    </div>

                    <div className="pt-2 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
};

export default VerifyOtp;
