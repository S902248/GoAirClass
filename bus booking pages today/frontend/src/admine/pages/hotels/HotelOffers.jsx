import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { getAllHotelOffers, createHotelOffer, updateHotelOffer, deleteHotelOffer } from '../../../api/hotelApi';


const HotelOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({
        offerName: '', hotelId: '', discountPercentage: '', startDate: '', endDate: '', status: 'Active'
    });

    useEffect(() => { fetchOffers(); }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const data = await getAllHotelOffers();
            setOffers(data?.offers || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const resetForm = () => {
        setForm({ offerName: '', hotelId: '', discountPercentage: '', startDate: '', endDate: '', status: 'Active' });
        setEditId(null);
    };

    const openCreate = () => { resetForm(); setShowModal(true); };
    const openEdit = (o) => {
        setEditId(o._id);
        setForm({
            offerName: o.offerName || '',
            hotelId: o.hotelId?._id || o.hotelId || '',
            discountPercentage: o.discountPercentage || '',
            startDate: o.startDate?.slice(0, 10) || '',
            endDate: o.endDate?.slice(0, 10) || '',
            status: o.status || 'Active',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) await updateHotelOffer(editId, form);
            else await createHotelOffer(form);
            setShowModal(false);
            resetForm();
            fetchOffers();
        } catch (err) { alert(err?.error || 'Failed to save offer'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this offer?')) return;
        await deleteHotelOffer(id);
        fetchOffers();
    };

    const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Hotel Offers</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage promotional offers</p>
                </div>
                <button onClick={openCreate}
                    className="flex items-center gap-2 bg-[#d84e55] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg">
                    <Plus className="h-4 w-4" /> Create Offer
                </button>
            </div>

            {/* Offer Cards */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : offers.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-50 shadow-sm">
                    <Tag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Offers Created Yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {offers.map(o => (
                        <div key={o._id} className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-6 space-y-4 relative overflow-hidden group">
                            {/* Discount badge */}
                            <div className="absolute top-4 right-4 bg-[#d84e55] text-white text-sm font-black px-4 py-2 rounded-2xl">
                                {o.discountPercentage}% OFF
                            </div>
                            <div className="flex items-center gap-3 pt-1">
                                <div className="w-10 h-10 bg-fuchsia-50 rounded-xl flex items-center justify-center">
                                    <Tag className="h-5 w-5 text-fuchsia-500" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-800 text-base leading-tight">{o.offerName}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{o.hotelId?.hotelName || 'All Hotels'}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                                <span>{fmt(o.startDate)} → {fmt(o.endDate)}</span>
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${o.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                    {o.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <button onClick={() => openEdit(o)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-50 text-gray-600 text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-all">
                                    <Edit className="h-3.5 w-3.5" />Edit
                                </button>
                                <button onClick={() => handleDelete(o._id)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-[#d84e55] text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-all">
                                    <Trash2 className="h-3.5 w-3.5" />Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl space-y-6">
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                            {editId ? 'Edit Offer' : 'Create Offer'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'offerName', label: 'Offer Name', placeholder: 'Summer Sale', col: 2 },
                                { key: 'hotelId', label: 'Hotel ID', placeholder: 'Hotel ObjectId' },
                                { key: 'discountPercentage', label: 'Discount %', placeholder: '20', type: 'number' },
                                { key: 'startDate', label: 'Start Date', type: 'date' },
                                { key: 'endDate', label: 'End Date', type: 'date' },
                            ].map(({ key, label, placeholder, type = 'text', col }) => (
                                <div key={key} className={`space-y-1 ${col === 2 ? 'col-span-2' : ''}`}>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                                    <input type={type} placeholder={placeholder} value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        className="w-full bg-gray-50 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-red-100 transition-all" />
                                </div>
                            ))}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="w-full bg-gray-50 rounded-xl py-3 px-4 text-sm font-medium outline-none">
                                    <option>Active</option><option>Inactive</option>
                                </select>
                            </div>
                            <div className="col-span-2 flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-xl bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider hover:bg-gray-100 transition-all">Cancel</button>
                                <button type="submit"
                                    className="flex-1 py-3 rounded-xl bg-[#d84e55] text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all">
                                    {editId ? 'Save Changes' : 'Create Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelOffers;
