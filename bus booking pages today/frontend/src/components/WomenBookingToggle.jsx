import React from 'react';

const WomenBookingToggle = ({ womenBooking, setWomenBooking }) => {
    return (
        <div
            className="flex lg:w-1/4 bg-transparent border-t lg:border-t-0 border-slate-100 items-center px-6 py-5 cursor-pointer hover:bg-slate-50/80 transition-colors group"
            onClick={() => setWomenBooking(!womenBooking)}
        >
            <div className="flex flex-col flex-1 max-w-full overflow-hidden">
                <span className="text-[15px] font-bold text-slate-800 truncate">Booking for women</span>
                <p
                    className="text-[11px] font-bold text-[#108ece] hover:underline cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        // Optional: Add "Know more" modal or tooltip logic here
                    }}
                >
                    Know more
                </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer ml-4" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={womenBooking}
                    onChange={() => setWomenBooking(!womenBooking)}
                />
                <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D84E55]"></div>
            </label>
        </div>
    );
};

export default WomenBookingToggle;
