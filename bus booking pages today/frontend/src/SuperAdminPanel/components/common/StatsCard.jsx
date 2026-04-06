import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
    const colorStyles = {
        primary: 'text-sky-600 bg-sky-50 border border-sky-100',
        success: 'text-emerald-600 bg-emerald-50 border border-emerald-100',
        warning: 'text-amber-600 bg-amber-50 border border-amber-100',
        danger: 'text-rose-600 bg-rose-50 border border-rose-100',
        info: 'text-cyan-600 bg-cyan-50 border border-cyan-100',
        purple: 'text-purple-600 bg-purple-50 border border-purple-100',
        train: 'text-train-primary bg-train-primary-light border border-train-primary/20',
    };

    return (
        <div className="card p-6 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs mt-1 font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
