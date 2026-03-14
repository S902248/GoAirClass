import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Send, ShieldCheck, Zap, Headphones, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerLinks = [
        {
            title: "Book with Us",
            links: [
                { label: "Bus Tickets", path: "/" },
                { label: "Flight Booking", path: "/flights" },
                { label: "Train Booking", path: "/trains" },
                { label: "Hotel Booking", path: "/hotels" },
                { label: "Track Ticket", path: "/track-ticket" }
            ]
        },
        {
            title: "Help & Support",
            links: [
                { label: "Help Center", path: "/support" },
                { label: "Cancel Ticket", path: "/cancel" },
                { label: "Change Bus Date", path: "/change-date" },
                { label: "Offers", path: "/offers" },
                { label: "Contact Us", path: "/contact" }
            ]
        },
        {
            title: "Legal",
            links: [
                { label: "Terms & Conditions", path: "/legal/terms" },
                { label: "Privacy Policy", path: "/legal/privacy" },
                { label: "Cookie Policy", path: "/legal/cookies" },
                { label: "Disclaimer", path: "/legal/disclaimer" }
            ]
        }
    ];

    return (
        <footer className="bg-deep-navy pt-24 pb-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d84e55]/30 to-transparent" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d84e55]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                {/* Newsletter & Highlight Strip */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 items-center">
                    <div className="lg:col-span-2">
                        <h3 className="text-3xl font-black text-white tracking-tight mb-4">
                            Stay ahead of the curve with <span className="text-[#d84e55]">Ixigo</span>
                        </h3>
                        <p className="text-gray-400 font-bold mb-8 max-w-xl">
                            Subscribe to our newsletter for exclusive travel deals, booking tips, and premium offers delivered straight to your inbox.
                        </p>
                        <div className="relative max-w-lg group">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white font-bold placeholder:text-gray-500 focus:outline-none focus:border-[#d84e55] focus:ring-4 focus:ring-[#d84e55]/10 transition-all"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-[#d84e55] text-white px-8 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#c13e44] hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-red-500/20">
                                <span>Subscribe</span>
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#d84e55]/20 p-3 rounded-xl">
                                <Headphones className="h-5 w-5 text-[#d84e55]" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">24x7 Support</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Dedicated travel assistance</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-500/20 p-3 rounded-xl">
                                <Zap className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Instant Refunds</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Fastest processing in India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
                    {/* Brand Meta Column */}
                    <div className="col-span-2 lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#d84e55] to-[#f43f5e] rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform">
                                <Globe className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter italic">
                                GOAIR<span className="text-[#d84e55]">CLASS</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
                            Ixigo is India's leading travel app & website, helping 50 million+ travelers plan their trips across trains, flights, buses & hotels.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-[#d84e55] hover:text-white transition-all border border-white/5 group hover:scale-110">
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.path} className="text-gray-500 text-sm font-bold hover:text-[#d84e55] transition-colors flex items-center gap-2 group">
                                            <div className="w-0 h-px bg-[#d84e55] group-hover:w-3 transition-all" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex gap-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <span>© 2026 Goairclass Ltd.</span>
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="h-3 w-3 text-green-500" />
                            PCI DSS Certified
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Visa_2021.svg/512px-Visa_2021.svg.png" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/512px-Mastercard-logo.svg.png" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Mastercard" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/512px-UPI-Logo-vector.svg.png" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="UPI" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
