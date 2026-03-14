import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRightLeft, Users, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchWidget = ({ setSearchParams }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [fromCity, setFromCity] = useState('Pune');
    const [toCity, setToCity] = useState('Mumbai');
    const [date, setDate] = useState('20-02-2026');

    const handleSearch = () => {
        if (setSearchParams) {
            setSearchParams({ fromCity, toCity, date });
        }
        navigate('/bus-results');
    };

    const swapCities = () => {
        setFromCity(toCity);
        setToCity(fromCity);
    };

    return (
        <div className="w-full flex-col">
            {/* Form Fields Row */}
            <div className="flex flex-col lg:flex-row w-full shadow-2xl rounded-md">

                {/* From & To (Combined block with divider/swap) */}
                <div className="flex lg:w-[45%] relative bg-white border-r border-[#e5e7eb] rounded-t-md lg:rounded-tr-none lg:rounded-l-md">
                    {/* From */}
                    <div className="flex-1 flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-semibold text-gray-500">From City</span>
                            <input
                                type="text"
                                value={fromCity}
                                onChange={(e) => setFromCity(e.target.value)}
                                className="bg-transparent border-none outline-none text-[13px] font-semibold text-gray-700 w-full"
                                placeholder="Departure City"
                            />
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>

                    {/* Swap Button */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <div onClick={swapCities} className="bg-black rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors shadow-md">
                            <ArrowRightLeft className="h-3 w-3 text-white" />
                        </div>
                    </div>

                    <div className="w-px bg-gray-300 h-10 my-auto"></div>

                    {/* To */}
                    <div className="flex-1 flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 pl-6">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                        <div className="flex flex-col flex-1">
                            <span className="text-sm font-semibold text-gray-500">To City</span>
                            <input
                                type="text"
                                value={toCity}
                                onChange={(e) => setToCity(e.target.value)}
                                className="bg-transparent border-none outline-none text-[13px] font-semibold text-gray-700 w-full"
                                placeholder="Destination City"
                            />
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                    </div>
                </div>

                {/* Date of Journey */}
                <div className="flex lg:w-[25%] border-r border-[#e5e7eb] bg-white">
                    <div className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 flex-1 border-r border-gray-200">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 mb-0.5">Date of Journey</span>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-[13px] font-semibold text-gray-700 w-full"
                            />
                        </div>
                    </div>
                </div>

                {/* Passengers/Seats optional column, keeping format consistent */}
                <div className="flex lg:w-[15%] bg-white items-center px-4 py-3 cursor-pointer hover:bg-gray-50">
                    <Users className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
                    <div className="flex flex-col flex-1 max-w-full overflow-hidden">
                        <span className="text-[10px] text-gray-500 mb-0.5">Passengers</span>
                        <span className="text-[13px] font-semibold text-gray-700 truncate">1 Seat</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="bg-[#f26a36] hover:bg-[#e05d2e] text-white px-8 py-4 lg:py-0 font-bold text-[13px] tracking-widest transition-colors flex items-center justify-center min-w-[140px] rounded-b-md lg:rounded-bl-none lg:rounded-r-md flex-1"
                >
                    SEARCH
                </button>
            </div>
        </div>
    );
};

export default SearchWidget;
