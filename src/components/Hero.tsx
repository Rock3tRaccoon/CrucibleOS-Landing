import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative pt-64 pb-32 overflow-hidden flex items-center justify-center text-center">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex justify-center mb-8 animate-fade-in opacity-0">
          <Badge variant="outline" className="px-4 py-1.5 border-white/10 bg-white/5 text-white/60 text-[10px] uppercase tracking-[0.2em] rounded-full">
            Kernel Version 0.4.2 Alpha
          </Badge>
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-10 tracking-tighter animate-fade-in opacity-0">
          Rethink the <br/><span className="text-primary italic">Microkernel.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground/60 max-w-2xl mx-auto mb-12 animate-fade-in opacity-0 leading-relaxed" style={{ animationDelay: '0.2s' }}>
          CrucibleOS is a high-performance, POSIX-compliant operating system built from the ground up for stability, modularity, and memory safety.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
          <Link href="#explainer">
            <button className="bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-2xl shadow-primary/20">
              View Architecture
            </button>
          </Link>
          <Link href="#features">
            <button className="bg-transparent border border-white/10 hover:bg-white/5 text-white px-10 py-4 rounded-sm text-xs font-bold uppercase tracking-widest transition-all">
              Kernel Docs
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
