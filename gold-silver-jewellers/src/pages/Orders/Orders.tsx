import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { Loader2, Package, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { OrderFilters } from '../../components/OrderFilters';
import { OrderRow } from '../../components/OrderRow';
import { OrderDrawer } from '../../components/OrderDrawer';

interface Order {
  id: number;
  order_id: string;
  order_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  customer_address?: string;
  address?: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'canceled';
  cart_details: string;
  created_at: string;
}

interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Real-time pagination indicators state blocks
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  });

  // Local calculation block tracking indexes counts arrays
  const [counts, setCounts] = useState<Record<string, number>>({
    all: 0, pending: 0, completed: 0, failed: 0, canceled: 0
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Single dynamic structural network endpoint query pipeline execution
  const fetchOrders = useCallback(async (page: number = 1, status: string = filterStatus) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        params: { page, status }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
          
          // Sync current array segmentation metadata context metrics counts locally
          setCounts(prev => ({
            ...prev,
            [status]: response.data.pagination.total
          }));
        }
      }
    } catch (error) {
      console.error("Secure tracking telemetry registry pipeline breach:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, filterStatus]);

  useEffect(() => {
    fetchOrders(1, filterStatus);
  }, [filterStatus, fetchOrders]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setActionLoading(id);
    try {
      const response = await axios.put(`${API_BASE_URL}/orders/${id}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
        }
        // Recalculate context records sequence mapping instantly
        fetchOrders(pagination.current_page, filterStatus);
      }
    } catch (error) {
      console.error("Failed status injection route mapping sync layout.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePageChange = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= pagination.last_page) {
      fetchOrders(targetPage, filterStatus);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-1">
      
      {/* Structural Module Control Headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-serif text-2xl tracking-widest uppercase text-[#E5C787]">Orders Manager</h2>
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Track user acquisitions, checkout states, and logistics.</p>
        </div>
        <button 
          onClick={() => fetchOrders(pagination.current_page, filterStatus)}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/10 text-[10px] tracking-widest uppercase hover:text-[#E5C787] hover:border-[#E5C787] transition-all duration-300 bg-white/5 self-start hover:bg-white/[0.08]"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Sync Records
        </button>
      </div>

      {/* Render Filters Segment Submodule */}
      <OrderFilters currentFilter={filterStatus} setFilter={setFilterStatus} counts={counts} />

      {/* Content Renderer Layer */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#E5C787]" size={32} />
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Reading Secure Vault Datastore...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center border border-white/5 bg-white/[0.01]">
          <Package className="mx-auto text-white/10 mb-3" size={40} strokeWidth={1} />
          <p className="font-serif italic text-white/40 text-sm">No orders recorded inside this data layer state.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-full overflow-x-auto border border-white/5 bg-black/20 backdrop-blur-md">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[9px] tracking-[0.2em] text-white/40 uppercase font-bold">
                  <th className="p-4">ID / Reference</th>
                  <th className="p-4">Customer info</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4">Status State</th>
                  <th className="p-4 text-right">Action Target</th>
                </tr>
              </thead>
              <tbody className="text-xs text-white/80">
                {orders.map((order) => (
                  <OrderRow 
                    key={order.id} 
                    order={order} 
                    onInspect={() => setSelectedOrder(order)} 
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Premium Minimal Pagination Control Layout Segment UI */}
          {pagination.last_page > 1 && (
            <div className="flex items-center justify-between border border-white/5 bg-black/40 px-4 py-3 text-xs">
              <div className="text-white/40 uppercase tracking-wider text-[10px]">
                Showing Page <span className="text-white font-semibold">{pagination.current_page}</span> of <span className="text-white font-semibold">{pagination.last_page}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.current_page === 1}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  className="p-1.5 border border-white/5 bg-white/[0.02] hover:border-white/20 disabled:opacity-20 disabled:hover:border-white/5 transition-all text-white rounded"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  className="p-1.5 border border-white/5 bg-white/[0.02] hover:border-white/20 disabled:opacity-20 disabled:hover:border-white/5 transition-all text-white rounded"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Details System Slider Block */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDrawer
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateStatus}
            actionLoading={actionLoading === selectedOrder.id}
          />
        )}
      </AnimatePresence>

    </div>
  );
}