import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Save, History, ChevronLeft, ChevronRight, Activity, Diamond, Trash2 } from 'lucide-react';

export default function LiveRates() {
    const [latestRate, setLatestRate] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
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
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/rates?page=${pageNum}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const fetchedData = res.data.data || [];
            setHistory(fetchedData);
            setMeta(res.data.meta); 
            if (pageNum === 1 && fetchedData.length > 0) {
                setLatestRate(fetchedData[0]);
            }
        } catch (err) {
            console.error("Fetch failed", err);
            setHistory([]);
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
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/rates`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ gold_24k: '', silver: '', platinum: '' });
            setPage(1); 
            fetchRates(1);
        } catch (err) {
            alert("Error: Backend sync failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/rates/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRates(page);
        } catch (err) { 
            alert("Delete failed."); 
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-[1600px] mx-auto space-y-10 text-slate-200 overflow-x-hidden">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-full">
                    <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight flex items-center gap-3 md:gap-4 flex-wrap">
                        <Diamond className="text-gold animate-pulse shrink-0" size={32} />
                        <span className="break-words">Global Metal <span className="text-gold italic">Rates</span></span>
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm mt-2 font-medium tracking-wide break-words">
                        Enterprise-grade pricing control for Gold, Silver & Platinum inventory.
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 md:px-6 md:py-3 rounded-2xl backdrop-blur-md self-start md:self-center">
                    <span className="text-[10px] block text-slate-500 font-bold uppercase mb-1">Status</span>
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] md:text-xs">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping shrink-0"></div>
                        Market Sync Active
                    </div>
                </div>
            </header>

            {/* Visual Analytics Cards - Adjusted Grid for all screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
                <RateCard label="24K Gold" value={latestRate?.gold_24k} type="gold" active />
                <RateCard label="22K Gold" value={latestRate?.gold_22k} type="gold" />
                <RateCard label="21K Gold" value={latestRate?.gold_21k} type="gold" />
                <RateCard label="18K Gold" value={latestRate?.gold_18k} type="gold" />
                <RateCard label="Pure Silver" value={latestRate?.silver} type="silver" />
                <RateCard label="Platinum" value={latestRate?.platinum} type="platinum" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                {/* Control Panel (Form) */}
                <div className="lg:col-span-4 w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl lg:sticky lg:top-8">
                        <h3 className="text-lg md:text-xl font-semibold mb-6 md:mb-8 flex items-center gap-3">
                            <TrendingUp size={24} className="text-gold shrink-0" /> Price Terminal
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Gold 24K Rate (Tola)</label>
                                <input type="number" required value={formData.gold_24k} onChange={(e) => setFormData({...formData, gold_24k: e.target.value})} className="w-full bg-black/40 border border-white/10 p-4 md:p-5 rounded-2xl outline-none focus:border-gold/60 transition-all text-gold font-mono text-lg md:text-xl" placeholder="245,000" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Silver</label>
                                    <input type="number" required value={formData.silver} onChange={(e) => setFormData({...formData, silver: e.target.value})} className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl outline-none focus:border-slate-400 transition-all font-mono text-sm" placeholder="3,200" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Platinum</label>
                                    <input type="number" required value={formData.platinum} onChange={(e) => setFormData({...formData, platinum: e.target.value})} className="w-full bg-black/20 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-400 transition-all font-mono text-sm" placeholder="110,000" />
                                </div>
                            </div>
                            <button disabled={loading} className="w-full bg-gold hover:bg-white text-slate-900 font-black py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50 text-sm md:text-base">
                                {loading ? "SYNCING..." : <><Save size={20} className="shrink-0" /> PUBLISH RATES</>}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Audit Logs Section */}
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col shadow-inner w-full">
                    <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <h3 className="text-lg md:text-xl text-white font-medium flex items-center gap-3 truncate">
                            <History size={22} className="text-slate-500 shrink-0" /> Historical Logs
                        </h3>
                    </div>
                    {/* Table Wrapper for Horizontal Scroll on Mobile */}
                    <div className="overflow-x-auto w-full scrollbar-hide">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-white/[0.03] text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 md:px-8 md:py-5">Date</th>
                                    <th className="px-6 py-4 md:px-8 md:py-5 text-gold">24K Gold</th>
                                    <th className="px-6 py-4 md:px-8 md:py-5 text-slate-300">Silver</th>
                                    <th className="px-6 py-4 md:px-8 md:py-5 text-blue-300">Platinum</th>
                                    <th className="px-6 py-4 md:px-8 md:py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-[12px] md:text-sm">
                                <AnimatePresence mode='popLayout'>
                                    {(history || []).map((row: any) => (
                                        <motion.tr 
                                            key={row.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                                            className="hover:bg-white/[0.03] transition-colors group"
                                        >
                                            <td className="px-6 py-4 md:px-8 md:py-6 text-slate-500 font-mono text-[10px] italic">{row.updated_at}</td>
                                            <td className="px-6 py-4 md:px-8 md:py-6 text-gold font-bold break-all">Rs. {Number(row.gold_24k).toLocaleString()}</td>
                                            <td className="px-6 py-4 md:px-8 md:py-6 text-slate-400 break-all">Rs. {Number(row.silver).toLocaleString()}</td>
                                            <td className="px-6 py-4 md:px-8 md:py-6 text-blue-200 break-all">Rs. {Number(row.platinum).toLocaleString()}</td>
                                            <td className="px-6 py-4 md:px-8 md:py-6 text-right">
                                                <button onClick={() => handleDelete(row.id)} className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {!loading && history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-600 uppercase tracking-widest text-[10px]">
                                            No historical data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-4 md:p-6 bg-black/20 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center sm:text-left">
                            Showing {meta?.from || 0} to {meta?.to || 0} of {meta?.total || 0} Entries
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                onClick={() => setPage(prev => Math.min(meta?.last_page || 1, prev + 1))}
                                disabled={page === (meta?.last_page || 1)}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all shadow-sm"
                            >
                                <ChevronRight size={18} />
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
        <motion.div whileHover={{ y: -8 }} className={`p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500 shadow-xl w-full ${active ? `${currentTheme.bg} ${currentTheme.border}` : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'}`}>
            <div className="flex justify-between items-start mb-4 md:mb-6">
                <span className="text-[9px] md:text-[10px] uppercase font-black text-slate-500 tracking-widest">{label}</span>
                <Activity size={14} className={active ? `${currentTheme.text} animate-pulse shrink-0` : 'text-slate-800 shrink-0'} />
            </div>
            <div className="space-y-1 mb-4 md:mb-6">
                <p className={`text-xl md:text-2xl font-mono font-bold tracking-tight break-all ${currentTheme.text}`}>
                    {value ? `Rs. ${Number(value).toLocaleString()}` : '---'}
                </p>
                <span className="text-[8px] md:text-[9px] text-slate-600 font-bold uppercase block italic">Per Tola (Unit)</span>
            </div>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[9px] md:text-[10px]">
                    <span className="text-slate-600 font-bold uppercase truncate mr-2">1 Gram</span>
                    <span className="text-white/80 font-mono whitespace-nowrap">Rs. {Number(perGram).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] md:text-[10px]">
                    <span className="text-slate-600 font-bold uppercase truncate mr-2">10 Grams</span>
                    <span className="text-white/80 font-mono whitespace-nowrap">Rs. {(Number(perGram)*10).toLocaleString()}</span>
                </div>
            </div>
        </motion.div>
    );
}