import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Shield, 
  Calculator, 
  DollarSign,
  Zap,
  CheckCircle,
  ArrowLeft,
  Lock,
  Globe,
  Clock
} from 'lucide-react';
import { formatCurrency, getPricingBreakdown } from '../utils/currencyUtils';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = ({ 
  isOpen, 
  packageData, 
  onClose, 
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('review'); // 'review' or 'processing'

  if (!isOpen || !packageData) return null;

  // Get pricing breakdown with GST
  const pricing = getPricingBreakdown(packageData.price_usd);
  const { basePrice, gstAmount, totalPrice } = pricing;

  const handleConfirmPurchase = async () => {
    setLoading(true);
    setStep('processing');
    
    try {
      // Create order
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
            onSuccess();
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
            setStep('review');
            setLoading(false);
          }
        },
        prefill: {
          name: 'User', // You can get this from user context
          email: 'user@example.com', // You can get this from user context
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setStep('review');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error('Payment failed. Please try again.');
        setStep('review');
        setLoading(false);
      });

    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Failed to initiate purchase. Please try again.');
      setStep('review');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {step === 'processing' && (
                <button
                  onClick={() => setStep('review')}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'review' ? 'Review Your Order' : 'Processing Payment'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'review' ? (
            <>
              {/* Package Details */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{packageData.name}</h3>
                      <p className="text-gray-600">{packageData.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(basePrice)}
                    </div>
                    <div className="text-sm text-gray-600">{packageData.tokens.toLocaleString()} Tokens</div>
                  </div>
                </div>
                
                {/* Package Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>{packageData.tokens.toLocaleString()} AI Tokens</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <span>90 Days Validity</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <Globe className="h-4 w-4 text-purple-500 mr-2" />
                    <span>Global Access</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Price Breakdown
                </h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Base Price (USD)
                    </span>
                    <span className="font-medium text-lg">
                      {formatCurrency(basePrice)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">
                      {formatCurrency(gstAmount)}
                    </span>
                  </div>
                  
                  <hr className="border-gray-300 my-3" />
                  
                  <div className="flex justify-between items-center py-3 bg-white rounded-lg px-4">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security & Terms */}
              <div className="space-y-4 mb-6">
                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Secure Payment</p>
                      <p className="text-xs text-green-600">
                        Your payment is processed securely through Razorpay with 256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Payment Terms
                  </h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Tokens are valid for 90 days from purchase date</li>
                    <li>• GST invoice will be provided (18% TAX included)</li>
                    <li>• All transactions processed in USD</li>
                    <li>• Refunds are subject to our terms and conditions</li>
                    <li>• Tokens are non-transferable between accounts</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  disabled={loading}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2 inline" />
                      Pay {formatCurrency(totalPrice)}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Processing Step */
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Payment</h3>
              <p className="text-gray-600 mb-6">
                Please complete the payment in the Razorpay window. Do not close this page.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> If the payment window doesn't open, please check if pop-ups are blocked in your browser and try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;