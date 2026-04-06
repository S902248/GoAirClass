import React from 'react';
import { ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';

const PremiumAdBanner = ({ ad }) => {
    const [copied, setCopied] = React.useState(false);

    if (!ad) return null;

    const {
        title,
        subTitle,
        offerText,
        couponCode,
        buttonText = 'Book Now',
        imageDesktop,
        imageMobile,
        targetRouteSource,
        targetRouteDestination,
        targetUserType,
        redirectUrl
    } = ad;

    const isMobile = window.innerWidth < 768;
    const displayImage = isMobile ? imageMobile : imageDesktop;

    const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (couponCode) {
            navigator.clipboard.writeText(couponCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleBannerClick = () => {
        if(redirectUrl) {
            window.open(redirectUrl, '_blank');
        }
    };

    return (
        <div 
            className="relative w-full overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-r from-[#1e1c6b] to-[#2b2585] shadow-xl flex flex-col group cursor-pointer transition-transform hover:-translate-y-1"
            onClick={handleBannerClick}
        >
            {/* Main Content Area */}
            <div className="flex justify-between items-stretch min-h-[14rem] md:min-h-[16rem]">
                
                {/* Left Side: Offers & Text */}
                <div className="p-5 md:p-8 flex-1 flex flex-col justify-center relative z-10">
                    {/* Sponsored Pill */}
                    <div className="bg-black/30 w-fit px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold text-white/80 uppercase tracking-widest mb-3 md:mb-4 border border-white/5">
                        Sponsored
                    </div>

                    {/* SubTitle / Title */}
                    <h3 className="text-[#FBBF24] font-black text-lg md:text-2xl uppercase tracking-wide mb-1 drop-shadow-sm">
                        {subTitle || title}
                    </h3>

                    {/* Main Offer Text */}
                    <h2 className="text-white font-black text-3xl md:text-5xl uppercase tracking-tighter mb-4 md:mb-6 leading-none drop-shadow-md">
                        {offerText}
                    </h2>

                    {/* Coupon Code Block */}
                    {couponCode && (
                        <div 
                            onClick={handleCopy}
                            className="flex items-center gap-2 bg-[#F5B82E] hover:bg-[#e0a728] w-fit px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-colors border-2 border-transparent hover:border-white/20"
                        >
                            <span className="text-slate-900 font-bold text-sm md:text-lg">
                                Use code <span className="font-black">{couponCode}</span>
                            </span>
                            {copied ? (
                                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-700 ml-1" />
                            ) : (
                                <Copy className="h-4 w-4 md:h-5 md:w-5 text-slate-800 ml-1 opacity-70" />
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side: Image + Book Now Badge */}
                <div className="relative w-1/2 md:w-2/5 flex-shrink-0">
                    {/* Fade Gradient to blend image seamlessly into the blue background */}
                    <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#211e74] to-transparent z-10" />
                    
                    {displayImage && (
                        <img 
                            src={displayImage} 
                            alt={title} 
                            className="w-full h-full object-cover object-left md:object-right absolute inset-0 opacity-90 transition-opacity group-hover:opacity-100"
                        />
                    )}

                    {/* Book Now Button Floating */}
                    <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
                        <button className="bg-[#6633cc] hover:bg-[#5229a3] border-2 border-white/40 text-white font-black text-sm md:text-base px-5 py-2 md:px-7 md:py-2.5 rounded-[1.25rem] shadow-2xl transition-transform transform group-hover:scale-105 active:scale-95">
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Marketing Strip */}
            <div className="bg-gradient-to-r from-white to-blue-50 px-5 py-2.5 text-slate-600 text-[10px] md:text-xs font-bold flex items-center justify-start z-10 border-t border-white/20">
                <span className="tracking-wide text-slate-500">
                    Exclusive for <span className="text-slate-800">{targetRouteSource || 'Any'}</span> &larr;&rarr; <span className="text-slate-800">{targetRouteDestination || 'Any'}</span> route
                </span>
                <span className="mx-2 font-black text-slate-300">•</span>
                <span className="tracking-wide text-slate-800">{targetUserType === 'New' ? 'New App users' : (targetUserType || 'All users')}</span>
            </div>
        </div>
    );
};

export default PremiumAdBanner;
