import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Train,
    User,
    ShieldCheck,
    ChevronRight,
    Info,
    Plus,
    Trash2,
    MapPin,
    Clock,
    Mail,
    Phone,
    Zap,
    CreditCard,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import trainApi from '../api/trainApi';

const TrainBooking = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Redirect if no state (direct access)
    useEffect(() => {
        if (!state) {
            navigate('/trains');
        }
    }, [state, navigate]);

    if (!state) return null;

    const {
        trainId,
        trainName,
        trainNumber,
        coachType,
        price,
        availableSeats,
        boarding,
        destination,
        departureTime,
        arrivalTime,
        duration,
        journeyDate,
        sourceCity,
        destCity,
        sourceId,
        destinationId,
        trainRoute
    } = state;

    // ─── State ───────────────────────────────────────────────────────────────
    const [irctcUserId, setIrctcUserId] = useState('');
    const [passengers, setPassengers] = useState([
        { name: '', age: '', gender: 'Male', berthPreference: 'No Preference' }
    ]);
    const [contactDetails, setContactDetails] = useState({
        email: '',
        phone: ''
    });
    const [addOns, setAddOns] = useState({
        insurance: true,
        autoUpgrade: false
    });
    const [selectedBoarding, setSelectedBoarding] = useState(boarding || '');
    const [loading, setLoading] = useState(false);

    // ─── Handlers ────────────────────────────────────────────────────────────
    const addPassenger = () => {
        if (passengers.length >= 6) {
            toast.warning("Maximum 6 passengers allowed per booking");
            return;
        }
        setPassengers([...passengers, { name: '', age: '', gender: 'Male', berthPreference: 'No Preference' }]);
    };

    const removePassenger = (index) => {
        if (passengers.length > 1) {
            const newPassengers = passengers.filter((_, i) => i !== index);
            setPassengers(newPassengers);
        }
    };

    const updatePassenger = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const handleBooking = async () => {
        // Validation
        if (!irctcUserId) return toast.error("IRCTC User ID is required");
        if (!contactDetails.email || !contactDetails.phone) return toast.error("Contact details are required");

        for (const p of passengers) {
            if (!p.name || !p.age) return toast.error("All traveler details are required");
        }

        let loggedInUserId = null;
        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Decode the JWT payload using atob
                const payload = JSON.parse(atob(token.split('.')[1]));
                loggedInUserId = payload.id || payload._id || null;
            }
        } catch (e) {
            console.error("Could not parse JWT token from localStorage", e);
        }

        setLoading(true);
        try {
            const bookingData = {
                trainId,
                coachType,
                passengers,
                irctcUserId,
                contactDetails,
                addOns,
                totalFare: price * passengers.length,
                journeyDate,
                sourceId,
                destinationId,
                boardingStation: selectedBoarding,
                userId: loggedInUserId 
            };

            console.log('Initiating seat lock with data:', bookingData);

            const res = await trainApi.lockTrainSeats(bookingData);
            if (res.success) {
                toast.success("Seats Reserved for 5 minutes!");
                navigate('/train-payment', {
                    state: {
                        booking: res.booking,
                        lockExpiresAt: res.lockExpiresAt
                    }
                });
            } else {
                toast.error(res.message || "Reservation failed");
                if (res.details) console.error('Reservation validation details:', res.details);
            }
        } catch (error) {
            console.error('Reservation Error:', error);
            const errMsg = error.response?.data?.message || error.message || "Internal Server Error";
            toast.error(`Reservation Failed: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const totalToPay = (price * passengers.length) + (addOns.insurance ? 35 * passengers.length : 0);

    return (
        <div className="min-h-screen bg-[#F0F2F5] pb-32 pt-20 font-inter">
            <div className="max-w-6xl mx-auto px-4 lg:px-8">

                {/* 1. Train Summary Header */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#d84e55] shadow-inner">
                            <Train className="h-8 w-8" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-black text-[#1d2d44] tracking-tight">{trainName}</h1>
                                <span className="text-[10px] font-black bg-red-50 text-[#d84e55] px-2 py-0.5 rounded-lg border border-red-100 uppercase tracking-widest">#{trainNumber}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-orange-400" /> {coachType} Class</span>
                                <span>•</span>
                                <span className="text-green-600 uppercase tracking-widest font-black">{availableSeats} Seats Available</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="text-center">
                            <div className="text-xl font-black text-[#1d2d44]">{departureTime}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{sourceCity}</div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{duration}</div>
                            <div className="w-24 h-px bg-gray-200 relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 bg-white">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-black text-[#1d2d44]">{arrivalTime}</div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{destCity}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">

                        {/* 2. Boarding Station & IRCTC Section */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Boarding Station
                                    </label>
                                    <select
                                        value={selectedBoarding}
                                        onChange={(e) => setSelectedBoarding(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black text-[#1d2d44] focus:outline-none focus:border-[#d84e55] transition-all"
                                    >
                                        <option value={boarding}>{sourceCity}</option>
                                        {/* Dynamic stations would go here */}
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <User className="h-3 w-3" /> IRCTC User ID
                                        </label>
                                        <button className="text-[9px] font-black text-[#d84e55] uppercase tracking-widest hover:underline transition-all">Forgot ID?</button>
                                    </div>
                                    <input
                                        type="text"
                                        value={irctcUserId}
                                        onChange={(e) => setIrctcUserId(e.target.value)}
                                        placeholder="Enter IRCTC username"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-black text-[#1d2d44] placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] transition-all uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Passenger Details Form */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-[#1d2d44] tracking-tight">Traveler Details</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Add up to 6 passengers</p>
                                </div>
                                <button
                                    onClick={addPassenger}
                                    className="flex items-center gap-2 bg-red-50 text-[#d84e55] px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d84e55] hover:text-white transition-all shadow-sm"
                                >
                                    <Plus className="h-3.5 w-3.5" /> <span>Add Traveler</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {passengers.map((p, index) => (
                                    <div key={index} className="p-6 bg-gray-50/50 border border-gray-100 rounded-3xl space-y-6 relative group border-dashed hover:border-[#d84e55]/30 transition-all">
                                        {passengers.length > 1 && (
                                            <button
                                                onClick={() => removePassenger(index)}
                                                className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-6 w-6 rounded-full bg-[#1d2d44] text-white flex items-center justify-center font-black text-[10px]">
                                                {index + 1}
                                            </div>
                                            <span className="text-[10px] font-black text-[#1d2d44] uppercase tracking-widest">Traveler {index + 1}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Same as Govt. ID"
                                                    value={p.name}
                                                    onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1d2d44] placeholder:text-gray-200 focus:outline-none focus:border-[#d84e55] transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                                                <input
                                                    type="number"
                                                    placeholder="Years"
                                                    value={p.age}
                                                    onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1d2d44] placeholder:text-gray-200 focus:outline-none focus:border-[#d84e55] transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                                                <select
                                                    value={p.gender}
                                                    onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
                                                    className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-[#1d2d44] focus:outline-none focus:border-[#d84e55] transition-all"
                                                >
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Berth Preference</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['No Preference', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'].map(pref => (
                                                    <button
                                                        key={pref}
                                                        onClick={() => updatePassenger(index, 'berthPreference', pref)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${p.berthPreference === pref
                                                                ? 'bg-[#1d2d44] border-[#1d2d44] text-white shadow-md'
                                                                : 'bg-white border-gray-100 text-gray-500 hover:border-[#d84e55]/30'
                                                            }`}
                                                    >
                                                        {pref}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Contact Details Table */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black text-[#1d2d44] tracking-tight mb-8">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="To receive e-ticket"
                                        value={contactDetails.email}
                                        onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1d2d44] placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Mobile Number
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-black text-gray-400">+91</div>
                                        <input
                                            type="tel"
                                            placeholder="Booking updates sent here"
                                            value={contactDetails.phone}
                                            onChange={(e) => setContactDetails({ ...contactDetails, phone: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-black text-[#1d2d44] placeholder:text-gray-300 focus:outline-none focus:border-[#d84e55] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* 5. Add-ons Section */}
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-black text-[#1d2d44] uppercase tracking-widest mb-6">Optional Add-ons</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl group cursor-pointer" onClick={() => setAddOns({ ...addOns, insurance: !addOns.insurance })}>
                                    <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${addOns.insurance ? 'bg-[#1d2d44] border-[#1d2d44]' : 'border-gray-200 bg-white'}`}>
                                        {addOns.insurance && <div className="h-2 w-2 bg-white rounded-full" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs font-black text-[#1d2d44] uppercase tracking-tight">Travel Insurance</span>
                                            <span className="text-xs font-black text-green-600">₹35/p</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 leading-normal">Covers accidental damage & loss of baggage during the journey.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gray-50/50 border border-gray-100 rounded-2xl group cursor-pointer" onClick={() => setAddOns({ ...addOns, autoUpgrade: !addOns.autoUpgrade })}>
                                    <div className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${addOns.autoUpgrade ? 'bg-[#1d2d44] border-[#1d2d44]' : 'border-gray-200 bg-white'}`}>
                                        {addOns.autoUpgrade && <div className="h-2 w-2 bg-white rounded-full" />}
                                    </div>
                                    <div>
                                        <span className="text-xs font-black text-[#1d2d44] uppercase tracking-tight">Auto Upgrade</span>
                                        <p className="text-[10px] font-bold text-gray-400 leading-normal mt-1">Get automatically upgraded to higher class if seats are available.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Offers / Benefits */}
                        <div className="bg-gradient-to-br from-[#1d2d44] to-[#2b4162] rounded-[32px] p-8 text-white shadow-xl shadow-blue-100/50">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="h-6 w-6 text-blue-400" />
                                <h4 className="text-lg font-black tracking-tight">Booking Guarantee</h4>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-xs font-bold text-blue-100 uppercase tracking-widest">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                    Zero Cancellation Fees
                                </li>
                                <li className="flex items-center gap-3 text-xs font-bold text-blue-100 uppercase tracking-widest">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                    Instant PNR Status
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Sticky Bottom Price Summary */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:p-6 shadow-[0_-20px_50px_rgba(0_0_0_/_0.05)] z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Travelers</div>
                            <div className="text-xl font-black text-[#1d2d44]">{passengers.length} Adult{passengers.length > 1 ? 's' : ''}</div>
                        </div>
                        <div className="h-10 w-px bg-gray-100" />
                        <div>
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payable</div>
                            <div className="text-2xl font-black text-[#d84e55]">₹{totalToPay.toLocaleString()}</div>
                        </div>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={loading}
                        className="bg-[#d84e55] text-white px-12 py-5 rounded-[20px] font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200/50 hover:bg-[#c13e44] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <span>Proceed to Payment</span>
                                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainBooking;
