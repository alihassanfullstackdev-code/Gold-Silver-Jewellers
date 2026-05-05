import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Heart, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getArrivals = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/products');
        const arrivals = res.data.data.filter((p: any) => p.is_new_arrival === 1 || p.is_new_arrival === true);
        setProducts(arrivals);
      } catch (err) {
        console.error("Backend connection failed", err);
      } finally {
        setLoading(false);
      }
    };
    getArrivals();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center bg-[#030303] text-gold">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="font-sans text-[10px] uppercase tracking-[0.4em]">Unveiling Masterpieces...</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  // Infinite effect ke liye items ko duplicate kiya
  const infiniteProducts = [...products, ...products];
  
  // Aik single set ki width calculate karein (Card width 350 + gap 40)
  const singleSetWidth = products.length * 390; 

  return (
    <section className="relative bg-[#030303] py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/10 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-gold/50" />
            <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tight">
              New <span className="italic text-gold">Arrival</span>
            </h2>
            <div className="h-[1px] w-6 bg-gold/50" />
          </div>
          <div className="mt-6 h-[1px] w-32 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </motion.div>
      </div>

      {/* Infinite Scroll Wrapper */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-10"
          animate={{
            // Hum sirf aik set ki width tak move karenge, phir ye jump karke reset ho jayega (jo nazar nahi aata)
            x: [0, -singleSetWidth], 
          }}
          transition={{
            x: {
              repeat: Infinity,
              duration: products.length * 3, // Speed adjustment
              ease: "linear", // Infinite ke liye linear zaroori hai taake jhatka na lage
              repeatType: "loop"
            },
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {infiniteProducts.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="group w-[280px] md:w-[350px] flex-shrink-0"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#080808] border border-white/10 transition-all duration-700 group-hover:border-gold/40 shadow-2xl">
                <img
                  src={`http://127.0.0.1:8000/storage/${product.image}`}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>

              <div className="mt-8 space-y-3 text-center px-4">
                <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-gold font-bold">
                  {product.metal_type} {product.karat ? `| ${product.karat}K` : ''}
                </span>
                <h3 className="font-serif text-2xl tracking-wide text-white group-hover:text-gold transition-colors duration-500 truncate">
                  {product.name}
                </h3>
                <p className="font-sans text-sm text-white/50 tracking-widest font-light">
                  PKR {Number(product.fixed_price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-y-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#030303] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-[#030303] to-transparent z-20 pointer-events-none" />
    </section>
  );
}