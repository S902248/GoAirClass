import React, { useEffect, useState } from 'react';
import { User, Plus, Smartphone, Mail, Check, Calendar, Globe, CreditCard } from 'lucide-react';
import axios from 'axios';
import { Select, DatePicker, Input, message } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const FlightPassengerDetails = ({ passengers, setPassengers, contact, setContact, onNext }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            setLoading(true);
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const user = response.data;
                
                // Prefill first traveller if empty
                if (passengers.length > 0 && !passengers[0].firstName && !passengers[0].lastName) {
                    const updatedPassengers = [...passengers];
                    updatedPassengers[0] = {
                        ...updatedPassengers[0],
                        firstName: user.firstName || user.fullName?.split(' ')[0] || '',
                        lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
                        gender: user.gender || 'Male',
                        nationality: user.nationality || 'Indian',
                        dob: user.dob ? dayjs(user.dob).format('YYYY-MM-DD') : '',
                        passportNumber: user.passportNumber || '',
                        passportExpiry: user.passportExpiry ? dayjs(user.passportExpiry).format('YYYY-MM-DD') : '',
                        frequentFlyer: user.frequentFlyer || ''
                    };
                    setPassengers(updatedPassengers);
                }

                // Prefill contact info if empty
                if (!contact.email) {
                    setContact(prev => ({
                        ...prev,
                        email: user.email || '',
                        mobile: user.mobileNumber || prev.mobile
                    }));
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Silence error if not logged in or profile not completed
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const updatePassenger = (id, field, value) => {
        setPassengers(passengers.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const addPassenger = () => {
        setPassengers([...passengers, {
            id: Date.now(),
            title: 'Mr',
            firstName: '',
            lastName: '',
            gender: 'Male',
            dob: '',
            nationality: 'Indian',
            passportNumber: '',
            passportExpiry: '',
            frequentFlyer: ''
        }]);
    };

    const removePassenger = (id) => {
        if (passengers.length > 1) {
            setPassengers(passengers.filter(p => p.id !== id));
        }
    };

    const validateForm = () => {
        for (const p of passengers) {
            if (!p.firstName) {
                message.error('First name is required for all travellers');
                return false;
            }
            if (!p.lastName) {
                message.error('Last name is required for all travellers');
                return false;
            }
            if (p.passportExpiry && dayjs(p.passportExpiry).isBefore(dayjs())) {
                message.error('Passport must not be expired');
                return false;
            }
        }
        if (!contact.email || !/^\S+@\S+\.\S+$/.test(contact.email)) {
            message.error('Please enter a valid email address');
            return false;
        }
        if (!contact.mobile || contact.mobile.length < 10) {
            message.error('Please enter a valid mobile number');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onNext();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Traveller Details Card */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="bg-[#003580] px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-black text-xl uppercase tracking-widest">Traveller Details</h2>
                            <p className="text-[10px] font-bold text-blue-200/60 uppercase tracking-widest mt-0.5">Enter details as per passport</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-12">
                    {passengers.map((p, idx) => (
                        <div key={p.id} className="relative p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 group border-l-4 border-l-[#003580]">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#003580] rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-100">
                                        {idx + 1}
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest">Adult {idx + 1}</h4>
                                </div>
                                {passengers.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removePassenger(p.id)}
                                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-2"
                                    >
                                        Remove Traveller
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title</label>
                                    <Select
                                        value={p.title}
                                        onChange={(val) => updatePassenger(p.id, 'title', val)}
                                        className="w-full h-[54px]"
                                        size="large"
                                    >
                                        <Option value="Mr">Mr.</Option>
                                        <Option value="Ms">Ms.</Option>
                                        <Option value="Mrs">Mrs.</Option>
                                        <Option value="Miss">Miss</Option>
                                        <Option value="Dr">Dr.</Option>
                                    </Select>
                                </div>
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="As per Passport"
                                        value={p.firstName}
                                        onChange={(e) => updatePassenger(p.id, 'firstName', e.target.value)}
                                        className="w-full h-[54px] bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-[#003580] transition-all outline-none"
                                    />
                                </div>
                                <div className="md:col-span-1.5 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="As per Passport"
                                        value={p.lastName}
                                        onChange={(e) => updatePassenger(p.id, 'lastName', e.target.value)}
                                        className="w-full h-[54px] bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-[#003580] transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                                    <div className="flex bg-white p-1.5 rounded-2xl border-2 border-gray-100 h-[54px]">
                                        {['Male', 'Female', 'Other'].map((g) => (
                                            <button
                                                key={g}
                                                type="button"
                                                onClick={() => updatePassenger(p.id, 'gender', g)}
                                                className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p.gender === g ? 'bg-[#003580] text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                                            >
                                                {g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                    <DatePicker
                                        className="w-full h-[54px] rounded-2xl border-2 border-gray-100 font-bold"
                                        value={p.dob ? dayjs(p.dob) : null}
                                        onChange={(date, dateString) => updatePassenger(p.id, 'dob', dateString)}
                                        placeholder="DD-MM-YYYY"
                                        format="DD-MM-YYYY"
                                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Nationality
                                    </label>
                                    <Select
                                        showSearch
                                        value={p.nationality}
                                        onChange={(val) => updatePassenger(p.id, 'nationality', val)}
                                        className="w-full h-[54px]"
                                        size="large"
                                        placeholder="Search country"
                                    >
                                        <Option value="Indian">Indian</Option>
                                        <Option value="American">American</Option>
                                        <Option value="British">British</Option>
                                        <Option value="Canadian">Canadian</Option>
                                        <Option value="Australian">Australian</Option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Passport Number</label>
                                    <input
                                        type="text"
                                        placeholder="Passport ID"
                                        value={p.passportNumber}
                                        onChange={(e) => updatePassenger(p.id, 'passportNumber', e.target.value.toUpperCase())}
                                        className="w-full h-[54px] bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-[#003580] transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Passport Expiry</label>
                                    <DatePicker
                                        className="w-full h-[54px] rounded-2xl border-2 border-gray-100 font-bold"
                                        value={p.passportExpiry ? dayjs(p.passportExpiry) : null}
                                        onChange={(date, dateString) => updatePassenger(p.id, 'passportExpiry', dateString)}
                                        placeholder="Expiry Date"
                                        format="DD-MM-YYYY"
                                        disabledDate={(current) => current && current < dayjs().endOf('day')}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <div className="w-full md:w-1/2 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <CreditCard className="w-3 h-3" /> Frequent Flyer Number (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Optional"
                                        value={p.frequentFlyer}
                                        onChange={(e) => updatePassenger(p.id, 'frequentFlyer', e.target.value)}
                                        className="w-full h-[54px] bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-[#003580] transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addPassenger}
                        className="w-full py-6 rounded-[24px] border-2 border-dashed border-blue-200 text-sm font-black text-[#003580] uppercase tracking-widest hover:bg-blue-50 hover:border-[#003580] transition-all flex items-center justify-center gap-3 group"
                    >
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Add Another Traveller</span>
                    </button>
                </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 transition-all hover:shadow-md">
                <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-blue-50 text-[#003580] rounded-[24px] flex items-center justify-center shadow-inner">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Contact Information</h2>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">For booking confirmation & updates</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            <span>Email Address</span>
                        </label>
                        <input
                            type="email"
                            placeholder="traveller@example.com"
                            value={contact.email}
                            onChange={(e) => setContact({ ...contact, email: e.target.value })}
                            className="w-full h-[54px] bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 text-sm font-bold focus:bg-white focus:border-[#003580] transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Smartphone className="h-3.5 w-3.5" />
                            <span>Mobile Number</span>
                        </label>
                        <div className="flex gap-3">
                            <div className="w-24 h-[54px]">
                                <Select
                                    defaultValue="+91"
                                    className="w-full h-full"
                                    size="large"
                                >
                                    <Option value="+91">+91</Option>
                                    <Option value="+1">+1</Option>
                                    <Option value="+44">+44</Option>
                                    <Option value="+971">+971</Option>
                                </Select>
                            </div>
                            <input
                                type="tel"
                                placeholder="Mobile Number"
                                value={contact.mobile}
                                onChange={(e) => setContact({ ...contact, mobile: e.target.value })}
                                className="flex-1 h-[54px] bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 text-sm font-bold focus:bg-white focus:border-[#003580] transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 p-6 bg-emerald-50 rounded-[24px] border border-emerald-100 flex items-start gap-4">
                    <div className="bg-emerald-500 rounded-full p-1 mt-0.5">
                        <Check className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-tight leading-relaxed">
                        You will receive e-tickets and flight updates via SMS and Email.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                className="w-full py-6 bg-[#f26a36] hover:bg-[#e05d2e] text-white rounded-[24px] font-black text-lg uppercase tracking-widest transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10">Confirm Details & Continue</span>
                <Plus className="w-6 h-6 relative z-10" />
            </button>
        </form>
    );
};

export default FlightPassengerDetails;
