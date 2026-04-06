import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Download, Printer } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import trainApi from '../../../api/trainApi';
import { toast } from 'react-toastify';

const TrainBookings = () => {
    const [search, setSearch] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { key: 'pnr', label: 'PNR' },
        { key: 'train', label: 'Train' },
        { key: 'customer', label: 'Customer' },
        { key: 'date', label: 'Journey Date' },
        { key: 'status', label: 'Status' },
        { key: 'amount', label: 'Paid' },
        { key: 'actions', label: 'Actions' },
    ];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await trainApi.getAllBookings();
                if (res.success) {
                    const formattedData = res.bookings.map(b => ({
                        pnr: b.pnr,
                        train: b.train ? `${b.train.number} (${b.train.name})` : 'Unknown Train',
                        customer: b.customerName || (b.passengers && b.passengers[0] ? b.passengers[0].name : 'N/A'),
                        date: new Date(b.journeyDate || b.createdAt).toLocaleDateString(),
                        status: <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                                b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                b.status === 'WAITLIST' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                            }`}>{b.status}</span>,
                        amount: `₹${b.totalFare || 0}`,
                        actions: (
                            <div className="flex gap-2">
                                <button title="View Details" className="p-2 hover:bg-slate-100 rounded-lg transition-all"><Eye size={16} /></button>
                                <button title="Print Ticket" className="p-2 hover:bg-slate-100 rounded-lg transition-all"><Printer size={16} /></button>
                            </div>
                        )
                    }));
                    setBookings(formattedData);
                }
            } catch (error) {
                toast.error("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const filteredData = bookings.filter(b => 
        b.pnr.includes(search) || 
        b.customer.toLowerCase().includes(search.toLowerCase()) || 
        b.train.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Train Bookings</h1>
                    <p className="text-slate-500 text-sm">Monitor and manage all train ticket reservations.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
                        <Download size={20} />
                    </button>
                    <button className="bg-train-primary hover:bg-train-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-train-primary/20 transition-all active:scale-95">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by PNR, Train or Passenger..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary transition-all outline-none text-sm font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading bookings...</div>
                ) : (
                    <DataTable columns={columns} data={filteredData} />
                )}
            </div>
        </div>
    );
};

export default TrainBookings;
