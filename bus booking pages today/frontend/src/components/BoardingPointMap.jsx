import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { X, MapPin } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Component to centers map when points change
const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const BoardingPointMap = ({ isOpen, onClose, points, title, center }) => {
    if (!isOpen) return null;

    // Use first point as center if no center provided
    const mapCenter = center || (points && points.length > 0 ? [points[0].lat, points[0].lng] : [18.5204, 73.8567]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 map-modal-overlay">
            <div className="bg-white w-full max-w-5xl h-[80vh] rounded-3xl overflow-hidden relative map-container-wrapper animate-fade-in-up">

                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-[110] p-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-black text-deep-navy tracking-tight">{title || "Location Details"}</h2>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Available boarding & dropping points</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-deep-navy group"
                    >
                        <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <div className="w-full h-full pt-24">
                    <MapContainer
                        center={mapCenter}
                        zoom={13}
                        scrollWheelZoom={true}
                        className="w-full h-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <ChangeView center={mapCenter} />
                        {points && points.map((point, idx) => (
                            <Marker key={idx} position={[point.lat, point.lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className="h-3 w-3 text-radiant-coral" />
                                            <span className="font-black text-xs text-deep-navy uppercase">{point.name}</span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Sidebar overlay for point list */}
                <div className="absolute bottom-10 left-10 z-[110] w-72 bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-2xl hidden md:block">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Location List</h3>
                    <div className="space-y-4">
                        {points && points.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-3 group cursor-pointer">
                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-radiant-coral group-hover:text-white transition-all">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-deep-navy leading-tight">{point.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Boarding point</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardingPointMap;
