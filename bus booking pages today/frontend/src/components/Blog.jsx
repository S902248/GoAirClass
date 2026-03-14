import React from 'react';
import { Newspaper, ChevronRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const articles = [
        {
            title: "Top 10 Hidden Getaways in the Western Ghats for 2026",
            date: "March 12, 2026",
            author: "Travel Desk",
            category: "Destinations",
            excerpt: "Escape the city rush. We've compiled the ultimate list of unexplored, serene locations accessible via our premium bus operators.",
            img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "How to Maximize Your GoAirClass Loyalty Points",
            date: "March 08, 2026",
            author: "Finance Team",
            category: "Tips & Hacks",
            excerpt: "Learn how frequent travelers are scoring free upgrades and massive discounts by optimizing our new reward tiers.",
            img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "The Future of Intercity Bus Travel: Electric Fleet Rollout",
            date: "February 28, 2026",
            author: "Tech Insights",
            category: "Industry News",
            excerpt: "Our partner operators are introducing over 500 new electric sleeper buses this year. Here is what to expect on your next ride.",
            img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "A Complete Guide to Train Bookings During Diwali Rush",
            date: "February 15, 2026",
            author: "Support Team",
            category: "Guides",
            excerpt: "Don't get waitlisted. Follow this step-by-step masterclass on securing confirmed IRCTC tickets during peak festival seasons.",
            img: "https://images.unsplash.com/photo-1532884928231-ef40faadeaf7?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "5 Packing Hacks for Weekend Backpackers",
            date: "February 02, 2026",
            author: "Community",
            category: "Lifestyle",
            excerpt: "Pack lighter, travel farther. Our community experts share their minimalist packing secrets for spontaneous short trips.",
            img: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "Introducing New Flight Operators on GoAirClass",
            date: "January 20, 2026",
            author: "Product Team",
            category: "Announcements",
            excerpt: "We've expanded our domestic airline integrations. You can now book Akasa and Star Air directly through our platform with zero convenience fee.",
            img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 bg-[#f26a36]/10 text-[#f26a36] py-2 px-4 rounded-full text-[12px] font-bold tracking-widest uppercase mb-6">
                        <Newspaper className="h-4 w-4" />
                        <span>GoAirClass Blog</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                        Travel Insights, Guides & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f26a36] to-[#ff8c5a]">Industry News</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Read the latest travel hacks, destination guides, and product updates from the team at GoAirClass.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-12 duration-700">
                    {articles.map((article, idx) => (
                        <Link to="#" key={idx} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                            <div className="h-48 w-full overflow-hidden relative">
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#f26a36] z-10 shadow-sm">
                                    {article.category}
                                </div>
                                <img src={article.img} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                                    <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {article.date}</div>
                                    <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {article.author}</div>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight mb-3 group-hover:text-[#f26a36] transition-colors line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                    {article.excerpt}
                                </p>
                                <div className="mt-auto inline-flex items-center gap-2 text-[#f26a36] font-bold text-sm">
                                    Read Article <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center">
                    <button className="bg-white border-2 border-slate-200 hover:border-[#f26a36] hover:text-[#f26a36] text-slate-600 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-[#f26a36]/20">
                        Load More Articles
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Blog;
