import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: number;
  name: string;
  image: string;
  metal_type: string;
  fixed_price: number;
  making_charges: number; // Added this field
  quantity: number;
}

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Actual Price calculation: (Fixed + Making) * Quantity
  const subtotal = cartItems.reduce((acc: number, item: CartItem) => {
    const actualPrice = Number(item.fixed_price || 0) + Number(item.making_charges || 0);
    return acc + (actualPrice * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-40 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-white/5 pb-8 flex justify-between items-end">
          <div>
            {/* <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold">Your Selection</span> */}
            <h1 className="font-serif text-5xl md:text-7xl mt-4">The <span className="italic text-gold">Cart</span></h1>
          </div>
          <p className="text-white/40 text-xs tracking-widest uppercase">{cartItems.length} Items</p>
        </header>

        {cartItems.length === 0 ? (
          <div className="py-20 text-center space-y-8">
            <div className="flex justify-center text-white/10">
              <ShoppingBag size={100} strokeWidth={0.5} />
            </div>
            <p className="font-serif italic text-white/30 text-2xl tracking-widest">Your cart is empty.</p>
            <Link to="/collections" className="inline-block px-12 py-4 border border-gold text-gold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-500 font-bold">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item: CartItem) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-6 border-b border-white/5 pb-8 group"
                  >
                    {/* Updated Image Path Logic */}
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-[#080808] border border-white/10 overflow-hidden">
                      <img 
                        src={item.image?.startsWith('http') 
                          ? item.image 
                          : `${API_BASE_URL.replace('/api', '')}/storage/${item.image}`} 
                        className="w-full h-full object-cover" 
                        alt={item.name}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-serif text-lg md:text-xl text-white group-hover:text-gold transition-colors">{item.name}</h3>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">{item.metal_type}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-white/10 p-1 space-x-4">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-white/40 hover:text-gold"><Minus size={14} /></button>
                          <span className="text-xs font-serif">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-white/40 hover:text-gold"><Plus size={14} /></button>
                        </div>
                        <p className="font-serif text-gold text-sm md:text-lg">
                          {/* ACTUAL PRICE: (Fixed + Making) * Quantity */}
                          PKR {((Number(item.fixed_price || 0) + Number(item.making_charges || 0)) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-1">
              <div className="bg-[#080808] border border-white/5 p-8 sticky top-40 space-y-8">
                <h4 className="font-serif text-xl">Order Summary</h4>
                <div className="space-y-4 border-b border-white/5 pb-6">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                    <span>Subtotal</span>
                    <span>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                    <span>Shipping</span>
                    <span className="text-gold">Complimentary</span>
                  </div>
                </div>
                <div className="flex justify-between font-serif text-xl">
                  <span>Total</span>
                  <span className="text-gold">PKR {subtotal.toLocaleString()}</span>
                </div>
                <button className="w-full py-5 bg-gold text-black font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all duration-500">
                  Secure Checkout
                </button>
                <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] text-center italic">
                  Crafted with precision, delivered with care.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}