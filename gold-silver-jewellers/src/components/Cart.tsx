import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

interface CartItem {
  id: number;
  name: string;
  image: string;
  metal_type: string;
  fixed_price: number;
  making_charges: number;
  quantity: number;
  sku?: string;
}

// --- CHECKOUT MODAL COMPONENT ---
const CheckoutModal = ({ isOpen, onClose, onConfirm, loading, subtotal }: any) => {
  const [details, setDetails] = useState({ name: '', email: '', phone: '', address: '' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md border border-gold/20 bg-[#080808] p-8 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-gold transition-colors">
          <X size={20} />
        </button>
        <h2 className="font-serif text-2xl tracking-[0.2em] text-gold mb-8 text-center uppercase">Shipping Details</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(details); }} className="space-y-5">
          <input
            type="text" placeholder="FULL NAME" required
            className="w-full bg-transparent border-b border-white/10 py-3 text-xs tracking-widest text-white outline-none focus:border-gold transition-all"
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email" placeholder="EMAIL" required
              className="w-full bg-transparent border-b border-white/10 py-3 text-xs tracking-widest text-white outline-none focus:border-gold transition-all"
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
            />
            <input
              type="text" placeholder="PHONE" required
              className="w-full bg-transparent border-b border-white/10 py-3 text-xs tracking-widest text-white outline-none focus:border-gold transition-all"
              onChange={(e) => setDetails({ ...details, phone: e.target.value })}
            />
          </div>
          <textarea
            placeholder="COMPLETE SHIPPING ADDRESS" required rows={3}
            className="w-full bg-transparent border-b border-white/10 py-3 text-xs tracking-widest text-white outline-none focus:border-gold transition-all resize-none"
            onChange={(e) => setDetails({ ...details, address: e.target.value })}
          />

          <button
            type="submit" disabled={loading}
            className="w-full bg-gold py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black hover:bg-white transition-all duration-500 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : `Confirm & Pay PKR ${subtotal.toLocaleString()}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- MAIN CART COMPONENT ---
export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const subtotal = cartItems.reduce((acc: number, item: CartItem) => {
    const actualPrice = Number(item.fixed_price || 0) + Number(item.making_charges || 0);
    return acc + (actualPrice * item.quantity);
  }, 0);

  // --- REPLACED CHECKOUT LOGIC ---
  const handleFinalCheckout = async (customerDetails: any) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/initiate`, {
        total: subtotal,
        ...customerDetails, // Ismein ab address, name, phone, email sab ja raha hai
        cart: cartItems 
      });

      if (response.data.success && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        alert("Checkout Error: " + (response.data.message || "Failed to initiate."));
      }
    } catch (error: any) {
      console.error("API Connection Error:", error);
      alert(error.response?.data?.message || "Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-40 pb-20 px-6 font-sans">
      
      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleFinalCheckout}
        loading={loading}
        subtotal={subtotal}
      />

      <div className="max-w-5xl mx-auto">
        <header className="mb-16 border-b border-white/5 pb-8 flex justify-between items-end">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl mt-4">The <span className="italic text-gold">Cart</span></h1>
          </div>
          <p className="text-white/40 text-xs tracking-widest uppercase">{cartItems.length} Items Selected</p>
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
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item: CartItem) => (
                  <motion.div
                    key={item.id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex gap-6 border-b border-white/5 pb-8 group"
                  >
                    <div className="w-24 h-32 md:w-32 md:h-40 bg-[#080808] border border-white/10 overflow-hidden">
                      <img 
                        src={item.image?.startsWith('http') 
                          ? item.image 
                          : `${API_BASE_URL.replace('/api', '')}/storage/${item.image}`} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
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
                        <div className="flex items-center border border-white/10 p-1 space-x-4 bg-white/5">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-white/40 hover:text-gold transition-colors"><Minus size={14} /></button>
                          <span className="text-xs font-serif min-w-[20px] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-white/40 hover:text-gold transition-colors"><Plus size={14} /></button>
                        </div>
                        <p className="font-serif text-gold text-sm md:text-lg">
                          PKR {((Number(item.fixed_price || 0) + Number(item.making_charges || 0)) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#080808] border border-white/5 p-8 sticky top-40 space-y-8 backdrop-blur-sm">
                <h4 className="font-serif text-xl border-b border-white/5 pb-4">Order Summary</h4>
                <div className="space-y-4 border-b border-white/5 pb-6">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                    <span>Subtotal</span>
                    <span>PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                    <span>Shipping</span>
                    <span className="text-emerald-400">Complimentary</span>
                  </div>
                </div>
                <div className="flex justify-between font-serif text-2xl">
                  <span>Total</span>
                  <span className="text-gold">PKR {subtotal.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={() => setIsModalOpen(true)} // Modal kholne ke liye
                  disabled={loading || cartItems.length === 0}
                  className="w-full py-5 bg-gold text-black font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 flex justify-center items-center gap-2 group"
                >
                   <ShieldCheck size={16} className="group-hover:text-emerald-600 transition-colors" />
                   Proceed to Checkout
                </button>

                <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] text-center italic">
                  Handcrafted in Pakistan.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}