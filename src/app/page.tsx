import Features from "@/components/landing/Features";
import Hero from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#fafafa]">
      {/* Background gradients for light mode */}
      <div className="pointer-events-none fixed inset-0">
        {/* Base light gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />

        {/* Soft pastel blue glow */}
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-200/40 blur-[120px]" />

        {/* Soft pastel purple glow */}
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-200/40 blur-[120px]" />

        {/* Optional subtle warm glow */}
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-pink-100/30 blur-[150px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />

        {/* Footer */}
        <footer className="bg-gray-100 py-8 border-t border-gray-200">
          <div className="container max-w-4xl mx-auto px-6 text-center">
            <p className="text-gray-600">
              &copy; 2025 myUstad.ai. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
