import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

const CATEGORIES = ['All', 'Gold', 'Silver', 'Diamonds'];

const ALL_PRODUCTS = [
  { id: 5, name: 'Royal Solitaire', type: 'Diamonds', price: '$8,900', img: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600' },
  { id: 6, name: 'Minimalist Hoop', type: 'Gold', price: '$1,200', img: 'https://images.unsplash.com/photo-1635767793021-ef783b999127?auto=format&fit=crop&q=80&w=600' },
  { id: 7, name: 'Artisan Silver Link', type: 'Silver', price: '$540', img: 'https://images.unsplash.com/photo-1626784213176-7483008d6844?auto=format&fit=crop&q=80&w=600' },
  { id: 8, name: 'Brilliant Tennis Chain', type: 'Diamonds', price: '$15,400', img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&q=80&w=600' },
  { id: 9, name: 'Vintage Signet', type: 'Gold', price: '$2,150', img: 'https://images.unsplash.com/photo-1611085583191-a3b13b448651?auto=format&fit=crop&q=80&w=600' },
  { id: 10, name: 'Sleek Bangle', type: 'Silver', price: '$680', img: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&q=80&w=600' },
];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ALL_PRODUCTS.filter(p => 
    activeCategory === 'All' || p.type === activeCategory
  );

  return (
    <section className="bg-transparent py-32 md:py-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center justify-between gap-8 md:flex-row">
          <h3 className="font-serif text-3xl font-medium md:text-5xl text-slate-800">Top Sellers</h3>
          
          <div className="flex flex-wrap items-center gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2 font-sans text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border-b cursor-pointer",
                  activeCategory === cat ? "border-gold text-gold font-bold" : "border-transparent text-gray-400 hover:text-slate-800"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="group overflow-hidden rounded-sm bg-white p-2 shadow-sm ring-1 ring-gold/10 hover:shadow-premium transition-all duration-500 md:p-3"
              >
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img
                    src={product.img}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain p-2 md:p-6 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <button className="absolute bottom-2 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 font-sans text-[8px] uppercase tracking-[0.2em] bg-gold text-white px-4 py-2 font-bold shadow-xl cursor-pointer hover:bg-slate-800 transition-colors md:bottom-6 md:px-8 md:py-3 md:text-[10px]">
                    Add to Bag
                  </button>
                </div>
                <div className="mt-3 flex flex-col justify-between px-1 md:mt-6 md:flex-row md:items-center md:px-2">
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm tracking-tight text-slate-800 md:text-lg truncate">{product.name}</h4>
                    <span className="font-sans text-[8px] uppercase tracking-widest text-gray-400 md:text-[9px]">{product.type}</span>
                  </div>
                  <span className="font-serif text-xs text-gold font-semibold md:text-base">{product.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
