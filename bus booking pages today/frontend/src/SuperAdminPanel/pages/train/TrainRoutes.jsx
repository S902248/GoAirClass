import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Search, Save, Loader2, X, Clock, Check, AlertCircle, Calendar } from 'lucide-react';
import trainApi from '../../../api/trainApi';
import { toast } from 'react-toastify';

// ─── helpers ──────────────────────────────────────────────────────────────────

/** "HH:MM" → Date object on a base date */
const getDateTime = (time, baseDate = "1970-01-01") => {
    if (!time) return null;
    return new Date(`${baseDate}T${time}:00`);
};

/** 
 * Midnight-aware normalization. 
 * If departure <= arrival, it's next day.
 */
const normalizeTimes = (arrivalTime, departureTime) => {
    const arrival = getDateTime(arrivalTime);
    let departure = getDateTime(departureTime);

    if (arrival && departure && departure <= arrival) {
        // Move departure to next day
        departure.setDate(departure.getDate() + 1);
    }
    return { arrival, departure };
};

/** Returns an error string or null */
const validateStopList = (stops) => {
    for (let i = 1; i < stops.length; i++) {
        const prev = stops[i - 1];
        const curr = stops[i];
        const isLast = i === stops.length - 1;

        // At same stop: departure must be after arrival (midnight-aware)
        if (!isLast && curr.arrivalTime && curr.departureTime) {
            const { arrival, departure } = normalizeTimes(curr.arrivalTime, curr.departureTime);
            if (arrival && departure && departure <= arrival) {
                // This shouldn't happen with normalizeTimes (it adds 1 day), 
                // but if they are still equal after +1 day (impossible) or if logic changes:
                return `At ${curr.station?.name || 'stop ' + (i + 1)}: departure must be after arrival.`;
            }
        }

        // Between stops: this stop's arrival must be after previous stop's departure (midnight-aware)
        if (prev.departureTime && curr.arrivalTime) {
            const prevArrD = getDateTime(prev.arrivalTime);
            let prevDepD = getDateTime(prev.departureTime);
            let currArrD = getDateTime(curr.arrivalTime);

            // 1. Normalize prev departure relative to prev arrival
            // (If it was already normalized elsewhere, we'd use that, but here we rebuild)
            if (prevArrD && prevDepD <= prevArrD) {
                prevDepD.setDate(prevDepD.getDate() + 1);
            }

            // 2. Normalize curr arrival relative to prev departure
            // If curr arrival < prev departure, it must be the next day (or even further, but we assume +1 day)
            if (currArrD <= prevDepD) {
                currArrD.setDate(currArrD.getDate() + 1);
                // If it's still before/equal, it might even be +2 days, 
                // but for validation we just check if it's strictly after.
                if (currArrD <= prevDepD) {
                    return `${curr.station?.name || 'stop ' + (i + 1)} arrival must be later than ${prev.station?.name || 'previous stop'} departure (${prev.departureTime}).`;
                }
            }
        }
    }
    return null;
};

/** Rebuild stopNumber and stopType for each stop */
const reIndex = (stops) => stops.map((s, i) => {
    let type = 'INTERMEDIATE';
    let arrival = s.arrivalTime;
    let departure = s.departureTime;

    if (i === 0) {
        type = 'SOURCE';
        arrival = ''; // Clear arrival for source
    } else if (i === stops.length - 1) {
        type = 'DESTINATION';
        departure = ''; // Clear departure for destination
    }

    return { 
        ...s, 
        stopNumber: i + 1, 
        stopType: type,
        arrivalTime: arrival,
        departureTime: departure
    };
});

/** Calculate cumulative distance array from distanceFromPrev fields */
const calcCumulative = (stops) => {
    let sum = 0;
    return stops.map((s, i) => {
        sum += i === 0 ? 0 : Number(s.distanceFromPrev || 0);
        return sum;
    });
};

// ─── Component ────────────────────────────────────────────────────────────────

