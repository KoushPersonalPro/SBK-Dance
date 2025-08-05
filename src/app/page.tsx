'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import About from '@/components/about';
import Gallery from '@/components/gallery';
import Contact from '@/components/contact';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';

export default function HomePage() {
  const heroRef = useRef(null);

  useEffect(() => {
    // GSAP Animation for Hero Section
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-200 to-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden"
          style={{ perspective: '1000px' }}
        >
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
            <div className="absolute inset-0 backdrop-blur-sm" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="container mx-auto px-4 text-center relative z-10"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Welcome to Sri Lakshmi Bharatanatya Kalakshetram
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-700 mb-8"
            >
              Discover the art of Bharatanatyam with us
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a
                href="/auth"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore More
              </a>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute left-10 top-1/2 transform -translate-y-1/2"
          >
            <Image
              src="/mudra.png"
              alt="Decorative Mudra"
              width={150}
              height={150}
              className="animate-float opacity-80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute right-10 top-1/2 transform -translate-y-1/2"
          >
            <Image
              src="/mudra.png"
              alt="Decorative Mudra"
              width={150}
              height={150}
              className="animate-float-right opacity-80"
              style={{ transform: 'scaleX(-1)' }}
            />
          </motion.div>
          
        </section>

        {/* About Section */}
        <section className="py-16 bg-gradient-to-tl from-white to-gray-100 text-black">
          <About />
          
        </section>

        {/* Gallery Section */}
        <section className="py-16 bg-gray-100 text-black">
          <Gallery />
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-white text-black">
          <Contact />
        </section>
      </main>
      <Footer />
      
    </div>
  );
}
