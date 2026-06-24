"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginInput } from "@/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/admin");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-200 selection:text-brand-900">
      {/* Premium Background Mesh Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-mesh-gradient opacity-40 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-brand-500/10 rounded-full blur-[100px] z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2rem] border border-white shadow-glass-lg p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              className="w-16 h-16 mb-5"
            >
              <img src="/logo.png" alt="Lumina Logo" className="w-full h-full object-contain drop-shadow-md" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Lumina</h1>
            <p className="text-slate-500 font-medium text-sm mt-2">Sign in to your admin panel</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <div className="relative shadow-sm rounded-xl">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                <input
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="w-full bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 pl-12 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="mt-2 text-xs font-medium text-red-500">{errors.email.message}</p>}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative shadow-sm rounded-xl">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-white border border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 pl-12 pr-12 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-xs font-medium text-red-500">{errors.password.message}</p>}
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white border-0 shadow-md h-12 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                size="lg"
                loading={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          <p className="text-center text-xs font-medium text-slate-400 mt-8">
            Admin access only. No public registration.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
