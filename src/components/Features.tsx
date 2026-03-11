
import { Shield, Zap, Layers, Cpu, Globe, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-accent" />,
    title: "Microkernel Performance",
    description: "Built on a lean microkernel architecture for minimal latency and maximum system responsiveness."
  },
  {
    icon: <Shield className="w-8 h-8 text-accent" />,
    title: "Immutable Core",
    description: "An immutable system root ensures that your OS remains clean, secure, and reproducible over time."
  },
  {
    icon: <Layers className="w-8 h-8 text-accent" />,
    title: "Modular Drivers",
    description: "Hot-swappable hardware drivers that run in user-space, preventing system crashes from hardware errors."
  },
  {
    icon: <Cpu className="w-8 h-8 text-accent" />,
    title: "Posix Compliant",
    description: "Run your favorite Unix-based applications without modifications through our native compatibility layer."
  },
  {
    icon: <Lock className="w-8 h-8 text-accent" />,
    title: "Hardened Security",
    description: "End-to-end memory protection and hardware-backed secure boot come standard on every installation."
  },
  {
    icon: <Globe className="w-8 h-8 text-accent" />,
    title: "Cloud Native",
    description: "Built-in primitives for container orchestration and remote management from day one."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Core Functionalities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience a system designed for stability, speed, and the future of interconnected computing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card key={i} className="bg-card border-border hover:border-accent/50 transition-all feature-card-hover group">
              <CardHeader>
                <div className="mb-4 bg-primary/20 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-accent/20 transition-colors">
                  {f.icon}
                </div>
                <CardTitle className="text-xl mb-2">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {f.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
