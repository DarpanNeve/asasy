import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState({
    country: 'Loading...',
    countryCode: 'US',
    currency: 'USD',
    loading: true,
    error: null
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        // Try to get location from IP geolocation API
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        setLocation({
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'US',
          currency: 'USD', // Always USD now
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Location detection failed:', error);
        setLocation({
          country: 'Unknown',
          countryCode: 'US',
          currency: 'USD',
          loading: false,
          error: 'Failed to detect location'
        });
      }
    };

    getLocation();
  }, []);

  return location;
};