import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Save, History, ChevronLeft, ChevronRight, Activity, Diamond, Trash2 } from 'lucide-react';

export default function LiveRates() {
    const [latestRate, setLatestRate] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]); // Initialize as empty array
    const [meta, setMeta] = useState<any>(null); 
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({ 
        gold_24k: '', 
        silver: '', 
        platinum: '' 
    });

    const fetchRates = async (pageNum = 1) => {
        try {
            const token = localStorage.getItem('admin_token');
            // FIX: Template Literals (Backticks) use kiye hain
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/rates?page=${pageNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Laravel Resource structure handling
            const fetchedData = res.data.data || [];
            setHistory(fetchedData);
            setMeta(res.data.meta); 
            
            if (pageNum === 1 && fetchedData.length > 0) {
                setLatestRate(fetchedData[0]);
            }
        } catch (err) {
            console.error("Fetch failed", err);
            setHistory([]); // Error par empty array taake crash na ho
        }
    };

    useEffect(() => { 
        fetchRates(page); 
    }, [page]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            // FIX: Backticks for API call
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/rates`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ gold_24k: '', silver: '', platinum: '' });
            setPage(1); 
            fetchRates(1);
        } catch (err) {
            alert("Error: Backend sync failed. Check your token or network.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure? This will remove this entry from historical logs.")) return;
        try {
            const token = localStorage.getItem('admin_token');
            // FIX: Backticks for delete call
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/rates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRates(page);
        } catch (err) { 
            alert("Delete failed. Unauthorized access or server error."); 
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 text-slate-200">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-serif text-white tracking-tight flex items-center gap-4">
                        <Diamond className="text-gold animate-pulse" size={32} />
                        Global Metal <span className="text-gold italic">Rates</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
                        Enterprise-grade pricing control for Gold, Silver & Platinum inventory.
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                    <span className="text-[10px] block text-slate-500 font-bold uppercase mb-1">Status</span>
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
                        Market Sync Active
                    </div>
                </div>
            </header>

            {/* Visual Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <RateCard label="24K Gold" value={latestRate?.gold_24k} type="gold" active />
                <RateCard label="22K Gold" value={latestRate?.gold_22k} type="gold" />
                <RateCard label="21K Gold" value={latestRate?.gold_21k} type="gold" />
                <RateCard label="18K Gold" value={latestRate?.gold_18k} type="gold" />
                <RateCard label="Pure Silver" value={latestRate?.silver} type="silver" />
                <RateCard label="Platinum" value={latestRate?.platinum} type="platinum" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Control Panel (Form) */}
                <div className="lg:col-span-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 rounded-[3rem] shadow-2xl sticky top-8">
                        <h3 className="text-xl font-semibold mb-8 flex items-center gap-3">
                            <TrendingUp size={24} className="text-gold" /> Price Terminal
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Gold 24K Rate (Tola)</label>
                                <input type="number" required value={formData.gold_24k} onChange={(e) => setFormData({...formData, gold_24k: e.target.value})} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold/60 focus:ring-4 focus:ring-gold/5 transition-all text-gold font-mono text-xl" placeholder="245,000" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Silver</label>
                                    <input type="number" required value={formData.silver} onChange={(e) => setFormData({...formData, silver: e.target.value})} className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl outline-none focus:border-slate-400 transition-all font-mono" placeholder="3,200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Platinum</label>
                                    <input type="number" required value={formData.platinum} onChange={(e) => setFormData({...formData, platinum: e.target.value})} className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-400 transition-all font-mono" placeholder="110,000" />
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-gold hover:bg-white text-slate-900 font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50">
                                {loading ? "SYNCHRONIZING..." : <><Save size={20} /> PUBLISH NEW RATES</>}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Audit Logs Section */}
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-inner">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <h3 className="text-xl text-white font-medium flex items-center gap-3"><History size={22} className="text-slate-500" /> Historical Logs</h3>
                    </div>
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.03] text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5 text-gold">24K Gold</th>
                                    <th className="px-8 py-5 text-slate-300">Silver</th>
                                    <th className="px-8 py-5 text-blue-300">Platinum</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                <AnimatePresence mode='popLayout'>
                                    {/* FIX: Safe mapping with history fallback */}
                                    {(history || []).map((row: any) => (
                                        <motion.tr 
                                            key={row.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-8 py-6 text-slate-500 font-mono text-xs italic">{row.updated_at}</td>
                                            <td className="px-8 py-6 text-gold font-bold">Rs. {Number(row.gold_24k).toLocaleString()}</td>
                                            <td className="px-8 py-6 text-slate-400">Rs. {Number(row.silver).toLocaleString()}</td>
                                            <td className="px-8 py-6 text-blue-200">Rs. {Number(row.platinum).toLocaleString()}</td>
                                            <td className="px-8 py-6 text-right">
                                                <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {!loading && history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-600 uppercase tracking-widest text-xs">
                                            No historical data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Showing {meta?.from || 0} to {meta?.to || 0} of {meta?.total || 0} Entries
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={() => setPage(prev => Math.min(meta?.last_page || 1, prev + 1))}
                                disabled={page === (meta?.last_page || 1)}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function RateCard({ label, value, type, active = false }: any) {
    const perGram = value ? (Number(value) / 11.664).toFixed(0) : '0';
    const theme: any = {
        gold: { text: "text-gold", bg: "bg-gold/5", border: "border-gold/20" },
        silver: { text: "text-slate-300", bg: "bg-white/5", border: "border-white/10" },
        platinum: { text: "text-blue-300", bg: "bg-blue-500/5", border: "border-blue-500/10" }
    };
    const currentTheme = theme[type] || theme.gold;

    return (
        <motion.div whileHover={{ y: -8 }} className={`p-6 rounded-[2.5rem] border transition-all duration-500 shadow-xl ${active ? `${currentTheme.bg} ${currentTheme.border}` : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'}`}>
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">{label}</span>
                <Activity size={14} className={active ? `${currentTheme.text} animate-pulse` : 'text-slate-800'} />
            </div>
            <div className="space-y-1 mb-6">
                <p className={`text-2xl font-mono font-bold tracking-tight ${currentTheme.text}`}>{value ? `Rs. ${Number(value).toLocaleString()}` : '---'}</p>
                <span className="text-[9px] text-slate-600 font-bold uppercase">Per Tola (Unit)</span>
            </div>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-600 font-bold uppercase">1 Gram</span>
                    <span className="text-white/80 font-mono">Rs. {Number(perGram).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-600 font-bold uppercase">10 Grams</span>
                    <span className="text-white/80 font-mono">Rs. {(Number(perGram)*10).toLocaleString()}</span>
                </div>
            </div>
        </motion.div>
    );
}