/**
 * Generates a URL for the product origin page that can be encoded in a QR code.
 * @param {string} productId - The ID of the product.
 * @returns {string} The full URL for the origin tracker.
 */
export const generateOriginUrl = (productId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/product-origin/${productId}`;
};

/**
 * Mock function to simulate fetching supply chain data for a QR code scan.
 * @param {string} productId 
 */
export const getOriginData = (productId) => {
  // In a real app, this would fetch from a blockchain or secure DB
  return {
    id: productId,
    farmer: "Rajesh Kumar",
    location: "Pune District, Maharashtra",
    coordinates: "18.5204° N, 73.8567° E",
    harvestDate: "2026-03-20",
    batchNumber: `BAT-${productId.substring(0, 5).toUpperCase()}`,
    certifications: ["Organic Certified", "Fair Trade"],
    logs: [
      { date: "2026-03-20", activity: "Harvested", details: "Manual harvest at peak maturity." },
      { date: "2026-03-22", activity: "Quality Check", details: "Grade A quality confirmed." },
      { date: "2026-03-24", activity: "Packaging", details: "Eco-friendly biodegradable packaging used." },
      { date: "2026-03-26", activity: "Shipped", details: "Dispatched to regional hub." }
    ]
  };
};
