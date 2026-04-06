import React from 'react';
import { Briefcase, Heart, Cpu, Zap, ArrowRight } from 'lucide-react';

const Careers = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 text-[#f26a36] py-2 px-4 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6">
                        <Briefcase className="h-4 w-4" />
                        <span>Careers at GoAirClass</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        Build the Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">Travel Technology</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Join our fast-growing team of innovators, engineers, and creatives working to revolutionize how millions of people travel across borders.
                    </p>
                </div>

                {/* Culture Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-700">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <Heart className="h-10 w-10 text-rose-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">People First Culture</h3>
                        <p className="text-slate-500 text-sm font-medium">We believe our strength lies in our diversity, empathy, and collaborative spirit.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <Cpu className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Tech-Driven Innovation</h3>
                        <p className="text-slate-500 text-sm font-medium">Work with cutting-edge tech to solve complex routing and booking challenges.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <Zap className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Impact From Day One</h3>
                        <p className="text-slate-500 text-sm font-medium">Your work directly impacts the travel experiences of millions of active users.</p>
                    </div>
                </div>

                {/* Open Positions */}
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-16 duration-700">
                    <h2 className="text-2xl font-black text-slate-800 mb-8 border-b border-slate-200 pb-4">Open Roles</h2>
                    
                    <div className="space-y-4">
                        {[
                            { role: "Senior Frontend Engineer", team: "Engineering", type: "Full-Time", loc: "Remote / Pune" },
                            { role: "Product Manager - Mobile App", team: "Product", type: "Full-Time", loc: "Mumbai" },
                            { role: "UX/UI Designer", team: "Design", type: "Full-Time", loc: "Remote" },
                            { role: "Customer Experience Specialist", team: "Support", type: "Full-Time", loc: "Bangalore" },
                        ].map((job, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 hover:border-slate-300 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md group cursor-pointer">
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800 group-hover:text-[#f26a36] transition-colors">{job.role}</h4>
                                    <div className="flex gap-3 mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                                        <span>{job.team}</span> • <span>{job.type}</span> • <span>{job.loc}</span>
                                    </div>
                                </div>
                                <button className="shrink-0 w-10 h-10 bg-slate-50 group-hover:bg-[#f26a36] rounded-full flex items-center justify-center transition-colors">
                                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* General Inquiry */}
                    <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
                        <h3 className="text-lg font-bold text-blue-900 mb-2">Don't see a fit?</h3>
                        <p className="text-blue-700/80 font-medium mb-6 text-sm">We're always looking for talented individuals. Send us your resume anyway.</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-colors">
                            Submit General Application
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Careers;
