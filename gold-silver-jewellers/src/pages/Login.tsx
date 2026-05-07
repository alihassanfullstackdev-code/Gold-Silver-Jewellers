import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // API Base URL from environment variables
    const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;

    try {
      // Sahi URL structure with backticks and /api/ prefix
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password
      });

      // Token save karna aur redirect karna
      if (response.data.token) {
        localStorage.setItem('admin_token', response.data.token);
        navigate('/admin'); 
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Unauthorized: Access Denied. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans">
      
      {/* --- ANIMATED BACKGROUND ORBS --- */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[1100px] min-h-[600px] flex flex-col md:flex-row bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-4"
      >
        
        {/* --- LEFT SIDE: THE ARTISAN VIBE --- */}
        <div className="w-full md:w-5/12 relative bg-black overflow-hidden">
          <img 
            src="/images/about.jpg" 
            alt="Jewelry Art" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
          
          <div className="absolute inset-0 p-12 flex flex-col justify-end space-y-6">
             <div className="w-12 h-12 bg-gold/20 backdrop-blur-xl border border-gold/30 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-gold" size={24} />
             </div>
             <div className="space-y-2">
                <h1 className="text-4xl font-serif text-white leading-tight">
                  The <span className="text-gold italic font-light">Vault</span> <br /> Control Center
                </h1>
                <p className="text-slate-400 text-xs uppercase tracking-[0.3em] font-medium">Authorized Personnel Only</p>
             </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="w-full md:w-7/12 p-8 md:p-20 bg-slate-50 flex flex-col justify-center relative">
          
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-slate-900 mb-3">Management Login</h2>
            <div className="h-1 w-12 bg-gold" />
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Mail size={12} className="text-gold" /> Email Identity
              </label>
              <input 
                type="email" 
                required
                value={email}
                placeholder="admin@gsj.com" 
                className="w-full bg-white p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-slate-800 placeholder:text-slate-300 shadow-sm" 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <Lock size={12} className="text-gold" /> Access Key
              </label>
              <input 
                type="password" 
                required
                value={password}
                placeholder="••••••••" 
                className="w-full bg-white p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all text-slate-800 placeholder:text-slate-300 shadow-sm" 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.01, backgroundColor: '#000' }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit" 
              className="w-full bg-slate-900 text-white font-bold p-5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-[11px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard 
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
              &copy; {new Date().getFullYear()} GS&J Portal
            </p>
            <img src="/images/logo.png" className="h-6 opacity-20 grayscale" alt="Logo" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}