"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth} from '@/lib/firebase'; // Import User type from Firebase
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth'; // Import the User type


export default function Navbar() {
  const [user, setUser] = useState<User | null>(null); // State to hold user authentication status
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
      <div className="container mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <img
            src="nataraj.png"
            alt="Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />

          {/* Site Title */}
          <h1 className="text-base tracking-tight">
            <span className="font-['Bitcount'] font-[200] text-2xl md:text-3xl text-black">SriLakshmi</span>{" "}
            <span className="text-gray-700 text-[10px] md:text-sm font-xs">Bharatanatya Kalakshetram</span>
          </h1>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center gap-8"> {/* Consistent gap */}
          <Link href="/" className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link href="/" className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            About Us
          </Link>
          <Link href="/galleryshow" className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Gallery
          </Link>
          <Link href="/#announcements" className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Announcements
          </Link>
          <Link href="https://sbkcalls.netlify.app/" target='_blank' className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Online Meetings
          </Link>
          <Link href="/" className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Contact Us
          </Link>
          {user ? (
            <Link href="/dashboard" className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
              Dashboard
            </Link>
          ) : (
            <button onClick={handleLoginClick} className="text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
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
        <div className="md:hidden bg-white py-6 px-6 space-y-4">
          <Link href="/" className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Home
          </Link>
          <Link href="/" className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            About Us
          </Link>
          <Link href="/galleryshow" className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Gallery
          </Link>
          <Link href="/#announcements" className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Announcements
          </Link>
          <Link href="https://sbkcalls.netlify.app/" target='_blank' className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Online Meetings
          </Link>
          <Link href="/" className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
            Contact Us
          </Link>
          {user ? (
            <Link href="/dashboard" className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity">
              Dashboard
            </Link>
          ) : (
            <button
              onClick={handleLoginClick}
              className="block text-black text-[15px] font-[300] hover:opacity-70 transition-opacity w-full text-left"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
