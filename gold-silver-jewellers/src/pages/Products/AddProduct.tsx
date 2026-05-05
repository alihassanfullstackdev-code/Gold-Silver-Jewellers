import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, Sparkles, ChevronDown, CheckCircle2, Loader2, RefreshCcw } from 'lucide-react';

// Props mein 'product' optional hai. Agar product null hoga toh 'Add' mode, warna 'Edit' mode.
interface Props { isOpen: boolean; onClose: () => void; onSuccess: () => void; product?: any; }

export default function ProductModal({ isOpen, onClose, onSuccess, product }: Props) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: '', category_id: '', description: '', metal_type: 'gold',
        karat: '22', weight_grams: '', fixed_price: '0', making_charges: '0',
        is_new_arrival: false, is_top_seller: false, is_featured: false, in_stock: true
    });

    const isEdit = Boolean(product);

    useEffect(() => {
        if (isOpen) {
            // UPDATED: Added ?all=true to fetch all 11 categories bypassing pagination
            axios.get('http://127.0.0.1:8000/api/categories?all=true').then(res => {
                // Laravel .get() returns array, .paginate() returns object with .data
                const fetchedData = Array.isArray(res.data) ? res.data : res.data.data;
                setCategories(fetchedData || []);
            }).catch(err => console.error("Category fetch failed", err));

            if (isEdit && product) {
                // EDIT MODE: Fill form with product data
                setFormData({
                    name: product.name || '',
                    category_id: product.category_id || '',
                    description: product.description || '',
                    metal_type: product.metal_type || 'gold',
                    karat: product.karat || '22',
                    weight_grams: product.weight_grams || '',
                    fixed_price: product.fixed_price || '0',
                    making_charges: product.making_charges || '0',
                    is_new_arrival: Boolean(product.is_new_arrival),
                    is_top_seller: Boolean(product.is_top_seller),
                    is_featured: Boolean(product.is_featured),
                    in_stock: Boolean(product.in_stock),
                });
                // Image URL fix for preview
                setImagePreview(`http://127.0.0.1:8000/storage/${product.image}`);
            } else {
                resetForm();
            }
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen, product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();

        // Laravel requirement: Multipart form mein PUT bhejane ke liye _method add karna parta hai
        if (isEdit) data.append('_method', 'PUT');

        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'boolean') data.append(key, value ? '1' : '0');
            else data.append(key, value.toString());
        });

        if (image) data.append('image', image);

        try {
            const url = isEdit 
                ? `http://127.0.0.1:8000/api/products/${product.id}` 
                : `http://127.0.0.1:8000/api/products`;
            
            await axios.post(url, data); 
            onSuccess();
            onClose();
        } catch (err) {
            alert("Action failed. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', category_id: '', description: '', metal_type: 'gold',
            karat: '22', weight_grams: '', fixed_price: '0', making_charges: '0',
            is_new_arrival: false, is_top_seller: false, is_featured: false, in_stock: true
        });
        setImagePreview(null);
        setImage(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-[#080808] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        
                        <div className="p-8 pb-6 flex justify-between items-center border-b border-white/5 bg-[#080808] z-10">
                            <div className="flex items-center gap-3">
                                {isEdit ? <RefreshCcw className="text-gold" size={24} /> : <Sparkles className="text-gold" size={24} />}
                                <h3 className="text-2xl font-serif text-white italic tracking-tight">
                                    {isEdit ? 'Update Masterpiece' : 'Craft New Piece'}
                                </h3>
                            </div>
                            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
                        </div>

                        <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 text-left block">Product Name</label>
                                        <input required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-gold/40 text-white transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 text-left block">Category</label>
                                        <div className="relative group">
                                            <select required className="w-full bg-white/5 border border-white/10 p-4 pr-10 rounded-2xl outline-none focus:border-gold/40 text-white appearance-none cursor-pointer transition-all" value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                                                <option value="" className="bg-slate-900">Select...</option>
                                                {categories.map((c: any) => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-gold transition-colors" size={18} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 text-left block">Metal</label>
                                            <div className="relative group">
                                                <select className="w-full bg-gold/5 border border-gold/20 p-4 pr-10 rounded-2xl text-gold font-bold outline-none focus:border-gold appearance-none cursor-pointer transition-all" value={formData.metal_type} onChange={e => setFormData({ ...formData, metal_type: e.target.value })}>
                                                    <option value="gold" className="bg-slate-900">Gold</option>
                                                    <option value="silver" className="bg-slate-900">Silver</option>
                                                    <option value="artificial" className="bg-slate-900">Artificial</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none group-focus-within:text-gold transition-colors" size={18} />
                                            </div>
                                        </div>

                                        {formData.metal_type !== 'artificial' ? (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 text-left block">Purity (Karat)</label>
                                                <div className="relative group">
                                                    <select className="w-full bg-white/5 border border-white/10 p-4 pr-10 rounded-2xl text-white outline-none focus:border-gold/40 appearance-none cursor-pointer transition-all" value={formData.karat} onChange={e => setFormData({ ...formData, karat: e.target.value })}>
                                                        <option value="24" className="bg-slate-900">24K</option>
                                                        <option value="22" className="bg-slate-900">22K</option>
                                                        <option value="21" className="bg-slate-900">21K</option>
                                                        <option value="18" className="bg-slate-900">18K</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-focus-within:text-gold transition-colors" size={18} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-left block">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Weight (g)</label>
                                                <input type="number" step="0.001" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold/40 transition-all" placeholder="0.000" value={formData.weight_grams} onChange={e => setFormData({ ...formData, weight_grams: e.target.value })} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 text-left block">Fixed Price (PKR)</label>
                                            <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold/40 transition-all" placeholder="0.00" value={formData.fixed_price} onChange={e => setFormData({ ...formData, fixed_price: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 text-left block">Labour / Making</label>
                                            <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold/40 transition-all" placeholder="0.00" value={formData.making_charges} onChange={e => setFormData({ ...formData, making_charges: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 text-left block">Description</label>
                                        <textarea className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-gold/40 h-24 resize-none transition-all" placeholder="Artistic details..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>

                                <div className="space-y-6 flex flex-col justify-between h-full">
                                    <div className="relative aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden hover:border-gold/40 transition-all group shadow-inner">
                                        {imagePreview ? (
                                            <div className="relative w-full h-full">
                                                <img src={imagePreview} className="w-full h-full object-cover shadow-2xl" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <Upload className="text-white" size={32} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-slate-600 text-center group-hover:text-gold transition-colors">
                                                <Upload className="mx-auto mb-2" size={32} />
                                                <p className="text-[10px] font-black uppercase tracking-widest">Upload Masterpiece</p>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => { const file = e.target.files?.[0]; if (file) { setImage(file); setImagePreview(URL.createObjectURL(file)); } }} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <Toggle label="In Stock" checked={formData.in_stock} onChange={(v: any) => setFormData({ ...formData, in_stock: v })} />
                                        <div className="grid grid-cols-3 gap-2">
                                            <MiniToggle label="New" checked={formData.is_new_arrival} onChange={(v: any) => setFormData({ ...formData, is_new_arrival: v })} />
                                            <MiniToggle label="Top" checked={formData.is_top_seller} onChange={(v: any) => setFormData({ ...formData, is_top_seller: v })} />
                                            <MiniToggle label="Featured" checked={formData.is_featured} onChange={(v: any) => setFormData({ ...formData, is_featured: v })} />
                                        </div>
                                    </div>

                                    <button disabled={loading} className="w-full bg-gold hover:bg-white text-slate-950 font-black py-6 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_20px_50px_rgba(212,175,55,0.15)] mt-4">
                                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                        {loading ? "RECORDING..." : isEdit ? "UPDATE MASTERPIECE" : "PUBLISH TO VAULT"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function Toggle({ label, checked, onChange }: any) {
    return (
        <div onClick={() => onChange(!checked)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${checked ? 'bg-gold/10 border-gold/40 shadow-inner' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${checked ? 'text-gold' : 'text-slate-500'}`}>{label}</span>
            <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${checked ? 'bg-gold border-gold' : 'border-white/20'}`}>
                {checked && <CheckCircle2 size={12} className="text-black" strokeWidth={3} />}
            </div>
        </div>
    );
}

function MiniToggle({ label, checked, onChange }: any) {
    return (
        <div onClick={() => onChange(!checked)} className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${checked ? 'bg-gold/10 border-gold/40 text-gold' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}>
            <span className="text-[8px] font-black uppercase tracking-tighter mb-1.5 leading-none">{label}</span>
            <div className={`h-2.5 w-2.5 rounded-full transition-all ${checked ? 'bg-gold shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'bg-white/10'}`} />
        </div>
    );
}