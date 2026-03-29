/**
 * Estimates shipping cost based on weight and distance.
 * @param {number} weightKg - The weight in kilograms.
 * @param {number} distanceKm - The distance in kilometers.
 * @returns {number} The estimated shipping cost in INR.
 */
export const estimateShipping = (weightKg, distanceKm) => {
  const baseRate = 50; // INR baseline
  const ratePerKg = 10;
  const ratePerKm = 0.5;

  const cost = baseRate + (weightKg * ratePerKg) + (distanceKm * ratePerKm);
  return Math.round(cost);
};

/**
 * Returns estimated delivery days based on distance.
 * @param {number} distanceKm 
 */
export const estimateDeliveryDays = (distanceKm) => {
  if (distanceKm < 100) return 1;
  if (distanceKm < 500) return 3;
  return 5;
};

/**
 * Rough distance for demo pricing when we only have location strings (no geocoding).
 */
const approximateDistanceKm = (origin, destination) => {
  const o = String(origin || '').toLowerCase().trim();
  const d = String(destination || '').toLowerCase().trim();
  if (!o || !d) return 300;
  if (o === d) return 25;
  let sum = 0;
  const len = Math.min(o.length, d.length);
  for (let i = 0; i < len; i++) {
    sum += Math.abs(o.charCodeAt(i) - d.charCodeAt(i));
  }
  return 120 + (sum % 1400);
};

/**
 * Shipping method options for product checkout UI.
 */
export const getShippingMethods = () => [
  { id: 'standard', name: 'Standard', description: 'Reliable delivery', icon: '📦' },
  { id: 'express', name: 'Express', description: 'Faster delivery', icon: '⚡' },
  { id: 'economy', name: 'Economy', description: 'Lowest cost', icon: '🐢' },
];

/**
 * @param {string} originLocation - Farmer / product origin label
 * @param {string} destination - Buyer city or address label
 * @param {number} weightKg
 * @param {string} methodId - 'standard' | 'express' | 'economy'
 */
export const calculateShipping = (originLocation, destination, weightKg, methodId) => {
  const distanceKm = approximateDistanceKm(originLocation, destination);
  let base = estimateShipping(weightKg, distanceKm);
  let multiplier = 1;
  let dayAdjust = 0;
  if (methodId === 'express') {
    multiplier = 1.4;
    dayAdjust = -1;
  } else if (methodId === 'economy') {
    multiplier = 0.88;
    dayAdjust = 2;
  }
  const estimatedDays = Math.max(1, estimateDeliveryDays(distanceKm) + dayAdjust);
  return {
    cost: Math.round(base * multiplier),
    estimatedDays,
    distanceKm,
  };
};
