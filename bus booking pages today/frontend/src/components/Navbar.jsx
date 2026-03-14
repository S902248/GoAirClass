import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, CircleUser, ChevronDown, Menu, Headphones, Plane, TrainFront, Hotel, Tag, Ticket, X, Calendar, FileText, Mail, LayoutDashboard, User, Settings, Shield, LogOut, UserPlus, Fingerprint } from 'lucide-react';
import useOperator from '../hooks/useOperator';

const Navbar = ({ setView, activeTab, setActiveTab, isHome, isLoggedIn, user, onSignIn, onSignOut }) => {
    const navigate = useNavigate();
    const { operator } = useOperator();
    const [isManageBookingOpen, setIsManageBookingOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const productLinks = [
        { id: 'flight', label: 'FLIGHTS', icon: Plane },
        { id: 'hotel', label: 'HOTELS', icon: Hotel },
        { id: 'bus', label: 'BUS', icon: Bus },
        { id: 'train', label: 'TRAINS', icon: TrainFront }
    ];

    const manageBookingItems = [
        { label: "Bookings", icon: Ticket, action: () => setView('my-bookings'), desc: "View all booked tickets" },
        { label: "Cancel", icon: X, action: () => setView('cancel'), desc: "Cancel or modify bookings" },
        { label: "Change Travel Date", icon: Calendar, action: () => setView('change-date'), desc: "Reschedule your journey" },
        { label: "Show My Ticket", icon: FileText, action: () => setView('track-ticket'), desc: "Print or download E-ticket" },
        { label: "Email/SMS", icon: Mail, action: () => setView('email-sms'), desc: "Get ticket on mobile/email" },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-[1000] bg-white border-b border-gray-200">
            {/* Top Info Bar (Hidden on Mobile) */}
            <div className="hidden lg:flex justify-end items-center gap-6 px-8 py-1.5 border-b border-gray-100 text-[10px] font-bold text-gray-500 tracking-wider">
                <div onClick={() => setView('offers-page')} className="flex items-center gap-1.5 hover:text-[#f26a36] cursor-pointer uppercase">
                    <Tag className="h-3 w-3" /> Offers
                </div>
                <div onClick={() => setView('track-ticket')} className="flex items-center gap-1.5 hover:text-[#f26a36] cursor-pointer uppercase">
                    <Ticket className="h-3 w-3" /> Track Ticket
                </div>
                <div onClick={() => navigate('/admin')} className="flex items-center gap-1.5 hover:text-[#f26a36] cursor-pointer uppercase">
                    <LayoutDashboard className="h-3 w-3" /> Admin Panel
                </div>
                <div onClick={() => setView('support')} className="flex items-center gap-1.5 hover:text-[#f26a36] cursor-pointer uppercase">
                    <Headphones className="h-3 w-3" /> Support
                </div>

                {isLoggedIn && user ? (
                    <div className="flex items-center gap-4 ml-2 border-l border-gray-200 pl-4">
                        <span className="flex items-center gap-1.5 text-[#f26a36] font-black uppercase tracking-widest">
                            <CircleUser className="h-3 w-3" />
                            {user?.name?.split(' ')[0] || 'MY ACCOUNT'}
                        </span>
                        <button onClick={onSignOut} className="text-gray-500 hover:text-gray-800 transition-colors uppercase flex items-center gap-1">
                            LOGOUT
                        </button>
                    </div>
                ) : (
                    <button onClick={onSignIn} className="text-gray-500 hover:text-gray-800 transition-colors uppercase ml-4 flex items-center gap-1 border-l border-gray-200 pl-4">
                        LOGIN
                    </button>
                )}
            </div>

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between lg:justify-start lg:gap-16">

                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer shrink-0"
                    onClick={() => setView('landing')}
                >
                    <div className="bg-[#f26a36] p-2 rounded-xl shadow-md">
                        <Bus className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[26px] font-black tracking-tight text-[#424242]">
                        GOAIR<span className="text-[#f26a36]">CLASS</span>
                    </span>
                </div>

                {/* Desktop Primary Links */}
                <div className="hidden lg:flex items-center gap-8 flex-1 pl-4">
                    {productLinks.map((link) => {
                        const isActive = activeTab === link.id;
                        return (
                            <div
                                key={link.id}
                                onClick={() => { setActiveTab(link.id); }}
                                className={`group relative flex flex-col items-center justify-center cursor-pointer transition-colors pt-2 pb-1
                                    ${isActive ? 'text-[#f26a36]' : 'text-[#424242] hover:text-[#f26a36]'}`}
                            >
                                <span className="text-[12px] font-bold tracking-widest">{link.label}</span>
                                {/* Bottom active border */}
                                <div className={`absolute bottom-0 w-full h-[3px] bg-[#f26a36] rounded-t-sm transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                            </div>
                        );
                    })}

                    <div className="flex items-center gap-8 ml-auto">
                        <div
                            className="relative"
                            onMouseEnter={() => setIsManageBookingOpen(true)}
                            onMouseLeave={() => setIsManageBookingOpen(false)}
                        >
                            <div className="flex items-center gap-1 text-[12px] font-bold tracking-widest text-[#424242] hover:text-[#f26a36] cursor-pointer transition-colors py-2">
                                MANAGE BOOKING
                                <ChevronDown className="h-3 w-3" />
                            </div>

                            {isManageBookingOpen && (
                                <div className="absolute top-full left-0 mt-0 w-56 bg-white shadow-xl border border-gray-100 rounded-md overflow-hidden z-50">
                                    {manageBookingItems.map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (item.action) item.action();
                                                    setIsManageBookingOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group text-left"
                                            >
                                                <Icon className="h-4 w-4 text-gray-400 group-hover:text-[#f26a36]" />
                                                <span className="text-[11px] font-bold text-gray-600 group-hover:text-[#f26a36] uppercase">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Separate User Icon with Dropdown */}
                        <div
                            className="relative flex items-center gap-2 pl-4 border-l border-gray-100 cursor-pointer group"
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                            onClick={() => !isLoggedIn && onSignIn()}
                        >
                            <div className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-all border border-gray-100 group-hover:border-orange-100">
                                <CircleUser className="h-5 w-5 text-gray-400 group-hover:text-[#f26a36] transition-colors" />
                            </div>

                            {/* Profile Dropdown */}
                            {isLoggedIn && isProfileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-2xl border border-gray-100/50 rounded-[32px] overflow-hidden z-[1001] animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Signed in as</p>
                                        <p className="text-sm font-black text-deep-navy truncate uppercase tracking-tight">{user?.name || 'MY ACCOUNT'}</p>
                                        <p className="text-[9px] font-bold text-[#f26a36] uppercase tracking-[0.2em] mt-0.5">{user?.role || 'Guest'}</p>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => { setView('profile'); navigate('/profile'); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all rounded-xl group/item"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                                                <User className="h-4 w-4 text-blue-500" />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => { navigate('/admin-request'); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all rounded-xl group/item"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover/item:bg-indigo-100 transition-colors">
                                                <UserPlus className="h-4 w-4 text-indigo-500" />
                                            </div>
                                            <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Request Admin Access</span>
                                        </button>
                                        {(user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'superadmin' || user?.mobile === '7038460914') && (
                                            <button
                                                onClick={() => { navigate('/admine'); setIsProfileOpen(false); }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-all rounded-xl group/item"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center group-hover/item:bg-orange-100 transition-colors">
                                                    <LayoutDashboard className="h-4 w-4 text-[#f26a36]" />
                                                </div>
                                                <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">Admin Panel</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-gray-50 bg-gray-50/20">
                                        <button
                                            onClick={() => { onSignOut(); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-500 transition-all rounded-xl group/item"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-red-100/50 flex items-center justify-center group-hover/item:bg-red-100 transition-colors text-red-600">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Operator Login Link */}
                        <div
                            onClick={() => navigate('/operator/login')}
                            className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer group hover:bg-gray-50/50 py-2 rounded-2xl transition-all"
                        >
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-red-50 transition-all border border-gray-100 group-hover:border-red-100">
                                <Bus className="h-5 w-5 text-gray-400 group-hover:text-[#d84e55] transition-colors" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-gray-400 group-hover:text-[#d84e55] uppercase tracking-widest hidden lg:block">
                                    OPERATOR
                                </span>
                                <span className="text-[10px] font-black text-deep-navy group-hover:text-[#d84e55] uppercase tracking-tight hidden lg:block -mt-1">
                                    DASHBOARD
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-gray-600 hover:text-[#f26a36] transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 top-full">
                    <div className="flex flex-col p-4">
                        {productLinks.map((link) => {
                            const isActive = activeTab === link.id;
                            return (
                                <button
                                    key={link.id}
                                    onClick={() => {
                                        setActiveTab(link.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center justify-between p-4 border-b border-gray-50 ${isActive ? 'text-[#f26a36] bg-orange-50/50' : 'text-[#424242] hover:bg-gray-50'}`}
                                >
                                    <span className="font-bold text-sm tracking-widest">{link.label}</span>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#f26a36]" />}
                                </button>
                            );
                        })}
                        <div className="h-px bg-gray-100 my-2" />
                        <div className="px-4 py-2 flex flex-col gap-4 text-xs font-bold text-gray-500">
                            <div className="flex justify-between items-center w-full">
                                {isLoggedIn ? (
                                    <button onClick={() => { onSignOut(); setIsMobileMenuOpen(false); }} className="hover:text-[#f26a36]">LOGOUT</button>
                                ) : (
                                    <button onClick={() => { onSignIn(); setIsMobileMenuOpen(false); }} className="hover:text-[#f26a36]">LOGIN</button>
                                )}
                                <button onClick={() => { setView('support'); setIsMobileMenuOpen(false); }} className="hover:text-[#f26a36]">SUPPORT</button>
                            </div>

                            {/* Mobile Operator Section */}
                            <button
                                onClick={() => { navigate('/operator/login'); setIsMobileMenuOpen(false); }}
                                className="w-full flex items-center justify-between p-4 bg-red-50 text-[#d84e55] rounded-xl border border-red-100"
                            >
                                <span className="uppercase tracking-widest font-black text-[10px]">
                                    {operator ? 'Operator Dashboard' : 'Operator Login'}
                                </span>
                                <Bus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
