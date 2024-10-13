"use client";

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase'; // Import your Firestore instance

export default function Register() {
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [studentImage, setStudentImage] = useState<File | null>(null); // Handle File object
  const [parentName, setParentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Function to calculate age based on selected DOB
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    // If birth date is greater than today’s date (after current month and day), decrease age by 1
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle DOB change
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDob = e.target.value;
    setDob(selectedDob);
    const calculatedAge = calculateAge(selectedDob);
    setAge(calculatedAge.toString());
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Attempt to create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User:', user); // Log the user object

      // Prepare to upload the image if it's selected
      let imageUrl = '';
      if (studentImage) {
        // Sanitize the file name
        const sanitizedFileName = studentImage.name.replace(/\s+/g, '_'); // Replace spaces with underscores
        const storageRef = ref(getStorage(), `student_images/${user.uid}/${sanitizedFileName}`);

        try {
          // Upload the file
          await uploadBytes(storageRef, studentImage);
          // Get the download URL
          imageUrl = await getDownloadURL(storageRef);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setError('Image upload failed. Please try again.');
          return;
        }
      }

      // Save additional user details in the database under user.uid
      await setDoc(doc(db, 'users', user.uid), {
        studentName,
        dob,
        age,
        address,
        studentImage: imageUrl, // Store the image URL
        parentName,
        parentMobile,
      });

      alert('Registration successful');
      router.push('/auth'); // Redirect to login page
    } catch (err: any) {
      console.error('Registration error:', err);
      // Handle specific error cases
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please use a different email.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudentImage(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="date"
            value={dob}
            onChange={handleDobChange} // Handle DOB change to calculate age
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={age} // Age will be automatically calculated
            onChange={(e) => setAge(e.target.value)} // Keep it editable in case
            className="border rounded-lg p-2 w-full text-black"
            required
            readOnly // Age is read-only, calculated from DOB
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="file"
            accept="image/*" // Accept image files
            onChange={handleImageUpload}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="text"
            placeholder="Parent's Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="text"
            placeholder="Parent's Mobile Number"
            value={parentMobile}
            onChange={(e) => setParentMobile(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-black">
          Already have an account?{' '}
          <a href="/auth" className="text-blue-500 underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
