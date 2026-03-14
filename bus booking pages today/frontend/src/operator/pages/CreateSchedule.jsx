import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Bus, MapPin, ArrowLeft, Save, IndianRupee, Info, Plus, Trash2 } from 'lucide-react';
import { getOperatorBuses } from '../../api/busApi';
import { getAllRoutes } from '../../api/routeApi';
import { createSchedule } from '../../api/scheduleApi';
import LocationInput from '../../components/LocationInput';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CreateSchedule = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [formData, setFormData] = useState({
        bus: '',
        route: '',
        startDate: '',
        frequency: 'daily',
        departureTime: '',
        arrivalTime: '',
        ticketPrice: '',
        boardingPoints: [{ location: '', time: '', lat: null, lng: null }],
        droppingPoints: [{ location: '', time: '', lat: null, lng: null }]
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [busesData, routesData] = await Promise.all([
                    getOperatorBuses(),
                    getAllRoutes()
                ]);
                setBuses(busesData);
                setRoutes(routesData);
            } catch (err) {
                console.error('Error loading data:', err);
            }
        };
        loadInitialData();
    }, []);

    const handleAddPoint = (type) => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], { location: '', time: '', lat: null, lng: null }]
        }));
    };

    const handleRemovePoint = (type, index) => {
        if (formData[type].length <= 1) return;
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handlePointChange = (type, index, field, value) => {
        const updatedPoints = [...formData[type]];
        if (typeof value === 'object' && value !== null) {
            // Bulk update for LocationInput (location, lat, lng)
            updatedPoints[index] = { ...updatedPoints[index], ...value };
        } else {
            updatedPoints[index][field] = value;
        }
        setFormData(prev => ({
            ...prev,
            [type]: updatedPoints
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Validation: Ensure all points have location and time
            const cleanBoarding = formData.boardingPoints.filter(p => p.location && p.time);
            const cleanDropping = formData.droppingPoints.filter(p => p.location && p.time);

            if (cleanBoarding.length === 0 || cleanDropping.length === 0) {
                alert('Please add at least one boarding and one dropping point with location and time.');
                setLoading(false);
                return;
            }

            // Find selected bus to get totalSeats
            const selectedBus = buses.find(b => b._id === formData.bus);

            const payload = {
                ...formData,
                boardingPoints: cleanBoarding,
                droppingPoints: cleanDropping,
                availableSeats: selectedBus ? selectedBus.totalSeats : 40
            };

            await createSchedule(payload);
            navigate('/operator/schedules');
        } catch (err) {
            alert(err.error || 'Failed to create schedule');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/operator/schedules')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">Schedule Trip</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Assign units and routes to active timelines</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        form="schedule-form"
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 bg-[#d84e55] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Scheduling...' : 'Confirm Schedule'}
                    </button>
                </div>
            </div>

            <form id="schedule-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Primary Config */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50 space-y-10">
                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight">Assignment</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select hardware and transit path</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Select Bus</label>
                                    <select
                                        required
                                        value={formData.bus}
                                        onChange={e => setFormData({ ...formData, bus: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-red-50/50 appearance-none outline-none"
                                    >
                                        <option value="">-- Choose Unit --</option>
                                        {buses.map(bus => (
                                            <option key={bus._id} value={bus._id}>{bus.busName} ({bus.busNumber})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Select Route</label>
                                    <select
                                        required
                                        value={formData.route}
                                        onChange={e => setFormData({ ...formData, route: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-red-50/50 appearance-none outline-none"
                                    >
                                        <option value="">-- Choose Path --</option>
                                        {routes.map(route => (
                                            <option key={route._id} value={route._id}>{route.fromCity} ➔ {route.toCity}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight">Time & Pricing</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Define travel window and cost</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <FormInput
                                    label="Start Date"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={v => setFormData({ ...formData, startDate: v })}
                                />
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Frequency</label>
                                    <select
                                        value={formData.frequency}
                                        onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-red-50/50 appearance-none outline-none"
                                    >
                                        <option value="daily">Daily</option>
                                    </select>
                                </div>
                                <div className="w-full">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Ticket Price (INR)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                                        <input
                                            type="number"
                                            required
                                            value={formData.ticketPrice}
                                            onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })}
                                            placeholder="1200"
                                            className="w-full bg-gray-50 border-none rounded-2xl py-5 pl-14 pr-8 text-sm font-bold focus:ring-4 focus:ring-emerald-50 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormInput
                                    label="Departure Time"
                                    type="time"
                                    value={formData.departureTime}
                                    onChange={v => setFormData({ ...formData, departureTime: v })}
                                />
                                <FormInput
                                    label="Arrival Time"
                                    type="time"
                                    value={formData.arrivalTime}
                                    onChange={v => setFormData({ ...formData, arrivalTime: v })}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Boarding/Dropping Points */}
                    <div className="space-y-10">
                        {/* Boarding Points */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight">Boarding Points</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Define pickup locations and times</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleAddPoint('boardingPoints')}
                                    className="p-3 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.boardingPoints.map((point, index) => (
                                    <div key={index} className="space-y-4 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-end">
                                            <div className="md:col-span-4">
                                                <LocationInput
                                                    label="Boarding Location"
                                                    value={point.location}
                                                    onChange={(val) => handlePointChange('boardingPoints', index, null, val)}
                                                    placeholder="Search boarding point..."
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block px-1">Time</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={point.time}
                                                    onChange={(e) => handlePointChange('boardingPoints', index, 'time', e.target.value)}
                                                    className="w-full bg-white border-none rounded-xl py-4 px-6 text-xs font-bold focus:ring-4 focus:ring-purple-50 outline-none"
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePoint('boardingPoints', index)}
                                                    disabled={formData.boardingPoints.length <= 1}
                                                    className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-[#d84e55] hover:text-white transition-all disabled:opacity-30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {point.lat && point.lng && (
                                            <div className="h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                                                <MapContainer 
                                                    center={[point.lat, point.lng]} 
                                                    zoom={15} 
                                                    style={{ height: '100%', width: '100%' }}
                                                    zoomControl={false}
                                                >
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={[point.lat, point.lng]}>
                                                        <Popup>{point.location}</Popup>
                                                    </Marker>
                                                </MapContainer>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dropping Points */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight">Dropping Points</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Define arrival locations and times</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleAddPoint('droppingPoints')}
                                    className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.droppingPoints.map((point, index) => (
                                    <div key={index} className="space-y-4 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-end">
                                            <div className="md:col-span-4">
                                                <LocationInput
                                                    label="Dropping Location"
                                                    value={point.location}
                                                    onChange={(val) => handlePointChange('droppingPoints', index, null, val)}
                                                    placeholder="Search drop point..."
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block px-1">Time</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={point.time}
                                                    onChange={(e) => handlePointChange('droppingPoints', index, 'time', e.target.value)}
                                                    className="w-full bg-white border-none rounded-xl py-4 px-6 text-xs font-bold focus:ring-4 focus:ring-emerald-50 outline-none"
                                                />
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePoint('droppingPoints', index)}
                                                    disabled={formData.droppingPoints.length <= 1}
                                                    className="p-4 bg-red-50 text-red-500 rounded-xl hover:bg-[#d84e55] hover:text-white transition-all disabled:opacity-30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {point.lat && point.lng && (
                                            <div className="h-40 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                                                <MapContainer 
                                                    center={[point.lat, point.lng]} 
                                                    zoom={15} 
                                                    style={{ height: '100%', width: '100%' }}
                                                    zoomControl={false}
                                                >
                                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                    <Marker position={[point.lat, point.lng]}>
                                                        <Popup>{point.location}</Popup>
                                                    </Marker>
                                                </MapContainer>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-8">
                    <div className="bg-[#0F172A] p-10 rounded-[3rem] shadow-2xl text-white sticky top-10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-[5rem] -mr-10 -mt-10"></div>
                        <h3 className="text-xl font-black tracking-tight uppercase italic mb-10 flex items-center gap-3">
                            <Info className="h-5 w-5 text-[#d84e55]" /> Schedule Guide
                        </h3>

                        <div className="space-y-8 relative">
                            <div className="flex gap-6">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black text-[#d84e55]">01</span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">Only buses registered under your operator account are available for selection.</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black text-[#d84e55]">02</span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">Boarding and dropping points are specific to this schedule and will be visible to users during booking.</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-black text-[#d84e55]">03</span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-400 leading-relaxed uppercase tracking-tight">A daily schedule means this trip will be active every day starting from the selected date.</p>
                            </div>
                        </div>

                        <div className="mt-12 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Live Availability</p>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-gray-300 uppercase">Seats Auto-Sync</span>
                                <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative">
                                    <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <p className="text-[9px] font-bold text-gray-500 uppercase leading-relaxed">System will automatically track bookings and update seat counts based on bus capacity.</p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
        <input
            type={type}
            required
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-50 border-none rounded-[1.5rem] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-red-50/50 transition-all outline-none"
        />
    </div>
);

export default CreateSchedule;

