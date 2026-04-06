import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import trainApi from '../../../api/trainApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AllTrains = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrains = async () => {
        setLoading(true);
        try {
            const res = await trainApi.getAllTrains();
            if (res.success) {
                setTrains(res.trains);
            }
        } catch (error) {
            toast.error('Failed to fetch trains');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrains();
    }, []);

    const columns = [
        { key: 'number', label: 'Train No.' },
        { key: 'name', label: 'Train Name' },
        { 
            key: 'route', 
            label: 'Route',
            render: (_, row) => `${row.source?.name || 'N/A'} - ${row.destination?.name || 'N/A'}`
        },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
    ];

    const filteredData = trains.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) || 
        t.number.includes(search)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">All Trains</h1>
                    <p className="text-slate-500 text-sm">Manage and monitor all trains in the system.</p>
                </div>
                <button 
                    onClick={() => navigate('/admin/train/add-train')}
                    className="bg-train-primary hover:bg-train-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-train-primary/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add New Train</span>
                </button>
            </div>

            <div className="card">
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search trains by name or number..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary transition-all outline-none text-sm font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <DataTable 
                    columns={columns} 
                    data={filteredData} 
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default AllTrains;
