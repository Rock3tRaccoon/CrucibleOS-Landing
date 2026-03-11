import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { Features } from "@/components/Features";
import { FeatureExplainer } from "@/components/FeatureExplainer";
import { Disclaimers } from "@/components/Disclaimers";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <Features />
      <FeatureExplainer />
      <Disclaimers />
      <Footer />
    </main>
  );
}