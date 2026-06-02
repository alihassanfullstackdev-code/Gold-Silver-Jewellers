import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface TickerRates {
  gold_24k: number;
  gold_22k: number;
  gold_21k: number;
  gold_18k: number;
  silver: number;
  platinum: number;
}

export default function RatesTicker() {
  const [rates, setRates] = useState<TickerRates | null>(null);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchActiveRates = async () => {
      try {
        const response = await axios.get(`${API_URL}/live-rates/active`);
        if (response.data.success) {
          setRates(response.data.rates);
        }
      } catch (error) {
        console.error("Rates stream sync failure:", error);
      }
    };

    fetchActiveRates();
    const interval = setInterval(fetchActiveRates, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [API_URL]);

  if (!rates) return null;

  // Premium text formatting with micro-spacing
  const tickerItems = [
    { label: 'GOLD 24K', val: rates.gold_24k },
    { label: 'GOLD 22K', val: rates.gold_22k },
    { label: 'GOLD 21K', val: rates.gold_21k },
    { label: 'GOLD 18K', val: rates.gold_18k },
    { label: 'FINE SILVER', val: rates.silver },
    { label: 'PLATINUM', val: rates.platinum },
  ];

  // Rendering items array helper for infinite clones
  const renderTickerContent = () => (
    <div className="flex items-center gap-16 pr-16 shrink-0">
      {tickerItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 font-sans font-medium text-[11px] tracking-[0.18em]">
          <span className="text-white/40">•</span>
          <span className="text-white/60 uppercase">{item.label}:</span>
          <span className="text-[#E5C787] font-mono font-bold">
            PKR {Number(item.val).toLocaleString()}
            <span className="text-[9px] text-white/30 font-sans font-normal lowercase ml-1">/tola</span>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-[#070707] via-[#0D0D0D] to-[#070707] border-b border-white/[0.04] py-3 overflow-hidden select-none relative z-[50] flex items-center">
      
      {/* 1. FIXED LIVE INDICATOR (Not Sticky - Slides Up With Header) */}
      <div className="flex items-center gap-2 pl-6 pr-4 border-r border-white/10 text-white font-extrabold shrink-0 bg-[#0A0A0A]/90 relative z-10 backdrop-blur-sm">
        <div className="relative flex h-2 w-2 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C787] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E5C787]"></span>
        </div>
        <TrendingUp size={12} className="text-[#E5C787]/80 shrink-0" />
        <span className="text-[9px] tracking-[0.25em] text-white/80 font-sans font-black">MARKET METRICS</span>
      </div>

      {/* 2. FRAMER MOTION HARDWARE-ACCELERATED INFINITE SLIDER */}
      <div className="flex overflow-hidden relative w-full mask-gradient">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, '-50%'] }}
          transition={{
            ease: "linear",
            duration: 25, // Speed adjustment (Kam karne se tez hoga)
            repeat: Infinity,
          }}
        >
          {/* Loop layers to avoid gaps */}
          {renderTickerContent()}
          {renderTickerContent()}
          {renderTickerContent()}
          {renderTickerContent()}
        </motion.div>
      </div>

      {/* CSS Fade Effect at the right edge for ultra-luxury look */}
      <style>{`
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
        }
      `}</style>
    </div>
  );
}