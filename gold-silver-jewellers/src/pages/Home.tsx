import Hero from '../components/Hero.tsx';
import ProductSection from '../components/ProductSection.tsx'; 
import { motion } from 'framer-motion';
import TopSellers from '../components/TopSellers.tsx';
import OurCollection from '../components/OurCollection.tsx';
import ServicesHighlight from '../components/ServicesHighlight.tsx'; 

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Hero />
      
      {/* 1. New Arrivals */}
      <section id="new-arrivals">
        <ProductSection 
          title="New Arrivals" 
          subtitle="Latest Masterpieces" 
          filterType="is_new_arrival" 
        />
      </section>

      {/* 2. Top Sellers */}
      <section id="top-sellers">
        <TopSellers />
      </section>

      {/* --- ADDED SERVICES HIGHLIGHT HERE --- */}
      <ServicesHighlight />

      {/* 3. Featured Collection */}
      <section id="collection">
        <OurCollection />
      </section>

    </motion.div>
  );
}