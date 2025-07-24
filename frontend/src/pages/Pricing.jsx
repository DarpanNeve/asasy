import React from "react";
import TokenPricingSection from "../components/TokenPricingSection";

export default function Pricing() {
  return (
    <div className="min-h-screen">
      {/* Add currency notice */}
      <div className="bg-blue-50 border-b border-blue-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center text-blue-800">
              <span className="text-sm font-medium">
                💰 All prices displayed in Indian Rupees (INR) including 18% GST
              </span>
            </div>
          </div>
        </div>
      </div>
      <TokenPricingSection
        compact={false}
        showReportTypes={true}
        showHeader={false}
      />
    </div>
  );
}
