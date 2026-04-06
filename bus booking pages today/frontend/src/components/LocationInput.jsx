import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search } from 'lucide-react';

const LocationInput = ({ value, onChange, placeholder, label }) => {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        const apiKey = "AIzaSyBUfh9lqcFGgqNMC7FCyfvaEL8h9USr8vk";
        const scriptId = "google-maps-script-autocomplete";

        const checkPlacesReady = () => {
            if (window.google?.maps?.places) {
                setScriptLoaded(true);
                return true;
            }
            return false;
        };

        if (checkPlacesReady()) return;

        // Check if ANY google maps script is already loading or loaded
        const scripts = document.querySelectorAll('script');
        let scriptExists = false;
        scripts.forEach(s => {
            if (s.src && s.src.includes('maps.googleapis.com/maps/api/js')) {
                scriptExists = true;
            }
        });

        if (!scriptExists) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        // Poll until ready, regardless of how it was loaded
        const interval = setInterval(() => {
            if (checkPlacesReady()) {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scriptLoaded && inputRef.current && !autocompleteRef.current) {
            if (!window.google?.maps?.places) {
                console.warn("Google Maps Places library not loaded yet");
                return;
            }

            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['geocode', 'establishment'],
                componentRestrictions: { country: 'IN' }
            });

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace();
                if (place.geometry) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    const name = place.formatted_address || place.name;

                    onChange({
                        location: name,
                        lat,
                        lng
                    });
                }
            });
        }
    }, [scriptLoaded, onChange]);

    return (
        <div className="space-y-1.5 w-full">
            {label && <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block px-1">{label}</label>}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#d84e55] transition-colors" />
                <input
                    ref={inputRef}
                    type="text"
                    required
                    placeholder={placeholder || "Search location..."}
                    defaultValue={value}
                    className="w-full bg-gray-50 border-none rounded-xl py-4 pl-12 pr-6 text-xs font-bold focus:ring-4 focus:ring-red-100 outline-none transition-all"
                />
            </div>
        </div>
    );
};

export default LocationInput;
