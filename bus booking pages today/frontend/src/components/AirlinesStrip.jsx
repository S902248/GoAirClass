import React from 'react';

const AirlinesStrip = () => {
    const airlines = [
        { name: "IndiGo", logo: "https://upload.wikimedia.org/wikipedia/en/a/af/IndiGo_Airlines_logo.svg" },
        { name: "Air India", logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Air_India_logo.svg" },
        { name: "Akasa Air", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Akasa_Air_Logo.svg" },
        { name: "SpiceJet", logo: "https://upload.wikimedia.org/wikipedia/en/e/e3/SpiceJet_logo.svg" },
        { name: "Vistara", logo: "https://upload.wikimedia.org/wikipedia/en/c/c8/Vistara_logo.svg" },
        { name: "Air India Express", logo: "https://upload.wikimedia.org/wikipedia/en/a/a2/Air_India_Express_2023_logo.png" }
    ];

    // Double the array for seamless marquee
    const marqueeAirlines = [...airlines, ...airlines];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Top/Bottom Fade Effect */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-gray-50 to-transparent z-10" />

            <div className="max-w-7xl mx-auto px-8 mb-16">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-1 w-12 bg-blue-600 rounded-full mb-2" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Partnering Excellence</h3>
                    <h2 className="text-3xl md:text-5xl font-black text-deep-navy tracking-tight max-w-2xl px-4">
                        Fly with India's Most <span className="text-blue-600 italic">Trusted</span> Carriers
                    </h2>
                </div>
            </div>

            <div className="relative flex overflow-hidden group">
                {/* Horizontal Fade Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                <div className="flex animate-marquee group-hover:pause-marquee py-12">
                    {marqueeAirlines.map((airline, index) => (
                        <div key={index} className="flex items-center justify-center px-16 group/logo">
                            <div className="relative h-12 md:h-16 w-32 md:w-48 grayscale opacity-40 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-700 bg-white shadow-sm p-4 rounded-2xl border border-gray-50 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-2">
                                <img
                                    src={airline.logo}
                                    alt={airline.name}
                                    className="h-full w-full object-contain"
                                    onError={(e) => { e.target.parentElement.innerHTML = `<span class="font-black text-gray-300 text-xl tracking-tighter">${airline.name}</span>`; }}
                                />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/5 group-hover/logo:ring-blue-600/20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
                .pause-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default AirlinesStrip;
