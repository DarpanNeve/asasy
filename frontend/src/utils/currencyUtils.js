// Currency utilities for USD-only pricing

export const formatCurrency = (amount, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `$${amount.toFixed(2)}`;
  }
};

export const calculateGST = (amount) => {
  return amount * 0.18; // 18% GST for all transactions
};

export const calculateTotal = (baseAmount) => {
  const gst = calculateGST(baseAmount);
  return baseAmount + gst;
};

export const getPricingBreakdown = (basePrice) => {
  const gstAmount = calculateGST(basePrice);
  const totalPrice = basePrice + gstAmount;
  
  return {
    basePrice,
    gstAmount,
    totalPrice,
    currency: 'USD'
  };
};