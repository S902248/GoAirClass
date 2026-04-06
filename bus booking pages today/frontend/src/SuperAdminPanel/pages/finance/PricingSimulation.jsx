import React, { useState, useEffect } from 'react';
import pricingApi from '../../../api/pricingApi';
import Axios from '../../../api/Axios';

const PricingSimulation = () => {
    const [formData, setFormData] = useState({
        busId: '',
        scheduleId: '',
        travelDate: new Date().toISOString().split('T')[0],
        userRole: 'B2C',
        selectedSeats: [],
        boardingPointId: '',
        couponCode: ''
    });

    const [breakdown, setBreakdown] = useState(null);
    const [loading, setLoading] = useState(false);
    const [buses, setBuses] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const res = await Axios.get('/buses/all');
            setBuses(res.data);
        } catch (err) {
            console.error('Error fetching buses:', err);
        }
    };

    const fetchSchedules = async (busId) => {
        try {
            const res = await Axios.get(`/schedules/all`);
            // Filter schedules for this bus for demo purposes
            setSchedules((res.data || []).filter(s => s.bus?._id === busId));
        } catch (err) {
            console.error('Error fetching schedules:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'busId') {
            fetchSchedules(value);
        }
    };

    const handleSeatChange = (e) => {
        const seats = e.target.value.split(',').map(s => s.trim()).filter(s => s);
        setFormData(prev => ({ ...prev, selectedSeats: seats }));
    };

    useEffect(() => {
        if (formData.busId && formData.scheduleId) {
            simulatePricing();
        }
    }, [formData]);

    const simulatePricing = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await pricingApi.simulate(formData);
            if (res.success) {
                setBreakdown(res.breakdown);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-8 text-blue-400">🧠 Real-Time Pricing Simulation Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs Section */}
                <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="mr-2">🧩</span> Configuration
                    </h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Select Bus</label>
                            <select 
                                name="busId" 
                                value={formData.busId} 
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="">Select a Bus</option>
                                {buses.map(bus => (
                                    <option key={bus._id} value={bus._id}>{bus.busName} ({bus.busNumber})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Select Schedule</label>
                            <select 
                                name="scheduleId" 
                                value={formData.scheduleId} 
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                disabled={!formData.busId}
                            >
                                <option value="">Select a Schedule</option>
                                {schedules.map(sch => (
                                    <option key={sch._id} value={sch._id}>{sch.route?.fromCity} → {sch.route?.toCity} ({sch.departureTime})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Travel Date</label>
                                <input 
                                    type="date" 
                                    name="travelDate" 
                                    value={formData.travelDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">User Role</label>
                                <select 
                                    name="userRole" 
                                    value={formData.userRole}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="B2C">B2C (Normal)</option>
                                    <option value="Agent">Agent (B2B)</option>
                                    <option value="Corporate">Corporate</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Seats (comma separated, e.g. L1, U5)</label>
                            <input 
                                type="text" 
                                placeholder="L1, L2..."
                                onChange={handleSeatChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Coupon Code</label>
                            <input 
                                type="text" 
                                name="couponCode"
                                value={formData.couponCode}
                                onChange={handleInputChange}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Apply coupon..."
                            />
                        </div>
                    </div>
                </div>

                {/* Breakdown Section */}
                <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        {loading && <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>}
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <span className="mr-2">📊</span> Fare Breakdown
                    </h2>

                    {breakdown ? (
                        <div className="space-y-6">
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Base Fare</span>
                                    <span className="font-mono text-lg">₹{breakdown.baseFare}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Seat Premiums</span>
                                    <span className="font-mono text-lg text-emerald-400">+₹{breakdown.seatPremiums}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Surge Pricing</span>
                                    <span className="font-mono text-lg text-amber-400">+₹{breakdown.surgeAmount}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-400">Boarding Premium</span>
                                    <span className="font-mono text-lg text-blue-400">+₹{breakdown.boardingPremium}</span>
                                </div>
                            </div>

                            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                                <div className="flex justify-between items-center mb-2 text-red-400">
                                    <span>User Type Discount</span>
                                    <span className="font-mono">-₹{breakdown.userDiscount}</span>
                                </div>
                                <div className="flex justify-between items-center text-red-400">
                                    <span>Coupon Discount</span>
                                    <span className="font-mono">-₹{breakdown.couponDiscount}</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-700 pt-4">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-2xl font-bold">Final Fare (Total)</span>
                                    <span className="text-3xl font-bold text-blue-500">₹{breakdown.totalFare}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-indigo-500/10 p-4 rounded-xl border border-indigo-500/20">
                                        <p className="text-xs text-indigo-300 uppercase tracking-wider mb-1">Commission</p>
                                        <p className="text-xl font-bold text-indigo-400">₹{breakdown.commission}</p>
                                    </div>
                                    <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
                                        <p className="text-xs text-purple-300 uppercase tracking-wider mb-1">GST (18%)</p>
                                        <p className="text-xl font-bold text-purple-400">₹{breakdown.gst}</p>
                                    </div>
                                </div>

                                <div className="mt-4 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                                    <p className="text-xs text-emerald-300 uppercase tracking-wider mb-1">Operator Net Earnings</p>
                                    <p className="text-2xl font-bold text-emerald-400">₹{breakdown.operatorEarnings}</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest">Active Modules</p>
                                <div className="flex flex-wrap gap-2">
                                    {breakdown.appliedModules.map((mod, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-slate-700 rounded text-[10px] text-slate-300 border border-slate-600 uppercase font-bold">
                                            {mod}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                            <span className="text-5xl mb-4">🪄</span>
                            <p>Select a bus and schedule to start simulation</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm">
                            ⚠️ {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricingSimulation;
