
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { Disclaimers } from "@/components/Disclaimers";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <FeatureExplainer />
      <Disclaimers />
      <Footer />
    </main>
  );
}
