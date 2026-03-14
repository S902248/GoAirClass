import { useEffect, useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Airlines = () => {
    const [airlines, setAirlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ airlineName: '', airlineCode: '', country: '', logo: '' });

    const fetchAirlines = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/airlines`);
            const data = await res.json();
            setAirlines(data.airlines || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAirlines(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`${API}/api/airlines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        setForm({ airlineName: '', airlineCode: '', country: '', logo: '' });
        setShowForm(false);
        fetchAirlines();
    };

    const deleteAirline = async (id) => {
        if (!window.confirm('Delete this airline?')) return;
        await fetch(`${API}/api/airlines/${id}`, { method: 'DELETE' });
        fetchAirlines();
    };

    const filtered = airlines.filter(a =>
        !search ||
        a.airlineName?.toLowerCase().includes(search.toLowerCase()) ||
        a.airlineCode?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                        <span className="text-xl">✈</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Airlines</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage airlines and their details</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={16} /> Add Airline
                </button>
            </div>

            {showForm && (
                <div className="card p-6">
                    <h2 className="font-bold text-slate-800 dark:text-white mb-4">Add New Airline</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        {[['airlineName', 'Airline Name'], ['airlineCode', 'Airline Code (e.g. AI)'], ['country', 'Country'], ['logo', 'Logo URL (optional)']].map(([key, label]) => (
                            <div key={key}>
                                <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
                                <input
                                    required={key !== 'logo'}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    placeholder={label}
                                />
                            </div>
                        ))}
                        <div className="col-span-2 flex gap-3">
                            <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700">Save</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card p-4">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Search airline or code..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Airline Name', 'Code', 'Country', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></td></tr>)
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={5} className="px-4 py-16 text-center text-slate-500 font-medium">No airlines found</td></tr>
                        ) : filtered.map(a => (
                            <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {a.logo && <img src={a.logo} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-100" />}
                                        <span className="font-bold text-slate-900 dark:text-white">{a.airlineName}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 font-black text-xs">{a.airlineCode}</span></td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{a.country}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${a.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{a.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => deleteAirline(a._id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"><Trash2 size={15} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Airlines;
