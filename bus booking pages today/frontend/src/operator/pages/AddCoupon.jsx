import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Tag, Settings, CreditCard, Clock, CheckCircle } from 'lucide-react';
import Select from 'react-select';
import { createCoupon, updateAdminCoupon } from '../../api/couponApi';
import { getAllRoutes } from '../../api/routeApi';
import { getOperatorBuses } from '../../api/busApi';

const AddCoupon = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const editData = location.state?.editData;
    const isEditMode = Boolean(editData);

    const [loading, setLoading] = useState(false);
    
    // Dependencies Data
    const [allRoutes, setAllRoutes] = useState([]);
    const [allBuses, setAllBuses] = useState([]);

    const [formData, setFormData] = useState({
        code: editData?.code || '',
        description: editData?.description || '',
        discountType: editData?.discountType || 'percentage',
        discountValue: editData?.discountValue || '',
        maxDiscountAmount: editData?.maxDiscountAmount || '',
        minBookingAmount: editData?.minBookingAmount || '',
        applyToAllRoutes: editData === undefined ? true : editData.applyToAllRoutes,
        applyToAllBuses: editData === undefined ? true : editData.applyToAllBuses,
        totalUsageLimit: editData?.totalUsageLimit || '',
        perUserLimit: editData?.perUserLimit || '',
        validFrom: editData?.validFrom ? new Date(editData.validFrom).toISOString().split('T')[0] : '',
        validTill: editData?.validTill ? new Date(editData.validTill).toISOString().split('T')[0] : (editData?.expiryDate ? new Date(editData.expiryDate).toISOString().split('T')[0] : ''),
        status: editData?.status || 'Active'
    });

    const [selectedRoutes, setSelectedRoutes] = useState([]);
    const [selectedBuses, setSelectedBuses] = useState([]);

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const routes = await getAllRoutes();
                setAllRoutes(routes.map(r => ({ value: r._id, label: `${r.fromCity} → ${r.toCity}` })));
                
                if (isEditMode && !editData.applyToAllRoutes && editData.applicableRoutes) {
                    setSelectedRoutes(
                        routes.filter(r => editData.applicableRoutes.includes(r._id))
                              .map(r => ({ value: r._id, label: `${r.fromCity} → ${r.toCity}` }))
                    );
                }
            } catch (err) {
                console.error('Failed to fetch routes', err);
            }
        };
        fetchDependencies();
    }, [isEditMode, editData]);

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                let filters = {};
                if (!formData.applyToAllRoutes && selectedRoutes.length > 0) {
                    filters.routeIds = selectedRoutes.map(r => r.value).join(',');
                } else if (!formData.applyToAllRoutes && selectedRoutes.length === 0) {
                    setAllBuses([]);
                    return; // No routes selected
                }

                const buses = await getOperatorBuses(filters);
                const busOptions = buses.map(b => ({ value: b._id, label: `${b.busName} (${b.busNumber})` }));
                setAllBuses(busOptions);
                
                if (isEditMode && !formData.applyToAllBuses && editData?.applicableBuses?.length > 0) {
                     setSelectedBuses(
                         busOptions.filter(b => editData.applicableBuses.includes(b.value))
                     );
                }

            } catch (err) {
                console.error('Failed to fetch buses', err);
            }
        };
        fetchBuses();
    }, [formData.applyToAllRoutes, selectedRoutes, isEditMode, editData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let finalValue = type === 'checkbox' ? checked : value;
        if (name === 'code') {
            finalValue = String(finalValue).toUpperCase();
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                discountValue: Number(formData.discountValue),
                validTill: formData.validTill,
                applicableRoutes: formData.applyToAllRoutes ? [] : selectedRoutes.map(r => r.value),
                applicableBuses: formData.applyToAllBuses ? [] : selectedBuses.map(b => b.value),
            };
            
            if (isEditMode) {
                await updateAdminCoupon(editData._id, payload);
                navigate('/operator/coupons', { state: { message: 'Coupon updated successfully' } });
            } else {
                await createCoupon(payload);
                navigate('/operator/coupons', { state: { message: 'Coupon created successfully' } });
            }
        } catch (error) {
            console.error('Failed to create/update coupon:', error);
            alert(error.message || 'Action failed');
        } finally {
            setLoading(false);
        }
    };

    // Styling for react-select
    const selectStyles = {
        control: (base) => ({
            ...base,
            padding: '4px',
            borderRadius: '1rem',
            borderColor: '#F3F4F6',
            backgroundColor: '#F9FAFB',
            boxShadow: 'none',
            '&:hover': { borderColor: '#d84e55' }
        })
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => navigate('/operator/coupons')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">{isEditMode ? 'Edit Coupon' : 'Create New Coupon'}</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Configure promotional discount settings</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/operator/coupons')}
                        className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-coupon-form"
                        disabled={loading}
                        className="flex items-center gap-3 bg-[#d84e55] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-red-500/10 active:scale-95 disabled:opacity-50"
                    >
                        <Tag className="h-4 w-4" />
                        {loading ? 'Saving...' : (isEditMode ? 'Update Coupon' : 'Create Coupon')}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden bg-white rounded-3xl animate-in slide-in-from-bottom-8 duration-300">
                {/* Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    <form id="create-coupon-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* Section 1 - Basic Details */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                                <Settings className="h-5 w-5 text-gray-400" />
                                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Section 1 — Basic Coupon Details</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Coupon Code</label>
                                    <input
                                        required
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        placeholder="E.g., FESTIVE50"
                                        className="w-full uppercase px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all placeholder:normal-case placeholder:font-medium"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Description</label>
                                    <textarea
                                        required
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="What is this coupon for?"
                                        rows="2"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-medium focus:border-[#d84e55] outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Discount Type</label>
                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                        <label className="flex-1 cursor-pointer">
                                            <div className={`p-2.5 text-center text-xs font-black uppercase tracking-widest rounded-xl transition-all ${formData.discountType === 'percentage' ? 'bg-white text-[#d84e55] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                                <input type="radio" name="discountType" value="percentage" checked={formData.discountType === 'percentage'} onChange={handleChange} className="hidden" />
                                                Percentage
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <div className={`p-2.5 text-center text-xs font-black uppercase tracking-widest rounded-xl transition-all ${formData.discountType === 'flat' ? 'bg-white text-[#d84e55] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                                <input type="radio" name="discountType" value="flat" checked={formData.discountType === 'flat'} onChange={handleChange} className="hidden" />
                                                Flat Amount
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Discount Value</label>
                                    <input
                                        required
                                        type="number"
                                        name="discountValue"
                                        value={formData.discountValue}
                                        onChange={handleChange}
                                        placeholder="E.g., 20 or 200"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Max Discount (₹)</label>
                                    <input
                                        type="number"
                                        name="maxDiscountAmount"
                                        value={formData.maxDiscountAmount}
                                        onChange={handleChange}
                                        placeholder="E.g., 500"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all"
                                    />
                                    <p className="text-[8px] font-bold text-gray-400 px-4">Leave empty for no limit (only applies to percentage)</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 - Booking Conditions */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Section 2 — Booking Conditions</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2 w-full md:w-1/2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Min Booking Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="minBookingAmount"
                                        value={formData.minBookingAmount}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 pt-4 border-t border-gray-100">
                                    {/* Routes Mapping */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Applicable Routes</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="all-routes" 
                                                    name="applyToAllRoutes" 
                                                    checked={formData.applyToAllRoutes} 
                                                    onChange={handleChange} 
                                                    className="w-4 h-4 rounded border-gray-300 text-[#d84e55] focus:ring-[#d84e55]"
                                                />
                                                <label htmlFor="all-routes" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer">All Routes</label>
                                            </div>
                                        </div>
                                        {!formData.applyToAllRoutes && (
                                            <Select
                                                isMulti
                                                options={allRoutes}
                                                value={selectedRoutes}
                                                onChange={setSelectedRoutes}
                                                styles={selectStyles}
                                                placeholder="Select specific routes..."
                                            />
                                        )}
                                    </div>

                                    {/* Buses Mapping */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Applicable Buses</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    id="all-buses" 
                                                    name="applyToAllBuses" 
                                                    checked={formData.applyToAllBuses} 
                                                    onChange={handleChange} 
                                                    className="w-4 h-4 rounded border-gray-300 text-[#d84e55] focus:ring-[#d84e55]"
                                                />
                                                <label htmlFor="all-buses" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer">All Buses</label>
                                            </div>
                                        </div>
                                        {!formData.applyToAllBuses && (
                                            <Select
                                                isMulti
                                                options={allBuses}
                                                value={selectedBuses}
                                                onChange={setSelectedBuses}
                                                styles={selectStyles}
                                                placeholder="Select specific buses..."
                                                isDisabled={!formData.applyToAllRoutes && selectedRoutes.length === 0}
                                            />
                                        )}
                                        {!formData.applyToAllBuses && !formData.applyToAllRoutes && selectedRoutes.length === 0 && (
                                            <p className="text-[9px] font-bold text-red-400 px-4">Please select routes first</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Section 3 - Usage Limits */}
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                                    <Tag className="h-5 w-5 text-gray-400" />
                                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Section 3 — Limits</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Total Usage Limit</label>
                                        <input
                                            type="number"
                                            name="totalUsageLimit"
                                            value={formData.totalUsageLimit}
                                            onChange={handleChange}
                                            placeholder="E.g., 100"
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Per User Limit</label>
                                        <input
                                            type="number"
                                            name="perUserLimit"
                                            value={formData.perUserLimit}
                                            onChange={handleChange}
                                            placeholder="E.g., 1"
                                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 4 & 5 - Validity & Status */}
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Section 4 — Validity</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Valid From</label>
                                            <input
                                                required
                                                type="date"
                                                name="validFrom"
                                                value={formData.validFrom}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Valid Till</label>
                                            <input
                                                required
                                                type="date"
                                                name="validTill"
                                                value={formData.validTill}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircle className="h-4 w-4 text-gray-400" />
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Section 5 — Status</h3>
                                    </div>
                                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                        <label className="flex-1 cursor-pointer">
                                            <div className={`p-2.5 text-center text-xs font-black uppercase tracking-widest rounded-xl transition-all ${formData.status === 'Active' ? 'bg-white text-emerald-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                                <input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={handleChange} className="hidden" />
                                                Active
                                            </div>
                                        </label>
                                        <label className="flex-1 cursor-pointer">
                                            <div className={`p-2.5 text-center text-xs font-black uppercase tracking-widest rounded-xl transition-all ${formData.status === 'Inactive' ? 'bg-white text-gray-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                                <input type="radio" name="status" value="Inactive" checked={formData.status === 'Inactive'} onChange={handleChange} className="hidden" />
                                                Inactive
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCoupon;
