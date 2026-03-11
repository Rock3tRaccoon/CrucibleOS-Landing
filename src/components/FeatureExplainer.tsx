"use client";

import { useState } from "react";
import { explainOsFeature } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Loader2, Info } from "lucide-react";

export function FeatureExplainer() {
  const [feature, setFeature] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleExplain() {
    if (!feature) return;
    setLoading(true);
    try {
      const result = await explainOsFeature(feature);
      setExplanation(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const suggestionChips = ["Microkernel", "POSIX", "Hypervisor", "Containerization"];

  return (
    <section id="explainer" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Insight
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Don't let tech jargon slow you down.
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              CrucibleOS is built on advanced concepts. Use our Pulse-AI tool to get instant, human-friendly explanations of any technical feature.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map(chip => (
                <button 
                  key={chip}
                  onClick={() => setFeature(chip)}
                  className="px-3 py-1 rounded-md bg-muted hover:bg-muted/80 text-xs font-medium transition-colors border border-border"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <Card className="border-border bg-card/50 backdrop-blur-sm shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Technical Feature Explainer
              </CardTitle>
              <CardDescription>
                Ask Pulse-AI to explain any OS concept or component.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input 
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  placeholder="e.g. Microkernel architecture"
                  className="bg-background border-border"
                  onKeyDown={(e) => e.key === 'Enter' && handleExplain()}
                />
                <Button 
                  onClick={handleExplain} 
                  disabled={loading || !feature}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>

              {explanation && (
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 animate-fade-in">
                  <p className="text-sm leading-relaxed text-foreground italic">
                    "{explanation}"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
