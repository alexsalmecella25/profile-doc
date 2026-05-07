"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CellaLogo } from "@/components/CellaLogo";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const CORRECT_PASSWORD = "C3ll4.2025%";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Always succeed for testing
    setIsSuccess(true);
    setTimeout(() => {
      sessionStorage.setItem("cella_authorized", "true");
      onLogin();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[5000] flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* Left side: Medical Imagery Backdrop */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0f1115] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#0052ff]/10 rounded-full blur-[120px] animate-pulse" />
        
        <img 
          src="https://images.pexels.com/photos/36930468/pexels-photo-36930468.jpeg" 
          alt="Medical Planning" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
      </div>

      {/* Right side: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-[420px] space-y-10 relative z-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-2">
            <div className="mb-8">
              <CellaLogo />
            </div>
            <h2 className="text-[22px] font-semibold tracking-tight text-[#121212]">Te damos la bienvenida a Cella</h2>
            <p className="text-[14px] text-slate-500 font-normal">
              Introduce tu correo electrónico para empezar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <Label className="text-[13px] font-semibold text-[#041e49] ml-0.5 group-focus-within:text-[#1a73e8] transition-colors">Correo Electrónico</Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a73e8] transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    type="text" 
                    placeholder="doctor@hospital.es" 
                    className="h-[52px] bg-slate-50 border-slate-200 rounded-[12px] text-[14px] pl-12 pr-4 focus:ring-1 ring-[#1a73e8] transition-all shadow-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading || isSuccess}
              className={`w-full h-[52px] rounded-[12px] font-bold text-[15px] gap-2 transition-all active:scale-[0.98] border-none ${
                isSuccess 
                  ? "bg-green-600 hover:bg-green-600 text-white" 
                  : "bg-[#1a73e8] hover:bg-[#155ebd] text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2 animate-in zoom-in duration-300">
                  <CheckCircle2 size={18} />
                  <span>Bienvenido</span>
                </div>
              ) : (
                "Continuar"
              )}
            </Button>
          </form>

          <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Cella Medical</p>
            <div className="flex gap-4">
              <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Privacidad</a>
              <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Términos</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
