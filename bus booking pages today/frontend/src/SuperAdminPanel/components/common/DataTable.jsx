import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, Edit2, Trash2, Power } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DataTable = ({ columns, data, loading, onAction }) => {
    const [activeRow, setActiveRow] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveRow(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return (
            <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading data...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            {columns.map((col) => (
                                <th key={col.key} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    {col.label}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-6 py-4 text-sm whitespace-nowrap">
                                        {col.render ? (
                                            col.render(row[col.key], row)
                                        ) : col.key === 'status' ? (
                                            <StatusBadge status={row[col.key]} />
                                        ) : (
                                            String(row[col.key] || '-')
                                        )}
                                    </td>
                                ))}
                                <td className="px-6 py-4 text-right relative">
                                    <button 
                                        onClick={() => setActiveRow(activeRow === idx ? null : idx)}
                                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>

                                    {activeRow === idx && (
                                        <div 
                                            ref={dropdownRef}
                                            className="absolute right-6 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-[100] p-2 animate-in fade-in zoom-in-95 duration-200"
                                        >
                                            <button 
                                                onClick={() => { onAction?.('edit', row); setActiveRow(null); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left"
                                            >
                                                <Edit2 size={16} className="text-primary-500" />
                                                Edit Coupon
                                            </button>
                                            <button 
                                                onClick={() => { onAction?.('toggle', row); setActiveRow(null); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors text-left"
                                            >
                                                <Power size={16} className={row.status === 'Active' ? 'text-orange-500' : 'text-emerald-500'} />
                                                {row.status === 'Active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                                            <button 
                                                onClick={() => { onAction?.('delete', row); setActiveRow(null); }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors text-left"
                                            >
                                                <Trash2 size={16} />
                                                Delete Coupon
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to <span className="font-medium text-slate-900 dark:text-white">{data.length}</span> of <span className="font-medium text-slate-900 dark:text-white">{data.length}</span> results
                </p>
                <div className="flex gap-2">
                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>
                        <ChevronLeft size={18} />
                    </button>
                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;

