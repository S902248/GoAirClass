import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, ExternalLink } from 'lucide-react';

const AdPopup = () => {
    const [ad, setAd] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const hasShown = useRef(false);

    useEffect(() => {
        // Only show once per session ideally, but for demo we'll use a local session storage
        const shownThisSession = sessionStorage.getItem('ad_popup_shown');
        if (shownThisSession) return;

        fetchPopupAd();

        // Exit intent detection
        const handleMouseOut = (e) => {
            if (e.clientY <= 0 && !hasShown.current) {
                showPopup();
            }
        };

        // Entry delay (e.g. 10 seconds)
        const entryTimer = setTimeout(() => {
            if (!hasShown.current) showPopup();
        }, 10000);

        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mouseout', handleMouseOut);
            clearTimeout(entryTimer);
        };
    }, []);

    const fetchPopupAd = async () => {
        try {
            const device = window.innerWidth < 768 ? 'Mobile' : 'Desktop';
            const res = await axios.get(`/api/ads?position=GlobalPopup&device=${device}`);
            if (res.data.success && res.data.ads.length > 0) {
                setAd(res.data.ads[0]); // Take the top priority one
            }
        } catch (err) {
            console.error("Error fetching popup ad", err);
        }
    };

    const showPopup = () => {
        if (!ad) return;
        setIsVisible(true);
        hasShown.current = true;
        sessionStorage.setItem('ad_popup_shown', 'true');
        trackEvent(ad._id, 'View');
    };

    const trackEvent = async (adId, eventType) => {
        try {
            const device = window.innerWidth < 768 ? 'Mobile' : 'Desktop';
            await axios.post('/api/ads/event', { adId, eventType, device });
        } catch (err) {
            console.error("Error tracking ad event", err);
        }
    };

    if (!isVisible || !ad) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full transition-all hover:scale-110"
                >
                    <X className="h-5 w-5" />
                </button>

                <a
                    href={ad.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(ad._id, 'Click')}
                    className="block group"
                >
                    <div className="relative aspect-square overflow-hidden">
                        <img
                            src={window.innerWidth < 768 ? ad.imageMobile : ad.imageDesktop}
                            className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
                            alt={ad.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                            <h2 className="text-white text-3xl font-black tracking-tight leading-tight">{ad.title}</h2>
                            <p className="text-white/80 text-lg font-medium mt-2">{ad.description}</p>

                            <div className="mt-6 flex items-center gap-2 text-[#D84E55] font-black text-sm uppercase tracking-widest bg-white w-fit px-6 py-3 rounded-2xl shadow-xl transition-all group-hover:bg-[#D84E55] group-hover:text-white group-hover:-translate-y-1">
                                Book Now
                                <ExternalLink className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                </a>
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md text-white/60 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-white/10">
                    Sponsored
                </div>
            </div>
        </div>
    );
};

export default AdPopup;
