import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, ArrowLeft, Save, X, Wifi, Battery, Coffee, Wind, Upload, CheckCircle2 } from 'lucide-react';
import { createBus } from '../../api/busApi';
import SeatLayoutPreview from '../components/SeatLayoutPreview';

const AddBus = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        busName: '',
        busNumber: '',
        busType: 'Seater',
        totalSeats: 40,
        amenities: [],
        status: 'Active',
        seatLayout: []
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const amenitiesList = [
        { id: 'AC', icon: Wind, label: 'Air Conditioning' },
        { id: 'Wifi', icon: Wifi, label: 'Free Wifi' },
        { id: 'Charging', icon: Battery, label: 'Charging Point' },
        { id: 'Blanket', icon: Coffee, label: 'Blanket/Pillow' }
    ];

    const handleAmenityToggle = (id) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(id)
                ? prev.amenities.filter(a => a !== id)
                : [...prev.amenities, id]
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + files.length > 6) {
            alert("Maximum 6 images allowed");
            return;
        }

        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);

        // Clear input value to allow re-selecting same file
        e.target.value = null;
    };

    const removeImage = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const generateLayout = (type, total) => {
        const layout = [];
        const seats = parseInt(total) || 0;

        if (type === 'Seater') {
            for (let i = 1; i <= seats; i++) {
                layout.push({ seatNo: i.toString(), type: 'seater', deck: 'lower' });
            }
        } else if (type === 'Sleeper') {
            const perDeck = Math.ceil(seats / 2);
            for (let i = 1; i <= perDeck; i++) {
                layout.push({ seatNo: `L${i}`, type: 'sleeper', deck: 'lower' });
            }
            for (let i = 1; i <= (seats - perDeck); i++) {
                layout.push({ seatNo: `U${i}`, type: 'sleeper', deck: 'upper' });
            }
        } else if (type === 'Sleeper + Seater') {
            const seaterCount = Math.floor(seats / 2);
            const sleeperCount = seats - seaterCount;
            const sleeperPerDeck = Math.ceil(sleeperCount / 2);

            for (let i = 1; i <= seaterCount; i++) {
                layout.push({ seatNo: `S${i}`, type: 'seater', deck: 'lower' });
            }
            for (let i = 1; i <= sleeperPerDeck; i++) {
                layout.push({ seatNo: `L${i}`, type: 'sleeper', deck: 'lower' });
            }
            for (let i = 1; i <= (sleeperCount - sleeperPerDeck); i++) {
                layout.push({ seatNo: `U${i}`, type: 'sleeper', deck: 'upper' });
            }
        }
        return layout;
    };

    React.useEffect(() => {
        setFormData(prev => ({
            ...prev,
            seatLayout: generateLayout(prev.busType, prev.totalSeats)
        }));
    }, [formData.busType, formData.totalSeats]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const submitData = new FormData();
            submitData.append('busName', formData.busName);
            submitData.append('busNumber', formData.busNumber);
            submitData.append('busType', formData.busType);
            submitData.append('totalSeats', formData.totalSeats);
            submitData.append('amenities', JSON.stringify(formData.amenities));
            submitData.append('seatLayout', JSON.stringify(formData.seatLayout));

            selectedFiles.forEach(file => {
                submitData.append('images', file);
            });

            await createBus(submitData);
            navigate('/operator/buses');
        } catch (err) {
            alert(err.error || 'Failed to add bus');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/operator/buses')}
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-deep-navy uppercase tracking-tight">Register New Bus</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Add a new vehicle to your digital fleet</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/operator/buses')}
                        className="px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-gray-400 hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-3 bg-[#d84e55] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-red-500/10 active:scale-95 disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Bus'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50 space-y-10">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                                    <Bus className="h-5 w-5 text-[#d84e55]" />
                                </div>
                                <h3 className="text-lg font-black text-deep-navy uppercase tracking-tight">Basic Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Bus Name"
                                    value={formData.busName}
                                    onChange={v => setFormData({ ...formData, busName: v })}
                                    placeholder="e.g. Scania Touring HD"
                                />
                                <FormInput
                                    label="Bus Number (Plate)"
                                    value={formData.busNumber}
                                    onChange={v => setFormData({ ...formData, busNumber: v })}
                                    placeholder="e.g. DL-01-AB-1234"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Bus Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Seater', 'Sleeper', 'Sleeper + Seater'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, busType: type })}
                                                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${formData.busType === type
                                                    ? 'border-[#d84e55] bg-red-50 text-[#d84e55]'
                                                    : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                                                    }`}
                                            >
                                                {type === 'Sleeper + Seater' ? 'Hybrid' : type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <FormInput
                                    label="Total Seats"
                                    type="number"
                                    value={formData.totalSeats}
                                    onChange={v => setFormData({ ...formData, totalSeats: v })}
                                    placeholder="40"
                                />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-black text-deep-navy uppercase tracking-tight">Amenities & Facilities</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {amenitiesList.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleAmenityToggle(item.id)}
                                        className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${formData.amenities.includes(item.id)
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-500/10'
                                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100'
                                            }`}
                                    >
                                        <item.icon className={`h-6 w-6 ${formData.amenities.includes(item.id) ? 'animate-bounce' : ''}`} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.1em]">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Upload className="h-5 w-5 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-black text-deep-navy uppercase tracking-tight">Vehicle Image</h3>
                            </div>

                            {/* Image Grid Previews */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                    {previews.map((url, index) => (
                                        <div key={index} className="relative group aspect-video rounded-3xl overflow-hidden shadow-lg border-2 border-slate-50">
                                            <img src={url} alt="Bus Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#d84e55]"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Image {index + 1}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {previews.length < 6 && (
                                        <label htmlFor="bus-image-upload" className="border-4 border-dashed border-gray-50 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-blue-100 transition-all cursor-pointer bg-gray-50/30 group aspect-video">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
                                                <Upload className="h-5 w-5 text-blue-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add More</span>
                                        </label>
                                    )}
                                </div>
                            )}

                            {previews.length === 0 && (
                                <label htmlFor="bus-image-upload" className="border-4 border-dashed border-gray-50 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-4 hover:border-blue-100 transition-all cursor-pointer group">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-black text-deep-navy uppercase tracking-tight">Drop your bus images here</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Supports JPG, PNG up to 5MB (Max 6)</p>
                                    </div>
                                </label>
                            )}
                            <input
                                id="bus-image-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </section>
                    </div>
                </div>

                {/* Sidebar Preview */}
                <div className="space-y-8">
                    <div className="bg-[#0F172A] p-10 rounded-[3rem] shadow-2xl text-white sticky top-10">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black tracking-tight uppercase italic">Seat Layout</h3>
                            <span className="text-[10px] font-black text-[#d84e55] uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full">Preview</span>
                        </div>

                        <SeatLayoutPreview seatLayout={formData.seatLayout} busType={formData.busType} />

                        <div className="mt-10 p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-tight">Compliance Ready</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Meets safety standards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-gray-50 border-none rounded-[1.5rem] py-5 px-8 text-sm font-bold focus:ring-4 focus:ring-red-50/50 transition-all outline-none placeholder:text-gray-300"
        />
    </div>
);

export default AddBus;
