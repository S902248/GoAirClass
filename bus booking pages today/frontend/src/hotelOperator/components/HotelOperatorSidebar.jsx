import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Hotel, BedDouble, BookOpen, DollarSign,
    ChevronDown, LogOut, Plus, List, Ticket, Layers
} from 'lucide-react';
import { useHotelOperator } from '../HotelOperatorContext';

const BASE = '/hotel-operator';

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
            ${isActive
                ? 'bg-fuchsia-50 text-fuchsia-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`
        }>
        <span className="w-8 h-8 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-4 w-4" />
        </span>
        {label}
    </NavLink>
);

const Group = ({ icon: Icon, label, children }) => {
    const location = useLocation();
    const isGroupActive = children.some(c => location.pathname.startsWith(c.to));
    const [open, setOpen] = useState(isGroupActive);

    return (
        <div>
            <button onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                    ${isGroupActive ? 'text-fuchsia-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                <span className="w-8 h-8 rounded-xl bg-fuchsia-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-fuchsia-500" />
                </span>
                <span className="flex-1 text-left">{label}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40' : 'max-h-0'}`}>
                <div className="ml-11 space-y-1 pt-1">
                    {children.map(c => (
                        <NavItem key={c.to} to={c.to} icon={c.icon} label={c.label} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SectionLabel = ({ label }) => (
    <p className="px-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] pt-2 pb-1">{label}</p>
);

const HotelOperatorSidebar = ({ onLogout }) => {
    const { operator, hasPerm } = useHotelOperator();

    return (
        <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 shadow-sm z-40 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Hotel className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Hotel Portal</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Operator Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <SectionLabel label="Main" />
                <NavItem to={`${BASE}/dashboard`} icon={LayoutDashboard} label="Dashboard" />

                {/* Hotels */}
                {(hasPerm('AddHotel') || hasPerm('ManageHotels')) && (
                    <>
                        <SectionLabel label="Hotels" />
                        <Group icon={Hotel} label="Hotels" >
                            {[
                                ...(hasPerm('AddHotel') ? [{ to: `${BASE}/hotels/add`, icon: Plus, label: 'Add Hotel' }] : []),
                                ...(hasPerm('ManageHotels') ? [{ to: `${BASE}/hotels`, icon: List, label: 'My Hotels' }] : []),
                            ]}
                        </Group>
                    </>
                )}

                {/* Rooms */}
                {(hasPerm('AddRooms') || hasPerm('ManageRooms') || hasPerm('UpdateRoomPrices')) && (
                    <>
                        <SectionLabel label="Rooms" />
                        <Group icon={BedDouble} label="Rooms">
                            {[
                                ...(hasPerm('AddRooms') ? [{ to: `${BASE}/rooms/add`, icon: Plus, label: 'Add Room' }] : []),
                                ...(hasPerm('ManageRooms') ? [
                                    { to: `${BASE}/rooms`, icon: List, label: 'Manage Rooms' },
                                    { to: `${BASE}/rooms/inventory`, icon: Layers, label: 'Room Inventory' }
                                ] : []),
                                ...(hasPerm('UpdateRoomPrices') ? [{ to: `${BASE}/rooms/prices`, icon: DollarSign, label: 'Update Prices' }] : []),
                            ]}
                        </Group>
                    </>
                )}

                {/* Bookings */}
                {hasPerm('ViewBookings') && (
                    <>
                        <SectionLabel label="Bookings" />
                        <Group icon={BookOpen} label="Bookings">
                            {[
                                { to: `${BASE}/bookings`, icon: BookOpen, label: 'All Bookings' },
                                { to: `${BASE}/coupons`, icon: Ticket, label: 'Coupons' },
                            ]}
                        </Group>
                    </>
                )}
            </nav>

            {/* Operator card + logout */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                {operator && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow flex-shrink-0">
                            {operator.name?.[0]?.toUpperCase() || 'H'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-gray-700 truncate leading-tight">{operator.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{operator.companyName || 'Hotel Operator'}</p>
                        </div>
                    </div>
                )}
                <button onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-all group">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-black uppercase tracking-wider">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default HotelOperatorSidebar;
