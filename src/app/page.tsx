'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import About from '@/components/about';
import Gallery from '@/components/gallery';
import Contact from '@/components/contact';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const heroRef = useRef(null);
  const [currentLangIndex, setCurrentLangIndex] = useState(0);

  useEffect(() => {
    // GSAP Animation for Hero Section
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' }
    );

    // Language rotation interval
    const interval = setInterval(() => {
      setCurrentLangIndex((prev) => (prev + 1) % 6);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-200 to-white">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-[75vh] flex items-start md:items-center justify-center bg-white overflow-hidden pt-4 md:pt-0 mt-8 md:mt-0"
          style={{ perspective: '1000px' }}
        >
          <div className="absolute inset-0 z-0 hidden md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1),rgba(250,250,250,0.8))]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="container mx-auto px-2 sm:px-4 text-center relative z-10"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-7xl font-[100] mb-3 md:mb-6 relative px-4"
              style={{
                animation: 'textGradient 8s linear infinite',
                background: 'linear-gradient(90deg, #ff6b6b,rgb(223, 159, 69),#c359ea, #96e6a1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '300% 100%',
                textRendering: 'geometricPrecision'
              }}
            >
              Welcome to SriLakshmi Bharatanatya Kalakshetram
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4 md:mb-8 px-6 font-thin text-center"
              style={{ textRendering: 'geometricPrecision' }}
            >
              <span>Discover the art of </span>
              <AnimatePresence mode="wait">
                {[
                  { text: "Bharatanatyam", font: "font-[300]" },
                  { text: "భరతనాట్యం", font: "font-telugu" },
                  { text: "பரதநாட்டியம்", font: "font-tamil" },
                  { text: "ಭರತನಾಟ್ಯ", font: "font-kannada" },
                  { text: "भरतनाट्यम", font: "font-hindi" },
                  { text: "ഭരതനാട്യം", font: "font-malayalam" }
                ].map((item, index) => (
                  <motion.span
                    key={item.text}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: index === currentLangIndex ? 1 : 0
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${item.font} inline-block`}
                    style={{
                      background: 'linear-gradient(90deg, #ff6b6b,rgb(223, 159, 69),#c359ea, #96e6a1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '300% 100%',
                      animation: 'textGradient 8s linear infinite',
                      display: index === currentLangIndex ? 'inline-block' : 'none',
                      fontWeight: 600 // semi bold
                    }}
                  >
                    {item.text}
                  </motion.span>
                ))}
              </AnimatePresence>
              <span> with us</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <a
                href="/auth"
                className="inline-block bg-gradient-to-r from-purple-100 to-pink-400 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-base sm:text-lg font-medium hover:from-purple-400 hover:to-pink-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Explore More
              </a>
            </motion.div>
          </motion.div>

          {/* Mobile Video Background */}
          <div className="md:hidden absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-75"
              style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                minWidth: '100%',
                minHeight: '100%'
              }}
            >
              <source src="/watermarked_preview.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-white/10" />
          </div>

          {/* Desktop Decorative Elements */}
          <div className="hidden md:block">
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
          </div>
          
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
