import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Bus, ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2, X, Plus
} from 'lucide-react';
import { getOperatorBus, updateBus } from '../../api/busApi';

const AMENITY_OPTIONS = ['AC', 'WiFi', 'Charging', 'Blanket', 'Pillow', 'Water Bottle', 'TV', 'GPS', 'First Aid', 'CCTV'];
const BUS_TYPES = ['Sleeper', 'Seater', 'Sleeper + Seater'];

const EditBus = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        busName: '',
        busNumber: '',
        busType: 'Sleeper',
        totalSeats: '',
        amenities: [],
        status: 'Active',
    });

    // Fetch existing bus data on mount
    useEffect(() => {
        const fetchBus = async () => {
            try {
                setLoading(true);
                const data = await getOperatorBus(id);
                setForm({
                    busName: data.busName || '',
                    busNumber: data.busNumber || '',
                    busType: data.busType || 'Sleeper',
                    totalSeats: data.totalSeats?.toString() || '',
                    amenities: data.amenities || [],
                    status: data.status || 'Active',
                });
            } catch (err) {
                setError(err?.error || err?.message || 'Failed to load bus data');
            } finally {
                setLoading(false);
            }
        };
        fetchBus();
    }, [id]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleAmenity = (amenity) => {
        setForm(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!form.busName.trim()) return setError('Bus name is required');
        if (!form.busNumber.trim()) return setError('Bus number is required');
        if (!form.totalSeats || Number(form.totalSeats) < 1) return setError('Total seats must be at least 1');

        try {
            setSaving(true);
            await updateBus(id, {
                ...form,
                totalSeats: Number(form.totalSeats)
            });
            setSuccess('Bus updated successfully!');
            setTimeout(() => navigate('/operator/buses'), 1500);
        } catch (err) {
            setError(err?.error || err?.message || 'Update failed. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4 animate-pulse">
                <div className="w-14 h-14 bg-gray-100 rounded-3xl flex items-center justify-center">
                    <Bus className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Bus Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/operator/buses')}
                    className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all active:scale-90"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-[#1d2d44] uppercase tracking-tight">Edit Bus</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Update details for this bus unit</p>
                </div>
            </div>

            {/* Alert Messages */}
            {error && (
                <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm font-bold text-red-700">{error}</p>
                    <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            {success && (
                <div className="flex items-center gap-3 px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm font-bold text-emerald-700">{success}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">Basic Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bus Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bus Name *</label>
                            <input
                                type="text"
                                name="busName"
                                value={form.busName}
                                onChange={handleChange}
                                placeholder="e.g. Shivneri Express"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
                            />
                        </div>

                        {/* Bus Number */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bus Number / Plate *</label>
                            <input
                                type="text"
                                name="busNumber"
                                value={form.busNumber}
                                onChange={handleChange}
                                placeholder="e.g. MH12 AB 1234"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1d2d44] uppercase focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
                            />
                        </div>

                        {/* Bus Type */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Bus Type *</label>
                            <select
                                name="busType"
                                value={form.busType}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all appearance-none"
                            >
                                {BUS_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>

                        {/* Total Seats */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Seats *</label>
                            <input
                                type="number"
                                name="totalSeats"
                                value={form.totalSeats}
                                onChange={handleChange}
                                min={1}
                                max={100}
                                placeholder="e.g. 40"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</label>
                        <div className="flex gap-3">
                            {['Active', 'Inactive', 'Maintenance'].map(s => (
                                <button
                                    type="button"
                                    key={s}
                                    onClick={() => setForm(prev => ({ ...prev, status: s }))}
                                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                                    ${form.status === s
                                            ? s === 'Active' ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200/50'
                                                : s === 'Inactive' ? 'bg-gray-700 border-gray-700 text-white'
                                                    : 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-200/50'
                                            : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amenities</h3>
                        <span className="text-[10px] font-black text-[#d84e55]">{form.amenities.length} selected</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {AMENITY_OPTIONS.map(amenity => (
                            <button
                                type="button"
                                key={amenity}
                                onClick={() => toggleAmenity(amenity)}
                                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all
                                ${form.amenities.includes(amenity)
                                        ? 'bg-[#1d2d44] border-[#1d2d44] text-white shadow-md'
                                        : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-[#d84e55]/30 hover:bg-red-50/20'
                                    }`}
                            >
                                {form.amenities.includes(amenity)
                                    ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                    : <Plus className="h-4 w-4 flex-shrink-0 opacity-40" />
                                }
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate('/operator/buses')}
                        className="px-8 py-4 bg-white border border-gray-200 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-3 px-10 py-4 bg-[#d84e55] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-red-500/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Save Changes</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBus;
