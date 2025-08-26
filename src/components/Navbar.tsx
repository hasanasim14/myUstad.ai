"use client";

import { useState, useEffect } from "react";
import { Bell, CircleUser, Languages, LogOut, Menu, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

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
              <Button className="h-10 w-10 rounded-full p-2 bg-[#141A29] hover:bg-[#0F1420]">
                <Bell className="w-5 h-5" />
              </Button>

              <div className="relative inline-block text-left z-50">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="h-10 w-10 rounded-full p-2 bg-[#141A29] hover:bg-[#0F1420]">
                      <CircleUser className="h-5 w-5" />
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
              <button className="p-2">
                <Bell className="w-4 h-4" />
              </button>
              <div className="p-2">
                <CircleUser className="w-4 h-4" />
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
