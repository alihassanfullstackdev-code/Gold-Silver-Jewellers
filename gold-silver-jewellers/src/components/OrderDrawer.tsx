import React from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface OrderDrawerProps {
  order: any;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
  actionLoading: boolean;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({ order, onClose, onUpdateStatus, actionLoading }) => {
  const parsedCart = () => {
    try { return JSON.parse(order.cart_details); } catch { return []; }
  };

  const statuses = ['pending', 'completed', 'failed', 'canceled'] as const;

  return (
    <>
      {/* Backdrop overlay layer masking with high speed hardware animation execution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[999]"
      />

      {/* Main Luxury Slide-Out panel sheet layout container layout */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#090909] border-l border-white/5 p-6 z-[1000] flex flex-col shadow-2xl text-white"
      >
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
          <div>
            <h3 className="font-serif text-lg tracking-widest text-[#E5C787] uppercase font-bold">{order.order_id}</h3>
            <p className="text-[9px] text-white/40 tracking-widest uppercase mt-0.5">Audit Processing Vault</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors duration-200 p-1 hover:rotate-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Status Action Modification Grid */}
        <div className="bg-white/[0.01] border border-white/5 p-4 mb-4">
          <h4 className="text-[9px] font-bold tracking-widest uppercase text-[#E5C787] mb-2.5">Update Logistics Route</h4>
          <div className="grid grid-cols-2 gap-2">
            {statuses.map((st) => {
              const isActive = order.status === st;
              return (
                <button
                  key={st}
                  disabled={actionLoading || isActive}
                  onClick={() => onUpdateStatus(order.id, st)}
                  className={`py-2 text-[9px] uppercase tracking-widest font-bold border transition-all duration-200 flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-[#E5C787]/10 border-[#E5C787] text-[#E5C787] cursor-not-allowed'
                      : 'bg-black/30 border-white/5 text-white/50 hover:border-white/20 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {actionLoading && isActive && <Loader2 size={10} className="animate-spin" />}
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Physical target address parameter block mapping */}
        <div className="text-xs space-y-1 mb-5 border-b border-white/5 pb-4">
          <p className="text-white/40 uppercase text-[8px] tracking-widest">Target Destination</p>
          <p className="text-white/90 italic font-sans leading-relaxed pt-0.5">
            {order.shipping_address || order.customer_address || order.address}
          </p>
        </div>

        {/* Dynamic Cart items nested loop stream array mapping logic */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          <p className="text-white/40 uppercase text-[8px] tracking-widest mb-1.5">Products Pack Manifest</p>
          {parsedCart().map((item: any, idx: number) => (
            <div key={idx} className="p-3 border border-white/5 bg-white/[0.01] flex justify-between items-center text-xs hover:border-white/10 transition-all duration-300">
              <div>
                <h5 className="font-serif uppercase tracking-wide text-white/90 font-medium">{item.name}</h5>
                <p className="text-[9px] text-white/40 uppercase mt-1">
                  Qty: <span className="text-white font-bold">{item.quantity}</span> • {item.metal_type || '22K Gold Spec'}
                </p>
              </div>
              <p className="text-[#E5C787] font-mono text-[11px] font-semibold">
                PKR {((Number(item.fixed_price || 0) + Number(item.making_charges || 0)) * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Summary Footer Area */}
        <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center bg-black/20 p-3">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Gross Invoice value</span>
          <span className="font-serif text-xl font-bold text-[#E5C787]">
            PKR {Number(order.total_amount).toLocaleString()}
          </span>
        </div>
      </motion.div>
    </>
  );
};