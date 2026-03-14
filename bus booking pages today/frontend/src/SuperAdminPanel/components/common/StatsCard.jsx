const StatsCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => {
    const colorStyles = {
        primary: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20',
        success: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
        warning: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
        danger: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20',
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
                    <p className={`text-xs mt-1 ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trend > 0 ? '+' : ''}{trend}% <span className="text-slate-400">vs last month</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
