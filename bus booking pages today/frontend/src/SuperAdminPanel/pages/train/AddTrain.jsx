import { useState, useEffect } from 'react';
import { Save, X, Train, MapPin, Calendar, Clock } from 'lucide-react';
import trainApi from '../../../api/trainApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddTrain = () => {
    const navigate = useNavigate();
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        source: '',
        destination: '',
        type: 'Superfast',
        runsOn: [],
        status: 'Active'
    });

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const res = await trainApi.getAllStations();
                if (res.success) {
                    setStations(res.stations);
                }
            } catch (error) {
                toast.error('Failed to load stations');
            }
        };
        fetchStations();
    }, []);

    const handleDayToggle = (day) => {
        const runsOn = [...formData.runsOn];
        if (runsOn.includes(day)) {
            setFormData({ ...formData, runsOn: runsOn.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, runsOn: [...runsOn, day] });
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.number || !formData.source || !formData.destination) {
            return toast.warn('Please fill all required fields');
        }

        if (formData.source === formData.destination) {
            return toast.warn('Source and Destination cannot be the same');
        }

        setLoading(true);
        try {
            const res = await trainApi.createTrain(formData);
            if (res.success) {
                toast.success('Train added successfully');
                navigate('/admin/train/all');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save train');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Add New Train</h1>
                    <p className="text-slate-500 text-sm">Register a new train to the booking system.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-8">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Train className="text-train-primary" size={20} />
                            <span>Basic Information</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Train Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Rajdhani Express" 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none transition-all font-medium"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Train Number</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 12951" 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none transition-all font-medium" 
                                    value={formData.number}
                                    onChange={e => setFormData({...formData, number: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Source Station</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none transition-all font-medium"
                                    value={formData.source}
                                    onChange={e => setFormData({...formData, source: e.target.value})}
                                >
                                    <option value="">Select Source</option>
                                    {stations.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Destination Station</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none transition-all font-medium"
                                    value={formData.destination}
                                    onChange={e => setFormData({...formData, destination: e.target.value})}
                                >
                                    <option value="">Select Destination</option>
                                    {stations.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="card p-8">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Calendar className="text-train-primary" size={20} />
                            <span>Schedule Settings</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Run Days</label>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <button 
                                            key={day} 
                                            onClick={() => handleDayToggle(day)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                formData.runsOn.includes(day) 
                                                ? 'bg-train-primary text-white' 
                                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Train Type</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none transition-all font-medium"
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                >
                                    <option>Superfast</option>
                                    <option>Express</option>
                                    <option>Rajdhani</option>
                                    <option>Shatabdi</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-8 bg-train-primary text-white shadow-xl shadow-train-primary/20">
                        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                        <p className="text-train-primary-light text-sm mb-6 opacity-90">Make sure all information is correct before saving the train.</p>
                        <div className="space-y-3">
                            <button 
                                disabled={loading}
                                onClick={handleSave}
                                className="w-full py-3 bg-white text-train-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-train-primary-light transition-all disabled:opacity-50"
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Train'}
                            </button>
                            <button 
                                onClick={() => navigate(-1)}
                                className="w-full py-3 bg-train-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all border border-white/20"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTrain;
