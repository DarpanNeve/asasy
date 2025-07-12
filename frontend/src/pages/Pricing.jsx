import React, { useState } from 'react';
import { Zap, Crown, Rocket, FileText, ChevronDown, ChevronUp, Diamond, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import TokenPricingCard from '../components/TokenPricingCard';
import CheckoutModal from '../components/CheckoutModal';

const TokenPricingPackages = ({ compact = false, showReportTypes = true }) => {
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
  React.useEffect(() => {
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

    // Show checkout modal
    setSelectedPackage(packageData);
    setShowCheckout(true);
  };

  const handleConfirmPurchase = async (packageData) => {
    setPurchaseLoading(packageData.id);
    
    try {
      // Create order with GST included
      const orderResponse = await api.post('/tokens/purchase/create-order', {
        package_id: packageData.id
      });

      const { order_id, amount, currency } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Asasy',
        description: `Purchase ${packageData.name} (${packageData.tokens.toLocaleString()} tokens)`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await api.post('/tokens/purchase/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            toast.success(`Successfully purchased ${packageData.tokens.toLocaleString()} tokens!`);
            fetchUserBalance(); // Refresh balance
            setShowCheckout(false);
            setSelectedPackage(null);
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setPurchaseLoading(null);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
        setPurchaseLoading(null);
      });

    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Failed to initiate purchase. Please try again.');
      setPurchaseLoading(null);
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

  return (
    <div className={`${compact ? 'py-8' : 'py-16'} px-4 ${compact ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className="max-w-7xl mx-auto">
        {/* User Token Balance */}
        {user && userBalance && !compact && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-gray-700 mr-2">Available Tokens:</span>
              <span className="font-bold text-blue-600 text-lg">{userBalance.available_tokens.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Token Packages Section */}
        <div className="text-center mb-12">
          <h2 className={`${compact ? 'text-2xl' : 'text-4xl'} font-bold text-gray-900 mb-4`}>
            Token Packages
          </h2>
          <p className={`${compact ? 'text-lg' : 'text-xl'} text-gray-600 max-w-2xl mx-auto`}>
            Choose the perfect package for your needs. Purchase tokens to generate reports.
          </p>
        </div>

        {/* Packages Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${compact ? 'max-w-4xl' : 'max-w-6xl'} mx-auto ${showReportTypes ? 'mb-20' : 'mb-8'}`}>
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
        {showReportTypes && (
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
        <div className="text-center mt-12">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Need help choosing the right package? Our tokens are valid for 90 days from purchase. 
            For enterprise solutions with custom pricing and bulk discounts, please contact our sales team.
          </p>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          setSelectedPackage(null);
          setPurchaseLoading(null);
        }}
        packageData={selectedPackage}
        onConfirmPurchase={handleConfirmPurchase}
        loading={purchaseLoading === selectedPackage?.id}
      />
    </div>
  );
};

export default TokenPricingPackages;