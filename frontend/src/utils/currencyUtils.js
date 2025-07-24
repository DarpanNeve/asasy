// Currency utilities for INR pricing (as requested by Razorpay)

export const USD_TO_INR_RATE = 83; // Current approximate exchange rate

export const formatCurrency = (amount, currency = 'INR') => {
  try {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
  } catch (error) {
    // Fallback formatting
    if (currency === 'INR') {
      return `₹${Math.round(amount).toLocaleString('en-IN')}`;
    }
    return `$${amount.toFixed(2)}`;
  }
};

export const convertUsdToInr = (usdAmount) => {
  return Math.round(usdAmount * USD_TO_INR_RATE);
};

export const calculateGST = (amount) => {
  return Math.round(amount * 0.18); // 18% GST for all transactions
};

export const calculateTotal = (baseAmount) => {
  const gst = calculateGST(baseAmount);
  return baseAmount + gst;
};

export const getPricingBreakdown = (basePriceUsd) => {
  // Convert USD to INR
  const basePriceInr = convertUsdToInr(basePriceUsd);
  const gstAmount = calculateGST(basePriceInr);
  const totalPrice = basePriceInr + gstAmount;
  
  return {
    basePrice: basePriceInr,
    basePriceUsd: basePriceUsd,
    gstAmount,
    totalPrice,
    currency: 'INR'
  };
};

export const formatPriceWithOriginal = (usdPrice, originalUsdPrice = null) => {
  const inrPrice = convertUsdToInr(usdPrice);
  const pricing = getPricingBreakdown(usdPrice);
  
  let result = {
    displayPrice: formatCurrency(inrPrice, 'INR'),
    totalWithGst: formatCurrency(pricing.totalPrice, 'INR'),
    basePrice: inrPrice,
    totalPrice: pricing.totalPrice,
    gstAmount: pricing.gstAmount,
    currency: 'INR'
  };

  if (originalUsdPrice && originalUsdPrice > usdPrice) {
    const originalInrPrice = convertUsdToInr(originalUsdPrice);
    const originalPricing = getPricingBreakdown(originalUsdPrice);
    
    result.originalPrice = originalInrPrice;
    result.originalTotal = originalPricing.totalPrice;
    result.originalDisplayPrice = formatCurrency(originalInrPrice, 'INR');
    result.originalTotalDisplay = formatCurrency(originalPricing.totalPrice, 'INR');
    result.savings = originalInrPrice - inrPrice;
    result.savingsDisplay = formatCurrency(result.savings, 'INR');
    result.hasDiscount = true;
  }

  return result;
};