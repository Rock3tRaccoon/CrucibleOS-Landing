import { Shield, Zap, Layers, Cpu, Globe, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: <Zap className="w-5 h-5 text-primary" />,
    title: "L4-Derived Microkernel",
    description: "Highly optimized message passing ensures that IPC overhead is minimal, outperforming traditional monolithic designs."
  },
  {
    icon: <Shield className="w-5 h-5 text-primary" />,
    title: "Address Space Isolation",
    description: "Each system service runs in its own memory domain, preventing cross-process vulnerabilities and memory leaks."
  },
  {
    icon: <Layers className="w-5 h-5 text-primary" />,
    title: "Native POSIX Layer",
    description: "Full compatibility with industry standards. Run standard Unix utilities and applications with zero recompilation."
  },
  {
    icon: <Cpu className="w-5 h-5 text-primary" />,
    title: "Rust-First Design",
    description: "CrucibleOS core primitives are built in Rust, eliminating entire classes of memory safety bugs at the source."
  },
  {
    icon: <Lock className="w-5 h-5 text-primary" />,
    title: "Capabilities-Based",
    description: "Granular permission sets for every process. No 'root' user; only defined capabilities assigned by the kernel."
  },
  {
    icon: <Globe className="w-5 h-5 text-primary" />,
    title: "Distributed Scheduler",
    description: "Automatically balance workloads across multi-core processors and network nodes with our transparent scheduler."
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-24">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] block mb-4">Architecture</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">Built for the <br/>Extreme Edge.</h2>
          <p className="text-lg text-muted-foreground/60 leading-relaxed">
            We've stripped away the legacy bloat of 20th-century operating systems to create a system ready for the next hundred years of compute.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {features.map((f, i) => (
            <Card key={i} className="bg-background border-none rounded-none transition-colors p-8 group h-full">
              <CardHeader className="p-0 mb-6 flex flex-col items-start">
                <div className="mb-6 p-3 bg-white/5 w-fit flex items-center justify-center">
                  {f.icon}
                </div>
                <CardTitle className="text-xl font-bold tracking-tight text-white">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground/60">
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
