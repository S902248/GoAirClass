import {
    LayoutDashboard,
    Users,
    UserSquare2,
    Settings,
    ChevronDown,
    X,
    ShieldCheck,
    BarChart3,
    Wallet,
    Megaphone,
    HelpCircle,
    FileText,
    Bus,
    Hotel,
    Plane,
    Train
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarOpen } from '../../slices/dashboardSlice';
import { Disclosure, Transition } from '@headlessui/react';

const SidebarItem = ({ icon: Icon, label, to, children, badge }) => {
    const location = useLocation();
    const isChildActive = children && children.some(child => location.pathname === child.to);

    if (children) {
        return (
            <Disclosure defaultOpen={isChildActive}>
                {({ open }) => (
                    <>
                        <Disclosure.Button className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${open || isChildActive ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                            <div className="flex items-center gap-3">
                                <Icon size={20} className={open || isChildActive ? 'text-primary-600' : 'group-hover:text-primary-600 transition-colors'} />
                                <span className="font-semibold text-sm">{label}</span>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                        </Disclosure.Button>
                        <Transition
                            show={open}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Disclosure.Panel className="mt-1 ml-4 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                                {children.map((child, index) => (
                                    <NavLink
                                        key={index}
                                        to={child.to}
                                        className={({ isActive }) => `
                      block py-2 text-sm font-medium transition-colors
                      ${isActive ? 'text-primary-600' : 'text-slate-500 hover:text-primary-600'}
                    `}
                                    >
                                        {child.label}
                                    </NavLink>
                                ))}
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        );
    }

    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
        flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}
      `}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">{label}</span>
            </div>
            {badge && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {badge}
                </span>
            )}
        </NavLink>
    );
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const { isSidebarOpen } = useSelector((state) => state.dashboard);

    return (
        <>
            <Transition
                show={isSidebarOpen}
                as="div"
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => dispatch(setSidebarOpen(false))}
            />

            <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-transform duration-300 ease-in-out lg:translate-x-0 font-sans flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#f26a36] p-2 rounded-xl shadow-md">
                            <Bus className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tight text-[#424242] dark:text-white">
                            GOAIR<span className="text-[#f26a36]">CLASS</span>
                        </span>
                    </div>
                    <button
                        onClick={() => dispatch(setSidebarOpen(false))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden text-slate-400"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide py-6">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/admin" />

                    <div className="pt-6 pb-2 px-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Administration</p>
                    </div>
                    <SidebarItem icon={ShieldCheck} label="Admins">
                        {[
                            { label: 'Add Admin', to: '/admin/admins/add' },
                            { label: 'Admin Requests', to: '/admin/admins/requests' },
                            { label: 'Admin Details', to: '/admin/admins/details' }
                        ]}
                    </SidebarItem>


                    <SidebarItem icon={Users} label="Users">
                        {[
                            { label: 'Active Users', to: '/admin/users/active' },
                            { label: 'Deactive Users', to: '/admin/users/deactive' },
                            { label: 'Deposit Report', to: '/admin/users/deposit-report' },
                            { label: 'Withdraw Report', to: '/admin/users/withdraw-report' },
                            { label: 'Transactions', to: '/admin/users/transactions' }
                        ]}
                    </SidebarItem>

                    <div className="pt-6 pb-2 px-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operations</p>
                    </div>
                    <SidebarItem icon={FileText} label="Reports">
                        {[
                            { label: 'All Reports', to: '/admin/reports/main' },
                            { label: 'Booking Reports', to: '/admin/reports/bookings' },
                            { label: 'Cancelled Reports', to: '/admin/reports/cancelled' },
                            { label: 'Failed Reports', to: '/admin/reports/failed' }
                        ]}
                    </SidebarItem>

                    <SidebarItem icon={Wallet} label="Finance">
                        {[
                            { label: 'Withdraw Amount', to: '/admin/finance/withdraw' },
                            { label: 'Payment Settings', to: '/admin/finance/settings' },
                            { label: 'Commission Setup', to: '/admin/finance/commission' },
                            { label: 'Pricing Simulation', to: '/admin/finance/pricing-simulation' }
                        ]}
                    </SidebarItem>

                    <SidebarItem icon={Megaphone} label="Marketing">
                        {[
                            { label: 'Advertisements', to: '/admin/marketing/ads' },
                            { label: 'Banners', to: '/admin/marketing/banners' },
                            { label: 'Coupons', to: '/admin/marketing/coupons' }
                        ]}
                    </SidebarItem>

                    <SidebarItem icon={Hotel} label="Hotels">
                        {[
                            { label: 'All Hotels', to: '/admin/hotels/all' },
                            { label: 'Pending Approval', to: '/admin/hotels/pending' },
                            { label: 'Approved Hotels', to: '/admin/hotels/approved' },
                            { label: 'Rejected Hotels', to: '/admin/hotels/rejected' },
                            { label: 'Hotel Rooms', to: '/admin/hotels/rooms' },
                            { label: 'Hotel Bookings', to: '/admin/hotels/bookings' },
                            { label: 'Hotel Offers', to: '/admin/hotels/offers' },
                        ]}
                    </SidebarItem>

                    <SidebarItem icon={Plane} label="Flights">
                        {[
                            { label: 'Airports', to: '/admin/flights/airports' },
                            { label: 'Airlines', to: '/admin/flights/airlines' },
                            { label: 'All Flights', to: '/admin/flights/all' },
                            { label: 'Flight Bookings', to: '/admin/flights/bookings' },
                            { label: 'Flight Offers', to: '/admin/flights/offers' },
                            { label: 'Settings', to: '/admin/flights/settings' },
                        ]}
                    </SidebarItem>

                    <SidebarItem icon={Train} label="Train">
                        {[
                            { label: 'Dashboard', to: '/admin/train/dashboard' },
                            { label: 'All Trains', to: '/admin/train/all' },
                            { label: 'Add Train', to: '/admin/train/add' },
                            { label: 'Routes & Schedule', to: '/admin/train/routes' },
                            { label: 'Stations', to: '/admin/train/stations' },
                            { label: 'Seat & Coach', to: '/admin/train/seat-coach' },
                            { label: 'Fare Management', to: '/admin/train/fare' },
                            { label: 'Bookings', to: '/admin/train/bookings' },
                            { label: 'PNR System', to: '/admin/train/pnr' },
                            { label: 'API Settings', to: '/admin/train/api-settings' },
                            { label: 'Quota Management', to: '/admin/train/quota' },
                            { label: 'Reports', to: '/admin/train/reports' }
                        ]}
                    </SidebarItem>



                    <div className="pt-6 pb-2 px-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Support</p>
                    </div>
                    <SidebarItem icon={HelpCircle} label="Contact" to="/admin/common/contact" />
                    <SidebarItem icon={FileText} label="Footer Pages" to="/admin/common/footer" />
                    <SidebarItem icon={Settings} label="Settings" to="/admin/settings" />
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">A</div>
                            <div>
                                <p className="text-sm font-bold truncate max-w-[120px]">Super Admin</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">System Root</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
