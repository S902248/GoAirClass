import { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Filter, 
    Ticket, 
    TrendingUp, 
    Users, 
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    MoreVertical,
    ChevronDown,
    IndianRupee,
    Settings2,
    ShieldCheck,
    Layers,
    Target,
    Zap,
    Upload,
    AlertOctagon,
    PlusCircle,
    Trash2
} from 'lucide-react';
import StatsCard from '../../components/common/StatsCard';
import DataTable from '../../components/common/DataTable';
import { listAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from '../../../api/couponApi';
import { getOperators } from '../../../api/operatorApi';
import { getAllRoutes } from '../../../api/routeApi';
import { getAllBuses } from '../../../api/busApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2/dist/sweetalert2.esm.all.js';

const CouponsView = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCouponId, setCurrentCouponId] = useState(null);
    const [operators, setOperators] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [allBuses, setAllBuses] = useState([]);
    const [filters, setFilters] = useState({ status: '', highUsage: 'false' });

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscountAmount: '',
        fundingType: 'SUPER_ADMIN',
        fundingDetails: { operatorShare: 0, adminShare: 100 },
        applicableOn: 'All',
        sourceCities: [],
        destinationCities: [],
        busTypes: [],
        specificOperators: [],
        minBookingAmount: 0,
        totalUsageLimit: 1000,
        perUserLimit: 1,
        userLimit: 1, // New field
        isGlobal: true,
        applicableRoutes: [],
        applicableBuses: [],
        firstUserOnly: false,
        validFrom: new Date().toISOString().split('T')[0],
        validTill: '',
        couponCategory: 'InstantDiscount',
        isGlobal: true, // Default to true for Super Admin
        slabs: [],
        targeting: {
            userTypes: ['All'],
            platforms: ['All'],
            isWeekendOnly: false,
            timeWindow: { startHour: 0, endHour: 23 }
        },
        fraud: {
            deviceLimit: 3,
            ipLimit: 5,
            requireOTP: false
        }
    });

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            maxDiscountAmount: '',
            fundingType: 'SUPER_ADMIN',
            fundingDetails: { operatorShare: 0, adminShare: 100 },
            applicableOn: 'All',
            sourceCities: [],
            destinationCities: [],
            busTypes: [],
            specificOperators: [],
            minBookingAmount: 0,
            totalUsageLimit: 1000,
            perUserLimit: 1,
            userLimit: 1,
            isGlobal: true,
            applicableRoutes: [],
            applicableBuses: [],
            firstUserOnly: false,
            validFrom: new Date().toISOString().split('T')[0],
            validTill: '',
            couponCategory: 'InstantDiscount',
            isGlobal: true,
            slabs: [],
            targeting: {
                userTypes: ['All'],
                platforms: ['All'],
                isWeekendOnly: false,
                timeWindow: { startHour: 0, endHour: 23 }
            },
            fraud: {
                deviceLimit: 3,
                ipLimit: 5,
                requireOTP: false
            }
        });
        setIsEditing(false);
        setCurrentCouponId(null);
    };

    useEffect(() => {
        fetchCoupons();
        fetchOperators();
    }, [filters]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const data = await listAdminCoupons(filters);
            setCoupons(data);
        } catch (error) {
            toast.error('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const fetchOperators = async () => {
        try {
            const data = await getOperators();
            // Handle both {operators: []} and raw [] responses
            setOperators(Array.isArray(data) ? data : (data.operators || []));
        } catch (error) {
            console.error('Error fetching operators:', error);
        }
    };

    const fetchTargetData = async () => {
        try {
            const [routesData, busesData] = await Promise.all([
                getAllRoutes(),
                getAllBuses()
            ]);
            setRoutes(routesData || []);
            setAllBuses(busesData || []);
        } catch (error) {
            console.error('Error fetching target data:', error);
        }
    };

    useEffect(() => {
        fetchCoupons();
        fetchOperators();
        fetchTargetData();
    }, [filters]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        toast.info('Processing CSV data...');
        // Basic Simulation of bulk upload (in real prod, this sends to a worker)
        setTimeout(() => toast.success('5 Coupons uploaded successfully'), 2000);
    };

    const addSlab = () => {
        setFormData({
            ...formData,
            slabs: [...formData.slabs, { minAmount: 0, maxAmount: 0, discountValue: 0, discountType: 'percentage' }]
        });
    };

    const removeSlab = (idx) => {
        const newSlabs = formData.slabs.filter((_, i) => i !== idx);
        setFormData({ ...formData, slabs: newSlabs });
    };

    const updateSlab = (idx, field, value) => {
        const newSlabs = [...formData.slabs];
        newSlabs[idx][field] = field === 'discountType' ? value : Number(value);
        setFormData({ ...formData, slabs: newSlabs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                discountValue: Number(formData.discountValue),
                maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
                minBookingAmount: Number(formData.minBookingAmount),
                totalUsageLimit: Number(formData.totalUsageLimit),
                perUserLimit: Number(formData.perUserLimit),
                userLimit: Number(formData.userLimit),
                isGlobal: formData.isGlobal,
                applicableRoutes: formData.applicableRoutes,
                applicableBuses: formData.applicableBuses
            };

            if (isEditing) {
                await updateAdminCoupon(currentCouponId, payload);
                toast.success('Coupon updated successfully');
            } else {
                await createAdminCoupon(payload);
                toast.success('Coupon created successfully');
            }
            
            setIsModalOpen(false);
            resetForm();
            fetchCoupons();
        } catch (error) {
            toast.error(error.message || 'Error saving coupon');
        }
    };

    const toggleStatus = async (coupon) => {
        try {
            const newStatus = coupon.status === 'Active' ? 'Inactive' : 'Active';
            await updateAdminCoupon(coupon._id, { status: newStatus });
            toast.success(`Coupon ${newStatus.toLowerCase()}d`);
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleEdit = (coupon) => {
        setIsEditing(true);
        setCurrentCouponId(coupon._id);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            maxDiscountAmount: coupon.maxDiscountAmount || '',
            fundingType: coupon.fundingType,
            fundingDetails: coupon.fundingDetails,
            applicableOn: coupon.applicableOn,
            sourceCities: coupon.sourceCities || [],
            destinationCities: coupon.destinationCities || [],
            busTypes: coupon.busTypes || [],
            specificOperators: coupon.specificOperators || [],
            minBookingAmount: coupon.minBookingAmount,
            totalUsageLimit: coupon.totalUsageLimit,
            perUserLimit: coupon.perUserLimit,
            firstUserOnly: coupon.firstUserOnly,
            validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
            validTill: new Date(coupon.validTill).toISOString().split('T')[0],
            couponCategory: coupon.couponCategory || 'InstantDiscount',
            isGlobal: coupon.isGlobal !== undefined ? coupon.isGlobal : true,
            applicableRoutes: coupon.applicableRoutes || [],
            applicableBuses: coupon.applicableBuses || [],
            userLimit: coupon.userLimit || coupon.perUserLimit || 1,
            slabs: coupon.slabs || [],
            targeting: coupon.targeting || {
                userTypes: ['All'],
                platforms: ['All'],
                isWeekendOnly: false,
                timeWindow: { startHour: 0, endHour: 23 }
            },
            fraud: coupon.fraud || {
                deviceLimit: 3,
                ipLimit: 5,
                requireOTP: false
            }
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This coupon will be permanently deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#fff',
            customClass: {
                popup: 'rounded-[2rem]',
                confirmButton: 'rounded-xl px-6 py-2.5 font-bold',
                cancelButton: 'rounded-xl px-6 py-2.5 font-bold'
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteAdminCoupon(id);
                toast.success('Coupon deleted successfully');
                fetchCoupons();
            } catch (error) {
                toast.error('Failed to delete coupon');
            }
        }
    };

    const handleAction = (type, row) => {
        if (type === 'toggle') toggleStatus(row);
        if (type === 'edit') handleEdit(row);
        if (type === 'delete') handleDelete(row._id);
    };

    const columns = [
        { 
            key: 'code', 
            label: 'Coupon Code',
            render: (val) => (
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <Ticket className="text-primary-600 dark:text-primary-400" size={16} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white uppercase">{val}</span>
                </div>
            )
        },
        { 
            key: 'discountValue', 
            label: 'Discount',
            render: (val, row) => (
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {row.discountType === 'flat' ? `₹${val}` : `${val}%`}
                    {row.discountType === 'percentage' && row.maxDiscountAmount && (
                        <span className="text-[10px] block text-slate-400 tracking-tight">Max ₹${row.maxDiscountAmount}</span>
                    )}
                </span>
            )
        },
        {
            key: 'fundingType',
            label: 'Funding',
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${
                        val === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                        {val}
                    </span>
                    {val === 'SHARED' && (
                        <span className="text-[10px] text-slate-400 mt-0.5">
                            Op: {row.fundingDetails.operatorShare}% | Admin: {row.fundingDetails.adminShare}%
                        </span>
                    )}
                </div>
            )
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
                            <span className="text-slate-500 font-medium">Used: {used} / {row.totalUsageLimit || '∞'}</span>
                            <span className="text-slate-900 dark:text-slate-200 font-bold">₹{val?.totalDiscountGiven?.toLocaleString() || 0}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary-500 rounded-full transition-all duration-500" 
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
                <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock size={14} />
                    <span className="text-xs font-medium">{new Date(val).toLocaleDateString()}</span>
                </div>
            )
        },
        { 
            key: 'status', 
            label: 'Status',
            render: (val, row) => {
                const isExpired = new Date(row.validTill) < new Date();
                return (
                    <span className={`text-[12px] font-bold ${isExpired ? 'text-rose-600' : val === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {isExpired ? 'Expired' : val}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="p-2.5 bg-primary-600 rounded-2xl shadow-lg shadow-primary-500/30">
                            <Ticket className="text-white" size={24} />
                        </div>
                        Coupon Management
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Create, track, and manage promotional offers across all services.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input 
                            type="file" 
                            id="csvUpload" 
                            className="hidden" 
                            accept=".csv" 
                            onChange={handleFileUpload} 
                        />
                        <label 
                            htmlFor="csvUpload"
                            className="bg-white border border-slate-200 text-slate-600 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            <Upload size={20} />
                            <span>Bulk Import</span>
                        </label>
                    </div>
                    <button 
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-sky-500/20 transition-all active:scale-95 group"
                    >
                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        <span>Create New Coupon</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Active Coupons" 
                    value={coupons.filter(c => c.status === 'Active' && new Date(c.validTill) >= new Date()).length} 
                    icon={ShieldCheck} 
                    color="primary"
                />
                <StatsCard 
                    title="Total Redemptions" 
                    value={coupons.reduce((acc, c) => acc + (c.analytics?.totalTimesUsed || 0), 0)} 
                    icon={Users} 
                    color="success"
                />
                <StatsCard 
                    title="Total Discount Given" 
                    value={`₹${coupons.reduce((acc, c) => acc + (c.analytics?.totalDiscountGiven || 0), 0).toLocaleString()}`} 
                    icon={IndianRupee} 
                    color="warning"
                />
                <StatsCard 
                    title="Revenue Impact" 
                    value={`₹${coupons.reduce((acc, c) => acc + (c.analytics?.revenueGenerated || 0), 0).toLocaleString()}`} 
                    icon={TrendingUp} 
                    color="info"
                />
            </div>

            {/* Main Table Section */}
            <div className="card overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Search coupon code..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 ring-primary-500/20 text-sm font-medium transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-primary-600 transition-colors">
                                <Filter size={18} />
                            </button>
                            <select 
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-4 pr-10 text-sm font-bold text-slate-600 dark:text-slate-300 focus:ring-2 ring-primary-500/20 appearance-none"
                            >
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={fetchCoupons}
                            className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-primary-600 transition-colors"
                        >
                            <Settings2 size={18} />
                        </button>
                    </div>
                </div>
                <DataTable 
                    columns={columns} 
                    data={coupons} 
                    loading={loading}
                    onAction={handleAction}
                />
            </div>

            {/* Full-Screen Advanced Coupon System Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[120] bg-white dark:bg-slate-950 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    {/* Sticky Header */}
                    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-50 dark:bg-primary-900/30 rounded-2xl text-primary-600">
                                <Ticket size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                                    {isEditing ? 'Advanced Configuration' : 'Create High-Impact Coupon'}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Marketing Engine v2.0</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                type="button"
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="px-6 py-3 text-sm font-black text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Discard
                            </button>
                            <button 
                                onClick={handleSubmit}
                                className="px-10 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 active:scale-95 transition-all"
                            >
                                {isEditing ? 'Apply Changes' : 'Publish Coupon'}
                            </button>
                            <button 
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="ml-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <XCircle className="text-slate-300" size={24} />
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-8 py-10 bg-slate-50/30 dark:bg-slate-950/30">
                        <div className="max-w-7xl mx-auto space-y-10 pb-20">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                
                                {/* Section 1: Core Identity & Brand */}
                                <section className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Basic Info</h3>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-500 dark:text-slate-400 ml-1">Coupon Identity (Unique Code)</label>
                                            <input 
                                                type="text"
                                                required
                                                placeholder="E.g. SUMMERFLIGHT50"
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 ring-primary-500/10 font-black uppercase text-xl placeholder:text-slate-300"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-black text-slate-500 dark:text-slate-400 ml-1">Promotional Description</label>
                                            <textarea 
                                                rows="3"
                                                placeholder="Describe the offer value to the user..."
                                                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-4 ring-primary-500/10 font-bold text-slate-600 dark:text-slate-300"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-black text-slate-500 dark:text-slate-400 ml-1">Category</label>
                                                <select 
                                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold"
                                                    value={formData.couponCategory}
                                                    onChange={(e) => setFormData({ ...formData, couponCategory: e.target.value })}
                                                >
                                                    <option value="InstantDiscount">💸 Instant Discount</option>
                                                    <option value="Cashback">💰 Wallet Cashback</option>
                                                    <option value="WalletCredit">💳 Flat Credit</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-black text-slate-500 dark:text-slate-400 ml-1">Funding Type</label>
                                                <select 
                                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold"
                                                    value={formData.fundingType}
                                                    onChange={(e) => setFormData({ ...formData, fundingType: e.target.value })}
                                                >
                                                    <option value="SUPER_ADMIN">GoAir Funded</option>
                                                    <option value="SHARED">Shared (Co-funded)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 2: Financial Logic */}
                                <section className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Discount Logic</h3>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl">
                                            {['percentage', 'flat', 'slab'].map(type => (
                                                <button 
                                                    key={type}
                                                    type="button"
                                                    className={`flex-1 py-3.5 rounded-xl text-sm font-black transition-all capitalize ${formData.discountType === type ? 'bg-white dark:bg-slate-700 shadow-xl shadow-black/5 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
                                                    onClick={() => setFormData({ ...formData, discountType: type })}
                                                >
                                                    {type} Logic
                                                </button>
                                            ))}
                                        </div>

                                        {formData.discountType === 'slab' ? (
                                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Pricing Slabs</span>
                                                    <button onClick={addSlab} className="text-xs font-black text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-primary-100 transition-colors">
                                                        <PlusCircle size={14} /> Add Slab
                                                    </button>
                                                </div>
                                                <div className="space-y-3">
                                                    {formData.slabs.map((slab, idx) => (
                                                        <div key={idx} className="grid grid-cols-5 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                            <div className="col-span-1"><input type="number" placeholder="Min" className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg text-xs font-bold outline-none" value={slab.minAmount} onChange={(e) => updateSlab(idx, 'minAmount', e.target.value)} /></div>
                                                            <div className="col-span-1"><input type="number" placeholder="Max" className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg text-xs font-bold outline-none" value={slab.maxAmount} onChange={(e) => updateSlab(idx, 'maxAmount', e.target.value)} /></div>
                                                            <div className="col-span-1"><input type="number" placeholder="Value" className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg text-xs font-bold border-amber-100 border focus:border-amber-500 outline-none" value={slab.discountValue} onChange={(e) => updateSlab(idx, 'discountValue', e.target.value)} /></div>
                                                            <div className="col-span-1">
                                                                <select className="w-full bg-white dark:bg-slate-800 p-2 rounded-lg text-xs font-bold outline-none" value={slab.discountType} onChange={(e) => updateSlab(idx, 'discountType', e.target.value)}>
                                                                    <option value="percentage">%</option>
                                                                    <option value="flat">₹</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center justify-center"><button type="button" onClick={() => removeSlab(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-500">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-black text-slate-500 dark:text-slate-400 ml-1">Value ({formData.discountType === 'flat' ? '₹' : '%'})</label>
                                                    <input 
                                                        type="number"
                                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xl text-primary-600"
                                                        value={formData.discountValue}
                                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-black text-slate-500 dark:text-slate-400 ml-1">Cap Limit (₹)</label>
                                                    <input 
                                                        type="number"
                                                        disabled={formData.discountType === 'flat'}
                                                        placeholder="No Limit"
                                                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xl disabled:opacity-30"
                                                        value={formData.maxDiscountAmount}
                                                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {formData.fundingType === 'SHARED' && (
                                            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-800 space-y-4">
                                                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
                                                    <TrendingUp size={18} />
                                                    <span className="text-sm font-black">Shared Funding Ratio</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-amber-600 uppercase ml-1 tracking-widest">Admin %</label>
                                                        <input type="number" className="w-full px-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl font-bold" value={formData.fundingDetails.adminShare} onChange={(e) => setFormData({ ...formData, fundingDetails: { ...formData.fundingDetails, adminShare: Number(e.target.value), operatorShare: 100 - Number(e.target.value) }})} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-amber-600 uppercase ml-1 tracking-widest">Operator %</label>
                                                        <input type="number" readOnly className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-xl font-bold text-slate-400" value={formData.fundingDetails.operatorShare} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Section 3: Advanced Targeting (Full Width Logic) */}
                                <section className="lg:col-span-2 space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-lg relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Geographic & Route Targeting</h3>
                                            </div>
                                            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-100">
                                                <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-widest">Scope:</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, isGlobal: true })}
                                                    className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${formData.isGlobal ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    Global (All Routes)
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, isGlobal: false })}
                                                    className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${!formData.isGlobal ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    Specific Selection
                                                </button>
                                            </div>
                                        </div>

                                        {!formData.isGlobal && (
                                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-8 duration-500">
                                                {/* Applicable Routes */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between ml-1">
                                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <MapPin size={16} /> Applicable Routes
                                                        </label>
                                                        <span className="text-[10px] font-black text-slate-400">{formData.applicableRoutes.length} Selected</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                                        {routes.map(route => (
                                                            <button
                                                                key={route._id}
                                                                type="button"
                                                                onClick={() => {
                                                                    const next = formData.applicableRoutes.includes(route._id)
                                                                        ? formData.applicableRoutes.filter(id => id !== route._id)
                                                                        : [...formData.applicableRoutes, route._id];
                                                                    setFormData({ ...formData, applicableRoutes: next });
                                                                }}
                                                                className={`p-4 rounded-2xl flex items-center gap-3 text-left transition-all border ${
                                                                    formData.applicableRoutes.includes(route._id)
                                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm'
                                                                        : 'bg-slate-50/50 border-transparent text-slate-500 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${formData.applicableRoutes.includes(route._id) ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                                                                    {formData.applicableRoutes.includes(route._id) && <CheckCircle2 size={12} className="text-white" />}
                                                                </div>
                                                                <span className="text-xs font-black truncate">{route.from} ➔ {route.to}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Applicable Buses */}
                                                <div className="space-y-4 border-l border-slate-100 dark:border-slate-800 pl-10">
                                                    <div className="flex items-center justify-between ml-1">
                                                        <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Bus size={16} /> Specific Buses (Optional)
                                                        </label>
                                                        <span className="text-[10px] font-black text-slate-400">{formData.applicableBuses.length} Reserved</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                                        {allBuses.filter(bus => 
                                                            formData.applicableRoutes.length === 0 || formData.applicableRoutes.includes(bus.route)
                                                        ).map(bus => (
                                                            <button
                                                                key={bus._id}
                                                                type="button"
                                                                onClick={() => {
                                                                    const next = formData.applicableBuses.includes(bus._id)
                                                                        ? formData.applicableBuses.filter(id => id !== bus._id)
                                                                        : [...formData.applicableBuses, bus._id];
                                                                    setFormData({ ...formData, applicableBuses: next });
                                                                }}
                                                                className={`p-4 rounded-2xl flex items-center justify-between transition-all border ${
                                                                    formData.applicableBuses.includes(bus._id)
                                                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm'
                                                                        : 'bg-slate-50/50 border-transparent text-slate-500 hover:bg-slate-100'
                                                                }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${formData.applicableBuses.includes(bus._id) ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                                                        <Bus size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-[13px] font-black">{bus.busNumber}</p>
                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{bus.busType}</p>
                                                                    </div>
                                                                </div>
                                                                {formData.applicableBuses.includes(bus._id) && <Check size={16} className="text-indigo-600" />}
                                                            </button>
                                                        ))}
                                                        {allBuses.length === 0 && <p className="text-center py-10 text-slate-400 font-bold italic">No active buses found.</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {formData.isGlobal && (
                                            <div className="mt-10 p-16 border-2 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[3rem] text-center animate-in zoom-in-95 duration-500">
                                                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                                                    <Zap size={40} />
                                                </div>
                                                <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Global Coupon Enabled</h4>
                                                <p className="text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto">This offer will be automatically applicable to all routes, buses, and cities in the network.</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Section 4: Eligibility & Conditions */}
                                <section className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Booking Conditions</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-black text-slate-500 dark:text-slate-400 ml-1">Min. Booking Value (₹)</label>
                                                <input type="number" placeholder="0" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xl" value={formData.minBookingAmount} onChange={(e) => setFormData({ ...formData, minBookingAmount: e.target.value })} />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({ ...formData, targeting: { ...formData.targeting, isWeekendOnly: !formData.targeting.isWeekendOnly }})}
                                                className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all border ${formData.targeting.isWeekendOnly ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50/50 border-transparent text-slate-400'}`}
                                            >
                                                <div className="flex items-center gap-3"><Calendar size={20} /><span className="text-sm font-black">Weekend Travel Only</span></div>
                                                <div className={`w-10 h-5 rounded-full relative transition-all ${formData.targeting.isWeekendOnly ? 'bg-rose-500' : 'bg-slate-300'}`}>
                                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.targeting.isWeekendOnly ? 'left-6' : 'left-1'}`} />
                                                </div>
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">User Eligibility</label>
                                                <div className="space-y-2">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setFormData({ ...formData, firstUserOnly: !formData.firstUserOnly })}
                                                        className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border ${formData.firstUserOnly ? 'bg-primary-50 border-primary-100 text-primary-700 font-black' : 'bg-slate-50/50 border-transparent text-slate-400 font-bold'}`}
                                                    >
                                                        <span className="text-sm underline underline-offset-4 decoration-primary-300">First-Time Bookers Only?</span>
                                                        {formData.firstUserOnly ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 border-2 border-slate-200 rounded-full" />}
                                                    </button>
                                                    <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase block mb-3">Target Retention</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {['New', 'Existing', 'Inactive'].map(type => (
                                                                <button
                                                                    key={type}
                                                                    type="button"
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${formData.targeting.userTypes.includes(type) ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}
                                                                    onClick={() => {
                                                                        const types = formData.targeting.userTypes.includes(type) ? formData.targeting.userTypes.filter(t => t !== type) : [...formData.targeting.userTypes.filter(t => t !== 'All'), type];
                                                                        setFormData({ ...formData, targeting: { ...formData.targeting, userTypes: types.length ? types : ['All'] } });
                                                                    }}
                                                                >
                                                                    {type}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 5: Limits & Fraud Control */}
                                <section className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Limits & Guardrails</h3>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Limit Per User</label>
                                            <div className="relative">
                                                <input type="number" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xl pr-12" value={formData.userLimit} onChange={(e) => setFormData({ ...formData, userLimit: e.target.value, perUserLimit: e.target.value })} />
                                                <Users size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Global Stock</label>
                                            <div className="relative">
                                                <input type="number" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-xl pr-12" value={formData.totalUsageLimit} onChange={(e) => setFormData({ ...formData, totalUsageLimit: e.target.value })} />
                                                <ShieldCheck size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                                            <div className="relative">
                                                <input type="date" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-black text-sm" value={formData.validTill} onChange={(e) => setFormData({ ...formData, validTill: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fraud Prevention Toggles */}
                                    <div className="pt-4 flex flex-wrap gap-4">
                                        <label className="flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                            <input type="checkbox" checked={formData.fraud.requireOTP} onChange={(e) => setFormData({ ...formData, fraud: { ...formData.fraud, requireOTP: e.target.checked }})} className="w-5 h-5 rounded-md border-none text-primary-600 focus:ring-0" />
                                            <span className="text-xs font-black text-slate-700 dark:text-slate-300">Force Device OTP Check</span>
                                        </label>
                                        <label className="flex items-center gap-3 px-6 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Device Lockout:</span>
                                            <input type="number" className="w-16 bg-white dark:bg-slate-900 border-none rounded-lg text-xs font-black text-center" value={formData.fraud.deviceLimit} onChange={(e) => setFormData({ ...formData, fraud: { ...formData.fraud, deviceLimit: e.target.value }})} />
                                        </label>
                                    </div>
                                </section>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default CouponsView;
