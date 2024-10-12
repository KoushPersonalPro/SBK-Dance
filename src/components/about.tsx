"use client";
import React, { useEffect, useRef, useState } from 'react';
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
    <section className="relative h-screen overflow-hidden bg-white">
      {/* Curved Path */}
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
          width={120} // Small size for clarity
          height={120} // Small size for clarity
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
          width={120} // Small size for clarity
          height={120} // Small size for clarity
          className="object-contain"
        />
      </div>

      <h2 className="text-black text-center mt-10 text-3xl">ABOUT US</h2>
      <p className="text-center mt-4 max-w-lg mx-auto text-lg px-4">
        Welcome to SriLakshmi Bharatanatyam Kalakshetram. We are dedicated to
        preserving and promoting the rich heritage of classical dance.
      </p>

      {/* Bottom Image */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <Image
          src="/nataraj.png" // Ensure this path is correct
          alt="Nataraja"
          width={600} // Adjusted size for clarity
          height={800} // Adjusted size for clarity
          className="object-cover"
        />
      </div>
      
    </section>
  );
};

export default About;
