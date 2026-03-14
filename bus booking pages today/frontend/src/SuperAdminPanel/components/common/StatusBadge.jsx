const StatusBadge = ({ status }) => {
    const statusStyles = {
        Confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        Failed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.Failed}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
