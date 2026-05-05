import { sidebarLinks } from './SidebarConfig';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-white/10 p-6 hidden md:block min-h-screen">
            {/* Branding Area */}
            <div className="mb-10 px-2">
                <h1 className="text-xl font-serif text-gold">GS & <span className="text-white">Jewellers</span></h1>
                <p className="text-[10px] text-slate-400 tracking-widest uppercase mt-1 font-bold">Admin Portal</p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                        <Link
                            key={link.label}
                            to={link.path}
                            className="block no-underline"
                        >
                            <motion.div
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                                    isActive 
                                    ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Icon size={18} className={`${isActive ? 'text-gold' : 'group-hover:text-white transition-colors'}`} />
                                <span className="text-sm font-medium tracking-wide">{link.label}</span>
                                
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className="ml-auto w-1 h-4 bg-gold rounded-full" 
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Support/Help Section */}
            <div className="absolute bottom-8 left-6 right-6">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">System Status</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">Online & Secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
};