import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings } from '../../slices/bookingSlice';
import DataTable from '../../components/common/DataTable';
import {
  User as UserIcon,
  Bus as BusIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  CreditCard as CardIcon,
  AlertCircle
} from 'lucide-react';

const FailedReportView = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const failedBookings = useMemo(() => {
    return bookings.filter(b => b.paymentStatus === 'Failed');
  }, [bookings]);

  const columns = [
    {
      key: 'passengerName',
      label: 'Customer',
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{value}</span>
          <span className="text-xs text-slate-500 font-medium">{row.passengerMobile}</span>
        </div>
      ),
    },
    {
      key: 'bus',
      label: 'Bus',
      render: (busData) => (
        <div className="flex items-center gap-2">
          <BusIcon size={16} className="text-slate-400" />
          <div className="flex flex-col">
            <span className="text-sm font-bold">{busData?.busNumber || 'N/A'}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{busData?.busType || 'Standard'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'route',
      label: 'Route',
      render: (routeData) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm font-bold">
            <span>{routeData?.fromCity || 'N/A'}</span>
            <span className="text-slate-400">→</span>
            <span>{routeData?.toCity || 'N/A'}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'travelDate',
      label: 'Travel Date',
      render: (value) => (
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium text-sm">
          <CalendarIcon size={14} />
          <span>{new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      ),
    },
    {
      key: 'totalFare',
      label: 'Attempted Amount',
      render: (value) => (
        <div className="flex items-center gap-1 font-extrabold text-slate-900 dark:text-white">
          <span>₹{value?.toLocaleString()}</span>
        </div>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Reason',
      render: () => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400">
          PAYMENT_FAILED
        </span>
      ),
    },
  ];

  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 p-6 rounded-2xl inline-block border border-rose-100 dark:border-rose-900/30">
          <h3 className="font-bold text-lg mb-1">Failed to Load Reports</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600">
              <AlertCircle size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white uppercase tracking-widest">Failed Reports</h1>
          </div>
          <p className="text-slate-500 mt-2 font-medium">Tracking incomplete transactions and payment gateway rejections.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <ClockIcon size={16} /> History
          </button>
          <button className="bg-primary-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all flex items-center gap-2">
            <CardIcon size={16} /> Export Logs
          </button>
        </div>
      </div>

      <div className="card shadow-2xl shadow-orange-100/30 dark:shadow-none border-none overflow-hidden">
        <DataTable
          columns={columns}
          data={failedBookings}
          isLoading={loading}
          onRowClick={(booking) => console.log('Failed booking detail:', booking)}
        />
      </div>
    </div>
  );
};

export default FailedReportView;

