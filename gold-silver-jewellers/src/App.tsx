/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';

// Context Import
import { CartProvider, useCart } from './context/CartContext'; 

// Components & Pages
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer'; 
import { Home, Collections, Services, AboutUs, ContactUs, Login, AdminDashboard } from './pages';
import LiveRates from './pages/LiveRates/LiveRates';
import Categories from './pages/Categories/Categories';
import Products from './pages/Products/Products';
import CartPage from './components/Cart'; 

// API URL from env
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MainApp() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { isDrawerOpen, setIsDrawerOpen } = useCart();

  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname === '/login';

  useEffect(() => {
    const checkBackend = async () => {
      try { await axios.get(`${API_URL}/connection-test`); } catch (error) { console.error("DB Disconnected"); }
    };
    checkBackend();

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    isLoading ? lenis.stop() : lenis.start();

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [isLoading]);

  return (
    /* THEME UPDATE: 
       - Background: Rich Obsidian Black (#050505)
       - Text: Champagne Pearl (#FAFAFA)
       - Selection: Champagne Gold (#E5C787)
    */
    <main className="min-h-screen bg-[#050505] text-[#FAFAFA] selection:bg-[#E5C787] selection:text-[#050505] transition-opacity duration-700">

      <AnimatePresence mode="wait">
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <ScrollToTop />

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <div className={isLoading ? 'invisible' : 'visible'}>
        {!isAdminPage && <Navbar />}

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/heritage" element={<Services />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
              <Route path="rates" element={<LiveRates />} />
              <Route path="categories" element={<Categories />} />
              <Route path="products" element={<Products />} />
            </Route>
          </Routes>
        </AnimatePresence>

        {!isAdminPage && <Footer />}
      </div>

      {/* THEME UPDATE: Aesthetic Champagne Gold Ambient Glow */}
      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        {/* Soft Top Left Glow */}
        <div className="absolute left-[-5%] top-[-5%] h-[500px] w-[500px] rounded-full bg-[#E5C787]/5 blur-[100px]" />
        
        {/* Deep Bottom Right Glow */}
        <div className="absolute right-[-2%] bottom-[-2%] h-[600px] w-[600px] rounded-full bg-[#E5C787]/3 blur-[130px]" />
        
        {/* Subtle Luxury Texture (Grain) */}
        <div className="absolute inset-0 bg-[url('/grain.png')] opacity-[0.02] mix-blend-overlay" />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </BrowserRouter>
  );
}