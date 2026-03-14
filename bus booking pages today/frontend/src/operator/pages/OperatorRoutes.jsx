import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Route as RouteIcon, Plus, Search, Edit, Trash2, Map, Navigation2 } from 'lucide-react';
import { getAllRoutes, deleteRoute } from '../../api/routeApi';

const OperatorRoutes = () => {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const data = await getAllRoutes();
            setRoutes(data);
        } catch (err) {
            console.error('Error fetching routes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this route permanently?')) {
            try {
                await deleteRoute(id);
                fetchRoutes();
            } catch (err) {
                alert('Failed to delete route');
            }
        }
    };

    const filteredRoutes = routes.filter(route =>
        route.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.toCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route._id.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#d84e55]"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mapping Transit Network...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">Active Routes</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Configure your primary travel paths and network</p>
                </div>
                <button
                    onClick={() => navigate('/operator/routes/create')}
                    className="flex items-center gap-3 bg-[#d84e55] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-red-500/10 active:scale-95"
                >
                    <Plus className="h-4 w-4" />
                    Create New Route
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search routes by city or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 pl-16 px-6 text-sm font-bold focus:ring-2 focus:ring-red-100 transition-all outline-none"
                    />
                </div>
                <button className="p-4 bg-gray-50 rounded-xl text-gray-400 hover:text-deep-navy transition-colors">
                    <Map className="h-5 w-5" />
                </button>
            </div>

            {/* Routes Table */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/20 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Route Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transit Metrics</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredRoutes.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-2">
                                                <RouteIcon className="h-8 w-8 text-gray-200" />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No routes found matching search</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRoutes.map((route) => (
                                    <tr key={route._id} className="hover:bg-gray-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="w-3 h-3 border-2 border-[#d84e55] rounded-full"></div>
                                                    <div className="w-0.5 h-6 bg-gray-100"></div>
                                                    <div className="w-3 h-3 bg-deep-navy rounded-full"></div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-black text-deep-navy uppercase italic">{route.fromCity}</span>
                                                        <ArrowRight className="h-3 w-3 text-gray-300" />
                                                        <span className="text-sm font-black text-deep-navy uppercase italic">{route.toCity}</span>
                                                    </div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: {route._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Navigation2 className="h-3 w-3 text-indigo-500" />
                                                    <span className="text-xs font-black text-deep-navy">{route.distance} KM</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Navigation2 className="h-3 w-3 text-orange-500 rotate-90" />
                                                    <span className="text-xs font-black text-deep-navy">{route.travelTime}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${route.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {route.status || 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="w-10 h-10 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-white hover:text-blue-500 transition-all hover:shadow-lg active:scale-95 border border-transparent hover:border-gray-100">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(route._id)}
                                                    className="w-10 h-10 bg-red-50 text-[#d84e55] rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:shadow-lg active:scale-95"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OperatorRoutes;
