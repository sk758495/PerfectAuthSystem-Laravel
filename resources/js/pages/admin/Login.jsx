import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, KeyRound } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/ToastContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/login', {
                email,
                password
            });

            if (response.data.requires_email_verification) {
                toast.warning('Please enter the OTP verification code sent to your email.');
                navigate('/admin/verify-otp', { state: { email: response.data.email } });
            } else {
                localStorage.setItem('admin_access_token', response.data.access_token);
                toast.success('Admin authentication successful! Welcome.');
                navigate('/admin/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Admin authentication failed. Please check credentials.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Administrator Sign In"
            subtitle="Access the management dashboard and system controls."
            badgeText="Admin Portal"
            isAdmin={true}
        >
            <form className="space-y-4" onSubmit={handleLogin}>
                <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                </div>

                <Input
                    label="Admin Email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@perfectauth.io"
                    icon={Mail}
                    autoFocus
                />

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

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        size="lg"
                        variant="primary"
                        icon={ArrowRight}
                        iconPosition="right"
                    >
                        {loading ? 'Signing in...' : 'Sign In as Admin'}
                    </Button>
                </div>

                <div className="text-center text-xs text-slate-400 pt-2">
                    <span>New administrator? </span>
                    <Link to="/admin/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Register admin account
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default AdminLogin;
