import { NotifyForm } from "./NotifyForm";

export function JoinPulse() {
  return (
    <section id="notify" className="py-32 bg-background border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">System Updates</span>
          <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tighter text-white">
            Join the Pulse.
          </h2>
          <p className="text-lg text-muted-foreground/60 leading-relaxed font-normal">
            Be the first to know when the Crucible<span className="text-primary">OS</span> kernel reaches beta milestones. 
            No marketing fluff—just technical documentation and release candidates.
          </p>
          <div className="pt-4">
            <NotifyForm />
          </div>
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest pt-8 font-bold">
            Data encrypted via Sing Security standards.
          </p>
        </div>
      </div>
    </section>
  );
}
