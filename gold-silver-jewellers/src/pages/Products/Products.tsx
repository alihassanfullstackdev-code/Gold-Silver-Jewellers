import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, Edit3, Search, ChevronLeft, ChevronRight,
    Loader2, PackageOpen, MoreHorizontal, Image as ImageIcon, Activity
} from 'lucide-react';
import ProductModal from './AddProduct';

export default function Products() {
    const [products, setProducts] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setProducts(res.data?.data || []);
            setPagination(res.data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Vault retrieval failed", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchProducts(currentPage); 
    }, []);

    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const deleteProduct = async (id: number) => {
        if (!window.confirm("CRITICAL: Are you sure you want to permanently remove this masterpiece?")) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts(currentPage);
        } catch (err) {
            alert("Delete failed.");
        }
    };

    // --- UPDATED IMAGE HELPER ---
    const getProductImage = (imagePath: string) => {
        if (!imagePath) return 'https://placehold.co/400x400/080808/D4AF37?text=No+Image';
        
        // Agar imagePath full URL hai (http...) toh wahi return karein
        if (imagePath.startsWith('http')) return imagePath;

        // Base URL se trailing slash aur /api dono remove karna
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '').replace(/\/$/, '');
        
        // Image path se agar shuru mein slash hai toh handle karein
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        
        return `${baseUrl}/storage/${cleanPath}`;
    };

    return (
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10 min-h-screen text-slate-200">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-serif text-white tracking-tight flex items-center gap-4">
                        <PackageOpen className="text-gold" size={32} />
                        Vault <span className="text-gold italic">Inventory</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">
                        Oversee, refine, and manage your luxury jewelry collection assets.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Vault Identity..." 
                            className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-3.5 rounded-[1.5rem] outline-none focus:border-gold/40 text-sm transition-all backdrop-blur-md"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleAddNew} 
                        className="w-full sm:w-auto bg-gold hover:bg-white text-black px-8 py-4 rounded-[1.5rem] font-black text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Plus size={20} /> NEW MASTERPIECE
                    </button>
                </div>
            </header>

            <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-sm shadow-2xl flex flex-col">
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <h3 className="text-xl text-white font-medium flex items-center gap-3">
                        <Activity size={20} className="text-slate-500" /> Catalog Registry
                    </h3>
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase tracking-widest">
                        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Live Sync
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.03] text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                            <tr>
                                <th className="px-8 py-6">Piece Detail</th>
                                <th className="px-8 py-6">Specifications</th>
                                <th className="px-8 py-6">Valuation</th>
                                <th className="px-8 py-6">Status Flags</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="animate-spin text-gold" size={40} />
                                            <p className="text-[10px] font-mono text-slate-500 tracking-[0.4em] uppercase">Retrieving Vault Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-600">
                                            <PackageOpen size={48} strokeWidth={1} />
                                            <p className="text-xs uppercase tracking-widest">The vault is currently empty</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.map((p: any) => (
                                <motion.tr 
                                    key={p.id} 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="group hover:bg-white/[0.03] transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-inner group-hover:border-gold/30 transition-all duration-500">
                                                <img 
                                                    src={getProductImage(p.image)} 
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    alt={p.name}
                                                    onError={(e) => { 
                                                        const target = e.target as HTMLImageElement;
                                                        target.onerror = null; // Infinite loop bachane ke liye
                                                        target.src = 'https://placehold.co/400x400/080808/D4AF37?text=Jewelry';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white capitalize tracking-tight group-hover:text-gold transition-colors">{p.name}</p>
                                                <p className="text-[9px] text-slate-500 uppercase font-black mt-1 tracking-widest">{p.category?.name || 'Artifact'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-[11px] space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-1.5 w-1.5 rounded-full ${p.metal_type?.toLowerCase() === 'gold' ? 'bg-gold' : 'bg-slate-400'}`} />
                                                <span className="text-slate-300 font-bold uppercase tracking-wider">{p.metal_type}</span>
                                            </div>
                                            <p className="text-slate-500 font-mono italic">
                                                {p.karat ? `${p.karat}K` : 'Pure'} | {p.weight_grams ? `${p.weight_grams}g` : 'Fixed'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono text-emerald-400 font-bold">PKR {Number(p.fixed_price).toLocaleString()}</p>
                                            <p className="text-[9px] text-slate-600 font-black uppercase">Labour: {p.making_charges || '0'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-wrap gap-2">
                                            {p.in_stock ? 
                                                <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">In Stock</span> : 
                                                <span className="text-[8px] bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">Sold Out</span>
                                            }
                                            {p.is_new_arrival && <span className="text-[8px] bg-gold/10 text-gold border border-gold/20 px-2.5 py-1 rounded-full font-black uppercase tracking-tighter">New Arrival</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button 
                                                onClick={() => handleEdit(p)}
                                                className="p-3 bg-white/5 hover:bg-gold/10 text-slate-400 hover:text-gold rounded-2xl transition-all border border-white/5 hover:border-gold/20"
                                            >
                                                <Edit3 size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => deleteProduct(p.id)}
                                                className="p-3 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-white/5 hover:border-red-500/20"
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-black/20">
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] font-black italic">
                        Viewing {products.length} of {pagination?.total || 0} Artifacts
                    </p>
                    <div className="flex items-center gap-3">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => fetchProducts(currentPage - 1)} 
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/10 transition-all text-slate-300"
                        >
                            <ChevronLeft size={20}/>
                        </button>
                        
                        <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono font-bold">
                            <span className="text-gold">{currentPage}</span> <span className="text-slate-600 mx-2">/</span> {pagination?.last_page || 1}
                        </div>

                        <button 
                            disabled={currentPage === pagination?.last_page} 
                            onClick={() => fetchProducts(currentPage + 1)} 
                            className="p-3 bg-white/5 border border-white/10 rounded-2xl disabled:opacity-20 hover:bg-white/10 transition-all text-slate-300"
                        >
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>
            </div>

            <ProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => fetchProducts(currentPage)} 
                product={selectedProduct} 
            />
        </div>
    );
}