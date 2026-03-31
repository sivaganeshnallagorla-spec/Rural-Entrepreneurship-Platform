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

/**
 * Calculates cold chain logistics cost based on perishability and temperature requirements.
 * @param {number} weightKg - The weight in kilograms.
 * @param {number} distanceKm - The distance in kilometers.
 * @param {string} perishability - 'fresh', 'dairy', 'frozen'.
 * @returns {number} The estimated cold chain logistics cost in INR.
 */
export const calculateColdChainCost = (weightKg, distanceKm, perishability) => {
  const baseRate = 100; // Higher baseline for cold chain
  const ratePerKg = perishability === 'frozen' ? 20 : perishability === 'dairy' ? 15 : 10;
  const ratePerKm = perishability === 'frozen' ? 1 : perishability === 'dairy' ? 0.8 : 0.5;

  const cost = baseRate + (weightKg * ratePerKg) + (distanceKm * ratePerKm);
  return Math.round(cost);
};

/**
 * Recommends packaging and temperature requirements based on perishability.
 * @param {string} perishability - 'fresh', 'dairy', 'frozen'.
 * @returns {object} Recommended packaging and temperature.
 */
export const recommendColdChainRequirements = (perishability) => {
  const recommendations = {
    fresh: { packaging: 'Ventilated crates', temperature: '10-15°C' },
    dairy: { packaging: 'Insulated boxes', temperature: '2-4°C' },
    frozen: { packaging: 'Dry ice packs', temperature: '-18°C' },
  };
  return recommendations[perishability] || {};
};
