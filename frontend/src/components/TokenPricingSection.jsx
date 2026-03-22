import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Zap,
  Crown,
  Rocket,
  Diamond,
  ShoppingCart,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  Link,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import toast from "react-hot-toast";
import CheckoutPage from "./CheckoutPage";
import { motion, AnimatePresence } from "framer-motion";

const TokenPricingSection = ({
  compact = false,
  showReportTypes = true,
  showHeader = false,
  className = "",
  onTokenPurchase = null, // Callback for when tokens are purchased
}) => {
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [tokenPackages, setTokenPackages] = useState([]);
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showComparisonChart, setShowComparisonChart] = useState(false);
  const { user } = useAuth();

  // Fetch token packages and user balance on component mount
  useEffect(() => {
    fetchTokenPackages();
    if (user) {
      fetchUserBalance();
    }
  }, [user]);

  const fetchTokenPackages = async () => {
    try {
      const response = await api.get("/tokens/packages");
      let packages = response.data.map((pkg) => ({
        ...pkg,
        icon: getIconForPackage(pkg.package_type),
        color: getColorForPackage(pkg.package_type),
        hoverColor: getHoverColorForPackage(pkg.package_type),
        popular: pkg.package_type === "pro",
      }));

      // Add Enterprise plan as display-only option
      packages.push({
        id: "enterprise-display",
        name: "Enterprise",
        package_type: "enterprise",
        tokens: 100000,
        price_usd: "Custom",
        description: "Custom solutions for large organizations",
        icon: Diamond,
        color: "from-orange-500 to-orange-600",
        hoverColor: "from-orange-600 to-orange-700",
        popular: false,
        isContactOnly: true,
      });

      setTokenPackages(packages);
    } catch (error) {
      console.error("Failed to fetch token packages:", error);
      toast.error("Failed to load token packages");
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await api.get("/tokens/balance");
      setUserBalance(response.data);
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  const getIconForPackage = (type) => {
    switch (type) {
      case "starter":
        return Zap;
      case "pro":
        return Crown;
      case "max":
        return Rocket;
      case "enterprise":
        return Diamond;
      default:
        return Zap;
    }
  };

  const getColorForPackage = (type) => {
    switch (type) {
      case "starter":
        return "from-blue-500 to-blue-600";
      case "pro":
        return "from-purple-500 to-purple-600";
      case "max":
        return "from-emerald-500 to-emerald-600";
      case "enterprise":
        return "from-orange-500 to-orange-600";
      default:
        return "from-blue-500 to-blue-600";
    }
  };

  const getHoverColorForPackage = (type) => {
    switch (type) {
      case "starter":
        return "from-blue-600 to-blue-700";
      case "pro":
        return "from-purple-600 to-purple-700";
      case "max":
        return "from-emerald-600 to-emerald-700";
      case "enterprise":
        return "from-orange-600 to-orange-700";
      default:
        return "from-blue-600 to-blue-700";
    }
  };

  const handlePurchase = async (packageData) => {
    if (packageData.isContactOnly) {
      // Handle contact us for enterprise
      window.location.href = "/contact";
      return;
    }

    if (!user) {
      toast.error("Please login to purchase tokens");
      return;
    }

    setSelectedPackage(packageData);
    setShowCheckout(true);
  };

  const handleCheckoutComplete = async (success) => {
    setShowCheckout(false);
    setSelectedPackage(null);
    setPurchaseLoading(null);

    if (success) {
      await fetchUserBalance(); // Refresh balance
      if (onTokenPurchase) {
        onTokenPurchase(); // Notify parent component
      }
    }
  };

  const reportTypes = [
    {
      id: "basic",
      name: "Basic Report",
      tokens: "2,500",
      description: "Essential analysis and insights",
      features: [
        "Executive Summary (1–2 line value proposition)",
        "Problem/Opportunity Statement",
        "Technology Overview (core idea, brief features)",
        "Key Benefits (USP)",
        "Applications (primary markets/use cases)",
        "IP Snapshot (status & country)",
        "Next Steps (e.g., pilot studies, further R&D)",
        "Expanded Executive Summary (go/no-go recommendation)",
        "Problem & Solution Fit (with background justification)",
        "Technical Feasibility (prototype status, TRL stage)",
        "IP Summary (landscape & freedom-to-operate overview)",
        "Market Signals (interest letters, pilot test data)",
        "Early Competitors (known tech or patent citations)",
        "Regulatory/Compliance Overview",
        "Risk Summary and Key Questions",
      ],
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: "advanced",
      name: "Advanced Report",
      tokens: "7,500",
      description: "Comprehensive analysis with detailed insights",
      features: [
        "Executive Summary (1–2 line value proposition)",
        "Problem/Opportunity Statement",
        "Technology Overview (core idea, brief features)",
        "Key Benefits (USP)",
        "Applications (primary markets/use cases)",
        "IP Snapshot (status & country)",
        "Next Steps (e.g., pilot studies, further R&D)",
        "Expanded Executive Summary (go/no-go recommendation)",
        "Problem & Solution Fit (with background justification)",
        "Technical Feasibility (prototype status, TRL stage)",
        "IP Summary (landscape & freedom-to-operate overview)",
        "Market Signals (interest letters, pilot test data)",
        "Early Competitors (known tech or patent citations)",
        "Regulatory/Compliance Overview",
        "Risk Summary and Key Questions",
        "Detailed Business Case (narrative for VCs)",
        "Technology Description (core claims, development stage, TRL framework)",
        "Market & Competition (segmentation, SWOT analysis, barriers to entry)",
        "TRL & Technical Challenges (scale-up readiness)",
        "Detailed IP & Legal Status (global patent families, claims, FTO risks)",
        "Regulatory Pathways (e.g., CE, FDA, BIS, AIS)",
        "Commercialization Options (spin-off, licensing, JVs)",
        "Preliminary Financial Estimates (cost vs ROI model)",
        "Summary & Go-to-Market Plan",
      ],
      color: "bg-purple-50 border-purple-200",
    },
    {
      id: "comprehensive",
      name: "Comprehensive Report",
      tokens: "9,000",
      description: "Premium analysis with AI-driven insights",
      features: [
        "Executive Summary (1–2 line value proposition)",
        "Problem/Opportunity Statement",
        "Technology Overview (core idea, brief features)",
        "Key Benefits (USP)",
        "Applications (primary markets/use cases)",
        "IP Snapshot (status & country)",
        "Next Steps (e.g., pilot studies, further R&D)",
        "Expanded Executive Summary (go/no-go recommendation)",
        "Problem & Solution Fit (with background justification)",
        "Technical Feasibility (prototype status, TRL stage)",
        "IP Summary (landscape & freedom-to-operate overview)",
        "Market Signals (interest letters, pilot test data)",
        "Early Competitors (known tech or patent citations)",
        "Regulatory/Compliance Overview",
        "Risk Summary and Key Questions",
        "Detailed Business Case (narrative for VCs)",
        "Technology Description (core claims, development stage, TRL framework)",
        "Market & Competition (segmentation, SWOT analysis, barriers to entry)",
        "TRL & Technical Challenges (scale-up readiness)",
        "Detailed IP & Legal Status (global patent families, claims, FTO risks)",
        "Regulatory Pathways (e.g., CE, FDA, BIS, AIS)",
        "Commercialisation Options (spin-off, licensing, JVs)",
        "Preliminary Financial Estimates (cost vs ROI model)",
        "Summary & Go-to-Market Plan",
        "In-depth IP Claims Analysis (protection scope, robustness)",
        "Global Freedom-to-Operate Report (US, EU, India, China)",
        "Market Analysis (size, trends, addressable market, adoption barriers)",
        "Business Models (licensing, SaaS, product, hybrid)",
        "5-Year ROI & Revenue Projections (unit cost, pricing, TAM/SAM/SOM)",
        "Funding Strategy (grants, accelerators, VC, PE, SBIR)",
        "Licensing & Exit Strategy (terms, IP deal structures)",
        "Team & Strategic Partners Required (talent, advisors)",
        "Implementation Roadmap (milestones, MVP, pilot scaling)",
        "Appendices (patent tables, market research data, technical drawings)",
      ],
      color: "bg-emerald-50 border-emerald-200",
    },
  ];

  // Comparison chart data
  const comparisonFeatures = [
    {
      feature: "Executive Summary",
      basic: { included: true, note: "(Expanded)" },
      advanced: { included: true, note: "(Detailed VC-ready)" },
      comprehensive: { included: true, note: "(Investor-grade)" },
    },
    {
      feature: "Problem Statement",
      basic: { included: true, note: "(In-depth)" },
      advanced: { included: true, note: "" },
      comprehensive: { included: true, note: "" },
    },
    {
      feature: "Technical Overview",
      basic: { included: true, note: "" },
      advanced: { included: true, note: "" },
      comprehensive: { included: true, note: "" },
    },
    {
      feature: "TRL Analysis",
      basic: { included: true, note: "(Initial)" },
      advanced: { included: true, note: "(With data)" },
      comprehensive: { included: true, note: "(Detailed roadmap)" },
    },
    {
      feature: "IP Snapshot",
      basic: { included: true, note: "" },
      advanced: { included: true, note: "" },
      comprehensive: { included: true, note: "(Full claim analysis)" },
    },
    {
      feature: "Market Signals",
      basic: { included: true, note: "" },
      advanced: { included: true, note: "(Segmentation)" },
      comprehensive: { included: true, note: "(Global trends + forecasts)" },
    },
    {
      feature: "Competitor Analysis",
      basic: { included: true, note: "" },
      advanced: { included: true, note: "(SWOT, landscape)" },
      comprehensive: { included: true, note: "(With market share data)" },
    },
    {
      feature: "Commercialization Paths",
      basic: { included: false, note: "" },
      advanced: { included: true, note: "" },
      comprehensive: { included: true, note: "(With financial modeling)" },
    },
    {
      feature: "ROI Forecast",
      basic: { included: false, note: "" },
      advanced: { included: true, note: "(Preliminary)" },
      comprehensive: { included: true, note: "(5-year plan + funding)" },
    },
    {
      feature: "Legal & Regulatory",
      basic: { included: true, note: "(Basic)" },
      advanced: { included: true, note: "" },
      comprehensive: { included: true, note: "(By jurisdiction)" },
    },
    {
      feature: "PDF Output",
      basic: { included: true, note: "" },
      advanced: { included: true, note: "" },
      comprehensive: { included: true, note: "" },
    },
    {
      feature: "AI Auto-Generated",
      basic: { included: true, note: "" },
      advanced: { included: true, note: "" },
      comprehensive: { included: true, note: "" },
    },
    {
      feature: "Use Cases",
      basic: { included: true, note: "Institutional Feasibility" },
      advanced: { included: true, note: "Incubators, Angel/Seed" },
      comprehensive: { included: true, note: "VC Decks, Govt Grants" },
    },
  ];

  const toggleReport = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  // Responsive grid classes based on compact mode
  const getGridClasses = () => {
    if (compact) {
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
    }
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6";
  };

  const getContainerClasses = () => {
    if (compact) {
      return "py-6";
    }
    return "py-16 bg-gradient-to-br from-gray-50 to-gray-100";
  };

  return (
    <div>
      <div className={`${getContainerClasses()} px-4 ${className}`}>
        <div className="max-w-7xl mx-auto">
          {/* User Token Balance */}
          {user && userBalance && !compact ? (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200">
                <Zap className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-gray-700 mr-2">Available Tokens:</span>
                <span className="font-bold text-blue-600 text-lg">
                  {userBalance.available_tokens.toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-yellow-100 rounded-full shadow border border-yellow-300">
                <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">
                  For free tokens, please sign up
                </span>
              </div>
            </div>
          )}

          {/* Token Packages Section */}
          {true && (
            <div className="text-center mb-12">
              <h2
                className={`${
                  compact ? "text-xl" : "text-4xl"
                } font-bold text-gray-900 mb-4`}
              >
                {compact ? "Purchase Tokens" : "Token Packages"}
              </h2>
              <p
                className={`${
                  compact ? "text-base" : "text-xl"
                } text-gray-600 max-w-2xl mx-auto`}
              >
                Choose the perfect package for your needs. Purchase tokens to
                generate reports.
              </p>
            </div>
          )}

          {/* Packages Grid */}
          <div
            className={`${getGridClasses()} ${
              compact ? "max-w-4xl" : "max-w-6xl"
            } mx-auto ${showReportTypes && !compact ? "mb-20" : "mb-8"}`}
          >
            {tokenPackages.map((pkg) => (
              <TokenPricingCard
                key={pkg.id}
                pkg={pkg}
                isHovered={hoveredPackage === pkg.id}
                onHover={setHoveredPackage}
                onPurchase={handlePurchase}
                isPurchasing={purchaseLoading === pkg.id}
                user={user}
                compact={compact}
              />
            ))}
          </div>

          {/* Report Requirements Section */}
          {showReportTypes && !compact && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Report Requirements
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                  Different report types require different amounts of tokens.
                  Compare features or view detailed breakdown.
                </p>

                {/* Toggle Buttons */}
                <div className="flex justify-center gap-4 mb-8">
                  <button
                    onClick={() => setShowComparisonChart(false)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      !showComparisonChart
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <FileText className="w-5 h-5 inline mr-2" />
                    Detailed View
                  </button>
                  <button
                    onClick={() => setShowComparisonChart(true)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      showComparisonChart
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <BarChart3 className="w-5 h-5 inline mr-2" />
                    Compare Features
                  </button>
                </div>
              </div>

              {/* Comparison Chart */}
              {showComparisonChart ? (
                <div className="max-w-6xl mx-auto mb-12">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <th className="text-left py-6 px-6 text-gray-900 font-bold text-lg min-w-[200px]">
                              Feature
                            </th>
                            <th className="text-center py-6 px-6 text-blue-600 font-bold text-lg min-w-[160px]">
                              <div className="flex flex-col items-center">
                                <span>Basic</span>
                                <span className="text-sm font-normal text-gray-600 mt-1">
                                  2,500 tokens
                                </span>
                              </div>
                            </th>
                            <th className="text-center py-6 px-6 text-purple-600 font-bold text-lg min-w-[160px]">
                              <div className="flex flex-col items-center">
                                <span>Advanced</span>
                                <span className="text-sm font-normal text-gray-600 mt-1">
                                  7,500 tokens
                                </span>
                              </div>
                            </th>
                            <th className="text-center py-6 px-6 text-emerald-600 font-bold text-lg min-w-[160px]">
                              <div className="flex flex-col items-center">
                                <span>Comprehensive</span>
                                <span className="text-sm font-normal text-gray-600 mt-1">
                                  9,000 tokens
                                </span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonFeatures.map((item, index) => (
                            <tr
                              key={index}
                              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-25"
                              }`}
                            >
                              <td className="py-4 px-6 font-semibold text-gray-900">
                                {item.feature}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex flex-col items-center">
                                  {item.basic.included ? (
                                    <Check className="w-6 h-6 text-green-600 mb-1" />
                                  ) : (
                                    <X className="w-6 h-6 text-red-400 mb-1" />
                                  )}
                                  {item.basic.note && (
                                    <span className="text-xs text-gray-600 text-center max-w-[120px]">
                                      {item.basic.note}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex flex-col items-center">
                                  {item.advanced.included ? (
                                    <Check className="w-6 h-6 text-green-600 mb-1" />
                                  ) : (
                                    <X className="w-6 h-6 text-red-400 mb-1" />
                                  )}
                                  {item.advanced.note && (
                                    <span className="text-xs text-gray-600 text-center max-w-[120px]">
                                      {item.advanced.note}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <div className="flex flex-col items-center">
                                  {item.comprehensive.included ? (
                                    <Check className="w-6 h-6 text-green-600 mb-1" />
                                  ) : (
                                    <X className="w-6 h-6 text-red-400 mb-1" />
                                  )}
                                  {item.comprehensive.note && (
                                    <span className="text-xs text-gray-600 text-center max-w-[120px]">
                                      {item.comprehensive.note}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* Original Detailed Report Types Table */
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-4 px-6 text-gray-900 font-semibold">
                              Report Type
                            </th>
                            <th className="text-center py-4 px-6 text-gray-900 font-semibold">
                              Tokens Required
                            </th>
                            <th className="text-center py-4 px-6 text-gray-900 font-semibold">
                              Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportTypes.map((report, index) => (
                            <React.Fragment key={report.id}>
                              <tr
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                                }`}
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center">
                                    <FileText className="w-5 h-5 text-gray-500 mr-3" />
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        {report.name}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {report.description}
                                      </div>
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
                                  <td
                                    colSpan="3"
                                    className={`py-0 ${report.color}`}
                                  >
                                    <div className="p-6 m-4 rounded-xl">
                                      <h4 className="font-semibold text-gray-900 mb-3">
                                        {report.name} includes:
                                      </h4>
                                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {report.features.map((feature, idx) => (
                                          <li
                                            key={idx}
                                            className="flex items-center text-gray-700"
                                          >
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
              )}
            </>
          )}

          {/* Bottom Note */}
          {!compact && (
            <div className="text-center mt-12">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 max-w-2xl mx-auto">
                <p className="text-gray-600">
                  Would you need any help choosing the right package? For
                  enterprise solutions with custom pricing and bulk discounts,
                  don't hesitate to get in touch with our sales team.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Checkout Page */}
        {showCheckout && selectedPackage && (
          <CheckoutPage
            isOpen={showCheckout}
            packageData={selectedPackage}
            onClose={() => handleCheckoutComplete(false)}
            onSuccess={() => handleCheckoutComplete(true)}
          />
        )}
      </div>
    </div>
  );
};

// Token Pricing Card Component
const TokenPricingCard = ({
  pkg,
  isHovered,
  onHover,
  onPurchase,
  isPurchasing,
  user,
  compact = false,
}) => {
  const IconComponent = pkg.icon;
  const isEnterprise = pkg.isContactOnly;

  return (
    <div
      className={`relative transform transition-all duration-300 ${
        isHovered ? "scale-105" : "scale-100"
      } ${pkg.popular && !compact ? "lg:-translate-y-4" : ""}`}
      onMouseEnter={() => onHover(pkg.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Popular Badge */}
      {pkg.popular && !compact && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      {/* Card */}
      <div
        className={`relative h-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 ${
          pkg.popular && !compact ? "border-orange-200" : "border-gray-100"
        } ${isHovered ? "shadow-2xl border-gray-200" : ""}`}
      >
        {/* Header Gradient */}
        <div
          className={`h-2 bg-gradient-to-r ${
            isHovered ? pkg.hoverColor : pkg.color
          }`}
        />

        {/* Content */}
        <div className={`${compact ? "p-4" : "p-6"} text-center`}>
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div
              className={`${
                compact ? "p-2" : "p-3"
              } rounded-full bg-gradient-to-r ${pkg.color} shadow-lg`}
            >
              <IconComponent
                className={`${compact ? "w-5 h-5" : "w-6 h-6"} text-white`}
              />
            </div>
          </div>

          {/* Name */}
          <h3
            className={`${
              compact ? "text-lg" : "text-xl"
            } font-bold text-gray-900 mb-3`}
          >
            {pkg.name}
          </h3>

          {/* Price */}
          <div
            className={`${
              compact ? "text-2xl" : "text-3xl"
            } font-bold text-gray-900 mb-2`}
          >
            <div className="text-center">
              {typeof pkg.price_usd === "string" ? (
                pkg.price_usd
              ) : (
                <>
                  {pkg.original_price_usd &&
                  pkg.original_price_usd > pkg.price_usd ? (
                    <div className="space-y-1">
                      <div className="text-lg text-gray-500 line-through">
                        ${pkg.original_price_usd}
                      </div>
                      <div className="text-blue-600">${pkg.price_usd}</div>
                      <div className="text-xs text-green-600 font-medium">
                        Save $
                        {(pkg.original_price_usd - pkg.price_usd).toFixed(0)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-blue-600">${pkg.price_usd}</div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tokens */}
          <div
            className={`${compact ? "text-xs" : "text-sm"} text-gray-600 mb-6`}
          >
            {isEnterprise
              ? "Custom Tokens"
              : `${pkg.tokens.toLocaleString()} Tokens`}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => {
              if (!user && !isEnterprise) {
                window.location.href = "/login";
                return;
              }
              onPurchase(pkg);
            }}
            disabled={isPurchasing}
            className={`w-full py-2 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              isHovered && !isPurchasing ? "scale-105" : "scale-100"
            } bg-gradient-to-r ${pkg.color} hover:${
              pkg.hoverColor
            } shadow-lg hover:shadow-xl ${
              compact ? "text-xs" : "text-sm"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPurchasing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : isEnterprise ? (
              <>
                <Mail className="w-4 h-4 mr-2 inline" />
                Contact Us
              </>
            ) : !user ? (
              "Login to Purchase"
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2 inline" />
                Purchase
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPricingSection;
