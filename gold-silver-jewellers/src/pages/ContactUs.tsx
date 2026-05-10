import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, Clock, Instagram } from 'lucide-react';

export default function ContactUs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-[#030303] text-white overflow-hidden font-sans"
    >
      {/* --- BACKGROUND IMAGE SECTION --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/contact.jpg" 
          className="w-full h-full object-cover opacity-40 scale-105"
          alt="Contact GS&J"
        />
        {/* Luxury Overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/90 via-[#030303]/60 to-[#030303]" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-44 pb-32">
        {/* Header */}
        <div className="mb-24 text-center lg:text-center">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-6xl md:text-9xl mt-4 uppercase tracking-tighter"
          >
            Get in <span className="italic text-gold">Touch.</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Left Side: Contact Details */}
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
              {/* Email */}
              <motion.div whileHover={{ x: 10 }} className="space-y-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center rounded-full text-gold group-hover:bg-gold group-hover:text-black transition-all">
                    <Mail size={18} />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Email Address</h4>
                </div>
                <p className="font-serif text-2xl group-hover:text-gold transition-colors">info@gsjjewellers.com</p>
              </motion.div>

              {/* Phone */}
              <motion.div whileHover={{ x: 10 }} className="space-y-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center rounded-full text-gold group-hover:bg-gold group-hover:text-black transition-all">
                    <Phone size={18} />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Call Us</h4>
                </div>
                <p className="font-serif text-2xl group-hover:text-gold transition-colors">+92 303 0107581</p>
              </motion.div>

              {/* Location */}
              <motion.div whileHover={{ x: 10 }} className="space-y-4 group lg:col-span-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 flex items-center justify-center rounded-full text-gold group-hover:bg-gold group-hover:text-black transition-all">
                    <MapPin size={18} />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Visit Boutique</h4>
                </div>
                <p className="font-serif text-2xl max-w-sm">Mall of Sargodha, Ground Floor, Sargodha, Pakistan</p>
              </motion.div>

              {/* Store Hours */}
              <motion.div whileHover={{ x: 10 }} className="space-y-4 group lg:col-span-2 pt-6 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <Clock size={18} className="text-gold" />
                  <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">Hours</h4>
                </div>
                <div className="flex gap-12 text-[11px] uppercase tracking-widest text-white/60 font-light leading-loose">
                  <p>Mon — Sat <br/><span className="text-white">11:00 AM - 10:00 PM</span></p>
                  <p>Friday <br/><span className="text-white">03:00 PM - 10:00 PM</span></p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Professional Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.03] backdrop-blur-xl p-10 lg:p-14 border border-white/10 shadow-2xl"
          >
            <form className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2 group">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 group-focus-within:text-gold transition-colors">Full Name</label>
                  <input type="text" className="w-full border-b border-white/10 py-3 outline-none focus:border-gold transition-all font-light text-sm bg-transparent" />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 group-focus-within:text-gold transition-colors">Email Address</label>
                  <input type="email" className="w-full border-b border-white/10 py-3 outline-none focus:border-gold transition-all font-light text-sm bg-transparent" />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 group-focus-within:text-gold transition-colors">Subject</label>
                <select className="w-full border-b border-white/10 py-3 outline-none focus:border-gold transition-all font-light text-sm bg-transparent text-white cursor-pointer [&>option]:bg-[#111]">
                  <option>Bespoke Commission</option>
                  <option>Restoration Inquiry</option>
                  <option>Order Tracking</option>
                  <option>Corporate Gift</option>
                </select>
              </div>

              <div className="space-y-2 group">
                <label className="text-[9px] uppercase tracking-[0.4em] text-white/40 group-focus-within:text-gold transition-colors">Message</label>
                <textarea rows={4} className="w-full border-b border-white/10 py-3 outline-none focus:border-gold transition-all font-light text-sm resize-none bg-transparent" />
              </div>

              <button className="w-full py-5 bg-gold text-black font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-white transition-all duration-500 shadow-xl shadow-gold/5 group">
                Send Inquiry
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}