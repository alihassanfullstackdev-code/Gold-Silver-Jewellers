import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Collections() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Categories state
  const [activeCategory, setActiveCategory] = useState('all'); // Active Category ID
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedId, setAddedId] = useState<number | null>(null);

  const { addToCart } = useCart();
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Products fetch karein
        const prodRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?all=true`);
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []);
        setProducts(prodData);

        // 2. Categories fetch karein
        const catRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/categories`);
        const catData = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []);
        setCategories(catData);

      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, []);

  // Filtering Logic based on category_id
  const filteredProducts = activeCategory === 'all' 
    ? (products || []) 
    : products?.filter(p => p.category_id?.toString() === activeCategory.toString()) || [];

  // Pagination Logic
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
  };

  const handleQuickAdd = (product: any) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="bg-[#030303]">
      <section className="relative min-h-screen">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 h-[70vh]">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/videos/collection.webm" type="video/webm" />
          </video>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 pt-48 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Centered Title */}
            <div className="mb-24 text-center flex flex-col items-center justify-center">
              <h1 className="font-serif text-6xl md:text-8xl text-white mt-4 uppercase tracking-tighter leading-none">
                {activeCategory === 'all' ? 'The Full' : categories.find(c => c.id.toString() === activeCategory)?.name} 
                <span className="italic text-gold block mt-2 drop-shadow-2xl">Collection</span>
              </h1>
            </div>

            {/* Dynamic Category Filter Bar */}
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 mb-16 border-b border-white/5 pb-8">
              <button 
                onClick={() => handleCategoryChange('all')} 
                className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${activeCategory === 'all' ? 'text-gold font-bold' : 'text-white/30 hover:text-white'}`}
              >
                All Artifacts
                {activeCategory === 'all' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />}
              </button>

              {categories.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => handleCategoryChange(cat.id.toString())} 
                  className={`text-[10px] uppercase tracking-[0.3em] transition-all relative pb-2 ${activeCategory === cat.id.toString() ? 'text-gold font-bold' : 'text-white/30 hover:text-white'}`}
                >
                  {cat.name}
                  {activeCategory === cat.id.toString() && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 min-h-[400px]">
              {loading ? (
                <div className="col-span-full flex justify-center items-center text-white/20 uppercase tracking-widest text-xs">
                  Unveiling Artifacts...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-white/20 py-20 font-serif italic text-xl">
                  No items found in this category.
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((product) => (
                    <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="group">
                      <div className="aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 relative group-hover:border-gold/30 transition-all duration-500">
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${product.image}`} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" 
                          alt={product.name}
                        />
                        
                        <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button 
                            onClick={() => handleQuickAdd(product)}
                            disabled={addedId === product.id}
                            className="w-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] uppercase tracking-[0.2em] py-3 flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition-all font-bold"
                          >
                            {addedId === product.id ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Vault</>}
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <h4 className="text-white font-serif text-lg truncate group-hover:text-gold transition-colors">{product.name}</h4>
                        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase border-t border-white/5 pt-3">
                          <span className="text-white/30">SKU: {product.id}</span>
                          <span className="text-gold font-bold">PKR {(Number(product.fixed_price || 0) + Number(product.making_charges || 0)).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center space-x-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-4 border border-white/10 rounded-full text-white/40 hover:text-gold hover:border-gold disabled:opacity-30 transition-all"
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
                        ? 'bg-gold border-gold text-black' 
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
                  className="p-4 border border-white/10 rounded-full text-white/40 hover:text-gold hover:border-gold disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}