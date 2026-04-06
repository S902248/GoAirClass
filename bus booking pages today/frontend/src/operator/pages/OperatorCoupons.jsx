import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOperatorCoupons, deleteCoupon, updateCoupon } from '../../api/couponApi';
import { 
    Tag, 
    Plus, 
    Search, 
    Filter, 
    Ticket, 
    TrendingUp, 
    Users, 
    Clock,
    IndianRupee,
    ShieldCheck,
    Upload,
    ChevronRight,
    Home
} from 'lucide-react';
import StatsCard from '../../SuperAdminPanel/components/common/StatsCard';
import DataTable from '../../SuperAdminPanel/components/common/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';

const OperatorCoupons = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        if (location.state?.message) {
            toast.success(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await getOperatorCoupons();
            setCoupons(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching coupons:', err);
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (row) => {
        const result = await Swal.fire({
            title: 'Terminate Coupon?',
            text: `Are you sure you want to delete ${row.code}? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!',
            background: '#ffffff',
            borderRadius: '24px'
        });

        if (result.isConfirmed) {
            try {
                await deleteCoupon(row._id);
                toast.success('Coupon deleted successfully');
                fetchCoupons();
            } catch (err) {
                toast.error('Failed to delete coupon');
            }
        }
    };

    const handleAction = async (action, row) => {
        if (action === 'edit') {
            navigate('/operator/coupons/add', { state: { editData: row } });
        } else if (action === 'delete') {
            handleDelete(row);
        } else if (action === 'toggle') {
            try {
                const newStatus = row.status === 'Active' ? 'Inactive' : 'Active';
                await updateCoupon(row._id, { status: newStatus });
                toast.success(`Coupon ${newStatus.toLowerCase()}d`);
                fetchCoupons();
            } catch (error) {
                toast.error('Failed to update status');
            }
        }
    };

    // Calculate aggregated stats
    const stats = {
        active: coupons.filter(c => c.status === 'Active').length,
        totalRedemptions: coupons.reduce((acc, curr) => acc + (curr.analytics?.totalTimesUsed || 0), 0),
        totalDiscount: coupons.reduce((acc, curr) => acc + (curr.analytics?.totalDiscountGiven || 0), 0),
        revenueImpact: coupons.reduce((acc, curr) => acc + (curr.analytics?.revenueGenerated || 0), 0)
    };

    const filteredCoupons = coupons.filter(c => {
        const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const columns = [
        { 
            key: 'code', 
            label: 'Coupon Code',
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                        <Ticket size={16} />
                    </div>
                    <span className="font-extrabold text-slate-800 tracking-tight uppercase">{val}</span>
                </div>
            )
        },
        { 
            key: 'discountValue', 
            label: 'Discount',
            render: (val, row) => (
                <div className="font-bold text-slate-700">
                    <span className="text-emerald-600">₹</span>
                    {val}
                    <span className="text-[10px] text-slate-400 ml-1 uppercase">{row.discountType === 'percentage' ? '%' : 'Flat'}</span>
                </div>
            )
        },
        { 
            key: 'fundingType', 
            label: 'Funding',
            render: (val) => {
                const label = val === 'SUPER_ADMIN' ? 'BUS OPERATER' : 'SUPER ADMIN';
                return (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                        label === 'SUPER ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                        {label}
                    </span>
                );
            }
        },
        { 
            key: 'analytics', 
            label: 'Usage Stats',
            render: (val, row) => {
                const used = val?.totalTimesUsed || 0;
                const limit = row.totalUsageLimit || 1;
                const percent = Math.min((used / limit) * 100, 100);
                return (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-bold uppercase tracking-widest">Used: {used} / {row.totalUsageLimit || '∞'}</span>
                            <span className="text-slate-900 font-black">₹{val?.totalDiscountGiven?.toLocaleString() || 0}</span>
                        </div>
                        <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary-500 rounded-full transition-all duration-700" 
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>
                );
            }
        },
        { 
            key: 'validTill', 
            label: 'Expiry',
            render: (val) => (
                <div className="flex items-center gap-2 text-slate-500 font-bold">
                    <Clock size={14} className="text-slate-300" />
                    <span className="text-xs">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        { 
            key: 'status', 
            label: 'Status',
            render: (val, row) => {
                const isExpired = new Date(row.validTill) < new Date();
                return (
                    <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                        isExpired ? 'bg-rose-50 text-rose-600' : val === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                        {isExpired ? 'Expired' : val}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">
            <ToastContainer position="bottom-right" theme="colored" />

            {/* Breadcrumbs matching image 1 */}
            <nav className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 pt-4">
                <div className="flex items-center gap-1 hover:text-primary-600 transition-colors cursor-pointer">
                    <Home size={12} />
                    <span>Home</span>
                </div>
                <ChevronRight size={12} />
                <span>Operator</span>
                <ChevronRight size={12} />
                <span>Marketing</span>
                <ChevronRight size={12} />
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Coupons</span>
            </nav>

            {/* Header matching image 1 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 bg-primary-600 rounded-3xl shadow-2xl shadow-primary-500/30">
                        <Ticket className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
                            Coupon Management
                        </h1>
                        <p className="text-slate-400 mt-1 font-bold uppercase text-[11px] tracking-widest">
                            Create, track, and manage promotional offers for your buses.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                    >
                        <Upload size={18} />
                        Bulk Import
                    </button>
                    <button 
                        onClick={() => navigate('/operator/coupons/add')}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-2xl shadow-primary-500/20 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Create New Coupon
                    </button>
                </div>
            </div>

            {/* Stats Cards exact match to image 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Active Coupons" 
                    value={stats.active} 
                    icon={ShieldCheck} 
                    color="primary" 
                />
                <StatsCard 
                    title="Total Redemptions" 
                    value={stats.totalRedemptions} 
                    icon={Users} 
                    color="success" 
                />
                <StatsCard 
                    title="Total Discount Given" 
                    value={`₹${stats.totalDiscount.toLocaleString()}`} 
                    icon={IndianRupee} 
                    color="warning" 
                />
                <StatsCard 
                    title="Revenue Impact" 
                    value={`₹${stats.revenueImpact.toLocaleString()}`} 
                    icon={TrendingUp} 
                    color="info" 
                />
            </div>

            {/* Search/Filter bar matching image 1 */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-3 flex flex-wrap items-center justify-between gap-6 overflow-hidden">
                <div className="flex-1 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <Search size={22} className="text-slate-300" />
                    <input 
                        type="text" 
                        placeholder="Search coupon code..." 
                        className="bg-transparent border-none outline-none w-full font-bold text-slate-600 placeholder:text-slate-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 pr-4">
                    <div className="flex items-center gap-2 bg-slate-50/50 p-1.5 rounded-2xl">
                        <button className="px-8 py-3 rounded-xl text-xs font-black bg-white text-slate-900 shadow-xl shadow-black/5">
                            {statusFilter} Status
                        </button>
                    </div>
                    <button className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 border border-slate-100">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {/* Premium Table section */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <DataTable 
                    columns={columns} 
                    data={filteredCoupons} 
                    loading={loading}
                    onAction={handleAction}
                />
            </div>
        </div>
    );
};

export default OperatorCoupons;
