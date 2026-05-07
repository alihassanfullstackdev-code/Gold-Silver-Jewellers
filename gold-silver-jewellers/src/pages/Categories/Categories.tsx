import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, Loader2, Edit3, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Categories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null); // Naya state
    const [currentPage, setCurrentPage] = useState(1); // Naya state
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Fetch categories with page parameter
    const fetchCategories = async (page = 1) => {
        setFetchLoading(true);
        try {
            const res = await axios.get(`import.meta.env.VITE_API_BASE_URL/categories?page=${page}`);
            // Laravel paginate() response mein data 'data' key mein hota hai
            setCategories(res.data.data);
            setPagination(res.data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Categories fetch failed");
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchCategories(currentPage); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('import.meta.env.VITE_API_BASE_URL/categories', { name });
            setName('');
            fetchCategories(1); // Pehle page par wapis le jao naye item ke baad
        } catch (err) {
            alert("Error adding category");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: number) => {
        try {
            await axios.put(`import.meta.env.VITE_API_BASE_URL/categories/${id}`, { name: editName });
            setEditingId(null);
            fetchCategories(currentPage); // Current page reload karo
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this category? All related products will be removed!")) return;
        try {
            await axios.delete(`import.meta.env.VITE_API_BASE_URL/categories/${id}`);
            fetchCategories(currentPage);
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-10 text-slate-200">
            {/* Elegant Header - Same as before */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-gold/10 rounded-[2rem] flex items-center justify-center border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                        <Layers className="text-gold" size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-serif text-white tracking-tight">Inventory <span className="text-gold italic">Taxonomy</span></h2>
                        <p className="text-slate-500 text-sm mt-1 font-medium">Manage product classifications and hierarchy</p>
                    </div>
                </div>
                <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Database Sync</div>
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Connected
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Entry Form - Same as before */}
                <div className="lg:col-span-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-br from-white/[0.07] to-transparent border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md"
                    >
                        <h3 className="text-xl font-semibold mb-8 flex items-center gap-3">
                            <Plus size={22} className="text-gold" /> New Collection
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Category Label</label>
                                <input 
                                    type="text" required value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-gold/50 focus:ring-4 focus:ring-gold/5 transition-all text-white placeholder:text-slate-700"
                                    placeholder="e.g. Victorian Sets"
                                />
                            </div>
                            <button 
                                disabled={loading}
                                className="w-full bg-gold hover:bg-white text-slate-950 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "INITIALIZE CATEGORY"}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Table with Pagination */}
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h3 className="text-xl text-white font-medium">Classified Groups</h3>
                        <span className="bg-white/5 px-4 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-white/10">
                            Total: {pagination?.total || 0}
                        </span>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] text-[10px] text-slate-500 uppercase font-black tracking-widest border-b border-white/5">
                                    <th className="px-8 py-5">Classification ID</th>
                                    <th className="px-8 py-5">Display Name</th>
                                    <th className="px-8 py-5 text-right">System Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-white/5">
                                <AnimatePresence mode='popLayout'>
                                    {categories.map((cat: any) => (
                                        <motion.tr 
                                            key={cat.id} 
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="group hover:bg-white/[0.03] transition-colors"
                                        >
                                            <td className="px-8 py-6 font-mono text-xs text-slate-600">#CAT-{cat.id.toString().padStart(3, '0')}</td>
                                            <td className="px-8 py-6">
                                                {editingId === cat.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input 
                                                            autoFocus
                                                            className="bg-black/60 border border-gold/30 px-3 py-2 rounded-lg outline-none text-white font-medium"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                        />
                                                        <button onClick={() => handleUpdate(cat.id)} className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><Check size={16}/></button>
                                                        <button onClick={() => setEditingId(null)} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><X size={16}/></button>
                                                    </div>
                                                ) : (
                                                    <span className="text-white font-medium tracking-wide">{cat.name}</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button 
                                                        onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                                                        className="p-3 bg-white/5 text-slate-400 hover:text-gold rounded-xl transition-all"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-3 bg-white/5 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Page {currentPage} of {pagination?.last_page || 1}
                        </p>
                        <div className="flex gap-2">
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => fetchCategories(currentPage - 1)}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-gold/10 hover:text-gold transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button 
                                disabled={currentPage === pagination?.last_page}
                                onClick={() => fetchCategories(currentPage + 1)}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-gold/10 hover:text-gold transition-all"
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