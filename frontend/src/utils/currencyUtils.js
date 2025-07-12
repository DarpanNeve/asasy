// Currency and location utilities

export const detectUserLocation = async () => {
  try {
    // Try to get location from IP geolocation API
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      country: data.country_name,
      countryCode: data.country_code,
      currency: data.currency,
      isIndia: data.country_code === 'IN'
    };
  } catch (error) {
    console.error('Failed to detect location:', error);
    // Fallback: try to detect from browser timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isIndia = timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta');
    
    return {
      country: isIndia ? 'India' : 'Unknown',
      countryCode: isIndia ? 'IN' : 'US',
      currency: isIndia ? 'INR' : 'USD',
      isIndia
    };
  }
};

export const formatCurrency = (amount, currency, countryCode) => {
  try {
    return new Intl.NumberFormat(countryCode === 'IN' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    if (currency === 'INR') {
      return `₹${amount.toLocaleString()}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  }
};

export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRate = 83) => {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * exchangeRate;
  } else if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }
  
  return amount;
};

export const getPaymentCurrency = (isIndia) => {
  return isIndia ? 'INR' : 'USD';
};

export const calculateGST = (amount, isIndia) => {
  if (!isIndia) return 0;
  return amount * 0.18; // 18% GST for India
};

export const calculateTotal = (baseAmount, isIndia) => {
  const gst = calculateGST(baseAmount, isIndia);
  return baseAmount + gst;
};