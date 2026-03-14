import React from 'react';
import { ShieldCheck, Clock, Award, Headphones, Percent, Smartphone } from 'lucide-react';

const WhyChoose = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: "Safe and Hygienic",
            desc: "Every bus is disinfected and sanitized before every trip.",
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            icon: Clock,
            title: "On Time Service",
            desc: "We take pride in our punctuality and reliable bus schedules.",
            color: "text-amber-500",
            bgColor: "bg-amber-50"
        },
        {
            icon: Award,
            title: "Premium Fleet",
            desc: "Travel in modern buses with world-class amenities.",
            color: "text-red-500",
            bgColor: "bg-red-50"
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            desc: "Dedicated customer service team for all your queries.",
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        },
        {
            icon: Percent,
            title: "Best Offers",
            desc: "Guaranteed lowest prices and exclusive app discounts.",
            color: "text-green-500",
            bgColor: "bg-green-50"
        },
        {
            icon: Smartphone,
            title: "Easy Booking",
            desc: "Book your tickets in under 30 seconds with our app.",
            color: "text-rose-500",
            bgColor: "bg-rose-50"
        }
    ];

    return (
        <section className="py-8 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center space-y-2 mb-8 animate-fade-in-up">
                    <h2 className="text-2xl md:text-3xl font-black text-deep-navy tracking-tight">
                        Why Choose <span className="text-radiant-coral">GoAirClass</span>?
                    </h2>
                    <p className="text-gray-400 font-bold text-[11px] max-w-lg mx-auto leading-relaxed">
                        We are committed to providing the best bus travel experience
                        with safety, comfort, and reliability at the core of everything we do.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card !p-4 group cursor-default animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="go-corner !w-8 !h-8">
                                <div className="go-arrow !text-xs">→</div>
                            </div>
                            <div className="space-y-3">
                                <div className="feature-icon-container bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                    <feature.icon className="feature-icon h-5 w-5 text-radiant-coral" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="feature-title text-[13px] font-black text-deep-navy uppercase tracking-tight group-hover:text-white transition-colors">
                                        {feature.title}
                                    </h4>
                                    <p className="feature-desc text-gray-400 text-[10px] font-bold leading-normal group-hover:text-white/80 transition-colors line-clamp-2">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
