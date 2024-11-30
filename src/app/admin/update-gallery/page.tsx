"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Plus, ArrowLeft, Trash2, Image as ImageIcon, Video } from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  description?: string;
}

export default function UpdateGallery() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFiles, setVideoFiles] = useState<(File | null)[]>([]);
  const [videoDescriptions, setVideoDescriptions] = useState<string[]>(['']);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as GalleryItem[];
      setGallery(items);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const files = [...videoFiles];
      files[index] = e.target.files[0];
      setVideoFiles(files);
    }
  };

  const handleDescriptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const descriptions = [...videoDescriptions];
    descriptions[index] = e.target.value;
    setVideoDescriptions(descriptions);
  };

  const addVideoInput = () => {
    setVideoFiles([...videoFiles, null]);
    setVideoDescriptions([...videoDescriptions, '']);
  };

  const removeVideoInput = (index: number) => {
    setVideoFiles(files => files.filter((_, i) => i !== index));
    setVideoDescriptions(desc => desc.filter((_, i) => i !== index));
  };

  const uploadImage = async () => {
    if (!imageFile) return;
    
    const storageRef = ref(storage, `gallery/images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);

    await setDoc(doc(db, 'gallery', imageFile.name), {
      name: imageFile.name,
      type: 'image',
      url,
      description: '',
    });
    setImageFile(null);
  };

  const uploadVideos = async () => {
    for (let i = 0; i < videoFiles.length; i++) {
      if (!videoFiles[i] || !videoDescriptions[i]) continue;

      const storageRef = ref(storage, `gallery/videos/${videoFiles[i]!.name}`);
      await uploadBytes(storageRef, videoFiles[i]!);
      const url = await getDownloadURL(storageRef);

      await setDoc(doc(db, 'gallery', videoFiles[i]!.name), {
        name: videoFiles[i]!.name,
        type: 'video',
        url,
        description: videoDescriptions[i],
      });
    }
    setVideoFiles([]);
    setVideoDescriptions(['']);
  };

  const removeItem = async (item: GalleryItem) => {
    try {
      const storageRef = ref(storage, `gallery/${item.type === 'video' ? 'videos' : 'images'}/${item.name}`);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'gallery', item.name));
      await fetchGallery();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleSave = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      await uploadImage();
      await uploadVideos();
      await fetchGallery();
      setSuccessMessage('Gallery updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error saving gallery:", error);
    }
    setIsUploading(false);
    setUploadProgress(100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          onClick={() => router.push('/admin')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Admin
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Update Gallery</h1>

          {/* Image Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Images</h2>
            <div className="flex items-center space-x-4">
              <label className="flex-1">
                <div className="relative group cursor-pointer">
                  <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    {imageFile ? (
                      <div className="text-sm text-gray-600">
                        {imageFile.name}
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-600">
                          Select image
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Videos</h2>
            <div className="space-y-4">
              {videoFiles.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-1 space-y-4">
                    <label className="block">
                      <div className="relative group cursor-pointer">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          {videoFiles[index] ? (
                            <div className="text-sm text-gray-600">
                              {videoFiles[index]!.name}
                            </div>
                          ) : (
                            <div className="text-center">
                              <Video className="mx-auto h-8 w-8 text-gray-400" />
                              <span className="mt-2 block text-sm font-medium text-gray-600">
                                Select video
                              </span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoChange(index, e)}
                          className="hidden"
                        />
                      </div>
                    </label>
                    <input
                      type="text"
                      placeholder="Video Description"
                      value={videoDescriptions[index]}
                      onChange={(e) => handleDescriptionChange(index, e)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => removeVideoInput(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
              <button
                onClick={addVideoInput}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Video
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="ml-2">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Gallery Preview */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Current Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group rounded-lg overflow-hidden bg-gray-100"
                >
                  {item.type === 'video' ? (
                    <video controls className="w-full h-48 object-cover">
                      <source src={item.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={item.url} alt={item.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeItem(item)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {item.description && (
                    <div className="p-3 text-sm text-gray-600">
                      {item.description}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}