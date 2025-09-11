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

  const { theme, setTheme } = useTheme();
  const languages = ["English", "Urdu", "Punjabi", "Sindhi", "Pashto"];
  const router = useRouter();

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
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-6">
          <span className="text-2xl font-bold tracking-wide">myUstad.ai</span>
        </div>

        {!isMobile && (
          <div className="flex space-x-6 text-sm font-medium">
            <a
              href="/courses"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="/courses"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Courses
            </a>
            <a
              href="mailto:info@aisystems.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
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
                className="h-10 w-10 rounded-full"
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
                className="h-10 w-10 rounded-full"
              >
                <PenSquare className="h-5 w-5" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full">
                    <Languages className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" className="p-2 w-32">
                  <div className="mb-1 text-sm font-normal text-muted-foreground">
                    Select Language:
                  </div>
                  {languages.map((lang) => (
                    <div
                      key={lang}
                      onClick={() => handleLanguageSelect(lang)}
                      className={`cursor-pointer text-sm py-[0.125rem] ${
                        lang === selectedLanguage
                          ? "font-bold text-primary"
                          : "font-normal text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lang}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button className="h-10 w-10 rounded-full">
                    <CircleUser className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-56 p-1 rounded-lg"
                  align="end"
                  sideOffset={8}
                >
                  <div className="grid gap-0.5 font-mono">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start gap-2 px-3 py-2 h-8 text-sm font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-3.5 w-3.5" />
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
              className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {isMobile && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setShowMenu(false)}
            className={`fixed inset-0 bg-black/50 backdrop-blur-lg transition-opacity duration-300 
    ${
      showMenu
        ? "opacity-100 pointer-events-auto z-50"
        : "opacity-0 pointer-events-none z-[-1]"
    }`}
          />

          {/* Mobile menu panel */}
          <div
            className={`fixed top-0 right-0 w-80 h-full bg-background border-l border-border shadow-2xl z-50 transition-transform duration-300 ease-out ${
              showMenu ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Menu header */}
            <div
              className={`px-6 py-4 flex justify-between items-center border-b border-border ${
                theme === "dark" ? "" : "bg-[#f2f6ff]"
              }`}
            >
              <span className="text-xl font-bold">Menu</span>
              <button
                onClick={() => setShowMenu(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <nav
              className={`px-6 py-6 space-y-4 ${
                theme === "dark" ? "bg-black" : "bg-[#f2f6ff]"
              }`}
            >
              {[
                { label: "Home", href: "/courses" },
                { label: "Courses", href: "/courses" },
                { label: "Contact", href: "mailto:info@aisystems.com" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setShowMenu(false)}
                  className="block text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Action buttons */}
            <div
              className={`px-6 py-4 space-y-3 border-t border-border ${
                theme === "dark" ? "bg-black" : "bg-[#f2f6ff]"
              }`}
            >
              <button
                onClick={() => {
                  toggleTheme();
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                {mounted && theme === "light" ? (
                  <Moon size={18} />
                ) : (
                  <Sun size={18} />
                )}
                <span className="font-medium">Toggle Theme</span>
              </button>

              <button
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <Bell size={18} />
                <span className="font-medium">Notifications</span>
              </button>

              <button
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <CircleUser size={18} />
                <span className="font-medium">Profile</span>
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
