"use client";

import { useState } from "react";
import { subscribeToNotifications } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BellRing, Loader2 } from "lucide-react";

export function NotifyForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await subscribeToNotifications(formData);
    
    setLoading(false);
    
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      toast({
        title: "Success",
        description: "You've been added to the notification list.",
      });
      (event.target as HTMLFormElement).reset();
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input 
            name="email"
            type="email" 
            placeholder="Technical email address" 
            required 
            className="bg-secondary border-border focus:ring-primary focus:border-primary h-12 rounded-none"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-none electric-glow uppercase text-[10px] tracking-widest"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <BellRing className="w-4 h-4 mr-2" />
              Subscribe
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
