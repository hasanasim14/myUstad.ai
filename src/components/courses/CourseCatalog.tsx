"use client";

import { useEffect, useState } from "react";
import { Search, BookOpen, Clock, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import Navbar from "../Navbar";

interface CourseProps {
  CourseName: string;
  value: string;
}

const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courseData, setCourseData] = useState<CourseProps[]>([]);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/get-courses`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `bearer ${localStorage.getItem("d_tok")}`,
            },
          }
        );
        const data = await response.json();
        setCourseData(data?.data);
      } catch (error) {
        console.error("the error while fetching data", error);
      }
    };
    fetchCourses();
  }, []);

  // eslint-disable-next-line
  const handleCourseClick = (course: string) => {
    localStorage.setItem("course", course);
    router.push("/");
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light" ? "bg-gray-50" : "bg-[#0A0C15]"
      }`}
    >
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section
        className={`py-20 ${
          theme === "light"
            ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white"
            : "bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-6">
            <BookOpen
              className={`w-16 h-16 mx-auto mb-4 ${
                theme === "light" ? "text-blue-200" : "text-indigo-300"
              }`}
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Learn Without Limits
          </h1>
          <p
            className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed ${
              theme === "light" ? "text-blue-100" : "text-indigo-200"
            }`}
          >
            Start, switch, or advance your career with world-class courses from
            top universities and industry experts.
          </p>
          <div className="max-w-lg mx-auto relative">
            <Search
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === "light" ? "text-gray-400" : "text-slate-400"
              }`}
            />
            <Input
              type="text"
              placeholder="What do you want to learn today?"
              className={`pl-12 py-4 text-lg shadow-lg rounded-full focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                theme === "light"
                  ? "text-gray-900 bg-white border-gray-200 placeholder:text-gray-500"
                  : "text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h2
            className={`text-3xl font-bold mb-4 ${
              theme === "light" ? "text-gray-900" : "text-slate-300"
            }`}
          >
            Featured Courses
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              theme === "light" ? "text-gray-600" : "text-slate-300"
            }`}
          >
            Discover high-quality courses designed to help you master new skills
            and advance your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData.map((course) => (
            <Card
              key={course?.value}
              className={`group cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-2 shadow-lg overflow-hidden ${
                theme === "light"
                  ? "bg-white border-gray-200 hover:border-indigo-300"
                  : "bg-slate-800 border-slate-700"
              }`}
              onClick={() => handleCourseClick(course?.value)}
            >
              <div className="relative overflow-hidden">
                <Image
                  width="400"
                  height="240"
                  src="/course.png"
                  alt={course.CourseName}
                  className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <CardContent className="p-8">
                <h3
                  className={`font-bold text-xl mb-4 group-hover:text-indigo-400 transition-colors duration-200 leading-tight ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {course.CourseName}
                </h3>

                <div
                  className={`space-y-3 ${
                    theme === "light" ? "text-gray-600" : "text-slate-300"
                  }`}
                >
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
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform group-hover:scale-105 shadow-lg hover:shadow-indigo-500/25">
                    Start Learning
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State Enhancement */}
        {courseData.length === 1 && (
          <div className="text-center mt-16 py-12">
            <div className="max-w-md mx-auto">
              <BookOpen
                className={`w-16 h-16 mx-auto mb-4 ${
                  theme === "light" ? "text-gray-400" : "text-slate-600"
                }`}
              />
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                More Courses Coming Soon
              </h3>
              <p
                className={`${
                  theme === "light" ? "text-gray-600" : "text-slate-300"
                }`}
              >
                We&apos;re constantly adding new courses to help you learn and
                grow. Check back soon for more exciting content!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className={`py-8 mt-20 border-t ${
          theme === "light"
            ? "bg-gray-100 text-gray-900 border-gray-200"
            : "bg-slate-950 text-white border-slate-800"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <p
              className={`${
                theme === "light" ? "text-gray-600" : "text-slate-400"
              }`}
            >
              &copy; 2025 myUstad.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseCatalog;
