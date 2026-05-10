import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = 0.8; // Cinematic slow motion
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* CLEAN VIDEO BACKGROUND
        Maine saari opacity aur filters hata diye hain. Ab video 100% clear dikhayegi.
      */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          loop
          className="h-full w-full object-cover" // Ab video full bright hai
        >
          <source src="videos/bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* OVERLAYS REMOVED
          Maine saare gradient aur dark overlays yahan se delete kar diye hain.
        */}
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
          <div className="h-[1px] w-8 bg-gold/80" />
          <span className="font-sans text-[10px] uppercase tracking-[0.5em] text-gold font-black">
            Since 1992
          </span>
          <div className="h-[1px] w-8 bg-gold/80" />
        </motion.div>
        
        {/* Main Heading
          Video clear hone ki wajah se text readability ke liye maine 'drop-shadow-lg' add kiya hai.
        */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-serif text-5xl leading-[1.1] font-medium tracking-tight md:text-8xl text-white max-w-5xl drop-shadow-lg"
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
          // Text color thora bright kiya hai taake clear video par nazar aaye
          className="mt-8 max-w-lg text-sm md:text-base text-slate-200 font-light tracking-wide leading-relaxed drop-shadow"
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
        </motion.div>
      </div>
      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 h-20 w-20 border-t border-l border-gold/30 pointer-events-none hidden md:block" />
      <div className="absolute bottom-10 right-10 h-20 w-20 border-b border-r border-gold/30 pointer-events-none hidden md:block" />
    </section>
  );
}