import { useEffect, useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FlightOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', couponCode: '', discountType: 'Percentage', discountValue: '', expiryDate: '' });

    const load = async () => {
        setLoading(true);
        const res = await fetch(`${API}/api/flight-offers`);
        const data = await res.json();
        setOffers(data.offers || []);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const submit = async (e) => {
        e.preventDefault();
        await fetch(`${API}/api/flight-offers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        setForm({ title: '', couponCode: '', discountType: 'Percentage', discountValue: '', expiryDate: '' });
        setShowForm(false);
        load();
    };

    const deleteOffer = async (id) => {
        if (!window.confirm('Delete this offer?')) return;
        await fetch(`${API}/api/flight-offers/${id}`, { method: 'DELETE' });
        load();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600"><Tag size={24} /></div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Flight Offers</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage discount coupons for flights</p>
                    </div>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl font-semibold text-sm hover:bg-rose-700 transition-colors">
                    <Plus size={16} /> Add Offer
                </button>
            </div>

            {showForm && (
                <div className="card p-6">
                    <h2 className="font-bold text-slate-800 dark:text-white mb-4">Add New Offer</h2>
                    <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">Title</label><input required className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Offer title" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">Coupon Code</label><input required className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.couponCode} onChange={e => setForm(f => ({ ...f, couponCode: e.target.value }))} placeholder="FLIGHT50" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">Discount Type</label>
                            <select className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}>
                                <option value="Percentage">Percentage</option>
                                <option value="Flat">Flat</option>
                            </select>
                        </div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">Discount Value</label><input required type="number" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder="10" /></div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1">Expiry Date</label><input required type="date" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} /></div>
                        <div className="col-span-2 flex gap-3">
                            <button type="submit" className="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-semibold text-sm hover:bg-rose-700">Save</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />) :
                    offers.length === 0 ? <p className="text-slate-500 font-medium col-span-3 py-10 text-center">No flight offers yet</p> :
                    offers.map(o => (
                        <div key={o._id} className="card p-5 relative">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="font-extrabold text-slate-900 dark:text-white">{o.title}</p>
                                    <span className="inline-block mt-1 px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 rounded-lg font-black text-xs tracking-widest">{o.couponCode}</span>
                                </div>
                                <button onClick={() => deleteOffer(o._id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100"><Trash2 size={14} /></button>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500 font-medium">
                                <span>{o.discountType === 'Percentage' ? `${o.discountValue}% OFF` : `₹${o.discountValue} OFF`}</span>
                                <span>Expires: {new Date(o.expiryDate).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${o.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{o.status}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FlightOffers;
