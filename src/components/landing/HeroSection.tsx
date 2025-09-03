"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleRedirect = () => {
    const token = localStorage.getItem("d_tok");
    if (token) {
      router.push("/courses");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
          Empowering a Brighter Future with myUstad
        </h1>
        <p className="mx-auto max-w-[42rem] leading-normal text-gray-700 sm:text-xl sm:leading-8 italic">
          Revolutionizing education through intelligent learning tools,
          fostering growth, and shaping future-ready minds
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          className="bg-black text-white hover:bg-black/80"
          onClick={handleRedirect}
        >
          Explore Courses
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
