import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, ArrowRight, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import OtpInput from '../components/common/OtpInput';
import { useToast } from '../components/common/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // 2FA state
    const [requires2FA, setRequires2FA] = useState(false);
    const [tempToken, setTempToken] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    useEffect(() => {
        if (location.state?.requires_2fa && location.state?.temp_token) {
            setRequires2FA(true);
            setTempToken(location.state.temp_token);
            if (location.state?.email) {
                setEmail(location.state.email);
            }
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/login', {
                email,
                password
            });
            
            if (response.data.requires_email_verification) {
                toast.warning('Your email is not verified yet. Please enter the OTP code.');
                navigate('/verify-otp', { state: { email: response.data.email } });
            } else if (response.data.requires_2fa) {
                setRequires2FA(true);
                setTempToken(response.data.temp_token);
                toast.info('Enter the 6-digit code from your Authenticator app.');
            } else {
                localStorage.setItem('access_token', response.data.access_token);
                toast.success('Welcome back!');
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials. Please verify your email and password.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handle2FASubmit = async (e) => {
        e.preventDefault();
        if (twoFactorCode.length < 6) {
            toast.warning('Please input full 6-digit verification code.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/api/login/2fa', {
                temp_token: tempToken,
                code: twoFactorCode
            });
            localStorage.setItem('access_token', response.data.access_token);
            toast.success('Two-factor verification passed!');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid or expired TOTP code.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={requires2FA ? 'Two-Factor Verification' : 'Welcome Back'}
            subtitle={
                requires2FA
                    ? 'Enter the 6-digit code from your authenticator app.'
                    : 'Sign in to access your account and dashboard.'
            }
            badgeText="Secure Sign-In"
        >
            {!requires2FA ? (
                <form className="space-y-4 animate-fade-in" onSubmit={handleLogin}>
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        icon={Mail}
                        autoFocus
                    />

                    <div className="space-y-1">
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            icon={Lock}
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full shadow-cyan-500/25"
                            size="lg"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </div>

                    <div className="pt-2 text-center text-xs text-slate-400">
                        <span>Don't have an account? </span>
                        <Link to="/register" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                            Create account
                        </Link>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-obsidian-900 px-3 text-slate-500 font-bold tracking-widest">
                                Portal
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/admin/login"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-800/80 border border-slate-800"
                        >
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            <span>Administrator Sign In</span>
                        </Link>
                    </div>
                </form>
            ) : (
                <form className="space-y-6 animate-slide-up" onSubmit={handle2FASubmit}>
                    <div className="flex justify-center my-1">
                        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-950/60 animate-bounce">
                            <KeyRound className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 text-center">
                            Enter 6-Digit Authenticator Code
                        </label>
                        <OtpInput
                            value={twoFactorCode}
                            onChange={setTwoFactorCode}
                            length={6}
                            autoFocus
                        />
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
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setRequires2FA(false)}
                            className="w-full text-xs font-semibold text-slate-400 hover:text-white text-center py-2 transition-colors cursor-pointer"
                        >
                            &larr; Back to sign in
                        </button>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
};

export default Login;
