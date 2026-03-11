import Link from "next/link";

export function Hero() {
  return (
    <section className="relative pt-48 pb-32 overflow-hidden flex items-center justify-center text-center">
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight animate-fade-in opacity-0">
          Pioneering System Security
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto mb-10 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
          At CrucibleOS, we are dedicated to safeguarding the digital world with cutting-edge 
          system architecture and proactive threat intelligence.
        </p>

        <div className="animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
          <Link href="#explainer">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3.5 rounded-md text-sm font-bold transition-all shadow-xl shadow-primary/25">
              Explore Our Research
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}