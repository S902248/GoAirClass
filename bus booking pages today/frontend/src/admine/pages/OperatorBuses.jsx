import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bus as BusIcon, Wind, Zap, Armchair } from 'lucide-react';

const OperatorBuses = () => {
    const { operatorId } = useParams();
    const navigate = useNavigate();
    const [operator, setOperator] = useState(null);
    const [buses, setBuses] = useState([]);

    useEffect(() => {
        const mockOperator = { id: operatorId, name: 'Sharma Travels', company: 'Sharma Pvt Ltd' };
        const mockBuses = [
            { id: 'BUS001', name: 'Scania Multi-Axle', number: 'KA-01-F-1234', type: 'Sleeper', totalSeats: 36, amenities: ['AC', 'WiFi', 'Charging'] },
            { id: 'BUS002', name: 'Volvo B11R', number: 'KA-01-H-5678', type: 'Seater', totalSeats: 45, amenities: ['AC', 'Charging'] },
        ];
        setOperator(mockOperator);
        setBuses(mockBuses);
    }, [operatorId]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/admine/operators')}
                    className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-red-50 hover:text-[#d84e55] transition-all shadow-sm active:scale-95 group"
                >
                    <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">{operator?.name}'s Fleet</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{operator?.company} • Total {buses.length} Buses</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {buses.map((bus) => (
                    <div key={bus.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-xl shadow-gray-200/50 space-y-6 hover:shadow-2xl transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                                <BusIcon className="h-8 w-8 text-[#d84e55]" />
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">In Service</span>
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-deep-navy uppercase tracking-tight">{bus.name}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bus.number} • {bus.type}</p>
                        </div>

                        <div className="flex gap-3">
                            {bus.amenities.map(item => (
                                <div key={item} className="p-3 bg-gray-50 rounded-xl" title={item}>
                                    {item === 'AC' && <Wind className="h-4 w-4 text-gray-400" />}
                                    {item === 'WiFi' && <Zap className="h-4 w-4 text-gray-400" />}
                                    {item === 'Charging' && <Zap className="h-4 w-4 text-gray-400" />}
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Armchair className="h-4 w-4 text-gray-300" />
                                <span className="text-xs font-black text-deep-navy">{bus.totalSeats} Seats</span>
                            </div>
                            <button className="text-[10px] font-black text-[#d84e55] uppercase tracking-widest hover:translate-x-1 transition-transform border-b-2 border-red-50 pb-1">View Schedule</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OperatorBuses;
