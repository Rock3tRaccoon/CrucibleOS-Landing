import { NotifyForm } from "./NotifyForm";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function Hero() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');

  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        {heroImg && (
          <Image 
            src={heroImg.imageUrl} 
            alt={heroImg.description}
            fill
            className="object-cover"
            data-ai-hint={heroImg.imageHint}
          />
        )}
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-6 tracking-wide animate-fade-in">
          OPEN SOURCE • PERFORMANCE • SECURITY
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter animate-fade-in" style={{ animationDelay: '0.1s' }}>
          The Operating System <br />
          <span className="text-accent">Redefined for Speed.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          CrucibleOS Pulse is a next-generation open-source OS built from the ground up for high-performance computing, hardened security, and seamless developer workflows.
        </p>

        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <NotifyForm />
        </div>

        <div className="mt-16 flex justify-center gap-8 text-muted-foreground/50 grayscale opacity-50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {/* Mock Partners/Supporters Logos Placeholder */}
          <div className="font-headline font-bold">X-KERNEL</div>
          <div className="font-headline font-bold">POS-X</div>
          <div className="font-headline font-bold">SAFECORE</div>
          <div className="font-headline font-bold">CYBERNET</div>
        </div>
      </div>
    </section>
  );
}
