"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import {toast, Toaster} from "react-hot-toast"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistrationBlocked, setIsRegistrationBlocked] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully");

      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const fetchRegistrationStatus = async () => {
    const docRef = doc(db, "settings", "registrationStatus");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setIsRegistrationBlocked(data.blocked);
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchRegistrationStatus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-white p-6">
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
      {/* Back Button */}
      <button
        className="absolute top-5 left-5 text-yellow-700 hover:underline"
        onClick={() => router.push("/")}
      >
        &lt; Back
      </button>

      {/* Login Card */}
      <div className="bg-white border border-yellow-200 rounded-lg shadow-md w-full max-w-md p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center text-yellow-700 mb-4">
          Login
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-yellow-300 rounded-md w-full px-3 py-2 text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-medium px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Login
          </button>
        </form>

        {/* Registration Link */}
        <p className="mt-6 text-sm text-center text-gray-700">
          New here?{" "}
          {isRegistrationBlocked ? (
            <span className="text-red-500">Registration is blocked.</span>
          ) : (
            <a
              href="/register_page"
              className="text-yellow-600 hover:underline"
            >
              Register now
            </a>
          )}
        </p>
      </div>
    </div>
  );
}
