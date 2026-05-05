import { motion } from 'framer-motion';
import { Award, Users, ShieldCheck, Gem } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Years of Artistry', value: '30+', icon: Award },
    { label: 'Master Craftsmen', value: '15+', icon: Users },
    { label: 'Unique Designs', value: '5000+', icon: Gem },
    { label: 'Quality Assurance', value: '100%', icon: ShieldCheck },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="bg-[#030303] text-white overflow-hidden font-sans"
    >
      {/* --- HERO SECTION: Full Background Image --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Full Section Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/about.jpg" 
            className="w-full h-full object-cover opacity-60 scale-105"
            alt="The Heritage of GS&J"
          />
          {/* Gradients to blend the edges and ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/80 via-transparent to-[#030303]" />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        </div>
        
        {/* Centered Content */}
        <div className="relative z-10 text-center space-y-6 px-6">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.8em] text-gold font-black drop-shadow-lg"
          >
            Established 1992
          </motion.span>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-6xl md:text-9xl uppercase tracking-tighter drop-shadow-2xl"
          >
            Our <span className="italic text-gold block md:inline">Legacy.</span>
          </motion.h1>
        </div>
      </section>

      {/* --- THE VISION SECTION --- */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-5xl md:text-7xl text-white tracking-tighter">The Soul of <br/><span className="italic text-gold uppercase">GS&J.</span></h2>
              <div className="h-[1px] w-32 bg-gold/50" />
            </div>
            
            <div className="space-y-8 text-white/50 text-sm leading-relaxed uppercase tracking-[0.2em] font-light">
               <p className="text-white/90 text-lg normal-case italic border-l-2 border-gold pl-6 py-2">
                "Our purpose is not merely to sell jewelry, but to preserve the most precious moments of your life in gold and stone."
              </p>
              <p>
                Founded in the heart of Pakistan in 1992, GoldSilver & Jewellers began as an intimate atelier dedicated to the pursuit of perfection. Today, we stand as a beacon of trust, known for transforming raw materials into timeless artifacts.
              </p>
              <p>
                We harmonize ancient goldsmithing techniques with contemporary design sensibilities. Every piece that leaves our workshop is the culmination of months of meticulous hand-craftsmanship by our master artisans.
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="aspect-[4/5] overflow-hidden border border-white/10 p-4 bg-white/5 backdrop-blur-sm transition-all duration-700 group-hover:border-gold/30">
              <img 
                src="/images/logo.png" 
                className="w-full h-full object-contain p-8 hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                alt="Our Atelier"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-white/[0.02] border-y border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              className="text-center space-y-4 group"
            >
              <div className="flex justify-center transition-transform duration-500 group-hover:scale-110">
                <stat.icon className="text-gold" size={32} strokeWidth={1} />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif text-white">{stat.value}</h3>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- VALUES: English Narrative --- */}
      <section className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-24 space-y-4">
          <h2 className="font-serif text-5xl md:text-6xl uppercase tracking-tighter text-white">Our <span className="italic text-gold">Commitment.</span></h2>
          <div className="h-[1px] w-20 bg-gold mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {[
            { 
              title: 'The Atelier', 
              img: '/images/bengles.jpeg', 
              desc: 'Every design is brought to life in our specialized boutique studio, where modern technology meets decades of artistic heritage.' 
            },
            { 
              title: 'The Artisans', 
              img: '/images/necklace.jpeg', 
              desc: 'Our craftsmen possess over 30 years of expertise. From the initial sketch to the final polish, every facet is checked manually.' 
            },
            { 
              title: 'Ethical Sourcing', 
              img: '/images/stud.jpeg', 
              desc: 'We use only certified and ethically sourced precious metals and stones, ensuring your jewelry is as pure as your intentions.' 
            }
          ].map((item, index) => (
            <div key={index} className="space-y-8 group">
              <div className="h-[450px] overflow-hidden relative border border-white/5">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-80" />
                <h3 className="absolute bottom-6 left-6 font-serif text-3xl text-white tracking-widest uppercase">{item.title}</h3>
              </div>
              <p className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.2em]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-40 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold blur-[150px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-12 px-6 text-white">
          <h2 className="font-serif text-5xl md:text-7xl italic leading-tight">Experience Artistry <br/>in its purest form.</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 pt-6">
            <button 
              onClick={() => navigate('/contact')}
              className="px-16 py-6 bg-gold text-black font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white transition-all duration-500 shadow-xl"
            >
              Visit Our Boutique
            </button>
            <button 
              onClick={() => navigate('/collections')}
              className="px-16 py-6 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all duration-500"
            >
              View Collections
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}