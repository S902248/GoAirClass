import { useEffect, useState } from 'react';
import { Plane, Search, Plus, Trash2, Edit3 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AllFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchFlights = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API}/api/flights`);
            const data = await res.json();
            setFlights(data.flights || []);
        } catch (err) {
            console.error('Error fetching flights:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFlights(); }, []);

    const deleteFlight = async (id) => {
        if (!window.confirm('Delete this flight?')) return;
        await fetch(`${API}/api/flights/${id}`, { method: 'DELETE' });
        fetchFlights();
    };

    const filtered = flights.filter(f =>
        !search ||
        f.flightNumber?.toLowerCase().includes(search.toLowerCase()) ||
        f.airlineId?.airlineName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600">
                    <Plane size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">All Flights</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage all flights across the platform</p>
                </div>
            </div>

            <div className="card p-4 flex gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Search by flight number or airline..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            {['Flight No.', 'Airline', 'From', 'To', 'Departure', 'Arrival', 'Duration', 'Seats', 'Price', 'Status', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}><td colSpan={11} className="px-4 py-4"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" /></td></tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={11} className="px-4 py-16 text-center text-slate-500 font-medium">No flights found</td></tr>
                        ) : filtered.map(f => (
                            <tr key={f._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{f.flightNumber}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.airlineId?.airlineName || '—'}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.fromAirport?.airportCode || '—'}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.toAirport?.airportCode || '—'}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.departureTime ? new Date(f.departureTime).toLocaleString() : '—'}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.arrivalTime ? new Date(f.arrivalTime).toLocaleString() : '—'}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f.duration}</td>
                                <td className="px-4 py-3 font-bold">{f.totalSeats}</td>
                                <td className="px-4 py-3 font-bold text-emerald-600">₹{f.price}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                                        ${f.status === 'Scheduled' ? 'bg-emerald-100 text-emerald-700' :
                                            f.status === 'Delayed' ? 'bg-amber-100 text-amber-700' :
                                                f.status === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {f.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => deleteFlight(f._id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors" title="Delete">
                                        <Trash2 size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllFlights;
