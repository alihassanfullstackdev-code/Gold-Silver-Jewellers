import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Truck, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: any) => void;
  loading: boolean;
  total: number;
}

export default function CheckoutModal({ isOpen, onClose, onConfirm, loading, total }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    orderNotes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData); // Parent component (Cart ya CartDrawer) ko pass karega data
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md border border-[#E5C787]/30 bg-[#050505] p-8 shadow-2xl relative my-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#FAFAFA]/40 hover:text-[#E5C787] transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="font-serif text-2xl tracking-widest text-[#E5C787] mb-2 text-center uppercase">Shipping Details</h2>
        <p className="text-[10px] text-center text-[#FAFAFA]/40 tracking-[0.2em] uppercase mb-8 flex items-center justify-center gap-1.5">
          <Truck size={12} className="text-[#E5C787]" /> Method: <span className="text-[#E5C787] font-bold">Cash On Delivery (COD)</span>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text" placeholder="FULL NAME" required
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] transition-all"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              type="email" placeholder="EMAIL" required
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] transition-all"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text" placeholder="PHONE" required
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] transition-all"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <input
            type="text" placeholder="CITY" required
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] transition-all"
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <textarea
            placeholder="COMPLETE SHIPPING ADDRESS" required rows={2}
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] resize-none transition-all"
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <textarea
            placeholder="ORDER NOTES (OPTIONAL)" rows={2}
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] resize-none transition-all"
            onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
          />

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#E5C787] py-4 text-xs font-bold uppercase tracking-[0.3em] text-[#050505] transition-all duration-500 hover:bg-[#FAFAFA] flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : `CONFIRM COD ORDER • PKR ${total.toLocaleString()}`}
          </button>
        </form>
      </motion.div>
    </div>
  );
}