import React, { useState } from 'react';
import { X, MapPin, Building, Hash, Navigation } from 'lucide-react';
import trainApi from '../../api/trainApi';
import { toast } from 'react-toastify';

const AddStationModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        stationCode: '',
        stationName: '',
        city: '',
        state: '',
        latitude: '',
        longitude: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.stationCode) newErrors.stationCode = 'Station code is required';
        if (!formData.stationName) newErrors.stationName = 'Station name is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.latitude || isNaN(formData.latitude)) newErrors.latitude = 'Valid latitude is required';
        if (!formData.longitude || isNaN(formData.longitude)) newErrors.longitude = 'Valid longitude is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        // Auto uppercase for station code
        if (name === 'stationCode') {
            finalValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
        
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await trainApi.addAdminStation(formData);
            if (res?.success) {
                // Determine which toast library is available (toastify vs hot-toast usually throws if wrong, we'll try safely)
                if (typeof toast.success === 'function') toast.success('Station added successfully!');
                
                // Reset form
                setFormData({
                    stationCode: '',
                    stationName: '',
                    city: '',
                    state: '',
                    latitude: '',
                    longitude: ''
                });
                
                if (onSuccess) onSuccess(res.station);
                onClose();
            } else {
                if (typeof toast.error === 'function') toast.error(res?.error || 'Failed to add station');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Something went wrong';
            if (typeof toast.error === 'function') toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-slide-up">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <MapPin size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">Add New Station</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Station Name & Code Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Station Name *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="stationName"
                                        value={formData.stationName}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.stationName ? 'border-red-300 focus:border-red-500 focus:bg-white' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="e.g. New Delhi"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.stationName && <p className="text-xs text-red-500 mt-1">{errors.stationName}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Station Code *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Hash size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="stationCode"
                                        value={formData.stationCode}
                                        onChange={handleChange}
                                        maxLength={10}
                                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all font-mono uppercase ${errors.stationCode ? 'border-red-300 focus:border-red-500 focus:bg-white' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="e.g. NDLS"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.stationCode && <p className="text-xs text-red-500 mt-1">{errors.stationCode}</p>}
                            </div>
                        </div>

                        {/* City & State Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">City *</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.city ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                                    placeholder="City name"
                                    disabled={loading}
                                />
                                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">State *</label>
                                <input 
                                    type="text" 
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.state ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                                    placeholder="State name"
                                    disabled={loading}
                                />
                                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                            </div>
                        </div>

                        {/* Coordinates Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Latitude *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Navigation size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="number" 
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.latitude ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="28.6139"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.latitude && <p className="text-xs text-red-500 mt-1">{errors.latitude}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Longitude *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Navigation size={16} className="text-slate-400" />
                                    </div>
                                    <input 
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl outline-none transition-all ${errors.longitude ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-blue-500 focus:bg-white'}`}
                                        placeholder="77.2090"
                                        disabled={loading}
                                    />
                                </div>
                                {errors.longitude && <p className="text-xs text-red-500 mt-1">{errors.longitude}</p>}
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2.5 text-sm font-bold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Add Station'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddStationModal;
