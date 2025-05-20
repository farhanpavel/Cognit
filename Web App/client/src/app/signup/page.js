"use client";
import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${url}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role: "student",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully!");
      router.push("/signin");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-[#f8f7fe] to-[#f0eeff] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#7657ff]/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#7657ff]/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-[#7657ff]/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-[#7657ff]/15 rounded-full"></div>

        <div
          className={`w-full max-w-md relative z-10 transition-all duration-700 ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="mb-8 flex justify-center">
            <img
              src="/images/Group.png"
              alt="Logo"
              className="h-14 transition-transform hover:scale-105"
            />
          </div>

          <Card className="border-[#7657ff]/20 shadow-xl backdrop-blur-sm bg-white/90 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#322372] to-[#7657ff]"></div>

            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#7657ff] to-[#322372] bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-[#7657ff]/70">
                Join our community and start your journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    Full Name
                    {fullName.length > 2 && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === "fullName" ? "scale-[1.02]" : ""
                    }`}
                  >
                    <User
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${
                        activeField === "fullName"
                          ? "text-[#7657ff]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 border-[#7657ff]/30 focus-visible:ring-[#7657ff] transition-all duration-300"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={() => setActiveField("fullName")}
                      onBlur={() => setActiveField(null)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    Email Address
                    {email && email.includes("@") && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === "email" ? "scale-[1.02]" : ""
                    }`}
                  >
                    <Mail
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${
                        activeField === "email"
                          ? "text-[#7657ff]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10 border-[#7657ff]/30 focus-visible:ring-[#7657ff] transition-all duration-300"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setActiveField("email")}
                      onBlur={() => setActiveField(null)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === "password" ? "scale-[1.02]" : ""
                    }`}
                  >
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${
                        activeField === "password"
                          ? "text-[#7657ff]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 border-[#7657ff]/30 focus-visible:ring-[#7657ff] transition-all duration-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setActiveField("password")}
                      onBlur={() => setActiveField(null)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-[#7657ff] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                  {password && (
                    <div className="flex gap-1 mt-1">
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          password.length > 0 ? "bg-red-400" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          password.length >= 6 ? "bg-yellow-400" : "bg-gray-200"
                        }`}
                      ></div>
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          password.length >= 8 ? "bg-green-400" : "bg-gray-200"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div
                    className={`relative transition-all duration-300 ${
                      activeField === "confirmPassword" ? "scale-[1.02]" : ""
                    }`}
                  >
                    <Lock
                      className={`absolute left-3 top-3 h-4 w-4 transition-colors duration-300 ${
                        activeField === "confirmPassword"
                          ? "text-[#7657ff]"
                          : "text-muted-foreground"
                      }`}
                    />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 border-[#7657ff]/30 focus-visible:ring-[#7657ff] transition-all duration-300 ${
                        !passwordMatch && confirmPassword
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setActiveField("confirmPassword")}
                      onBlur={() => setActiveField(null)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-[#7657ff] transition-colors"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </button>
                  </div>
                  {!passwordMatch && confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    className="text-[#7657ff] border-[#7657ff]/50"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-[#7657ff] hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="text-[#7657ff] hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7657ff] to-[#322372] hover:from-[#322372] hover:to-[#7657ff] transition-all duration-500 text-white font-medium py-2 px-4 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                  disabled={isLoading || (confirmPassword && !passwordMatch)}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 text-center pb-6">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/signin"
                  className="text-[#7657ff] font-medium hover:underline transition-colors hover:text-[#322372]"
                >
                  Sign in
                </a>
              </div>
            </CardFooter>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2025 Team X-OR. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right side - Image with content */}
      <div className="hidden lg:flex flex-1 relative bg-[#322372] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#322372] via-[#7657ff]/80 to-[#322372] opacity-90"></div>

        {/* Abstract shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Team Collaboration"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
        />

        <div
          className={`relative z-10 flex flex-col items-center justify-center h-full p-12 text-white transition-all duration-1000 ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-md text-center">
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are already experiencing the power of
              our platform.
            </p>

            <div className="space-y-8 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-white/50"
                  />
                  <div className="text-left">
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-white/70">Marketing Director</p>
                  </div>
                </div>
                <p className="text-left text-white/90">
                  &quot;This platform has completely transformed how we manage
                  our projects. The intuitive interface and powerful features
                  have boosted our productivity by 40%. &quot;
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="text-white/80 font-medium">
                  Trusted by leading companies worldwide
                </p>
                <div className="flex gap-8 items-center">
                  <div className="bg-white/20 h-8 w-24 rounded-md"></div>
                  <div className="bg-white/20 h-8 w-20 rounded-md"></div>
                  <div className="bg-white/20 h-8 w-28 rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
