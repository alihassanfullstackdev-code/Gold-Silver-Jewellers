import { Instagram, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // 'bg-[#030303]' ko barkarar rakha hai aur border ko mazeed subtle kiya hai
    <footer className="bg-[#030303] pt-24 pb-12 border-t border-white/5 mt-20 text-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* 1. Brand Identity */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="font-serif text-3xl tracking-[0.3em] text-white">
              GS<span className="text-gold">&</span>J
            </h2>
            <p className="text-white/30 text-[10px] leading-relaxed tracking-[0.2em] uppercase max-w-xs mx-auto md:mx-0">
              Pioneers of timeless jewelry, crafting stories that define legacies since 1992.
            </p>
          </div>

          {/* 2. Navigation */}
          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.5em] font-black">Explore</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/collections" className="text-white/40 text-[10px] uppercase tracking-[0.2em] hover:text-gold transition-all duration-300">
                  The Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/40 text-[10px] uppercase tracking-[0.2em] hover:text-gold transition-all duration-300">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/40 text-[10px] uppercase tracking-[0.2em] hover:text-gold transition-all duration-300">
                  Bespoke Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Connect & Socials */}
          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.5em] font-black">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-8">
              <a href="#" className="text-white/30 hover:text-gold transition-all duration-300">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-white/30 hover:text-gold transition-all duration-300">
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              {/* Custom TikTok Icon */}
              <a href="#" className="text-white/30 hover:text-gold transition-all duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px]">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
                </svg>
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 text-white/30 group cursor-pointer">
              <Mail size={14} className="text-gold" />
              <span className="text-[10px] tracking-[0.2em] uppercase group-hover:text-white transition-colors">
                info@gsjjewellers.com
              </span>
            </div>
          </div>

          {/* 4. Location */}
          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.5em] font-black">Boutique</h4>
            <p className="text-white/30 text-[10px] leading-loose tracking-[0.2em] uppercase">
              Mall Of Sargodha,<br />
              Sargodha, Pakistan
            </p>
          </div>
        </div>

        {/* Copyright & Credit Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">
            © 2026 GoldSilver & Jewellers. All Rights Reserved.
          </p>
          
          <div className="flex items-center space-x-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Crafted by</span>
            <a 
              href="https://tracks-comunications.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:text-white transition-all duration-500 font-bold text-[10px] uppercase tracking-[0.2em]"
            >
              Tracks Communications
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}