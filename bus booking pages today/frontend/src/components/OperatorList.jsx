import React from 'react';
import { useLocation } from 'react-router-dom';

const Marquee = ({ children, reverse, className = "" }) => {
    return (
        <div className={`flex w-full overflow-hidden group ${className}`} style={{ "--gap": "2rem" }}>
            <div className={`flex shrink-0 justify-around gap-[var(--gap)] min-w-full ${reverse ? 'animate-[marquee-reverse_60s_linear_infinite]' : 'animate-[marquee_60s_linear_infinite]'} group-hover:[animation-play-state:paused]`}>
                {children}
            </div>
            <div className={`flex shrink-0 justify-around gap-[var(--gap)] min-w-full ${reverse ? 'animate-[marquee-reverse_60s_linear_infinite]' : 'animate-[marquee_60s_linear_infinite]'} group-hover:[animation-play-state:paused]`}>
                {children}
            </div>
        </div>
    );
};

const OperatorList = () => {
    const location = useLocation();

    if (location.pathname !== '/') return null;

    const operators = [
        "SRS Travels", "Evacay Bus", "Kallada Travels", "KPN Travels", "Orange Travels", "Parveen Travels", "Rajdhani Express", "VRL Travels", "Chartered Speed Bus", "Bengal Tiger",
        "SRM Travels", "Infant Jesus", "Patel Travels", "JBT Travels", "Shatabdi Travels", "Eagle Travels", "Kanker Roadways", "Komitla", "Sri Krishna Travels", "Humsafar Travels",
        "Mahasagar Travels", "Raj Express", "Sharma Travels", "Shrinath Travels", "Universal Travels", "Verma Travels", "Gujarat Travels", "Madurai Radha Travels",
        "Patel Tours and Travels", "Paulo Travels", "Royal Travels", "Amarnath Travels", "Vaibhav Travels", "Ganesh Travels", "Jabbar Travels", "Jain Travels", "Manish Travels",
        "Pradhan Travels", "YBM Travels", "Hebron Transports", "Mahalaxmi travels", "MR Travels", "Vivegam Travels", "VST Travels", "Jakhar Travels", "Kaleswari Travels",
        "Mahendra Travels", "Neeta Tours and Travels", "Yamani Travels", "Arthi Travels"
    ];

    const firstRow = operators.slice(0, operators.length / 2);
    const secondRow = operators.slice(operators.length / 2);

    return (
        <section className="py-24 bg-deep-navy overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 mb-12 text-center">
                <h2 className="text-3xl font-black text-white tracking-tight mb-4">
                    Trusted by <span className="text-radiant-coral">2500+</span> Bus Operators
                </h2>
                <p className="text-white/30 font-bold uppercase tracking-[0.3em] text-[10px]">
                    Seamless Connectivity Across India
                </p>
            </div>

            <div className="relative flex flex-col gap-8 w-full">
                <div className="relative isolate z-10 w-full [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                    <Marquee className="py-2">
                        {firstRow.map((op, i) => (
                            <div key={i} className="flex items-center justify-center px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300">
                                <span className="text-[13px] font-black text-white/40 group-hover:text-radiant-coral transition-colors tracking-wider uppercase">
                                    {op}
                                </span>
                            </div>
                        ))}
                    </Marquee>
                </div>

                <div className="relative isolate z-10 w-full [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                    <Marquee reverse className="py-2">
                        {secondRow.map((op, i) => (
                            <div key={i} className="flex items-center justify-center px-10 py-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300">
                                <span className="text-[13px] font-black text-white/40 group-hover:text-radiant-coral transition-colors tracking-wider uppercase">
                                    {op}
                                </span>
                            </div>
                        ))}
                    </Marquee>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-b from-transparent via-white/5 to-transparent -z-10 pointer-events-none" />
            </div>
        </section>
    );
};

export default OperatorList;
