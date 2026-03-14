import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import StatusBadge from './StatusBadge';

const DataTable = ({ columns, data, loading }) => {
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
            <div className="overflow-x-auto">
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
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <MoreHorizontal size={18} />
                                    </button>
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
