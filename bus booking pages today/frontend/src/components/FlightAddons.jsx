import React from 'react';
import { Package, ShieldCheck, Coffee, Check, Plus, ShoppingBag } from 'lucide-react';

const FlightAddons = ({ passengers, addons, setAddons, onNext }) => {

    const toggleInsurance = () => {
        setAddons({ ...addons, insurance: !addons.insurance });
    };

    const toggleMeal = (passengerId) => {
        const currentMeals = addons.meals || [];
        if (currentMeals.includes(passengerId)) {
            setAddons({ ...addons, meals: currentMeals.filter(id => id !== passengerId) });
        } else {
            setAddons({ ...addons, meals: [...currentMeals, passengerId] });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Travel Insurance Card */}
            <div className={`bg-white rounded-3xl shadow-sm border-2 transition-all p-8 ${addons.insurance ? 'border-blue-600 ring-4 ring-blue-50' : 'border-gray-100'}`}>
                <div className="flex items-start justify-between">
                    <div className="flex gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${addons.insurance ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-black text-gray-900 uppercase">Trip Insurance</h2>
                                <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Recommended</span>
                            </div>
                            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Cover for trip cancellation, medical, and lost baggage</p>
                            <div className="flex gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase">UP TO ₹50,000 COVER</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase">24/7 ASSISTANCE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-black text-gray-900">₹{199 * passengers.length}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">₹199 per traveller</p>
                        <button
                            onClick={toggleInsurance}
                            className={`mt-4 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${addons.insurance ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {addons.insurance ? 'Remove Insurance' : 'Add Insurance'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Meals Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-orange-500 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <Coffee className="w-6 h-6" />
                        <h2 className="font-black text-lg uppercase tracking-tight">In-flight Meals</h2>
                    </div>
                </div>
                <div className="p-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Select fresh meals for your journey</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {passengers.map((p, idx) => (
                            <div key={p.id} className={`p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${addons.meals?.includes(p.id) ? 'border-orange-500 bg-orange-50/50' : 'border-gray-50 hover:border-orange-200'
                                }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${addons.meals?.includes(p.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 uppercase">{p.firstName} {p.lastName}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Executive Meal Tray</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900">₹350</p>
                                    <button
                                        onClick={() => toggleMeal(p.id)}
                                        className={`mt-2 p-2 rounded-lg transition-all ${addons.meals?.includes(p.id) ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'
                                            }`}
                                    >
                                        {addons.meals?.includes(p.id) ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full py-5 bg-[#f26a36] hover:bg-[#e05d2e] text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
            >
                Confirm Add-ons & Pay <ShoppingBag className="w-6 h-6" />
            </button>
        </div>
    );
};

export default FlightAddons;
