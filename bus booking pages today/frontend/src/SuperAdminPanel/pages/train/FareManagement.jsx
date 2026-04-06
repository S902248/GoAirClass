import { useState, useEffect } from 'react';
import { DollarSign, Save, Edit, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import trainApi from '../../../api/trainApi';

const FareManagement = () => {
    const [fares, setFares] = useState([]);
    const [baseFarePerKm, setBaseFarePerKm] = useState(2.0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFares = async () => {
            try {
                const res = await trainApi.getFareRules();
                if (res.success) {
                    setBaseFarePerKm(res.baseFarePerKm || 2.0);
                    
                    if (res.fares.length > 0) {
                        const classNames = {
                            '1A': 'First AC (1A)',
                            '2A': 'Second AC (2A)',
                            '3A': 'Third AC (3A)',
                            'SL': 'Sleeper (SL)',
                            'CC': 'Chair Car (CC)',
                        };
                        
                        setFares(res.fares.map(f => ({
                            id: f._id,
                            class: classNames[f.classType] || `${f.classType} Class`,
                            type: f.classType,
                            baseFare: f.baseFare,
                            multiplier: f.multiplier || 1.0,
                            tatkal: f.tatkalCharge,
                            dynamic: f.dynamicPricing
                        })));
                    } else {
                        setFares([
                            { class: 'First AC (1A)', type: '1A', baseFare: 0, multiplier: 3.0, tatkal: 500, dynamic: '15%' },
                            { class: 'Second AC (2A)', type: '2A', baseFare: 0, multiplier: 2.0, tatkal: 400, dynamic: '12%' },
                            { class: 'Third AC (3A)', type: '3A', baseFare: 0, multiplier: 1.5, tatkal: 300, dynamic: '10%' },
                            { class: 'Sleeper (SL)', type: 'SL', baseFare: 0, multiplier: 1.0, tatkal: 150, dynamic: 'None' },
                        ]);
                    }
                }
            } catch (error) {
                toast.error("Failed to load fare rules");
            } finally {
                setLoading(false);
            }
        };
        fetchFares();
    }, []);

    const handleSave = async () => {
        try {
            const data = {
                trainId: '000000000000000000000000', // Default global configuration
                baseFarePerKm: parseFloat(baseFarePerKm),
                fares: fares
            };
            const res = await trainApi.saveFareRules(data);
            if (res.success) {
                toast.success('Pricing rules updated successfully!');
            }
        } catch (error) {
            toast.error("Failed to save pricing rules");
        }
    };

    const updateMultiplier = (idx, val) => {
        const newFares = [...fares];
        newFares[idx].multiplier = parseFloat(val) || 0;
        setFares(newFares);
    };

    const updateTatkal = (idx, val) => {
        const newFares = [...fares];
        newFares[idx].tatkal = parseFloat(val) || 0;
        setFares(newFares);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Fare Management</h1>
                    <p className="text-slate-500 text-sm">Combine distance-based base fare with class multipliers.</p>
                </div>
                <button onClick={handleSave} className="bg-train-primary hover:bg-train-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-train-primary/20 transition-all active:scale-95">
                    <Save size={18} />
                    <span>Save All Changes</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Base Pricing Section */}
                    <div className="card p-6 bg-slate-50/50 dark:bg-slate-800/50 border-dashed border-2">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-train-primary/10 flex items-center justify-center text-train-primary">
                                <DollarSign size={24} />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Base Rate (per KM)</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-bold">₹</span>
                                    <input 
                                        type="number" 
                                        value={baseFarePerKm} 
                                        onChange={(e) => setBaseFarePerKm(e.target.value)}
                                        className="bg-transparent text-xl font-black w-24 outline-none border-b-2 border-transparent focus:border-train-primary transition-all"
                                    />
                                    <span className="text-slate-400 font-medium">/ km</span>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase italic">Formula Applied:</p>
                                <p className="text-xs font-bold text-slate-500">(Distance × ₹{baseFarePerKm}) × Multiplier</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                             <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input type="text" placeholder="Filter classes..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none text-sm font-medium" />
                            </div>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Multiplier</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tatkal Charges</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dynamic Pricing</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Preview</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {fares.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-bold text-sm">{item.class}</p>
                                                <p className="text-[10px] font-black text-train-primary uppercase">{item.type}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-400">×</span>
                                                    <input 
                                                        type="number" 
                                                        step="0.1"
                                                        value={item.multiplier}
                                                        onChange={(e) => updateMultiplier(idx, e.target.value)}
                                                        className="w-16 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-bold outline-none focus:ring-1 focus:ring-train-primary"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400 text-xs">₹</span>
                                                    <input 
                                                        type="number" 
                                                        value={item.tatkal}
                                                        onChange={(e) => updateTatkal(idx, e.target.value)}
                                                        className="w-20 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-train-primary outline-none transition-all text-sm font-bold"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black ${item.dynamic === 'None' ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-600'}`}>
                                                    {item.dynamic}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Approx (500km)</p>
                                                    <p className="text-sm font-black text-train-primary">₹{Math.round((500 * baseFarePerKm) * item.multiplier + item.tatkal)}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-6">
                        <h3 className="text-lg font-bold mb-4">Pricing Rules</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-train-primary-light dark:bg-train-primary/10 rounded-2xl border border-train-primary-light dark:border-train-primary/20">
                                <p className="text-xs font-bold text-train-primary uppercase mb-1">Dynamic Pricing</p>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2">Automatically increase fares based on seat demand and booking velocity.</p>
                            </div>
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                                <p className="text-xs font-bold text-rose-600 uppercase mb-1">Seasonal Surcharge</p>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2">Add fixed percentage on top of base fare during festival seasons.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FareManagement;
