import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 text-[#f26a36] py-2 px-4 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6">
                        <MessageSquare className="h-4 w-4" />
                        <span>Get in Touch</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        We're Here to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">Help You</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Have a question about your booking, a partnership inquiry, or just want to say hello? Reach out to our 24/7 support team.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700">
                    
                    {/* Contact Form Details (Left) */}
                    <div className="w-full lg:w-[400px] shrink-0 space-y-6">
                        
                        {/* Box 1 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className="bg-[#f26a36]/10 text-[#f26a36] p-4 rounded-2xl shrink-0">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-1">Call Us</h3>
                                <p className="text-slate-500 font-medium text-sm mb-2">Mon-Sun • 24 Hours</p>
                                <a href="tel:18004129000" className="text-[#f26a36] font-bold text-lg hover:underline transition-all">
                                    1800-412-9000
                                </a>
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className="bg-blue-50 text-blue-500 p-4 rounded-2xl shrink-0">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-1">Email Us</h3>
                                <p className="text-slate-500 font-medium text-sm mb-2">We reply within 12 hours</p>
                                <a href="mailto:support@goairclass.com" className="text-blue-500 font-bold hover:underline transition-all">
                                    support@goairclass.com
                                </a>
                            </div>
                        </div>

                        {/* Box 3 */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex items-start gap-4">
                            <div className="bg-emerald-50 text-emerald-500 p-4 rounded-2xl shrink-0">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 mb-1">Headquarters</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                                    GoAirClass Tech Tower, <br />
                                    Baner IT Park, Pune, <br />
                                    Maharashtra 411045, India
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Contact Form (Right) */}
                    <div className="flex-1 bg-white rounded-3xl p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f26a36] rounded-full blur-[100px] opacity-[0.03] pointer-events-none" />
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-8 relative z-10">Send us a message</h2>
                        
                        <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter your name"
                                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#f26a36] hover:border-slate-300 rounded-xl px-4 py-3.5 outline-none font-bold text-slate-800 transition-colors shadow-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email"
                                        className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#f26a36] hover:border-slate-300 rounded-xl px-4 py-3.5 outline-none font-bold text-slate-800 transition-colors shadow-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subject / Intent</label>
                                <select className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#f26a36] hover:border-slate-300 rounded-xl px-4 py-3.5 outline-none font-bold text-slate-800 transition-colors shadow-sm cursor-pointer appearance-none">
                                    <option>General Inquiry</option>
                                    <option>Booking Issue</option>
                                    <option>Refund / Cancellation</option>
                                    <option>Partnership Request</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                                <textarea 
                                    placeholder="How can we help you?"
                                    rows="5"
                                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#f26a36] hover:border-slate-300 rounded-xl px-4 py-3.5 outline-none font-bold text-slate-800 transition-colors shadow-sm resize-none"
                                />
                            </div>

                            <button className="w-full py-4 bg-gradient-to-r from-[#f26a36] to-[#ff8c5a] hover:to-[#f26a36] text-white rounded-xl font-black text-sm tracking-widest uppercase shadow-lg shadow-[#f26a36]/20 transition-all flex items-center justify-center gap-2 group">
                                Send Message <Send className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
