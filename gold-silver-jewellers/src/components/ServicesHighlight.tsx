import { motion } from 'framer-motion';
import { Sparkles, Hammer, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServicesHighlight() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Bespoke Design",
      desc: "Turn your vision into a handcrafted masterpiece.",
      icon: Sparkles,
      color: "from-gold/20"
    },
    {
      title: "Restoration",
      desc: "Expert polishing and repair for your precious heirlooms.",
      icon: Hammer,
      color: "from-white/10"
    },
    {
      title: "Consultation",
      desc: "Get expert advice on gold rates and investments.",
      icon: MessageCircle,
      color: "from-gold/10"
    }
  ];

  return (
    <section className="py-32 bg-[#030303] border-y border-white/5 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-16 text-center relative z-10">
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {/* Subtitle with Horizontal Lines */}
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-[1px] w-6 bg-gold/50" />
      <span className="font-sans text-[10px] uppercase tracking-[0.6em] text-gold font-black">
        Expertise
      </span>
      <div className="h-[1px] w-6 bg-gold/50" />
    </div>

    {/* Dynamic Heading with Italic Gold Span */}
    <h2 className="font-serif text-5xl md:text-6xl text-white tracking-tight uppercase">
      More Than Just <br />
      <span className="italic text-gold lowercase">a boutique.</span>
    </h2>
  </motion.div>
</div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="p-10 bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all duration-500 group"
            >
              <div className={`w-14 h-14 mb-8 flex items-center justify-center rounded-full bg-gradient-to-br ${service.color} to-transparent text-gold border border-gold/10`}>
                <service.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-4 text-white group-hover:text-gold transition-colors uppercase tracking-wider">{service.title}</h3>
              <p className="text-[11px] leading-relaxed text-white/40 uppercase tracking-widest font-light">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}