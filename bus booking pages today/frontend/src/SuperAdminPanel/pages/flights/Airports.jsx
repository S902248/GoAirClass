import { useEffect, useState } from 'react';
import { MapPin, Search, Plus, Trash2, Edit3 } from 'lucide-react';
import Axios from '../../../api/Axios';

const Airports = () => {
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ airportName: '', airportCode: '', city: '', country: '' });

    const fetchAirports = async () => {
        setLoading(true);
        try {
            const res = await Axios.get('/airports');
            setAirports(res.data.airports || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAirports(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await Axios.post('/airports', form);
            setForm({ airportName: '', airportCode: '', city: '', country: '' });
            setShowForm(false);
            fetchAirports();
        } catch (e) { console.error(e); }
    };

    const deleteAirport = async (id) => {
        if (!window.confirm('Delete this airport?')) return;
        try {
            await Axios.delete(`/airports/${id}`);
            fetchAirports();
        } catch (e) { console.error(e); }
    };

    const filtered = airports.filter(a =>
        !search ||
        a.airportName?.toLowerCase().includes(search.toLowerCase()) ||
        a.airportCode?.toLowerCase().includes(search.toLowerCase()) ||
        a.city?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Airports</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage airports and their IATA codes</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors"
                >
                    <Plus size={16} /> Add Airport
                </button>
            </div>

            {showForm && (
                <div className="card p-6">
                    <h2 className="font-bold text-slate-800 dark:text-white mb-4">Add New Airport</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        {[['airportName', 'Airport Name'], ['airportCode', 'IATA Code'], ['city', 'City'], ['country', 'Country']].map(([key, label]) => (
                            <div key={key}>
                                <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
                                <input
                                    required
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    value={form[key]}
                                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                    placeholder={label}
                                />
                            </div>
                        ))}
                        <div className="col-span-2 flex gap-3">
                            <button type="submit" className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700">Save</button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-sm">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card p-4">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Search airport, code or city..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Airport Name', 'IATA Code', 'City', 'Country', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></td></tr>)
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-16 text-center text-slate-500 font-medium">No airports found</td></tr>
                        ) : filtered.map(a => (
                            <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{a.airportName}</td>
                                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-700 font-black text-xs">{a.airportCode}</span></td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{a.city}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{a.country}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${a.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{a.status}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => deleteAirport(a._id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"><Trash2 size={15} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Airports;
