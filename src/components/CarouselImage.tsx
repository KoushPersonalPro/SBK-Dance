'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface CarouselImageProps {
  src: string;
  alt: string;
  index: number;
}

const CarouselImage = ({ src, alt, index }: CarouselImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative w-[400px] h-80 overflow-hidden rounded-xl mx-2"
      style={{
        transformOrigin: 'center', // Ensure scaling happens from the center
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-500 hover:scale-125"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default CarouselImage;
