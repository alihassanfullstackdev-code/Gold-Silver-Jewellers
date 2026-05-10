import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.8; // Thoda slow playback mazeed cinematic lagta hai
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#030303]">
      {/* Cinematic Video Background with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          className="h-full w-full object-cover opacity-60" // Opacity kam ki taake text pop kare
        >
          <source src="videos/j-bg.webm" type="video/mp4" />
        </video>
        
        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 flex items-center gap-3"
        >
          <div className="h-[1px] w-8 bg-gold/50" />
          <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-gold font-black">
            Since 1992
          </span>
          <div className="h-[1px] w-8 bg-gold/50" />
        </motion.div>
        
        {/* Main Heading with Gold Gradient Text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-5xl leading-[1.1] font-medium tracking-tight md:text-8xl text-white max-w-5xl"
        >
          Timeless Artistry. <br />
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark drop-shadow-sm">
            Exquisite Luxury.
          </span>
        </motion.h1 >

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 max-w-lg text-sm md:text-base text-slate-400 font-light tracking-wide leading-relaxed"
        >
          Discover the allure of finely crafted masterpieces, where tradition meets modern elegance in every sparkle.
        </motion.p>

        {/* Premium Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12"
        >
          <button className="group relative flex items-center gap-4 border border-gold/50 bg-transparent px-10 py-4 transition-all duration-500 hover:border-gold">
            {/* Background Fill on Hover */}
            <div className="absolute inset-0 z-0 bg-gold scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100" />
            
            <span className="relative z-10 font-sans text-[11px] font-black uppercase tracking-[0.3em] text-gold transition-colors duration-500 group-hover:text-black">
              Explore Collection
            </span>
            <ArrowRight className="relative z-10 h-4 w-4 text-gold transition-all duration-500 group-hover:text-black group-hover:translate-x-2" />
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator - Redesigned */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
         <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-white/40 font-bold rotate-180 [writing-mode:vertical-lr]">
          Scroll
        </span>
        <div className="h-16 w-[1px] bg-gradient-to-b from-gold via-gold/20 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: [-64, 64] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
      
      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 h-20 w-20 border-t border-l border-gold/20 pointer-events-none hidden md:block" />
      <div className="absolute bottom-10 right-10 h-20 w-20 border-b border-r border-gold/20 pointer-events-none hidden md:block" />
    </section>
  );
}