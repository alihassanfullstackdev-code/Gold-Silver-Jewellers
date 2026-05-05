import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function TopSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState<number | null>(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products?all=true')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        const filtered = data.filter((p: any) => p.is_top_seller === 1 || p.is_top_seller === true);
        setProducts(filtered.slice(0, 4));
      })
      .catch(err => console.error("Top Sellers fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading || products.length === 0) return null;

  return (
    <section className="bg-[#030303] py-24 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
        <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {/* Subtitle with Horizontal Lines */}
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-[1px] w-6 bg-gold/50" />
      <span className="font-sans text-[10px] uppercase tracking-[0.6em] text-gold font-black">
        Most Coveted
      </span>
      <div className="h-[1px] w-6 bg-gold/50" />
    </div>

    {/* Dynamic Heading with Italic Gold Span */}
    <h2 className="font-serif text-5xl md:text-6xl text-white tracking-tight uppercase">
      Top <span className="italic text-gold lowercase">Sellers</span>
    </h2>
  </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Space-y-32 se gap thora kam kiya hai */}
        <div className="space-y-32">
          {products.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Image Side - Width 45% taake card chota lage */}
              <div className="w-full md:w-[45%] group relative">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#080808] border border-white/10 group-hover:border-gold/30 transition-all duration-700">
                  <img 
                    src={`http://127.0.0.1:8000/storage/${product.image}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    alt={product.name} 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                     <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-gold text-black p-3 rounded-full transform translate-y-5 group-hover:translate-y-0 transition-all duration-500 hover:bg-white"
                     >
                       <ShoppingBag size={18} />
                     </button>
                  </div>
                </div>
              </div>

              {/* Content Side - Width 40% aur font sizes thore compress kiye hain */}
              <div className={`w-full md:w-[40%] text-center ${index % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                <span className="text-gold text-[9px] uppercase tracking-[0.3em] font-bold">Limited Edition</span>
                <h3 className="font-serif text-3xl md:text-4xl text-white mt-3 mb-4 leading-tight">{product.name}</h3>
                <p className="text-white/40 text-xs font-light leading-relaxed mb-6 line-clamp-2 italic">
                  {product.description || 'A timeless masterpiece crafted with precision and soul.'}
                </p>
                
                <div className="space-y-6">
                  <div className={`flex flex-col ${index % 2 !== 0 ? 'items-end' : 'items-start'}`}>
                    <span className="text-2xl text-white font-serif mb-1">PKR {Number(product.fixed_price).toLocaleString()}</span>
                    <span className="text-[8px] text-white/20 uppercase tracking-widest">Premium Collection</span>
                  </div>

                  <div className={`flex flex-col sm:flex-row gap-3 ${index % 2 !== 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={addedId === product.id}
                      className="px-6 py-3 bg-gold text-black text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 flex items-center justify-center gap-2"
                    >
                      {addedId === product.id ? (
                        <>Added <Check size={12} /></>
                      ) : (
                        <>Add to Vault <ShoppingBag size={12} /></>
                      )}
                    </button>

                    <button className="px-6 py-3 border border-white/10 text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:border-gold transition-all duration-500 flex items-center justify-center gap-2">
                      Details <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}