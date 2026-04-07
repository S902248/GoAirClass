import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { adminLogin } from '../api/authApi';

const AdminLogin = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await adminLogin(formData);
            if (response.success) {
                // Clear any previous operator/admin sessions
                localStorage.removeItem('operatorToken');
                localStorage.removeItem('operatorData');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('token');

                localStorage.setItem('token', response.token);
                localStorage.setItem('userData', JSON.stringify(response.user));
                onLoginSuccess(response.user);
                navigate('/admine');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#fafafa]">
            <div className="max-w-md w-full">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-[#d84e55] rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-200">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">Admin Login</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Enter your administrative credentials</p>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                            <p className="text-[10px] font-black text-red-500 uppercase">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                                <input
                                    required
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                                <input
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 py-4 bg-deep-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'AUTHENTICATING...' : (
                                <>
                                    Secure Login <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    This is a secure area. Authorized access only.<br />
                    All activities are logged and monitored.
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
