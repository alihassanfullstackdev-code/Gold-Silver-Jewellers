import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); 
          return 100;
        }
        return prev + 1;
      });
    }, 20); 

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303]"
    >
      <div className="relative flex flex-col items-center">
        
        {/* Static Logo with Subtle Glow Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.95, 1, 0.95], // Breathing effect
            opacity: 1 
          }}
          transition={{ 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1 }
          }}
          className="relative h-32 w-32 md:h-40 md:w-40"
        >
          <img 
            src="/images/logo.png" 
            alt="GoldSilver Logo" 
            className="h-full w-full object-contain filter drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          />
        </motion.div>

        {/* Branding Text */}
        <div className="mt-8 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-serif text-2xl italic tracking-[0.2em] text-gold"
          >
            SilverGold <span className="text-white">& Jewellers</span>
          </motion.h2>
        </div>

        {/* Counter */}
        <div className="mt-10 h-[1px] w-48 bg-white/10 relative overflow-hidden">
          {/* Progress Bar Line */}
          <motion.div 
            className="absolute inset-0 bg-gold origin-left"
            style={{ scaleX: counter / 100 }}
          />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-sm tracking-widest text-gold/60">
            {counter}%
          </div>
        </div>
      </div>

      {/* Decorative Branding at Bottom */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-10 font-sans text-[8px] uppercase tracking-[0.6em] text-slate-600"
      >
        Excellence in Craftsmanship
      </motion.p>
    </motion.div>
  );
}