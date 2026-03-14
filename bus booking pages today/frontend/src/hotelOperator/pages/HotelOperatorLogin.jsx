import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { loginHotelOperator } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';

const HotelOperatorLogin = () => {
    const navigate = useNavigate();
    const { login } = useHotelOperator();
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await loginHotelOperator(form);
            login(data.operator, data.token);
            navigate('/hotel-operator/dashboard');
        } catch (err) {
            setError(err?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-500">

                {/* Card */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-fuchsia-100 p-10 border border-fuchsia-50">

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-fuchsia-200">
                            <Hotel className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Hotel Operator</h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Portal Login</p>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-[#d84e55] rounded-2xl text-xs font-bold">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username / Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-fuchsia-500 transition-colors" />
                                <input type="text" required placeholder="your_username"
                                    value={form.username}
                                    onChange={e => setForm({ ...form, username: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-11 pr-5 text-sm font-medium outline-none focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-50 transition-all" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-fuchsia-500 transition-colors" />
                                <input type={showPwd ? 'text' : 'password'} required placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 pl-11 pr-12 text-sm font-medium outline-none focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-50 transition-all" />
                                <button type="button" onClick={() => setShowPwd(s => !s)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-fuchsia-500 transition-colors">
                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-fuchsia-200 disabled:opacity-60 mt-2">
                            {loading ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Signing In...</>
                            ) : (
                                <>Access Portal <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-6">
                        Contact admin for account access
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HotelOperatorLogin;
