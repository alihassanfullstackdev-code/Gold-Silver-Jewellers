import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, X, RefreshCw, Package } from 'lucide-react';

interface Order {
  id: number;
  order_id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string; 
  address?: string; // Fallback mapping variable if name is changed on db
  total_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  cart_details: string; 
  created_at: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${id}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        // Local active state logic update synchronization
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
      }
    } catch (error) {
      alert("Backend API pipeline processing error.");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'failed': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'canceled': return 'bg-white/10 text-white/40 border border-white/5';
      default: return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  const parsedCart = (json: string) => {
    try { return JSON.parse(json); } catch { return []; }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      
      {/* Component Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-serif text-2xl tracking-widest uppercase text-[#E5C787]">Orders Manager</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Track user acquisitions, checkout states, and logistics.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/10 text-[10px] tracking-widest uppercase hover:text-[#E5C787] hover:border-[#E5C787] transition-all bg-white/5 self-start"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Sync Records
        </button>
      </div>

      {/* Filter Quick Switches */}
      <div className="flex flex-wrap gap-1.5">
        {['all', 'pending', 'completed', 'failed', 'canceled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1.5 text-[9px] uppercase font-bold tracking-wider transition-all border ${
              filterStatus === status 
                ? 'bg-[#E5C787] text-black border-[#E5C787]' 
                : 'bg-transparent text-white/50 border-white/5 hover:text-white'
            }`}
          >
            {status} ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Content Rendering Block */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="animate-spin text-[#E5C787]" size={28} />
          <p className="text-[10px] uppercase tracking-widest text-white/30">Reading Secure Vault Datastore...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center border border-white/5 bg-white/[0.01]">
          <Package className="mx-auto text-white/10 mb-2" size={36} strokeWidth={1} />
          <p className="font-serif italic text-white/40 text-sm">No orders recorded in this state context.</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto border border-white/5 bg-black/20">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[9px] tracking-widest text-white/40 uppercase font-bold">
                <th className="p-3 pl-4">ID / Reference</th>
                <th className="p-3">Customer info</th>
                <th className="p-3">Total Value</th>
                <th className="p-3">Status State</th>
                <th className="p-3 pr-4 text-right">Action Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-white/80">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-3 pl-4 font-mono text-[#E5C787] font-bold">
                    {order.order_id}
                    <span className="block text-[9px] font-sans text-white/30 tracking-widest uppercase mt-0.5">{order.order_reference}</span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white group-hover:text-[#E5C787] transition-colors">{order.customer_name}</div>
                    <div className="text-[10px] text-white/40 font-mono mt-0.5">{order.customer_phone}</div>
                  </td>
                  <td className="p-3 font-serif text-[#E5C787]">
                    PKR {Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-2.5 py-1 border border-white/10 hover:border-[#E5C787] hover:text-[#E5C787] bg-white/5 text-[9px] uppercase tracking-wider font-bold rounded"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Panel (Status Control + Item Manifest view details slideover) */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[999]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-[#090909] border-l border-white/5 p-6 z-[1000] flex flex-col shadow-2xl text-white">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <div>
                  <h3 className="font-serif text-lg tracking-wider text-[#E5C787] uppercase font-bold">{selectedOrder.order_id}</h3>
                  <p className="text-[9px] text-white/40 tracking-widest uppercase">Audit & Processing Segment</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
              </div>

              {/* Status Update Action Controllers */}
              <div className="bg-white/[0.01] border border-white/5 p-4 mb-4 space-y-2">
                <h4 className="text-[9px] font-bold tracking-widest uppercase text-[#E5C787]">Update Order Logistics Route</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['pending', 'completed', 'failed', 'canceled'] as const).map((st) => (
                    <button
                      key={st}
                      disabled={actionLoading === selectedOrder.id || selectedOrder.status === st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`py-1.5 text-[8px] uppercase tracking-wider font-bold border transition-all ${
                        selectedOrder.status === st 
                          ? 'bg-white/10 border-[#E5C787] text-[#E5C787] cursor-not-allowed'
                          : 'bg-black/30 border-white/5 text-white/60 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Map Information block */}
              <div className="text-[11px] space-y-1 mb-4 border-b border-white/5 pb-3">
                <p className="text-white/40 uppercase text-[8px] tracking-wider">Target Ship-To Address</p>
                <p className="text-white/80 italic font-sans leading-relaxed">{selectedOrder.shipping_address || selectedOrder.address}</p>
              </div>

              {/* Cart Products List nested scanner loop */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <p className="text-white/40 uppercase text-[8px] tracking-wider mb-1">Products Pack Manifest</p>
                {parsedCart(selectedOrder.cart_details).map((item: any, idx: number) => (
                  <div key={idx} className="p-2.5 border border-white/5 bg-white/[0.01] flex justify-between items-center text-xs">
                    <div>
                      <h5 className="font-serif uppercase tracking-wide text-white/90">{item.name}</h5>
                      <p className="text-[9px] text-white/40 uppercase mt-0.5">Qty: <span className="text-white font-bold">{item.quantity}</span> • {item.metal_type || 'Premium Spec'}</p>
                    </div>
                    <p className="text-[#E5C787] font-mono text-[10px]">PKR {((Number(item.fixed_price || 0) + Number(item.making_charges || 0)) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Gross Value</span>
                <span className="font-serif text-lg font-bold text-[#E5C787]">PKR {Number(selectedOrder.total_amount).toLocaleString()}</span>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}