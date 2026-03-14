import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Star, Chrome, User, RefreshCw, Key } from 'lucide-react';
import { registerUser, getUserProfile } from '../api/userApi';
import { getOtp, verifyOtp, loginRequestOtp, verifyLoginOtp } from '../api/authApi';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
    const [mobileNumber, setMobileNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);

    const resetLoginForm = () => {
        console.log(">>> [FRONTEND] Resetting Login Form");
        setMobileNumber('');
        setOtp('');
        setShowOtpInput(false);
        setFullName('');
        setError('');
        setLoading(false);
        setTimer(0);
        // Clear any stored leftovers if any
        localStorage.removeItem('temp_login_num');
    };

    React.useEffect(() => {
        if (isOpen) {
            resetLoginForm();
        }
    }, [isOpen]);

    React.useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    if (!isOpen) return null;

    const handleGetOtp = async () => {
        if (mobileNumber.length !== 10) {
            setError('PLEASE ENTER A VALID 10-DIGIT MOBILE NUMBER');
            return;
        }
        setOtpLoading(true);
        setError('');
        try {
            console.log('>>> [FRONTEND] Requesting OTP for:', mobileNumber);
            if (authMode === 'login') {
                // NEW: Uses registration-check-first endpoint
                await loginRequestOtp(mobileNumber);
            } else {
                await getOtp(mobileNumber);
            }
            console.log('>>> [FRONTEND] OTP request successful, showing input field.');
            setShowOtpInput(true);
            setTimer(30);
        } catch (err) {
            // Show the backend's message (e.g. "User not registered. Please register first.")
            setError((err.message || 'FAILED TO SEND OTP').toUpperCase());
        } finally {
            setOtpLoading(false);
        }
    };

    const handleRefreshOtp = async () => {
        if (timer > 0) return;
        setOtpLoading(true);
        setError('');
        try {
            await getOtp(mobileNumber);
            setOtp('');
            setTimer(30);
        } catch (err) {
            setError(err.message || 'FAILED TO REFRESH OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            if (authMode === 'signup') {
                const userData = { fullName, mobileNumber };
                const result = await registerUser(userData);

                // Clear any previous operator sessions
                localStorage.removeItem('operatorToken');
                localStorage.removeItem('operatorData');
                localStorage.setItem('token', result.token);
                localStorage.setItem('userData', JSON.stringify({
                    name: result.fullName,
                    mobile: result.mobileNumber,
                    role: result.role
                }));

                onLoginSuccess({
                    name: result.fullName,
                    mobile: result.mobileNumber,
                    role: result.role,
                    token: result.token
                });
                onClose();
            } else { // Login Mode (OTP Flow)
                if (!showOtpInput) {
                    await handleGetOtp();
                } else {
                    if (!otp || otp.length < 6) {
                        setError('PLEASE ENTER 6-DIGIT OTP');
                        setLoading(false);
                        return;
                    }
                    // NEW: Uses registration-check-first verify endpoint
                    const result = await verifyLoginOtp(mobileNumber, otp);

                    // Clear any previous operator sessions
                    localStorage.removeItem('operatorToken');
                    localStorage.removeItem('operatorData');
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('userData', JSON.stringify({
                        name: result.user.fullName,
                        mobile: result.user.mobileNumber,
                        role: result.user.role
                    }));

                    onLoginSuccess({
                        name: result.user.fullName,
                        mobile: result.user.mobileNumber,
                        role: result.user.role,
                        token: result.token
                    });
                    onClose();
                }
            }
        } catch (err) {
            setError(err.message || (authMode === 'signup' ? 'SIGNUP FAILED' : 'INVALID OTP'));
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = authMode === 'signup'
        ? (mobileNumber.length < 10 || fullName.trim().length < 2)
        : (mobileNumber.length < 10);

    const isActionDisabled = authMode === 'signup'
        ? (isButtonDisabled || loading)
        : (loading || (showOtpInput && otp.length < 6));

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-deep-navy/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[calc(100vh-2rem)]">

                {/* Left Side: Features (Visible on Desktop) */}
                <div className="hidden md:flex flex-col w-[380px] bg-[#f8f9ff] p-10 border-r border-gray-100 relative overflow-hidden shrink-0">
                    <div className="mb-10">
                        <h2 className="text-[28px] font-black text-[#d84e55] tracking-tighter italic">GoAirClass</h2>
                    </div>

                    <div className="space-y-8 relative z-10">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-5 w-5 text-[#d84e55]" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-black text-deep-navy uppercase tracking-widest mb-1 leading-tight">GAC Assured</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-tighter">Protect yourself with up to 150% refund in case of service cancellation.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <CreditCard className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-black text-deep-navy uppercase tracking-widest mb-1 leading-tight">Free Cancellation</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-tighter">Protect yourself from cancellation charges and get 100% refund.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                                <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                                <h4 className="text-[13px] font-black text-deep-navy uppercase tracking-widest mb-1 leading-tight">4.9* Rating</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-tighter">India's premium bus platform trusted by millions of happy travelers.</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Bus Vector Bottom */}
                    <div className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none">
                        <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20,60 L180,60 L180,90 L20,90 Z" fill="currentColor" />
                            <circle cx="50" cy="90" r="10" fill="currentColor" />
                            <circle cx="150" cy="90" r="10" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                {/* Right Side: Login/Signup Form */}
                <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <div className="p-8 md:p-12">
                        <button
                            onClick={onClose}
                            className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full transition-all group z-20"
                        >
                            <X className="h-5 w-5 text-gray-400 group-hover:text-deep-navy" />
                        </button>

                        <div className="max-w-sm mx-auto">
                            <h3 className="text-xl md:text-2xl font-black text-deep-navy mb-1.5 tracking-tight uppercase">
                                {authMode === 'login' ? 'Login to GoAirClass' : 'Join GoAirClass'}
                            </h3>
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
                                {authMode === 'login' ? 'Enter Mobile Number to Continue' : 'Create an account to start booking'}
                            </p>

                            <div className="space-y-5 md:space-y-6">
                                {error && (
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight text-center bg-red-50 py-2 rounded-lg">
                                        {error}
                                    </p>
                                )}
                                {authMode === 'signup' && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#d84e55] transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 group-focus-within:text-[#d84e55] transition-colors tracking-tight">+91 |</span>
                                        <input
                                            type="tel"
                                            placeholder="Mobile Number"
                                            disabled={showOtpInput && authMode === 'login'}
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            className="w-full pl-14 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                {authMode === 'login' && showOtpInput && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-2">
                                        <div className="flex items-center justify-between px-1">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Enter 6-Digit OTP</p>
                                            <button 
                                                disabled={timer > 0 || otpLoading}
                                                onClick={handleRefreshOtp} 
                                                className={`text-[9px] font-black uppercase tracking-widest transition-all
                                                    ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#d84e55] hover:underline'}`}
                                            >
                                                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                            </button>
                                        </div>
                                        <div className="relative group">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#d84e55] transition-colors" />
                                            <input
                                                type="text"
                                                maxLength="6"
                                                placeholder="••••••"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black focus:border-[#d84e55] outline-none transition-all tracking-[0.8em] text-center"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || (authMode === 'login' && mobileNumber.length < 10) || (authMode === 'login' && showOtpInput && otp.length < 6) || (authMode === 'signup' && (mobileNumber.length < 10 || fullName.trim().length < 2))}
                                    className={`w-full py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl
                                        ${!loading && ((authMode === 'login' && mobileNumber.length === 10) || (authMode === 'signup' && mobileNumber.length === 10 && fullName.trim().length >= 2))
                                            ? 'bg-[#d84e55] text-white shadow-[#d84e55]/30 hover:shadow-[#d84e55]/40 hover:scale-[1.01] active:scale-95'
                                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
                                    `}
                                >
                                    {loading ? 'PROCESSING...' : (authMode === 'login' ? (showOtpInput ? 'VERIFY & LOGIN' : 'GET OTP') : 'CREATE ACCOUNT')}
                                </button>

                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                        {authMode === 'login' ? "DON'T HAVE AN ACCOUNT?" : "ALREADY HAVE AN ACCOUNT?"}
                                        <button
                                            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                            className="ml-2 text-[#d84e55] font-black hover:underline underline-offset-4"
                                        >
                                            {authMode === 'login' ? "Sign Up" : "Login"}
                                        </button>
                                    </p>
                                </div>

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                    <div className="relative flex justify-center text-[9px] uppercase font-black text-gray-300 tracking-[0.3em] bg-white px-4">Or Continue With</div>
                                </div>

                                <button
                                    onClick={() => onLoginSuccess({ name: 'Google User', mobile: '9999999999' })}
                                    className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group"
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <Chrome className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[10px] font-black text-deep-navy uppercase tracking-widest">Sign with Google</span>
                                </button>

                                <p className="text-[8px] font-bold text-gray-400 leading-relaxed text-center px-4 uppercase tracking-tighter mt-4 pb-4">
                                    By {authMode === 'login' ? 'logging in' : 'joining'}, I agree to GoAirClass <br />
                                    <span className="text-blue-500 cursor-pointer hover:underline">terms of use</span> & <span className="text-blue-500 cursor-pointer hover:underline">privacy policy</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
