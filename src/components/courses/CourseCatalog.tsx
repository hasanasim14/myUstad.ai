"use client";

import { useState } from "react";
import { Search, BookOpen, Clock, Users } from "lucide-react";
// import { Card, CardContent, CardFooter } from "./ui/card";
// import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
// import Navbar from "./Navbar";
import Image from "next/image";
import Navbar from "../Navbar";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter } from "../ui/card";

const courses = [
  {
    id: 1,
    title: "Test Development and Evaluation",
  },
];

const CourseCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleCourseClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-indigo-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Learn Without Limits
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-indigo-200 leading-relaxed">
            Start, switch, or advance your career with world-class courses from
            top universities and industry experts.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="What do you want to learn today?"
              className="pl-12 py-4 text-lg text-white bg-slate-800 border border-slate-700 shadow-lg rounded-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover high-quality courses designed to help you master new skills
            and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2 border border-slate-700 shadow-lg bg-slate-800 overflow-hidden"
              onClick={handleCourseClick}
            >
              <div className="relative overflow-hidden">
                <Image
                  width="400"
                  height="240"
                  src="/course.jpeg"
                  alt={course.title}
                  className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardContent className="p-8">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-900 text-indigo-300 border border-indigo-700">
                    Professional Development
                  </span>
                </div>

                <h3 className="font-bold text-xl mb-4 text-white group-hover:text-indigo-400 transition-colors duration-200 leading-tight">
                  {course.title}
                </h3>

                <div className="space-y-3 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm">Self-paced learning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm">Expert instruction</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm">Comprehensive curriculum</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <div className="w-full">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform group-hover:scale-105 shadow-lg hover:shadow-indigo-500/25">
                    Start Learning
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State Enhancement */}
        {courses.length === 1 && (
          <div className="text-center mt-16 py-12">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-semibold text-white mb-2">
                More Courses Coming Soon
              </h3>
              <p className="text-slate-300">
                We're constantly adding new courses to help you learn and grow.
                Check back soon for more exciting content!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-8 mt-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p className="text-slate-400">
              &copy; 2025 myUstad.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseCatalog;
