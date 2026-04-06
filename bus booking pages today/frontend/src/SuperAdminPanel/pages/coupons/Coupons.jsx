import React, { useState, useEffect } from 'react';
import { listAdminCoupons, deleteCoupon } from '../../../api/couponApi';
import { Tag, Plus, Trash2, Calendar, CheckCircle, XCircle } from 'lucide-react';

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await listAdminCoupons();
            setCoupons(data);
        } catch (err) {
            console.error('Error fetching admin coupons:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this admin coupon?')) {
            try {
                await deleteCoupon(id);
                fetchCoupons();
            } catch (err) {
                alert('Failed to delete coupon');
            }
        }
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">System Coupons</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Super Admin shared & global coupons</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative group">
                            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</p>
                                    <h3 className="text-xl font-black text-slate-800 uppercase">{coupon.code}</h3>
                                </div>
                                <button onClick={() => handleDelete(coupon._id)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-red-50 transition-colors">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount</p>
                                        <p className="text-2xl font-black text-slate-800">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${coupon.isGlobal ? 'text-blue-500' : 'text-slate-400'}`}>
                                            {coupon.isGlobal ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <Calendar className="h-3 w-3 text-slate-400" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expires {new Date(coupon.validTill).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${coupon.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                        {coupon.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                        {coupon.status}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Used {coupon.analytics?.totalTimesUsed || 0} times</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {coupons.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <Tag className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No admin coupons found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Coupons;
