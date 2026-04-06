import React from 'react';
import { Megaphone, Mail, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Press = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 text-[#f26a36] py-2 px-4 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6">
                        <Megaphone className="h-4 w-4" />
                        <span>Press & Media</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        GoAirClass in the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">Headlines</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Read recent announcements, media features, and download brand assets for press coverage.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700">
                    
                    {/* Left: Press Releases */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 border-b border-slate-200 pb-4">Latest Press Releases</h2>
                        
                        <div className="space-y-6">
                            {[
                                { date: "Mar 01, 2026", title: "GoAirClass Hits Milestone: 5 Million Active Users on App", source: "Company Announcement" },
                                { date: "Feb 15, 2026", title: "Partnership with State Roadways to Digitize Rural Bus Bookings", source: "Press Release" },
                                { date: "Jan 10, 2026", title: "GoAirClass Raises Series C Funding Led by Global Travel Fund", source: "Financial News" },
                                { date: "Dec 05, 2025", title: "Launch of Industry-First 100% Instant Refund Feature", source: "Product Update" },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#f26a36]/30 shadow-sm hover:shadow-md transition-all group">
                                    <div className="text-xs font-bold uppercase tracking-widest text-[#f26a36] mb-2">{item.date}</div>
                                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-3 group-hover:text-[#f26a36] transition-colors">{item.title}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-400">{item.source}</span>
                                        <Link to="#" className="text-slate-400 group-hover:text-[#f26a36] transition-colors">
                                            <ExternalLink className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Media Kit & Contact */}
                    <div className="w-full lg:w-[350px] shrink-0 space-y-8">
                        
                        {/* Media Kit */}
                        <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl p-8 relative overflow-hidden text-center shadow-lg border border-slate-800">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f26a36] rounded-full blur-[60px] opacity-20" />
                            <h3 className="text-xl font-black text-white relative z-10 mb-2">Media Kit</h3>
                            <p className="text-slate-400 text-sm font-medium mb-6 relative z-10">Download our official logos, brand guidelines, and executive headshots.</p>
                            <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl py-3 font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 relative z-10">
                                <Download className="h-4 w-4" /> Download Assets (.zip)
                            </button>
                        </div>

                        {/* Press Contact */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
                            <div className="bg-blue-50 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 mb-2">Press Inquiries</h3>
                            <p className="text-slate-500 text-sm font-medium mb-4">For all media and press related inquiries, please contact our PR team.</p>
                            <a href="mailto:press@goairclass.com" className="text-[#f26a36] font-black text-lg hover:underline transition-all">
                                press@goairclass.com
                            </a>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Press;
