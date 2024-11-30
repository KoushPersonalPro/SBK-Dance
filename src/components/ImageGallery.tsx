"use client"; // Mark this component as a client component

import React from "react";

const images = [
  { src: "/images/dance1.jpg", alt: "Dance 1" },
  { src: "/images/dance2.jpg", alt: "Dance 2" },
  { src: "/images/dance3.jpg", alt: "Dance 3" },
  { src: "/images/dance4.jpg", alt: "Dance 4" },
  { src: "/images/dance5.jpg", alt: "Dance 5" },
  { src: "/images/dance6.jpg", alt: "Dance 6" },
];

const ImageCarousel: React.FC = () => {
  return (
    <div className="relative overflow-hidden w-full mx-auto px-4 py-8 bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50 rounded-lg shadow-lg">
      {/* Gradient Overlays for visual effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white pointer-events-none z-10"></div>

      <div className="flex gap-4 animate-scroll relative z-20">
        {/* Render images with a clone of the first three for seamless looping */}
        {images.map((image, index) => (
          <div
            key={index}
            className="w-[300px] h-80 flex-shrink-0 overflow-hidden rounded-lg shadow-md relative group"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
        {images.slice(0, 3).map((image, index) => (
          <div
            key={`clone-${index}`}
            className="w-[300px] h-80 flex-shrink-0 overflow-hidden rounded-lg shadow-md relative group"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
