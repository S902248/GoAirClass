import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Trash2,
  Edit3,
  Bus,
  Hotel,
  Plane,
  Train as TrainIcon,
  Layers,
  MapPin,
  Star,
  Users,
  ShieldCheck,
  TrendingDown,
  Navigation,
  Clock,
  Layout,
  Tag,
  Zap,
  ChevronDown,
  Target
} from 'lucide-react';
import commissionApi from '../../../api/commissionApi';
import Axios from '../../../api/Axios';
import { toast } from 'react-toastify';

const CommissionManagement = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewResult, setPreviewResult] = useState(null);
  const [hotelMinPrice, setHotelMinPrice] = useState(2000);

  // Dynamic Data
  const [operators, setOperators] = useState([]);
  const [items, setItems] = useState([]);
  const [fetchingItems, setFetchingItems] = useState(false);

  // Sandbox Dynamic Data
  const [buses, setBuses] = useState([]); // Renamed internally to sandboxAssets for easier logic
  const [routes, setRoutes] = useState([]);
  const [sandboxAssetType, setSandboxAssetType] = useState('Bus');
  const [selectedBusId, setSelectedBusId] = useState('');

  const [form, setForm] = useState({
    ruleName: 'New Smart Rule',
    category: 'Bus',
    operatorId: '',
    operatorModel: '',
    itemId: 'All',
    // Bus Advanced Filters
    seatType: 'All',
    busType: 'All',
    sourceCity: 'All',
    destinationCity: 'All',
    timeSlot: 'All',
    // Common/Slab Filters
    minDistance: 0,
    maxDistance: 99999,
    minPrice: 0,
    maxPrice: 999999,
    starRating: 0,
    trainClass: 'All',
    quota: 'All',
    airline: 'All',
    fareType: 'All',
    // Logic
    demandType: ['Normal'],
    commissionType: 'flat',
    value: 0,
    // Pricing Governance
    minCap: 0,
    maxCap: 999999,
    applyOn: 'Original',
    // Dynamic Strategy
    isDynamic: false,
    lowOccupancyRate: 0,
    mediumOccupancyRate: 0,
    highOccupancyRate: 0,

    isActive: true,
    priority: 0,
    // Point 8: Extended Nested Commission Object for Hotel
    commission: {
      type: 'flat',
      value: 0,
      min: 0,
      max: 999999
    }
  });

  // Simulation Sandbox
  const [simParams, setSimParams] = useState({
    sourceCity: '',
    destinationCity: '',
    seatType: 'All',
    busType: 'All',
    operatorId: '',
    ticketPrice: 600,
    occupancy: 45,
    distance: 250,
    demandType: 'Normal', // Normal, Weekend, Festival
    demandLevel: 'Mid',   // Low, Mid, High
    discountAmount: 0,
    timeSlot: 'All'
  });

  const categories = ['Bus', 'Hotel', 'Flight', 'Train'];
  const seatTypes = ['All', 'Sleeper', 'Seater', 'AC', 'Non-AC'];
  const busTypes = ['All', 'Volvo', 'Sleeper', 'Semi-Sleeper', 'Luxury'];
  const timeSlots = ['All', 'Morning', 'Afternoon', 'Evening', 'Night'];
  const trainClasses = ['All', 'Sleeper', '3AC', '2AC', '1AC'];
  const quotas = ['All', 'General', 'Tatkal'];
  const fareTypes = ['All', 'Economy', 'Business'];
  const demandTypes = ['Normal', 'Weekend', 'Festival'];

  useEffect(() => {
    fetchRules();
    fetchDynamicSandboxData();
  }, []);

  const fetchDynamicSandboxData = async () => {
    setFetchingItems(true);
    try {
      const res = await Axios.get(`/assets?type=${sandboxAssetType.toUpperCase()}`);
      if (res.data.success) {
        setBuses(res.data.assets || []);
        // Auto-select first asset if available
        if (res.data.assets?.length > 0) {
          handleAssetChange(res.data.assets[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to fetch dynamic sandbox data", e);
    } finally {
      setFetchingItems(false);
    }
  };

  useEffect(() => {
    fetchDynamicSandboxData();
  }, [sandboxAssetType]);

  useEffect(() => {
    if (form.category === 'Bus' || form.category === 'Hotel') {
      fetchOperators(form.category);
    } else {
      setOperators([]);
    }
  }, [form.category]);

  useEffect(() => {
    if (form.category === 'Bus' || form.category === 'Hotel') {
      fetchItems();
    } else {
      setItems([]);
    }
  }, [form.category, form.operatorId]);

  // Handle Auto-fill when a unique unit (Bus/Hotel) is selected
  useEffect(() => {
    const autoFillDetails = async () => {
      if (form.itemId && form.itemId !== 'All' && !editingId) {
        const item = items.find(i => i.id === form.itemId);
        if (item) {
          if (form.category === 'Bus') {
            // 1. Basic properties from Bus model
            const hasSleeper = (item.seatLayout || []).some(s => s.type?.toLowerCase().includes('sleeper'));
            const hasSeater = (item.seatLayout || []).some(s => s.type?.toLowerCase().includes('seater'));
            const hasAC = (item.amenities || []).some(a => a.toUpperCase().includes('AC'));

            let sType = 'All';
            if (hasAC) sType = 'AC';
            else if (hasSleeper && !hasSeater) sType = 'Sleeper';
            else if (hasSeater && !hasSleeper) sType = 'Seater';

            let baseData = {
              ruleName: `Auto: ${item.name} Rule`,
              busType: item.busType || 'All',
              seatType: sType
            };

            // 2. Schedule dependent properties (Route & Time Slot)
            try {
              const res = await Axios.get(`/schedules/bus/${form.itemId}/latest`);
              const schedule = res.data;
              if (schedule) {
                baseData.sourceCity = schedule.route?.fromCity || 'All';
                baseData.destinationCity = schedule.route?.toCity || 'All';

                // Categorize Time Slot
                const hour = parseInt((schedule.departureTime || '').split(':')[0]);
                if (!isNaN(hour)) {
                  if (hour >= 5 && hour < 12) baseData.timeSlot = 'Morning';
                  else if (hour >= 12 && hour < 17) baseData.timeSlot = 'Afternoon';
                  else if (hour >= 17 && hour < 21) baseData.timeSlot = 'Evening';
                  else baseData.timeSlot = 'Night';
                }
              }
            } catch (e) {
              console.error("No active schedule found for auto-fill", e);
            }

            setForm(prev => ({ ...prev, ...baseData }));
            toast.info(`Auto-filled intelligence for ${item.name}`);
          } else if (form.category === 'Hotel') {
            // 2. Discover Best Price from Rooms
            try {
              const roomRes = await Axios.get(`/hotel-rooms/hotel/${form.itemId}`);
              const rooms = roomRes.data.rooms || [];
              if (rooms.length > 0) {
                const minPrice = Math.min(...rooms.map(r => r.price || 999999));
                const finalMin = minPrice === 999999 ? 2000 : minPrice;
                setHotelMinPrice(finalMin);
                setForm(prev => ({
                  ...prev,
                  ruleName: `Auto: ${item.name} Rule`,
                  starRating: item.starRating || 0,
                  minPrice: finalMin,
                  sourceCity: item.city || 'All'
                }));
                toast.info(`Auto-filled price from ${rooms.length} room types`);
              } else {
                setHotelMinPrice(2000);
                setForm(prev => ({
                  ...prev,
                  ruleName: `Auto: ${item.name} Rule`,
                  starRating: item.starRating || 0,
                  minPrice: 0,
                  sourceCity: item.city || 'All'
                }));
              }
            } catch (e) {
              console.error("Failed to fetch rooms for price discovery", e);
              setHotelMinPrice(2000);
            }
          }
        }
      }
    };
    autoFillDetails();
  }, [form.itemId, items]);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const data = await commissionApi.getRules();
      if (data.success) setRules(data.commissions);
    } catch (error) {
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const fetchOperators = async (category) => {
    try {
      if (category === 'Bus') {
        const res = await Axios.get('/operators/all');
        setOperators(res.data || []);
      } else if (category === 'Hotel') {
        const res = await Axios.get('/hotel-operators');
        const opList = res.data.operators || res.data || [];
        setOperators(opList);
      }
    } catch (e) {
      console.error("Failed to fetch operators", e);
    }
  };

  const fetchItems = async () => {
    try {
      setFetchingItems(true);
      if (form.category === 'Bus') {
        const res = await Axios.get('/buses/all');
        const busList = Array.isArray(res.data) ? res.data : (res.data.buses || []);
        // Store ALL buses for flexible filtering
        setItems(busList.map(b => ({ ...b, id: b._id, name: b.busName || b.name }))
          .sort((a, b) => a.name.localeCompare(b.name)));
      } else if (form.category === 'Hotel') {
        const res = await Axios.get('/hotels');
        const hotelList = res.data.hotels || res.data.hotel || (Array.isArray(res.data) ? res.data : []);
        // Store ALL hotels for flexible filtering
        setItems(hotelList.map(h => ({ ...h, id: h._id, name: h.hotelName || h.name || 'Unnamed Hotel' }))
          .sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (e) {
      console.error("Failed to fetch items", e);
    } finally {
      setFetchingItems(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const model = form.category === 'Bus' ? 'Operator' : form.category === 'Hotel' ? 'HotelOperator' : null;
      // Ensure nested commission object matches top-level for Hotel
      const finalForm = {
        ...form,
        operatorModel: model,
        commission: {
          type: form.commissionType,
          value: form.value,
          min: form.minCap,
          max: form.maxCap
        }
      };

      if (editingId) {
        await commissionApi.updateRule(editingId, finalForm);
        toast.success('Rule updated');
      } else {
        await commissionApi.createRule(finalForm);
        toast.success('Rule created');
      }
      resetForm();
      fetchRules();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving rule');
    }
  };

  const resetForm = () => {
    setForm({
      ruleName: 'New Rule',
      category: 'Bus',
      operatorId: '',
      operatorModel: '',
      itemId: 'All',
      seatType: 'All',
      busType: 'All',
      sourceCity: 'All',
      destinationCity: 'All',
      timeSlot: 'All',
      minDistance: 0,
      maxDistance: 99999,
      minPrice: 0,
      maxPrice: 999999,
      starRating: 0,
      trainClass: 'All',
      quota: 'All',
      airline: 'All',
      fareType: 'All',
      demandType: ['Normal'],
      commissionType: 'flat',
      value: 0,
      minCap: 0,
      maxCap: 999999,
      applyOn: 'Original',
      isDynamic: false,
      lowOccupancyRate: 0,
      mediumOccupancyRate: 0,
      highOccupancyRate: 0,
      // Advanced Payout
      useSlabs: false,
      slabs: [],
      timeSlot: 'All',
      weekendMultiplier: 1.1,
      festivalMultiplier: 1.2,
      roundingRule: 'None',
      isActive: true,
      priority: 0,
      commission: {
        type: 'flat',
        value: 0,
        min: 0,
        max: 999999
      }
    });
    setEditingId(null);
    setShowForm(false);
    setPreviewResult(null);
  };

  const handleEdit = (rule) => {
    setForm({
      ...rule,
      operatorId: rule.operatorId?._id || rule.operatorId || ''
    });
    setEditingId(rule._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete rule?')) return;
    try {
      await commissionApi.deleteRule(id);
      toast.success('Rule deleted');
      fetchRules();
    } catch (error) {
      toast.error('Error deleting rule');
    }
  };

  const toggleDemand = (type) => {
    setForm(prev => ({
      ...prev,
      demandType: prev.demandType.includes(type)
        ? prev.demandType.filter(t => t !== type)
        : [...prev.demandType, type]
    }));
  };

  const handleAssetChange = (assetId) => {
    const assetsList = buses || [];
    const asset = assetsList.find(a => String(a.id) === String(assetId));
    
    if (asset) {
      setSelectedBusId(assetId);
      if (sandboxAssetType === 'Bus') {
        setSimParams(prev => ({
          ...prev,
          category: 'Bus',
          sourceCity: asset.subtitle ? asset.subtitle.split('→')[0].trim() : '',
          destinationCity: asset.subtitle ? asset.subtitle.split('→')[1]?.trim() : '',
          busType: 'All',
          operatorId: asset.operatorId || '',
          ticketPrice: asset.price || 600,
          distance: 250,
        }));
      } else {
        setSimParams(prev => ({
          ...prev,
          category: 'Hotel',
          sourceCity: asset.subtitle || 'All',
          ticketPrice: asset.price || 2000,
          starRating: asset.starRating || 0,
          operatorId: asset.operatorId || ''
        }));
      }
      toast.info(`Asset Loaded: ${asset.name}`);
    }
  };

  const runSimulation = async () => {
    // Hotel only needs sourceCity (The city where it is located)
    if (!simParams.sourceCity || (sandboxAssetType === 'Bus' && !simParams.destinationCity)) {
      return toast.error(sandboxAssetType === 'Bus' ? "Please select a valid route first" : "Please select a location first");
    }

    // Safety: Redundant lookup of operatorId from selected asset
    const currentAsset = buses.find(a => String(a.id) === String(selectedBusId));
    const effectiveOperatorId = currentAsset?.operatorId || simParams.operatorId;

    const params = {
      ...simParams,
      operatorId: effectiveOperatorId || '',
      isWeekend: simParams.demandType === 'Weekend',
      isFestival: simParams.demandType === 'Festival',
      itemId: selectedBusId || undefined,
      timeSlot: simParams.timeSlot || 'All'
    };

    try {
      const res = await commissionApi.calculate(sandboxAssetType, params);
      if (res.success) {
        setPreviewResult(res);
        if (res.appliedRule === 'No Matching Rule') {
          toast.warning("Inconclusive matching. Falling back to base 0.");
        } else {
          toast.success(`Matched: ${res.appliedRule}`);
        }
      } else {
        toast.error("Simulation inconclusive");
      }
    } catch (e) {
      toast.error("Simulation engine failed");
    }
  };

  const addSlab = () => {
    setForm(prev => ({
      ...prev,
      slabs: [...(prev.slabs || []), { min: 0, max: 0, value: 0 }]
    }));
  };

  const removeSlab = (index) => {
    setForm(prev => ({
      ...prev,
      slabs: prev.slabs.filter((_, i) => i !== index)
    }));
  };

  const updateSlab = (index, field, value) => {
    const newSlabs = [...(form.slabs || [])];
    newSlabs[index][field] = Number(value);
    setForm({ ...form, slabs: newSlabs });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden p-4 md:p-10 space-y-12 animate-in fade-in duration-1000 font-sans pb-32 text-slate-900">
      {/* Aurora Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-200/30 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[10%] w-[25%] h-[25%] bg-rose-200/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Pearl Header */}
      <div className="relative group">
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-white/60 backdrop-blur-[40px] border border-white p-10 md:p-14 rounded-[48px] shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-lg opacity-40 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20">
                <Wallet size={36} className="drop-shadow-lg" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
                Yield Orchestrator
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-gradient-to-r from-cyan-600 to-transparent rounded-full"></div>
                <p className="text-cyan-600 font-black uppercase tracking-[0.4em] text-[10px]">Industrial Pearl Core v6.0</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="relative group/btn overflow-hidden px-10 py-5 bg-white text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-2xl shadow-indigo-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-3">
              {showForm ? (
                <>
                  <Layout size={16} className="text-indigo-600" />
                  Close Configuration
                </>
              ) : (
                <>
                  <Zap size={16} className="text-indigo-600 animate-bounce" />
                  New Commercial Rule
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Advanced Orchestration Form (Frosted Shards) */}
      {showForm && (
        <div className="relative group">
          <div className="relative bg-white/40 backdrop-blur-[40px] border border-white/80 rounded-[56px] shadow-2xl shadow-slate-200/60 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-16">
              {/* Category Navigation (Pearl Shards) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat, operatorId: '', itemId: 'All' })}
                    className={`relative group flex flex-col items-center justify-center gap-6 p-8 rounded-[48px] border-2 transition-all duration-700 h-56 ${form.category === cat
                      ? 'bg-white border-cyan-500/40 text-slate-900 shadow-xl shadow-cyan-500/10 scale-105 z-10'
                      : 'bg-white/30 border-white/40 text-slate-400 hover:bg-white/50 hover:border-slate-200'
                      }`}
                  >
                    <div className={`p-5 rounded-3xl transition-all duration-700 ${form.category === cat ? 'bg-cyan-50 text-cyan-600 shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                      {cat === 'Bus' && <Bus size={36} />}
                      {cat === 'Hotel' && <Hotel size={36} />}
                      {cat === 'Flight' && <Plane size={36} />}
                      {cat === 'Train' && <TrainIcon size={36} />}
                    </div>
                    <span className="font-black uppercase tracking-[0.3em] text-[11px]">{cat} Intelligence</span>
                    {form.category === cat && (
                      <div className="absolute top-6 right-6 h-2.5 w-2.5 bg-cyan-600 rounded-full animate-pulse shadow-glow-cyan"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                {/* Section A: Global & Local Targeting */}
                <div className="space-y-12">
                  <div className="flex items-center gap-5 group">
                    <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-100 group-hover:bg-cyan-100 transition-all duration-500">
                      <Target size={28} className="text-cyan-600" />
                    </div>
                    <div className="space-y-1">
                      <span className="block font-black uppercase tracking-[0.3em] text-[13px] text-slate-900">Targeting Matrix</span>
                      <span className="block text-[10px] font-bold text-cyan-600/50 uppercase tracking-widest italic">Selective logic propagation</span>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Rule Identification */}
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 group-focus-within:text-cyan-600 transition-colors">Blueprint Identification</label>
                      <input
                        className="w-full bg-white border border-slate-200 rounded-2xl h-20 px-10 font-bold text-xl text-slate-900 focus:border-cyan-500 outline-none transition-all shadow-sm placeholder:text-slate-300"
                        value={form.ruleName}
                        onChange={e => setForm({ ...form, ruleName: e.target.value })}
                        placeholder="Enter Rule Designation..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Operator */}
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2 group-focus-within:text-indigo-400 transition-colors">Platform Merchant</label>
                        <div className="relative">
                          <select
                            className="w-full bg-white border border-slate-200 rounded-2xl h-16 px-8 font-black uppercase text-[11px] appearance-none focus:border-indigo-500/50 outline-none transition-all"
                            value={form.operatorId}
                            onChange={e => setForm({ ...form, operatorId: e.target.value, itemId: 'All' })}
                          >
                            <option value="" className="bg-white text-slate-900">Global Unified</option>
                            {operators.map(op => <option key={op._id} value={op._id} className="bg-white text-slate-900">{op.companyName || op.name}</option>)}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>
                      {/* Specific Item */}
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-2 group-focus-within:text-indigo-400 transition-colors">Granular Unit Selection</label>
                        <div className="relative">
                          <select
                            className="w-full bg-white border border-slate-200 rounded-2xl h-16 px-8 font-black uppercase text-[11px] appearance-none focus:border-indigo-500/50 outline-none transition-all"
                            value={form.itemId}
                            onChange={e => setForm({ ...form, itemId: e.target.value })}
                            disabled={fetchingItems}
                          >
                            <option value="All" className="bg-white text-slate-900">
                              {fetchingItems ? 'Syncing...' : `All Active ${form.category}s`}
                            </option>
                            {!fetchingItems && items.map(i => (
                              <option key={i.id} value={i.id} className="bg-white text-slate-900">
                                {i.name} {i.city ? `(${i.city})` : ''}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <ChevronDown size={16} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Filters (Bus/Hotel/etc) */}
                    <div className="p-8 bg-white/50 rounded-[32px] border border-white/50 space-y-8">
                      {form.category === 'Bus' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Configuration</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-black uppercase text-[10px] outline-none focus:border-indigo-500/30" value={form.seatType} onChange={e => setForm({ ...form, seatType: e.target.value })}>
                              {seatTypes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Asset Category</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-black uppercase text-[10px] outline-none focus:border-indigo-500/30" value={form.busType} onChange={e => setForm({ ...form, busType: e.target.value })}>
                              {busTypes.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Origin (Source)</label>
                            <input
                              className="w-full bg-white border border-slate-200 rounded-xl h-12 px-6 font-bold text-sm outline-none focus:border-indigo-500/30"
                              value={form.sourceCity}
                              onChange={e => setForm({ ...form, sourceCity: e.target.value })}
                              list="bus-origin-suggestions"
                            />
                            <datalist id="bus-origin-suggestions">
                              {[...new Set(items.map(i => i.fromCity).filter(Boolean))].sort().map(city => (
                                <option key={city} value={city} />
                              ))}
                            </datalist>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Destination (Sink)</label>
                            <input
                              className="w-full bg-white border border-slate-200 rounded-xl h-12 px-6 font-bold text-sm outline-none focus:border-indigo-500/30"
                              value={form.destinationCity}
                              onChange={e => setForm({ ...form, destinationCity: e.target.value })}
                              list="bus-destination-suggestions"
                            />
                            <datalist id="bus-destination-suggestions">
                              {[...new Set(items.map(i => i.toCity).filter(Boolean))].sort().map(city => (
                                <option key={city} value={city} />
                              ))}
                            </datalist>
                          </div>
                          <div className="md:col-span-2 group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Time Performance Window</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-black uppercase text-[10px] outline-none focus:border-indigo-500/30" value={form.timeSlot} onChange={e => setForm({ ...form, timeSlot: e.target.value })}>
                              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                      )}

                      {form.category === 'Hotel' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">City Filter</label>
                            <input
                              className="w-full bg-white border border-slate-200 rounded-xl h-12 px-6 font-bold text-sm outline-none focus:border-indigo-500/30"
                              value={form.sourceCity}
                              onChange={e => setForm({ ...form, sourceCity: e.target.value })}
                              placeholder="All Cities..."
                              list="hotel-city-suggestions"
                            />
                            <datalist id="hotel-city-suggestions">
                              {[...new Set(items.map(i => i.city).filter(Boolean))].sort().map(city => (
                                <option key={city} value={city} />
                              ))}
                            </datalist>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Room Category</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-black uppercase text-[10px] outline-none focus:border-indigo-500/30" value={form.seatType} onChange={e => setForm({ ...form, seatType: e.target.value })}>
                              <option value="All">All Rooms</option>
                              <option value="Standard">Standard</option>
                              <option value="Deluxe">Deluxe</option>
                              <option value="Super Deluxe">Super Deluxe</option>
                              <option value="Suite">Suite</option>
                            </select>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Meal Strategy</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-black uppercase text-[10px] outline-none focus:border-indigo-500/30" value={form.busType} onChange={e => setForm({ ...form, busType: e.target.value })}>
                              <option value="All">All Plans</option>
                              <option value="EP">EP (Only Room)</option>
                              <option value="CP">CP (Breakfast)</option>
                              <option value="MAP">MAP (Half Board)</option>
                              <option value="AP">AP (Full Board)</option>
                            </select>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Min Star Rating</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-black uppercase text-[10px] outline-none focus:border-indigo-500/30" value={form.starRating} onChange={e => setForm({ ...form, starRating: e.target.value })}>
                              {[0, 1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s} Stars & Up</option>)}
                            </select>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Min Price Range</label>
                            <input type="number" className="w-full bg-white border border-slate-200 rounded-xl h-12 px-6 font-bold text-sm outline-none focus:border-indigo-500/30" value={form.minPrice} onChange={e => setForm({ ...form, minPrice: e.target.value })} />
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Max Price Range</label>
                            <input type="number" className="w-full bg-white border border-slate-200 rounded-xl h-12 px-6 font-bold text-sm outline-none focus:border-indigo-500/30" value={form.maxPrice} onChange={e => setForm({ ...form, maxPrice: e.target.value })} />
                          </div>
                        </div>
                      )}

                      {form.category === 'Train' && (
                        <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-500">
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Class Code</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-bold outline-none focus:border-indigo-500/30" value={form.trainClass} onChange={e => setForm({ ...form, trainClass: e.target.value })}>
                              {trainClasses.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div className="group">
                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Quota Logic</label>
                            <select className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 font-bold outline-none focus:border-indigo-500/30" value={form.quota} onChange={e => setForm({ ...form, quota: e.target.value })}>
                              {quotas.map(q => <option key={q} value={q}>{q}</option>)}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section B: Commercial Strategy & Governance */}
                <div className="space-y-12">
                  <div className="flex items-center gap-4 text-emerald-600 group">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all duration-500">
                      <Zap size={24} />
                    </div>
                    <div className="space-y-1">
                      <span className="block font-black uppercase tracking-[0.2em] text-[12px] text-slate-900">Commercial Strategy</span>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Yield optimization settings</span>
                    </div>
                  </div>

                  <div className="space-y-10 bg-white/50 p-8 md:p-12 rounded-[40px] border border-white/50 shadow-xl">
                    <div className="space-y-5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Market Condition Multipliers</label>
                      <div className="flex flex-wrap gap-4">
                        {demandTypes.map(d => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleDemand(d)}
                            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${form.demandType.includes(d)
                              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 scale-105'
                              : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                              }`}
                          >
                            {d} Phase
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10 border-y border-slate-200">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Yield Protocol</label>
                        <div className="flex p-2 bg-slate-100 rounded-[28px] border border-slate-200">
                          <button type="button" onClick={() => setForm({ ...form, commissionType: 'flat' })} className={`flex-1 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${form.commissionType === 'flat' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>₹ Absol.</button>
                          <button type="button" onClick={() => setForm({ ...form, commissionType: 'percentage' })} className={`flex-1 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${form.commissionType === 'percentage' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>% Ratio</button>
                          {form.category === 'Hotel' && (
                            <button type="button" onClick={() => setForm({ ...form, commissionType: 'hybrid' })} className={`flex-1 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${form.commissionType === 'hybrid' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>Hybrid</button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Base Yield Output</label>
                        <div className="relative group/input overflow-hidden rounded-[32px]">
                          <input
                            type="number"
                            className="relative z-10 w-full bg-slate-50 border border-slate-200 rounded-[32px] h-24 text-center text-5xl font-black text-slate-900 focus:border-cyan-500 outline-none transition-all shadow-inner"
                            value={form.value}
                            onChange={e => setForm({ ...form, value: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Point 7: Hotel Preview */}
                    {form.category === 'Hotel' && (
                      <div className="p-8 rounded-[32px] bg-indigo-50 border border-indigo-100 space-y-4 animate-in slide-in-from-right-4 duration-700">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap size={18} className="text-indigo-600" />
                          <span className="font-black uppercase tracking-widest text-[11px] text-indigo-900">Hotel Price Preview</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          {(() => {
                            const dynamicBase = hotelMinPrice;
                            let calculatedComm = form.commissionType === 'percentage'
                              ? (dynamicBase * form.value / 100)
                              : Number(form.value);

                            if (form.commissionType === 'hybrid') {
                              calculatedComm = Math.max(dynamicBase * form.value / 100, Number(form.minCap));
                            }

                            const finalComm = Math.max(Number(form.minCap), Math.min(Number(form.maxCap), Math.round(calculatedComm)));
                            const finalPrice = dynamicBase + finalComm;

                            return (
                              <>
                                <div className="space-y-1">
                                  <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base Rate (Rooms Min)</span>
                                  <span className="text-2xl font-black text-slate-900">₹{dynamicBase}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Calculated Commission</span>
                                  <span className="text-2xl font-black text-emerald-600">₹{finalComm}</span>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-indigo-100">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-indigo-950 uppercase tracking-widest">Final Price (to Customer)</span>
                                    <span className="text-3xl font-black text-indigo-600">₹{finalPrice}</span>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Industrial Governance: Caps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group">
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2 flex items-center gap-2 group-hover:text-rose-400 transition-colors">
                          <ShieldCheck size={12} className="text-rose-500" />
                          {form.category === 'Hotel' ? 'Min Commission' : 'System Floor Cap'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-600">₹</span>
                          <input type="number" className="w-full bg-slate-100 border border-slate-200 rounded-2xl h-14 pl-12 px-6 font-bold text-slate-900 focus:border-rose-500/30 outline-none" value={form.minCap} onChange={e => setForm({ ...form, minCap: e.target.value })} />
                        </div>
                      </div>
                      <div className="group">
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2 flex items-center gap-2 group-hover:text-rose-400 transition-colors">
                          <ShieldCheck size={12} className="text-rose-500" />
                          {form.category === 'Hotel' ? 'Max Commission' : 'System Ceiling Cap'}
                        </label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-600">₹</span>
                          <input type="number" className="w-full bg-slate-100 border border-slate-200 rounded-2xl h-14 pl-12 px-6 font-bold text-slate-900 focus:border-rose-500/30 outline-none" value={form.maxCap} onChange={e => setForm({ ...form, maxCap: e.target.value })} />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Baseline Computation Context</label>
                        <div className="flex p-2 bg-slate-950/50 rounded-2xl border border-white/5">
                          <button type="button" onClick={() => setForm({ ...form, applyOn: 'Original' })} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${form.applyOn === 'Original' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Base Rate</button>
                          <button type="button" onClick={() => setForm({ ...form, applyOn: 'Discounted' })} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${form.applyOn === 'Discounted' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Net of Discounts</button>
                        </div>
                      </div>
                    </div>

                    {/* Rounding Rules */}
                    <div className="pt-8 border-t border-white/5 space-y-4">
                      <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Rounding Precision Logic</label>
                      <div className="flex p-2 bg-slate-950/50 rounded-2xl border border-white/5 gap-2">
                        {['None', 'Round to 10', 'Round to 50'].map(rule => (
                          <button
                            key={rule}
                            type="button"
                            onClick={() => setForm({ ...form, roundingRule: rule })}
                            className={`flex-1 py-3 px-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all duration-500 ${form.roundingRule === rule ? 'bg-white text-slate-950 shadow-xl scale-105' : 'text-slate-600 hover:text-slate-400'}`}
                          >
                            {rule}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Sections: Only for non-Hotel */}
              {form.category !== 'Hotel' && (
                <>
                  {/* Slab-Based Logic */}
                  <div className="pt-10 border-t border-white/5 space-y-8">
                    <div className="flex items-center justify-between bg-slate-950/40 p-6 rounded-[28px] border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                          <Navigation size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <span className="block text-[11px] font-black text-white uppercase tracking-wider">Distance Slabs Scaling</span>
                          <span className="block text-[9px] font-bold text-slate-500 uppercase">Variable yield based on travel span</span>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input type="checkbox" className="sr-only peer" checked={form.useSlabs} onChange={e => setForm({ ...form, useSlabs: e.target.checked })} />
                        <div className="w-14 h-7 bg-white/5 peer-focus:outline-none rounded-full peer-checked:bg-indigo-500 transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-600 peer-checked:after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full shadow-inner"></div>
                      </label>
                    </div>

                    {form.useSlabs && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-500">
                        {(form.slabs || []).map((slab, index) => (
                          <div key={index} className="group relative flex items-center gap-4 bg-slate-950/40 p-5 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-all">
                            <div className="flex-1 grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-600 uppercase ml-1">Min Km</span>
                                <input type="number" className="w-full bg-white/5 border border-white/5 rounded-xl h-10 text-center font-bold text-xs outline-none focus:border-indigo-500/20" value={slab.min} onChange={e => updateSlab(index, 'min', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-slate-600 uppercase ml-1">Max Km</span>
                                <input type="number" className="w-full bg-white/5 border border-white/5 rounded-xl h-10 text-center font-bold text-xs outline-none focus:border-indigo-500/20" value={slab.max} onChange={e => updateSlab(index, 'max', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[8px] font-black text-indigo-400 uppercase ml-1">Value</span>
                                <input type="number" className="w-full bg-indigo-500/10 border border-indigo-500/20 rounded-xl h-10 text-center font-black text-xs text-indigo-400 outline-none" value={slab.value} onChange={e => updateSlab(index, 'value', e.target.value)} />
                              </div>
                            </div>
                            <button type="button" onClick={() => removeSlab(index)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <button type="button" onClick={addSlab} className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-white/5 rounded-[32px] text-slate-500 hover:border-indigo-500/40 hover:text-indigo-400 transition-all bg-white/[0.02]">
                          <Zap size={20} />
                          <span className="text-[9px] font-black uppercase tracking-widest">+ New Scaling Slab</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Demand Multipliers */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10 border-t border-white/5">
                    <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[40px] group/card transition-all hover:bg-indigo-600/20">
                      <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-black text-indigo-300 uppercase tracking-widest">Weekend Surge Protocol</label>
                          <span className="block text-[8px] font-bold text-white/30 uppercase tracking-widest italic">Automated Phase Scaling</span>
                        </div>
                        <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                          <TrendingDown size={14} className="rotate-180" />
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <input type="number" step="0.1" className="bg-transparent font-black text-4xl text-white w-full outline-none focus:text-indigo-400 transition-colors" value={form.weekendMultiplier} onChange={e => setForm({ ...form, weekendMultiplier: e.target.value })} />
                        <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black text-indigo-300 uppercase tracking-widest border border-white/5">Multiplier</div>
                      </div>
                    </div>
                    <div className="bg-rose-600/10 border border-rose-500/20 p-8 rounded-[40px] group/card transition-all hover:bg-rose-600/20">
                      <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-black text-rose-300 uppercase tracking-widest">Festival Surge Protocol</label>
                          <span className="block text-[8px] font-bold text-white/30 uppercase tracking-widest italic">Peak Market Adjustment</span>
                        </div>
                        <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400">
                          <TrendingDown size={14} className="rotate-180" />
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <input type="number" step="0.1" className="bg-transparent font-black text-4xl text-white w-full outline-none focus:text-rose-400 transition-colors" value={form.festivalMultiplier} onChange={e => setForm({ ...form, festivalMultiplier: e.target.value })} />
                        <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black text-rose-300 uppercase tracking-widest border border-white/5">Multiplier</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Neural Demand Orchestration (Aurora Active) */}
              {form.category === 'Bus' && (
                <div className="relative group/demand overflow-hidden bg-white/[0.03] p-12 md:p-16 rounded-[48px] shadow-3xl border border-white/10">
                  <div className="absolute top-0 right-0 p-20 opacity-10 scale-150 rotate-12 group-hover/demand:scale-[2] transition-transform duration-1000 text-cyan-500">
                    <Zap size={200} />
                  </div>

                  <div className="relative z-10 space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-3">
                        <h4 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-glow-cyan">Neural Yield Hub</h4>
                        <div className="flex items-center gap-4">
                          <div className="h-1.5 w-16 bg-gradient-to-r from-cyan-500 to-transparent rounded-full"></div>
                          <p className="text-[11px] font-black text-cyan-300 uppercase tracking-[0.5em]">Real-time Market Orchestration</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-[1.75]">
                        <input type="checkbox" className="sr-only peer" checked={form.isDynamic} onChange={e => setForm({ ...form, isDynamic: e.target.checked })} />
                        <div className="w-16 h-8 bg-black/60 peer-focus:outline-none rounded-full peer-checked:bg-white transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/20 peer-checked:after:bg-cyan-600 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full shadow-2xl"></div>
                      </label>
                    </div>

                    {form.isDynamic && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in zoom-in-95 duration-1000">
                        {[
                          { label: 'Green Phase', sub: '<30% Load', val: form.lowOccupancyRate, setter: 'lowOccupancyRate', color: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
                          { label: 'Stable Phase', sub: '30-70% Load', val: form.mediumOccupancyRate, setter: 'mediumOccupancyRate', color: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
                          { label: 'Peak Phase', sub: '>70% Load', val: form.highOccupancyRate, setter: 'highOccupancyRate', color: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' }
                        ].map(phase => (
                          <div key={phase.label} className={`${phase.color} backdrop-blur-3xl rounded-[36px] p-10 border-2 ${phase.border} space-y-8 group/phase transition-all hover:scale-[1.03] hover:bg-white/[0.05] shadow-xl`}>
                            <div className="space-y-2">
                              <span className={`block text-[11px] font-black uppercase tracking-[0.3em] ${phase.text}`}>{phase.label}</span>
                              <span className="block text-[10px] font-bold text-white/20 uppercase tracking-widest italic">{phase.sub}</span>
                            </div>
                            <div className="relative">
                              <input
                                type="number"
                                className="w-full h-20 bg-black/40 border-2 border-white/5 rounded-[24px] text-center font-black text-4xl text-white focus:bg-black/60 focus:border-white/10 outline-none transition-all shadow-inner"
                                value={phase.val}
                                onChange={e => setForm({ ...form, [phase.setter]: Number(e.target.value) })}
                              />
                              <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-white/5 text-2xl">%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Form Orchestration Actions */}
              <div className="pt-16 border-t border-white/10 flex flex-col xl:flex-row items-center justify-between gap-12">
                <div className="flex flex-wrap items-center justify-center gap-10">
                  <div className="flex items-center gap-6 group px-8 py-4 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all">
                    <label className="relative inline-flex items-center cursor-pointer scale-110">
                      <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                      <div className="w-16 h-8 bg-slate-800 peer-focus:outline-none rounded-full peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-600 transition-all after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white/40 peer-checked:after:bg-white after:rounded-full after:h-6 after:w-6 after:shadow-2xl after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                    <div className="space-y-0.5">
                      <span className="block text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-emerald-400 transition-colors">Runtime Sync</span>
                      <span className="block text-[8px] font-bold text-slate-600 uppercase">Live in Production</span>
                    </div>
                  </div>
                  <div className="px-10 py-6 bg-slate-950/40 rounded-[40px] border border-white/5 flex items-center gap-10 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                        <Layout size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-black uppercase tracking-widest text-white">Execution Priority</div>
                        <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Conflict Resolution</div>
                      </div>
                    </div>
                    <input type="number" className="w-16 bg-transparent text-center font-black text-4xl text-indigo-400 focus:outline-none focus:text-white transition-colors" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full xl:w-auto">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full sm:w-auto px-12 py-6 bg-transparent text-slate-500 border-2 border-white/5 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 transition-all duration-500"
                  >
                    Reset Blueprint
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto relative group/save overflow-hidden px-24 py-7 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-xl shadow-slate-900/10 hover:scale-[1.05] active:scale-95 transition-all duration-500"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-purple-700 to-rose-600 opacity-0 group-hover/save:opacity-100 transition-opacity duration-700"></div>
                    <span className="relative z-10 group-hover/save:text-white transition-colors duration-500">Authorize Hub</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Industrial Simulation Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 card p-10 bg-slate-50/50 dark:bg-slate-900 shadow-2xl rounded-[56px] border-none">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                <Tag size={24} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Yield Oracle Sandbox</h2>
            </div>
            <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Real-time Simulation</span>
            </div>
          </div>

          <div className="space-y-12 mb-12">
            {/* Row -1: Asset Category Toggle */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-[28px] border border-slate-200 dark:border-slate-700 w-full sm:w-80">
                <button
                  type="button"
                  onClick={() => setSandboxAssetType('Bus')}
                  className={`flex-1 py-3.5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${sandboxAssetType === 'Bus' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  <Bus size={14} />
                  Bus Assets
                </button>
                <button
                  type="button"
                  onClick={() => setSandboxAssetType('Hotel')}
                  className={`flex-1 py-3.5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${sandboxAssetType === 'Hotel' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl' : 'text-slate-500 hover:text-slate-400'}`}
                >
                  <Hotel size={14} />
                  Hotel Assets
                </button>
              </div>
              <div className="hidden sm:block space-y-0.5 text-left">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Discovery</span>
                <span className="block text-[9px] font-bold text-indigo-500 uppercase italic">Filtering for {sandboxAssetType}s...</span>
              </div>
            </div>

            {/* Row 0: Smart Asset Matcher */}
            <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[40px] space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">Select {sandboxAssetType} Asset (Auto-feeds Simulation)</label>
                {fetchingItems && (
                  <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 animate-pulse">
                    <Clock size={12} className="animate-spin" />
                    <span>FETCHING {sandboxAssetType.toUpperCase()} DATA...</span>
                  </div>
                )}
              </div>
              <div className="relative group/bus">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 group-hover/bus:scale-110 transition-transform">
                  {sandboxAssetType === 'Bus' ? <Bus size={20} /> : <Hotel size={20} />}
                </div>
                <select
                  className="w-full bg-white dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 rounded-3xl h-20 pl-16 pr-10 font-black text-lg text-slate-900 dark:text-white outline-none focus:border-indigo-500 outline-none shadow-xl transition-all appearance-none"
                  value={selectedBusId}
                  onChange={e => handleAssetChange(e.target.value)}
                >
                  <option value="">Select {sandboxAssetType} Asset</option>
                  {buses.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} {asset.subtitle ? `(${asset.subtitle})` : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            {/* Row 1: Context & Assets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  {sandboxAssetType === 'Bus' ? 'Route Context (Origin → Destination)' : 'Location Context (City)'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select
                      className="input-sandbox h-14 pl-4 pr-10 text-[11px] font-black uppercase appearance-none"
                      value={simParams.sourceCity}
                      onChange={e => setSimParams({ ...simParams, sourceCity: e.target.value, destinationCity: '' })}
                    >
                      <option value="">{sandboxAssetType === 'Bus' ? 'Select Origin' : 'Select City'}</option>
                      {sandboxAssetType === 'Bus' ? (
                        [...new Set(routes.map(r => r.fromCity))].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))
                      ) : (
                        [...new Set(buses.map(b => b.subtitle))].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))
                      )}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                  {sandboxAssetType === 'Bus' && (
                    <div className="relative">
                      <select
                        className="input-sandbox h-14 pl-4 pr-10 text-[11px] font-black uppercase appearance-none disabled:opacity-30"
                        value={simParams.destinationCity}
                        onChange={e => setSimParams({ ...simParams, destinationCity: e.target.value })}
                        disabled={!simParams.sourceCity}
                      >
                        <option value="">Select Sink</option>
                        {routes
                          .filter(r => r.fromCity === simParams.sourceCity)
                          .map(r => (
                            <option key={r._id || r.toCity} value={r.toCity}>{r.toCity}</option>
                          ))
                        }
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  {sandboxAssetType === 'Bus' ? 'Merchant Asset (Seat & Bus)' : 'Hotel Config (Room & Meal)'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <select className="input-sandbox h-14 text-[11px] font-black uppercase px-4" value={simParams.seatType} onChange={e => setSimParams({ ...simParams, seatType: e.target.value })}>
                    {sandboxAssetType === 'Bus' ? (
                      <>
                        <option value="All">All Seats</option>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Sleeper">Sleeper</option>
                        <option value="Seater">Seater</option>
                      </>
                    ) : (
                      <>
                        <option value="All">All Rooms</option>
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Super Deluxe">Super Deluxe</option>
                        <option value="Suite">Suite</option>
                      </>
                    )}
                  </select>
                  <select className="input-sandbox h-14 text-[11px] font-black uppercase px-4" value={simParams.busType} onChange={e => setSimParams({ ...simParams, busType: e.target.value })}>
                    {sandboxAssetType === 'Bus' ? (
                      <>
                        <option value="All">All Buses</option>
                        <option value="Sleeper">Sleeper</option>
                        <option value="Volvo">Volvo</option>
                        <option value="Luxury">Luxury</option>
                      </>
                    ) : (
                      <>
                        <option value="All">All Meals</option>
                        <option value="EP">All Meals</option>
                        <option value="CP">Breakfast (CP)</option>
                        <option value="MAP">Half Board (MAP)</option>
                        <option value="AP">Full Board (AP)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 2: Financials & Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Financial Core Data</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <span className="block text-[8px] font-black text-slate-400 uppercase text-center">{sandboxAssetType === 'Bus' ? 'Base Fare' : 'Room Price'}</span>
                    <input type="number" className="input-sandbox h-14 text-center font-black text-xl" value={simParams.ticketPrice} onChange={e => setSimParams({ ...simParams, ticketPrice: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[8px] font-black text-slate-400 uppercase text-center">Discount</span>
                    <input type="number" className="input-sandbox h-14 text-center font-black text-xl text-rose-500" value={simParams.discountAmount} onChange={e => setSimParams({ ...simParams, discountAmount: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[8px] font-black text-slate-400 uppercase text-center">Occupancy%</span>
                    <input type="number" className="input-sandbox h-14 text-center font-black text-xl" value={simParams.occupancy} onChange={e => setSimParams({ ...simParams, occupancy: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Yield Intelligence</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <span className="block text-[8px] font-black text-slate-400 uppercase text-center">{sandboxAssetType === 'Bus' ? 'Distance' : 'Star Rating'}</span>
                    {sandboxAssetType === 'Bus' ? (
                      <input type="number" className="input-sandbox h-14 text-center font-black text-[11px]" value={simParams.distance} onChange={e => setSimParams({ ...simParams, distance: Number(e.target.value) })} />
                    ) : (
                      <div className="input-sandbox h-14 flex items-center justify-center font-black text-sm text-indigo-500 bg-white/50">
                        {simParams.starRating || 3}★
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[8px] font-black text-slate-400 uppercase text-center">Period</span>
                    <select className="input-sandbox h-14 text-[11px] font-black uppercase px-2" value={simParams.demandType} onChange={e => setSimParams({ ...simParams, demandType: e.target.value })}>
                      <option value="Normal">Normal</option>
                      <option value="Weekend">Weekend</option>
                      <option value="Festival">Festival</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[8px] font-black text-slate-400 uppercase text-center">Yield Load</span>
                    <select className="input-sandbox h-14 text-[11px] font-black uppercase px-2" value={simParams.demandLevel} onChange={e => setSimParams({ ...simParams, demandLevel: e.target.value })}>
                      <option value="Low">Low</option>
                      <option value="Mid">Mid</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Temporal Window (Integration) */}
            <div className="p-8 bg-white/30 rounded-[32px] border border-white/20 flex items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                  <Clock size={20} />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-[11px] font-black text-slate-900 uppercase tracking-widest">Temporal Simulation Window</span>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase">Simulate dynamic pricing for specific time slots</span>
                </div>
              </div>
              <div className="flex-1 max-w-xs relative">
                <select
                  className="input-sandbox w-full h-14 text-[11px] font-black uppercase appearance-none px-6"
                  value={simParams.timeSlot}
                  onChange={e => setSimParams({ ...simParams, timeSlot: e.target.value })}
                >
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={runSimulation} className="w-full py-8 bg-slate-900 text-white rounded-[40px] font-black text-[13px] uppercase tracking-[0.4em] hover:scale-[1.01] transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] relative overflow-hidden group/sim">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover/sim:opacity-20 transition-opacity whitespace-nowrap"></div>
            Execute Neural Intelligence
          </button>
        </div>

        <div className="card p-12 bg-indigo-600 text-white border-none shadow-3xl rounded-[56px] flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-16 opacity-5 scale-150 rotate-12 group-hover:scale-[1.8] transition-transform duration-1000">
            <Navigation size={160} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] mb-8 opacity-50">Predicted Payout</h3>

          {previewResult ? (
            <div className="flex-1 flex flex-col justify-between animate-in zoom-in-90 duration-500">
              <div>
                <div className="text-7xl font-black mb-4 tracking-tighter self-start">₹{previewResult.commission}</div>
                <div className="space-y-3 mb-10">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-2xl w-fit border border-white/10">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{previewResult.appliedRule || 'Static Default'}</span>
                  </div>
                  {previewResult.breakdown && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 opacity-80 mt-6 border-t border-white/10 pt-4">
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/50">{sandboxAssetType === 'Bus' ? 'Base Fare' : 'Room Price'}</div>
                      <div className="text-[11px] font-black text-right">₹{previewResult.breakdown.baseFare}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/50">Discount</div>
                      <div className="text-[11px] font-black text-right text-rose-300">-₹{previewResult.breakdown.discount}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/50">Commission</div>
                      <div className="text-[11px] font-black text-right text-emerald-300">+₹{previewResult.breakdown.commission}</div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 opacity-60 ml-1 mt-4">
                    <Star size={12} className="text-amber-300" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Priority Optimization: Level {previewResult.priority || 0}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between opacity-50">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Strategy</span>
                  <span className="text-xs font-black uppercase">{previewResult.commissionType} Yield</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">{sandboxAssetType === 'Bus' ? 'Gross Collection' : 'Total Booking'}</span>
                  <span className="text-3xl font-black">₹{previewResult.finalPrice}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 italic">
              <Clock size={48} className="mb-6 animate-spin duration-10000" />
              <p className="font-black uppercase tracking-[0.4em] text-xs">Awaiting Execution Profile...</p>
            </div>
          )}
        </div>
      </div>

      {/* Orchestrator Master Table */}
      <div className="card shadow-3xl border-none p-0 overflow-hidden rounded-[56px]">
        <div className="p-10 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Layout size={20} className="text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Ruleset Repository</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30"></div> Operational</div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div> Offline</div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 text-left border-b border-slate-100 dark:border-slate-800">
                <th className="px-12 py-8">Blueprint & Merchant</th>
                <th className="px-12 py-8">Asset Targeting</th>
                <th className="px-12 py-8">Commercial Matrix</th>
                <th className="px-12 py-8">Operational Intel</th>
                <th className="px-12 py-8 text-right">Utility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {!loading && rules.map(rule => (
                <tr key={rule._id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all duration-300">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-[24px] flex items-center justify-center transition-all ${rule.category === 'Bus' ? 'bg-indigo-100 text-indigo-600 shadow-lg shadow-indigo-500/10' :
                        rule.category === 'Hotel' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                        {rule.category === 'Bus' ? <Bus size={26} className="group-hover:rotate-12 transition-transform" /> : rule.category === 'Hotel' ? <Hotel size={26} /> : <Layers size={26} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-xs">{rule.ruleName || 'Unnamed blueprint'}</span>
                          <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded-lg uppercase shadow-md shadow-indigo-600/20">P:{rule.priority}</span>
                        </div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rule.operatorId?.companyName || rule.operatorId?.name || 'Global Shared'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase underline decoration-indigo-200 underline-offset-4">
                        <Layout size={12} className="text-indigo-400" /> {rule.seatType === 'All' ? `All ${rule.category === 'Bus' ? 'Seats' : 'Rooms'}` : rule.seatType} / {rule.busType === 'All' ? `All ${rule.category === 'Bus' ? 'Buses' : 'Plans'}` : rule.busType}
                      </div>
                      <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {rule.category === 'Bus' ? (
                          <>
                            <Navigation size={12} className="text-rose-400" /> {rule.sourceCity} → {rule.destinationCity}
                          </>
                        ) : (
                          <>
                            <MapPin size={12} className="text-rose-400" /> City: {rule.sourceCity || 'All'} {rule.starRating ? `| ${rule.starRating}★+` : ''}
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="space-y-1">
                      <div className="text-xl font-black text-slate-900 dark:text-white leading-none">{rule.value}{rule.commissionType === 'percentage' ? '%' : '₹'}</div>
                      <div className="text-[9px] font-black uppercase text-indigo-400/70 tracking-tighter">Cap: ₹{rule.minCap}-₹{rule.maxCap}</div>
                    </div>
                  </td>
                  <td className="px-12 py-8">
                    {rule.isDynamic ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Dynamic Scaling</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">Static Surcharge</span>
                    )}
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <button onClick={() => handleEdit(rule)} className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-3xl shadow-xl active:scale-90 transition-all"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(rule._id)} className="p-4 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 rounded-3xl shadow-xl active:scale-90 transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rules.length === 0 && !loading && (
            <div className="p-24 flex flex-col items-center justify-center opacity-30 italic select-none">
              <Target size={64} className="mb-6 animate-pulse text-slate-300" />
              <p className="font-black uppercase tracking-[0.5em] text-sm text-slate-400">Yield Oracle Repo Empty</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .input-orchestrator {
            @apply w-full bg-white border border-slate-200 rounded-3xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 focus:outline-none transition-all placeholder:text-slate-300 text-slate-900 font-bold h-16 px-6 shadow-sm;
        }
        .input-sandbox {
            @apply w-full bg-slate-50 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 shadow-sm text-slate-900 font-black h-14 px-5 flex items-center justify-center;
        }
        .card {
            @apply bg-white/60 backdrop-blur-[40px] rounded-[56px] border border-white shadow-2xl shadow-slate-200/50 p-12 md:p-16;
        }
        .shadow-neon {
            box-shadow: 0 4px 20px rgba(6, 182, 212, 0.15);
        }
        .shadow-glow-cyan {
            box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
        }
      `}</style>
    </div>
  );
};


export default CommissionManagement;
