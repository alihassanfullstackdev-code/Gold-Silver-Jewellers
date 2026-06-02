import React from 'react';
import { Eye } from 'lucide-react';

interface OrderRowProps {
  order: any;
  onInspect: () => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order, onInspect }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/10';
      case 'failed': return 'bg-rose-500/5 text-rose-400 border border-rose-500/10';
      case 'canceled': return 'bg-white/5 text-white/40 border border-white/10';
      default: return 'bg-amber-500/5 text-amber-400 border border-amber-500/10';
    }
  };

  return (
    <tr className="hover:bg-white/[0.01] transition-colors duration-200 group border-b border-white/5">
      <td className="p-4 font-mono text-[#E5C787] font-semibold tracking-wider">
        {order.order_id}
        <span className="block text-[9px] font-sans text-white/30 tracking-widest uppercase mt-0.5">
          {order.order_reference}
        </span>
      </td>
      <td className="p-4">
        <div className="font-semibold text-white group-hover:text-[#E5C787] transition-colors duration-300">
          {order.customer_name}
        </div>
        <div className="text-[10px] text-white/40 font-mono mt-0.5">{order.customer_phone}</div>
      </td>
      <td className="p-4 font-serif text-[#E5C787] font-medium">
        PKR {Number(order.total_amount).toLocaleString()}
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${getStatusBadge(order.status)}`}>
          {order.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={onInspect}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-[#E5C787] hover:text-[#E5C787] bg-white/[0.02] hover:bg-[#E5C787]/5 text-[9px] uppercase tracking-widest font-bold transition-all duration-300 rounded"
        >
          <Eye size={11} /> Inspect
        </button>
      </td>
    </tr>
  );
};