import { useState } from 'react';
import { Cpu, Power, Key, Globe, ShieldCheck, Save, AlertCircle } from 'lucide-react';

const TrainAPISettings = () => {
    const [isLive, setIsLive] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">API Settings</h1>
                    <p className="text-slate-500 text-sm">Configure external railway API integrations and environment.</p>
                </div>
                <button className="bg-train-primary hover:bg-train-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-train-primary/20 transition-all active:scale-95">
                    <Save size={18} />
                    <span>Save Configuration</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-train-primary-light dark:bg-train-primary-dark/30 flex items-center justify-center text-train-primary">
                                    <Cpu size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold uppercase tracking-tight">API Environment</h2>
                                    <p className="text-xs text-slate-500">Current Mode: <span className={isLive ? 'text-green-600 font-bold' : 'text-orange-600 font-bold'}>{isLive ? 'LIVE' : 'DUMMY'}</span></p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsLive(!isLive)}
                                className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${isLive ? 'bg-train-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${isLive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Globe size={16} /> API Provider
                                </label>
                                <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none transition-all font-medium">
                                    <option>Internal Dummy API</option>
                                    <option>IRCTC Official B2B</option>
                                    <option>E-Rail API Services</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Key size={16} /> API Key
                                </label>
                                <input 
                                    type="password" 
                                    value="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-train-primary outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card p-8 border-l-4 border-train-primary">
                        <div className="flex items-center gap-2 text-train-primary mb-4 font-bold">
                            <ShieldCheck size={20} />
                            <span>System Status</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
                                <span className="text-sm font-bold text-green-700">API Connection</span>
                                <span className="text-[10px] font-black bg-green-200 text-green-800 px-2 py-0.5 rounded-full">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-xl">
                                <span className="text-sm font-bold text-green-700">Auth Token</span>
                                <span className="text-[10px] font-black bg-green-200 text-green-800 px-2 py-0.5 rounded-full">VALID</span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-8 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500">
                        <div className="flex items-center gap-2 text-amber-600 mb-4 font-bold">
                            <AlertCircle size={20} />
                            <span>Security Warning</span>
                        </div>
                        <p className="text-sm text-amber-900/70 dark:text-amber-400 font-medium leading-relaxed">
                            Switching to LIVE mode will interact with real railway servers. Ensure your credentials are secure and funds are available in the API wallet.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainAPISettings;
