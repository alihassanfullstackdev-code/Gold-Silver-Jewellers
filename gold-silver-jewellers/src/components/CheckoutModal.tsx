import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  cart: any[];
}

const CheckoutModal = ({ isOpen, onClose, total, cart }: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    orderNotes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/orders/place-cod`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        address: formData.address,
        orderNotes: formData.orderNotes,
        total: total,
        cart: cart // Pura items ka array
      });

      if (response.data.success) {
        alert(`Order Placed! ID: ${response.data.order_id}`);
        onClose();
        navigate('/order-success');
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md border border-[#E5C787]/30 bg-[#050505] p-8 shadow-2xl relative">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-serif text-2xl tracking-widest text-[#E5C787]">SHIPPING DETAILS</h2>
          <button onClick={onClose} className="text-[#FAFAFA]/50 hover:text-[#E5C787]">✕</button>
        </div>
        
        <p className="text-[10px] text-[#FAFAFA]/40 tracking-[0.2em] uppercase mb-6">
          Method: <span className="text-[#E5C787] font-bold">Cash On Delivery (COD)</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="FULL NAME"
            required
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787]"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input
              type="email"
              placeholder="EMAIL"
              required
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787]"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="PHONE"
              required
              className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787]"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <input
            type="text"
            placeholder="CITY"
            required
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787]"
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <textarea
            placeholder="COMPLETE SHIPPING ADDRESS"
            required
            rows={2}
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] resize-none"
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <textarea
            placeholder="ORDER NOTES (OPTIONAL)"
            rows={2}
            className="w-full border-b border-[#E5C787]/20 bg-transparent py-2 text-sm text-[#FAFAFA] outline-none focus:border-[#E5C787] resize-none"
            onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E5C787] py-4 text-xs font-bold uppercase tracking-[0.3em] text-[#050505] transition-all hover:bg-[#FAFAFA]"
          >
            {loading ? "PLACING YOUR ORDER..." : `CONFIRM COD ORDER • PKR ${total.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;