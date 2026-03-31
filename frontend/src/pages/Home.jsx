import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/home/HeroSection";
import WhyAssesmeSection from "../components/home/WhyAssesmeSection";
import WhoCanUseSection from "../components/home/WhoCanUseSection";
import CoreFeaturesSection from "../components/home/CoreFeaturesSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import BenefitsSection from "../components/home/BenefitsSection";
import ReportGeneratorSection from "../components/home/ReportGeneratorSection";
import SampleReportsSection from "../components/home/SampleReportsSection";
import CommercializationSection from "../components/home/CommercializationSection";
import RTTPSection from "../components/home/RTTPSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <HeroSection />
      <WhyAssesmeSection />
      <WhoCanUseSection />
      <CoreFeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ReportGeneratorSection />
      <SampleReportsSection />
      <CommercializationSection />
      <RTTPSection />
      <Footer />
    </div>
  );
}
