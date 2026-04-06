import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Globe, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-8 relative overflow-hidden font-sans border-t border-slate-800">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#f26a36]/5 blur-[120px] rounded-full pointer-events-none -ml-32 -mb-32" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* SECTION 1 — Newsletter / CTA */}
                <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-8 md:p-12 rounded-[32px] border border-white/5 shadow-2xl mb-16 relative overflow-hidden group">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 flex-wrap lg:flex-nowrap">
                        <div className="w-full lg:w-1/2">
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                                Get Exclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#f26a36]">Travel Deals</span>
                            </h3>
                            <p className="text-slate-400 font-medium text-base">
                                Subscribe and receive special discounts on bus and flight tickets.
                            </p>
                        </div>
                        <div className="w-full lg:w-1/2 flex items-center max-w-lg relative group/input">
                            <div className="absolute left-6 text-slate-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-[#334155]/50 border-2 border-white/5 focus:border-[#f26a36]/50 rounded-2xl py-4 md:py-5 pl-14 pr-32 md:pr-40 text-white font-bold placeholder:text-slate-400 outline-none transition-all shadow-inner backdrop-blur-sm"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-[#f26a36] to-[#e05824] hover:to-[#f26a36] text-white px-6 md:px-8 rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(242,106,54,0.4)] hover:shadow-[0_0_30px_rgba(242,106,54,0.6)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
                                <span>Subscribe</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* SECTION 2 — Main Footer Content (Grid Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12 mb-16">
                    {/* Column 1 – Brand */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#f26a36] to-[#e05824] rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 transition-transform hover:rotate-0">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter italic">
                                GOAIR<span className="text-[#f26a36]">CLASS</span>
                            </span>
                        </div>
                        <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
                            GoAirClass is India's smart travel booking platform for bus, flight and train tickets.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" }
                            ].map((social, i) => (
                                <a key={i} href={social.href} className="w-10 h-10 bg-white/5 hover:bg-[#f26a36] rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 shadow-sm border border-white/5 hover:scale-110">
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2 – Company */}
                    <div>
                        <h4 className="text-[15px] font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#f26a36]" />
                            Company
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Careers', path: '/careers' },
                                { name: 'Blog', path: '/blog' },
                                { name: 'Press', path: '/press' },
                                { name: 'Contact', path: '/contact' }
                            ].map(l => (
                                <li key={l.name}><Link to={l.path} className="text-[14px] text-slate-400 font-medium hover:text-[#f26a36] hover:translate-x-1 transition-all inline-flex items-center gap-2 group"><ChevronRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#f26a36]" /> {l.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 – Travel Services */}
                    <div>
                        <h4 className="text-[15px] font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#f26a36]" />
                            Services
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Bus Booking', path: '/' },
                                { name: 'Flight Booking', path: '/flights' },
                                { name: 'Train Booking', path: '/trains' },
                                { name: 'Hotel Booking', path: '/hotels' }
                            ].map(l => (
                                <li key={l.name}><Link to={l.path} className="text-[14px] text-slate-400 font-medium hover:text-[#f26a36] hover:translate-x-1 transition-all inline-flex items-center gap-2 group"><ChevronRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#f26a36]" /> {l.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4 – Support */}
                    <div>
                        <h4 className="text-[15px] font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#f26a36]" />
                            Support
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Help Center', path: '/support' },
                                { name: 'Track Ticket', path: '/track-ticket' },
                                { name: 'Refund Policy', path: '/refund-policy' },
                                { name: 'Cancellation Policy', path: '/cancellation-policy' },
                                { name: 'Customer Support', path: '/support' }
                            ].map(l => (
                                <li key={l.name}><Link to={l.path} className="text-[14px] text-slate-400 font-medium hover:text-[#f26a36] hover:translate-x-1 transition-all inline-flex items-center gap-2 group"><ChevronRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#f26a36]" /> {l.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5 – Download App */}
                    <div className="lg:col-span-1">
                        <h4 className="text-[15px] font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#f26a36]" />
                            Download App
                        </h4>
                        <div className="flex flex-col gap-3">
                            <button className="bg-white/5 hover:bg-[#f26a36] backdrop-blur-sm border border-white/10 hover:border-[#f26a36]/50 rounded-xl p-3 flex flex-row items-center justify-start gap-4 transition-all group shadow-sm w-[160px]">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_Arrow_logo.svg/512px-Google_Play_Arrow_logo.svg.png" alt="Google Play" className="h-6 w-6 object-contain" />
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-300 group-hover:text-white font-bold uppercase tracking-wider mb-0.5 leading-none transition-colors">Get it on</p>
                                    <p className="text-[14px] text-white font-black leading-none">Google Play</p>
                                </div>
                            </button>
                            <button className="bg-white/5 hover:bg-[#f26a36] backdrop-blur-sm border border-white/10 hover:border-[#f26a36]/50 rounded-xl p-3 flex flex-row items-center justify-start gap-4 transition-all group shadow-sm w-[160px]">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/512px-App_Store_%28iOS%29.svg.png" alt="App Store" className="h-6 w-6 object-contain filter invert transition-all" />
                                <div className="text-left">
                                    <p className="text-[10px] text-slate-300 group-hover:text-white font-bold uppercase tracking-wider mb-0.5 leading-none transition-colors">Download on the</p>
                                    <p className="text-[14px] text-white font-black leading-none">App Store</p>
                                </div>
                            </button>
                            <p className="text-[12px] text-slate-500 font-medium mt-3 leading-relaxed">Book tickets faster with our mobile app</p>
                        </div>
                    </div>
                </div>

                {/* SECTION 3 — Popular Routes Section */}
                <div className="border-t border-white/5 pt-10 pb-10">
                    <h4 className="text-[13px] font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> Popular Routes
                    </h4>
                    <div className="flex flex-wrap gap-3">
                        {[
                            'Pune → Mumbai',
                            'Delhi → Jaipur',
                            'Bangalore → Chennai',
                            'Hyderabad → Goa',
                            'Mumbai → Ahmedabad',
                        ].map(route => (
                            <Link key={route} to="#" className="px-4 py-2 bg-white/5 hover:bg-[#f26a36]/10 border border-white/5 hover:border-[#f26a36]/50 shadow-sm text-[13px] font-medium text-slate-300 hover:text-white rounded-full transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap">
                                {route}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* SECTION 4 — Bottom Footer Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-[13px] font-medium text-slate-400">
                        © 2025 GoAirClass. All Rights Reserved
                    </div>
                    <div className="flex flex-wrap justify-center gap-6 text-[13px] font-medium">
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="#" className="text-slate-400 hover:text-white transition-colors">Cookies Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
