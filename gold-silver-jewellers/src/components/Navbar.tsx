import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Search, Info, Phone, Compass, Sparkles, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/src/lib/utils';
import { useCart } from '../context/CartContext'; // Context import karein
import { cn } from '../lib/utils';

interface NavLink {
  name: string;
  href: string;
  icon?: React.ElementType;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Cart Context se items nikaalein
  const { cartItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/', icon: Compass },
    { name: 'Collection', href: '/collections', icon: Sparkles },
    { name: 'Services', href: '/heritage', icon: History },
    { name: 'About Us', href: '/about', icon: Info },
    { name: 'Contact Us', href: '/contact', icon: Phone },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 z-[1000] w-full transition-all duration-700',
        isScrolled
          ? 'bg-black/80 backdrop-blur-xl py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-b border-gold/20'
          : 'bg-transparent py-6 border-b border-transparent'
      )}
    >
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 md:px-12">
        
        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="block md:hidden text-white hover:text-gold transition-colors p-2"
        >
          <Menu size={24} />
        </button>

        {/* Links - Left (Desktop) */}
        <div className="hidden items-center space-x-12 md:flex flex-1">
          {navLinks.slice(0, 3).map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "font-sans text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative group",
                  isActive ? "text-gold" : "text-white/60 hover:text-white"
                )}
              >
                <span className="relative z-10">{link.name}</span>
                <span className={cn(
                  "absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500",
                  isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                )} />
              </Link>
            );
          })}
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <Link to="/" className="relative group">
            <motion.div 
              initial={false}
              animate={{ scale: isScrolled ? 0.9 : 1 }}
              className="flex flex-col items-center"
            >
              <span className="font-serif text-2xl font-bold tracking-[0.4em] text-white md:text-3xl">
                GS<span className="text-gold">&</span>J
              </span>
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-gold to-transparent mt-1" />
              <span className="font-sans text-[7px] uppercase tracking-[0.5em] text-gold/60 mt-1 hidden md:block">
                Jewellers
              </span>
            </motion.div>
          </Link>
        </div>

        {/* Links - Right + Icons */}
        <div className="flex items-center justify-end space-x-12 md:flex flex-1">
          <div className="hidden items-center space-x-12 md:flex">
            {navLinks.slice(3).map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "font-sans text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative group",
                    isActive ? "text-gold" : "text-white/60 hover:text-white"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500",
                    isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2 border-l border-white/10 pl-8 ml-4">
            <button className="text-white/70 transition-all duration-300 hover:text-gold p-2 hover:scale-110">
              <Search size={18} />
            </button>
            
            {/* UPDATED: Cart Button linked to /cart */}
            <Link to="/cart" className="relative text-white/70 transition-all duration-300 hover:text-gold p-2 hover:scale-110">
              <ShoppingBag size={18} />
              {cartItems.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-0 top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[8px] font-black text-black"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[1100] bg-black/90 backdrop-blur-md md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[1200] w-full max-w-[320px] bg-[#080808] border-r border-gold/10 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-8 border-b border-gold/10">
                  <span className="font-serif text-lg font-bold tracking-[0.2em] text-white">GS<span className="text-gold">&</span>J</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-gold">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 px-8 py-12 space-y-10">
                  {navLinks.map((link, idx) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <Link
                          to={link.href}
                          className={cn(
                            "flex items-center gap-6 group",
                            isActive ? "text-gold" : "text-white/80 hover:text-gold"
                          )}
                        >
                          <div className={cn(
                            "h-10 w-10 flex items-center justify-center rounded-full border transition-all duration-500",
                            isActive ? "border-gold bg-gold text-black" : "border-white/10 group-hover:border-gold group-hover:text-gold"
                          )}>
                            {Icon && <Icon size={18} />}
                          </div>
                          <span className="font-serif text-xl tracking-wide uppercase">{link.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  {/* Mobile Cart Link */}
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                    <Link to="/cart" className="flex items-center gap-6 text-white/80 hover:text-gold">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10">
                        <ShoppingBag size={18} />
                      </div>
                      <span className="font-serif text-xl tracking-wide uppercase">Cart ({cartItems.length})</span>
                    </Link>
                  </motion.div>
                </div>

                <div className="p-8 border-t border-gold/10">
                   <div className="flex justify-center space-x-6 text-white/40">
                      <Phone size={16} />
                      <Info size={16} />
                   </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}