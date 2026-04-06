import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, CheckCircle2, AlertCircle, Loader2, X,
    MapPin, Navigation2, Clock, ArrowRight
} from 'lucide-react';
import { getRoute, updateRoute, getAllRoutes } from '../../api/routeApi';

const STATUS_OPTIONS = ['Active', 'Inactive'];

const EditRoute = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [cityOptions, setCityOptions] = useState([]);

    const [form, setForm] = useState({
        fromCity: '',
        toCity: '',
        distance: '',
        travelTime: '',
        status: 'Active',
    });

    // Pre-fetch existing route data + all routes for city dropdown
    useEffect(() => {
        const fetchRouteData = async () => {
            try {
                setLoading(true);
                const [data, allRoutes] = await Promise.all([getRoute(id), getAllRoutes()]);

                // Build unique sorted city list from all routes
                const cities = new Set();
                allRoutes.forEach(r => {
                    if (r.fromCity) cities.add(r.fromCity.trim());
                    if (r.toCity) cities.add(r.toCity.trim());
                });
                // Always include the current route's cities
                if (data.fromCity) cities.add(data.fromCity.trim());
                if (data.toCity) cities.add(data.toCity.trim());

                setCityOptions([...cities].sort());

                setForm({
                    fromCity: data.fromCity || '',
                    toCity: data.toCity || '',
                    distance: data.distance || '',
                    travelTime: data.travelTime || '',
                    status: data.status || 'Active',
                });
            } catch (err) {
                setError(err?.error || err?.message || 'Failed to load route data');
            } finally {
                setLoading(false);
            }
        };
        fetchRouteData();
    }, [id]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!form.fromCity.trim()) return setError('From City is required');
        if (!form.toCity.trim()) return setError('To City is required');
        if (!form.distance) return setError('Distance is required');
        if (!form.travelTime.trim()) return setError('Travel Time is required');

        try {
            setSaving(true);
            await updateRoute(id, form);
            setSuccess('Route updated successfully!');
            setTimeout(() => navigate('/operator/routes'), 1500);
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
                    <Navigation2 className="h-7 w-7 text-gray-300" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Route Data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/operator/routes')}
                    className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-all active:scale-90"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-[#1d2d44] uppercase tracking-tight">Edit Route</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        Update transit path details
                    </p>
                </div>
            </div>

            {/* Route Preview Badge */}
            {(form.fromCity || form.toCity) && (
                <div className="flex items-center gap-3 px-6 py-4 bg-[#1d2d44] rounded-2xl text-white shadow-xl shadow-[#1d2d44]/20">
                    <MapPin className="h-4 w-4 text-blue-300 flex-shrink-0" />
                    <span className="text-sm font-black uppercase tracking-tight">{form.fromCity || '—'}</span>
                    <ArrowRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-black uppercase tracking-tight">{form.toCity || '—'}</span>
                    <div className="ml-auto flex items-center gap-4 text-[10px] font-black text-blue-200 uppercase tracking-widest">
                        {form.distance && <span>{form.distance} KM</span>}
                        {form.travelTime && <span>· {form.travelTime}</span>}
                    </div>
                </div>
            )}

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

                {/* Cities */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#d84e55]" />
                        Route Endpoints
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* From City */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-[#d84e55] rounded-full inline-block" />
                                From City *
                            </label>
                            <select
                                name="fromCity"
                                value={form.fromCity}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer uppercase"
                            >
                                <option value="">— Select City —</option>
                                {cityOptions.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* To City */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-[#1d2d44] rounded-full inline-block" />
                                To City *
                            </label>
                            <select
                                name="toCity"
                                value={form.toCity}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all appearance-none cursor-pointer uppercase"
                            >
                                <option value="">— Select City —</option>
                                {cityOptions.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transit Metrics */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-2">
                        <Navigation2 className="h-3.5 w-3.5 text-indigo-500" />
                        Transit Metrics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Distance */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                Distance (KM) *
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="distance"
                                    value={form.distance}
                                    onChange={handleChange}
                                    min={1}
                                    placeholder="e.g. 180"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-14 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">KM</span>
                            </div>
                        </div>

                        {/* Travel Time */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                Travel Time *
                            </label>
                            <input
                                type="text"
                                name="travelTime"
                                value={form.travelTime}
                                onChange={handleChange}
                                placeholder="e.g. 3h 30m"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 space-y-4">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">
                        Route Status
                    </h3>
                    <div className="flex gap-3">
                        {STATUS_OPTIONS.map(s => (
                            <button
                                type="button"
                                key={s}
                                onClick={() => setForm(prev => ({ ...prev, status: s }))}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all
                                ${form.status === s
                                        ? s === 'Active'
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200/50'
                                            : 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200/50'
                                        : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${form.status === s ? 'bg-white' : 'bg-gray-300'} ${s === 'Active' && form.status === s ? 'animate-pulse' : ''}`} />
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Route ID (read-only info) */}
                <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Route ID</p>
                    <p className="text-xs font-black text-gray-500 mt-1 font-mono">{id}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate('/operator/routes')}
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

export default EditRoute;
