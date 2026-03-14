import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Trash2, ToggleLeft, ToggleRight,
    UserCog, Phone, Mail, Building, MapPin, CheckSquare
} from 'lucide-react';
import { getAllHotelOperators, deleteHotelOperator, updateHotelOperatorStatus } from '../../../api/hotelApi';

const HotelOperators = () => {
    const navigate = useNavigate();
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchOperators(); }, []);

    const fetchOperators = async () => {
        try {
            setLoading(true);
            const data = await getAllHotelOperators();
            setOperators(data?.operators || data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this hotel operator?')) return;
        await deleteHotelOperator(id);
        fetchOperators();
    };

    const handleToggleStatus = async (op) => {
        const next = op.status === 'Active' ? 'Inactive' : 'Active';
        await updateHotelOperatorStatus(op._id, next);
        fetchOperators();
    };

    const filtered = operators.filter(op =>
        op.name?.toLowerCase().includes(search.toLowerCase()) ||
        op.email?.toLowerCase().includes(search.toLowerCase()) ||
        op.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        op.city?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Hotel Operators</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {operators.length} registered operator{operators.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admine/hotels/operators/add')}
                    className="flex items-center gap-2 bg-[#d84e55] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black active:scale-95 transition-all shadow-lg shrink-0"
                >
                    <Plus className="h-4 w-4" /> Add Operator
                </button>
            </div>

            {/* Search */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                <input
                    type="text"
                    placeholder="Search by name, email, company, city..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border-2 border-gray-100 rounded-2xl py-3 pl-11 pr-5 text-sm font-medium focus:border-[#d84e55] focus:ring-4 focus:ring-red-50 outline-none transition-all"
                />
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-[#d84e55] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-gray-50 shadow-sm">
                    <UserCog className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-sm font-black text-gray-300 uppercase tracking-widest">
                        {search ? 'No operators match your search.' : 'No hotel operators yet.'}
                    </p>
                    {!search && (
                        <button
                            onClick={() => navigate('/admine/hotels/operators/add')}
                            className="mt-6 px-6 py-3 bg-[#d84e55] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            Add First Operator
                        </button>
                    )}
                </div>
            ) : (
                /* Table View */
                <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest w-[25%]">Operator</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest w-[25%]">Contact</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest w-[30%]">Permissions</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center w-[10%]">Status</th>
                                    <th className="p-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right w-[10%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(op => (
                                    <tr key={op._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-5 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d84e55] to-fuchsia-500 flex items-center justify-center text-white font-black text-lg shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                                                    {op.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 text-sm">{op.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                        <Building className="h-2.5 w-2.5" />
                                                        {op.companyName || op.role?.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">
                                                        @{op.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5 align-top">
                                            <div className="space-y-2">
                                                {op.email && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                        <Mail className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                                                        <span className="truncate">{op.email}</span>
                                                    </div>
                                                )}
                                                {op.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                        <Phone className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                                                        <span>{op.phone}</span>
                                                    </div>
                                                )}
                                                {op.city && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                        <MapPin className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                                                        <span>{op.city}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-5 align-top">
                                            {op.permissions?.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {op.permissions.map(p => (
                                                        <span key={p} className="flex items-center gap-1 bg-fuchsia-50 text-fuchsia-600 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wide">
                                                            <CheckSquare className="h-2.5 w-2.5" />
                                                            {p}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-medium italic">-</span>
                                            )}
                                        </td>
                                        <td className="p-5 align-top text-center">
                                            <span className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest
                                                ${op.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-gray-100 text-gray-400'}`}>
                                                {op.status}
                                            </span>
                                        </td>
                                        <td className="p-5 align-top text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(op)}
                                                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all
                                                        ${op.status === 'Active'
                                                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                >
                                                    {op.status === 'Active'
                                                        ? <><ToggleRight className="h-3.5 w-3.5" /> Deactivate</>
                                                        : <><ToggleLeft className="h-3.5 w-3.5" /> Activate</>}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(op._id)}
                                                    className="p-2 bg-red-50 text-[#d84e55] rounded-xl hover:bg-red-100 transition-all shrink-0"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotelOperators;
