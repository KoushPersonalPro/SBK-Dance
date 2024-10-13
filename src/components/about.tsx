"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const About: React.FC = () => {
  const leftLampRef = useRef<HTMLDivElement | null>(null);
  const rightLampRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (leftLampRef.current && rightLampRef.current) {
      const scrollPosition = window.scrollY;
      const pathLength = document.documentElement.scrollHeight - window.innerHeight;
      const lampPosition = Math.min(scrollPosition / pathLength, 1) * 100; // Normalize the scroll position to a percentage
      leftLampRef.current.style.transform = `translateY(${lampPosition}vh)`; // Move the left lamp based on scroll
      rightLampRef.current.style.transform = `translateY(${lampPosition}vh)`; // Move the right lamp based on scroll
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="py-16 bg-white text-black" style={{cursor : "default"}}>
      <div className="container mx-auto px-4">
        {/* Curved Path */}
        <div className="relative">
          <div className="absolute left-10 top-0 h-full w-1 curve-path" style={{ left: '5%' }}></div>

          {/* Left Lamp Image */}
          <div 
            ref={leftLampRef} 
            className="absolute lamp" 
            style={{ left: '90%', top: '10%' }} // Position for the left lamp
          >
            <Image
              src="/lamp.png" // Ensure this path is correct
              alt="Lamp"
              width={120} 
              height={120} 
              className="object-contain"
            />
          </div>

          {/* Right Lamp Image */}
          <div 
            ref={rightLampRef} 
            className="absolute lamp" 
            style={{ right: '90%', top: '10%' }} // Position for the right lamp
          >
            <Image
              src="/lamp.png" // Ensure this path is correct
              alt="Lamp"
              width={120} 
              height={120} 
              className="object-contain"
            />
          </div>

          <h2 className="text-black text-center mt-10 text-3xl">ABOUT US</h2>
          <p className="text-center mt-8 max-w-3xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed text-gray-800 px-6 md:px-8">
            Sri Lakshmi Bharatanatya Kalakshetram, established in November 2006 by Smt. S. Sri Lakshmi Siva Sankar, began with just four dedicated students. Over the years, it has blossomed into a vibrant institution where more than 100 students actively learn the art of Bharatanatyam, with over 700 students trained since its inception.
            <br/><br/>
            Our students have had the privilege of performing at numerous prestigious venues and cultural events, including Kanipakam, Mahathi Auditorium in Tirupati (Abhinaya Arts), Rangastali, Shilpa Ramam in Tirupati, Sri Kalahasti Temple, Batu Caves in Malaysia, and various local cultural programs in Chittoor.
            <br/><br/>
            In addition, our students regularly participate in Bharatanatyam Grade Exams (Levels 1-8) at Annamalai University, Vellore, achieving outstanding results with distinctions, reflecting their passion and commitment to this classical dance form.
          </p>

          {/* Nataraja Image placed AFTER the paragraph */}
          <div className="mt-12 flex justify-center">
            <Image
              src="/guru.jpg" // Ensure this path is correct
              alt="Guru"
              width={400} // Adjusted size for clarity
              height={500} // Adjusted size for clarity
              className="object-cover"
            />
          </div>

          <div className="text-center mt-4">
            <p className="text-xl font-semibold text-gray-700">Guru: Smt. S. Sri Lakshmi</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
