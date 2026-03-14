import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOperatorCoupons } from '../../api/couponApi';
import { Tag, Plus, Trash2, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';

const OperatorCoupons = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setToastMessage(location.state.message);
            setTimeout(() => setToastMessage(''), 3000);
            // Clear state so reload doesn't show toast again
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await getOperatorCoupons();
            setCoupons(data);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight">Promotions & Coupons</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Manage discounts and seasonal offers for your buses</p>
                </div>
                <button
                    onClick={() => navigate('/operator/coupons/add')}
                    className="flex items-center gap-3 bg-deep-navy text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#d84e55] transition-all shadow-lg active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    New Coupon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.map((coupon) => (
                    <div key={coupon._id} className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden relative group">
                        <div className="bg-gray-50 p-8 border-b border-gray-100 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Promo Code</p>
                                <h3 className="text-2xl font-black text-deep-navy tracking-tighter uppercase">{coupon.code}</h3>
                            </div>
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                                <Tag className="h-8 w-8 text-[#d84e55]" />
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Discount</p>
                                    <p className="text-3xl font-black text-[#d84e55]">₹{coupon.discountAmount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${coupon.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {coupon.status === 'Active' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                        {coupon.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <Calendar className="h-4 w-4 text-gray-300" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expires {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50 border border-gray-800">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <p className="text-xs font-black uppercase tracking-widest">{toastMessage}</p>
                </div>
            )}
        </div>
    );
};

export default OperatorCoupons;
