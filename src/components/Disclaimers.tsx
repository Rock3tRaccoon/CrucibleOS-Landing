
import { AlertTriangle, ShieldAlert } from "lucide-react";

export function Disclaimers() {
  return (
    <section id="disclaimer" className="py-16 bg-destructive/5 border-y border-destructive/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h3 className="font-headline font-bold text-xl uppercase tracking-wider text-destructive">Usage Restrictions</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              CrucibleOS Pulse is currently <span className="text-foreground underline decoration-destructive/40">not intended for use in California or New York</span>. Please check local regulations regarding open source distribution.
            </p>
          </div>
          
          <div className="w-px h-24 bg-border hidden md:block opacity-30" />

          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
              <ShieldAlert className="w-6 h-6 text-destructive" />
              <h3 className="font-headline font-bold text-xl uppercase tracking-wider text-destructive">Security Notice</h3>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              This operating system is in early alpha and <span className="text-foreground underline decoration-destructive/40">has not been audited</span> by third-party security firms. Use at your own risk in production environments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
