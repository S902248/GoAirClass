import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, Users, Hash, Plus, X, UploadCloud, Info } from 'lucide-react';
import { addRoom, getMyHotelsForDropdown } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';

const AddRoom = () => {
    const navigate = useNavigate();
    const { hasPerm } = useHotelOperator();

    if (!hasPerm('AddRooms')) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied: You do not have permission to add rooms.</div>;
    }

    const [hotels, setHotels] = useState([]);
    const [form, setForm] = useState({
        hotelId: '', roomType: 'Standard', pricePerNight: '',
        originalPrice: '', discountPrice: '',
        capacity: 2, totalRooms: 1,
        size: '', bedType: '', view: '',
        amenities: [], images: [], status: 'available'
    });

    const [amenity, setAmenity] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMyHotelsForDropdown().then(d => {
            const h = d.hotels || [];
            setHotels(h);
            if (h.length > 0) setForm(f => ({ ...f, hotelId: h[0]._id }));
        });
    }, []);

    const handleAddAmenity = () => {
        if (amenity.trim() && !form.amenities.includes(amenity.trim())) {
            setForm({ ...form, amenities: [...form.amenities, amenity.trim()] });
            setAmenity('');
        }
    };

    const handleAddImage = () => {
        if (image.trim() && !form.images.includes(image.trim())) {
            setForm({ ...form, images: [...form.images, image.trim()] });
            setImage('');
        }
    };

    const removeAmenity = (a) => setForm({ ...form, amenities: form.amenities.filter(x => x !== a) });
    const removeImage = (i) => setForm({ ...form, images: form.images.filter(x => x !== i) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.hotelId) return alert('Please select a hotel first.');
        setLoading(true);
        try {
            await addRoom(form);
            alert('Room added successfully to inventory.');
            navigate('/hotel-operator/rooms');
        } catch (err) {
            alert(err?.error || 'Failed to add room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Add New Room</h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Expand your hotel's inventory</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Hotel Selection */}
                    <div className="space-y-1.5 pb-6 border-b border-gray-50">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Hotel</label>
                        <select required value={form.hotelId} onChange={e => setForm({ ...form, hotelId: e.target.value })}
                            className="w-full bg-fuchsia-50 border-2 border-fuchsia-100/50 rounded-2xl py-4 px-4 text-sm font-black text-fuchsia-900 focus:ring-4 focus:ring-fuchsia-100 outline-none transition-all appearance-none cursor-pointer">
                            {hotels.length === 0 && <option value="">No hotels available</option>}
                            {hotels.map(h => <option key={h._id} value={h._id}>{h.hotelName} ({h.city}) — {h.status}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5 lg:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Type</label>
                            <div className="relative">
                                <BedDouble className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <select required value={form.roomType}
                                    onChange={e => setForm({ ...form, roomType: e.target.value })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all appearance-none cursor-pointer">
                                    {['Standard', 'Deluxe', 'Suite', 'Executive', 'Family', 'Single', 'Double'].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price / Night (₹)</label>
                            <input required type="number" min="0" placeholder="e.g. 5000" value={form.pricePerNight}
                                onChange={e => setForm({ ...form, pricePerNight: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-black text-gray-800 focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original Price (₹)</label>
                            <input type="number" min="0" placeholder="e.g. 6000" value={form.originalPrice}
                                onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-black text-gray-800 focus:ring-4 focus:ring-fuchsia-100 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount Price (₹)</label>
                            <input type="number" min="0" placeholder="e.g. 5000" value={form.discountPrice}
                                onChange={e => setForm({ ...form, discountPrice: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-black text-gray-800 focus:ring-4 focus:ring-fuchsia-100 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Users className="h-3 w-3" /> Capacity</label>
                            <input required type="number" min="1" placeholder="Guests" value={form.capacity}
                                onChange={e => setForm({ ...form, capacity: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Hash className="h-3 w-3" /> Total Rooms</label>
                            <input required type="number" min="1" placeholder="Quantity" value={form.totalRooms}
                                onChange={e => setForm({ ...form, totalRooms: Number(e.target.value) })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                            <div className="flex items-start gap-2 p-3 bg-fuchsia-50/50 rounded-xl border border-fuchsia-100 mt-2">
                                <Info className="h-3 w-3 text-fuchsia-400 mt-0.5" />
                                <p className="text-[10px] font-bold text-fuchsia-700 leading-tight uppercase tracking-wider">
                                    System will automatically generate {form.totalRooms || 1} unique room numbers (e.g. {form.roomType === 'Family' ? 'FR' : form.roomType === 'Standard' ? 'ST' : 'RM'}-101) in your inventory.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Size (sq.ft)</label>
                            <input type="text" placeholder="e.g. 250 sq.ft" value={form.size}
                                onChange={e => setForm({ ...form, size: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bed Type</label>
                            <input type="text" placeholder="e.g. King Bed" value={form.bedType}
                                onChange={e => setForm({ ...form, bedType: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">View</label>
                            <input type="text" placeholder="e.g. City View" value={form.view}
                                onChange={e => setForm({ ...form, view: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>
                    </div>


                    {/* Arrays: Amenities & Images */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        {/* Amenities */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Amenities</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="e.g. Mini Bar, Balcony" value={amenity}
                                    onChange={e => setAmenity(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                                    className="flex-1 bg-gray-50 border border-transparent rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-fuchsia-100 outline-none" />
                                <button type="button" onClick={handleAddAmenity} className="p-2 bg-fuchsia-50 text-fuchsia-600 rounded-xl hover:bg-fuchsia-100 transition-colors"><Plus className="h-5 w-5" /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.amenities.map(a => (
                                    <span key={a} className="pl-3 pr-1 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase flex items-center gap-1">
                                        {a}
                                        <button type="button" onClick={() => removeAmenity(a)} className="p-1 hover:bg-gray-200 rounded-full"><X className="h-3 w-3" /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Room Images (URLs)</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <UploadCloud className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input type="url" placeholder="https://..." value={image}
                                        onChange={e => setImage(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                                        className="w-full bg-gray-50 border border-transparent rounded-xl py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-fuchsia-100 outline-none" />
                                </div>
                                <button type="button" onClick={handleAddImage} className="p-2 bg-fuchsia-50 text-fuchsia-600 rounded-xl hover:bg-fuchsia-100 transition-colors"><Plus className="h-5 w-5" /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.images.map((img, i) => (
                                    <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(img)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="h-5 w-5" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                        <button type="submit" disabled={loading || !form.hotelId}
                            className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-fuchsia-200 disabled:opacity-50 disabled:active:scale-100">
                            {loading ? 'Submitting...' : 'Add Room'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddRoom;
