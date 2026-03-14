import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { adminRequest } from '../api/adminApi';

const AdminAccessRequest = ({ user }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        mobileNumber: user?.mobile || '',
        email: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await adminRequest(formData);
            setSubmitted(true);
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-[40px] p-10 shadow-xl text-center border border-gray-100">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-black text-deep-navy uppercase mb-4">Request Submitted!</h2>
                    <p className="text-gray-500 font-bold text-xs uppercase leading-relaxed mb-8">
                        Your request for admin access has been sent to the Super Admin. You will be notified once it's reviewed.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl border border-gray-100"
                    >
                        Redirecting to Home...
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gray-50">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100">
                    <div className="p-10 md:p-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-deep-navy uppercase tracking-tight">Admin Access Request</h1>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Apply for administrative privileges</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100">
                                <p className="text-[10px] font-black text-red-500 uppercase text-center">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-600 outline-none transition-all"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Mobile Number</label>
                                    <div className="relative group opacity-60">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                        <input
                                            readOnly
                                            type="text"
                                            value={formData.mobileNumber}
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-100 rounded-2xl text-xs font-black cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-600 outline-none transition-all"
                                        placeholder="yourname@company.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Requested Username</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-600 outline-none transition-all"
                                            placeholder="Choose username"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Admin Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                                        <input
                                            required
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-600 outline-none transition-all"
                                            placeholder="Set password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-8 py-4 bg-deep-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'SUBMITTING...' : (
                                    <>
                                        Submit Request <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>

                            <p className="text-[8px] font-bold text-gray-400 text-center uppercase leading-relaxed px-10">
                                By submitting this request, you agree to follow the platform's security guidelines and administrative protocols.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAccessRequest;
