import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function AboutSection() {
  const aboutImg = PlaceHolderImages.find(img => img.id === 'about-defense');

  return (
    <section id="about" className="py-32 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">System Core</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1]">
                Isolated Drivers.<br/>Zero Kernel Panics.
              </h2>
            </div>
            
            <div className="space-y-8 text-lg text-muted-foreground/60 leading-relaxed font-normal max-w-xl">
              <p>
                Unlike monolithic kernels, Crucible<span className="text-accent">OS</span> moves device drivers and file systems into 
                isolated user-space processes. A failure in a GPU driver won't bring down your 
                entire system—it simply restarts.
              </p>
              <p className="text-white/80 font-medium border-l-2 border-primary pl-6">
                Our microkernel architecture provides the foundation for a crash-resistant 
                computing environment that scales from embedded systems to massive server clusters.
              </p>
            </div>

            <div className="flex items-center gap-12 pt-4">
              <div>
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Driver Isolation</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-3xl font-bold text-white mb-1">~2ms</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Syscall Latency</div>
              </div>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-[4/5] rounded-none overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            {aboutImg && (
              <Image 
                src={aboutImg.imageUrl} 
                alt={aboutImg.description}
                fill
                className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                data-ai-hint={aboutImg.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}
