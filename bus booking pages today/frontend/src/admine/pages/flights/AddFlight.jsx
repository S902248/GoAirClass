import { useEffect, useState, useMemo } from 'react';
import { Plane, Plus, Calendar, Clock, Users, ArrowRight, CheckCircle2, Info, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import flightApi from '../../../api/flightApi';
import dayjs from 'dayjs';

const Card = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm ${className}`}>
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <Icon size={22} strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-black tracking-tight text-slate-800 uppercase">{title}</h2>
        </div>
        {children}
    </div>
);

const Field = ({ label, children, error }) => (
    <div className="space-y-2.5">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
        {children}
        {error && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest pl-1">{error}</p>}
    </div>
);

const inputCls = "w-full px-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:border-sky-500/20 focus:ring-4 focus:ring-sky-500/5 transition-all outline-none";

const DAYS = [
    { label: 'S', value: 0 }, { label: 'M', value: 1 }, { label: 'T', value: 2 },
    { label: 'W', value: 3 }, { label: 'T', value: 4 }, { label: 'F', value: 5 }, { label: 'S', value: 6 }
];

const AIRCRAFT_TYPES = ['Airbus A320', 'Airbus A321neo', 'Boeing 737-800', 'Boeing 737 MAX', 'ATR 72', 'Bombardier Q400'];

const AddFlight = () => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    
    const [form, setForm] = useState({
        flightNumber: '', airlineId: '', fromAirport: '', toAirport: '',
        departureTime: '10:00', arrivalTime: '12:30', duration: '2H 30M',
        operatingDays: [1, 2, 3, 4, 5], // Weekdays default
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
        aircraftType: 'Airbus A320',
        economy: { seats: 150, price: 3500 },
        business: { seats: 12, price: 8500 }
    });

    // Auto-calculate duration
    useEffect(() => {
        if (form.departureTime && form.arrivalTime) {
            const [dh, dm] = form.departureTime.split(':').map(Number);
            const [ah, am] = form.arrivalTime.split(':').map(Number);
            
            let diff = (ah * 60 + am) - (dh * 60 + dm);
            if (diff < 0) diff += 1440; // Next day arrival
            
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            setForm(f => ({ ...f, duration: `${h}H ${m}M` }));
        }
    }, [form.departureTime, form.arrivalTime]);

    useEffect(() => {
        Promise.all([flightApi.getAirports(), flightApi.getAirlines()])
            .then(([a, b]) => {
                setAirports(a.airports || []);
                setAirlines(b.airlines || []);
            });
    }, []);

    const toggleDay = (day) => {
        setForm(f => ({
            ...f,
            operatingDays: f.operatingDays.includes(day)
                ? f.operatingDays.filter(d => d !== day)
                : [...f.operatingDays, day]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.fromAirport === form.toAirport) return setError('Route must be valid');
        if (form.operatingDays.length === 0) return setError('Select at least one operating day');
        
        setSaving(true);
        try {
            await flightApi.createFlightSchedule({
                ...form,
                configuration: {
                    economy: { seats: Number(form.economy.seats), price: Number(form.economy.price) },
                    business: { seats: Number(form.business.seats), price: Number(form.business.price) }
                }
            });
            navigate('/admine/flights/all');
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-12 font-inter">
            <div className="max-w-6xl mx-auto">
                <header className="flex items-center justify-between mb-16">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-sky-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-sky-200">
                            <Plane size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">Airline Manager</h1>
                            <p className="text-slate-400 font-bold text-xs tracking-[0.2em] uppercase mt-1">GDS / OPS / Scheduling System</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        {['Draft', 'Review', 'Published'].map((s, idx) => (
                            <div key={s} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'bg-sky-600 text-white' : 'text-slate-400'}`}>
                                {s}
                            </div>
                        ))}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        {/* Route & Basic Info */}
                        <Card title="Flight Route Information" icon={LayoutGrid}>
                            <div className="grid grid-cols-2 gap-8">
                                <Field label="Flight Number">
                                    <input required className={inputCls} placeholder="E.G. AI-202" value={form.flightNumber} onChange={e => setForm({ ...form, flightNumber: e.target.value.toUpperCase() })} />
                                </Field>
                                <Field label="Airline">
                                    <select required className={inputCls} value={form.airlineId} onChange={e => setForm({ ...form, airlineId: e.target.value })}>
                                        <option value="">Select Airline Carrier</option>
                                        {airlines.map(a => <option key={a._id} value={a._id}>{a.airlineName}</option>)}
                                    </select>
                                </Field>
                                <Field label="Departure Station">
                                    <select required className={inputCls} value={form.fromAirport} onChange={e => setForm({ ...form, fromAirport: e.target.value })}>
                                        <option value="">Origin Airport</option>
                                        {airports.map(a => <option key={a._id} value={a._id}>{a.airportCode} — {a.city}</option>)}
                                    </select>
                                </Field>
                                <Field label="Arrival Station">
                                    <select required className={inputCls} value={form.toAirport} onChange={e => setForm({ ...form, toAirport: e.target.value })}>
                                        <option value="">Destination Airport</option>
                                        {airports.map(a => <option key={a._id} value={a._id}>{a.airportCode} — {a.city}</option>)}
                                    </select>
                                </Field>
                            </div>
                        </Card>

                        {/* Schedule & Timing */}
                        <Card title="Operation Schedule" icon={Calendar}>
                            <div className="space-y-10">
                                <Field label="Operating Days">
                                    <div className="flex gap-4">
                                        {DAYS.map(d => (
                                            <button 
                                                key={d.value} 
                                                type="button"
                                                onClick={() => toggleDay(d.value)}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm transition-all border-2
                                                    ${form.operatingDays.includes(d.value) 
                                                        ? 'bg-sky-600 border-sky-600 text-white shadow-xl shadow-sky-200 scale-110' 
                                                        : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'}`}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </Field>

                                <div className="grid grid-cols-2 gap-8">
                                    <Field label="Service Start">
                                        <input type="date" className={inputCls} value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                                    </Field>
                                    <Field label="Service End">
                                        <input type="date" className={inputCls} value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                                    </Field>
                                    <Field label="Departure Time (24h)">
                                        <div className="relative">
                                            <input type="time" className={inputCls} value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} />
                                            <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                        </div>
                                    </Field>
                                    <Field label="Arrival Time (24h)">
                                        <div className="relative">
                                            <input type="time" className={inputCls} value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} />
                                            <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={18} />
                                        </div>
                                    </Field>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        {/* Summary Box */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Info size={18} className="text-sky-400" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">Duration Summary</h3>
                                </div>
                                <div className="text-5xl font-black italic tracking-tighter mb-4">{form.duration}</div>
                                <p className="text-slate-400 text-sm font-medium">Estimated block time for this route using {form.aircraftType}.</p>
                            </div>
                            <div className="absolute -right-8 -bottom-8 opacity-10">
                                <Plane size={240} className="rotate-45" />
                            </div>
                        </div>

                        {/* Aircraft & Capacity */}
                        <Card title="Aircraft & Seats" icon={Users}>
                            <div className="space-y-8">
                                <Field label="Aircraft Category">
                                    <select className={inputCls} value={form.aircraftType} onChange={e => setForm({ ...form, aircraftType: e.target.value })}>
                                        {AIRCRAFT_TYPES.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </Field>
                                
                                <div className="p-6 bg-slate-50 rounded-3xl space-y-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Economy Class</p>
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Seats" className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-xs font-bold" value={form.economy.seats} onChange={e => setForm({ ...form, economy: { ...form.economy, seats: e.target.value } })} />
                                        <input type="number" placeholder="Price" className="w-full h-12 px-4 bg-white border border-slate-100 rounded-xl text-xs font-bold text-emerald-600" value={form.economy.price} onChange={e => setForm({ ...form, economy: { ...form.economy, price: e.target.value } })} />
                                    </div>
                                </div>

                                <div className="p-6 border-2 border-slate-100 rounded-3xl space-y-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Class</p>
                                        <CheckCircle2 size={16} className="text-slate-200" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Seats" className="w-full h-12 px-4 bg-slate-50/50 rounded-xl text-xs font-bold" value={form.business.seats} onChange={e => setForm({ ...form, business: { ...form.business, seats: e.target.value } })} />
                                        <input type="number" placeholder="Price" className="w-full h-12 px-4 bg-slate-50/50 rounded-xl text-xs font-bold text-sky-600" value={form.business.price} onChange={e => setForm({ ...form, business: { ...form.business, price: e.target.value } })} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-4">
                            {error && <div className="p-6 bg-rose-50 text-rose-500 rounded-3xl text-xs font-black uppercase tracking-widest border border-rose-100 text-center">{error}</div>}
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="w-full h-20 bg-sky-600 hover:bg-sky-700 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-sky-200 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Plus size={20} /> {saving ? 'Initializing Schedule...' : 'Publish Schedule'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/admine/flights/all')}
                                className="w-full h-16 bg-white hover:bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFlight;
