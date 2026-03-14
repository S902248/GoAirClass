import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminRequests, updateAdminRequestStatus } from '../../../api/adminApi';
import { Shield, User, Lock, LayoutDashboard, CheckSquare, Square, ChevronRight, Save, ArrowLeft } from 'lucide-react';

const CreateNewAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [request, setRequest] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState(['dashboard']);
    const [dashboardAccess, setDashboardAccess] = useState(true);

    const permissionModules = [
        {
            name: 'Admin Management',
            permissions: [
                { id: 'addAdmin', label: 'Add Admin' },
                { id: 'adminDetail', label: 'Admin Detail' }
            ]
        },
        {
            name: 'Report',
            permissions: [
                { id: 'bookReport', label: 'Book Report' },
                { id: 'cancelReport', label: 'Cancel Report' },
                { id: 'failedReport', label: 'Failed Report' }
            ]
        },
        {
            name: 'User Management',
            permissions: [
                { id: 'viewUsers', label: 'View Users' },
                { id: 'deactivateUsers', label: 'Deactivate Users' },
                { id: 'userTransactions', label: 'User Transaction History' },
                { id: 'userWithdraw', label: 'Withdraw Amount' },
                { id: 'userDeposit', label: 'Deposit Amount' }
            ]
        },
        {
            name: 'User',
            permissions: [
                { id: 'userWithdrawReport', label: 'Withdraw Report' },
                { id: 'userDepositReport', label: 'Deposit Report' }
            ]
        },
        {
            name: 'Banner',
            permissions: [
                { id: 'bannerManagement', label: 'Banner Management' }
            ]
        },
        {
            name: 'Advertisement',
            permissions: [
                { id: 'advertisement', label: 'Advertisement' }
            ]
        },
        {
            name: 'Payment Settings',
            permissions: [
                { id: 'paymentSettings', label: 'Payment Settings' }
            ]
        },
        {
            name: 'Coupons',
            permissions: [
                { id: 'coupons', label: 'Coupons' }
            ]
        },
        {
            name: 'Contact',
            permissions: [
                { id: 'contact', label: 'Contact' }
            ]
        },
        {
            name: 'Footer Pages',
            permissions: [
                { id: 'footerPages', label: 'Footer Pages' }
            ]
        }
    ];

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await getAdminRequests();
                const found = data.requests.find(r => r._id === id);
                if (found) setRequest(found);
                else navigate('/admin/admins/requests');
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [id]);

    const togglePermission = (permId) => {
        setSelectedPermissions(prev =>
            prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
        );
    };

    const handleCreateAdmin = async () => {
        setSubmitting(true);
        try {
            const finalPermissions = dashboardAccess
                ? Array.from(new Set([...selectedPermissions, 'dashboard']))
                : selectedPermissions.filter(p => p !== 'dashboard');

            await updateAdminRequestStatus(id, 'approved', finalPermissions);
            navigate('/admin/admins/requests');
        } catch (err) {
            alert(err.message || 'Failed to create admin');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-20 text-center uppercase font-black text-slate-400">Loading Request...</div>;

    return (
        <div className="p-4 sm:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Create New Admin</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Convert request into administrative account</p>
                    </div>
                </div>
                <button
                    onClick={handleCreateAdmin}
                    disabled={submitting}
                    className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <Save size={18} />
                    {submitting ? 'Creating...' : 'Create Admin'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Account Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <User size={16} className="text-primary-500" />
                            Account Information
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Name</label>
                                <div className="mt-1.5 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white uppercase uppercase">
                                    {request?.fullName}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                <div className="mt-1.5 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white">
                                    {request?.username}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                <div className="mt-1.5 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-400">
                                    •••••••••••••• (Securely Hashed)
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Dashboard Access</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Allow access to main stats</p>
                                </div>
                                <button
                                    onClick={() => setDashboardAccess(!dashboardAccess)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${dashboardAccess ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${dashboardAccess ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Permissions */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Shield size={16} className="text-primary-500" />
                            Access Permissions
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {permissionModules.map((module) => (
                                <div key={module.name} className="p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 dark:border-slate-800/80 pb-2 flex items-center gap-2">
                                        <ChevronRight size={12} />
                                        {module.name}
                                    </p>
                                    <div className="space-y-3">
                                        {module.permissions.map((perm) => (
                                            <button
                                                key={perm.id}
                                                onClick={() => togglePermission(perm.id)}
                                                className="flex items-center gap-3 group w-full text-left"
                                            >
                                                {selectedPermissions.includes(perm.id) ? (
                                                    <CheckSquare size={18} className="text-primary-600 shrink-0" />
                                                ) : (
                                                    <Square size={18} className="text-slate-300 group-hover:text-slate-400 transition-colors shrink-0" />
                                                )}
                                                <span className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${selectedPermissions.includes(perm.id) ? 'text-primary-700 dark:text-primary-400' : 'text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                                                    {perm.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNewAdmin;
