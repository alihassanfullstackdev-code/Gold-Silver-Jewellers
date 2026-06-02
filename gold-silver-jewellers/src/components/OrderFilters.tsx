import React from 'react';
import { motion } from 'framer-motion';

interface OrderFiltersProps {
    currentFilter: string;
    setFilter: (status: string) => void;
    counts: Record<string, number>;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ currentFilter, setFilter, counts }) => {
    const statuses = ['all', 'pending', 'completed', 'failed', 'canceled'];

    return (
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
            {statuses.map((status) => {
                const isActive = currentFilter === status;
                return (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`relative px-4 py-2 text-[10px] uppercase font-bold tracking-[0.15em] transition-colors duration-300 ${isActive ? 'text-black' : 'text-white/50 hover:text-white'
                            }`}
                    >
                        {/* Context Text Elements */}
                        <span className="relative z-10 block transition-transform duration-200 active:scale-95">
                            {status}
                            <span className={`ml-1 text-[9px] font-mono ${isActive ? 'text-black/70' : 'text-white/30'}`}>
                                ({counts[status] !== undefined ? counts[status] : 0})
                            </span>
                        </span>

                        {/* Premium Hardware-Accelerated Sliding Liquid Indicator Background */}
                        {isActive && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute inset-0 bg-[#E5C787]"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                style={{ mixBlendMode: 'normal' }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};