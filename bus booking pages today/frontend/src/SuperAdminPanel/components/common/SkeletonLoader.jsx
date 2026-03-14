const SkeletonLoader = ({ className }) => {
    return (
        <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-lg ${className}`}></div>
    );
};

export default SkeletonLoader;
