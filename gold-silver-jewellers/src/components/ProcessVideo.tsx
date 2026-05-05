import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function ProcessVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [1.2, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative h-[120vh] w-full overflow-hidden bg-transparent">
      <motion.div 
        style={{ scale, opacity }}
        className="sticky top-0 h-screen w-full"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source 
            src="https://cdn.pixabay.com/video/2018/11/02/19129-298375837_large.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-white/40 backdrop-contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-6 font-sans text-xs uppercase tracking-[0.5em] text-gold font-bold"
          >
            Behind the Craft
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-2xl font-serif text-4xl font-medium md:text-7xl text-slate-900"
          >
            The Alchemy of <br />
            <span className="italic text-gold">Eternal Beauty.</span>
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             transition={{ duration: 1, delay: 0.4 }}
             className="mt-8 max-w-lg font-sans text-sm leading-relaxed text-slate-900/70"
          >
            Every fold of silver, every grain of gold is handled with sacred precision by our master artisans in Florence.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
