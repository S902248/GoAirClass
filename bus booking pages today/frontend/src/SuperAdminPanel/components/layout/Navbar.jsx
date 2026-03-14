import { Bell, Menu, Moon, Sun, Search, User, LogOut, Settings } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleDarkMode } from '../../slices/dashboardSlice';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminNotifications } from '../../../api/adminApi';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isDarkMode } = useSelector((state) => state.dashboard);
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const data = await getAdminNotifications();
                setNotifCount(data.count);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors lg:hidden"
                >
                    <Menu size={20} />
                </button>
                <div className="relative group hidden sm:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="w-64 pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-primary-500/50 rounded-xl text-sm transition-all focus:ring-4 focus:ring-primary-500/5 outline-none font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => dispatch(toggleDarkMode())}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all"
                    title="Toggle Theme"
                >
                    {isDarkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} />}
                </button>

                <button
                    onClick={() => navigate('/admin/admins/requests')}
                    className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all relative"
                    title="Notifications"
                >
                    <Bell size={20} />
                    {notifCount > 0 && (
                        <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white px-1">
                            {notifCount}
                        </span>
                    )}
                </button>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <HeadlessMenu as="div" className="relative">
                    <HeadlessMenu.Button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                            <User size={18} />
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-bold leading-none mb-1">Admin Account</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Administrator</p>
                        </div>
                    </HeadlessMenu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <HeadlessMenu.Items className="absolute right-0 mt-3 w-56 origin-top-right divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none z-50 p-2">
                            <div className="py-1">
                                <HeadlessMenu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => navigate('/admin')}
                                            className={`${active ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'text-slate-700 dark:text-slate-300'} group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all`}
                                        >
                                            <User size={18} />
                                            Your Profile
                                        </button>
                                    )}
                                </HeadlessMenu.Item>
                                <HeadlessMenu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => navigate('/admin/settings')}
                                            className={`${active ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'text-slate-700 dark:text-slate-300'} group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all`}
                                        >
                                            <Settings size={18} />
                                            Account Settings
                                        </button>
                                    )}
                                </HeadlessMenu.Item>
                            </div>
                            <div className="py-1">
                                <HeadlessMenu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className={`${active ? 'bg-rose-50 dark:bg-rose-900/10 text-rose-600' : 'text-slate-700 dark:text-slate-300'} group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all`}
                                        >
                                            <LogOut size={18} />
                                            Sign Out
                                        </button>
                                    )}
                                </HeadlessMenu.Item>
                            </div>
                        </HeadlessMenu.Items>
                    </Transition>
                </HeadlessMenu>
            </div>
        </header>
    );
};

export default Navbar;
