"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/projects";
import { Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      // Reload page to reflect auth status change
      window.location.reload();
    } else {
      setError(result.error || "Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-600/10 blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Glow behind the login box */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-violet-500/30 to-teal-500/30 blur-[2px]" />
        
        {/* Login Card */}
        <div className="relative bg-[#0d0d0d]/90 border border-white/[0.08] backdrop-blur-2xl p-8 md:p-10 rounded-3xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-violet-400 mb-4 shadow-lg shadow-violet-500/5">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-white mb-1">
              Admin Portal
            </h1>
            <p className="text-xs text-white/40 tracking-wider uppercase font-medium">
              Portfolio Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400/90 bg-red-950/20 border border-red-500/20 px-4 py-3 rounded-xl"
              >
                {error}
              </motion.div>
            )}

            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="admin"
                  disabled={loading}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.04] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] tracking-widest uppercase text-white/35 font-bold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  disabled={loading}
                  className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.04] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative mt-6 overflow-hidden rounded-xl bg-white text-black py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  Authenticating...
                </>
              ) : (
                "Authenticate"
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 text-center text-[10px] text-white/20">
            Secure Session • Auth via JWT
          </div>

        </div>
      </motion.div>
    </div>
  );
}
