import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Hotel, MapPin, Star, Plus, X, UploadCloud, ImagePlus } from 'lucide-react';
import { addHotel, getHotelById, updateHotel } from '../../api/operatorApi';
import { useHotelOperator } from '../HotelOperatorContext';

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const RegisterHotel = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const { hasPerm } = useHotelOperator();
    const fileInputRef = useRef(null);

    // Permissions check
    if (!hasPerm('AddHotel') && !hasPerm('ManageHotels')) {
        return <div className="p-8 text-center text-red-500 font-bold">Access Denied: You do not have permission to manage hotels.</div>;
    }

    const [form, setForm] = useState({
        hotelName: '', city: '', address: '', description: '', starRating: 3, amenities: [],
        latitude: '', longitude: ''
    });
    const [amenity, setAmenity] = useState('');
    const [loading, setLoading] = useState(false);

    // Each entry: { file: File, preview: objectURL }
    const [selectedImages, setSelectedImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [dragOver, setDragOver] = useState(false);

    // ── Fetch for Edit ────────────────────────────────────────────────────────
    useEffect(() => {
        if (isEdit) {
            const fetchHotel = async () => {
                try {
                    setLoading(true);
                    const res = await getHotelById(id);
                    if (res.hotel) {
                        const h = res.hotel;
                        setForm({
                            hotelName: h.hotelName || '',
                            city: h.city || '',
                            address: h.address || '',
                            description: h.description || '',
                            starRating: h.starRating || 3,
                            amenities: h.amenities || [],
                            latitude: h.latitude || '',
                            longitude: h.longitude || ''
                        });
                        setExistingImages(h.images || []);
                    }
                } catch (err) {
                    alert('Failed to fetch hotel details');
                } finally {
                    setLoading(false);
                }
            };
            fetchHotel();
        }
    }, [id, isEdit]);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const addFiles = useCallback((files) => {
        const valid = Array.from(files).filter(f => ACCEPTED.includes(f.type));
        if (valid.length !== files.length) {
            alert('Some files were skipped. Only JPG, PNG and WEBP are supported.');
        }
        const entries = valid.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
        setSelectedImages(prev => [...prev, ...entries]);
    }, []);

    const removeImage = (idx) => {
        setSelectedImages(prev => {
            URL.revokeObjectURL(prev[idx].preview);
            return prev.filter((_, i) => i !== idx);
        });
    };

    const removeExistingImage = (url) => {
        setExistingImages(prev => prev.filter(u => u !== url));
    };

    // ── Drag & Drop handlers ───────────────────────────────────────────────────
    const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const onDragLeave = () => setDragOver(false);
    const onDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    // ── Amenities ──────────────────────────────────────────────────────────────
    const handleAddAmenity = () => {
        if (amenity.trim() && !form.amenities.includes(amenity.trim())) {
            setForm({ ...form, amenities: [...form.amenities, amenity.trim()] });
            setAmenity('');
        }
    };
    const removeAmenity = (a) => setForm({ ...form, amenities: form.amenities.filter(x => x !== a) });

    // ── Submit ─────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('hotelName', form.hotelName);
            fd.append('city', form.city);
            fd.append('address', form.address);
            fd.append('description', form.description);
            fd.append('starRating', String(form.starRating));
            fd.append('latitude', form.latitude);
            fd.append('longitude', form.longitude);
            fd.append('amenities', JSON.stringify(form.amenities));
            
            // For editing, we also might track existing images to keep
            if (isEdit) {
                fd.append('existingImages', JSON.stringify(existingImages));
            }

            selectedImages.forEach(({ file }) => fd.append('images', file));

            if (isEdit) {
                await updateHotel(id, fd);
                alert('Hotel updated successfully!');
            } else {
                await addHotel(fd);
                alert('Hotel submitted successfully. Awaiting admin approval.');
            }

            // Free object-URLs
            selectedImages.forEach(({ preview }) => URL.revokeObjectURL(preview));

            navigate('/hotel-operator/hotels');
        } catch (err) {
            alert(err?.error || (isEdit ? 'Failed to update hotel' : 'Failed to add hotel'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">
                    {isEdit ? 'Edit Hotel' : 'Add New Hotel'}
                </h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {isEdit ? 'Update your property details' : 'Submit a property for admin approval'}
                </p>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hotel Name</label>
                            <div className="relative">
                                <Hotel className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-gray-300" />
                                <input required type="text" placeholder="e.g. Grand Taj Hotel" value={form.hotelName}
                                    onChange={e => setForm({ ...form, hotelName: e.target.value })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">City</label>
                            <input required type="text" placeholder="e.g. Mumbai" value={form.city}
                                onChange={e => setForm({ ...form, city: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Star Rating</label>
                            <div className="relative">
                                <Star className="absolute top-1/2 left-4 -translate-y-1/2 h-5 w-5 text-amber-400 fill-amber-400" />
                                <select value={form.starRating} onChange={e => setForm({ ...form, starRating: Number(e.target.value) })}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all appearance-none cursor-pointer">
                                    {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} Stars</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latitude</label>
                            <input type="number" step="any" placeholder="e.g. 18.5996" value={form.latitude}
                                onChange={e => setForm({ ...form, latitude: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Longitude</label>
                            <input type="number" step="any" placeholder="e.g. 73.7769" value={form.longitude}
                                onChange={e => setForm({ ...form, longitude: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Address</label>
                        <div className="relative">
                            <MapPin className="absolute top-4 left-4 h-5 w-5 text-gray-300" />
                            <textarea required placeholder="Detailed street address" rows={2} value={form.address}
                                onChange={e => setForm({ ...form, address: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all resize-none" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                        <textarea placeholder="Tell us about the hotel..." rows={3} value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 px-4 text-sm font-medium focus:ring-4 focus:ring-fuchsia-50 focus:border-fuchsia-200 outline-none transition-all resize-none" />
                    </div>

                    {/* Amenities & Image Upload */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">

                        {/* Amenities */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amenities</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="e.g. WiFi, Pool" value={amenity}
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

                        {/* Image Upload */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hotel Images</label>

                            {/* Hidden real file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="hidden"
                                onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                            />

                            {/* Drag & Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={onDrop}
                                className={`
                                    relative flex flex-col items-center justify-center gap-2
                                    border-2 border-dashed rounded-2xl py-6 px-4 cursor-pointer
                                    transition-all duration-200 select-none
                                    ${dragOver
                                        ? 'border-fuchsia-400 bg-fuchsia-50 shadow-lg shadow-fuchsia-100 scale-[1.01]'
                                        : 'border-gray-200 bg-gray-50 hover:border-fuchsia-300 hover:bg-fuchsia-50/40'
                                    }
                                `}
                            >
                                <div className={`p-3 rounded-xl transition-colors ${dragOver ? 'bg-fuchsia-100' : 'bg-white shadow-sm'}`}>
                                    <UploadCloud className={`h-7 w-7 transition-colors ${dragOver ? 'text-fuchsia-500' : 'text-gray-400'}`} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-gray-600">
                                        {dragOver ? 'Drop images here!' : 'Drag & drop or click to upload'}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wide">
                                        JPG, PNG, WEBP · Max 10 MB each
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1 px-4 py-1.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md shadow-fuchsia-200">
                                    <ImagePlus className="h-3 w-3" />
                                    Select Files
                                </div>
                            </div>

                            {/* Existing Images (for edit mode) */}
                            {isEdit && existingImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        Current Images ({existingImages.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {existingImages.map((url, idx) => (
                                            <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-105">
                                                <img src={url} alt="Hotel" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(url)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Preview Thumbnails (for new files) */}
                            {selectedImages.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                        New Images ({selectedImages.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedImages.map(({ preview, file }, idx) => (
                                            <div
                                                key={idx}
                                                className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                                                title={file.name}
                                            >
                                                <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                                                {/* Remove overlay */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                                {/* Tiny remove badge always visible */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex justify-end">
                        <button type="submit" disabled={loading}
                            className="px-8 py-4 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-fuchsia-200 disabled:opacity-50">
                            {loading ? 'Processing...' : isEdit ? 'Update Hotel' : 'Submit Hotel'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default RegisterHotel;
