import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import WhyAssesmeSection from "../components/home/WhyAssesmeSection";
import WhoCanUseSection from "../components/home/WhoCanUseSection";
import TheProblemSection from "../components/home/TheProblemSection";
import TheSolutionSection from "../components/home/TheSolutionSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import ForInvestorsSection from "../components/home/ForInvestorsSection";
import ForFoundersSection from "../components/home/ForFoundersSection";
import SampleReportsSection from "../components/home/SampleReportsSection";
import PrototypingHighlightSection from "../components/home/PrototypingHighlightSection";
import ReportGeneratorSection from "../components/home/ReportGeneratorSection";
import FinalCTASection from "../components/home/FinalCTASection";
export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <HeroSection />
      <ReportGeneratorSection />
      <WhyAssesmeSection />
      <WhoCanUseSection />
      <TheProblemSection />
      <TheSolutionSection />
      <HowItWorksSection />
      <ForInvestorsSection />
      <ForFoundersSection />
      <SampleReportsSection />
      <PrototypingHighlightSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
