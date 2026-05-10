import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Collections() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedId, setAddedId] = useState<number | null>(null);

  const { addToCart } = useCart();
  
  // Responsive Items Per Page
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const prodRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?all=true`);
        const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.data || []);
        setProducts(prodData);

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

  const filteredProducts = activeCategory === 'all' 
    ? (products || []) 
    : products?.filter(p => p.category_id?.toString() === activeCategory.toString()) || [];

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
    <div className="bg-[#030303] w-full">
      <section className="relative min-h-screen w-full">
        
        {/* Responsive Video Background */}
        <div className="absolute inset-0 z-0 h-[50vh] md:h-[70vh] w-full">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src="/videos/collection.webm" type="video/webm" />
          </video>
        </div>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="relative z-10 pt-32 md:pt-48 pb-20 px-4 md:px-6"
        >
          <div className="max-w-7xl mx-auto">
            
            {/* Title - Responsive Text Sizes */}
            <div className="mb-12 md:mb-24 text-center flex flex-col items-center justify-center">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl text-white mt-4 uppercase tracking-tighter leading-tight md:leading-none">
                {activeCategory === 'all' ? 'The Full' : categories.find(c => c.id.toString() === activeCategory)?.name} 
                <span className="italic text-gold block md:inline md:ml-4 drop-shadow-2xl">Collection</span>
              </h1>
            </div>

            {/* Filter Bar - Scrollable on Mobile */}
            <div className="w-full mb-12 md:mb-16 border-b border-white/5 pb-4 overflow-x-auto no-scrollbar">
              <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center items-center gap-x-6 md:gap-x-10 min-w-max md:min-w-0 px-4">
                <button 
                  onClick={() => handleCategoryChange('all')} 
                  className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative pb-2 whitespace-nowrap ${activeCategory === 'all' ? 'text-gold font-bold' : 'text-white/30 hover:text-white'}`}
                >
                  All Artifacts
                  {activeCategory === 'all' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />}
                </button>

                {categories.map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryChange(cat.id.toString())} 
                    className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative pb-2 whitespace-nowrap ${activeCategory === cat.id.toString() ? 'text-gold font-bold' : 'text-white/30 hover:text-white'}`}
                  >
                    {cat.name}
                    {activeCategory === cat.id.toString() && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid - 1 Col Mobile, 2 Col Tablet, 4 Col Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-16 min-h-[400px]">
              {loading ? (
                <div className="col-span-full flex justify-center items-center text-white/20 uppercase tracking-widest text-[10px]">
                  Unveiling Artifacts...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center text-white/20 py-20 font-serif italic text-lg md:text-xl">
                  No items found in this category.
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((product) => (
                    <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="group">
                      <div className="aspect-[3/4] overflow-hidden bg-white/5 border border-white/10 relative group-hover:border-gold/30 transition-all duration-500">
                        <img 
                          src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/storage/${product.image}`} 
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 sm:group-hover:scale-110 transition-all duration-700 md:duration-1000" 
                          alt={product.name}
                        />
                        
                        {/* Quick Add Overlay - Always visible on mobile, hover on desktop */}
                        <div className="absolute inset-0 flex items-end justify-center p-3 md:p-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent lg:bg-none">
                          <button 
                            onClick={() => handleQuickAdd(product)}
                            disabled={addedId === product.id}
                            className="w-full bg-black/80 lg:bg-black/60 backdrop-blur-md border border-white/10 text-white text-[8px] md:text-[9px] uppercase tracking-[0.2em] py-2.5 md:py-3 flex items-center justify-center gap-2 hover:bg-gold hover:text-black transition-all font-bold"
                          >
                            {addedId === product.id ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add to Vault</>}
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-6 space-y-1 md:space-y-2 px-1">
                        <h4 className="text-white font-serif text-base md:text-lg truncate group-hover:text-gold transition-colors">{product.name}</h4>
                        <div className="flex justify-between items-center text-[9px] md:text-[10px] tracking-widest uppercase border-t border-white/5 pt-2 md:pt-3">
                          <span className="text-white/30 truncate max-w-[100px]">SKU: {product.id}</span>
                          <span className="text-gold font-bold whitespace-nowrap">PKR {(Number(product.fixed_price || 0) + Number(product.making_charges || 0)).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Pagination - Responsive Buttons */}
            {!loading && totalPages > 1 && (
              <div className="mt-16 md:mt-24 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 md:p-4 border border-white/10 rounded-full text-white/40 hover:text-gold hover:border-gold disabled:opacity-0 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full text-[9px] md:text-[10px] font-bold transition-all border ${
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
                  className="p-3 md:p-4 border border-white/10 rounded-full text-white/40 hover:text-gold hover:border-gold disabled:opacity-0 transition-all"
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