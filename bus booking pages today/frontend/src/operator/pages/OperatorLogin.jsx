import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { loginOperator } from '../../api/authApi';
import useOperator from '../../hooks/useOperator';

const OperatorLogin = () => {
    const navigate = useNavigate();
    const { operator, login } = useOperator();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await loginOperator(formData);

            // Clear any previous user/admin sessions
            localStorage.removeItem('token');
            localStorage.removeItem('userData');

            login(data.operator, data.token);
            navigate('/operator/dashboard');
        } catch (err) {
            setError(err.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-12 border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-[#d84e55] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/20">
                        <Bus className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-deep-navy uppercase tracking-tight">Operator Login</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">{error}</div>}

                    {operator && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Already Logged In</p>
                                <p className="text-xs font-bold text-deep-navy uppercase">Logged In</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/operator/dashboard')}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all"
                            >
                                Dashboard
                            </button>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@company.com"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#d84e55]/20 focus:bg-white rounded-[1.5rem] py-5 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-red-50 transition-all outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-[#d84e55]/20 focus:bg-white rounded-[1.5rem] py-5 pl-14 pr-14 text-sm font-bold focus:ring-4 focus:ring-red-50 transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d84e55] transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-deep-navy text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-[#d84e55] transition-all shadow-xl hover:shadow-red-500/20 active:scale-95 flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? 'Authenticating...' : 'Access Portal'}
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OperatorLogin;
