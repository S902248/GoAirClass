import { useEffect, useState } from 'react';
import {
    Plus,
    Truck,
    MapPin,
    Clock,
    Bus as BusIcon,
    ChevronRight,
    Wifi,
    Zap,
    Wind,
    Monitor,
    Armchair,
    GripVertical,
    Trash2,
    ShieldCheck
} from 'lucide-react';
import { getAllOperators, getAllRoutes, getAllBuses, getAllSchedules } from '../../api/adminApi';

const BusManagement = ({ initialTab = 'operators' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [operators, setOperators] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ops, rts, bss, schs] = await Promise.all([
                getAllOperators(),
                getAllRoutes(),
                getAllBuses(),
                getAllSchedules()
            ]);
            setOperators(ops);
            setRoutes(rts);
            setBuses(bss);
            setSchedules(schs);
        } catch (error) {
            console.error("Error fetching bus management data:", error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'operators', label: 'Bus Operators', icon: Truck },
        { id: 'routes', label: 'Routes', icon: MapPin },
        { id: 'buses', label: 'Buses', icon: BusIcon },
        { id: 'schedules', label: 'Schedules', icon: Clock }
    ];

    const SeatLayoutPreview = ({ rows, cols }) => {
        return (
            <div className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black uppercase tracking-tight text-deep-navy">Seat Layout Preview</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white border border-gray-200 rounded shadow-sm"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-[#d84e55] rounded shadow-sm"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Booked</span>
                        </div>
                    </div>
                </div>

                <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto">
                    {/* Driver Seat */}
                    <div className="absolute top-4 right-4 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <GripVertical className="h-5 w-5 text-gray-400 rotate-90" />
                    </div>

                    <div className="mt-16 grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                        {Array.from({ length: rows * cols }).map((_, i) => {
                            const isAisle = i % cols === Math.floor(cols / 2);
                            if (isAisle) return <div key={i} className="w-10 h-10"></div>;
                            return (
                                <div
                                    key={i}
                                    className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-[#d84e55] transition-all cursor-pointer group"
                                >
                                    <Armchair className="h-5 w-5 text-gray-300 group-hover:text-[#d84e55]" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-deep-navy tracking-tight uppercase">Bus Management</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Configure your fleet, routes and schedules</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300
                            ${activeTab === tab.id
                                ? 'bg-white text-[#d84e55] shadow-sm font-black'
                                : 'text-gray-500 hover:text-gray-700 font-bold'}
                        `}
                    >
                        <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-[#d84e55]' : 'text-gray-400'}`} />
                        <span className="text-xs uppercase tracking-wider">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'operators' && (
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <Truck className="h-6 w-6 text-[#d84e55]" />
                                    </div>
                                    <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Add Bus Operator</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Operator Name" placeholder="e.g. SRS Travels" />
                                    <InputField label="Contact Number" placeholder="+91 98765 43210" />
                                    <InputField label="Email Address" placeholder="contact@operator.com" />
                                    <InputField label="Company Name" placeholder="SRS Transports Pvt Ltd" />
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Status</label>
                                        <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all appearance-none outline-none">
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="w-full bg-deep-navy hover:bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                                    Save Operator
                                </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-50">
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {operators.slice(0, 5).map(op => (
                                            <tr key={op._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <p className="text-xs font-black text-deep-navy uppercase tracking-tight">{op.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">{op.email}</p>
                                                </td>
                                                <td className="px-8 py-4 text-xs font-bold text-gray-600 uppercase">{op.companyName}</td>
                                                <td className="px-8 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${op.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                        {op.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'routes' && (
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-[#d84e55]" />
                                    </div>
                                    <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Create New Route</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="From City" placeholder="Departure City" />
                                    <InputField label="To City" placeholder="Destination City" />
                                    <InputField label="Distance (km)" placeholder="e.g. 450" />
                                    <InputField label="Travel Time" placeholder="e.g. 8h 30m" />
                                </div>
                                <button className="w-full bg-deep-navy hover:bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                                    Create Route
                                </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-50">
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Route</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Distance</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {routes.map(r => (
                                            <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4 text-xs font-black text-deep-navy uppercase tracking-tight">
                                                    {r.fromCity} → {r.toCity}
                                                </td>
                                                <td className="px-8 py-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{r.distance} KM</td>
                                                <td className="px-8 py-4 text-[10px] font-black text-[#d84e55] uppercase tracking-widest">{r.duration || '8h 30m'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'buses' && (
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <BusIcon className="h-6 w-6 text-[#d84e55]" />
                                    </div>
                                    <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Add Bus Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Bus Name" placeholder="e.g. Scania Multi-Axle" />
                                    <InputField label="Bus Number" placeholder="KA-01-F-1234" />
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Bus Type</label>
                                        <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none">
                                            <option>Sleeper</option>
                                            <option>Seater</option>
                                            <option>Sleeper + Seater</option>
                                        </select>
                                    </div>
                                    <InputField label="Total Seats" placeholder="e.g. 40" type="number" />
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Operator</label>
                                        <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none">
                                            <option>Select Operator</option>
                                            {operators.map(op => <option key={op._id} value={op._id}>{op.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button className="w-full bg-deep-navy hover:bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                                    Add Bus
                                </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-50">
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bus</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Number</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {buses.map(b => (
                                            <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <p className="text-xs font-black text-deep-navy uppercase tracking-tight">{b.busName || b.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{b.busType}</p>
                                                </td>
                                                <td className="px-8 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">{b.busNumber}</td>
                                                <td className="px-8 py-4 text-[10px] font-bold text-[#d84e55] uppercase tracking-widest">{b.operator?.name || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedules' && (
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-[#d84e55]" />
                                    </div>
                                    <h2 className="text-xl font-black text-deep-navy uppercase tracking-tight">Create Schedule</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Select Bus</label>
                                        <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none shadow-sm">
                                            <option>Select Bus</option>
                                            {buses.map(b => <option key={b._id} value={b._id}>{b.busName} ({b.busNumber})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Select Route</label>
                                        <select className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none shadow-sm">
                                            <option>Select Route</option>
                                            {routes.map(r => <option key={r._id} value={r._id}>{r.fromCity} → {r.toCity}</option>)}
                                        </select>
                                    </div>
                                    <InputField label="Departure Time" type="time" />
                                    <InputField label="Arrival Time" type="time" />
                                    <InputField label="Ticket Price (₹)" placeholder="e.g. 1200" type="number" />
                                    <InputField label="Departure Date" type="date" />
                                </div>
                                <button className="w-full bg-deep-navy hover:bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                                    Create Schedule
                                </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-50">
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bus / Operator</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Route</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Time / Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {schedules.map(s => (
                                            <tr key={s._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4">
                                                    <p className="text-xs font-black text-deep-navy uppercase tracking-tight">{s.bus?.busName || 'Scania 123'}</p>
                                                    <p className="text-[10px] font-bold text-[#d84e55] uppercase tracking-widest">{s.operator?.name || 'SRS Travels'}</p>
                                                </td>
                                                <td className="px-8 py-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                    {s.route ? `${s.route.fromCity} → ${s.route.toCity}` : 'Bangalore → Mumbai'}
                                                </td>
                                                <td className="px-8 py-4">
                                                    <p className="text-xs font-black text-deep-navy uppercase tracking-tight">{s.departureTime} - {s.arrivalTime}</p>
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">₹{(s.price || 1200).toLocaleString()}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview / Sidebar Section */}
                <div className="space-y-8">
                    {activeTab === 'buses' ? (
                        <SeatLayoutPreview rows={10} cols={4} />
                    ) : (
                        <div className="bg-deep-navy p-8 rounded-[2.5rem] text-white space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-400">Management Tip</h3>
                            <p className="text-lg font-bold leading-relaxed opacity-90">
                                Ensure all operator details are verified before adding their fleet to the system. Accurate scheduling depends on correct route distance and travel time.
                            </p>
                            <div className="flex items-center gap-4 pt-4">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="h-5 w-5 text-red-400" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest">Enterprise Secured</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, placeholder, type = 'text' }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all placeholder:text-gray-300"
        />
    </div>
);

const AmenityCheckbox = ({ icon: Icon, label }) => (
    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-red-50 transition-all group border-2 border-transparent hover:border-red-100">
        <input type="checkbox" className="hidden" />
        <Icon className="h-4 w-4 text-gray-400 group-hover:text-[#d84e55]" />
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 group-hover:text-deep-navy">{label}</span>
    </label>
);

export default BusManagement;
