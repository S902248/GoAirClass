import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    ShieldCheck,
    BarChart3,
    Settings,
    LogOut,
    ChevronDown,
    Bus,
    Plane,
    MapPin,
    Ticket,
    TrendingUp,
    UsersRound,
    UserCircle,
    Route,
    Hotel,
    BedDouble,
    BookOpen,
    Tag,
    Train,
    Search
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────────────────
   Collapsible group (Transport / Reports / Users)
───────────────────────────────────────────────────────────────────────────── */
const NavGroup = ({ icon: Icon, label, children, defaultOpen = false }) => {
    const location = useLocation();

    // Auto-open if any child is currently active
    const isAnyChildActive = React.useMemo(
        () => children.some(c => location.pathname === c.to || location.pathname.startsWith(c.to + '/')),
        [location.pathname, children]
    );

    const [open, setOpen] = useState(defaultOpen || isAnyChildActive);

    return (
        <div className="mb-0.5">
            {/* Group header button */}
            <button
                onClick={() => setOpen(o => !o)}
                className={`
                    w-full flex items-center justify-between px-6 py-3.5 transition-all duration-200 group
                    ${open || isAnyChildActive
                        ? 'text-[#d84e55] bg-red-50/70'
                        : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-800'}
                `}
            >
                <div className="flex items-center gap-4">
                    <div className={`
                        w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                        ${open || isAnyChildActive
                            ? 'bg-[#d84e55] shadow-md shadow-red-200'
                            : 'bg-gray-100 group-hover:bg-gray-200'}
                    `}>
                        <Icon className={`h-4.5 w-4.5 ${open || isAnyChildActive ? 'text-white' : 'text-gray-500'}`} size={18} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-wider">{label}</span>
                </div>
                <ChevronDown
                    size={15}
                    className={`transition-transform duration-250 flex-shrink-0 ${open ? 'rotate-180 text-[#d84e55]' : 'text-gray-300'}`}
                />
            </button>

            {/* Animated submenu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-11 mr-4 pl-3 py-1 border-l-2 border-red-100 space-y-0.5">
                    {children.map((item, index) => (
                        <NavLink
                            key={`${item.to}-${index}`}
                            to={item.to}
                            className={({ isActive }) => `
                                flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold uppercase tracking-wider transition-all duration-150
                                ${isActive
                                    ? 'bg-[#d84e55] text-white shadow-md shadow-red-200'
                                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}
                            `}
                        >
                            {item.icon && <item.icon size={14} className="flex-shrink-0" />}
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Top-level single link (Dashboard, Settings)
───────────────────────────────────────────────────────────────────────────── */
const TopItem = ({ icon: Icon, label, to, end = false }) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) => `
            flex items-center gap-4 px-6 py-3.5 transition-all duration-200 group
            ${isActive
                ? 'bg-red-50 text-[#d84e55] border-r-[3px] border-[#d84e55]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
        `}
    >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:bg-gray-200`}>
            <Icon className="h-4.5 w-4.5" size={18} />
        </div>
        <span className="text-sm font-black uppercase tracking-wider">{label}</span>
    </NavLink>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Section divider
───────────────────────────────────────────────────────────────────────────── */
const SectionLabel = ({ label }) => (
    <div className="px-6 pt-6 pb-2">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{label}</p>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Main Sidebar
───────────────────────────────────────────────────────────────────────────── */
const Sidebar = ({ user, onLogout }) => {
    return (
        <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 shadow-sm">

            {/* ── Logo ── */}
            <div className="px-6 py-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d84e55] rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
                        <Bus className="text-white h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-gray-800 tracking-tight uppercase leading-none">GoAirClass</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Control</p>
                    </div>
                </div>
            </div>

            {/* ── Navigation ── */}
            <nav className="flex-1 py-4 overflow-y-auto scrollbar-hide">

                <SectionLabel label="Main Menu" />

                {/* Dashboard */}
                <TopItem icon={LayoutDashboard} label="Dashboard" to="/admine" end />

                {/* ── Transport group ── */}
                <SectionLabel label="Transport" />
                <NavGroup icon={Bus} label="Transport" defaultOpen>
                    {[
                        { icon: UsersRound, label: 'Bus Operators', to: '/admine/operators' },
                        { icon: Route, label: 'Routes', to: '/admine/routes' },
                        { icon: Bus, label: 'Bus Management', to: '/admine/bus-management' },
                        { icon: CalendarDays, label: 'Schedules', to: '/admine/schedules' },
                        { icon: Ticket, label: 'Bus Bookings', to: '/admine/bookings' },
                    ]}
                </NavGroup>

                {/* ── Flights group ── */}
                <SectionLabel label="Flights" />
                <NavGroup icon={Plane} label="Flights">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', to: '/admine/flights/dashboard' },
                        { icon: Plane, label: 'All Flights', to: '/admine/flights/all' },
                        { icon: Plane, label: 'Add Flight', to: '/admine/flights/add' },
                        { icon: Ticket, label: 'Flight Bookings', to: '/admine/flights/bookings' },
                        { icon: UsersRound, label: 'Passengers', to: '/admine/flights/passengers' },
                    ]}
                </NavGroup>

                {/* ── Train group ── */}
                <SectionLabel label="Train" />
                <NavGroup icon={Train} label="Train">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', to: '/admine/train/dashboard' },
                        { icon: Train, label: 'Train List', to: '/admine/train/all' },
                        { icon: Ticket, label: 'Bookings', to: '/admine/train/bookings' },
                        { icon: Users, label: 'Seat Availability', to: '/admine/train/availability' },
                        { icon: Search, label: 'PNR Search', to: '/admine/train/pnr' },
                        { icon: BarChart3, label: 'Reports', to: '/admine/train/reports' },
                    ]}
                </NavGroup>

                {/* ── Hotels group ── */}
                <SectionLabel label="Hotels" />
                <NavGroup icon={Hotel} label="Hotels">
                    {[
                        { icon: Hotel, label: 'All Hotels', to: '/admine/hotels' },
                        { icon: Hotel, label: 'Pending Approval', to: '/admine/hotels/pending' },
                        { icon: Hotel, label: 'Approved Hotels', to: '/admine/hotels/approved' },
                        { icon: Hotel, label: 'Rejected Hotels', to: '/admine/hotels/rejected' },
                        { icon: BedDouble, label: 'Hotel Rooms', to: '/admine/hotels/rooms' },
                        { icon: BookOpen, label: 'Hotel Bookings', to: '/admine/hotels/bookings' },
                        { icon: Tag, label: 'Hotel Offers', to: '/admine/hotels/offers' },
                        { icon: UsersRound, label: 'Hotel Operators', to: '/admine/hotels/operators' },
                        { icon: UsersRound, label: 'Add Hotel Operator', to: '/admine/hotels/operators/add' },
                    ]}
                </NavGroup>

                {/* ── Reports group ── */}
                <SectionLabel label="Reports" />
                <NavGroup icon={BarChart3} label="Reports">
                    {[
                        { icon: Ticket, label: 'Booking Reports', to: '/admine/reports' },
                        { icon: TrendingUp, label: 'Revenue Reports', to: '/admine/reports' },
                    ]}
                </NavGroup>

                {/* ── Users group ── */}
                <SectionLabel label="People" />
                <NavGroup icon={Users} label="Users">
                    {[
                        { icon: UserCircle, label: 'Users', to: '/admine/users' },
                        { icon: UsersRound, label: 'Agents', to: '/admine/admins' },
                    ]}
                </NavGroup>

                {/* ── Other ── */}
                <SectionLabel label="System" />
                <TopItem icon={Settings} label="Settings" to="/admine/settings" />

            </nav>

            {/* ── Logout Footer ── */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d84e55] to-[#b03a40] flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow">
                            {user.fullName?.[0]?.toUpperCase() || user.adminUsername?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-700 truncate leading-tight">
                                {user.fullName || user.adminUsername || 'Admin'}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {user.role || 'Admin'}
                            </p>
                        </div>
                    </div>
                )}
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-[#d84e55] hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                    <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    <span className="text-sm font-black uppercase tracking-wider">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
