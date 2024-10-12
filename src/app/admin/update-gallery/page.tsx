"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

export default function UpdateGallery() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null); // Allow null for image file
  const [videoFiles, setVideoFiles] = useState<(File | null)[]>([]); // Array of File or null
  const [videoDescriptions, setVideoDescriptions] = useState<string[]>(['']);
  const [gallery, setGallery] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files![0]); // Use non-null assertion since we check file existence
  };

  const handleVideoChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...videoFiles];
    files[index] = e.target.files![0]; // Use non-null assertion
    setVideoFiles(files);
  };

  const handleDescriptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const descriptions = [...videoDescriptions];
    descriptions[index] = e.target.value;
    setVideoDescriptions(descriptions);
  };

  const addVideoInput = () => {
    setVideoFiles([...videoFiles, null]); // Add a new empty file slot (consider using empty string or better handling)
    setVideoDescriptions([...videoDescriptions, '']); // Add a new empty description
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

      const storageRef = ref(storage, `gallery/videos/${videoFiles[i]!.name}`); // Use non-null assertion
      await uploadBytes(storageRef, videoFiles[i]!); // Use non-null assertion

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

  const removeItem = async (item: any) => {
    const storageRef = ref(storage, `gallery/${item.type === 'video' ? 'videos' : 'images'}/${item.name}`);
    await deleteObject(storageRef);
    await deleteDoc(doc(db, 'gallery', item.name));
    fetchGallery();
  };

  const fetchGallery = async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setGallery(items);
  };

  const handleSave = async () => {
    await uploadImage();
    await uploadVideos();
    fetchGallery();
    setSuccessMessage('Saved successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="bg-white text-black p-5">
      <button 
        className="text-gray-500 hover:text-black absolute top-5 right-5"
        onClick={() => router.push('/admin')}
      >
        &lt; Back
      </button>
      <h1 className="text-3xl mb-5">Update Gallery</h1>
      <div className="flex flex-col space-y-3">
        <input type="file" onChange={handleImageChange} className="mb-3 border p-2" />
        <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Add Image</button>

        {videoFiles.map((_, index) => (
          <div key={index} className="mt-5">
            <input type="file" onChange={(e) => handleVideoChange(index, e)} className="mb-3 border p-2" />
            <input
              type="text"
              placeholder="Video Description"
              value={videoDescriptions[index]}
              onChange={(e) => handleDescriptionChange(index, e)}
              className="mt-3 mb-3 border p-2 w-full"
            />
          </div>
        ))}

        <div className="flex space-x-3 mt-3">
          <button onClick={addVideoInput} className="bg-blue-500 text-white p-2 rounded">Add Another Video</button>
          <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded">Add Videos</button>
        </div>
      </div>

      {successMessage && <div className="mt-3 text-green-500">{successMessage}</div>}

      <div className="mt-5">
        {gallery.map((item) => (
          <div key={item.id} className="mb-5 border p-3">
            {item.type === 'video' ? (
              <div>
                <video controls className="w-full">
                  <source src={item.url} type="video/mp4" />
                </video>
                <p>{item.description}</p>
              </div>
            ) : (
              <img src={item.url} alt={item.name} className="w-full" />
            )}
            <button onClick={() => removeItem(item)} className="bg-red-500 text-white p-2 rounded mt-2">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
