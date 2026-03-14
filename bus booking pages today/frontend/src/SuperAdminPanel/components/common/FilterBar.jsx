import { Filter } from 'lucide-react';

const FilterBar = ({ options, activeTab, onTabChange }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400">
                <Filter size={18} />
            </div>
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onTabChange(option)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === option
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
