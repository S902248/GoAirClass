import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Save, ShieldCheck } from 'lucide-react';
import { createRoute } from '../../api/routeApi';

const CreateRoute = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fromCity: '',
        toCity: '',
        distance: '',
        travelTime: '',
        status: 'Active'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createRoute(formData);
            navigate('/operator/routes');
        } catch (err) {
            alert(err.error || 'Failed to create route');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between shadow-sm bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/operator/routes')}
                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-deep-navy uppercase tracking-tight">Create Route</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Define a new transit path</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-3 bg-[#d84e55] text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-red-500/10 active:scale-95 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Creating...' : 'Save Route'}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50 space-y-10">
                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight">Route Configuration</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identify origin and destination</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput
                                    label="Origin City"
                                    value={formData.fromCity}
                                    onChange={v => setFormData({ ...formData, fromCity: v })}
                                    placeholder="e.g. Delhi"
                                />
                                <FormInput
                                    label="Destination City"
                                    value={formData.toCity}
                                    onChange={v => setFormData({ ...formData, toCity: v })}
                                    placeholder="e.g. Manali"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput
                                    label="Distance (KM)"
                                    type="number"
                                    value={formData.distance}
                                    onChange={v => setFormData({ ...formData, distance: v })}
                                    placeholder="530"
                                />
                                <FormInput
                                    label="Est. Travel Time"
                                    value={formData.travelTime}
                                    onChange={v => setFormData({ ...formData, travelTime: v })}
                                    placeholder="e.g. 12h 30m"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Route Status</label>
                                <div className="flex gap-4">
                                    {['Active', 'Inactive'].map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, status })}
                                            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.status === status
                                                ? (status === 'Active' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-red-500 bg-red-50 text-red-600')
                                                : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-[#0F172A] p-10 rounded-[3rem] shadow-2xl text-white">
                        <h3 className="text-xl font-black tracking-tight uppercase italic mb-8">Route Card</h3>

                        <div className="space-y-8">
                            <div className="relative">
                                <div className="absolute left-[1.1rem] top-8 bottom-8 w-0.5 bg-white/10"></div>
                                <div className="space-y-12">
                                    <div className="flex gap-6 relative">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                            <div className="w-3 h-3 bg-[#d84e55] rounded-full ring-4 ring-red-500/20"></div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Origin</p>
                                            <p className="text-lg font-black uppercase text-white tracking-widest">{formData.fromCity || '---'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 relative">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                            <div className="w-3 h-3 bg-indigo-500 rounded-full ring-4 ring-indigo-500/20"></div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Destination</p>
                                            <p className="text-lg font-black uppercase text-white tracking-widest">{formData.toCity || '---'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-3xl grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Distance</p>
                                    <p className="text-sm font-black text-white">{formData.distance ? `${formData.distance} KM` : '---'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Time</p>
                                    <p className="text-sm font-black text-white">{formData.travelTime || '---'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-tight">Active Route</p>
                            <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest leading-relaxed">Visible to all ticket agents once saved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-50 border-none rounded-[1.5rem] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-red-50/50 transition-all outline-none placeholder:text-gray-300"
        />
    </div>
);

export default CreateRoute;
