import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Cookie, AlertCircle } from 'lucide-react';

const LegalPage = () => {
    const { type } = useParams();

    const content = {
        terms: {
            title: "Terms & Conditions",
            icon: FileText,
            sections: [
                {
                    heading: "1. Acceptance of Terms",
                    body: "By accessing and using Goairclass, you agree to be bound by these Terms and Conditions. Our services include bus, flight, train, and hotel bookings. If you do not agree with any part of these terms, you must not use our services."
                },
                {
                    heading: "2. Booking Policy",
                    body: "All bookings made through our platform are subject to availability. The ticket prices shown include base fare and applicable taxes. Service fees may apply and are non-refundable in most cases."
                },
                {
                    heading: "3. User Conduct",
                    body: "Users must provide accurate information during booking. Any fraudulent activity or misuse of the platform will result in immediate termination of access and potential legal action."
                }
            ]
        },
        privacy: {
            title: "Privacy Policy",
            icon: Shield,
            sections: [
                {
                    heading: "Data Collection",
                    body: "We collect personal information such as name, email, and phone number to process your bookings. We also collect usage data to improve our services and provide a better user experience."
                },
                {
                    heading: "Data Security",
                    body: "Your data is protected using industry-standard encryption. We do not sell your personal information to third parties for marketing purposes without your explicit consent."
                }
            ]
        },
        cookies: {
            title: "Cookie Policy",
            icon: Cookie,
            sections: [
                {
                    heading: "Use of Cookies",
                    body: "We use cookies to remember your preferences and provide personalized content. You can manage your cookie settings through your browser at any time."
                }
            ]
        },
        disclaimer: {
            title: "Disclaimer",
            icon: AlertCircle,
            sections: [
                {
                    heading: "Service Accuracy",
                    body: "While we strive for accuracy, Goairclass is not responsible for errors in schedules or pricing provided by our partners (bus operators, airlines, etc.)."
                }
            ]
        }
    };

    const currentContent = content[type] || content.terms;
    const Icon = currentContent.icon;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-radiant-coral font-bold transition-colors mb-8 group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </Link>

                <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="bg-radiant-coral/10 p-4 rounded-2xl text-radiant-coral">
                            <Icon className="h-8 w-8" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-deep-navy tracking-tight">
                            {currentContent.title}
                        </h1>
                    </div>

                    <div className="space-y-12">
                        {currentContent.sections.map((section, index) => (
                            <div key={index} className="space-y-4">
                                <h2 className="text-xl font-black text-deep-navy uppercase tracking-widest text-sm">
                                    {section.heading}
                                </h2>
                                <p className="text-gray-500 leading-relaxed font-bold text-sm">
                                    {section.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <p className="text-gray-400 text-xs font-bold text-center italic">
                            Last updated: February 24, 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
