import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Subtotal Calculation
  const subtotal = cartItems.reduce((acc: number, item: CartItem) => {
    const price = Number(item.fixed_price || 0) + Number(item.making_charges || 0);
    return acc + (price * item.quantity);
  }, 0);

  // --- ERROR-FREE CHECKOUT LOGIC ---
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      // Mapping cart items to ensure keys match backend exactly
      const sanitizedCart = cartItems.map((item: CartItem) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        fixed_price: Number(item.fixed_price),
        making_charges: Number(item.making_charges),
        quantity: Number(item.quantity)
      }));

      const response = await axios.post(`${API_BASE_URL}/payment/initiate`, {
        total: subtotal,
        email: "customer@gmail.com", 
        name: "Valued Customer",
        phone: "923001234567",
        cart: sanitizedCart
      });

      if (response.data.success && response.data.checkout_url) {
        // Direct redirection to bSecure
        window.location.href = response.data.checkout_url;
      } else {
        console.error("Backend Response:", response.data);
        alert("Payment Error: " + (response.data.message || "Please check console."));
      }
    } catch (error: any) {
      console.error("Axios Error:", error);
      const errorMsg = error.response?.data?.message || "Server connection failed.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-[#050505] border-l border-white/5 z-[2100] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-4">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-serif text-2xl tracking-widest uppercase">The Vault</h2>
              </div>
              <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300 text-white/30 hover:text-gold">
                <X size={28} />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-20">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="font-serif italic text-xl tracking-widest">Vault is empty.</p>
                </div>
              ) : (
                cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex gap-6 group relative border-b border-white/5 pb-6">
                    <div className="w-24 h-32 bg-white/5 border border-white/10 overflow-hidden shrink-0">
                      <img 
                        src={item.image?.startsWith('http') 
                          ? item.image 
                          : `${API_BASE_URL.replace('/api', '')}/storage/${item.image}`} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        alt={item.name}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-sm uppercase tracking-widest text-white/90 group-hover:text-gold transition-colors">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-white/10 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{item.metal_type || 'Premium Metal'}</p>
                        <p className="text-gold font-serif text-sm mt-2">
                          PKR {((Number(item.fixed_price) + Number(item.making_charges)) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4 border border-white/10 w-fit px-3 py-1 mt-4 bg-white/5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-gold transition-colors"><Minus size={14}/></button>
                        <span className="text-xs font-serif min-w-[24px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-gold transition-colors"><Plus size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sticky Checkout Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-black/60 border-t border-white/5 space-y-6 backdrop-blur-lg">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Vault Total</span>
                  <span className="text-3xl font-serif text-gold">PKR {subtotal.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-5 bg-gold text-black font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white transition-all duration-700 flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing Vault...
                    </>
                  ) : (
                    "Secure Checkout"
                  )}
                </button>

                <Link to="/cart" onClick={onClose} className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.3em] text-white/20 hover:text-gold transition-all duration-300">
                  Expand Details <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}