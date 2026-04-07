import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    X,
    Eye,
    EyeOff,
    Bus,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    CheckCircle2,
    XCircle,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    getAllOperators,
    createOperator,
    deleteOperator,
    updateOperator,
    toggleOperatorStatus
} from '../../api/adminApi';

const emptyForm = {
    name: '',
    companyName: '',
    contactNumber: '',
    email: '',
    password: '',
    address: '',
    status: 'Active'
};

const OperatorsManagement = () => {
    const navigate = useNavigate();
    const [operators, setOperators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [showPassword, setShowPassword] = useState(false);

    // Modal state
    const [modal, setModal] = useState(null); // null | 'add' | 'edit'
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    // Toast
    const [toast, setToast] = useState(null);

    useEffect(() => { fetchOperators(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchOperators = async () => {
        try {
            setLoading(true);
            const data = await getAllOperators();
            setOperators(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching operators:', err);
            showToast('Failed to load operators', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setFormData(emptyForm);
        setEditingId(null);
        setFormError('');
        setShowPassword(false);
        setModal('add');
    };

    const openEditModal = (op) => {
        setFormData({
            name: op.name || '',
            companyName: op.companyName || '',
            contactNumber: op.contactNumber || '',
            email: op.email || '',
            password: '',
            address: op.address || '',
            status: op.status || 'Active'
        });
        setEditingId(op._id);
        setFormError('');
        setShowPassword(false);
        setModal('edit');
    };

    const closeModal = () => {
        setModal(null);
        setFormData(emptyForm);
        setEditingId(null);
        setFormError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!formData.name || !formData.email || !formData.contactNumber) {
            setFormError('Name, email, and contact number are required.');
            return;
        }
        if (modal === 'add' && !formData.password) {
            setFormError('Password is required when creating a new operator.');
            return;
        }
        setSubmitting(true);
        try {
            if (modal === 'add') {
                await createOperator(formData);
                showToast('Operator created successfully!');
            } else {
                const payload = { ...formData };
                if (!payload.password) delete payload.password;
                await updateOperator(editingId, payload);
                showToast('Operator updated successfully!');
            }
            closeModal();
            fetchOperators();
        } catch (err) {
            setFormError(err?.error || err?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete operator "${name}"? This cannot be undone.`)) return;
        try {
            await deleteOperator(id);
            showToast('Operator deleted.');
            fetchOperators();
        } catch {
            showToast('Failed to delete operator.', 'error');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await toggleOperatorStatus(id);
            const next = currentStatus === 'Active' ? 'Inactive' : 'Active';
            showToast(`Operator set to ${next}.`);
            fetchOperators();
        } catch {
            showToast('Failed to update status.', 'error');
        }
    };

    const filteredOperators = operators.filter(op => {
        const name = (op.name || '').toLowerCase();
        const company = (op.companyName || '').toLowerCase();
        const q = searchQuery.toLowerCase();
        const matchesSearch = name.includes(q) || company.includes(q);
        const matchesFilter = statusFilter === 'All' || op.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOperators.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOperators.length / itemsPerPage);

    const field = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold transition-all animate-in slide-in-from-top-4 duration-300 ${toast.type === 'error' ? 'bg-[#d84e55]' : 'bg-emerald-500'}`}>
                    {toast.type === 'error' ? <XCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-deep-navy uppercase tracking-tight">Bus Operators</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {operators.length} total operators registered
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-3 bg-[#d84e55] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-red-200 active:scale-95 shrink-0"
                >
                    <Plus className="h-5 w-5" />
                    Add Operator
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-[#d84e55] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name or company..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-white border-2 border-gray-100 rounded-[2rem] py-4 pl-14 pr-6 text-sm font-bold focus:border-[#d84e55] focus:ring-4 focus:ring-red-50 transition-all outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] outline-none cursor-pointer hover:border-gray-200 transition-all"
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Company</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Buses</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-16">
                                        <Loader2 className="h-8 w-8 animate-spin text-[#d84e55] mx-auto" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-3">Loading operators...</p>
                                    </td>
                                </tr>
                            ) : currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-16">
                                        <Bus className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No operators found</p>
                                        <p className="text-xs font-bold text-gray-300 mt-1">Try adjusting your search or add a new operator</p>
                                    </td>
                                </tr>
                            ) : currentItems.map((op) => (
                                <tr key={op._id} className="hover:bg-gray-50/60 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center font-black text-[#d84e55] text-xs shrink-0">
                                                {(op.name || '?').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-deep-navy uppercase tracking-tight text-sm">{op.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    #{op._id?.slice(-6)}
                                                </p>
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
                                            <span className="text-sm font-black text-deep-navy">{op.totalBuses ?? 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${op.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                            {op.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            {/* View Buses */}
                                            <button
                                                onClick={() => navigate(`/admine/operators/${op._id}/buses`)}
                                                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-110 active:scale-95 transition-all"
                                                title="View Buses"
                                            >
                                                <Bus className="h-4 w-4" />
                                            </button>

                                            {/* Edit */}
                                            <button
                                                onClick={() => openEditModal(op)}
                                                className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:scale-110 active:scale-95 transition-all"
                                                title="Edit Operator"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>

                                            {/* Toggle Status */}
                                            <button
                                                onClick={() => handleToggleStatus(op._id, op.status)}
                                                className={`p-2.5 rounded-xl hover:scale-110 active:scale-95 transition-all ${op.status === 'Active' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'}`}
                                                title={op.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            >
                                                {op.status === 'Active' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(op._id, op.name)}
                                                className="p-2.5 bg-red-50 text-[#d84e55] rounded-xl hover:scale-110 active:scale-95 transition-all"
                                                title="Delete Operator"
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

                {/* Pagination */}
                {filteredOperators.length > itemsPerPage && (
                    <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredOperators.length)} of {filteredOperators.length}
                        </p>
                        <div className="flex gap-2">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                                className="p-3 bg-gray-50 rounded-xl disabled:opacity-30 hover:bg-red-50 hover:text-[#d84e55] transition-all">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#d84e55] text-white' : 'bg-gray-50 text-gray-400 hover:bg-red-50'}`}>
                                    {i + 1}
                                </button>
                            ))}
                            <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}
                                className="p-3 bg-gray-50 rounded-xl disabled:opacity-30 hover:bg-red-50 hover:text-[#d84e55] transition-all">
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-deep-navy/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-400 max-h-[95vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-10 pt-10 pb-6 border-b border-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-deep-navy uppercase tracking-tight">
                                    {modal === 'add' ? 'Add New Operator' : 'Edit Operator'}
                                </h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {modal === 'add' ? 'Register a new bus operator' : 'Update operator information'}
                                </p>
                            </div>
                            <button onClick={closeModal} className="p-3 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors shrink-0">
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormInput label="Operator Name *" value={formData.name} onChange={v => field('name', v)} placeholder="e.g. John Doe" />
                                <FormInput label="Company Name *" value={formData.companyName} onChange={v => field('companyName', v)} placeholder="e.g. SpeedLine Tours" />
                                <FormInput label="Phone Number *" value={formData.contactNumber} onChange={v => field('contactNumber', v)} placeholder="e.g. +91 98765 43210" />
                                <FormInput label="Email Address *" type="email" value={formData.email} onChange={v => field('email', v)} placeholder="e.g. contact@speedline.com" />

                                {/* Password */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">
                                        Password {modal === 'edit' && <span className="text-gray-300">(leave blank to keep current)</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={e => field('password', e.target.value)}
                                            placeholder={modal === 'edit' ? '••••••••  (unchanged)' : '••••••••'}
                                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 pr-14 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none placeholder:text-gray-300"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#d84e55] transition-colors">
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <FormInput label="Office Address" value={formData.address} onChange={v => field('address', v)} placeholder="e.g. 123 Main St, Delhi" />
                                </div>

                                {/* Status */}
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Status</label>
                                    <div className="flex gap-3">
                                        {['Active', 'Inactive'].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => field('status', s)}
                                                className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${formData.status === s
                                                    ? s === 'Active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-[#d84e55] text-white shadow-lg shadow-red-100'
                                                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Error */}
                            {formError && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-xs font-bold">
                                    <XCircle className="h-4 w-4 shrink-0" />
                                    {formError}
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-deep-navy text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl hover:shadow-red-100 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {submitting ? 'Saving...' : modal === 'add' ? 'Register Operator' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FormInput = ({ label, value, onChange, placeholder, type = 'text' }) => (
    <div className="space-y-2">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none placeholder:text-gray-300"
        />
    </div>
);

export default OperatorsManagement;
