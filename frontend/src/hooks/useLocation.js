import { useState, useEffect } from 'react';
import { detectUserLocation } from '../utils/currencyUtils';

export const useLocation = () => {
  const [location, setLocation] = useState({
    country: 'Loading...',
    countryCode: 'US',
    currency: 'USD',
    isIndia: false,
    loading: true,
    error: null
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        const locationData = await detectUserLocation();
        setLocation({
          ...locationData,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Location detection failed:', error);
        setLocation({
          country: 'Unknown',
          countryCode: 'US',
          currency: 'USD',
          isIndia: false,
          loading: false,
          error: 'Failed to detect location'
        });
      }
    };

    getLocation();
  }, []);

  return location;
};