import React, { useState, useEffect } from 'react';
import { Zap, Crown, Rocket, Diamond, ShoppingCart, Mail, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import CheckoutPage from './CheckoutPage';

const TokenPricingSection = ({ 
  compact = false, 
  showReportTypes = true, 
  showHeader = true,
  className = "",
  onTokenPurchase = null // Callback for when tokens are purchased
}) => {
  const [hoveredPackage, setHoveredPackage] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [tokenPackages, setTokenPackages] = useState([]);
  const [userBalance, setUserBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
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
      const response = await api.get('/tokens/packages');
      let packages = response.data.map(pkg => ({
        ...pkg,
        icon: getIconForPackage(pkg.package_type),
        color: getColorForPackage(pkg.package_type),
        hoverColor: getHoverColorForPackage(pkg.package_type),
        popular: pkg.package_type === 'pro'
      }));
      
      // Add Enterprise plan as display-only option
      packages.push({
        id: 'enterprise-display',
        name: 'Enterprise',
        package_type: 'enterprise',
        tokens: 100000,
        price_usd: 'Custom',
        description: 'Custom solutions for large organizations',
        icon: Diamond,
        color: 'from-orange-500 to-orange-600',
        hoverColor: 'from-orange-600 to-orange-700',
        popular: false,
        isContactOnly: true
      });
      
      setTokenPackages(packages);
    } catch (error) {
      console.error('Failed to fetch token packages:', error);
      toast.error('Failed to load token packages');
    }
  };

  const fetchUserBalance = async () => {
    try {
      const response = await api.get('/tokens/balance');
      setUserBalance(response.data);
    } catch (error) {
      console.error('Failed to fetch user balance:', error);
    }
  };

  const getIconForPackage = (type) => {
    switch (type) {
      case 'starter': return Zap;
      case 'pro': return Crown;
      case 'max': return Rocket;
      case 'enterprise': return Diamond;
      default: return Zap;
    }
  };

  const getColorForPackage = (type) => {
    switch (type) {
      case 'starter': return 'from-blue-500 to-blue-600';
      case 'pro': return 'from-purple-500 to-purple-600';
      case 'max': return 'from-emerald-500 to-emerald-600';
      case 'enterprise': return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getHoverColorForPackage = (type) => {
    switch (type) {
      case 'starter': return 'from-blue-600 to-blue-700';
      case 'pro': return 'from-purple-600 to-purple-700';
      case 'max': return 'from-emerald-600 to-emerald-700';
      case 'enterprise': return 'from-orange-600 to-orange-700';
      default: return 'from-blue-600 to-blue-700';
    }
  };

  const handlePurchase = async (packageData) => {
    if (packageData.isContactOnly) {
      // Handle contact us for enterprise
      window.open('mailto:support@asasy.com?subject=Enterprise Token Package Inquiry&body=Hi, I am interested in enterprise token packages. Please contact me with custom pricing and solutions.', '_blank');
      return;
    }
    
    if (!user) {
      toast.error('Please login to purchase tokens');
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
      id: 'basic',
      name: 'Basic Report',
      tokens: '2,500',
      description: 'Essential analysis and insights',
      features: [
        'Executive Summary',
        'Problem/Opportunity Statement',
        'Technology Overview',
        'Key Benefits',
        'Applications',
        'IP Snapshot',
        'Next Steps'
      ],
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'advanced',
      name: 'Advanced Report',
      tokens: '7,500',
      description: 'Comprehensive analysis with detailed insights',
      features: [
        'All Basic Report features',
        'Expanded Executive Summary',
        'Technical Feasibility Analysis',
        'Market Signals & Competition',
        'Regulatory Overview',
        'Risk Assessment',
        'Business Case Development',
        'Go-to-Market Strategy'
      ],
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'comprehensive',
      name: 'Comprehensive Report',
      tokens: '9,000',
      description: 'Premium analysis with AI-driven insights',
      features: [
        'All Advanced Report features',
        'In-depth IP Claims Analysis',
        'Global Freedom-to-Operate Report',
        'Detailed Market Analysis',
        '5-Year Financial Projections',
        'Funding Strategy',
        'Licensing & Exit Strategy',
        'Implementation Roadmap',
        'Professional Appendices'
      ],
      color: 'bg-emerald-50 border-emerald-200'
    }
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
    <div className={`${getContainerClasses()} px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* User Token Balance */}
        {user && userBalance && !compact && showHeader && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-700 mr-2">Available Tokens:</span>
              <span className="font-bold text-blue-600 text-lg">{userBalance.available_tokens.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Token Packages Section */}
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className={`${compact ? 'text-xl' : 'text-4xl'} font-bold text-gray-900 mb-4`}>
              {compact ? 'Purchase Tokens' : 'Token Packages'}
            </h2>
            <p className={`${compact ? 'text-base' : 'text-xl'} text-gray-600 max-w-2xl mx-auto`}>
              Choose the perfect package for your needs. Purchase tokens to generate reports.
            </p>
          </div>
        )}

        {/* Packages Grid */}
        <div className={`${getGridClasses()} ${compact ? 'max-w-4xl' : 'max-w-6xl'} mx-auto ${showReportTypes && !compact ? 'mb-20' : 'mb-8'}`}>
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
          </>
        )}

        {/* Bottom Note */}
        {!compact && (
          <div className="text-center mt-12">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Need help choosing the right package? Our tokens are valid for 90 days from purchase. All prices include 18% GST.
              For enterprise solutions with custom pricing and bulk discounts, please contact our sales team.
            </p>
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
  compact = false 
}) => {
  const IconComponent = pkg.icon;
  const isEnterprise = pkg.isContactOnly;
  
  return (
    <div
      className={`relative transform transition-all duration-300 ${
        isHovered ? 'scale-105' : 'scale-100'
      } ${pkg.popular && !compact ? 'lg:-translate-y-4' : ''}`}
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
      <div className={`relative h-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 ${
        pkg.popular && !compact ? 'border-orange-200' : 'border-gray-100'
      } ${isHovered ? 'shadow-2xl border-gray-200' : ''}`}>
        
        {/* Header Gradient */}
        <div className={`h-2 bg-gradient-to-r ${isHovered ? pkg.hoverColor : pkg.color}`} />
        
        {/* Content */}
        <div className={`${compact ? 'p-4' : 'p-6'} text-center`}>
          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className={`${compact ? 'p-2' : 'p-3'} rounded-full bg-gradient-to-r ${pkg.color} shadow-lg`}>
              <IconComponent className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
            </div>
          </div>
          
          {/* Name */}
          <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-3`}>
            {pkg.name}
          </h3>
          
          {/* Price */}
          <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
            {typeof pkg.price_usd === 'string' ? pkg.price_usd : `$${pkg.price_usd}`}
          </div>
          
          {/* Tokens */}
          <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 mb-6`}>
            {isEnterprise ? 'Custom Tokens' : `${pkg.tokens.toLocaleString()} Tokens`}
          </div>

          {/* CTA Button */}
          <button
            onClick={() => onPurchase(pkg)}
            disabled={isPurchasing || (!user && !isEnterprise)}
            className={`w-full py-2 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              isHovered && !isPurchasing ? 'scale-105' : 'scale-100'
            } bg-gradient-to-r ${pkg.color} hover:${pkg.hoverColor} shadow-lg hover:shadow-xl ${compact ? 'text-xs' : 'text-sm'} disabled:opacity-50 disabled:cursor-not-allowed`}
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
              'Login to Purchase'
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