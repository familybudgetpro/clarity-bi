"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  BarChart3,
  Lock,
  Mail,
  ArrowRight,
  TrendingUp,
  PieChart,
  Shield,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email && password) {
      router.push("/");
    } else {
      setError("Please enter valid credentials");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-linear-to-br from-primary via-primary/90 to-primary/70 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full border-2 border-white/30 animate-pulse" />
          <div
            className="absolute bottom-32 right-16 w-48 h-48 rounded-full border-2 border-white/20"
            style={{ animation: "pulse 3s ease-in-out infinite 1s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full border border-white/10"
            style={{ animation: "pulse 4s ease-in-out infinite 0.5s" }}
          />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 py-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-black tracking-tight">
                Clarity BI
              </h1>
              <p className="text-white/60 text-xs font-medium">
                Intelligent Analytics
              </p>
            </div>
          </div>

          {/* Hero Text */}
          <h2 className="text-white text-4xl xl:text-5xl font-black leading-tight mb-6">
            Make smarter
            <br />
            <span className="text-white/80">decisions with</span>
            <br />
            real-time data
          </h2>
          <p className="text-white/60 text-base max-w-md mb-12 leading-relaxed">
            Enterprise-grade analytics built for insurance leaders. From
            boardroom insights to field-level performance tracking.
          </p>

          {/* Feature Cards */}
          <div className="space-y-3 max-w-md">
            <FeatureCard
              icon={<TrendingUp size={18} />}
              title="Live Trend Analysis"
              desc="Real-time premium and claims tracking"
            />
            <FeatureCard
              icon={<PieChart size={18} />}
              title="Claims Intelligence"
              desc="AI-powered loss ratio forecasting"
            />
            <FeatureCard
              icon={<Shield size={18} />}
              title="Risk Dashboard"
              desc="Portfolio-level risk assessment"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-black text-lg">
                C
              </span>
            </div>
            <div>
              <h1 className="text-foreground text-xl font-black">Clarity BI</h1>
              <p className="text-muted-foreground text-xs">
                Intelligent Analytics
              </p>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-black text-foreground mb-1">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your analytics dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-medium animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  placeholder="admin@clarity-bi.ae"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/30 border border-border rounded-xl py-3 pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 accent-primary"
                />
                <span className="text-xs text-muted-foreground">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Don't have an account?{" "}
              <button className="text-primary font-semibold hover:underline">
                Contact Admin
              </button>
            </p>
          </div>

          <div className="mt-12 pt-6 border-t border-border">
            <p className="text-[10px] text-muted-foreground/60 text-center">
              © 2026 Clarity BI. Enterprise Analytics Platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/15 transition-colors">
      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-white text-sm font-bold">{title}</h4>
        <p className="text-white/50 text-xs">{desc}</p>
      </div>
    </div>
  );
}
