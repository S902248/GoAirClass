import React, { useEffect, useRef } from 'react';
import { ShieldCheck, Clock, Award, Headphones, Percent, Smartphone } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WhyChoose = () => {
    const sectionRef = useRef(null);
    const featureRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const textElements = sectionRef.current.querySelectorAll('.animate-gsap-text');
            
            // Staggered entrance for header
            gsap.fromTo(textElements, 
                { y: 40, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 1.2, 
                    stagger: 0.2, 
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 85%",
                    }
                }
            );

            // Floating bobbing animation for each feature
            featureRefs.current.forEach((el, i) => {
                if (!el) return;
                
                // Entrance animation
                gsap.fromTo(el,
                    { y: 60, opacity: 0, scale: 0.8 },
                    {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 1.5,
                        delay: i * 0.1,
                        ease: "elastic.out(1, 0.75)",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                        },
                        onComplete: () => {
                            // After entrance, start bobbing
                            gsap.to(el, {
                                y: "-15px",
                                duration: 2 + Math.random(),
                                repeat: -1,
                                yoyo: true,
                                ease: "sine.inOut"
                            });
                        }
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: ShieldCheck,
            title: "Safe and Hygienic",
            desc: "Disinfected and sanitized before every single trip.",
            color: "from-sky-400 to-blue-600",
            blobColor: "bg-sky-500/10",
            offset: "lg:mt-0"
        },
        {
            icon: Clock,
            title: "On Time Service",
            desc: "Punctuality and reliable schedules at our core.",
            color: "from-amber-400 to-orange-500",
            blobColor: "bg-amber-500/10",
            offset: "lg:mt-24"
        },
        {
            icon: Award,
            title: "Premium Fleet",
            desc: "Modern buses equipped with world-class amenities.",
            color: "from-rose-400 to-red-600",
            blobColor: "bg-rose-500/10",
            offset: "lg:mt-12"
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            desc: "Dedicated experts available for all your queries.",
            color: "from-violet-400 to-purple-600",
            blobColor: "bg-violet-500/10",
            offset: "lg:-mt-12"
        },
        {
            icon: Percent,
            title: "Best Offers",
            desc: "Guaranteed lowest prices and exclusive deals.",
            color: "from-emerald-400 to-teal-600",
            blobColor: "bg-emerald-500/10",
            offset: "lg:mt-8"
        },
        {
            icon: Smartphone,
            title: "Easy Booking",
            desc: "Book your tickets in under 30 seconds flattened.",
            color: "from-pink-400 to-rose-600",
            blobColor: "bg-pink-500/10",
            offset: "lg:mt-20"
        }
    ];

    return (
        <section ref={sectionRef} className="py-32 bg-white relative overflow-hidden">
            {/* Ambient Background Ornaments */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-100/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-100/20 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="text-center mb-32">
                    <div className="inline-flex items-center gap-3 bg-slate-50 px-6 py-2.5 rounded-full shadow-sm border border-slate-100 mb-8 animate-gsap-text">
                        <span className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-pulse" />
                        <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400">The Standards We Set</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9] mb-10 animate-gsap-text">
                        Why Choose <br/>
                        <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">GoAirClass</span>?
                    </h2>
                    <p className="text-slate-400 font-bold text-base md:text-xl max-w-2xl mx-auto leading-relaxed uppercase tracking-tighter opacity-80 animate-gsap-text">
                        Experience a new era of bus travel where safety and luxury are redefined through innovation.
                    </p>
                </div>

                {/* Organic Mesh Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-32 gap-x-16 relative">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={el => featureRefs.current[index] = el}
                            className={`relative flex flex-col items-center text-center group ${feature.offset} z-10`}
                        >
                            {/* Organic Blob Background Layer */}
                            <div className={`absolute inset-0 ${feature.blobColor} blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 scale-150`} />
                            
                            {/* Feature Icon with Floating Shape */}
                            <div className="relative mb-12">
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 blur-2xl rounded-full scale-150 group-hover:scale-[1.8] transition-transform duration-700`} />
                                <div className={`w-32 h-32 bg-white shadow-[0_15px_45px_rgba(0,0,0,/_0.06)] rounded-[38%] flex items-center justify-center relative z-10 group-hover:rotate-[15deg] transition-transform duration-700`}>
                                    <feature.icon className="h-14 w-14 text-slate-800 group-hover:scale-110 transition-transform" />
                                </div>
                                {/* Floating Floating Particle */}
                                <div className={`absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white shadow-lg animate-bounce`} />
                            </div>

                            {/* Content Layer */}
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-4xl font-black text-slate-900 tracking-tight leading-[1] uppercase group-hover:text-blue-600 transition-colors">
                                    {feature.title.split(' ').length > 2 
                                        ? feature.title 
                                        : feature.title.split(' ').map((word, i) => (
                                            <React.Fragment key={i}>
                                                {word} {i === 0 && <br/>}
                                            </React.Fragment>
                                        ))
                                    }
                                </h4>
                                <div className={`w-14 h-1.5 mx-auto bg-gradient-to-r ${feature.color} rounded-full group-hover:w-28 transition-all duration-700`} />
                                <p className="text-slate-400 text-[12px] font-black leading-relaxed uppercase tracking-widest max-w-[220px] mx-auto group-hover:text-slate-600 transition-colors line-clamp-3">
                                    {feature.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
