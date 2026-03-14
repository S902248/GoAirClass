import { useEffect, useState } from 'react';
import { Plane, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import flightApi from '../../../api/flightApi';

const Field = ({ label, children }) => (
    <div>
        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 transition-all";

const AddFlight = () => {
    const navigate = useNavigate();
    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        flightNumber: '', airlineId: '', fromAirport: '', toAirport: '',
        departureTime: '', arrivalTime: '', duration: '', price: '',
        totalSeats: '', availableSeats: '', baggageAllowance: '15 kg', status: 'Scheduled',
    });

    useEffect(() => {
        Promise.all([
            flightApi.getAirports(),
            flightApi.getAirlines(),
        ]).then(([a, b]) => {
            setAirports(a.airports || []);
            setAirlines(b.airlines || []);
        });
    }, []);

    const set = (key, value) => setForm(f => ({ ...f, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.fromAirport === form.toAirport) {
            setError('Departure and Arrival airports must be different.');
            return;
        }
        setSaving(true);
        try {
            await flightApi.createFlight({
                ...form,
                price: Number(form.price),
                totalSeats: Number(form.totalSeats),
                availableSeats: form.availableSeats ? Number(form.availableSeats) : Number(form.totalSeats),
            });
            navigate('/admine/flights/all');
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to create flight');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-200">
                    <Plane size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">Schedule Flight</h1>
                    <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">Add new flight to system</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl space-y-8">
                {error && (
                    <div className="p-4 bg-rose-50 rounded-xl text-rose-600 text-sm font-black uppercase tracking-wider border border-rose-100">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Flight Number">
                        <input required className={inputCls} value={form.flightNumber} onChange={e => set('flightNumber', e.target.value)} placeholder="E.G. AI-202" />
                    </Field>
                    <Field label="Airline">
                        <select required className={inputCls} value={form.airlineId} onChange={e => set('airlineId', e.target.value)}>
                            <option value="">SELECT AIRLINE</option>
                            {airlines.map(a => <option key={a._id} value={a._id}>{a.airlineName} ({a.airlineCode})</option>)}
                        </select>
                    </Field>
                    <Field label="Departure Airport">
                        <select required className={inputCls} value={form.fromAirport} onChange={e => set('fromAirport', e.target.value)}>
                            <option value="">SELECT AIRPORT</option>
                            {airports.map(a => <option key={a._id} value={a._id}>{a.airportName} — {a.city}</option>)}
                        </select>
                    </Field>
                    <Field label="Arrival Airport">
                        <select required className={inputCls} value={form.toAirport} onChange={e => set('toAirport', e.target.value)}>
                            <option value="">SELECT AIRPORT</option>
                            {airports.map(a => <option key={a._id} value={a._id}>{a.airportName} — {a.city}</option>)}
                        </select>
                    </Field>
                    <Field label="Departure Time">
                        <input required type="datetime-local" className={inputCls} value={form.departureTime} onChange={e => set('departureTime', e.target.value)} />
                    </Field>
                    <Field label="Arrival Time">
                        <input required type="datetime-local" className={inputCls} value={form.arrivalTime} onChange={e => set('arrivalTime', e.target.value)} />
                    </Field>
                    <Field label="Duration">
                        <input required className={inputCls} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="2H 30M" />
                    </Field>
                    <Field label="Price (₹)">
                        <input required type="number" min="0" className={inputCls} value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
                    </Field>
                    <Field label="Total Seats">
                        <input required type="number" min="1" className={inputCls} value={form.totalSeats} onChange={e => set('totalSeats', e.target.value)} />
                    </Field>
                    <Field label="Available Seats">
                        <input required type="number" min="0" className={inputCls} value={form.availableSeats} onChange={e => set('availableSeats', e.target.value)} />
                    </Field>
                    <Field label="Baggage Allowance">
                        <input className={inputCls} value={form.baggageAllowance} onChange={e => set('baggageAllowance', e.target.value)} placeholder="15 KG" />
                    </Field>
                    <Field label="Status">
                        <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                            <option>Scheduled</option>
                            <option>Delayed</option>
                            <option>Cancelled</option>
                            <option>Completed</option>
                        </select>
                    </Field>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3.5 bg-[#d84e55] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#b03a40] transition-colors shadow-lg shadow-red-200 disabled:opacity-50">
                        <Plus size={18} /> {saving ? 'SAVING...' : 'SAVE FLIGHT'}
                    </button>
                    <button type="button" onClick={() => navigate('/admine/flights/all')} className="px-8 py-3.5 bg-gray-100 text-gray-500 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-200 transition-colors">
                        CANCEL
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFlight;
