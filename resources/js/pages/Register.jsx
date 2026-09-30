import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PasswordChecklist from '../components/common/PasswordChecklist';
import { useToast } from '../components/common/ToastContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            toast.error('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('/api/register', formData);
            if (response.data.requires_email_verification) {
                toast.success('Account created! Please enter the 6-digit code sent to your email.');
                navigate('/verify-otp', { state: { email: response.data.email } });
            } else {
                localStorage.setItem('access_token', response.data.access_token);
                toast.success('Account registered successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Get started in seconds with modern authentication and two-step protection."
            badgeText="Get Started"
        >
            <form className="space-y-4" onSubmit={handleRegister}>
                <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    icon={User}
                    autoFocus
                />

                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                    icon={Mail}
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 8 characters"
                    icon={Lock}
                />

                {/* Interactive Password Checklist */}
                {formData.password && (
                    <PasswordChecklist password={formData.password} />
                )}

                <Input
                    label="Confirm Password"
                    name="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    icon={Lock}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full shadow-cyan-500/25"
                        size="lg"
                        icon={ArrowRight}
                        iconPosition="right"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </div>

                <div className="text-center text-xs text-slate-400 pt-1">
                    <span>Already registered? </span>
                    <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                        Sign in here
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
