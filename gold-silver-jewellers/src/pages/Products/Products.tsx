import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, Edit3, Search, ChevronLeft, ChevronRight,
    Loader2, PackageOpen, MoreHorizontal, Image as ImageIcon
} from 'lucide-react';
import ProductModal from './AddProduct'; // Name change confirm kar lein

export default function Products() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/products?page=${page}`);
            setProducts(res.data.data);
            setPagination(res.data);
            setCurrentPage(page);
        } catch (err) {
            console.error("Fetch failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(currentPage); }, []);

    // Handlers
    const handleAddNew = () => {
        setSelectedProduct(null); // Clear for Add mode
        setIsModalOpen(true);
    };

    const handleEdit = (product: any) => {
        setSelectedProduct(product); // Fill for Edit mode
        setIsModalOpen(true);
    };

    const deleteProduct = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this masterpiece?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
            fetchProducts(currentPage);
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 min-h-screen text-slate-200">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-white italic tracking-tight">
                        Vault <span className="text-gold underline underline-offset-8 decoration-gold/30">Inventory</span>
                    </h2>
                    <p className="text-slate-500 text-sm mt-2">Oversee and refine your luxury collections</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Vault..." 
                            className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl outline-none focus:border-gold/40 text-sm transition-all"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleAddNew} 
                        className="bg-gold hover:bg-white text-black px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-gold/10 active:scale-95"
                    >
                        <Plus size={18} /> NEW ENTRY
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black">
                            <tr>
                                <th className="px-6 py-5">Piece Detail</th>
                                <th className="px-6 py-5">Specifications</th>
                                <th className="px-6 py-5">Valuation</th>
                                <th className="px-6 py-5">Collection Flags</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="animate-spin text-gold" size={32} />
                                            <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em]">SYNCHRONIZING...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-600">
                                            <PackageOpen size={40} strokeWidth={1} />
                                            <p className="text-sm">The vault is currently empty</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.map((p: any) => (
                                <tr key={p.id} className="group hover:bg-white/[0.03] transition-colors border-white/5">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
                                                <img 
                                                    src={`http://127.0.0.1:8000/storage/${p.image}`} 
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image' }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white capitalize tracking-tight group-hover:text-gold transition-colors">{p.name}</p>
                                                <p className="text-[9px] text-slate-500 uppercase font-black mt-0.5 tracking-tighter">{p.category?.name || 'Uncategorized'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-1.5 w-1.5 rounded-full ${p.metal_type === 'gold' ? 'bg-gold' : 'bg-slate-400'}`} />
                                                <span className="text-slate-300 font-bold uppercase">{p.metal_type}</span>
                                            </div>
                                            <p className="text-slate-500 font-mono">
                                                {p.karat ? `${p.karat}K` : '---'} | {p.weight_grams ? `${p.weight_grams}g` : 'Fixed Weight'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-mono text-emerald-500">PKR {Number(p.fixed_price).toLocaleString()}</p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase">Making: {p.making_charges}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.in_stock ? 
                                                <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-md font-black uppercase">In Stock</span> : 
                                                <span className="text-[8px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-md font-black uppercase">OOS</span>
                                            }
                                            {p.is_new_arrival && <span className="text-[8px] bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-md font-black uppercase">New</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(p)}
                                                className="p-2.5 bg-white/5 hover:bg-gold/20 text-slate-400 hover:text-gold rounded-xl transition-all border border-transparent hover:border-gold/30"
                                            >
                                                <Edit3 size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => deleteProduct(p.id)}
                                                className="p-2.5 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-red-500/30"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black">
                        Showing {products.length} of {pagination?.total || 0} Pieces
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => fetchProducts(currentPage - 1)} 
                            className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-gold/10 hover:text-gold transition-all"
                        >
                            <ChevronLeft size={20}/>
                        </button>
                        
                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-mono font-bold">
                            <span className="text-gold">{currentPage}</span> / {pagination?.last_page || 1}
                        </div>

                        <button 
                            disabled={currentPage === pagination?.last_page} 
                            onClick={() => fetchProducts(currentPage + 1)} 
                            className="p-2 bg-white/5 border border-white/10 rounded-xl disabled:opacity-20 hover:bg-gold/10 hover:text-gold transition-all"
                        >
                            <ChevronRight size={20}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Combined Modal Component */}
            <ProductModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => fetchProducts(currentPage)} 
                product={selectedProduct} // null for Add, object for Edit
            />
        </div>
    );
}