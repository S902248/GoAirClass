import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (location.pathname === '/' || pathnames.length === 0) return null;

    return (
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6 font-sans">
            <Link to="/admin" className="hover:text-primary-600 transition-colors flex items-center gap-1.5 px-2 py-1 hover:bg-white dark:hover:bg-slate-900 rounded-lg shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                <Home size={14} />
                <span>Home</span>
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');

                return (
                    <div key={name} className="flex items-center gap-2">
                        <ChevronRight size={12} className="text-slate-300 dark:text-slate-700" />
                        {isLast ? (
                            <span className="px-2 py-1 text-slate-900 dark:text-white capitalize bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                                {displayName}
                            </span>
                        ) : (
                            <Link to={routeTo} className="hover:text-primary-600 transition-colors capitalize px-2 py-1 hover:bg-white dark:hover:bg-slate-900 rounded-lg">
                                {displayName}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;
