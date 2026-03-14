import React, { useState } from 'react';
import { X, Tag, Settings, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { createCoupon } from '../../api/couponApi';

const CreateCouponModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscountAmount: '',
        minBookingAmount: '',
        applicableRoutes: 'all',
        applicableBuses: 'all',
        totalUsageLimit: '',
        perUserLimit: '',
        validFrom: '',
        validTill: '',
        status: 'Active'
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createCoupon(formData);
            onSuccess();
        } catch (error) {
            console.error('Failed to create coupon:', error);
            // Optional: Handle error UI
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <Tag className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Create New Coupon</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure promotional discount settings</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

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

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
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
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Applicable Routes</label>
                                    <select
                                        name="applicableRoutes"
                                        value={formData.applicableRoutes}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="all">All Routes</option>
                                        <option value="specific">Specific Routes (Coming Soon)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-4">Applicable Bus Types</label>
                                    <select
                                        name="applicableBuses"
                                        value={formData.applicableBuses}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-indigo-500 outline-none transition-all appearance-none"
                                    >
                                        <option value="all">All Buses</option>
                                        <option value="AC Sleeper">AC Sleeper</option>
                                        <option value="Non AC Sleeper">Non AC Sleeper</option>
                                        <option value="Seater">Seater</option>
                                    </select>
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

                {/* Footer Actions */}
                <div className="px-8 py-5 border-t border-gray-100 bg-white flex items-center justify-end gap-4 relative z-10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3.5 bg-transparent border border-gray-200 text-gray-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="create-coupon-form"
                        disabled={loading}
                        className="px-8 py-3.5 bg-[#d84e55] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Creating...' : 'Create Coupon'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCouponModal;
