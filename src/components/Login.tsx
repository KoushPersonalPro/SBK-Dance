"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationBlocked, setIsRegistrationBlocked] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-6 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1),rgba(250,250,250,0.8))]" />
      </div>
      
      {/* Back Button */}
      <button
        className="fixed top-4 left-4 sm:top-6 sm:left-6 flex items-center text-black hover:opacity-70 transition-opacity"
        onClick={() => router.push("/")}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm font-[300]">Back to Home</span>
      </button>

      {/* Login Card */}
      <div className="bg-white rounded-2xl border border-black/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md p-6 sm:p-8 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Image
              src="/nataraj.png"
              alt="Dance Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-[200] text-black mb-2">Welcome Back!</h2>
          <p className="text-gray-600 text-sm font-[300]">Sign in to continue your dance journey</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-[300] text-gray-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-[300] text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-black/20 text-black placeholder:text-gray-400 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50/50 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-[300]">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-[300] rounded-lg text-white bg-black hover:bg-black/90 focus:outline-none focus:ring-1 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 font-[300]">
            New to our dance community?{" "}
            {isRegistrationBlocked ? (
              <span className="inline-flex items-center text-red-400 font-[300]">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                </svg>
                Registration is currently closed
              </span>
            ) : (
              <a
                href="/register_page"
                className="font-[300] text-black hover:opacity-70 transition-opacity underline"
              >
                Join us today
              </a>
            )}
          </p>
        </div>
      </div>
      
    </div>
  );
}
