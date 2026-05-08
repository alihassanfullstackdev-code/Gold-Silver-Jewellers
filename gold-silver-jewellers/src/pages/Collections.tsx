import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';

export default function Collections() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeMetal, setActiveMetal] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedId, setAddedId] = useState<number | null>(null);

  const { addToCart } = useCart();
  const itemsPerPage = 8;
  const metalCategories = ['Gold', 'Silver', 'Artificial'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // FIX: Backticks use kiye hain variables fetch karne ke liye
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?all=true`);
        
        // Safety check: Agar Laravel resource 'data' key mein wrap kare
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setProducts(data);
      } catch (err) {
        console.error("Fetch failed", err);
        setProducts([]); // Error ki surat mein empty array taake filter crash na ho
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  // 1. Filtering Logic with Safety Check
  const filteredProducts = activeMetal === 'all' 
    ? (products || []) 
    : products?.filter(p => p.metal_type?.toLowerCase() === activeMetal.toLowerCase()) || [];

  // 2. Pagination Logic with Safety Check
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleMetalChange = (metal: string) => {
    setActiveMetal(metal);
    setCurrentPage(1);
  };

  const handleQuickAdd = (product: any) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const availableMetals = metalCategories.filter(metal => 
    products?.some(prod => prod.metal_type?.toLowerCase() === metal.toLowerCase())
  );

  return (
    <div className="bg-[#030303]">
      <section className="relative min-h-screen">
        <div className="absolute inset-0 z-0 h-[70vh]">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
            <source src="/videos/collection.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/60 via-transparent to-[#030303]" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 pt-48 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Title */}
            <div className="mb-16 text-center">
              <span className="text-[10px] uppercase tracking-[0.6em] text-gold font-bold">The Vault</span>
              <h1 className="font-serif text-6xl md:text-8xl text-white mt-4 uppercase tracking-tighter">
                {activeMetal === 'all' ? 'Full' : activeMetal} <span className="italic text-gold text-5xl md:text-7xl block md:inline">Collection.</span>
              </h1>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-x-12 gap-y-6 mb-16 border-b border-white/5 pb-8">
              <button onClick={() => handleMetalChange('all')} className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${activeMetal === 'all' ? 'text-gold font-bold' : 'text-white/30 hover:text-white'}`}>
                All Artifacts
                {activeMetal === 'all' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />}
              </button>
              {availableMetals.map((metal) => (
                <button key={metal} onClick={() => handleMetalChange(metal)} className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${activeMetal === metal ? 'text-gold font-bold' : 'text-white/30 hover:text-white'}`}>
                  {metal}
                  {activeMetal === metal && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 min-h-[400px]">
              {loading ? (
                <div className="col-span-full flex justify-center items-center text-white/20 uppercase tracking-widest text-xs">
                  Unveiling Artifacts...
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((product) => (
                    <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="group">
                      <div className="aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 relative group-hover:border-gold/30 transition-all duration-500">
                        {/* FIX: Image URL correctly formatted */}
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${product.image}`} 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                          alt={product.name}
                        />
                        
                        <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => handleQuickAdd(product)}
                            disabled={addedId === product.id}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] uppercase tracking-[0.2em] py-3 flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition-all font-bold"
                          >
                            {addedId === product.id ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Vault</>}
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <h4 className="text-white font-serif text-lg truncate group-hover:text-gold transition-colors">{product.name}</h4>
                        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase border-t border-white/5 pt-3">
                          <span className="text-white/30">{product.metal_type}</span>
                          <span className="text-gold font-bold">PKR {Number(product.fixed_price).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center space-x-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-4 border border-white/10 rounded-full text-white/40 hover:text-gold hover:border-gold disabled:opacity-0 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center space-x-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-full text-[10px] font-bold transition-all border ${
                        currentPage === i + 1 
                        ? 'bg-gold border-gold text-black scale-110' 
                        : 'border-white/10 text-white/40 hover:border-white/40'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-4 border border-white/10 rounded-full text-white/40 hover:text-gold hover:border-gold disabled:opacity-0 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>
      <Footer />
    </div>
  );
}