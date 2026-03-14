import { Download } from 'lucide-react';

const ExportButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="btn btn-secondary flex items-center gap-2 text-sm"
        >
            <Download size={16} />
            <span>Export</span>
        </button>
    );
};

export default ExportButton;
