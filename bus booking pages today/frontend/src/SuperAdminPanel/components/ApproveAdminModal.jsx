import React, { useState } from 'react';
import { X, Shield, Lock, CheckSquare, Square } from 'lucide-react';

const ApproveAdminModal = ({ isOpen, onClose, onConfirm, request }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const permissionsList = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'addAdmin', label: 'Add Admin' },
        { id: 'adminDetail', label: 'Admin Detail' },
        { id: 'viewUsers', label: 'View Users' },
        { id: 'deactivateUsers', label: 'Deactivate Users' },
        { id: 'userTransactions', label: 'User Transaction History' },
        { id: 'withdrawAmount', label: 'Withdraw Amount' },
        { id: 'depositAmount', label: 'Deposit Amount' },
        { id: 'agentList', label: 'Agent List' },
        { id: 'deactivateAgent', label: 'Deactivate Agent' },
        { id: 'agentTransactions', label: 'Agent Transaction History' },
        { id: 'removedAgents', label: 'Removed Agents' },
        { id: 'banners', label: 'Banner Management' },
        { id: 'ads', label: 'Advertisement' },
        { id: 'payments', label: 'Payment Settings' },
        { id: 'coupons', label: 'Coupons' },
        { id: 'contact', label: 'Contact' },
        { id: 'footer', label: 'Footer Pages' },
    ];

    const togglePermission = (id) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedPermissions.length === permissionsList.length) {
            setSelectedPermissions([]);
        } else {
            setSelectedPermissions(permissionsList.map(p => p.id));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Approve Admin Request</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assign permissions for {request?.fullName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Shield size={16} className="text-primary-500" />
                            Select Permissions
                        </h3>
                        <button
                            onClick={handleSelectAll}
                            className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                        >
                            {selectedPermissions.length === permissionsList.length ? 'Deselect All' : 'Select All'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissionsList.map((perm) => (
                            <button
                                key={perm.id}
                                onClick={() => togglePermission(perm.id)}
                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${selectedPermissions.includes(perm.id)
                                        ? 'bg-primary-50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-900/30'
                                        : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                                    }`}
                            >
                                {selectedPermissions.includes(perm.id) ? (
                                    <CheckSquare size={18} className="text-primary-600" />
                                ) : (
                                    <Square size={18} className="text-slate-300" />
                                )}
                                <span className={`text-[11px] font-bold uppercase tracking-wide ${selectedPermissions.includes(perm.id) ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'
                                    }`}>
                                    {perm.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(selectedPermissions)}
                        disabled={selectedPermissions.length === 0}
                        className="flex-2 px-12 py-4 bg-primary-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Lock size={16} />
                        Confirm Approval
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApproveAdminModal;
