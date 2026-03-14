import React from 'react';

const OperatorLogos = () => {
    const operators = [
        { name: "FlixBus", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e9/FlixBus_logo.svg" },
        { name: "ZingBus", logo: "https://www.zingbus.com/static/media/zingbus_logo.67d66866.svg" },
        { name: "Shyamoli", logo: "https://shyamoliparibahan.com/assets/images/logo.png" },
        { name: "GreenLine", logo: "https://www.greenlinebd.com/images/logo.png" },
        { name: "VRL", logo: "https://www.vrlbus.in/vrlbus_static/images/VRL_logo.png" }
    ];

    return (
        <section className="py-10 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center space-y-2 mb-6">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Top Partners
                    </h3>
                    <h2 className="text-xl font-black text-deep-navy">1500+ Bus Operators Trusted Us</h2>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-700">
                    {operators.map((op, index) => (
                        <div key={index} className="h-8 md:h-12 w-auto flex items-center justify-center group">
                            <img
                                src={op.logo}
                                alt={op.name}
                                className="h-full w-auto object-contain group-hover:scale-110 transition-transform"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                            />
                            <span className="hidden font-black text-gray-300 text-xl tracking-tighter">{op.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OperatorLogos;
