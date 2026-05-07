import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function OurCollection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('import.meta.env.VITE_API_BASE_URL/products?all=true')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setProducts(data.slice(0, 8));
      })
      .catch(err => console.error("Collection fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="bg-[#030303] py-32 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- HEADING SECTION --- */}
        <div className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-gold/40" />
              <span className="font-sans text-[10px] uppercase tracking-[0.8em] text-gold font-black">
                Curated Selection
              </span>
              <div className="h-[1px] w-8 bg-gold/40" />
            </div>

            <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tighter uppercase">
              Our <span className="italic text-gold lowercase">Collection</span>
            </h2>
          </motion.div>
        </div>

        {/* --- PRODUCT GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#080808] border border-white/10 group-hover:border-gold/30 transition-all duration-700">
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}/storage/${product.image}`}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                  alt={product.name}
                />
                
                {/* Subtle Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick Add Button - Appears on Hover */}
                <div className="absolute inset-0 flex items-end justify-center p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    disabled={addedId === product.id}
                    className="w-full py-4 bg-white/90 backdrop-blur-md text-black text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 hover:bg-gold hover:text-black transition-colors"
                  >
                    {addedId === product.id ? (
                      <><Check size={14} strokeWidth={3} /> In Vault</>
                    ) : (
                      <><ShoppingBag size={14} strokeWidth={2.5} /> Add to Vault</>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-6 space-y-3 px-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-white font-serif text-xl group-hover:text-gold transition-colors duration-300 leading-tight">
                    {product.name}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
                    {product.metal_type || '22K Gold'}
                  </span>
                  <span className="text-gold font-serif text-sm tracking-tighter">
                    PKR {Number(product.fixed_price).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- VIEW ALL BUTTON --- */}
        <div className="mt-32 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/collections')}
            className="group relative px-16 py-6 border border-gold/20 text-gold text-[10px] tracking-[0.5em] uppercase transition-all duration-500 hover:border-gold hover:text-white overflow-hidden"
          >
            <span className="relative z-10 font-black">Explore All Masterpieces</span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}