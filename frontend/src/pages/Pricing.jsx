import React, { useState } from 'react';
import { Zap, Crown, Rocket, FileText, ChevronDown, ChevronUp, Diamond } from 'lucide-react';

const TokenPricingPackages = () => {
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: '₹2,500',
      tokens: '8,000',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      price: '₹7,500',
      tokens: '24,000',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
      popular: true
    },
    {
      id: 'max',
      name: 'Max Pack',
      price: '₹9,000',
      tokens: '29,000',
      icon: Rocket,
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'from-emerald-600 to-emerald-700'
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      price: 'Customized',
    
      icon: Diamond,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700'
    }
  ];

  const reportTypes = [
    {
      id: 'basic',
      name: 'Basic Report',
      tokens: '2,500',
      description: 'Essential analysis and insights',
      features: [
        'Executive Summary (1–2 line value proposition)',
        'Problem/Opportunity Statement',
        'Technology Overview (core idea, brief features)',
        'Key Benefits (USP)',
        'Applications (primary markets/use cases)',
        'IP Snapshot (status & country)',
        'Next Steps (e.g., pilot studies, further R&D)',
        'Expanded Executive Summary (go/no-go recommendation)',
        'Problem & Solution Fit (with background justification)',
        'Technical Feasibility (prototype status, TRL stage)',
        'IP Summary (landscape & freedom-to-operate overview)',
        'Market Signals (interest letters, pilot test data)',
        'Early Competitors (known tech or patent citations)',
        'Regulatory/Compliance Overview',
        'Risk Summary and Key Questions'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'advanced',
      name: 'Advanced Report',
      tokens: '7,500',
      description: 'Comprehensive analysis with detailed insights',
      features: [
        'Executive Summary (1–2 line value proposition)',
        'Problem/Opportunity Statement',
        'Technology Overview (core idea, brief features)',
        'Key Benefits (USP)',
        'Applications (primary markets/use cases)',
        'IP Snapshot (status & country)',
        'Next Steps (e.g., pilot studies, further R&D)',
        'Expanded Executive Summary (go/no-go recommendation)',
        'Problem & Solution Fit (with background justification)',
        'Technical Feasibility (prototype status, TRL stage)',
        'IP Summary (landscape & freedom-to-operate overview)',
        'Market Signals (interest letters, pilot test data)',
        'Early Competitors (known tech or patent citations)',
        'Regulatory/Compliance Overview',
        'Risk Summary and Key Questions',
        'Detailed Business Case (narrative for VCs)',
        'Technology Description (core claims, development stage, TRL framework)',
        'Market & Competition (segmentation, SWOT analysis, barriers to entry)',
        'TRL & Technical Challenges (scale-up readiness)',
        'Detailed IP & Legal Status (global patent families, claims, FTO risks)',
        'Regulatory Pathways (e.g., CE, FDA, BIS, AIS)',
        'Commercialization Options (spin-off, licensing, JVs)',
        'Preliminary Financial Estimates (cost vs ROI model)',
        'Summary & Go-to-Market Plan'
      ],
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Report',
      tokens: '9,000',
      description: 'Premium analysis with AI-driven insights',
      features: [
        'Executive Summary (1–2 line value proposition)',
        'Problem/Opportunity Statement',
        'Technology Overview (core idea, brief features)',
        'Key Benefits (USP)',
        'Applications (primary markets/use cases)',
        'IP Snapshot (status & country)',
        'Next Steps (e.g., pilot studies, further R&D)',
        'Expanded Executive Summary (go/no-go recommendation)',
        'Problem & Solution Fit (with background justification)',
        'Technical Feasibility (prototype status, TRL stage)',
        'IP Summary (landscape & freedom-to-operate overview)',
        'Market Signals (interest letters, pilot test data)',
        'Early Competitors (known tech or patent citations)',
        'Regulatory/Compliance Overview',
        'Risk Summary and Key Questions',
        'Detailed Business Case (narrative for VCs)',
        'Technology Description (core claims, development stage, TRL framework)',
        'Market & Competition (segmentation, SWOT analysis, barriers to entry)',
        'TRL & Technical Challenges (scale-up readiness)',
        'Detailed IP & Legal Status (global patent families, claims, FTO risks)',
        'Regulatory Pathways (e.g., CE, FDA, BIS, AIS)',
        'Commercialisation Options (spin-off, licensing, JVs)',
        'Preliminary Financial Estimates (cost vs ROI model)',
        'Summary & Go-to-Market Plan',
        'In-depth IP Claims Analysis (protection scope, robustness)',
        'Global Freedom-to-Operate Report (US, EU, India, China)',
        'Market Analysis (size, trends, addressable market, adoption barriers)',
        'Business Models (licensing, SaaS, product, hybrid)',
        '5-Year ROI & Revenue Projections (unit cost, pricing, TAM/SAM/SOM)',
        'Funding Strategy (grants, accelerators, VC, PE, SBIR)',
        'Licensing & Exit Strategy (terms, IP deal structures)',
        'Team & Strategic Partners Required (talent, advisors)',
        'Implementation Roadmap (milestones, MVP, pilot scaling)',
        'Appendices (patent tables, market research data, technical drawings)'
      ],
      color: 'bg-emerald-50 border-emerald-200'
    }
  ];

  const toggleReport = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Token Packages Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Token Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect package for your needs. Purchase tokens to generate reports.
          </p>
        </div>

        {/* Packages Grid - Updated to show 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon;
            const isHovered = hoveredPackage === pkg.id;
            
            return (
              <div
                key={pkg.id}
                className={`relative transform transition-all duration-300 ${
                  isHovered ? 'scale-105' : 'scale-100'
                } ${pkg.popular ? 'lg:-translate-y-4' : ''}`}
                onMouseEnter={() => setHoveredPackage(pkg.id)}
                onMouseLeave={() => setHoveredPackage(null)}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Card */}
                <div className={`relative h-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 ${
                  pkg.popular ? 'border-orange-200' : 'border-gray-100'
                } ${isHovered ? 'shadow-2xl border-gray-200' : ''}`}>
                  
                  {/* Header Gradient */}
                  <div className={`h-2 bg-gradient-to-r ${isHovered ? pkg.hoverColor : pkg.color}`} />
                  
                  {/* Content */}
                  <div className="p-6 text-center">
                    {/* Icon */}
                    <div className="flex items-center justify-center mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${pkg.color} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {pkg.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {pkg.price}
                    </div>
                    
                    {/* Tokens */}
                    <div className="text-sm text-gray-600 mb-6">
                      {pkg.tokens} Tokens
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-2 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                        isHovered ? 'scale-105' : 'scale-100'
                      } bg-gradient-to-r ${pkg.color} hover:${pkg.hoverColor} shadow-lg hover:shadow-xl text-sm`}
                    >
                      Purchase Package
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Report Requirements Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Report Requirements
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Different report types require different amounts of tokens. Click to see what each report includes.
          </p>
        </div>

        {/* Report Types Table */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-gray-900 font-semibold">Report Type</th>
                    <th className="text-center py-4 px-6 text-gray-900 font-semibold">Tokens Required</th>
                    <th className="text-center py-4 px-6 text-gray-900 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {reportTypes.map((report, index) => (
                    <React.Fragment key={report.id}>
                      <tr className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                              <div className="font-semibold text-gray-900">{report.name}</div>
                              <div className="text-sm text-gray-600">{report.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {report.tokens} Tokens
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => toggleReport(report.id)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          >
                            {expandedReport === report.id ? (
                              <>
                                Hide Details
                                <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                Show Details
                                <ChevronDown className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedReport === report.id && (
                        <tr>
                          <td colSpan="3" className={`py-0 ${report.color}`}>
                            <div className="p-6 m-4 rounded-xl">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                {report.name} includes:
                              </h4>
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {report.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center text-gray-700">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Need help choosing the right package? Our tokens are valid for 90 days from purchase. 
            <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 ml-1">Contact support</span> for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenPricingPackages;