const ChartCard = ({ title, children, subtitle }) => {
    return (
        <div className="card p-6 h-full">
            <div className="mb-6">
                <h3 className="text-lg font-bold">{title}</h3>
                {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
            </div>
            <div className="h-[300px] w-full">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
