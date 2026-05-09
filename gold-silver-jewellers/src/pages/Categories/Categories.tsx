import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, Loader2, Edit3, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // FIX: Backticks use kiye hain variables fetch karne ke liye
    const fetchCategories = async (page = 1) => {
        setFetchLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Laravel Pagination structure check
            setCategories(res.data?.data || []);
            setPagination(res.data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Categories fetch failed", err);
            setCategories([]);
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { 
        fetchCategories(currentPage); 
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            // FIX: Template literal (Backticks)
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/categories`, { name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setName('');
            fetchCategories(1);
        } catch (err) {
            alert("Error: Database entry failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            const token = localStorage.getItem('admin_token');
            // FIX: Template literal (Backticks)
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}`, { name: editName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingId(null);
            fetchCategories(currentPage);
        } catch (err) {
            alert("Update failed. System error.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("CRITICAL: Deleting this category might hide all related products! Proceed?")) return;
        try {
            const token = localStorage.getItem('admin_token');
            // FIX: Template literal (Backticks)
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCategories(currentPage);
        } catch (err) {
            alert("Delete failed. Unauthorized access.");
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 text-slate-200">
            {/* Header - Unified with LiveRates style */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-serif text-white tracking-tight flex items-center gap-4">
                        <Layers className="text-gold" size={32} />
                        Inventory <span className="text-gold italic">Taxonomy</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
                        Manage premium classifications and product hierarchy for your catalog.
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                    <span className="text-[10px] block text-slate-500 font-bold uppercase mb-1">Status</span>
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></div>
                        Connected to Core
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Control Panel (Entry Form) */}
                <div className="lg:col-span-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 rounded-[3rem] shadow-2xl sticky top-8"
                    >
                        <h3 className="text-xl font-semibold mb-8 flex items-center gap-3">
                            <Plus size={24} className="text-gold" /> Add Classification
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">New Collection Name</label>
                                <input 
                                    type="text" required value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold/60 focus:ring-4 focus:ring-gold/5 transition-all text-white placeholder:text-slate-700"
                                    placeholder="e.g. Bridal Masterpieces"
                                />
                            </div>
                            <button 
                                disabled={loading}
                                className="w-full bg-gold hover:bg-white text-slate-900 font-black py-5 rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "INITIALIZE CATEGORY"}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Audit View (Table) */}
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-inner">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <h3 className="text-xl text-white font-medium flex items-center gap-3">Active Classifications</h3>
                        <span className="bg-white/5 px-4 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/10">
                            Total: {pagination?.total || 0}
                        </span>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.03] text-[10px] text-slate-500 uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Reference ID</th>
                                    <th className="px-8 py-5">Display Identity</th>
                                    <th className="px-8 py-5 text-right">System Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {fetchLoading ? (
                                    <tr>
                                        <td colSpan={3} className="py-20 text-center">
                                            <Loader2 className="animate-spin text-gold mx-auto" size={32} />
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence mode='popLayout'>
                                        {(categories || []).map((cat: any) => (
                                            <motion.tr 
                                                key={cat.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                                                className="hover:bg-white/[0.03] transition-colors group"
                                            >
                                                <td className="px-8 py-6 text-slate-500 font-mono text-xs">#CAT-{cat.id.toString().padStart(3, '0')}</td>
                                                <td className="px-8 py-6">
                                                    {editingId === cat.id ? (
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                autoFocus
                                                                className="bg-black/60 border border-gold/30 px-4 py-2 rounded-xl outline-none text-white font-medium focus:ring-2 focus:ring-gold/20"
                                                                value={editName}
                                                                onChange={(e) => setEditName(e.target.value)}
                                                            />
                                                            <button onClick={() => handleUpdate(cat.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all"><Check size={16}/></button>
                                                            <button onClick={() => setEditingId(null)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"><X size={16}/></button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-white font-medium group-hover:text-gold transition-colors">{cat.name}</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button 
                                                            onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                                            className="p-2 text-slate-600 hover:text-gold hover:bg-gold/10 rounded-xl transition-all"
                                                        >
                                                            <Edit3 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(cat.id)}
                                                            className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar - Styled like LiveRates */}
                    <div className="p-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Page {currentPage} of {pagination?.last_page || 1}
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => fetchCategories(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all text-slate-200"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                onClick={() => fetchCategories(currentPage + 1)}
                                disabled={currentPage === pagination?.last_page}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all text-slate-200"
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