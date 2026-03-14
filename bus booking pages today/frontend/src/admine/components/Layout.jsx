import React from 'react';
import Sidebar from './Sidebar';
import { Bell, Search, User } from 'lucide-react';

const Layout = ({ children, onLogout, user }) => {
    return (
        <div className="flex min-h-screen bg-[#f8f9ff]">
            {/* Left Side: Sidebar */}
            <Sidebar onLogout={onLogout} />

            {/* Right Side: Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-24 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-red-100 transition-all w-80"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-red-50 transition-colors group">
                            <Bell className="h-5 w-5 text-gray-400 group-hover:text-[#d84e55]" />
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#d84e55] border-2 border-white rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                            <div className="text-right">
                                <p className="text-sm font-black text-deep-navy uppercase tracking-tight">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] font-bold text-[#d84e55] uppercase tracking-widest">{user?.role || 'Administrator'}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                <User className="h-6 w-6 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
