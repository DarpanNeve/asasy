// Currency utilities supporting INR and USD

export const isIndiaTimezone = () => new Date().getTimezoneOffset() === -330;

export const formatCurrency = (amount, currency = 'USD') => {
  try {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    if (currency === 'INR') return `₹${amount}`;
    return `$${Number(amount).toFixed(2)}`;
  }
};

export const calculateGST = (amount) => amount * 0.18;

export const calculateTotal = (baseAmount) => baseAmount + calculateGST(baseAmount);

export const getPricingBreakdown = (packageData) => {
  const india = isIndiaTimezone();
  const currency = india ? 'INR' : 'USD';
  const basePrice = india ? packageData.price_inr : packageData.price_usd;
  const gstAmount = calculateGST(basePrice);
  const totalPrice = basePrice + gstAmount;

  return { basePrice, gstAmount, totalPrice, currency };
};
