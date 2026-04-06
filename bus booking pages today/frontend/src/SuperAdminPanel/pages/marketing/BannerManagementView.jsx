import React, { useState, useEffect } from 'react';
import {
    Plus, Megaphone, Target, BarChart3, Clock, Eye, MousePointer2,
    MoreVertical, Trash2, Edit2, CheckCircle, XCircle, ChevronRight,
    Layers, Monitor, Smartphone, MapPin, Tag, Calendar, Image as ImageIcon,
    AlertCircle
} from 'lucide-react';
import { getAllBannersAdmin, createBanner, updateBanner, deleteBanner, toggleBannerActive } from '../../../api/bannerApi';

const BannerManagementView = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [formData, setFormData] = useState({
        title: '',
        offerText: '',
        couponCode: '',
        buttonText: 'Book Now',
        redirectUrl: '/',
        isActive: true,
        showType: 'popup',
        priority: 1,
        expiryDate: '',
        image: null
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const res = await getAllBannersAdmin();
            if (res.data.success) {
                setBanners(res.data.banners);
            }
        } catch (err) {
            console.error("Error fetching banners", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('offerText', formData.offerText);
            submitData.append('couponCode', formData.couponCode);
            submitData.append('buttonText', formData.buttonText);
            submitData.append('redirectUrl', formData.redirectUrl);
            submitData.append('isActive', formData.isActive);
            submitData.append('showType', formData.showType);
            submitData.append('priority', formData.priority);
            submitData.append('expiryDate', formData.expiryDate);
            
            if (formData.image instanceof File) {
                submitData.append('image', formData.image);
            }

            if (editingBanner) {
                await updateBanner(editingBanner._id, submitData);
            } else {
                await createBanner(submitData);
            }
            
            setShowModal(false);
            setEditingBanner(null);
            resetForm();
            fetchBanners();
        } catch (err) {
            console.error('Error saving banner:', err);
            alert("Error saving banner. Please ensure you attached an image if creating a new banner.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await deleteBanner(id);
            fetchBanners();
        } catch (err) {
            alert("Error deleting banner");
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await toggleBannerActive(id);
            fetchBanners();
        } catch (err) {
            alert("Error toggling banner status");
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            offerText: '',
            couponCode: '',
            buttonText: 'Book Now',
            redirectUrl: '/',
            isActive: true,
            showType: 'popup',
            priority: 1,
            expiryDate: '',
            image: null
        });
        setImagePreview(null);
    };

    const openEditModal = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            offerText: banner.offerText || '',
            couponCode: banner.couponCode || '',
            buttonText: banner.buttonText || 'Book Now',
            redirectUrl: banner.redirectUrl || '/',
            isActive: banner.isActive,
            showType: banner.showType || 'popup',
            priority: banner.priority || 1,
            expiryDate: banner.expiryDate ? new Date(banner.expiryDate).toISOString().split('T')[0] : '',
            image: null // We don't load the file back, just the URL preview
        });
        setImagePreview(banner.imageUrl);
        setShowModal(true);
    };

    const isExpired = (dateString) => {
        return new Date(dateString) < new Date();
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            {/* Header section with modern bold styling */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                        <ImageIcon className="h-8 w-8 text-rose-500" />
                        Promotional Banners
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage homepage global promotional popups and inline banners.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus className="h-5 w-5" />
                    Create Banner
                </button>
            </div>

            {/* Banners List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Layers className="h-5 w-5 text-slate-400" />
                        All Banners
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/80 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Preview &amp; Title</th>
                                <th className="px-6 py-4">Display Setting</th>
                                <th className="px-6 py-4">Status &amp; Priority</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {loading ? (
                                <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading banners...</td></tr>
                            ) : banners.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="mx-auto flex flex-col items-center">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                                <ImageIcon className="h-8 w-8 text-slate-300" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No promotional banners exist.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : banners.map(banner => {
                                const expired = isExpired(banner.expiryDate);
                                return (
                                    <tr key={banner._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm relative group">
                                                    <img src={banner.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Banner" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white capitalize truncate max-w-[200px]">{banner.title}</p>
                                                    <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Exp: {new Date(banner.expiryDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white capitalize">
                                                    {banner.showType === 'popup' ? <Monitor className="w-4 h-4 text-blue-500" /> : <Layers className="w-4 h-4 text-amber-500" />}
                                                    {banner.showType}
                                                </span>
                                                <span className="text-xs text-slate-500 truncate max-w-[150px] hover:text-blue-500 cursor-help" title={banner.redirectUrl}>
                                                    {banner.redirectUrl}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleActive(banner._id)}
                                                    className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                                                        !banner.isActive ? 'bg-slate-100 text-slate-500 dark:bg-slate-800' :
                                                        expired ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20' :
                                                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                    }`}
                                                >
                                                    {expired && banner.isActive ? 'Expired' : banner.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300" title="Priority level (Higher shows first)">
                                                    {banner.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                    <span className="font-bold text-slate-700 dark:text-slate-200">{banner.analytics?.impressions || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <MousePointer2 className="w-3.5 h-3.5" />
                                                    <span>{banner.analytics?.clicks || 0} clicks</span>
                                                    <span className="font-bold text-emerald-500 ml-1">({banner.analytics?.ctr || '0%'})</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(banner)}
                                                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg text-blue-500 transition-colors shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner._id)}
                                                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-rose-500 transition-colors shadow-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Creation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {editingBanner ? <Edit2 className="h-5 w-5 text-rose-500" /> : <Plus className="h-5 w-5 text-rose-500" />}
                                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-all">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grow custom-scrollbar space-y-6">
                            
                            {/* Image Upload section */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Banner Image <span className="text-rose-500">*</span></label>
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative cursor-pointer group">
                                    <input 
                                        type="file" 
                                        onChange={handleImageChange} 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        accept="image/*"
                                        required={!editingBanner} 
                                    />
                                    {imagePreview ? (
                                        <div className="relative h-48 w-full rounded-xl overflow-hidden">
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview"/>
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white font-bold flex items-center gap-2"><Edit2 className="w-4 h-4"/> Click to change image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-slate-400 group-hover:text-rose-500 transition-colors">
                                            <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
                                            <p className="font-semibold">Drag & Drop or Click to Upload</p>
                                            <p className="text-xs mt-1 opacity-75">1920x1080px WebP or JPG recommended</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                        Content Details
                                    </h3>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Title / Name *</label>
                                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Diwali Super Saver" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Offer Highlight Text</label>
                                        <input value={formData.offerText} onChange={e => setFormData({ ...formData, offerText: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/50" placeholder="e.g. Extra 20% Off Using AXIS20" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Coupon Code</label>
                                        <input value={formData.couponCode} onChange={e => setFormData({ ...formData, couponCode: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/50 uppercase" placeholder="e.g. SUMMER20" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Button Text</label>
                                            <input value={formData.buttonText} onChange={e => setFormData({ ...formData, buttonText: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/50" placeholder="Book Now" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Expiry Date *</label>
                                            <input type="date" required value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/50 text-slate-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Target URL (Redirect on click) *</label>
                                        <input required value={formData.redirectUrl} onChange={e => setFormData({ ...formData, redirectUrl: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/50" placeholder="https://..." />
                                    </div>
                                </div>

                                {/* Configuration */}
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                        Configuration Logic
                                    </h3>
                                    
                                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                        <input 
                                            type="checkbox" 
                                            id="isActiveToggle" 
                                            checked={formData.isActive}
                                            onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                            className="w-5 h-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                                        />
                                        <label htmlFor="isActiveToggle" className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer select-none">
                                            Banner is Active
                                        </label>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block flex items-center gap-1.5">
                                            Display Style <AlertCircle className="w-3 h-3"/>
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div 
                                                onClick={() => setFormData({...formData, showType: 'popup'})}
                                                className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${formData.showType === 'popup' ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600' : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            >
                                                <Monitor className="w-5 h-5 mx-auto mb-1 opacity-70"/>
                                                <p className="text-xs font-bold uppercase tracking-wide">Modal Popup</p>
                                            </div>
                                            <div 
                                                onClick={() => setFormData({...formData, showType: 'inline'})}
                                                className={`p-3 rounded-xl border-2 cursor-pointer text-center transition-all ${formData.showType === 'inline' ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600' : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                            >
                                                <Layers className="w-5 h-5 mx-auto mb-1 opacity-70"/>
                                                <p className="text-xs font-bold uppercase tracking-wide">Inline Block</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                                            Priority Weight (1-100)
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="range" 
                                                min="1" max="100" 
                                                value={formData.priority} 
                                                onChange={e => setFormData({ ...formData, priority: e.target.value })} 
                                                className="w-full accent-rose-500" 
                                            />
                                            <span className="w-12 text-center p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm font-bold">
                                                {formData.priority}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-1">Higher number = shows first if multiple active banners</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                                <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-rose-500/20 transition-transform active:scale-95">
                                    {editingBanner ? 'Save Changes' : 'Launch Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManagementView;
