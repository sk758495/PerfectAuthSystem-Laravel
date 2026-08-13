import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 2FA state
    const [qrCode, setQrCode] = useState(null);
    const [secret, setSecret] = useState(null);
    const [verifyCode, setVerifyCode] = useState('');
    const [twoFactorMessage, setTwoFactorMessage] = useState('');
    const [twoFactorError, setTwoFactorError] = useState('');
    const [isProcessing2FA, setIsProcessing2FA] = useState(false);

    const navigate = useNavigate();

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
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('access_token');
            navigate('/login');
        }
    };

    const enable2FA = async () => {
        setIsProcessing2FA(true);
        setTwoFactorError('');
        setTwoFactorMessage('');
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.post('/api/2fa/enable', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrCode(response.data.qr_code_svg);
            setSecret(response.data.secret);
        } catch (err) {
            setTwoFactorError('Failed to generate 2FA secret.');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const confirm2FA = async (e) => {
        e.preventDefault();
        setIsProcessing2FA(true);
        setTwoFactorError('');
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('/api/2fa/confirm', { code: verifyCode }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTwoFactorMessage('Two-Factor Authentication is now enabled!');
            setQrCode(null);
            setSecret(null);
            setVerifyCode('');
            await fetchUser(); // Refresh user state to show it's confirmed
        } catch (err) {
            setTwoFactorError(err.response?.data?.message || 'Invalid code.');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    const disable2FA = async () => {
        setIsProcessing2FA(true);
        setTwoFactorError('');
        setTwoFactorMessage('');
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('/api/2fa/disable', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTwoFactorMessage('Two-Factor Authentication disabled.');
            await fetchUser();
        } catch (err) {
            setTwoFactorError('Failed to disable 2FA.');
        } finally {
            setIsProcessing2FA(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    const has2FAEnabled = user?.two_factor_secret && user?.two_factor_confirmed_at;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-indigo-600">Perfect Auth System</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-700 mr-4">Hi, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
                    {/* User Info Card */}
                    <div className="bg-white shadow rounded-lg p-6 border-t-4 border-indigo-500">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
                        <p className="text-gray-600">Email: {user?.email}</p>
                        {user?.mobile && <p className="text-gray-600">Mobile: {user?.mobile}</p>}
                    </div>

                    {/* 2FA Security Card */}
                    <div className="bg-white shadow rounded-lg p-6 border-t-4 border-green-500">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Security Settings</h3>
                        
                        {twoFactorMessage && (
                            <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-md text-sm">
                                {twoFactorMessage}
                            </div>
                        )}
                        {twoFactorError && (
                            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md text-sm">
                                {twoFactorError}
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-700 font-medium">Two-Factor Authentication (2FA)</p>
                                <p className="text-sm text-gray-500">
                                    {has2FAEnabled 
                                        ? '2FA is currently enabled on your account. Your account is highly secure.' 
                                        : 'Add an extra layer of security to your account using Google Authenticator.'}
                                </p>
                            </div>
                            <div>
                                {has2FAEnabled ? (
                                    <button
                                        onClick={disable2FA}
                                        disabled={isProcessing2FA}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Disable 2FA
                                    </button>
                                ) : (
                                    <button
                                        onClick={enable2FA}
                                        disabled={isProcessing2FA || qrCode !== null}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        Setup 2FA
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2FA Setup Flow */}
                        {qrCode && !has2FAEnabled && (
                            <div className="mt-8 border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Configure Authenticator App</h4>
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div dangerouslySetInnerHTML={{ __html: qrCode }} className="w-48 h-48" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <p className="text-sm text-gray-600">
                                            1. Scan this QR code with your Google Authenticator app.<br/>
                                            2. Or enter this setup key manually: <strong className="font-mono bg-gray-100 px-2 py-1 rounded">{secret}</strong>
                                        </p>
                                        <form onSubmit={confirm2FA} className="flex gap-4">
                                            <input
                                                type="text"
                                                value={verifyCode}
                                                onChange={(e) => setVerifyCode(e.target.value)}
                                                placeholder="Enter 6-digit code"
                                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                                maxLength="6"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={isProcessing2FA}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Verify
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