const TrainRoutes = () => {
    // Data
    const [trains, setTrains] = useState([]);
    const [allStations, setAllStations] = useState([]);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [routeStops, setRouteStops] = useState([]);

    // UI state
    const [loading, setLoading] = useState(true);
    const [routeLoading, setRouteLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchTrain, setSearchTrain] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // New stop form
    const EMPTY_STOP = { station: '', arrivalTime: '', departureTime: '', distanceFromPrev: '' };
    const [newStop, setNewStop] = useState(EMPTY_STOP);
    const [formErrors, setFormErrors] = useState({});

    // ── fetch ──────────────────────────────────────────────────────────────────
    useEffect(() => { fetchInitialData(); }, []);

    const fetchInitialData = async () => {
        try {
            const [trainsRes, stationsRes] = await Promise.all([
                trainApi.getAllTrains(),
                trainApi.getAllStations()
            ]);
            setTrains(trainsRes.trains || []);
            setAllStations(stationsRes.stations || []);
        } catch {
            toast.error('Failed to fetch trains / stations');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTrain = async (train) => {
        setSelectedTrain(train);
        setRouteLoading(true);
        try {
            const res = await trainApi.getTrainRoute(train._id);
            if (res.success && res.route?.stops?.length) {
                // Re-hydrate distanceFromPrev from stored cumulative distance
                const stops = res.route.stops.map((s, i, arr) => ({
                    ...s,
                    distanceFromPrev: i === 0 ? 0 : (s.distance || 0) - (arr[i - 1].distance || 0)
                }));
                setRouteStops(stops);
            } else {
                setRouteStops([]);
            }
        } catch {
            setRouteStops([]);
        } finally {
            setRouteLoading(false);
        }
    };

    // ── add stop ───────────────────────────────────────────────────────────────
    const getModalErrors = (stop) => {
        const errors = {};
        const isFirst = routeStops.length === 0;

        if (!stop.station) errors.station = 'Please select a station';

        // Duplicate check
        if (stop.station && routeStops.some(s => (s.station?._id || s.station) === stop.station)) {
            errors.station = 'This station is already in the route';
        }

        if (!isFirst) {
            if (!stop.arrivalTime) {
                errors.arrivalTime = 'Arrival time is required';
            } else {
                const prev = routeStops[routeStops.length - 1];
                const prevArrD = getDateTime(prev.arrivalTime);
                let prevDepD = getDateTime(prev.departureTime);
                let currArrD = getDateTime(stop.arrivalTime);

                // 1. Normalize prev departure relative to prev arrival
                if (prevArrD && prevDepD && prevDepD <= prevArrD) {
                    prevDepD.setDate(prevDepD.getDate() + 1);
                }

                // 2. Normalize curr arrival relative to prev departure
                if (currArrD && prevDepD && currArrD <= prevDepD) {
                    currArrD.setDate(currArrD.getDate() + 1);
                }

                if (prevDepD && currArrD && currArrD <= prevDepD) {
                    errors.arrivalTime = `Must be after ${prev.station?.name || 'previous'} departure (${prev.departureTime})`;
                }
            }
        }

        // Same-stop: departure must be after arrival (midnight-aware)
        if (stop.arrivalTime && stop.departureTime) {
            const arrD = getDateTime(stop.arrivalTime);
            const depD = getDateTime(stop.departureTime);

            // Only error if they are exactly the same. 
            // If dep < arr, it's treated as next day by the logic, which is valid.
            if (arrD && depD && arrD.getTime() === depD.getTime()) {
                errors.departureTime = 'Departure and arrival cannot be the same time';
            }
        }

        return errors;
    };

    const handleAddStop = () => {
        const errors = getModalErrors(newStop);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const isFirst = routeStops.length === 0;
        const stationObj = allStations.find(s => s._id === newStop.station);
        const stopToAdd = {
            station: stationObj,
            arrivalTime: newStop.arrivalTime,
            departureTime: newStop.departureTime,
            distanceFromPrev: routeStops.length === 0 ? 0 : Number(newStop.distanceFromPrev || 0),
        };

        const updatedStops = reIndex([...routeStops, stopToAdd]);
        setRouteStops(updatedStops);
        setFormErrors({});
        setNewStop(EMPTY_STOP);
        setShowAddModal(false);
    };

    // ── reorder ────────────────────────────────────────────────────────────────
    const moveStop = (index, dir) => {
        if (dir === 'up' && index === 0) return;
        if (dir === 'down' && index === routeStops.length - 1) return;

        const next = [...routeStops];
        const swap = dir === 'up' ? index - 1 : index + 1;
        [next[index], next[swap]] = [next[swap], next[index]];

        const err = validateStopList(next);
        if (err) return toast.error(err);
        setRouteStops(reIndex(next));
    };

    // ── inline time edit (always allow typing; show toast on blur/save only) ────
    const handleTimeChange = (index, field, value) => {
        // Allow the change always so user can type freely
        const updated = routeStops.map((s, i) => i === index ? { ...s, [field]: value } : s);
        setRouteStops(updated);
    };

    const handleTimeBlur = (index) => {
        const err = validateStopList(routeStops);
        if (err) toast.warning(err);
    };

    // ── remove ─────────────────────────────────────────────────────────────────
    const handleRemoveStop = (index) => {
        setRouteStops(reIndex(routeStops.filter((_, i) => i !== index)));
    };

    // ── manage runsOn ──────────────────────────────────────────────────────────
    const handleDayToggle = (day) => {
        if (!selectedTrain) return;
        const runsOn = selectedTrain.runsOn || [];
        const newRunsOn = runsOn.includes(day)
            ? runsOn.filter(d => d !== day)
            : [...runsOn, day];

        setSelectedTrain({ ...selectedTrain, runsOn: newRunsOn });
    };

    // ── save ───────────────────────────────────────────────────────────────────
    const handleSaveRoute = async () => {
        if (!selectedTrain) return;
        if (routeStops.length < 2) return toast.warning('Add at least source and destination stops');

        const err = validateStopList(routeStops);
        if (err) return toast.error(err);

        setSaving(true);
        try {
            const cumulative = calcCumulative(routeStops);
            const total = routeStops.length;
            const payload = {
                stops: routeStops.map((stop, i) => {
                    const stationId = stop.station?._id?.toString() || stop.station?.toString();
                    return {
                        station: stationId,
                        arrivalTime: stop.arrivalTime || '',
                        departureTime: stop.departureTime || '',
                        stopNumber: i + 1,
                        stopType: stop.stopType,
                        distance: cumulative[i]
                    };
                })
            };


            const res = await trainApi.updateTrainRoute(selectedTrain._id, payload);

            // Also update train basic data if runsOn changed (or just always send)
            await trainApi.updateTrain(selectedTrain._id, {
                runsOn: selectedTrain.runsOn,
                status: selectedTrain.status
            });

            if (res.success) {
                toast.success('Route saved successfully!');
            } else {
                toast.error(res.message || 'Server returned failure');
            }
        } catch (err) {
            console.error('[TrainRoutes] Save error:', err);
            const msg = err?.response?.data?.message || err?.message || 'Failed to save route';
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    // ── Derived ────────────────────────────────────────────────────────────────
    const filteredTrains = trains.filter(t =>
        t.name.toLowerCase().includes(searchTrain.toLowerCase()) ||
        t.number?.includes(searchTrain)
    );

    // Stations already used (for filtering the modal dropdown)
    const usedStationIds = new Set(routeStops.map(s => s.station?._id || s.station));

    // Cumulative distance for display
    const cumDist = calcCumulative(routeStops);

    // Total route distance
    const totalKm = cumDist[cumDist.length - 1] || 0;

    // ── node colour helpers ────────────────────────────────────────────────────
    const nodeCls = (type) => {
        if (type === 'SOURCE') return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30';
        if (type === 'DESTINATION') return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30';
        return 'bg-train-primary-light text-train-primary dark:bg-train-primary/20';
    };

    // ── Loading skeleton ───────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-train-primary" size={40} />
            </div>
        );
    }

    // ─── JSX ──────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative pb-10">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Routes & Schedule</h1>
                    <p className="text-slate-500 text-sm">Define stops, timings and distances for each train route.</p>
                </div>
                {selectedTrain && (
                    <button
                        onClick={handleSaveRoute}
                        disabled={saving}
                        className="shrink-0 bg-train-primary hover:bg-train-primary-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-train-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>Save Route</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* ── Left: Route timeline ─────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-4">
                    {selectedTrain ? (
                        <div className="card overflow-hidden">
                            {/* Card header */}
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-train-primary/5 to-transparent">
                                <div>
                                    <h2 className="text-base font-bold">{selectedTrain.name}</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-slate-400 font-bold">#{selectedTrain.number}</span>
                                        {routeStops.length >= 2 && (
                                            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                                                {routeStops.length} stops · {totalKm} km
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-train-primary text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 hover:bg-train-primary-dark transition-all shadow shadow-train-primary/20"
                                >
                                    <Plus size={15} /> Add Station
                                </button>
                            </div>

                            {/* Timeline */}
                            {routeLoading ? (
                                <div className="py-20 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-train-primary" size={28} />
                                </div>
                            ) : routeStops.length > 0 ? (
                                <div className="p-4 space-y-0 relative">
                                    {/* Vertical connector line */}
                                    <div className="absolute left-[3.15rem] top-12 bottom-12 w-px bg-slate-100 dark:bg-slate-800 border-l-2 border-dashed border-slate-200 dark:border-slate-700 pointer-events-none" />

                                    {routeStops.map((stop, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === routeStops.length - 1;

                                        return (
                                            <div key={index} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 group transition-all relative">

                                                {/* Sequence bubble */}
                                                <div className="flex flex-col items-center gap-0 shrink-0">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 ${nodeCls(stop.stopType)}`}>
                                                        {stop.stopNumber}
                                                    </div>
                                                </div>

                                                {/* Stop details grid */}
                                                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-start">

                                                    {/* Station name + code */}
                                                    <div className="col-span-2 md:col-span-2">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Station</p>
                                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black ${
                                                                stop.stopType === 'SOURCE' ? 'bg-emerald-100 text-emerald-600' :
                                                                stop.stopType === 'DESTINATION' ? 'bg-rose-100 text-rose-600' :
                                                                'bg-slate-100 text-slate-500'
                                                            }`}>
                                                                {stop.stopType}
                                                            </span>
                                                        </div>
                                                        <p className="font-bold leading-tight">{stop.station?.name || '–'}</p>
                                                        <p className="text-[10px] font-black text-train-primary uppercase mt-0.5">{stop.station?.code}</p>
                                                    </div>

                                                    {/* Arrival */}
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Arrival</p>
                                                        {isFirst ? (
                                                            <span className="text-[11px] italic text-emerald-500 font-bold">Origin</span>
                                                        ) : (
                                                            <input
                                                                type="time"
                                                                value={stop.arrivalTime}
                                                                onChange={(e) => handleTimeChange(index, 'arrivalTime', e.target.value)}
                                                                className="bg-transparent text-sm font-bold outline-none border-b border-dashed border-slate-200 dark:border-slate-700 focus:border-train-primary w-full transition-colors"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* Departure */}
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Departure</p>
                                                        {isLast ? (
                                                            <span className="text-[11px] italic text-rose-500 font-bold">Terminus</span>
                                                        ) : (
                                                            <div className="relative">
                                                                <input
                                                                    type="time"
                                                                    value={stop.departureTime}
                                                                    onChange={(e) => handleTimeChange(index, 'departureTime', e.target.value)}
                                                                    className="bg-transparent text-sm font-bold outline-none border-b border-dashed border-slate-200 dark:border-slate-700 focus:border-train-primary w-full transition-colors"
                                                                />
                                                                {stop.arrivalTime && stop.departureTime && getDateTime(stop.departureTime) <= getDateTime(stop.arrivalTime) && (
                                                                    <span className="absolute -bottom-4 left-0 text-[9px] text-train-primary font-black uppercase tracking-tighter animate-pulse">
                                                                        +1 Day
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Distance */}
                                                    <div>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Km (total)</p>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{cumDist[index]} km</p>
                                                    </div>
                                                </div>

                                                {/* Actions (hover) */}
                                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    <button
                                                        onClick={() => moveStop(index, 'up')}
                                                        disabled={isFirst}
                                                        title="Move up"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-train-primary hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 transition-all"
                                                    >
                                                        <ArrowUp size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveStop(index, 'down')}
                                                        disabled={isLast}
                                                        title="Move down"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-train-primary hover:bg-white dark:hover:bg-slate-700 disabled:opacity-20 transition-all"
                                                    >
                                                        <ArrowDown size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveStop(index)}
                                                        title="Remove"
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-20 flex flex-col items-center text-center">
                                    <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 mb-4">
                                        <Plus size={28} />
                                    </div>
                                    <p className="font-bold text-slate-600 dark:text-slate-400">No stops yet</p>
                                    <p className="text-sm text-slate-400 mt-1">Start by adding the <strong>source station</strong>.</p>
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="mt-5 bg-train-primary text-white px-5 py-2 rounded-xl text-sm font-bold shadow shadow-train-primary/20 hover:bg-train-primary-dark transition-all"
                                    >
                                        + Add Source Station
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card flex flex-col items-center justify-center py-28 text-center border-dashed border-2">
                            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 mb-4">
                                <Search size={30} />
                            </div>
                            <h3 className="text-lg font-bold">No Train Selected</h3>
                            <p className="text-slate-500 text-sm mt-1.5 max-w-56">Select a train from the sidebar to start scheduling its route.</p>
                        </div>
                    )}

                    {/* Legend */}
                    {routeStops.length > 0 && (
                        <div className="flex flex-wrap gap-4 text-xs font-bold px-1 text-slate-500">
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>Origin</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-train-primary inline-block"></span>Intermediate</span>
                            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>Terminus</span>
                            <span className="ml-auto text-slate-400">↕ Hover stop to reorder</span>
                        </div>
                    )}
                </div>

                {/* ── Right: Train list ─────────────────────────────────────── */}
                <div>
                    <div className="card p-5">
                        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-train-primary rounded-full inline-block"></span>
                            Select Train
                        </h3>

                        {/* Runs On management */}
                        {selectedTrain && (
                            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-in slide-in-from-top duration-300">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <Calendar size={12} className="text-train-primary" /> Days of Operation
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <button
                                            key={day}
                                            onClick={() => handleDayToggle(day)}
                                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black transition-all border ${selectedTrain.runsOn?.includes(day)
                                                    ? 'bg-train-primary text-white border-train-primary'
                                                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-200'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search train..."
                                value={searchTrain}
                                onChange={(e) => setSearchTrain(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border-none outline-none text-sm font-medium focus:ring-2 focus:ring-train-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-0.5">
                            {filteredTrains.length === 0 && (
                                <p className="text-center text-slate-400 text-sm py-6">No trains found</p>
                            )}
                            {filteredTrains.map(train => {
                                const active = selectedTrain?._id === train._id;
                                return (
                                    <button
                                        key={train._id}
                                        onClick={() => handleSelectTrain(train)}
                                        className={`w-full text-left p-3.5 rounded-xl transition-all border ${active
                                            ? 'bg-train-primary-light/40 border-train-primary/50 dark:bg-train-primary/20'
                                            : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-100 dark:hover:border-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className={`text-[10px] font-black uppercase tracking-wider ${active ? 'text-train-primary' : 'text-slate-400'}`}>#{train.number}</p>
                                            {active && <Check size={12} className="text-train-primary" />}
                                        </div>
                                        <p className="font-bold text-sm mt-0.5 truncate">{train.name}</p>
                                        {train.type && <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">{train.type}</p>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Add Station Modal ─────────────────────────────────────────── */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-7 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">

                        {/* Modal header */}
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold">Add Station</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Stop <span className="text-train-primary font-black">#{routeStops.length + 1}</span>
                                    {routeStops.length === 0 ? ' — Source Station' : ' — New Station'}
                                </p>
                            </div>
                            <button
                                onClick={() => { setShowAddModal(false); setNewStop(EMPTY_STOP); setFormErrors({}); }}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Station selector – exclude already used */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">Station</label>
                                <select
                                    value={newStop.station}
                                    onChange={(e) => { setNewStop({ ...newStop, station: e.target.value }); setFormErrors(f => ({ ...f, station: undefined })); }}
                                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium outline-none focus:ring-2 transition-all ${formErrors.station ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-train-primary'
                                        }`}
                                >
                                    <option value="">— choose station —</option>
                                    {allStations.map(s => (
                                        <option key={s._id} value={s._id} disabled={usedStationIds.has(s._id)}>
                                            {usedStationIds.has(s._id) ? `✓ ` : ''}{s.name} ({s.code})
                                        </option>
                                    ))}
                                </select>
                                {formErrors.station && (
                                    <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                                        <AlertCircle size={12} /> {formErrors.station}
                                    </p>
                                )}
                            </div>

                            {/* Times */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Clock size={11} className="text-train-primary" /> Arrival
                                    </label>
                                    {routeStops.length === 0 ? (
                                        <div className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 text-sm italic cursor-not-allowed select-none">
                                            N/A (Origin)
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                type="time"
                                                value={newStop.arrivalTime}
                                                onChange={(e) => { setNewStop({ ...newStop, arrivalTime: e.target.value }); setFormErrors(f => ({ ...f, arrivalTime: undefined })); }}
                                                className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium outline-none focus:ring-2 transition-all ${formErrors.arrivalTime ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-train-primary'
                                                    }`}
                                            />
                                            {formErrors.arrivalTime && (
                                                <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                                                    <AlertCircle size={12} /> {formErrors.arrivalTime}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                        <Clock size={11} className="text-train-primary" /> Departure
                                    </label>
                                    <input
                                        type="time"
                                        value={newStop.departureTime}
                                        onChange={(e) => { setNewStop({ ...newStop, departureTime: e.target.value }); setFormErrors(f => ({ ...f, departureTime: undefined })); }}
                                        className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium outline-none focus:ring-2 transition-all ${formErrors.departureTime ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-train-primary'
                                            }`}
                                    />
                                    {newStop.arrivalTime && newStop.departureTime && getDateTime(newStop.departureTime) <= getDateTime(newStop.arrivalTime) && (
                                        <p className="text-[10px] text-train-primary font-bold flex items-center gap-1 mt-1">
                                            <Clock size={10} /> Next day departure
                                        </p>
                                    )}
                                    {formErrors.departureTime && (
                                        <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                                            <AlertCircle size={12} /> {formErrors.departureTime}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Distance from previous */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-wider">
                                    Distance from previous stop (km)
                                </label>
                                {routeStops.length === 0 ? (
                                    <div className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 text-sm italic cursor-not-allowed select-none">
                                        0 km (Origin)
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type="number"
                                            placeholder="e.g. 120"
                                            min="0"
                                            value={newStop.distanceFromPrev}
                                            onChange={(e) => setNewStop({ ...newStop, distanceFromPrev: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-train-primary transition-all"
                                        />
                                        {routeStops.length > 0 && Number(newStop.distanceFromPrev) > 0 && (
                                            <p className="text-xs text-train-primary font-bold px-1">
                                                Total route will be {totalKm + Number(newStop.distanceFromPrev || 0)} km
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Hint for station position */}
                            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3">
                                <AlertCircle size={14} className="text-blue-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                                    {routeStops.length === 0 
                                        ? "This will be the SOURCE station." 
                                        : "This station will be added as the new DESTINATION."}
                                    <br />
                                    <span className="opacity-70">Stop types are managed automatically by the system.</span>
                                </p>
                            </div>

                            <button
                                onClick={handleAddStop}
                                className="w-full bg-train-primary hover:bg-train-primary-dark text-white py-4 rounded-2xl font-bold shadow-lg shadow-train-primary/20 transition-all active:scale-95 mt-1"
                            >
                                Add to Route
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainRoutes;
