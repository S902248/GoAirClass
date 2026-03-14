import React from 'react';
import { ShieldAlert, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = ({ onSignOut, title = 'Access Denied', message }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldAlert className="h-10 w-10 text-[#d84e55]" />
                </div>

                <h2 className="text-2xl font-black text-deep-navy mb-4 uppercase tracking-tight">
                    {title}
                </h2>

                <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed mb-10 tracking-wide">
                    {message || (
                        <>
                            THIS HIGH-LEVEL ADMINISTRATIVE PANEL IS RESTRICTED TO <span className="text-[#d84e55]">SUPER ADMINS</span> ONLY.
                            YOUR CURRENT ROLE DOES NOT HAVE PERMISSION TO VIEW THIS PAGE.
                        </>
                    )}
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-[#d84e55] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#d84e55]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Home className="h-4 w-4" />
                        Back to Home
                    </button>

                    <button
                        onClick={() => {
                            if (onSignOut) onSignOut();
                            navigate('/');
                        }}
                        className="w-full py-4 bg-white border-2 border-gray-100 text-deep-navy rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-[#d84e55] hover:text-[#d84e55] transition-all flex items-center justify-center gap-3"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        GoAirClass Administrative Security System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
