import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartItem {
  id: number;
  name: string;
  image: string;
  metal_type?: string;
  fixed_price: number;
  making_charges: number;
  quantity: number;
}

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Actual Price calculation: (Fixed + Making) * Quantity
  const subtotal = cartItems.reduce((acc: number, item: CartItem) => {
    const actualPrice = Number(item.fixed_price || 0) + Number(item.making_charges || 0);
    return acc + (actualPrice * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-[#0a0a0a] border-l border-gold/10 z-[2100] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-serif text-2xl tracking-widest uppercase">The Vault</h2>
              </div>
              <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 text-white/50 hover:text-gold">
                <X size={28} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="font-serif italic text-xl tracking-widest text-center">Your collection is empty.</p>
                </div>
              ) : (
                cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-6 group relative">
                    {/* Updated Image Path Logic */}
                    <div className="w-24 h-28 bg-white/5 border border-white/10 overflow-hidden shrink-0">
                      <img 
                        src={item.image?.startsWith('http') 
                          ? item.image 
                          : `${API_BASE_URL.replace('/api', '')}/storage/${item.image}`} 
                        className="w-full h-full object-cover" 
                        alt={item.name}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm uppercase tracking-widest text-white/90">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {/* Show Total Price for Single Item */}
                        <p className="text-gold font-serif text-xs mt-1">
                          PKR {(Number(item.fixed_price || 0) + Number(item.making_charges || 0)).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 border border-white/10 w-fit px-3 py-1 mt-4">
                        <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-gold"><Minus size={14}/></button>
                        <span className="text-xs font-serif min-w-[20px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-gold"><Plus size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-black/40 border-t border-white/5 space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Vault Subtotal</span>
                  <span className="text-2xl font-serif text-gold">PKR {subtotal.toLocaleString()}</span>
                </div>
                <button className="w-full py-5 bg-gold text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-white transition-all duration-500">
                  Proceed to Checkout
                </button>
                <Link to="/cart" onClick={onClose} className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-gold transition-colors">
                  View Full Details <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}