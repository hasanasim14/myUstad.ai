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

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto"];
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Ensure we're rendering for the correct theme after mount
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
    setShowLanguageMenu(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Avoid hydration mismatch by not rendering theme icons until mounted
  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white/5 backdrop-blur-md text-white px-4 py-2 shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-bold tracking-wide">myUstad.ai</span>
        </div>

        {!isMobile && (
          <div className="flex space-x-6 text-sm font-medium text-white">
            <a
              href="/courses"
              className="hover:text-white/90 transition-colors"
            >
              Home
            </a>
            <a
              href="/courses"
              className="hover:text-white/90 transition-colors"
            >
              Courses
            </a>
            <a
              href="mailto:info@aisystems.com"
              className="hover:text-white/90 transition-colors"
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
                className="relative h-9 w-9 rounded-full bg-[#2A2D37] hover:bg-[#3A3F4B]"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Feedback */}
              <button
                // onClick={() => setOpenDialog(true)}
                className="cursor-pointer bg-[#2A2D37] hover:bg-[#3A3F4B] text-white p-2.5 rounded-full shadow-sm transition duration-200"
              >
                <PenSquare className="w-4 h-4" />
              </button>

              {/* Language select */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    // size="icon"
                    variant="ghost"
                    className="bg-[#2A2D37] hover:bg-[#3A3F4B] rounded-full"
                  >
                    <Languages className="h-5 w-5 text-white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="bottom"
                  className="p-2 w-32 bg-white border-gray-200"
                >
                  <div className="mb-1 text-[10px] font-normal">
                    Select Language:
                  </div>
                  {languages.map((lang) => (
                    <div
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`cursor-pointer text-[9px] py-[2px] ${
                        lang === selectedLanguage
                          ? "font-bold text-blue-500"
                          : "font-normal text-gray-700"
                      }`}
                    >
                      {lang}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>

              {/* Logout */}
              <div className="relative inline-block text-left z-50">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="h-10 w-10 rounded-full p-2 bg-[#2A2D37] hover:bg-[#3A3F4B]">
                      <CircleUser className="h-5 w-5 text-white" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-56 p-1 rounded-lg border bg-[#0F1420] border-[#414141]"
                    align="end"
                    sideOffset={8}
                  >
                    <div className="grid gap-0.5 font-mono">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal text-red-500 hover:bg-[#2a0e0e] hover:text-red-400"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-3.5 w-3.5 text-red-500" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}

          {isMobile && (
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 ml-2"
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
            className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-all duration-500 ease-in-out ${
              showMenu
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="px-6 py-4 flex justify-between items-center border-b">
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={() => setShowMenu(false)}
                className="text-gray-600 hover:text-blue-600"
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
                  className="block hover:text-blue-600"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="px-6 mt-6 space-y-4 text-sm">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 p-2 hover:text-blue-600"
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                <span>Toggle Theme</span>
              </button>
              <button className="flex items-center gap-2 p-2 hover:text-blue-600">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              <button className="flex items-center gap-2 p-2 hover:text-blue-600">
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
