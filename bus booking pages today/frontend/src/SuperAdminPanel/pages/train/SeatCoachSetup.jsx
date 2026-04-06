import { useState, useEffect } from 'react';
import { Layout, Plus, Trash2, Info, Save, Train, ChevronDown, Package, Hash, Armchair, Pencil, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import trainApi from '../../../api/trainApi';

const SeatCoachSetup = () => {
    // ─── State ───────────────────────────────────────────────────────────────
    const [trains, setTrains] = useState([]);
    const [selectedTrainId, setSelectedTrainId] = useState('');
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [coachTypes, setCoachTypes] = useState([]); // Master catalog
    const [coaches, setCoaches] = useState([]); // Per-train coaches
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadingCoaches, setLoadingCoaches] = useState(false);

    // ─── Initial Load: Trains + Coach Types ──────────────────────────────────
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const [trainsRes, typesRes] = await Promise.all([
                    trainApi.getAllTrains(),
                    trainApi.getCoachTypes()
                ]);
                if (trainsRes.success) setTrains(trainsRes.trains || []);
                if (typesRes.success) setCoachTypes(typesRes.coachTypes || []);
            } catch (error) {
                console.error('Failed to load initial data:', error);
                toast.error("Failed to load trains and coach types");
            } finally {
                setLoading(false);
            }
        };
        fetchInitial();
    }, []);

    // ─── Load Coaches When Train Changes ─────────────────────────────────────
    useEffect(() => {
        if (!selectedTrainId) {
            setCoaches([]);
            setSelectedTrain(null);
            return;
        }

        const train = trains.find(t => (t._id || t.id) === selectedTrainId);
        setSelectedTrain(train);

        const fetchCoaches = async () => {
            setLoadingCoaches(true);
            try {
                const res = await trainApi.getTrainCoaches(selectedTrainId);
                if (res.success) {
                    setCoaches((res.coaches || []).map(c => ({
                        _id: c._id,
                        coachTypeId: c.coachType?._id || c.coachTypeId,
                        coachTypeName: c.coachType?.name || 'Unknown',
                        coachTypeFullName: c.coachType?.fullName || '',
                        coachCount: c.coachCount || 1,
                        seatsPerCoach: c.seatsPerCoach || 72,
                        price: c.price || 0,
                        tatkalPrice: c.tatkalPrice || 0
                    })));
                }
            } catch (error) {
                console.error('Failed to load coaches:', error);
                toast.error("Failed to load coach configuration");
            } finally {
                setLoadingCoaches(false);
            }
        };
        fetchCoaches();
    }, [selectedTrainId, trains]);

    // ─── Add Coach ───────────────────────────────────────────────────────────
    const handleAddCoach = () => {
        // Find coach types not already added
        const usedTypeIds = coaches.map(c => c.coachTypeId);
        const availableTypes = coachTypes.filter(ct => !usedTypeIds.includes(ct._id));

        if (availableTypes.length === 0) {
            toast.warning("All coach types have been added to this train");
            return;
        }

        const firstAvailable = availableTypes[0];
        setCoaches([...coaches, {
            _id: `new_${Date.now()}`,
            coachTypeId: firstAvailable._id,
            coachTypeName: firstAvailable.name,
            coachTypeFullName: firstAvailable.fullName,
            coachCount: 1,
            seatsPerCoach: firstAvailable.defaultSeats || 72,
            price: 0,
            tatkalPrice: 0
        }]);
    };

    // ─── Update Coach Field ──────────────────────────────────────────────────
    const updateCoach = (id, field, value) => {
        setCoaches(coaches.map(c => {
            if (c._id !== id) return c;
            if (field === 'coachTypeId') {
                const type = coachTypes.find(ct => ct._id === value);
                return {
                    ...c,
                    coachTypeId: value,
                    coachTypeName: type?.name || '',
                    coachTypeFullName: type?.fullName || '',
                    seatsPerCoach: type?.defaultSeats || c.seatsPerCoach
                };
            }
            return { ...c, [field]: value };
        }));
    };

    // ─── Delete Coach ────────────────────────────────────────────────────────
    const handleDeleteCoach = (id) => {
        setCoaches(coaches.filter(c => c._id !== id));
    };

    // ─── Save Configuration ──────────────────────────────────────────────────
    const handleSave = async () => {
        if (!selectedTrainId) {
            toast.warning("Please select a train first");
            return;
        }
        if (coaches.length === 0) {
            toast.warning("Add at least one coach type before saving");
            return;
        }

        setSaving(true);
        try {
            const payload = coaches.map(c => ({
                coachTypeId: c.coachTypeId,
                coachCount: parseInt(c.coachCount) || 1,
                seatsPerCoach: parseInt(c.seatsPerCoach) || 72,
                price: parseFloat(c.price) || 0,
                tatkalPrice: parseFloat(c.tatkalPrice) || 0
            }));
            const res = await trainApi.saveTrainCoaches(selectedTrainId, payload);
            if (res.success) {
                toast.success(res.message || 'Coach configuration saved!');
                // Reload coaches to get fresh data
                const refreshed = await trainApi.getTrainCoaches(selectedTrainId);
                if (refreshed.success) {
                    setCoaches((refreshed.coaches || []).map(c => ({
                        _id: c._id,
                        coachTypeId: c.coachType?._id || c.coachTypeId,
                        coachTypeName: c.coachType?.name || 'Unknown',
                        coachTypeFullName: c.coachType?.fullName || '',
                        coachCount: c.coachCount || 1,
                        seatsPerCoach: c.seatsPerCoach || 72,
                        price: c.price || 0,
                        tatkalPrice: c.tatkalPrice || 0
                    })));
                }
            }
        } catch (error) {
            console.error('Failed to save:', error);
            toast.error("Failed to save configuration");
        } finally {
            setSaving(false);
        }
    };

    // ─── Available coach types (not already used) ────────────────────────────
    const getAvailableTypesFor = (currentTypeId) => {
        const usedIds = coaches.map(c => c.coachTypeId).filter(id => id !== currentTypeId);
        return coachTypes.filter(ct => !usedIds.includes(ct._id));
    };

    // ─── Render ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="text-slate-400 font-medium text-sm">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                            <Layout className="text-white" size={20} />
                        </div>
                        Seat & Coach Setup
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Configure coach types and seat layouts per train — no global config.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleAddCoach}
                        disabled={!selectedTrainId}
                        className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 text-sm ${
                            selectedTrainId
                                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                                : 'bg-slate-100 text-slate-300 border border-slate-100 cursor-not-allowed'
                        }`}
                    >
                        <Plus size={16} />
                        <span>Add Coach</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!selectedTrainId || saving}
                        className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 text-sm ${
                            selectedTrainId
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                                : 'bg-blue-300 text-blue-100 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                    </button>
                </div>
            </div>

            {/* Train Selector */}
            <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange-500/20 p-2 rounded-xl">
                        <Train className="text-orange-400" size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold">Select Train</h2>
                        <p className="text-xs text-slate-400">Choose a train to configure its coach types</p>
                    </div>
                </div>
                <div className="relative">
                    <select
                        value={selectedTrainId}
                        onChange={(e) => setSelectedTrainId(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3.5 text-white font-semibold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                    >
                        <option value="">— Select a train —</option>
                        {trains.map(train => (
                            <option key={train._id || train.id} value={train._id || train.id}>
                                {train.number || train.trainNumber} — {train.name || train.trainName}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
                {selectedTrain && (
                    <div className="mt-4 flex items-center gap-4 text-xs">
                        <span className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-lg font-bold">
                            #{selectedTrain.number || selectedTrain.trainNumber}
                        </span>
                        <span className="text-slate-300 font-medium">{selectedTrain.name || selectedTrain.trainName}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{coaches.length} coach type{coaches.length !== 1 ? 's' : ''} configured</span>
                    </div>
                )}
            </div>

            {/* No Train Selected State */}
            {!selectedTrainId && (
                <div className="card p-16 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Train className="text-slate-300" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-400 mb-2">No Train Selected</h3>
                    <p className="text-sm text-slate-400">Select a train above to start configuring its coaches</p>
                </div>
            )}

            {/* Loading Coaches State */}
            {selectedTrainId && loadingCoaches && (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="ml-3 text-slate-400 font-medium text-sm">Loading coach configuration...</span>
                </div>
            )}

            {/* Coach Cards */}
            {selectedTrainId && !loadingCoaches && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Coach Config Cards */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
                            <Package className="text-blue-500" size={18} />
                            Coach Configuration
                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold ml-1">{coaches.length}</span>
                        </h2>

                        {coaches.length === 0 && (
                            <div className="text-center p-10 border-2 border-dashed border-slate-100 rounded-2xl">
                                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus className="text-slate-300" size={24} />
                                </div>
                                <p className="text-slate-500 font-medium mb-4">No coaches configured for this train.</p>
                                <button
                                    onClick={handleAddCoach}
                                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm"
                                >
                                    Add First Coach Type
                                </button>
                            </div>
                        )}

                        {coaches.map((coach, idx) => (
                            <div key={coach._id} className="p-5 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-all group bg-white shadow-sm">
                                {/* Coach Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md">
                                            {coach.coachTypeName}
                                        </div>
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">{coach.coachTypeFullName || coach.coachTypeName}</span>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {coach.coachCount} coach{coach.coachCount > 1 ? 'es' : ''} × {coach.seatsPerCoach} seats = <strong className="text-slate-600">{coach.coachCount * coach.seatsPerCoach} total</strong>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCoach(coach._id)}
                                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:text-red-600"
                                        title="Remove coach"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Coach Config Fields */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Coach Type Selector */}
                                    <div className="col-span-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Coach Type</label>
                                        <select
                                            value={coach.coachTypeId}
                                            onChange={(e) => updateCoach(coach._id, 'coachTypeId', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                        >
                                            {getAvailableTypesFor(coach.coachTypeId).map(ct => (
                                                <option key={ct._id} value={ct._id}>
                                                    {ct.name} — {ct.fullName} ({ct.defaultSeats} default seats)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Coach Count */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                                            <Hash size={10} className="inline mr-1" />Coaches
                                        </label>
                                        <input
                                            type="number"
                                            value={coach.coachCount}
                                            onChange={(e) => updateCoach(coach._id, 'coachCount', parseInt(e.target.value) || 1)}
                                            min="1"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                        />
                                    </div>

                                    {/* Seats Per Coach */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                                            <Armchair size={10} className="inline mr-1" />Seats / Coach
                                        </label>
                                        <input
                                            type="number"
                                            value={coach.seatsPerCoach}
                                            onChange={(e) => updateCoach(coach._id, 'seatsPerCoach', parseInt(e.target.value) || 1)}
                                            min="1"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                                            ₹ Base Price
                                        </label>
                                        <input
                                            type="number"
                                            value={coach.price}
                                            onChange={(e) => updateCoach(coach._id, 'price', parseFloat(e.target.value) || 0)}
                                            min="0"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                        />
                                    </div>

                                    {/* Tatkal Price */}
                                    <div>
                                        <label className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5 block">
                                            ⚡ Tatkal Price
                                        </label>
                                        <input
                                            type="number"
                                            value={coach.tatkalPrice}
                                            onChange={(e) => updateCoach(coach._id, 'tatkalPrice', parseFloat(e.target.value) || 0)}
                                            min="0"
                                            className="w-full bg-orange-50/50 border border-orange-200/50 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Add More Button */}
                        {coaches.length > 0 && (
                            <button
                                onClick={handleAddCoach}
                                className="w-full py-3 border-2 border-dashed border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-slate-400 hover:text-blue-600 rounded-2xl flex items-center justify-center gap-2 transition-all group mt-2"
                            >
                                <Plus size={16} className="group-hover:scale-110 transition-transform" />
                                <span className="font-semibold text-sm">Add Another Class</span>
                            </button>
                        )}
                    </div>

                    {/* Right Column: Summary & Tips */}
                    <div className="space-y-6">
                        {/* Live Summary */}
                        {coaches.length > 0 && (
                            <div className="card p-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
                                <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                                    <Armchair className="text-green-500" size={18} />
                                    Capacity Summary
                                </h3>
                                <div className="space-y-3">
                                    {coaches.map(c => (
                                        <div key={c._id} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-extrabold">{c.coachTypeName}</span>
                                                <span className="text-xs text-slate-500">{c.coachCount} × {c.seatsPerCoach}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-slate-700">{c.coachCount * c.seatsPerCoach} seats</span>
                                                {c.price > 0 && <span className="text-xs text-green-600 font-bold">₹{c.price}</span>}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-center px-3">
                                        <span className="font-bold text-slate-600 text-sm">Total Capacity</span>
                                        <span className="font-extrabold text-lg text-blue-600">
                                            {coaches.reduce((sum, c) => sum + (c.coachCount * c.seatsPerCoach), 0)} seats
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tips Card */}
                        <div className="card p-6 bg-slate-900 text-white rounded-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="text-blue-400" size={18} />
                                <h3 className="text-base font-bold">How It Works</h3>
                            </div>
                            <ul className="space-y-3 text-sm text-slate-400 font-medium">
                                <li className="flex gap-2">
                                    <span className="text-blue-400 shrink-0">1.</span>
                                    Select a train from the dropdown above
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400 shrink-0">2.</span>
                                    Add coach types specific to this train
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400 shrink-0">3.</span>
                                    Set coach count, seats per coach, and pricing
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400 shrink-0">4.</span>
                                    Save — each train gets its own unique config
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                <p className="text-xs text-orange-300 font-medium flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    Different trains can have completely different coach types
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatCoachSetup;
