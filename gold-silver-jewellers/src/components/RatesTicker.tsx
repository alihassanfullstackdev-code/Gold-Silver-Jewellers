import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';

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
        // Backend explicit custom endpoint mapping configuration execution context
        const response = await axios.get(`${API_URL}/live-rates/active`);
        if (response.data.success) {
          setRates(response.data.rates);
        }
      } catch (error) {
        console.error("Rates continuous stream synchronization failure exception context:", error);
      }
    };

    fetchActiveRates();
    // Keep internal short interval polling mapping live to preserve multi-user cache fresh states
    const interval = setInterval(fetchActiveRates, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [API_URL]);

  if (!rates) return null;

  // Premium template formatting tracking setup representation matching structural parameters layout
  const tickerString = `• GOLD 24K: PKR ${Number(rates.gold_24k).toLocaleString()}/Tola ` +
                       `• GOLD 22K: PKR ${Number(rates.gold_22k).toLocaleString()}/Tola ` +
                       `• GOLD 21K: PKR ${Number(rates.gold_21k).toLocaleString()}/Tola ` +
                       `• GOLD 18K: PKR ${Number(rates.gold_18k).toLocaleString()}/Tola ` +
                       `• FINE SILVER: PKR ${Number(rates.silver).toLocaleString()}/Tola ` +
                       `• PLATINUM: PKR ${Number(rates.platinum).toLocaleString()}/Tola • `;

  return (
    <div className="w-full bg-[#0A0A0A] border-b border-white/[0.05] py-2.5 overflow-hidden select-none relative z-[50]">
      <div className="flex whitespace-nowrap min-w-full items-center text-[9px] tracking-[0.22em] font-sans font-bold uppercase text-[#E5C787]/90">
        
        {/* Frozen Core Live Metadata Identity Tag */}
        <div className="inline-flex items-center gap-2 px-4 border-r border-white/10 text-white font-extrabold shrink-0 bg-black/60 py-0.5 rounded-sm ml-2">
          <TrendingUp size={11} className="text-[#E5C787] animate-pulse shrink-0" />
          <span className="text-[8px] tracking-[0.25em] text-white/60">LIVE JEWELLERY MARKET METRICS:</span>
        </div>

        {/* Dynamic Continuous Seamless Animation Loop Chains */}
        <div className="animate-[marquee_30s_linear_infinite] flex shrink-0 items-center gap-4 pl-4">
          <span>{tickerString}</span>
          <span>{tickerString}</span>
        </div>
        
        <div className="animate-[marquee_30s_linear_infinite] flex shrink-0 items-center gap-4 pl-4" aria-hidden="true">
          <span>{tickerString}</span>
          <span>{tickerString}</span>
        </div>

      </div>
    </div>
  );
}