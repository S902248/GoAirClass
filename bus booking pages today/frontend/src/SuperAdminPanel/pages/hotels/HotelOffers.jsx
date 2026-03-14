import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllHotelOffers, createHotelOfferThunk, updateHotelOfferThunk, deleteHotelOfferThunk } from '../../slices/hotelOfferSlice';
import { fetchAllHotels } from '../../slices/hotelSlice';
import { Tag, Plus, X, Trash2, Edit3, Hotel } from 'lucide-react';

const defaultForm = { offerTitle: '', discountPercentage: '', hotelId: '', startDate: '', endDate: '', status: 'active' };

const HotelOffers = () => {
    const dispatch = useDispatch();
    const { offers, loading } = useSelector((state) => state.hotelOffers);
    const { hotels } = useSelector((state) => state.hotels);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchAllHotelOffers());
        dispatch(fetchAllHotels());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                dispatch(updateHotelOfferThunk({ id: editingId, data: form }));
            } else {
                dispatch(createHotelOfferThunk(form));
            }
            setShowForm(false);
            setForm(defaultForm);
            setEditingId(null);
        } catch (_) { }
        setSubmitting(false);
    };

    const handleEdit = (offer) => {
        setForm({
            offerTitle: offer.offerTitle,
            discountPercentage: offer.discountPercentage,
            hotelId: offer.hotelId?._id || '',
            startDate: offer.startDate,
            endDate: offer.endDate,
            status: offer.status,
        });
        setEditingId(offer._id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this offer?')) dispatch(deleteHotelOfferThunk(id));
    };

    const statusColors = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-slate-100 text-slate-500', expired: 'bg-rose-100 text-rose-700' };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-xl flex items-center justify-center text-fuchsia-600">
                        <Tag size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Hotel Offers</h1>
                        <p className="text-slate-500 text-sm font-medium">Create and manage hotel discount offers</p>
                    </div>
                </div>
                <button onClick={() => { setForm(defaultForm); setEditingId(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-fuchsia-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-fuchsia-500/25 hover:bg-fuchsia-700 transition-all">
                    <Plus size={16} /> Create Offer
                </button>
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editingId ? 'Edit Offer' : 'Create Offer'}</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Offer Title *</label>
                                <input required value={form.offerTitle} onChange={e => setForm(f => ({ ...f, offerTitle: e.target.value }))}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                    placeholder="e.g. Summer Special" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Discount % *</label>
                                    <input required type="number" min="0" max="100" value={form.discountPercentage} onChange={e => setForm(f => ({ ...f, discountPercentage: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                                        placeholder="e.g. 20" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Status</label>
                                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Hotel (Optional)</label>
                                <select value={form.hotelId} onChange={e => setForm(f => ({ ...f, hotelId: e.target.value }))}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500">
                                    <option value="">All Hotels</option>
                                    {hotels.map(h => <option key={h._id} value={h._id}>{h.hotelName}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Start Date *</label>
                                    <input required type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">End Date *</label>
                                    <input required type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
                                </div>
                            </div>
                            <button type="submit" disabled={submitting}
                                className="w-full py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Offer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Offer Title', 'Discount', 'Hotel', 'Start Date', 'End Date', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(4)].map((_, i) => <tr key={i}><td colSpan={7}><div className="h-12 px-4 py-2"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></div></td></tr>)
                        ) : offers.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-16 text-center text-slate-500 font-medium">No offers created yet</td></tr>
                        ) : offers.map(offer => (
                            <tr key={offer._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{offer.offerTitle}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-fuchsia-100 text-fuchsia-700">{offer.discountPercentage}% OFF</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                        <Hotel size={13} />{offer.hotelId?.hotelName || 'All Hotels'}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{offer.startDate}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{offer.endDate}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[offer.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {offer.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleEdit(offer)} className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"><Edit3 size={13} /></button>
                                        <button onClick={() => handleDelete(offer._id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"><Trash2 size={13} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotelOffers;
