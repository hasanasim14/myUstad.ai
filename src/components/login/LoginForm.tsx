"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    setErrors((prev) => ({
      ...prev,
      [id]: value.trim() === "" ? "This field is required" : "",
    }));

    if (id === "email" && value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        email: isValidEmail(value) ? "" : "Invalid email format",
      }));
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data?.access_token);
        localStorage.setItem("user_name", data?.user_name);
        localStorage.setItem("user_role", data?.user_role);
        if (data?.user_role === "branch") {
          localStorage.setItem("branches", data?.branch);
        }
        // You can use Next.js router here if needed
        // router.push("/app");
      } else {
        console.error("Login error:", data?.message || "Unknown error");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <Image
        src="/login-image.jpg"
        alt="Login Background"
        layout="fill"
        objectFit="cover"
        className="-z-10"
        priority
      />

      <div className="flex flex-col lg:flex-row w-[90vw] h-[90vh] max-w-4xl rounded-xl overflow-hidden shadow-xl">
        {/* Left Quote Section */}
        <div className="hidden lg:flex w-1/2 bg-transparent/10 backdrop-blur-md text-white p-10 flex-col justify-center rounded-l-xl font-libre">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold leading-tight mb-4">
              Study Smarter,
              <br />
              Not Harder
            </h2>
            <p className="text-sm text-black font-light">
              "Success doesn’t come from what you do occasionally, it comes from
              what you do consistently. Focus, learn, revise — and believe in
              your potential."
            </p>
          </div>
        </div>

        {/* Right Login Form */}
        <div className="w-full lg:w-1/2 p-8 bg-white h-full flex flex-col justify-center rounded-r-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center font-libre">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Enter your email and password to sign in
          </p>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-gray-200"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className={`mt-1 w-full px-3 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-gray-200"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="button"
              onClick={handleLogin}
              disabled={
                !formData.email ||
                !formData.password ||
                !!errors.email ||
                isLoading
              }
              className="w-full bg-black text-white py-2 rounded-md hover:bg-blacks/90 transition cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
