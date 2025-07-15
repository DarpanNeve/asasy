import React, { useState } from 'react';
import { X, CreditCard, Shield, Calculator, DollarSign, IndianRupee } from 'lucide-react';

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  packageData, 
  onConfirmPurchase, 
  loading 
}) => {
  if (!isOpen || !packageData) return null;

  const basePrice = packageData.price_usd;
  const basePriceINR = packageData.price_rupees;
  const gstAmount = packageData.gst_amount;
  const totalWithGST = packageData.price_with_gst;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Package Details */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{packageData.name}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">${basePrice}</div>
                <div className="text-sm text-gray-600">{packageData.tokens.toLocaleString()} Tokens</div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{packageData.description}</p>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Price Breakdown
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Base Price (USD)
                </span>
                <span className="font-medium">${basePrice}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  Base Price (INR)
                </span>
                <span className="font-medium">₹{basePriceINR.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">TAX (18%)</span>
                <span className="font-medium">₹{gstAmount.toLocaleString()}</span>
              </div>
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-blue-600">₹{totalWithGST.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">Secure Payment</p>
                <p className="text-xs text-green-600">
                  Your payment is processed securely through Razorpay
                </p>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="text-xs text-gray-500 mb-6">
            <p className="mb-2">• Tokens are valid for 90 days from purchase</p>
            <p className="mb-2">• GST will be included in your invoice</p>
            <p>• Refunds are subject to our terms and conditions</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirmPurchase(packageData)}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2 inline" />
                  Pay ₹{totalWithGST.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;