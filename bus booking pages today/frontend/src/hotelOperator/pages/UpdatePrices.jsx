import React, { useState, useEffect } from 'react';
import { BedDouble, CheckCircle } from 'lucide-react';
import { getMyHotelsForDropdown, updateRoomPricesBulk } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';
import { useNavigate } from 'react-router-dom';

const UpdatePrices = () => {
    const navigate = useNavigate();
    const { hasPerm } = useHotelOperator();

    if (!hasPerm('UpdateRoomPrices')) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied: You do not permission to update pricing.</div>;
    }

    const [hotels, setHotels] = useState([]);
    const [form, setForm] = useState({ hotelId: '', percentage: '', operation: 'increase' });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        getMyHotelsForDropdown().then(d => {
            const h = d.hotels || [];
            if (h.length > 0) {
                setHotels(h);
                setForm(f => ({ ...f, hotelId: h[0]._id }));
            }
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.hotelId || !form.percentage) return;
        setLoading(true);
        setSuccessMsg('');
        try {
            await updateRoomPricesBulk(form);
            setSuccessMsg(`Successfully ${form.operation}d room prices by ${form.percentage}% for the selected hotel.`);
            setForm({ ...form, percentage: '' });
        } catch (err) {
            alert(err?.error || 'Failed to update prices');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Bulk Pricing Update</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Adjust all room prices for a hotel instantly</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-8">

                {successMsg && (
                    <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                        <CheckCircle className="h-5 w-5" />
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Hotel</label>
                        <select required value={form.hotelId} onChange={e => setForm({ ...form, hotelId: e.target.value })}
                            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-4 text-sm font-black text-gray-800 focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all appearance-none">
                            {hotels.length === 0 && <option value="">No hotels available</option>}
                            {hotels.map(h => <option key={h._id} value={h._id}>{h.hotelName} ({h.city})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation</label>
                            <select value={form.operation} onChange={e => setForm({ ...form, operation: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-4 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all appearance-none cursor-pointer">
                                <option value="increase">Increase (+)</option>
                                <option value="decrease">Decrease (-)</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Percentage (%)</label>
                            <div className="relative">
                                <input required type="number" min="1" max="100" placeholder="e.g. 10" value={form.percentage}
                                    onChange={e => setForm({ ...form, percentage: Number(e.target.value) })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-4 pr-12 text-sm font-black text-gray-800 focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button type="submit" disabled={loading || !form.hotelId || !form.percentage}
                            className="w-full py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-fuchsia-200 disabled:opacity-50 disabled:active:scale-100">
                            {loading ? 'Updating...' : `Apply ${form.percentage || 0}% ${form.operation}`}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default UpdatePrices;
