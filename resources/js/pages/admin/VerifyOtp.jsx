import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, RefreshCw, ArrowRight, AlertCircle } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Button from '../../components/common/Button';
import OtpInput from '../../components/common/OtpInput';
import { useToast } from '../../components/common/ToastContext';

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
        return <Navigate to="/admin/login" />;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length < 6) {
            toast.warning('Please enter all 6 digits of the OTP.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/otp/verify', {
                email,
                otp
            });
            localStorage.setItem('admin_access_token', response.data.access_token);
            toast.success('Admin OTP verified! Access granted.');
            navigate('/admin/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Verification failed. Invalid or expired OTP.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;
        setResending(true);
        try {
            const response = await axios.post('/api/admin/otp/resend', { email });
            toast.success(response.data.message || 'New OTP has been dispatched.');
            setCountdown(60);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to resend OTP.';
            toast.error(msg);
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout
            title="Enter Verification Code"
            subtitle={`We sent a 6-digit security code to ${email}.`}
            badgeText="Two-Step Verification"
            isAdmin={true}
        >
            <form className="space-y-6 animate-slide-up" onSubmit={handleVerify}>
                <div className="flex justify-center my-1">
                    <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-xl shadow-blue-950/60 animate-bounce">
                        <KeyRound className="w-8 h-8" />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 text-center">
                        Enter 6-Digit Code
                    </label>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        length={6}
                        autoFocus
                    />
                </div>

                {/* Spam Folder Notice Card */}
                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/25 flex items-start gap-3 text-xs shadow-inner">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 leading-relaxed">
                        <span className="font-bold text-white block">
                            Can't find the email in your Inbox?
                        </span>
                        <p className="text-slate-300">
                            Please check your <strong>Spam</strong> or <strong>Junk</strong> folder. Sometimes one-time codes get filtered there by mail providers.
                        </p>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full shadow-blue-500/30"
                        size="lg"
                        variant="primary"
                        icon={ShieldCheck}
                    >
                        {loading ? 'Verifying...' : 'Verify Code & Sign In'}
                    </Button>

                    <div className="text-center text-xs">
                        <button
                            type="button"
                            disabled={countdown > 0 || resending}
                            onClick={handleResend}
                            className="font-bold text-blue-400 hover:text-blue-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {countdown > 0
                                ? `Resend OTP in ${countdown}s`
                                : resending
                                ? 'Dispatching...'
                                : 'Resend OTP Code'}
                        </button>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
};

export default VerifyOtp;
