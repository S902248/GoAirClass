import React, { useState } from 'react';
import { User, Phone, Shield, CheckCircle, Edit3, Camera, MapPin, Mail, Calendar } from 'lucide-react';

const UserProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Placeholder data if user is not provided
    const profileData = user || {
        name: 'Guest User',
        mobileNumber: 'N/A',
        role: 'user',
        status: 'Active',
        joinedDate: 'March 2024'
    };

    return (
        <div className="min-h-screen bg-[#f8f9ff] pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tighter mb-2">My Profile</h1>
                        <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">Manage your personal information and account settings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Avatar & Quick Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm text-center relative overflow-hidden group">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#f26a36]/10 to-[#d84e55]/10 -z-0"></div>

                            <div className="relative z-10">
                                <div className="relative inline-block mb-6">
                                    <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <User className="h-16 w-16 text-gray-300" />
                                        </div>
                                    </div>
                                    <button className="absolute bottom-1 right-1 bg-[#f26a36] hover:bg-[#d84e55] text-white p-2.5 rounded-full shadow-lg transition-all scale-90 hover:scale-110">
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </div>

                                <h2 className="text-2xl font-black text-deep-navy uppercase tracking-tight mb-1">{profileData.name}</h2>
                                <p className="text-xs font-black text-[#f26a36] uppercase tracking-widest mb-6">{profileData.role}</p>

                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <CheckCircle className="h-3 w-3" /> {profileData.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-deep-navy rounded-[40px] p-8 text-white shadow-xl shadow-blue-900/10">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 opacity-60">Account Security</h3>
                            <div className="space-y-4">
                                <button className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl text-left transition-all border border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">Password</p>
                                    <p className="text-xs font-bold uppercase tracking-tight">Change Password</p>
                                </button>
                                <button className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl text-left transition-all border border-white/5">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-0.5">Verification</p>
                                    <p className="text-xs font-bold uppercase tracking-tight">Two-Factor Auth</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm">
                            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                                <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight">Personal Details</h3>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-2 text-[#f26a36] hover:text-[#d84e55] font-black text-[11px] uppercase tracking-widest transition-colors"
                                >
                                    <Edit3 className="h-4 w-4" />
                                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <User className="h-3 w-3" /> Full Name
                                    </p>
                                    {isEditing ? (
                                        <input type="text" defaultValue={profileData.name} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-100" />
                                    ) : (
                                        <p className="text-sm font-black text-deep-navy uppercase tracking-tight">{profileData.name}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> Mobile Number
                                    </p>
                                    <p className="text-sm font-black text-deep-navy uppercase tracking-tight">{profileData.mobileNumber}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="h-3 w-3" /> Email Address
                                    </p>
                                    {isEditing ? (
                                        <input type="email" defaultValue={profileData.email || 'user@example.com'} className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-100" />
                                    ) : (
                                        <p className="text-sm font-black text-deep-navy tracking-tight">{profileData.email || 'Not provided'}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <Shield className="h-3 w-3" /> Account Role
                                    </p>
                                    <p className="text-sm font-black text-[#f26a36] uppercase tracking-tight">{profileData.role}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="h-3 w-3" /> Member Since
                                    </p>
                                    <p className="text-sm font-black text-deep-navy uppercase tracking-tight">{profileData.joinedDate}</p>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin className="h-3 w-3" /> Location
                                    </p>
                                    {isEditing ? (
                                        <input type="text" defaultValue="Mumbai, India" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-orange-100" />
                                    ) : (
                                        <p className="text-sm font-black text-deep-navy uppercase tracking-tight">Mumbai, India</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Mini-List */}
                        <div className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm">
                            <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight mb-8">Recent Bookings</h3>
                            <div className="space-y-6">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-[#f26a36]/5 transition-colors group cursor-pointer border border-transparent hover:border-[#f26a36]/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Calendar className="h-5 w-5 text-gray-400 group-hover:text-[#f26a36]" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-deep-navy uppercase tracking-tight">Flight to Mumbai</p>
                                                <p className="text-[10px] font-bold text-gray-400 tracking-widest">ORDER #BK-2024{i} • MAR 04, 2024</p>
                                            </div>
                                        </div>
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
