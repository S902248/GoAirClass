import { Box } from 'lucide-react';

const EmptyState = ({ title = "No data found", description = "Try adjusting your filters or search terms." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full text-slate-300 dark:text-slate-600 mb-4">
                <Box size={48} />
            </div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{description}</p>
        </div>
    );
};

export default EmptyState;
