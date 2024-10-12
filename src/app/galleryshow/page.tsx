"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Galleryshow() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    fetchGallery(); // Fetch the gallery items when the component mounts
  }, []);

  const fetchGallery = async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setGallery(items);
  };

  const handleDownload = (item) => {
    const link = document.createElement('a');
    link.href = item.url; // Use the URL from Firestore for download
    link.download = item.name;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-10">Our Dance Gallery</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {gallery.map((item) => (
                item.type === 'image' ? (
                  <div key={item.id} className="relative">
                    <img
                      src={item.url} // Use the URL from Firestore
                      alt={item.name} 
                      className="w-full h-auto object-cover rounded-lg" // Added rounded corners for aesthetics
                    />
                    <div className="absolute bottom-2 left-2 p-1 flex items-center">
                      <button onClick={() => handleDownload(item)} className="border border-black bg-transparent p-1 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15v2a2 2 0 002 2h12a2 2 0 002-2v-2m-6-3l-2 2m0 0l-2-2m2 2V3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : null // Only show images here
              ))}
            </div>
          </div>
        </section>

        {/* Video Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-10">Our Video Gallery</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {gallery.map((item) => (
        item.type === 'video' ? (
          <div key={item.id} className="mb-5">
            <video controls className="w-full h-auto rounded-lg"> {/* Added rounded corners for aesthetics */}
              <source src={item.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p className="text-lg text-center">{item.description}</p>
          </div>
        ) : null // Only show videos here
      ))}
    </div>
  </div>
</section>

      </main>
      <Footer />
    </div>
  );
}
