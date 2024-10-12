"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '@/lib/firebase'; // Firebase auth import
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null); // State to hold user authentication status
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const router = useRouter();

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set the authenticated user
    });
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    router.push('/auth'); // Redirect to login page
  };

  const handleRegisterClick = () => {
    router.push('/register_page'); // Redirect to registration page
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle mobile menu
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center">
        {/* Logo Image */}
        <img
          src="nataraj.png" // Replace with your image path
          alt="Logo"
          className="w-12 h-12 rounded-full mr-3" // Adjust size and margin as needed
        />

        {/* Site Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          Sri Lakshmi Bharatanatya Kalakshetram
        </h1>

        {/* Desktop Navbar */}
        <div className="hidden md:flex space-x-6 ml-6"> {/* Added margin-left for spacing */}
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            About Us
          </Link>
          <Link href="/galleryshow" className="text-gray-600 hover:text-gray-800">
            Gallery
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            Contact Us
          </Link>
          {user ? (
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              Dashboard
            </Link>
          ) : (
            <button onClick={handleLoginClick} className="text-gray-600 hover:text-gray-800">
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden ml-auto"> {/* Added margin-left auto to push it to the right */}
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navbar Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 space-y-2">
          <Link href="/" className="block text-gray-600 hover:text-gray-800">
            Home
          </Link>
          <Link href="/" className="block text-gray-600 hover:text-gray-800">
            About Us
          </Link>
          <Link href="/gallery" className="block text-gray-600 hover:text-gray-800">
            Gallery
          </Link>
          <Link href="/" className="block text-gray-600 hover:text-gray-800">
            Contact Us
          </Link>
          {user ? (
            <Link href="/dashboard" className="block text-gray-600 hover:text-gray-800">
              Dashboard
            </Link>
          ) : (
            <button
              onClick={handleLoginClick}
              className="block text-gray-600 hover:text-gray-800"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
