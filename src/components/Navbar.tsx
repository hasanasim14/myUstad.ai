"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CircleUser,
  Languages,
  LogOut,
  Menu,
  Moon,
  PenSquare,
  Sun,
  X,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FeedbackModal } from "./FeedbackModal";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  const languages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto"];
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setShowMenu(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", selectedLanguage);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    setTimeout(() => {
      router.push("/login");
    }, 500);
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleCancelFeedback = () => {
    setOpenFeedbackModal(false);
  };

  return (
    <nav
      className={`backdrop-blur-md px-4 py-2 shadow-sm border-b ${
        theme === "dark"
          ? "bg-gray-900/90 text-white border-gray-800"
          : "bg-white/90 text-gray-900 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-bold tracking-wide">myUstad.ai</span>
        </div>

        {!isMobile && (
          <div className="flex space-x-6 text-sm font-medium">
            <a
              href="/courses"
              className={`transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Home
            </a>
            <a
              href="/courses"
              className={`transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Courses
            </a>
            <a
              href="mailto:info@aisystems.com"
              className={`transition-colors ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Contact
            </a>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {mounted && theme === "light" ? (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setOpenFeedbackModal(true)}
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <PenSquare className="h-5 w-5" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <Languages className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  className={`p-2 w-32 border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    className={`mb-1 text-sm font-normal ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Select Language:
                  </div>
                  {languages.map((lang) => (
                    <div
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`cursor-pointer text-sm py-[0.125rem] ${
                        lang === selectedLanguage
                          ? "font-bold text-blue-500"
                          : theme === "dark"
                          ? "font-normal text-gray-300 hover:text-white"
                          : "font-normal text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {lang}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      theme === "dark"
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    <CircleUser className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={`w-56 p-1 rounded-lg border ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                  align="end"
                  sideOffset={8}
                >
                  <div className="grid gap-0.5 font-mono">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`justify-start gap-2 px-3 py-2 h-8 text-sm font-normal text-red-500 ${
                        theme === "dark"
                          ? "hover:bg-red-900/20 hover:text-red-400"
                          : "hover:bg-red-50 hover:text-red-600"
                      }`}
                      onClick={handleLogout}
                    >
                      <LogOut className="h-3.5 w-3.5 text-red-500" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <FeedbackModal
                open={openFeedbackModal}
                onCancel={handleCancelFeedback}
              />
            </>
          )}

          {isMobile && (
            <button
              onClick={toggleMenu}
              className={`ml-2 ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {isMobile && (
        <>
          <div
            onClick={() => setShowMenu(false)}
            className={`fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${
              showMenu
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          />
          <div
            className={`fixed top-0 right-0 w-64 h-full shadow-lg z-50 transition-all duration-500 ease-in-out ${
              theme === "dark"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900"
            } ${
              showMenu
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div
              className={`px-6 py-4 flex justify-between items-center border-b ${
                theme === "ligdarkht" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={() => setShowMenu(false)}
                className={`${
                  theme === "dark"
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <X />
              </button>
            </div>

            <nav className="px-6 space-y-4 mt-4 text-sm">
              {["Home", "Courses", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  onClick={() => setShowMenu(false)}
                  className={`block ${
                    theme === "dark"
                      ? "text-gray-300 hover:text-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="px-6 mt-6 space-y-4 text-sm">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-2 p-2 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {mounted && theme === "light" ? (
                  <Moon size={16} />
                ) : (
                  <Sun size={16} />
                )}
                <span>Toggle Theme</span>
              </button>
              <button
                className={`flex items-center gap-2 p-2 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              <button
                className={`flex items-center gap-2 p-2 ${
                  theme === "dark"
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <CircleUser className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
