import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminRequests, updateAdminRequestStatus } from '../../api/adminApi';
import { User, Phone, Mail, Clock, Pencil, XCircle, Eye, ShieldCheck } from 'lucide-react';

const AdminRequests = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await getAdminRequests();
            setRequests(data.requests);
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleReject = async (requestId) => {
        if (!confirm('Are you sure you want to reject this request?')) return;
        try {
            await updateAdminRequestStatus(requestId, 'rejected', []);
            fetchRequests();
        } catch (err) {
            alert(err.message || 'Action failed');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'approved': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'rejected': return 'bg-rose-100 text-rose-600 border-rose-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                        <ShieldCheck className="text-primary-500" />
                        Admin Requests
                    </h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage administrative access applications</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-900/20">
                    <Clock size={16} className="text-primary-500" />
                    <span className="text-xs font-black text-primary-600 uppercase tabular-nums">
                        {requests.filter(r => r.status === 'pending').length} Pending
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Name</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mobile</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {requests.map((request) => (
                                <tr key={request._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{request.fullName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@{request.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[11px] font-bold tabular-nums text-slate-600 dark:text-slate-400">{request.mobileNumber}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                className="p-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/10 text-primary-500 rounded-xl transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => navigate(`/admin/admins/create-from-request/${request._id}`)}
                                                        className="p-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-emerald-500 rounded-xl transition-all"
                                                        title="Approve / Create Admin"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request._id)}
                                                        className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-rose-500 rounded-xl transition-all"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminRequests;
