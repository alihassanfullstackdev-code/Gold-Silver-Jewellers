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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products?all=true`)
      .then(res => {
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 8));
        }
      })
      .catch(err => console.error("Collection fetch failed", err))
      .finally(() => setLoading(false));
  }, [API_BASE_URL]);

  const handleQuickAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation(); // Parent click event ko rokne ke liye
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading || !products || products.length === 0) return null;

  return (
    <section className="bg-[#030303] py-20 md:py-32 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Heading Section */}
        <div className="mb-16 md:mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
              <h2 className="font-serif text-4xl md:text-7xl text-white tracking-tighter uppercase">
                Our <span className="italic text-gold lowercase">Collection</span>
              </h2>
              <div className="h-[1px] w-6 md:w-8 bg-gold/40" />
            </div>
          </motion.div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
              // Name click par product page nahi, collections page khulega
              onClick={() => navigate(`/collections`)}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#080808] border border-white/10 group-hover:border-gold/30 transition-all duration-700">
                <img
                  src={product.image?.startsWith('http')
                    ? product.image
                    : `${API_BASE_URL.replace('/api', '')}/storage/${product.image}`}
                  className="w-full h-full object-cover opacity-90 lg:opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                  alt={product.name}
                  onError={(e: any) => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }}
                />

                {/* Responsive Button logic: 
                    - Mobile/Tablet (lg:translate-y-4 lg:opacity-0): Buttons hamesha visible honge aur nichay fix honge.
                    - Desktop (group-hover:translate-y-0 group-hover:opacity-100): Hover par show honge.
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:from-black/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 flex items-end justify-center p-4 md:p-6 lg:translate-y-4 lg:group-hover:translate-y-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    disabled={addedId === product.id}
                    className="w-full py-3 md:py-4 bg-white/90 backdrop-blur-md text-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black flex items-center justify-center gap-2 md:gap-3 hover:bg-gold hover:text-black transition-colors"
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
              <div className="mt-4 md:mt-6 space-y-2 md:space-y-3 px-1">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="text-white font-serif text-lg md:text-xl group-hover:text-gold transition-colors duration-300 leading-tight">
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[8px] md:text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
                    {product.metal_type || '22K Gold'}
                  </span>
                  <span className="text-gold font-serif text-sm tracking-tighter">
                    PKR {(Number(product.fixed_price || 0) + Number(product.making_charges || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-20 md:mt-32 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/collections')}
            className="group relative px-10 md:px-16 py-4 md:py-6 border border-gold/20 text-gold text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] uppercase transition-all duration-500 hover:border-gold hover:text-white overflow-hidden"
          >
            <span className="relative z-10 font-black">Explore All Masterpieces</span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}