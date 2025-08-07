"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Expand, X, Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface GalleryItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  description?: string;
  category?: string;
}

export default function GalleryShow() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as GalleryItem[];
      setGallery(items);
    } catch (error) {
      console.error("Error fetching gallery: ", error);
      setError("Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (item: GalleryItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.name;
    link.click();
  };

  const filteredGallery = gallery.filter(item => 
    activeFilter === 'all' || item.category === activeFilter
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500">{error}</p>
          <button
            onClick={fetchGallery}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover blur-[2px]"
          >
            <source src="/Nataraja Animation.mp4" type="video/mp4" />
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-4 h-full flex items-center justify-center text-center z-10"
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-[400] font-semibold mb-6">
              Cultural Heritage Gallery
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto font-[300]">
              Discover the rich tapestry of our cultural heritage through a stunning collection 
              of moments captured in time
            </p>
          </div>
        </motion.div>
      </div>
      <br/>

      {/* Gallery Section */}
      <main className="flex-grow py-16 container mx-auto px-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'dance', 'festival'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === filter
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Images Grid - Pinterest Style */}
        <div ref={ref} className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          <AnimatePresence>
            {filteredGallery.map((item, index) => (
              item.type === 'image' && (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl shadow-lg bg-white break-inside-avoid mb-4"
                >
                  <div className="relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Download"
                    >
                      <Download className="h-5 w-5 text-gray-900" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(item)}
                      className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Expand"
                    >
                      <Expand className="h-5 w-5 text-gray-900" />
                    </button>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Videos Section */}
        <h2 className="text-3xl font-bold text-center mt-20 mb-12 text-gray-700">Video Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredGallery.map((item, index) => (
            item.type === 'video' && (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl overflow-hidden shadow-lg bg-white"
              >
                <video
                  controls
                  className="w-full h-auto"
                  poster={item.url.replace('.mp4', '-thumb.jpg')}
                >
                  <source src={item.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {item.description && (
                  <div className="p-4">
                    <p className="text-lg text-gray-700">{item.description}</p>
                  </div>
                )}
              </motion.div>
            )
          ))}
        </div>
      </main>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                <X className="h-8 w-8" />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto rounded-lg"
              />
              {selectedImage.description && (
                <p className="mt-4 text-white text-center">{selectedImage.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}