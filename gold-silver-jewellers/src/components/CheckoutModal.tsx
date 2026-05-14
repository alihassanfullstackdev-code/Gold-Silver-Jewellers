import React, { useState } from 'react';
import axios from 'axios';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cart: any[];
}

const CheckoutModal = ({ isOpen, onClose, total, cart }: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/initiate`, {
        ...formData,
        total: total,
        cart: cart
      });

      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md border border-[#E5C787]/30 bg-[#050505] p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl tracking-widest text-[#E5C787]">SHIPPING DETAILS</h2>
          <button onClick={onClose} className="text-[#FAFAFA]/50 hover:text-[#E5C787]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="FULL NAME"
              required
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm tracking-widest text-[#FAFAFA] outline-none focus:border-[#E5C787] transition-colors"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <input
              type="email"
              placeholder="EMAIL"
              required
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm tracking-widest text-[#FAFAFA] outline-none focus:border-[#E5C787]"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="PHONE (03XX...)"
              required
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm tracking-widest text-[#FAFAFA] outline-none focus:border-[#E5C787]"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <textarea
              placeholder="COMPLETE SHIPPING ADDRESS"
              required
              rows={3}
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm tracking-widest text-[#FAFAFA] outline-none focus:border-[#E5C787] resize-none"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E5C787] py-4 text-xs font-bold uppercase tracking-[0.3em] text-[#050505] transition-all hover:bg-[#FAFAFA]"
          >
            {loading ? "PREPARING SECURE CHECKOUT..." : `CONTINUE TO PAYMENT • PKR ${total.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;