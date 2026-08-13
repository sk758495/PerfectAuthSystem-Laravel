import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdmin = async () => {
            const token = localStorage.getItem('admin_access_token');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const response = await axios.get('/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAdmin(response.data.admin);
            } catch (error) {
                console.error('Failed to fetch admin', error);
                localStorage.removeItem('admin_access_token');
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem('admin_access_token');
        try {
            await axios.post('/api/admin/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('admin_access_token');
            navigate('/admin/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-xl text-gray-400">Loading Admin Portal...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 font-sans text-gray-100">
            <nav className="bg-gray-900 shadow-sm border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-blue-500">Perfect Auth Admin</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-300 mr-4">Hi, Administrator {admin?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                Secure Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-700 rounded-lg h-96 flex flex-col items-center justify-center bg-gray-900 shadow-inner">
                            <h2 className="text-3xl font-bold text-gray-100 mb-4">Admin Control Panel</h2>
                            <p className="text-gray-400 text-lg">Admin Email: {admin?.email}</p>
                            {admin?.mobile && <p className="text-gray-400 text-lg">Admin Mobile: {admin?.mobile}</p>}
                            <p className="mt-8 text-blue-400 font-medium">OTP Verified & Secure Session Active</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
