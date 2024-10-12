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
    <div className="overflow-hidden w-full mx-auto px-4"> {/* Added padding */}
      <div className="flex animate-scroll">
        {/* Render images with a clone of the first three for seamless looping */}
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className="w-[300px] h-80 object-cover flex-shrink-0" // Increased height to h-80
          />
        ))}
        {images.slice(0, 3).map((image, index) => ( // Clone first 3 images
          <img
            key={`clone-${index}`}
            src={image.src}
            alt={image.alt}
            className="w-[300px] h-80 object-cover flex-shrink-0" // Increased height to h-80
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
