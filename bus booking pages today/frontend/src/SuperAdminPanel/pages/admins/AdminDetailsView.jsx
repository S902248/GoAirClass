import React, { useState, useEffect } from 'react';
import { getAllAdmins } from '../../../api/adminApi';
import { User, Shield, ShieldCheck, Mail, Phone, ChevronRight, Lock } from 'lucide-react';

const AdminDetailsView = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data.admins);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

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
            Admin Management
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">View and manage administrative staff</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
          <Shield size={16} className="text-emerald-500" />
          <span className="text-xs font-black text-emerald-600 uppercase tabular-nums">
            {admins.length} Active Admins
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Admin Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Permissions</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {admins.map((admin) => (
                <tr key={admin._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{admin.fullName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@{admin.adminUsername}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Phone size={12} />
                        <span className="text-[11px] font-bold tabular-nums">{admin.mobileNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Mail size={12} />
                        <span className="text-[11px] font-bold lowercase">{admin.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {admin.permissions?.slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[8px] font-black uppercase rounded uppercase tracking-tighter">
                          {perm}
                        </span>
                      ))}
                      {admin.permissions?.length > 3 && (
                        <span className="px-2 py-0.5 bg-primary-50 text-primary-500 text-[8px] font-black uppercase rounded uppercase tracking-tighter">
                          +{admin.permissions.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 w-max ml-auto">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center text-slate-400 uppercase font-black text-xs tracking-widest">
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsView;

