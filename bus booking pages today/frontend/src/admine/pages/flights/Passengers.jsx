import { useEffect, useState } from 'react';
import { UsersRound, Search } from 'lucide-react';
import flightApi from '../../../api/flightApi';

const Passengers = () => {
    const [passengers, setPassengers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        flightApi.getAllPassengers()
            .then(d => setPassengers(d.passengers || []))
            .catch(e => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const filtered = passengers.filter(p => {
        const q = search.toLowerCase();
        return !search ||
            p.name?.toLowerCase().includes(q) ||
            p.flightId?.flightNumber?.toLowerCase().includes(q) ||
            p.seatNumber?.toLowerCase().includes(q);
    });

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-200">
                    <UsersRound size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Passengers</h1>
                    <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">{passengers.length} REGISTERED PASSENGERS</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500 transition-all"
                        placeholder="SEARCH BY NAME, FLIGHT OR SEAT..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                            {['Passenger Name', 'Age', 'Gender', 'Seat No.', 'Flight Number', 'Booking ID'].map(h => (
                                <th key={h} className="text-left px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={6} className="px-5 py-16 text-center text-gray-400 font-bold uppercase tracking-wider">No passengers found</td></tr>
                        ) : filtered.map(p => (
                            <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-5 py-4 font-black text-gray-800">{p.name}</td>
                                <td className="px-5 py-4 font-bold text-gray-500">{p.age}</td>
                                <td className="px-5 py-4">
                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest
                                        ${p.gender === 'Male' ? 'bg-blue-50 text-blue-600' :
                                          p.gender === 'Female' ? 'bg-pink-50 text-pink-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {p.gender}
                                    </span>
                                </td>
                                <td className="px-5 py-4 font-black text-gray-700">{p.seatNumber || '—'}</td>
                                <td className="px-5 py-4 font-black text-cyan-600">{p.flightId?.flightNumber || '—'}</td>
                                <td className="px-5 py-4 font-mono font-bold text-gray-400">{p.bookingId?._id?.slice(-8).toUpperCase() || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Passengers;
