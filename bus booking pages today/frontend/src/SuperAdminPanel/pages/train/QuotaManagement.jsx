import { useState } from 'react';
import { ShieldAlert, Plus, Edit, Trash2, Users } from 'lucide-react';
import DataTable from '../../components/common/DataTable';

const QuotaManagement = () => {
    const columns = [
        { key: 'name', label: 'Quota Name' },
        { key: 'code', label: 'Code' },
        { key: 'allocation', label: 'Seat Allocation (%)' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
    ];

    const data = [
        { name: 'General Quota', code: 'GN', allocation: '70%', status: <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Enabled</span>, actions: (
            <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg group-hover:text-train-primary transition-colors"><Edit size={16} /></button>
            </div>
        )},
        { name: 'Tatkal Quota', code: 'TQ', allocation: '15%', status: <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Enabled</span>, actions: (
            <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={16} /></button>
            </div>
        )},
        { name: 'Ladies Quota', code: 'LD', allocation: '5%', status: <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Enabled</span>, actions: (
            <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={16} /></button>
            </div>
        )},
        { name: 'Senior Citizen', code: 'SS', allocation: '5%', status: <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">Disabled</span>, actions: (
            <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg"><Edit size={16} /></button>
            </div>
        )},
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Quota Management</h1>
                    <p className="text-slate-500 text-sm">Manage ticket quotas and seat allocations for various categories.</p>
                </div>
                <button className="bg-train-primary hover:bg-train-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-train-primary/20 transition-all active:scale-95">
                    <Plus size={18} />
                    <span>Add New Quota</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 border-l-4 border-train-primary bg-gradient-to-br from-white to-train-primary-light/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-train-primary" size={20} />
                        <h4 className="text-xs font-black uppercase text-slate-400">Total Categories</h4>
                    </div>
                    <p className="text-3xl font-black">08</p>
                </div>
                <div className="card p-6 border-l-4 border-orange-600 bg-gradient-to-br from-white to-orange-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="text-orange-600" size={20} />
                        <h4 className="text-xs font-black uppercase text-slate-400">Tatkal Status</h4>
                    </div>
                    <p className="text-3xl font-black">Active</p>
                </div>
            </div>

            <div className="card">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
};

export default QuotaManagement;
