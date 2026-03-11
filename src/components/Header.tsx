
"use client";

import { Cpu } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-primary p-1.5 rounded-lg group-hover:bg-accent transition-colors">
            <Cpu className="w-6 h-6 text-white group-hover:text-background" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight">CrucibleOS <span className="text-accent">Pulse</span></span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="#explainer" className="hover:text-accent transition-colors">AI Explainer</Link>
          <Link href="#disclaimer" className="hover:text-accent transition-colors">Disclaimer</Link>
        </nav>

        <Link href="#notify">
          <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all electric-glow">
            Get Started
          </button>
        </Link>
      </div>
    </header>
  );
}
