import React, { useState, useEffect } from 'react';
import { getActiveBanners, recordImpression, recordClick } from '../api/bannerApi';
import { X, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GlobalBanner = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await getActiveBanners();
                if (res.data.success && res.data.banners.length > 0) {
                    
                    // Filter out banners closed in this session (optional, but good for UX)
                    const activeBanners = res.data.banners.filter(b => !sessionStorage.getItem(`seen_banner_${b._id}`));
                    
                    if (activeBanners.length > 0) {
                        setBanners(activeBanners);
                        setTimeout(() => setIsVisible(true), 1500);
                        
                        // Record impression for the first banner
                        recordImpression(activeBanners[0]._id).catch(e => console.error(e));
                    }
                }
            } catch (err) {
                console.error("Error fetching global banners", err);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => {
                    const nextIndex = (prev + 1) % banners.length;
                    // Record impression when rotating to a new banner
                    if (banners[nextIndex]) {
                        recordImpression(banners[nextIndex]._id).catch(e => console.error(e));
                    }
                    return nextIndex;
                });
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [banners]);

    const handleClose = (bannerId) => {
        setIsVisible(false);
        // Mark all current banners in rotation as seen so they don't pop up again this session
        banners.forEach(b => sessionStorage.setItem(`seen_banner_${b._id}`, 'true'));
        // Wait for fade out animation before fully removing from DOM
        setTimeout(() => setBanners([]), 500); 
    };

    const currentBanner = banners[currentIndex];

    const handleAction = () => {
        if (!currentBanner) return;
        
        // Record click
        recordClick(currentBanner._id).catch(console.error);
        
        banners.forEach(b => sessionStorage.setItem(`seen_banner_${b._id}`, 'true'));
        
        if (currentBanner.redirectUrl) {
            if (currentBanner.redirectUrl.startsWith('http')) {
                window.open(currentBanner.redirectUrl, '_blank');
            } else {
                navigate(currentBanner.redirectUrl);
            }
        }
        
        handleClose(currentBanner._id);
    };

    const copyCouponCode = (e) => {
        e.stopPropagation();
        if (currentBanner?.couponCode) {
            navigator.clipboard.writeText(currentBanner.couponCode);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    if (!currentBanner) return null;

    if (currentBanner.showType === 'popup') {
        return (
            <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 backdrop-blur-sm bg-slate-900/60' : 'opacity-0 pointer-events-none'}`}>
                <div 
                    className={`relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 ease-out transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-12'}`}
                >
                    {/* Close Button */}
                    <button 
                        onClick={() => handleClose(currentBanner._id)}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Image Area */}
                    <div className="relative aspect-[16/9] w-full cursor-pointer group" onClick={handleAction}>
                        <img 
                            src={currentBanner.imageUrl} 
                            alt={currentBanner.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-2 leading-tight drop-shadow-lg tracking-tight">
                                {currentBanner.title}
                            </h2>
                            {currentBanner.offerText && (
                                <p className="text-rose-400 font-black text-xl sm:text-3xl drop-shadow-md mb-6">
                                    {currentBanner.offerText}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4">
                                {currentBanner.couponCode && (
                                    <button 
                                        onClick={copyCouponCode}
                                        className="flex items-center gap-3 bg-white/10 backdrop-blur-md border-2 border-dashed border-white/40 hover:bg-white/20 hover:border-white/60 text-white px-6 py-4 rounded-2xl transition-all"
                                    >
                                        <div>
                                            <p className="text-xs font-bold text-white/70 uppercase tracking-widest text-left mb-0.5">Use Code</p>
                                            <p className="text-xl font-black tracking-wider">{currentBanner.couponCode}</p>
                                        </div>
                                        <div className="bg-white/20 p-2 rounded-xl">
                                            {isCopied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                                        </div>
                                    </button>
                                )}
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleAction(); }}
                                    className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-5 rounded-2xl text-lg sm:text-xl font-black w-max shadow-2xl shadow-rose-600/40 transition-all active:scale-95 hover:-translate-y-1"
                                >
                                    {currentBanner.buttonText || 'Book Now'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Inline Banner (example fallback, though mostly we use Popup per requirements)
    if (currentBanner.showType === 'inline') {
        return (
            <div className={`w-full bg-slate-900 overflow-hidden relative cursor-pointer group transition-all duration-500 ${isVisible ? 'opacity-100 h-16 sm:h-20' : 'opacity-0 h-0 pointer-events-none'}`} onClick={handleAction}>
                <div className="absolute inset-0">
                    <img src={currentBanner.imageUrl} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt=""/>
                </div>
                <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-md hidden sm:block">Limited Offer</span>
                        <p className="text-white font-bold text-sm sm:text-base">
                            <span className="hidden sm:inline">{currentBanner.title} - </span>
                            <span className="text-rose-400">{currentBanner.offerText}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={(e) => { e.stopPropagation(); handleAction(); }} className="text-xs sm:text-sm font-bold bg-white text-slate-900 px-4 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                            {currentBanner.buttonText || 'Claim Now'}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleClose(currentBanner._id); }} className="text-white/60 hover:text-white p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default GlobalBanner;
