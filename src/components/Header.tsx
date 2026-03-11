"use client";

import { Cpu } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <Cpu className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-xl tracking-tight text-white">
            Crucible<span className="text-primary">OS</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10 text-[11px] font-bold tracking-[0.1em] uppercase text-muted-foreground/60">
          <Link href="#features" className="hover:text-white transition-colors">Architecture</Link>
          <Link href="#about" className="hover:text-white transition-colors">Kernel</Link>
          <Link href="#explainer" className="hover:text-white transition-colors">Documentation</Link>
          <Link href="#notify" className="hover:text-white transition-colors">Download</Link>
        </nav>

        <Link href="#notify" className="hidden lg:block">
          <button className="bg-white text-black hover:bg-neutral-200 px-6 py-2.5 rounded-sm text-[11px] font-bold tracking-wider uppercase transition-all shadow-xl">
            Join Waitlist
          </button>
        </Link>
      </div>
    </header>
  );
}
