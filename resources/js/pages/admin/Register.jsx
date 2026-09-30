import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/ToastContext';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
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
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/register', formData);
            toast.success('Admin account created! Please verify your OTP.');
            navigate('/admin/verify-otp', { state: { email: response.data.email } });
        } catch (err) {
            const msg = err.response?.data?.message || 'Admin registration failed. Check your inputs.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Admin Account"
            subtitle="Set up your administrator account with two-step email OTP verification."
            badgeText="Administrator"
            isAdmin={true}
        >
            <form className="space-y-3.5" onSubmit={handleRegister}>
                <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. System Admin"
                    icon={User}
                    autoFocus
                />

                <Input
                    label="Admin Email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@perfectauth.io"
                    icon={Mail}
                />

                <Input
                    label="Mobile Number"
                    name="mobile"
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 555-0199"
                    icon={Phone}
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 characters"
                    icon={Lock}
                />

                <Input
                    label="Confirm Password"
                    name="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    icon={Lock}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full"
                        size="lg"
                        icon={ArrowRight}
                        iconPosition="right"
                    >
                        {loading ? 'Creating account...' : 'Create Admin Account'}
                    </Button>
                </div>

                <div className="text-center text-xs text-slate-400 pt-1">
                    <span>Already an administrator? </span>
                    <Link to="/admin/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Sign in here
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default AdminRegister;
