import React, { createContext, useContext, useState } from 'react';
import { mockAgmarknetPrices } from '../api/demoData';

const PricingContext = createContext();

const basePricingData = {
  'Wheat': { current: 2200, trend: 'up', history: [2100, 2150, 2180, 2200], unit: 'Quintal' },
  'Rice': { current: 1800, trend: 'stable', history: [1750, 1780, 1800, 1800], unit: 'Quintal' },
  'Cotton': { current: 6500, trend: 'down', history: [7000, 6800, 6600, 6500], unit: 'Quintal' },
  'Sugarcane': { current: 310, trend: 'up', history: [290, 300, 305, 310], unit: 'Ton' }
};

// Merge Agmarknet prices from demoData for richer crop coverage
const initialPricingData = { ...basePricingData };
Object.entries(mockAgmarknetPrices).forEach(([crop, agmarknetPrice]) => {
  if (initialPricingData[crop]) {
    // Update existing with Agmarknet price as latest
    initialPricingData[crop] = {
      ...initialPricingData[crop],
      agmarknetPrice
    };
  } else {
    // Add new crop from Agmarknet
    initialPricingData[crop] = {
      current: agmarknetPrice * 100, // convert per-kg to per-quintal
      agmarknetPrice,
      trend: 'stable',
      history: [agmarknetPrice * 95, agmarknetPrice * 98, agmarknetPrice * 99, agmarknetPrice * 100],
      unit: 'Quintal'
    };
  }
});

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
