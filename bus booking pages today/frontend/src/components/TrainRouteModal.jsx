import React, { useState, useEffect } from 'react';
import { X, MapPin, Clock, Train, Flag, Circle, Info, ArrowRightLeft, ChevronUp, ArrowLeft } from 'lucide-react';
import trainApi from '../api/trainApi';

const TrainRouteModal = ({ isOpen, onClose, trainId, trainName, trainNumber }) => {
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRoute = async () => {
            if (!isOpen || !trainId) return;
            setLoading(true);
            setError('');
            try {
                const res = await trainApi.getTrainRoute(trainId);
                if (res.success && res.route) {
                    setRoute(res.route);
                } else {
                    setError('Route details not available for this train.');
                }
            } catch (err) {
                console.error('Error fetching route:', err);
                setError('Failed to load route. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRoute();
    }, [isOpen, trainId]);

    if (!isOpen) return null;

    const calculateHalt = (arr, dep) => {
        if (!arr || !dep) return null;
        try {
            const [ah, am] = arr.split(':').map(Number);
            const [dh, dm] = dep.split(':').map(Number);
            const mins = (dh * 60 + dm) - (ah * 60 + am);
            return mins > 0 ? `${mins} min` : null;
        } catch (e) {
            return null;
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex flex-col font-inter bg-white animate-slide-right shadow-2xl overflow-hidden">
            {/* Header Section from Ref Screenshot 1 */}
            <div className="px-8 pt-8 pb-4 flex items-center gap-6 border-b border-slate-50">
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full transition-all group active:scale-90"
                >
                    <ArrowLeft size={28} className="text-[#343A40]" />
                </button>
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-[#343A40] tracking-tight">
                        {trainNumber || '---'} | {trainName || '---'}
                    </h2>
                    <p className="text-sm font-medium text-[#6C757D] flex items-center gap-2 mt-0.5">
                        {route?.stops?.[0]?.station?.name || '---'}
                        <span className="text-xs">→</span>
                        {route?.stops?.[route?.stops?.length - 1]?.station?.name || '---'}
                    </p>
                </div>
            </div>

            {/* Day Tab section from Ref Screenshot 2 */}
            <div className="px-10 pt-6 pb-6">
                <div className="bg-[#3D4459] text-white px-8 py-2.5 rounded-l-full inline-block shadow-[0_4px_12px_rgba(0_0_0_/_0.15)] select-none">
                    <span className="text-sm font-black tracking-wider uppercase opacity-90">Day 1</span>
                </div>
            </div>

            {/* Scrollable Timeline */}
            <div className="flex-1 overflow-y-auto custom-scrollbar-minimal px-10 pb-32">
                <div className="max-w-4xl relative">
                    {loading ? (
                        <div className="flex items-center justify-center py-40">
                            <div className="w-10 h-10 border-4 border-[#F1F3F5] border-t-rose-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="relative pt-4">
                            {/* Vertical Line - Thicker Grey */}
                            <div className="absolute left-[98px] top-6 bottom-6 w-[4px] bg-[#F1F3F5]"></div>

                            <div className="space-y-12">
                                {route.stops && route.stops.map((stop, idx) => {
                                    const isSource = stop.stopType === 'SOURCE';
                                    const isDest = stop.stopType === 'DESTINATION';
                                    const haltTime = !isSource && !isDest ? calculateHalt(stop.arrivalTime, stop.departureTime) : '0';
                                    const platform = idx % 3 + 1;

                                    return (
                                        <div key={idx} className="flex items-start group">
                                            {/* Left Info: Code & Distance */}
                                            <div className="w-[100px] flex flex-col pt-1.5 pr-4 flex-shrink-0">
                                                <span className="text-lg font-bold text-[#3D4459] leading-none mb-1">
                                                    {stop.station?.code || '---'}
                                                </span>
                                                <span className="text-xs font-medium text-slate-400">
                                                    {stop.distance || 0} kms
                                                </span>
                                            </div>

                                            {/* Timeline Marker: Red Hollow Circle */}
                                            <div className="flex flex-col items-center flex-shrink-0 z-10 px-4">
                                                <div className="w-5 h-5 rounded-full border-[3px] border-[#E74C3C] bg-white mt-1.5 shadow-sm group-hover:scale-110 transition-transform"></div>
                                            </div>

                                            {/* Station Detail Card */}
                                            <div className="flex-1 pl-4">
                                                <div className={`rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0_0_0_/_0.05)] border border-slate-100 transition-all
                                                    ${isSource ? 'bg-[#3D4459] text-white' : 'bg-[#FFF9F3]'}`}>

                                                    {/* Card Header Section */}
                                                    <div className="px-7 py-5 relative">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h4 className="text-xl font-bold uppercase tracking-tight font-outfit">
                                                                {stop.station?.name}
                                                            </h4>
                                                            <div className="bg-white/10 rounded-lg p-2 border border-white/10 relative">
                                                                <Train size={24} className={isSource ? 'text-white' : 'text-[#3D4459]/40'} />
                                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs font-semibold opacity-80">
                                                            <span>Platform {platform}</span>
                                                            <div className="flex items-center gap-1.5">
                                                                Halt <Clock size={13} className="opacity-60" /> {haltTime} min
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card Body Section with Arrival/Departure */}
                                                    <div className={`grid grid-cols-2 divide-x border-t
                                                        ${isSource ? 'bg-[#3D4459] divide-white/10 border-white/10' : 'bg-white divide-slate-100 border-slate-50'}`}>
                                                        <div className="px-7 py-5">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                                                {isSource ? 'SOURCE' : 'ARRIVAL'}
                                                            </p>
                                                            <p className="text-2xl font-black font-outfit tracking-tight">
                                                                {isSource ? (stop.departureTime || '--:--') : (stop.arrivalTime || '--:--')}
                                                            </p>
                                                        </div>
                                                        <div className="px-7 py-5">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                                                                {isDest ? 'TERMINAL' : 'DEPARTURE'}
                                                            </p>
                                                            <p className="text-2xl font-black font-outfit tracking-tight">
                                                                {isDest ? (stop.arrivalTime || '--:--') : (stop.departureTime || '--:--')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>



            {/* Custom Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-right {
                    animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .custom-scrollbar-minimal::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar-minimal::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar-minimal::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
                .custom-scrollbar-minimal::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}} />
        </div>
    );
};

export default TrainRouteModal;
