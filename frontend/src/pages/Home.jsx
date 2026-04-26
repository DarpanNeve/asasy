import { useSEO } from "../hooks/useSEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import WhyAssesmeSection from "../components/home/WhyAssesmeSection";
import HowAssesmeWorksSection from "../components/home/HowAssesmeWorksSection";
import WhoCanUseSection from "../components/home/WhoCanUseSection";
import TheProblemSection from "../components/home/TheProblemSection";
import TheSolutionSection from "../components/home/TheSolutionSection";
import ForInvestorsSection from "../components/home/ForInvestorsSection";
import InvestorDistributionSection from "../components/home/InvestorDistributionSection";
import TechSectorSection from "../components/home/TechSectorSection";
import ForFoundersSection from "../components/home/ForFoundersSection";
import SampleReportsSection from "../components/home/SampleReportsSection";
import PrototypingHighlightSection from "../components/home/PrototypingHighlightSection";
import ReportGeneratorSection from "../components/home/ReportGeneratorSection";
import GuidelinesSection from "../components/home/GuidelinesSection";
import RoadmapSection from "../components/home/RoadmapSection";
import FinalCTASection from "../components/home/FinalCTASection";
export default function Home() {
  useSEO({
    title: "AI Technology Assessment, Prototyping & Investor Platform | Assessme",
    description: "Assess, build, and fund your innovation with Assessme. AI-powered technology assessment, prototyping, startup onboarding, and investor matching—all in one platform.",
    keywords: "AI technology assessment, startup validation platform, prototype development, investor matching platform, TRL analysis, innovation commercialization",
  });
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <HeroSection />
      <ReportGeneratorSection />
      <GuidelinesSection />
      <SampleReportsSection />
      <HowAssesmeWorksSection />
      <WhyAssesmeSection />
      <WhoCanUseSection />
      <TheProblemSection />
      <TheSolutionSection />
      <RoadmapSection />
      <ForInvestorsSection />
      <InvestorDistributionSection />
      <TechSectorSection />
      <ForFoundersSection />
      <PrototypingHighlightSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
