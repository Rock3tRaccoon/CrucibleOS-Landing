"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <ShieldCheck className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-xl tracking-tight text-white">
            CrucibleOS <span className="text-primary/90">Pulse</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10 text-[13px] font-medium tracking-wide uppercase text-muted-foreground/80">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
          <Link href="#explainer" className="hover:text-white transition-colors">Research</Link>
          <Link href="#disclaimer" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        <Link href="#notify" className="hidden lg:block">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-md text-[13px] font-bold transition-all shadow-lg shadow-primary/20">
            Get Pulse
          </button>
        </Link>
      </div>
    </header>
  );
}