"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Music4, Users, Award, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LampGame from '@/components/LampGame';

const stats = [
  { icon: Users, label: 'Students Trained', value: '700+' },
  { icon: Music4, label: 'Years of Legacy', value: '17+' },
  { icon: Award, label: 'Performances', value: '300+' },
];

export default function About() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  
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
                "Sri Lakshmi Bharatanatya Kalakshetram, established in November 2006 by Smt. S. Sri Lakshmi Siva Sankar, began with just four dedicated students. Over the years, it has blossomed into a vibrant institution where more than 100 students actively learn the art of Bharatanatyam, with over 700 students trained since its inception.",
                "Our students have had the privilege of performing at numerous prestigious venues and cultural events, including Kanipakam, Mahathi Auditorium in Tirupati (Abhinaya Arts), Rangastali, Shilpa Ramam in Tirupati, Sri Kalahasti Temple, Batu Caves in Malaysia, and various local cultural programs in Chittoor.",
                "In addition, our students regularly participate in Bharatanatyam Grade Exams (Levels 1-8) at Annamalai University, Vellore, achieving outstanding results with distinctions, reflecting their passion and commitment to this classical dance form."
              ].map((text, index) => (
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
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Guru: Smt. S. Sri Lakshmi
                </h3>
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