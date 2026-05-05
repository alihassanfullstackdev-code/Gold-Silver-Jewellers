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
import { CartProvider, useCart } from './context/CartContext'; // useCart bhi import karein

// Components & Pages
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer'; // Naya Drawer Component
import { Home, Collections, Services, AboutUs, ContactUs, Login, AdminDashboard } from './pages';
import LiveRates from './pages/LiveRates/LiveRates';
import Categories from './pages/Categories/Categories';
import Products from './pages/Products/Products';
import CartPage from './components/Cart'; 

const API_URL = 'http://127.0.0.1:8000/api';

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
  
  // Drawer state context se lein
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
    <main className="min-h-screen bg-[#030303] text-slate-100 selection:bg-gold selection:text-black transition-opacity duration-700">

      <AnimatePresence mode="wait">
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <ScrollToTop />

      {/* Cart Drawer - Hamesha top level par rahay ga */}
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

      <div className="pointer-events-none fixed inset-0 z-[-1] opacity-40">
        <div className="absolute left-[5%] top-[10%] h-[600px] w-[600px] rounded-full bg-gold/10 blur-[150px]" />
        <div className="absolute right-[5%] bottom-[10%] h-[700px] w-[700px] rounded-full bg-gold/5 blur-[180px]" />
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