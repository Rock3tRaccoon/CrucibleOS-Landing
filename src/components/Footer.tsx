
import { Cpu, Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background pt-20 pb-10 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-lg">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-headline font-bold text-lg">CrucibleOS Pulse</span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-8">
              Forging the future of open source systems with performance, reliability, and modularity at our core.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors group">
                <Github className="w-5 h-5 text-muted-foreground group-hover:text-background" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors group">
                <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-background" />
              </Link>
              <Link href="#" className="p-2 rounded-full bg-secondary hover:bg-accent transition-colors group">
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-background" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6">Project</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-accent transition-colors">Features</Link></li>
              <li><Link href="#notify" className="hover:text-accent transition-colors">Roadmap</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Source Code</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-accent transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Contributing</Link></li>
              <li><Link href="#disclaimer" className="hover:text-accent transition-colors">Disclaimers</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CrucibleOS Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
