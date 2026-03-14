import React, { useState, useEffect } from 'react';
import { Ticket, Plus, X, Trash2, Edit, Save, Power } from 'lucide-react';
import { getMyHotelsForDropdown, getMyHotelCoupons, createHotelCoupon, updateHotelCouponStatus, deleteHotelCoupon } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';

const Coupons = () => {
    const { hasPerm } = useHotelOperator();
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState('');
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        couponCode: '',
        discountType: 'percentage',
        discountValue: '',
        minBookingAmount: '',
        maxDiscount: '',
        expiryDate: '',
        usageLimit: '',
        status: 'active'
    });

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotel) {
            fetchCoupons(selectedHotel);
        } else {
            setCoupons([]);
        }
    }, [selectedHotel]);

    const fetchHotels = async () => {
        try {
            const data = await getMyHotelsForDropdown();
            setHotels(data.hotels || []);
            if (data.hotels?.length > 0) setSelectedHotel(data.hotels[0]._id);
        } catch (err) {
            console.error('Failed to load hotels');
        }
    };

    const fetchCoupons = async (hotelId) => {
        setLoading(true);
        try {
            const data = await getMyHotelCoupons(hotelId);
            setCoupons(data.coupons || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createHotelCoupon({ ...form, hotelId: selectedHotel });
            setShowForm(false);
            setForm({
                couponCode: '',
                discountType: 'percentage',
                discountValue: '',
                minBookingAmount: '',
                maxDiscount: '',
                expiryDate: '',
                usageLimit: '',
                status: 'active'
            });
            fetchCoupons(selectedHotel);
        } catch (err) {
            alert(err?.message || 'Failed to create coupon');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            await updateHotelCouponStatus(id, newStatus);
            fetchCoupons(selectedHotel);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this coupon?')) return;
        try {
            await deleteHotelCoupon(id);
            fetchCoupons(selectedHotel);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Coupons</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Create and manage discount coupons for your hotels</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#006ce4] transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Create Coupon
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-gray-900">Create New Coupon</h2>
                        <button onClick={() => setShowForm(false)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Coupon Code</label>
                                <input type="text" required placeholder="e.g. SUMMER500" value={form.couponCode} onChange={e => setForm({ ...form, couponCode: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                            </div>

                            {hotels.length > 0 && (
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Applicable Hotel</label>
                                    <select value={selectedHotel} onChange={e => setSelectedHotel(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium">
                                        {hotels.map(h => (
                                            <option key={h._id} value={h._id}>{h.hotelName} ({h.city})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Discount Type</label>
                                <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all">
                                    <option value="percentage">Percentage</option>
                                    <option value="flat">Flat Amount</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Discount Value {form.discountType === 'percentage' ? '(%)' : '(₹)'}
                                </label>
                                <input type="number" required min="1" placeholder={form.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 500'} value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Min Booking Amount (₹)</label>
                                <input type="number" min="0" placeholder="e.g. 2000" value={form.minBookingAmount} onChange={e => setForm({ ...form, minBookingAmount: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Maximum Discount (₹)</label>
                                <input type="number" min="0" placeholder="e.g. 1000" value={form.maxDiscount} onChange={e => setForm({ ...form, maxDiscount: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Expiry Date</label>
                                <input type="date" required value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Usage Limit</label>
                                <input type="number" min="0" placeholder="e.g. 100 uses" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <button type="submit" className="flex items-center gap-2 px-8 py-3.5 bg-[#006ce4] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                <Save className="h-4 w-4" /> Save Coupon
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!showForm && (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                        <label className="text-sm font-black text-gray-700">Select Hotel:</label>
                        <select
                            value={selectedHotel}
                            onChange={e => setSelectedHotel(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        >
                            {hotels.length === 0 && <option value="">No hotels found</option>}
                            {hotels.map(h => (
                                <option key={h._id} value={h._id}>{h.hotelName} ({h.city})</option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Coupon Code', 'Discount', 'Min Booking', 'Expiry Date', 'Usage', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-4 py-4 text-[10px] font-black uppercase tracking-wider text-gray-400">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan={7} className="px-4 py-8 text-center"><div className="w-full h-8 bg-gray-100 rounded animate-pulse"></div></td></tr>
                                ) : coupons.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No coupons created yet</td></tr>
                                ) : coupons.map(c => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="inline-flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                                                <Ticket className="h-4 w-4 text-blue-500" />
                                                <span className="font-black text-blue-900 tracking-wider uppercase">{c.couponCode}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-black text-gray-700">
                                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                        </td>
                                        <td className="px-4 py-4 text-gray-500 font-medium tracking-tight">
                                            {c.minBookingAmount > 0 ? `₹${c.minBookingAmount.toLocaleString()}` : 'None'}
                                        </td>
                                        <td className="px-4 py-4 text-gray-500 font-medium">
                                            {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 py-4 text-gray-500 font-medium">
                                            {c.timesUsed} / {c.usageLimit > 0 ? c.usageLimit : '∞'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleToggleStatus(c._id, c.status)}
                                                    className={`p-2 rounded-lg transition-colors ${c.status === 'active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                    title={c.status === 'active' ? 'Deactivate' : 'Activate'}>
                                                    <Power className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(c._id)} className="p-2 bg-red-50 text-[#d84e55] hover:bg-red-100 rounded-lg transition-colors">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
