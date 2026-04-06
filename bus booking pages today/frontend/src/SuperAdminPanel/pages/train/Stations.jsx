import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import AddStationModal from '../../components/AddStationModal';
import trainApi from '../../../api/trainApi';
import { toast } from 'react-toastify';

const Stations = () => {
    const [search, setSearch] = useState('');
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isIdModalOpen, setIsIdModalOpen] = useState(false);
    const [newStation, setNewStation] = useState({ name: '', code: '', city: '', state: '' });

    const fetchStations = async () => {
        setLoading(true);
        try {
            const res = await trainApi.getAllStations();
            if (res.success) {
                setStations(res.stations);
            }
        } catch (error) {
            toast.error('Failed to fetch stations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    const handleAddStationSuccess = (newStation) => {
        setIsIdModalOpen(false);
        fetchStations();
    };

    const columns = [
        { key: 'code', label: 'Station Code' },
        { key: 'name', label: 'Station Name' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
    ];

    const filteredData = stations.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Stations Management</h1>
                    <p className="text-slate-500 text-sm">Add and manage railway stations across the country.</p>
                </div>
                <button 
                    onClick={() => setIsIdModalOpen(true)}
                    className="bg-train-primary hover:bg-train-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-train-primary/20 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add Station</span>
                </button>
            </div>

            <div className="card">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search stations by code or name..."
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

            <AddStationModal 
                isOpen={isIdModalOpen} 
                onClose={() => setIsIdModalOpen(false)} 
                onSuccess={handleAddStationSuccess}
            />
        </div>
    );
};

export default Stations;
