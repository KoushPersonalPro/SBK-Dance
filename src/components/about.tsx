"use client";
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Music4, Users, Award, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LampGame from '@/components/LampGame';

const stats = [
  { icon: Users, label: 'Students Trained', value: '1000+' },
  { icon: Music4, label: 'Years of Legacy', value: '20+' },
  { icon: Award, label: 'Performances', value: '500+' },
];

export default function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const names = [
    "Smt. S. Sri Lakshmi",
    "శ్రీమతి ఎస్. శ్రీ లక్ష్మి",
    "Smt. S. Sri Lakshmi",
    "ಶ್ರೀಮತಿ ಎಸ್. ಶ್ರೀ ಲಕ್ಷ್ಮಿ",
    "Smt. S. Sri Lakshmi",
    "श्रीमती एस. श्री लक्ष्मी",
    "Smt. S. Sri Lakshmi",
    "ஸ்ரீமதி எஸ். ஸ்ரீ லக்ஷ்மி"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % names.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Hero Section with Parallax */}

      {/* Stats Section */}
      <section className="py-16 bg-white relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg"
              >
                <stat.icon className="h-10 w-10 mx-auto mb-4 text-purple-600" />
                <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section ref={ref} className="py-20 relative overflow-hidden">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-10 tracking-tight">
          ABOUT US
        </h2>
        <div className="absolute inset-0 opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8 text-center mb-16">
              {[
  "Sri Lakshmi Bharatanatya Kalakshetram, established in November 2006 by Smt. S. Sri Lakshmi Siva Sankar, began with just four dedicated students. She started teaching Bharatanatyam in 1997 in Tamil Nadu, laying the foundation for what would become a respected institution. Today, the Kalakshetram has blossomed into a vibrant center where over 200 students actively learn the art of Bharatanatyam, and more than 1000 students have been trained since its inception.",
  
  "Our students have had the honor of performing at numerous prestigious venues and cultural events, including Kanipakam, Mahathi Auditorium in Tirupati (Abhinaya Arts), Rangastali, Shilparamam in Tirupati, Sri Kalahasti Temple, Batu Caves in Malaysia, and various national and local programs across India. These performances highlight their dedication to preserving and sharing classical Indian dance.",
  
  "Additionally, our students consistently participate in Bharatanatyam Grade Exams (Levels 1-8) at Annamalai University, Vellore. With a track record of achieving distinctions, these results reflect their commitment, discipline, and passion for mastering this traditional art form under expert guidance."
]
.map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-lg text-gray-700 leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Guru Section with 3D Card Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center perspective-1000"
            >
              <div className="group relative w-72 h-72 mx-auto mb-8 transform-style-3d transition-transform duration-500 hover:rotate-y-12">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full opacity-20 blur-xl" />
                <img
                  src="/guru.jpg"
                  alt="Guru: Smt. S. Sri Lakshmi"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl transform-gpu transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-purple-500/20 transform-gpu transition-transform duration-500 group-hover:scale-110" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col items-center justify-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className='text-orange-500'>Guru: </span>
                  </h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative h-12 w-full flex justify-center overflow-hidden"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={names[currentNameIndex]}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            y: { type: "spring", stiffness: 100, damping: 15 },
                            opacity: { duration: 0.4 }
                          }
                        }}
                        exit={{ 
                          opacity: 0,
                          y: -50,
                          transition: {
                            y: { type: "spring", stiffness: 100, damping: 15 },
                            opacity: { duration: 0.4 }
                          }
                        }}
                        className={`absolute text-center ${
                          currentNameIndex === 1 ? 'font-telugu text-2xl' :
                          currentNameIndex === 2 ? 'font-kannada text-2xl' :
                          currentNameIndex === 3 ? 'font-hindi text-2xl' :
                          currentNameIndex === 4 ? 'font-tamil text-2xl' :
                          'font-[300] text-2xl'
                        }`}
                        style={{
                          minWidth: '300px',
                          display: 'block'
                        }}
                      >
                        {names[currentNameIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>
                </div>
                <p className="text-gray-600">Founder & Principal Instructor</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Game Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Experience Our Culture
            </h2>
            <p className="text-gray-600">
              Light the traditional lamps and be part of our cultural celebration
            </p>
          </motion.div>
          <LampGame />
        </div>
      </section>
    </div>
  );
}
