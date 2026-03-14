import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Bus,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    Eye,
    EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllOperators, createOperator, deleteOperator } from '../../api/adminApi';

const OperatorsManagement = () => {
    const navigate = useNavigate();
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        contactNumber: '',
        email: '',
        password: '', // Allow admin to set password
        address: '',
        status: 'Active'
    });

    useEffect(() => {
        fetchOperators();
    }, []);

    const fetchOperators = async () => {
        try {
            setLoading(true);
            const data = await getAllOperators();
            setOperators(data);
        } catch (err) {
            console.error('Error fetching operators:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddOperator = async (e) => {
        e.preventDefault();
        try {
            await createOperator({
                ...formData,
                operatorName: formData.name,
            });
            setShowAddModal(false);
            setFormData({ name: '', companyName: '', contactNumber: '', email: '', password: '', address: '', status: 'Active' });
            fetchOperators();
        } catch (err) {
            alert(err.error || 'Failed to add operator');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this operator?')) {
            try {
                await deleteOperator(id);
                fetchOperators();
            } catch (err) {
                alert('Failed to delete operator');
            }
        }
    };

    const filteredOperators = operators.filter(op => {
        const matchesSearch = op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === 'All' || op.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOperators.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight">Bus Operators</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Manage partner bus companies and fleets</p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-3 bg-[#d84e55] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-red-200 active:scale-95 shrink-0"
                >
                    <Plus className="h-5 w-5" />
                    Add Operator
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-gray-100 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-bold focus:border-[#d84e55] focus:ring-4 focus:ring-red-50 transition-all outline-none"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer hover:border-gray-200 transition-all"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Name</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buses</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.map((op) => (
                                <tr key={op._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center font-black text-[#d84e55] text-xs">
                                                {op.name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-deep-navy uppercase tracking-tight text-sm">{op.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{op._id.substring(op._id.length - 6)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-gray-600 uppercase tracking-tight">{op.companyName}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-xs font-bold text-gray-500">{op.contactNumber}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{op.email}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Bus className="h-4 w-4 text-[#d84e55]/50" />
                                            <span className="text-sm font-black text-deep-navy">{op.totalBuses || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${op.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {op.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => navigate(`/admine/operators/${op._id}/buses`)}
                                                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-110 active:scale-95 transition-all"
                                                title="View Buses"
                                            >
                                                <Bus className="h-4 w-4" />
                                            </button>
                                            <button className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:scale-110 active:scale-95 transition-all">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(op._id)}
                                                className="p-2.5 bg-red-50 text-[#d84e55] rounded-xl hover:scale-110 active:scale-95 transition-all"
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

                <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredOperators.length)} of {filteredOperators.length} Operators
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-3 bg-gray-50 rounded-xl disabled:opacity-30 hover:bg-red-50 hover:text-[#d84e55] transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#d84e55] text-white' : 'bg-gray-50 text-gray-400 hover:bg-red-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-3 bg-gray-50 rounded-xl disabled:opacity-30 hover:bg-red-50 hover:text-[#d84e55] transition-all"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-deep-navy/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-deep-navy uppercase tracking-tight">Add New Operator</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-3 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors">
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleAddOperator} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Operator Name" value={formData.name} onChange={v => setFormData({ ...formData, name: v })} placeholder="e.g. John Doe" />
                                <FormInput label="Company Name" value={formData.companyName} onChange={v => setFormData({ ...formData, companyName: v })} placeholder="e.g. SpeedLine Tours" />
                                <FormInput label="Phone Number" value={formData.contactNumber} onChange={v => setFormData({ ...formData, contactNumber: v })} placeholder="e.g. +91 98765 43210" />
                                <FormInput label="Email Address" value={formData.email} onChange={v => setFormData({ ...formData, email: v })} placeholder="e.g. contact@speedline.com" />
                                <FormInput
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={v => setFormData({ ...formData, password: v })}
                                    placeholder="••••••••"
                                    rightIcon={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d84e55] transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    }
                                />
                                <div className="md:col-span-2">
                                    <FormInput label="Office Address" value={formData.address} onChange={v => setFormData({ ...formData, address: v })} placeholder="e.g. 123 Main St, Delhi" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all appearance-none outline-none"
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                                <button className="md:col-span-2 w-full bg-deep-navy text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl hover:shadow-red-100 active:scale-95 mt-4">
                                    Register Operator
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text", rightIcon }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none placeholder:text-gray-300"
            />
            {rightIcon}
        </div>
    </div>
);

export default OperatorsManagement;
