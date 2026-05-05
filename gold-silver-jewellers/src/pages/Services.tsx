import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Upload, Sparkles, Hammer, Info, Clock, ShieldCheck } from 'lucide-react';

export default function Services() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Updated phone number as per your code
  const phoneNumber = "923030107581"; 

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const contactService = (serviceType: string) => {
    let message = `✨ *GS&J Premium Services* ✨\n\nAssalam-o-Alaikum, Main ne aapki website par *${serviceType}* ka section dekha aur mujhay is baray mein rabta karna tha.`;
    
    if (serviceType === 'Custom Creation' && selectedImage) {
      message += `\n\n🖼️ *Design Ref:* ${selectedImage.name}\n(Main ne design ki photo select ki hui hai, kindly estimate share kar dein)`;
    }

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-[#030303] text-white overflow-hidden font-sans"
    >
      {/* Background Video - Opacity barha di taake visibility behtar ho */}
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
          <source src="/videos/custom.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/90 via-[#030303]/40 to-[#030303]" />
      </div>

      <div className="relative z-10 pt-44 pb-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <motion.span 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.8em] text-gold font-black"
          >
            Artisan Care
          </motion.span>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl uppercase tracking-tighter"
          >
            Our <span className="italic text-gold">Services.</span>
          </motion.h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[9px] max-w-md mx-auto leading-relaxed">
            From bespoke creations to expert restoration, we provide comprehensive jewelry solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Service 1: Custom Creation */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-10 flex flex-col justify-between hover:border-gold/30 transition-all duration-500 group relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <div className="w-14 h-14 bg-gold/5 border border-gold/10 flex items-center justify-center rounded-full text-gold group-hover:scale-110 transition-transform duration-500">
                <Sparkles size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl uppercase tracking-widest">Custom Creation</h3>
              <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-wider">Bring your own design or let us sketch one for you. Handcrafted to perfection.</p>
              
              <label className="relative block h-44 border border-dashed border-white/10 hover:border-gold/40 cursor-pointer overflow-hidden transition-all bg-black/40 group/upload">
                <input type="file" className="hidden" onChange={handleImageChange} />
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover animate-in fade-in duration-500" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-30 group-hover/upload:opacity-100 transition-opacity">
                    <Upload size={24} strokeWidth={1} />
                    <span className="text-[8px] uppercase tracking-[0.4em]">Upload Inspiration</span>
                  </div>
                )}
              </label>
            </div>
            <button 
              onClick={() => contactService('Custom Creation')}
              className="mt-10 w-full py-4 bg-gold text-black font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 shadow-lg shadow-gold/5"
            >
              Start Your Design
            </button>
          </div>

          {/* Service 2: Restoration & Repair */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-10 flex flex-col justify-between hover:border-gold/30 transition-all duration-500 group">
            <div className="space-y-6">
              <div className="w-14 h-14 bg-gold/5 border border-gold/10 flex items-center justify-center rounded-full text-gold group-hover:scale-110 transition-transform duration-500">
                <Hammer size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl uppercase tracking-widest">Restoration</h3>
              <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-wider">Expert cleaning, polishing, and resizing services to make your heirlooms shine again.</p>
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-white/40">
                  <Clock size={14} className="text-gold" /> Quick Turnaround
                </div>
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-widest text-white/40">
                  <ShieldCheck size={14} className="text-gold" /> Secure Handling
                </div>
              </div>
            </div>
            <button 
              onClick={() => contactService('Restoration & Repair')}
              className="mt-10 w-full py-4 border border-gold/40 text-gold font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all duration-500"
            >
              Book Restoration
            </button>
          </div>

          {/* Service 3: Expert Consultation */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-10 flex flex-col justify-between hover:border-gold/30 transition-all duration-500 group">
            <div className="space-y-6">
              <div className="w-14 h-14 bg-gold/5 border border-gold/10 flex items-center justify-center rounded-full text-gold group-hover:scale-110 transition-transform duration-500">
                <Info size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl uppercase tracking-widest">Consultation</h3>
              <p className="text-[11px] text-white/50 leading-relaxed uppercase tracking-wider">Get live gold rates, investment advice, or gift recommendations from our experts.</p>
              <div className="mt-6 p-5 bg-white/[0.03] border-l-2 border-gold italic text-[11px] text-white/70 leading-relaxed">
                "We provide transparent market insights for your precious metal investments."
              </div>
            </div>
            <button 
              onClick={() => contactService('Expert Consultation')}
              className="mt-10 w-full py-4 border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-[0.3em] hover:border-gold hover:text-gold transition-all duration-500"
            >
              Ask an Expert
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}