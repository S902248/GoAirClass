import { useState } from 'react';
import DataTable from '../../components/common/DataTable';
import FilterBar from '../../components/common/FilterBar';
import SearchInput from '../../components/common/SearchInput';
import ExportButton from '../../components/common/ExportButton';
import { recentBookings } from '../../utils/mockData';

const AllBookings = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [search, setSearch] = useState('');

    const columns = [
        { key: 'id', label: 'Booking ID' },
        { key: 'customer', label: 'Customer' },
        { key: 'service', label: 'Service' },
        { key: 'date', label: 'Date' },
        { key: 'amount', label: 'Amount (₹)' },
        { key: 'status', label: 'Status' },
    ];

    const filterOptions = ['All', 'Bus', 'Flight', 'Hotel'];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 font-sans pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Bookings Management</h1>
                    <p className="text-slate-500 text-sm">Monitor and manage all customer bookings from one place.</p>
                </div>
                <ExportButton onClick={() => alert('Exporting data...')} />
            </div>

            <div className="card">
                <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <FilterBar options={filterOptions} activeTab={activeTab} onTabChange={setActiveTab} />
                    <div className="w-full lg:w-auto">
                        <SearchInput
                            placeholder="Search by ID or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <DataTable columns={columns} data={recentBookings} />
            </div>
        </div>
    );
};

export default AllBookings;
