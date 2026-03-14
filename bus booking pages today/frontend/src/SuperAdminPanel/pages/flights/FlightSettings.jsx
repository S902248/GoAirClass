import { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FlightSettings = () => {
    const [settings, setSettings] = useState({ flightEnabled: true, bookingFee: 0, taxPercent: 0, cancellationPolicy: '', refundPolicy: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch(`${API}/api/flight-settings`)
            .then(r => r.json())
            .then(d => { if (d.settings) setSettings(d.settings); })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        await fetch(`${API}/api/flight-settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    if (loading) return <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600"><Settings size={24} /></div>
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Flight Settings</h1>
                    <p className="text-slate-500 text-sm font-medium">Configure global flight module settings</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="card p-6 space-y-5">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white">Flights Enabled</p>
                        <p className="text-sm text-slate-500">Enable or disable the flights booking module</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={settings.flightEnabled} onChange={e => setSettings(s => ({ ...s, flightEnabled: e.target.checked }))} />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-sky-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600" />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Booking Fee (₹)</label>
                        <input type="number" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" value={settings.bookingFee} onChange={e => setSettings(s => ({ ...s, bookingFee: Number(e.target.value) }))} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Tax Percent (%)</label>
                        <input type="number" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" value={settings.taxPercent} onChange={e => setSettings(s => ({ ...s, taxPercent: Number(e.target.value) }))} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Cancellation Policy</label>
                    <textarea rows={3} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" value={settings.cancellationPolicy} onChange={e => setSettings(s => ({ ...s, cancellationPolicy: e.target.value }))} placeholder="Describe the cancellation policy..." />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Refund Policy</label>
                    <textarea rows={3} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" value={settings.refundPolicy} onChange={e => setSettings(s => ({ ...s, refundPolicy: e.target.value }))} placeholder="Describe the refund policy..." />
                </div>

                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-semibold text-sm hover:bg-sky-700 transition-colors disabled:opacity-60">
                    {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
};

export default FlightSettings;
