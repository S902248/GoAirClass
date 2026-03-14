import React, { useState } from 'react';
import { ShieldCheck, Plus, ToggleLeft, ToggleRight, UserPlus, Mail, Phone, BadgeCheck } from 'lucide-react';

const AdminManagement = () => {
    const [admins, setAdmins] = useState([
        { id: '1', name: 'Super Admin', mobile: '8767605792', email: 'admin@goairclass.com', role: 'Super Admin', status: 'Active' },
        { id: '2', name: 'Vikram Singh', mobile: '9988776655', email: 'vikram@goairclass.com', role: 'Admin', status: 'Active' },
        { id: '3', name: 'Neha Gupta', mobile: '7766554433', email: 'neha@goairclass.com', role: 'Support', status: 'Pending' },
    ]);

    const toggleStatus = (id) => {
        setAdmins(admins.map(a =>
            a.id === id ? { ...a, status: a.status === 'Active' ? 'Inactive' : 'Active' } : a
        ));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight mb-2">Admin Management</h1>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">Privileged access control & role assignment</p>
                </div>

                <button className="bg-[#d84e55] text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-red-200 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-3">
                    <UserPlus className="h-4 w-4" />
                    Add New Admin
                </button>
            </div>

            {/* Admins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {admins.map((admin) => (
                    <div key={admin.id} className="bg-white rounded-[40px] p-10 border border-gray-50 shadow-sm relative group overflow-hidden">
                        {/* Status Badge */}
                        <div className="absolute top-8 right-8">
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${admin.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                {admin.status}
                            </span>
                        </div>

                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 border border-gray-100">
                            <BadgeCheck className={`h-8 w-8 ${admin.role === 'Super Admin' ? 'text-[#d84e55]' : 'text-gray-300'}`} />
                        </div>

                        <h3 className="text-xl font-black text-deep-navy uppercase tracking-tight mb-4">{admin.name}</h3>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Phone className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wide">{admin.mobile}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <Mail className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-wide truncate">{admin.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-4 w-4 text-[#d84e55]" />
                                <span className="text-xs font-black text-[#d84e55] uppercase tracking-widest">{admin.role}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Manage Access</p>
                            <button
                                onClick={() => toggleStatus(admin.id)}
                                className={`transition-all hover:scale-110 active:scale-90 ${admin.status === 'Active' ? 'text-emerald-500' : 'text-gray-300'}`}
                            >
                                {admin.status === 'Active' ? <ToggleRight className="h-10 w-10" /> : <ToggleLeft className="h-10 w-10" />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminManagement;
