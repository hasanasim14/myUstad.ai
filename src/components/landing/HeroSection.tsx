"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRedirect = () => {
    const token = localStorage.getItem("d_tok");
    if (token) {
      router.push("/courses");
    } else {
      router.push("/login");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold tracking-wide">
                myUstad.ai
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="mailto:info@aisystems.com"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Contact
              </a>
              <Button variant="outline" onClick={() => router.push("/login")}>
                Login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  Courses
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  About
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                >
                  Contact
                </a>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full text-left px-3 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 mt-2"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-10">
            <h1 className="text-6xl font-bold leading-tight">
              <span className="text-gray-900">
                Empowering a Brighter Future with{" "}
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                myUstad
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed italic">
              Revolutionizing education through intelligent learning tools,
              fostering growth, and shaping future-ready minds
            </p>
            <div className="pt-3">
              <button
                onClick={handleRedirect}
                className="group relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center mx-auto overflow-hidden cursor-pointer"
              >
                {/* Sliding background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />

                {/* Button content */}
                <span className="relative z-10 flex items-center">
                  Explore Courses
                  <svg
                    className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 border-t border-gray-200">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            &copy; 2025 myUstad.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
