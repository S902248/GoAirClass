import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../slices/userSlice';
import DataTable from '../../components/common/DataTable';
import { User, Mail, Calendar, Phone } from 'lucide-react';

const ActiveUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const columns = [
    {
      key: 'fullName',
      label: 'User Name',
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <User size={20} />
          </div>
          <span className="font-bold">{value}</span>
        </div>
      ),
    },
    {
      key: 'mobileNumber',
      label: 'Mobile',
      render: (value) => (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Phone size={14} />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'referralCode',
      label: 'Referral Code',
      render: (value) => (
        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
          {value || 'None'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined Date',
      render: (value) => (
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={14} />
          <span>{new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      render: () => (
        <button className="text-primary-600 hover:text-primary-700 font-bold text-sm">View Details</button>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500 font-bold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Active Users</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and monitor all registered travelers on your platform.</p>
        </div>
      </div>

      <div className="card shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <DataTable
          columns={columns}
          data={users}
          isLoading={loading}
          onRowClick={(user) => console.log('User clicked:', user)}
        />
      </div>
    </div>
  );
};

export default ActiveUsers;

