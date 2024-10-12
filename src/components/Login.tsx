"use client";

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistrationBlocked, setIsRegistrationBlocked] = useState(false);
  const router = useRouter();

  // Function to handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Logged in successfully');
      router.push('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  // Fetch registration status from Firestore
  const fetchRegistrationStatus = async () => {
    const docRef = doc(db, 'settings', 'registrationStatus');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setIsRegistrationBlocked(data.blocked); // Make sure you're correctly getting the 'blocked' field
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchRegistrationStatus();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        className="text-gray-500 hover:text-black absolute top-5 right-5"
        onClick={() => router.push('/')}
      >
        &lt; Back
      </button>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-2 w-full text-black"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-black">
          Not a Student? Make your life blissful by joining us right now{' '}
          {isRegistrationBlocked ? (
            <span className="text-gray-400">Registration is currently blocked.</span>
          ) : (
            <a href="/register_page" className="text-blue-500 underline">
              Click here
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
