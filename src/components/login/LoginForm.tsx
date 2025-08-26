"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

const LoginForm = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // validate email
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const isToken = localStorage.getItem("token");
    if (isToken) {
      router.push("/courses");
    }
  }, [router]);

  // eslint-disable-next-line
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    setErrors((prev) => {
      if (id === "email") {
        if (value.trim() === "") {
          return { ...prev, email: "Email is required" };
        } else if (!isValidEmail(value.trim())) {
          return { ...prev, email: "Enter a valid email address" };
        } else {
          return { ...prev, email: "" };
        }
      }

      if (id === "password") {
        return {
          ...prev,
          password: value.trim() === "" ? "Password is required" : "",
        };
      }

      return prev;
    });
  };

  const handleSubmit = async () => {
    if (!isValidEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address" }));
      return;
    }

    setIsLoading(true);
    const endpoint = isLoginMode ? "/login" : "/register";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, googleLogin: false }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (isLoginMode) {
          localStorage.setItem("d_tok", data?.access_token);
          toast.success("Login Successful");
          setTimeout(() => router.push("/courses"), 1000);
        } else {
          toast.success("Registration Successful. Please log in.");
          setIsLoginMode(true);
          setFormData({ email: "", password: "" });
        }
      } else {
        toast.error(data?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Request Failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      // This will go directly to Google's OAuth account selection
      await signIn("google", {
        callbackUrl: "/login?fromGoogle=1",
        prompt: "select_account", // forces the Google account picker
      });
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      toast.error("Google sign in failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const checkSessionAndCallAPI = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fromGoogle = urlParams.get("fromGoogle");

      if (fromGoogle !== "1") return;

      if (status === "authenticated" && session?.user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: session?.user?.email,
              googleLogin: true,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            if (data?.data?.token) {
              sessionStorage.setItem("authToken", data.data.token);
              sessionStorage.setItem(
                "user",
                JSON.stringify(data?.data?.token_payload || {})
              );
            }

            toast.success("Login Successful! Redirecting...");
            router.push("/");
          } else {
            throw new Error(data.message || "API request failed");
          }
        } catch (error) {
          console.error("Error calling login_auth_user:", error);
          toast.error("Failed to complete authentication");
        }
      }
    };

    checkSessionAndCallAPI();
  }, [status, session, router]);

  // eslint-disable-next-line
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
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
        {/* Left */}
        <div className="hidden lg:flex w-1/2 bg-transparent/10 backdrop-blur-md text-[#023b58] p-10 flex-col justify-center rounded-l-xl libre">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold leading-tight mb-4 tracking-wide">
              Study Smarter,
              <br />
              Not Harder
            </h2>
            <p className="text-sm font-semibold">
              &quot;Success doesn’t come from what you do occasionally, it comes
              from what you do consistently. Focus, learn, revise — and believe
              in your potential.&quot;
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="w-full lg:w-1/2 p-8 bg-white h-full flex flex-col justify-center rounded-r-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center font-libre">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            {isLoginMode
              ? "Enter your credentials to sign in"
              : "Fill in your details to register"}
          </p>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                className={`w-full ${
                  errors.email
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="example@email.com"
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
                  className={`w-full ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-500 cursor-pointer"
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
              onClick={handleSubmit}
              disabled={
                !formData.email ||
                !formData.password ||
                !!errors.email ||
                !!errors.password ||
                isLoading
              }
              className="w-full bg-[#023b58] text-white py-2 rounded-md hover:bg-[#023b58]/90 transition cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  {isLoginMode ? "Logging in..." : "Registering..."}
                </span>
              ) : isLoginMode ? (
                "Sign In"
              ) : (
                "Register"
              )}
            </Button>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
              type="button"
              // disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>

            {/* Toggle Form Button */}
            <p className="text-sm text-center mt-2">
              {isLoginMode ? (
                <>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(false);
                      setFormData({ email: "", password: "" });
                      setErrors({ email: "", password: "" });
                    }}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginMode(true);
                      setFormData({ email: "", password: "" });
                      setErrors({ email: "", password: "" });
                    }}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
