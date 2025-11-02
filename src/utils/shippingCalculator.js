/**
 * Calculate shipping cost based on distance, weight, and shipping method
 */

// Distance between cities (simplified - in real app, use actual distance API)
const CITY_DISTANCES = {
  'Delhi-Punjab': 500,
  'Delhi-Maharashtra': 1500,
  'Delhi-Bangalore': 2000,
  'Punjab-Maharashtra': 1700,
  'Punjab-Bangalore': 2200,
  'Maharashtra-Bangalore': 800
}

// Base shipping rates (₹ per km)
const SHIPPING_RATES = {
  standard: 0.1,    // ₹0.1 per km
  express: 0.2,     // ₹0.2 per km
  priority: 0.3     // ₹2.0 per km
}

// Weight-based multiplier
const WEIGHT_MULTIPLIER = {
  light: 0.2,      // < 5kg
  medium: 0.4,     // 5-20kg
  heavy: 0.6       // > 20kg
}

/**
 * Calculate shipping cost
 * @param {string} fromLocation - Origin location (e.g., "Punjab, India")
 * @param {string} toLocation - Destination location (e.g., "New Delhi, India")
 * @param {number} weight - Weight in kg
 * @param {string} method - Shipping method: 'standard', 'express', 'priority'
 * @returns {object} - Shipping details with cost and estimated delivery
 */
export const calculateShipping = (fromLocation, toLocation, weight, method = 'standard') => {
  // Extract state/city from location strings
  const fromState = extractState(fromLocation)
  const toState = extractState(toLocation)

  // Calculate distance (simplified - in real app use geolocation API)
  let distance = 500 // Default distance
  
  const distanceKey = `${fromState}-${toState}`
  if (CITY_DISTANCES[distanceKey]) {
    distance = CITY_DISTANCES[distanceKey]
  } else {
    // Calculate rough distance based on states
    distance = estimateDistance(fromState, toState)
  }

  // Determine weight category
  let weightCategory = 'light'
  if (weight >= 20) {
    weightCategory = 'heavy'
  } else if (weight >= 5) {
    weightCategory = 'medium'
  }

  // Calculate base cost
  const baseRate = SHIPPING_RATES[method] || SHIPPING_RATES.standard
  const weightMultiplier = WEIGHT_MULTIPLIER[weightCategory]
  const baseCost = distance * baseRate * weightMultiplier

  // Add minimum charge
  const minimumCharge = 50
  const finalCost = Math.max(baseCost, minimumCharge)

  // Calculate estimated delivery days
  const deliveryDays = getDeliveryDays(distance, method)

  return {
    cost: Math.round(finalCost),
    distance: Math.round(distance),
    method,
    estimatedDays: deliveryDays,
    weightCategory
  }
}

/**
 * Extract state from location string
 */
const extractState = (location) => {
  if (!location) return 'Unknown'
  const parts = location.split(',')
  return parts.length > 1 ? parts[parts.length - 2].trim() : parts[0].trim()
}

/**
 * Estimate distance between states (simplified)
 */
const estimateDistance = (fromState, toState) => {
  // Default distances based on Indian state positions
  if (fromState === toState) return 100
  
  // Rough estimates - in production use actual geolocation
  return 1000 // Default 1000km for inter-state
}

/**
 * Get estimated delivery days based on distance and method
 */
const getDeliveryDays = (distance, method) => {
  if (method === 'priority') {
    return Math.max(1, Math.ceil(distance / 1000))
  } else if (method === 'express') {
    return Math.max(2, Math.ceil(distance / 600))
  } else {
    return Math.max(3, Math.ceil(distance / 400))
  }
}

/**
 * Get available shipping methods
 */
export const getShippingMethods = () => [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '7-10 business days',
    icon: '🚚'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '4-6 business days',
    icon: '⚡'
  },
  {
    id: 'priority',
    name: 'Priority Shipping',
    description: '2-3 business days',
    icon: '🏃'
  }
]

