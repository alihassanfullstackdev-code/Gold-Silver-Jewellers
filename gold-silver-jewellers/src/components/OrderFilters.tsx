import React from 'react';

interface OrderFiltersProps {
  currentFilter: string;
  setFilter: (status: string) => void;
  counts: Record<string, number>;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ currentFilter, setFilter, counts }) => {
  const statuses = ['all', 'pending', 'completed', 'failed', 'canceled'];

  return (
    <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => setFilter(status)}
          className={`relative px-4 py-2 text-[10px] uppercase font-bold tracking-[0.15em] transition-all duration-300 ${
            currentFilter === status
              ? 'text-black font-extrabold'
              : 'text-white/50 hover:text-white'
          }`}
        >
          <span className="relative z-10">
            {status} <span className="opacity-60 ml-0.5">({counts[status] || 0})</span>
          </span>
          {currentFilter === status && (
            <div 
              className="absolute inset-0 bg-[#E5C787] layout-id-indicator"
              style={{ mixBlendMode: 'normal' }}
            />
          )}
        </button>
      ))}
    </div>
  );
};