import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TokenPricingSection from "../components/TokenPricingSection";

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <Header />
      <TokenPricingSection
        compact={false}
        showReportTypes={true}
        showHeader={false}
      />
      <Footer />
    </div>
  );
}
