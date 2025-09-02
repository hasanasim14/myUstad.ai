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
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          The Next Chapter Is Yours
        </h1>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleRedirect} size="lg">
          Explore
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
