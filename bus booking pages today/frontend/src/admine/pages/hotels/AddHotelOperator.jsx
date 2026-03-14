import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User, Phone, Mail, Building, MapPin, Lock,
    Eye, EyeOff, CheckSquare, Square, ArrowLeft,
    CheckCircle, AlertCircle, UserCog
} from 'lucide-react';
import { createHotelOperator } from '../../../api/hotelApi';


/* ── tiny helpers ──────────────────────────────────────────────────────────── */
const Input = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, rightElement, error }) => (
    <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">{label}{required && <span className="text-[#d84e55] ml-0.5">*</span>}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />}
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-gray-50 border-2 rounded-xl py-3 text-sm font-medium outline-none transition-all
                    ${Icon ? 'pl-11 pr-5' : 'px-5'}
                    ${rightElement ? 'pr-12' : ''}
                    ${error ? 'border-[#d84e55] focus:ring-2 focus:ring-red-100' : 'border-transparent focus:border-[#d84e55] focus:ring-2 focus:ring-red-50'}`}
            />
            {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>}
        </div>
        {error && <p className="text-[10px] font-bold text-[#d84e55] flex items-center gap-1"><AlertCircle className="h-3 w-3" />{error}</p>}
    </div>
);

const SectionCard = ({ title, children, color = 'bg-[#d84e55]' }) => (
    <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden">
        <div className={`${color} px-6 py-3`}>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">{title}</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
);

const PERMISSIONS = [
    'Add Hotel', 'Manage Hotels', 'Add Rooms',
    'Manage Rooms', 'View Bookings', 'Update Room Prices'
];

/* ── main page ─────────────────────────────────────────────────────────────── */
const AddHotelOperator = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', phone: '', email: '',
        companyName: '', city: '', address: '',
        username: '', password: '', confirmPassword: '',
        role: 'hotel_operator',
        permissions: [],
        status: 'Active',
    });

    const [errors, setErrors] = useState({});
    const [showPwd, setShowPwd] = useState(false);
    const [showCPwd, setShowCPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null); // { type:'success'|'error', msg }

    const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }));

    const togglePermission = (perm) => {
        setForm(f => ({
            ...f,
            permissions: f.permissions.includes(perm)
                ? f.permissions.filter(p => p !== perm)
                : [...f.permissions, perm]
        }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required';
        if (!form.phone.trim()) e.phone = 'Phone number is required';
        if (!form.email.trim()) e.email = 'Email is required';
        if (!form.username.trim()) e.username = 'Username is required';
        if (!form.password) e.password = 'Password is required';
        if (form.password !== form.confirmPassword)
            e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const { confirmPassword, ...payload } = form;
            await createHotelOperator(payload);
            setToast({ type: 'success', msg: 'Hotel Operator created successfully!' });
            setTimeout(() => navigate('/admine/hotels/operators'), 1800);
        } catch (err) {
            setToast({ type: 'error', msg: err?.response?.data?.error || 'Failed to create operator. Please try again.' });
        } finally {
            setLoading(false);
            setTimeout(() => setToast(null), 4000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-black text-sm
                    ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-[#d84e55] text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)}
                    className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:text-[#d84e55] transition-all shadow-sm">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Add Hotel Operator</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Create a new hotel operator account</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 1 — Personal Details */}
                <SectionCard title="Personal Details" color="bg-indigo-500">
                    <Input label="Full Name" icon={User} value={form.name} onChange={set('name')}
                        placeholder="e.g. Rahul Sharma" required error={errors.name} />
                    <Input label="Phone Number" icon={Phone} type="tel" value={form.phone} onChange={set('phone')}
                        placeholder="e.g. +91 98765 43210" required error={errors.phone} />
                    <div className="md:col-span-2">
                        <Input label="Email Address" icon={Mail} type="email" value={form.email} onChange={set('email')}
                            placeholder="e.g. rahul@grandhotel.com" required error={errors.email} />
                    </div>
                </SectionCard>

                {/* 2 — Business Details */}
                <SectionCard title="Business Details" color="bg-fuchsia-500">
                    <Input label="Company Name" icon={Building} value={form.companyName} onChange={set('companyName')}
                        placeholder="e.g. Grand Hotels Pvt Ltd" />
                    <Input label="City" icon={MapPin} value={form.city} onChange={set('city')}
                        placeholder="e.g. Mumbai" />
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">Address</label>
                        <textarea value={form.address} onChange={e => set('address')(e.target.value)} rows={3}
                            placeholder="Full business address..."
                            className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 px-5 text-sm font-medium outline-none transition-all focus:border-[#d84e55] focus:ring-2 focus:ring-red-50 resize-none" />
                    </div>
                </SectionCard>

                {/* 3 — Login Details */}
                <SectionCard title="Login Details" color="bg-[#d84e55]">
                    <div className="md:col-span-2">
                        <Input label="Username" icon={User} value={form.username} onChange={set('username')}
                            placeholder="e.g. rahul_hotels" required error={errors.username} />
                    </div>
                    <Input label="Password" icon={Lock} type={showPwd ? 'text' : 'password'} value={form.password}
                        onChange={set('password')} placeholder="••••••••" required error={errors.password}
                        rightElement={
                            <button type="button" onClick={() => setShowPwd(s => !s)}
                                className="text-gray-300 hover:text-[#d84e55] transition-colors">
                                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        }
                    />
                    <Input label="Confirm Password" icon={Lock} type={showCPwd ? 'text' : 'password'} value={form.confirmPassword}
                        onChange={set('confirmPassword')} placeholder="••••••••" required error={errors.confirmPassword}
                        rightElement={
                            <button type="button" onClick={() => setShowCPwd(s => !s)}
                                className="text-gray-300 hover:text-[#d84e55] transition-colors">
                                {showCPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        }
                    />
                </SectionCard>

                {/* 4 & 5 — Role + Permissions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role */}
                    <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden">
                        <div className="bg-amber-500 px-6 py-3">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Role</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">Assign Role</label>
                            <div className="relative">
                                <UserCog className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
                                <select value={form.role} onChange={e => set('role')(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 pl-11 pr-5 text-sm font-bold outline-none focus:border-[#d84e55] appearance-none cursor-pointer">
                                    <option value="hotel_operator">Hotel Operator</option>
                                    <option value="hotel_manager">Hotel Manager</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden">
                        <div className="bg-emerald-500 px-6 py-3">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Account Status</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            {['Active', 'Inactive'].map(s => (
                                <label key={s} onClick={() => set('status')(s)}
                                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all
                                        ${form.status === s
                                            ? 'border-[#d84e55] bg-red-50'
                                            : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                        ${form.status === s ? 'border-[#d84e55]' : 'border-gray-300'}`}>
                                        {form.status === s && <div className="w-2 h-2 rounded-full bg-[#d84e55]" />}
                                    </div>
                                    <span className={`text-sm font-black uppercase tracking-wider
                                        ${form.status === s ? 'text-[#d84e55]' : 'text-gray-500'}`}>{s}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5 — Permissions */}
                <div className="bg-white rounded-[1.5rem] border border-gray-50 shadow-sm overflow-hidden">
                    <div className="bg-slate-600 px-6 py-3">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Permissions</h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {PERMISSIONS.map(perm => {
                            const checked = form.permissions.includes(perm);
                            return (
                                <button key={perm} type="button" onClick={() => togglePermission(perm)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                                        ${checked
                                            ? 'border-[#d84e55] bg-red-50 text-[#d84e55]'
                                            : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                    {checked
                                        ? <CheckSquare className="h-4 w-4 flex-shrink-0" />
                                        : <Square className="h-4 w-4 flex-shrink-0" />}
                                    <span className="text-xs font-black uppercase tracking-wider">{perm}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4 pb-8">
                    <button type="button" onClick={() => navigate(-1)}
                        className="flex-1 py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 text-sm font-black uppercase tracking-widest hover:border-gray-300 hover:text-gray-700 transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="flex-1 py-4 rounded-2xl bg-[#d84e55] text-white text-sm font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-xl shadow-red-100 disabled:opacity-60 flex items-center justify-center gap-2">
                        {loading
                            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating...</>
                            : <><User className="h-4 w-4" />Create Operator</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddHotelOperator;
