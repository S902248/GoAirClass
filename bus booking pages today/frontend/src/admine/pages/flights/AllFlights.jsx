import { useEffect, useState } from 'react';
import { Plane, Search, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import flightApi from '../../../api/flightApi';

const AllFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const navigate = useNavigate();

    const load = async () => {
        setLoading(true);
        try {
            const data = await flightApi.getAllFlights();
            setFlights(data.flights || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const toggleStatus = async (f) => {
        const newStatus = f.status === 'Scheduled' ? 'Cancelled' : 'Scheduled';
        await flightApi.updateFlightStatus(f._id, newStatus);
        load();
    };

    const deleteFlight = async (id) => {
        if (!window.confirm('Delete this flight?')) return;
        await flightApi.deleteFlight(id);
        load();
    };

    const filtered = flights.filter(f => {
        const q = search.toLowerCase();
        const matchSearch = !search ||
            f.flightNumber?.toLowerCase().includes(q) ||
            f.airlineId?.airlineName?.toLowerCase().includes(q) ||
            f.fromAirport?.city?.toLowerCase().includes(q) ||
            f.toAirport?.city?.toLowerCase().includes(q);
        const matchStatus = !statusFilter || f.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                        <Plane size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">All Flights</h1>
                        <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">{flights.length} FLIGHTS LISTED</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/admine/flights/add')}
                    className="flex items-center gap-2 px-5 py-3 bg-[#d84e55] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#b03a40] transition-colors shadow-lg shadow-red-200"
                >
                    <Plus size={18} /> Schedule Flight
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 transition-all"
                        placeholder="SEARCH BY FLIGHT NO., AIRLINE, OR CITY..."
                        value={search} onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="w-full sm:w-48 px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
                    value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">ALL STATUS</option>
                    <option>Scheduled</option>
                    <option>Delayed</option>
                    <option>Cancelled</option>
                    <option>Completed</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                {['Flight No.', 'Airline', 'From', 'To', 'Departure', 'Arrival', 'Price', 'Seats', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={10} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={10} className="px-5 py-16 text-center text-gray-400 font-bold uppercase tracking-wider">No flights found</td></tr>
                            ) : filtered.map(f => (
                                <tr key={f._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-4 font-black text-gray-800 whitespace-nowrap">{f.flightNumber}</td>
                                    <td className="px-5 py-4 font-bold text-gray-500">{f.airlineId?.airlineName || '—'}</td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="font-black text-gray-700">{f.fromAirport?.airportCode}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{f.fromAirport?.city}</div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                        <div className="font-black text-gray-700">{f.toAirport?.airportCode}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{f.toAirport?.city}</div>
                                    </td>
                                    <td className="px-5 py-4 font-bold text-gray-500 whitespace-nowrap text-xs">{f.departureTime ? new Date(f.departureTime).toLocaleString() : '—'}</td>
                                    <td className="px-5 py-4 font-bold text-gray-500 whitespace-nowrap text-xs">{f.arrivalTime ? new Date(f.arrivalTime).toLocaleString() : '—'}</td>
                                    <td className="px-5 py-4 font-black text-emerald-600">₹{f.price}</td>
                                    <td className="px-5 py-4 text-center font-black text-gray-700">{f.availableSeats ?? f.totalSeats}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest
                                            ${f.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-600' :
                                              f.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {f.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => toggleStatus(f)} className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition-all" title="Toggle Status">
                                                {f.status === 'Scheduled' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                            </button>
                                            <button onClick={() => deleteFlight(f._id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-all" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllFlights;
