import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Shield,
    ShieldCheck,
    ShieldAlert,
    KeyRound,
    QrCode,
    Smartphone,
    Copy,
    Check,
    Lock,
    User,
    Mail,
    Calendar,
    Activity,
    Laptop,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    RefreshCw,
    Download,
    Eye,
    Key,
    ExternalLink
} from 'lucide-react';
import UserLayout from '../components/layouts/UserLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import StatsCard from '../components/common/StatsCard';
import Modal from '../components/common/Modal';
import SecurityGauge from '../components/common/SecurityGauge';
import OtpInput from '../components/common/OtpInput';
import { useToast } from '../components/common/ToastContext';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // 2FA state
    const [qrCode, setQrCode] = useState(null);
    const [secret, setSecret] = useState(null);
    const [verifyCode, setVerifyCode] = useState('');
    const [isProcessing2FA, setIsProcessing2FA] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [disableModalOpen, setDisableModalOpen] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const fetchUser = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch user', error);
            localStorage.removeItem('access_token');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Signed out securely.');
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('access_token');
            navigate('/login');
        }
    };

    const enable2FA = async () => {
        setIsProcessing2FA(true);
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post('/api/2fa/enable', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrCode(response.data.qr_code_svg);
            setSecret(response.data.secret);
            toast.info('QR Code generated! Scan with Google Authenticator.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate 2FA secret.');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const confirm2FA = async (e) => {
        e.preventDefault();
        if (verifyCode.length < 6) {
            toast.warning('Please enter all 6 digits.');
            return;
        }
        setIsProcessing2FA(true);
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('/api/2fa/confirm', { code: verifyCode }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Two-Factor Authentication is now fully active!');
            setQrCode(null);
            setSecret(null);
            setVerifyCode('');
            await fetchUser();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired 6-digit code.');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const disable2FA = async () => {
        setIsProcessing2FA(true);
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('/api/2fa/disable', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.warning('Two-Factor Authentication disabled.');
            setDisableModalOpen(false);
            await fetchUser();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to disable 2FA.');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const copySecretToClipboard = () => {
        if (secret) {
            navigator.clipboard.writeText(secret);
            setCopiedSecret(true);
            toast.success('Setup key copied to clipboard!');
            setTimeout(() => setCopiedSecret(false), 2500);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white gap-4 bg-grid-pattern">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-cyan-500/30" />
                <p className="text-sm text-slate-300 font-semibold tracking-wide">
                    Loading account details...
                </p>
            </div>
        );
    }

    const has2FAEnabled = user?.two_factor_secret && user?.two_factor_confirmed_at;

    return (
        <UserLayout
            user={user}
            onLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            <div className="space-y-8 animate-fade-in pb-12">
                {/* Security Score Gauge Header */}
                <SecurityGauge
                    score={has2FAEnabled ? 100 : 50}
                    has2FA={has2FAEnabled}
                    onFix={() => setActiveTab('security')}
                />

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <StatsCard
                                title="Security Rating"
                                value={has2FAEnabled ? 'Protected' : 'Action Needed'}
                                change={has2FAEnabled ? '100% Score' : 'Upgrade to 100%'}
                                trend={has2FAEnabled ? 'up' : 'down'}
                                icon={has2FAEnabled ? ShieldCheck : ShieldAlert}
                                color={has2FAEnabled ? 'emerald' : 'amber'}
                            />
                            <StatsCard
                                title="Account Status"
                                value="Verified"
                                change="Active"
                                trend="up"
                                period="Personal"
                                icon={User}
                                color="cyan"
                            />
                            <StatsCard
                                title="Two-Factor Auth"
                                value={has2FAEnabled ? 'Active' : 'Not Set'}
                                change={has2FAEnabled ? 'Secured' : 'Recommended'}
                                trend={has2FAEnabled ? 'up' : 'down'}
                                period="Google Auth"
                                icon={KeyRound}
                                color={has2FAEnabled ? 'emerald' : 'amber'}
                            />
                            <StatsCard
                                title="Session Security"
                                value="Protected"
                                change="Encrypted"
                                trend="up"
                                period="Current Device"
                                icon={Lock}
                                color="blue"
                            />
                        </div>

                        {/* Two Columns Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* User Identity Profile Card */}
                            <Card
                                title="Account Information"
                                subtitle="Personal account details and status"
                                className="lg:col-span-1"
                            >
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-white leading-tight">{user?.name}</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-400">Account ID:</span>
                                            <span className="font-mono text-cyan-300 font-bold">#{user?.id}</span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-400">Member Since:</span>
                                            <span className="text-slate-200">
                                                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recent'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-slate-400">2FA Protection:</span>
                                            <span>
                                                {has2FAEnabled ? (
                                                    <Badge variant="success" size="sm" dot>Active</Badge>
                                                ) : (
                                                    <Badge variant="warning" size="sm" dot>Disabled</Badge>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* 2FA & Quick Controls */}
                            <Card
                                title="Security & Authentication"
                                subtitle="Manage verification methods and login protection"
                                className="lg:col-span-2"
                            >
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-obsidian-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Login Verification
                                            </span>
                                            <p className="text-sm font-bold text-white">
                                                {has2FAEnabled ? 'Two-Step Verification' : 'Password Only'}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {has2FAEnabled ? 'Requires authenticator app code on login' : 'Add 2FA for extra defense against unauthorized access'}
                                            </p>
                                        </div>
                                        <div className="bg-obsidian-950/80 p-4 rounded-2xl border border-slate-800 space-y-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                Authenticator Support
                                            </span>
                                            <p className="text-sm font-bold text-white">Google Authenticator & Authy</p>
                                            <p className="text-xs text-slate-400">Compatible with all standard TOTP apps</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                                                <KeyRound className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-bold text-white">Two-Factor Authentication</h5>
                                                <p className="text-xs text-slate-300">
                                                    {has2FAEnabled ? '2FA is active and protecting your credentials.' : 'Enable two-factor authentication to secure your account.'}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={() => setActiveTab('security')}
                                            className="shrink-0"
                                        >
                                            {has2FAEnabled ? 'Manage 2FA' : 'Setup 2FA'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {/* SECURITY & 2FA TAB */}
                {activeTab === 'security' && (
                    <div className="space-y-6">
                        <Card
                            title="Two-Factor Authentication (TOTP)"
                            subtitle="Pair Google Authenticator, Authy, or 1Password to require 6-digit codes upon login."
                        >
                            <div className="space-y-6">
                                {/* Status Banner */}
                                <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                    has2FAEnabled
                                        ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                                        : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                                }`}>
                                    <div className="flex items-start gap-3.5">
                                        {has2FAEnabled ? (
                                            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                        ) : (
                                            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                                                <ShieldAlert className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-base font-bold text-white">
                                                {has2FAEnabled ? '2FA Authentication Active' : '2FA is Not Configured'}
                                            </h4>
                                            <p className="text-xs text-slate-300 mt-1">
                                                {has2FAEnabled
                                                    ? `Confirmed on ${new Date(user.two_factor_confirmed_at).toLocaleString()}`
                                                    : 'Your account is currently protected only by a single password.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        {has2FAEnabled ? (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => setDisableModalOpen(true)}
                                            >
                                                Disable 2FA
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                loading={isProcessing2FA}
                                                onClick={enable2FA}
                                                icon={QrCode}
                                            >
                                                Setup Authenticator
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* QR Code Setup flow with laser scanner animation */}
                                {qrCode && !has2FAEnabled && (
                                    <div className="p-6 bg-obsidian-950 border border-cyan-500/30 rounded-2xl space-y-6 animate-slide-up shadow-2xl">
                                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                                            <Smartphone className="w-4 h-4" />
                                            <span>Scan Authenticator QR Code</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                            {/* QR Code display with animated laser scan line */}
                                            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-xl relative overflow-hidden group">
                                                {/* Laser scan line effect */}
                                                <div className="scan-laser-line pointer-events-none" />

                                                <div
                                                    dangerouslySetInnerHTML={{ __html: qrCode }}
                                                    className="w-52 h-52 flex items-center justify-center relative z-10"
                                                />
                                                <p className="text-slate-900 text-xs font-bold mt-3 text-center">
                                                    Scan with Google Authenticator
                                                </p>
                                            </div>

                                            {/* Setup key and 6-box OTP input */}
                                            <div className="space-y-5">
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-bold text-white">Manual Setup Key</h4>
                                                    <p className="text-xs text-slate-400">
                                                        Can't scan the QR code? Enter this secret manually in your app:
                                                    </p>
                                                    <div className="flex items-center gap-2 bg-obsidian-900 border border-slate-700 p-2.5 rounded-xl font-mono text-xs text-cyan-300">
                                                        <span className="flex-1 break-all font-bold">{secret}</span>
                                                        <button
                                                            type="button"
                                                            onClick={copySecretToClipboard}
                                                            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                                                            title="Copy secret"
                                                        >
                                                            {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <form onSubmit={confirm2FA} className="space-y-4 pt-1">
                                                    <div className="space-y-2">
                                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                                                            Enter 6-Digit Code to Confirm
                                                        </label>
                                                        <OtpInput
                                                            value={verifyCode}
                                                            onChange={setVerifyCode}
                                                            length={6}
                                                            autoFocus
                                                        />
                                                    </div>

                                                    <Button
                                                        type="submit"
                                                        variant="primary"
                                                        loading={isProcessing2FA}
                                                        className="w-full shadow-cyan-500/25"
                                                        size="lg"
                                                        icon={ShieldCheck}
                                                    >
                                                        Confirm & Activate 2FA
                                                    </Button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <Card
                            title="Profile Information"
                            subtitle="View and manage your account details"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Full Name
                                    </label>
                                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white flex items-center gap-3">
                                        <User className="w-4 h-4 text-indigo-400" />
                                        <span>{user?.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-indigo-400" />
                                        <span>{user?.email}</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        User ID
                                    </label>
                                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-indigo-300 font-bold">
                                        USR-{user?.id?.toString().padStart(6, '0')}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        Member Since
                                    </label>
                                    <div className="p-3.5 bg-obsidian-950 border border-slate-800 rounded-xl text-sm text-slate-200 flex items-center gap-3 font-medium">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* SESSIONS TAB */}
                {activeTab === 'sessions' && (
                    <div className="space-y-6">
                        <Card
                            title="Active Logins & Devices"
                            subtitle="Manage devices currently signed into your account"
                        >
                            <div className="space-y-4">
                                <div className="p-4 bg-obsidian-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3.5">
                                        <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
                                            <Laptop className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-white">Current Browser Session</h4>
                                                <Badge variant="success" size="sm" dot>Active Now</Badge>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Desktop Browser &bull; Signed in securely
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Disable 2FA Modal */}
            <Modal
                isOpen={disableModalOpen}
                onClose={() => setDisableModalOpen(false)}
                title="Disable Two-Factor Authentication?"
                subtitle="Your account security level will be decreased."
            >
                <div className="space-y-5">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        Are you sure you want to disable 2FA? You will only need your password to sign in.
                    </p>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            onClick={() => setDisableModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            loading={isProcessing2FA}
                            onClick={disable2FA}
                        >
                            Yes, Disable 2FA
                        </Button>
                    </div>
                </div>
            </Modal>
        </UserLayout>
    );
};

export default Dashboard;
