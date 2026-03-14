import React from 'react';
import { LayoutDashboard, Bus, MapPin, Clock, Tag, Users, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const OperatorSidebar = ({ operator, onLogout }) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/operator/dashboard' },
        { icon: Bus, label: 'My Buses', to: '/operator/buses' },
        { icon: MapPin, label: 'My Routes', to: '/operator/routes' },
        { icon: Clock, label: 'Schedules', to: '/operator/schedules' },
        { icon: Tag, label: 'Coupons', to: '/operator/coupons' },
        { icon: Users, label: 'Passengers', to: '/operator/passengers' },
    ];

    return (
        <aside className="w-80 h-screen bg-deep-navy flex flex-col p-8 fixed left-0 top-0 z-50 overflow-y-auto">
            <div className="flex items-center gap-4 mb-12 px-2">
                <div className="w-10 h-10 bg-[#d84e55] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                    <Bus className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-white font-black uppercase tracking-tight">Operator Hub</h2>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all
                            ${isActive
                                ? 'bg-[#d84e55] text-white shadow-lg shadow-red-500/20 translate-x-1'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={onLogout}
                className="mt-8 flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
            >
                <LogOut className="h-4 w-4" />
                Sign Out
            </button>
        </aside>
    );
};

export default OperatorSidebar;
