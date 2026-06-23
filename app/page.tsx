import { DiagnosticProvider } from "@/components/diagnostic/DiagnosticProvider";
import { DiagnosticModal } from "@/components/diagnostic/DiagnosticModal";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { GrowthEngine } from "@/components/landing/GrowthEngine";
import { SocialProof } from "@/components/landing/SocialProof";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <DiagnosticProvider>
      <Nav />
      <main>
        <Hero />
        <ProblemSolution />
        <GrowthEngine />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
      <DiagnosticModal />
    </DiagnosticProvider>
  );
}
