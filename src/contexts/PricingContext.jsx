import React, { createContext, useContext, useState } from 'react';

const PricingContext = createContext();

const initialPricingData = {
  'Wheat': { current: 2200, trend: 'up', history: [2100, 2150, 2180, 2200], unit: 'Quintal' },
  'Rice': { current: 1800, trend: 'stable', history: [1750, 1780, 1800, 1800], unit: 'Quintal' },
  'Cotton': { current: 6500, trend: 'down', history: [7000, 6800, 6600, 6500], unit: 'Quintal' },
  'Sugarcane': { current: 310, trend: 'up', history: [290, 300, 305, 310], unit: 'Ton' }
};

export const PricingProvider = ({ children }) => {
  const [pricingData] = useState(initialPricingData);

  const calculateROI = (inputs) => {
    const { cost, quantity, expectedPrice } = inputs;
    const revenue = quantity * expectedPrice;
    const profit = revenue - cost;
    const roi = (profit / cost) * 100;

    return {
      revenue,
      profit,
      roi: roi.toFixed(1)
    };
  };

  const getPriceSuggestion = (crop) => {
    const data = pricingData[crop];
    if (!data) return null;

    // Logic: Suggest slightly above current if trend is up
    const suggestion = data.trend === 'up' ? data.current * 1.05 : data.current;
    
    return {
      suggested: Math.round(suggestion),
      current: data.current,
      trend: data.trend,
      history: data.history
    };
  };

  return (
    <PricingContext.Provider value={{
      pricingData,
      calculateROI,
      getPriceSuggestion
    }}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};
