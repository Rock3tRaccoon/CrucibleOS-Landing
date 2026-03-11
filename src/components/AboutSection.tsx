import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

export function AboutSection() {
  const aboutImg = PlaceHolderImages.find(img => img.id === 'about-defense');

  return (
    <section id="about" className="py-32 bg-background/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted font-medium px-3 py-1 text-[11px] uppercase tracking-wider rounded-sm">
              About Us
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Advancing Digital Defense
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground/80 leading-relaxed font-normal max-w-xl">
              <p>
                Founded by leading experts in systems security, CrucibleOS Pulse is a 
                research organization committed to advancing the field of digital defense. 
                Our values are rooted in integrity, collaboration, and a relentless pursuit of knowledge.
              </p>
              <p>
                We build foundations for a secure future, ensuring that the most critical 
                infrastructure remains resilient against the evolving landscape of digital threats.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            {aboutImg && (
              <Image 
                src={aboutImg.imageUrl} 
                alt={aboutImg.description}
                fill
                className="object-cover"
                data-ai-hint={aboutImg.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}