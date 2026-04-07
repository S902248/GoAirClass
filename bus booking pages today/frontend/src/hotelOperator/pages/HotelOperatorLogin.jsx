import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, LayoutDashboard } from 'lucide-react';
import { loginHotelOperator } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';

const HotelOperatorLogin = () => {
    const navigate = useNavigate();
    const { login, operator } = useHotelOperator();
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
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 font-inter">
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-10 relative overflow-hidden">

                {/* Decorative Glows */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#d84e55]/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header Icon */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#d84e55] p-5 rounded-2xl shadow-[0_8px_20px_rgba(216,78,85,0.3)] relative z-10">
                        <Hotel className="h-7 w-7 text-white" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-[#0f172a] text-center mb-2 tracking-tight uppercase relative z-10">
                    Operator Login
                </h1>
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 relative z-10">
                    Hotel Partner Portal
                </p>

                {/* Already Logged In Banner */}
                {operator && (
                    <div className="bg-[#ecfdf5] border border-[#10b981]/20 rounded-2xl p-4 mb-8 flex items-center justify-between animate-in fade-in slide-in-from-top-4 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-[#059669] uppercase tracking-widest mb-1">Already logged in</p>
                            <p className="text-sm font-bold text-[#065f46]">LOGGED IN</p>
                        </div>
                        <button
                            onClick={() => navigate('/hotel-operator/dashboard')}
                            className="bg-[#10b981] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all shadow-md flex items-center gap-1.5"
                        >
                            <LayoutDashboard className="h-3 w-3" />
                            Dashboard
                        </button>
                    </div>
                )}

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 text-[#d84e55] rounded-2xl text-xs font-bold border border-red-100 relative z-10">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    {/* Username / Email Field */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Work Email
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#d84e55] transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="text"
                                required
                                placeholder="name@company.com"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                className="w-full bg-[#f8fafc] border-2 border-transparent focus:border-[#d84e55]/20 focus:bg-white pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#d84e55] transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                required
                                placeholder="••••••••"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-[#f8fafc] border-2 border-transparent focus:border-[#d84e55]/20 focus:bg-white pl-12 pr-12 py-4 rounded-2xl outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(s => !s)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0f172a] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#1e293b] hover:gap-5 transition-all shadow-[0_10px_30px_rgba(15,23,42,0.2)] active:scale-[0.98] mt-4 disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                SIGNING IN...
                            </>
                        ) : (
                            <>ACCESS PORTAL <ArrowRight size={16} /></>
                        )}
                    </button>
                </form>

                <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-8 relative z-10">
                    Contact admin for account access
                </p>
            </div>
        </div>
    );
};

export default HotelOperatorLogin;
