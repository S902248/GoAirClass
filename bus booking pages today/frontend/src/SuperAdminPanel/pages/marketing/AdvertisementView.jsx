import React, { useState, useEffect } from 'react';
import {
    Plus, Megaphone, Target, BarChart3, Clock, Eye, MousePointer2,
    MoreVertical, Trash2, Edit2, CheckCircle, XCircle, ChevronRight,
    Layers, Monitor, Smartphone, MapPin, Tag, Calendar
} from 'lucide-react';
import axios from 'axios';

const AdvertisementView = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageDesktop: '',
        imageMobile: '',
        redirectUrl: '',
        adType: 'Banner',
        position: 'HomepageTop',
        targetRouteSource: '',
        targetRouteDestination: '',
        targetDevice: 'All',
        targetUserType: 'All',
        priority: 'Medium',
        status: 'Active',
        startDate: '',
        endDate: '',
        cpc: 0,
        cpm: 0,
        subTitle: '',
        offerText: '',
        couponCode: '',
        buttonText: 'Book Now'
    });

    const API_URL = '/api/ads/admin';

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            if (res.data.success) setAds(res.data.ads);
        } catch (err) {
            console.error("Error fetching ads", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAd) {
                await axios.put(`${API_URL}/${editingAd._id}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            setShowModal(false);
            setEditingAd(null);
            resetForm();
            fetchAds();
        } catch (err) {
            alert("Error saving advertisement");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this ad? All analytics data will be lost.")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchAds();
        } catch (err) {
            alert("Error deleting ad");
        }
    };

    const resetForm = () => {
        setFormData({
            title: '', description: '', imageDesktop: '', imageMobile: '', redirectUrl: '',
            adType: 'Banner', position: 'HomepageTop', targetRouteSource: '', targetRouteDestination: '',
            targetDevice: 'All', targetUserType: 'All', priority: 'Medium', status: 'Active',
            startDate: '', endDate: '', cpc: 0, cpm: 0,
            subTitle: '', offerText: '', couponCode: '', buttonText: 'Book Now'
        });
    };

    const getStatusColor = (status) => status === 'Active' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-400 bg-slate-50 dark:bg-slate-800';
    const getPriorityColor = (p) => {
        if (p === 'High') return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10';
        if (p === 'Medium') return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10';
        return 'text-blue-500 bg-blue-50 dark:bg-blue-500/10';
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <Megaphone className="h-8 w-8 text-blue-500" />
                        Ad Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Create targeted campaigns and track revenue.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus className="h-5 w-5" />
                    Create Campaign
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Impressions', value: ads.reduce((acc, ad) => acc + (ad.stats?.impressions || 0), 0), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { label: 'Total Clicks', value: ads.reduce((acc, ad) => acc + (ad.stats?.clicks || 0), 0), icon: MousePointer2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    { label: 'Avg CTR', value: ads.length > 0 ? (ads.reduce((acc, ad) => acc + parseFloat(ad.stats?.ctr || 0), 0) / ads.length).toFixed(2) + '%' : '0%', icon: BarChart3, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                    { label: 'Est. Revenue', value: '₹' + ads.reduce((acc, ad) => acc + (ad.stats?.revenue || 0), 0).toLocaleString(), icon: Tag, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="card p-6 flex items-center gap-4 group hover:border-blue-500/30 transition-all cursor-default">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <stat.icon className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 uppercase">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ad List */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-slate-400" />
                        Active Campaigns
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">Campaign Info</th>
                                <th className="px-6 py-4">Targeting</th>
                                <th className="px-6 py-4">Placement</th>
                                <th className="px-6 py-4">Status / Priority</th>
                                <th className="px-6 py-4 text-right">Analytics</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading campaigns...</td></tr>
                            ) : ads.length === 0 ? (
                                <tr><td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No active campaigns found.</td></tr>
                            ) : ads.map(ad => (
                                <tr key={ad._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <img src={ad.imageDesktop} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white">{ad.title}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 truncate max-w-[150px]">{ad.redirectUrl}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 capitalize">
                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                {ad.targetRouteSource || 'All'} → {ad.targetRouteDestination || 'All'}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                {ad.targetDevice === 'Desktop' ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                                                {ad.targetDevice} • {ad.targetUserType} Users
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{ad.position.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <Tag className="h-3 w-3" /> {ad.adType}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${getStatusColor(ad.status)}`}>
                                                {ad.status}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${getPriorityColor(ad.priority)}`}>
                                                {ad.priority}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-900 dark:text-white">{ad.stats?.impressions} Views</span>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{ad.stats?.ctr} CTR</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => { setEditingAd(ad); setFormData({ ...ad }); setShowModal(true); }}
                                                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ad._id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
                                <Plus className="h-6 w-6 text-blue-500" />
                                {editingAd ? 'Edit Campaign' : 'New Ad Campaign'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full text-slate-400 shadow-sm transition-all hover:rotate-90">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Megaphone className="h-3 w-3" /> Basic Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Campaign Title</label>
                                            <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Holiday Sale 2024" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Redirect URL</label>
                                            <input required value={formData.redirectUrl} onChange={e => setFormData({ ...formData, redirectUrl: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="https://example.com/promo" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Start Date</label>
                                                <input type="date" required value={formData.startDate.split('T')[0]} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">End Date</label>
                                                <input type="date" required value={formData.endDate.split('T')[0]} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 pt-4">
                                        <Monitor className="h-3 w-3" /> Visual Assets & Content
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Desktop Banner URL</label>
                                                <input required value={formData.imageDesktop} onChange={e => setFormData({ ...formData, imageDesktop: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Mobile Banner URL</label>
                                                <input required value={formData.imageMobile} onChange={e => setFormData({ ...formData, imageMobile: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Banner Subtitle (Season)</label>
                                                <input value={formData.subTitle} onChange={e => setFormData({ ...formData, subTitle: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="e.g. SUMMER OFFER 2026" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Offer Text (Main)</label>
                                                <input value={formData.offerText} onChange={e => setFormData({ ...formData, offerText: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="e.g. FLAT ₹120 OFF" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Display Coupon Code</label>
                                                <input value={formData.couponCode} onChange={e => setFormData({ ...formData, couponCode: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="e.g. SUMMER2024" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">CTA Button Text</label>
                                                <input value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="Book Now" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Targeting & Logic */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Target className="h-3 w-3" /> Audience Targeting
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Source City</label>
                                            <input value={formData.targetRouteSource} onChange={e => setFormData({ ...formData, targetRouteSource: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="e.g. Pune" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Destination City</label>
                                            <input value={formData.targetRouteDestination} onChange={e => setFormData({ ...formData, targetRouteDestination: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all" placeholder="e.g. Latur" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Device Type</label>
                                            <select value={formData.targetDevice} onChange={e => setFormData({ ...formData, targetDevice: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all">
                                                <option value="All">All Devices</option>
                                                <option value="Desktop">Desktop Only</option>
                                                <option value="Mobile">Mobile Only</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">User Segment</label>
                                            <select value={formData.targetUserType} onChange={e => setFormData({ ...formData, targetUserType: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all">
                                                <option value="All">All Users</option>
                                                <option value="New">New Only</option>
                                                <option value="Returning">Returning Only</option>
                                            </select>
                                        </div>
                                    </div>

                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 pt-4">
                                        <BarChart3 className="h-3 w-3" /> Delivery Logic
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Priority</label>
                                            <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all">
                                                <option value="High">High (Max Rotation)</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Low">Low</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Placement</label>
                                            <select value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 transition-all">
                                                <option value="HomepageTop">Homepage Carousel</option>
                                                <option value="SearchTop">Search Results Top</option>
                                                <option value="SearchInline">Search Inline (Gap)</option>
                                                <option value="GlobalPopup">Global Popup</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-end gap-4 border-t border-slate-100 dark:border-slate-800 pt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
                                    {editingAd ? 'Update Campaign' : 'Launch Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvertisementView;
