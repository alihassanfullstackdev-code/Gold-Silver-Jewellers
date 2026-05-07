import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Props {
  title: string;
  subtitle: string;
  filterType: 'is_new_arrival' | 'is_top_seller' | 'is_featured';
}

export default function ProductSection({ title, subtitle, filterType }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // API Base URL handle karne ke liye
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        
        // Railway response format ke mutabiq products nikalna
        const productsArray = res.data?.data || []; 
        
        // Filter logic: Check karein ke column 1 hai ya true
        const filtered = productsArray.filter((p: any) => 
          p[filterType] === 1 || p[filterType] === true || p[filterType] === "1"
        );
        
        setProducts(filtered);
      } catch (err) {
        console.error(`${title} fetch failed:`, err);
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterType, title, API_BASE_URL]);

  if (loading) return (
    <div className="h-[400px] flex items-center justify-center bg-[#030303]">
      <Loader2 className="animate-spin text-gold" size={32} />
    </div>
  );

  // Agar database khali ho toh error ke bajaye section hide ho jaye
  if (!products || products.length === 0) return null;

  // Infinite effect ke liye array ko duplicate karein
  const infiniteProducts = [...products, ...products];
  
  // Carousel width calculation
  const singleSetWidth = products.length * 390;

  return (
    <section className="relative bg-[#030303] py-20 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-gold/50" />
            <span className="font-sans text-[10px] uppercase tracking-[0.6em] text-gold font-black">{subtitle}</span>
            <div className="h-[1px] w-6 bg-gold/50" />
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-white tracking-tight">
            {title.split(' ')[0]} <span className="italic text-gold">{title.split(' ').slice(1).join(' ')}</span>
          </h2>
        </motion.div>
      </div>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-10"
          animate={{
            x: [0, -singleSetWidth],
          }}
          transition={{
            x: {
              repeat: Infinity,
              duration: products.length * 4, // Speed adjustment
              ease: "linear",
              repeatType: "loop"
            },
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {infiniteProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="group w-[280px] md:w-[350px] flex-shrink-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#080808] border border-white/10 group-hover:border-gold/40 transition-all duration-700 shadow-2xl">
                <img 
                  // Image path handle karne ke liye logic
                  src={product.image?.startsWith('http') ? product.image : `${API_BASE_URL}/storage/${product.image}`} 
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" 
                  alt={product.name}
                  onError={(e: any) => { e.target.src = 'https://placehold.co/400x500?text=No+Image'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute right-5 top-5 flex flex-col space-y-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                  <button className="h-11 w-11 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white hover:text-gold">
                    <Heart size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-8 text-center px-4">
                <h3 className="font-serif text-2xl text-white group-hover:text-gold transition-colors truncate">{product.name}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-20 pointer-events-none" />
    </section>
  );
}