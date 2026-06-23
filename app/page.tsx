import { DiagnosticProvider } from "@/components/diagnostic/DiagnosticProvider";
import { DiagnosticModal } from "@/components/diagnostic/DiagnosticModal";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { ResultsMarquee } from "@/components/landing/ResultsMarquee";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { GrowthEngine } from "@/components/landing/GrowthEngine";
import { DiagnosticIncludes } from "@/components/landing/DiagnosticIncludes";
import { SocialProof } from "@/components/landing/SocialProof";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <DiagnosticProvider>
      <Nav />
      <main>
        <Hero />
        <ResultsMarquee />
        <ProblemSolution />
        <GrowthEngine />
        <DiagnosticIncludes />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
      <DiagnosticModal />
    </DiagnosticProvider>
  );
}
