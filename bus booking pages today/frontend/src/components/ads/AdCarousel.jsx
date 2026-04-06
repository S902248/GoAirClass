import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ExternalLink, Info } from 'lucide-react';
import PremiumAdBanner from './PremiumAdBanner';

const AdCarousel = ({ position = 'HomepageTop', source = '', destination = '' }) => {
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const observerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        fetchAds();
    }, [source, destination]);

    useEffect(() => {
        if (ads.length > 1) {
            startTimer();
        }
        return () => stopTimer();
    }, [ads]);
    const fetchAds = async () => {
        try {
            const device = window.innerWidth < 768 ? 'Mobile' : 'Desktop';
            const res = await axios.get(`/api/ads?position=${position}&source=${source}&destination=${destination}&device=${device}`);
            if (res.data.success && res.data.ads.length > 0) {
                setAds(res.data.ads);
            }
        } catch (err) {
            console.error("Error fetching ads", err);
        } finally {
            setLoading(false);
        }
    };

    const startTimer = () => {
        stopTimer();
        timerRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % ads.length);
        }, 5000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const trackEvent = async (adId, eventType) => {
        try {
            const device = window.innerWidth < 768 ? 'Mobile' : 'Desktop';
            await axios.post('/api/ads/event', { adId, eventType, device });
        } catch (err) {
            console.error("Error tracking ad event", err);
        }
    };

    // Impression tracking using Intersection Observer
    const adRef = useRef(null);
    useEffect(() => {
        if (ads.length > 0 && ads[currentIndex]) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    trackEvent(ads[currentIndex]._id, 'View');
                    observer.disconnect();
                }
            }, { threshold: 0.5 });

            if (adRef.current) observer.observe(adRef.current);
            return () => observer.disconnect();
        }
    }, [currentIndex, ads]);

    const currentAd = ads[currentIndex];
    if (!currentAd) return null;

    return (
        <div className="relative group w-full overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800 shadow-xl border border-white/20" ref={adRef}>
            <a
                href={currentAd.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent(currentAd._id, 'Click')}
                className="block aspect-[21/9] md:aspect-[3/1] relative overflow-hidden"
            >
                {currentAd.offerText || currentAd.subTitle ? (
                    <PremiumAdBanner key={currentAd._id} ad={currentAd} />
                ) : (
                    <>
                        <img
                            src={window.innerWidth < 768 ? currentAd.imageMobile : currentAd.imageDesktop}
                            alt={currentAd.title}
                            className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
                        />

                        {/* Overlay Text (Legacy) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-10">
                            <h3 className="text-white text-xl md:text-3xl font-black tracking-tight">{currentAd.title}</h3>
                            {currentAd.description && (
                                <p className="text-white/80 text-sm md:text-lg font-medium mt-1 max-w-xl line-clamp-2">{currentAd.description}</p>
                            )}
                        </div>

                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white/60 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-white/10">
                            Sponsored
                        </div>
                    </>
                )}
            </a>

            {/* Controls */}
            {ads.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(prev => (prev - 1 + ads.length) % ads.length); startTimer(); }}
                        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/40 backdrop-blur-md rounded-full text-white opacity-60 group-hover:opacity-100 transition-all hover:bg-black/60 shadow-xl border border-white/20 z-[100]"
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(prev => (prev + 1) % ads.length); startTimer(); }}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/40 backdrop-blur-md rounded-full text-white opacity-60 group-hover:opacity-100 transition-all hover:bg-black/60 shadow-xl border border-white/20 z-[100]"
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[100] bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                        {ads.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(i); startTimer(); }}
                                className={`h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-6 shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/50 w-2 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AdCarousel;
