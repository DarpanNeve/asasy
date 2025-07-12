import React from 'react';
import TokenPricingSection from '../components/TokenPricingSection';

export default function Pricing() {
  return (
    <div className="min-h-screen">
      <TokenPricingSection 
        compact={false}
        showReportTypes={true}
        showHeader={true}
      />
    </div>
  );
}