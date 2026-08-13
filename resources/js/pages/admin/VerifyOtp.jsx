import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        return <Navigate to="/admin/login" />;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            const response = await axios.post('/api/admin/otp/verify', {
                email,
                otp
            });
            localStorage.setItem('admin_access_token', response.data.access_token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        try {
            const response = await axios.post('/api/admin/otp/resend', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl border border-gray-700">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Verify OTP
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        An OTP has been sent to {email}.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                    {error && (
                        <div className="bg-red-900/50 text-red-400 p-3 rounded-md text-sm text-center border border-red-800">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-900/50 text-green-400 p-3 rounded-md text-sm text-center border border-green-800">
                            {message}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center tracking-widest text-lg"
                                placeholder="Enter 6-digit OTP"
                                maxLength="6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm mt-4">
                    <button 
                        onClick={handleResend} 
                        className="font-medium text-blue-400 hover:text-blue-300 bg-transparent border-none cursor-pointer"
                    >
                        Didn't receive code? Resend OTP
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
