export const demoUsers = [
  { id: 'u1', name: 'Ramesh Farmer', email: 'farmer@test.com', phone: '9876543210', role: 'farmer', password: 'farmer123', farmSize: 15, village: 'Guntur', district: 'Guntur', state: 'Andhra Pradesh', primaryCrops: ['Rice', 'Chilli'] },
  { id: 'u2', name: 'Suresh Buyer', email: 'buyer@test.com', phone: '9876543211', role: 'buyer', password: 'buyer123', companyName: 'Fresh Mart', preferredCategories: ['Vegetables', 'Grains'] },
  { id: 'u3', name: 'Drone Co', email: 'drone_op@test.com', phone: '9876543212', role: 'drone_operator', password: 'drone123', licenseNo: 'DGCA-123', equipment: 'DJI Agras T20', zones: ['Andhra Pradesh', 'Telangana'], pricing: { 'Crop Health Imaging': 300, 'Precision Spraying': 500 } },
  { id: 'u4', name: 'Admin', email: 'admin@test.com', role: 'admin', password: 'admin123' },
];

export const demoProducts = [
  { id: 'p1', name: 'Organic Rice (Sona Masuri)', category: 'Grains', price: 65, unit: 'kg', stock: 1000, farmerId: 'u1', farmerName: 'Ramesh Farmer', status: 'Active', certifications: ['Organic', 'FSSAI'], images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'], description: 'High quality Sona Masuri rice.', location: 'Guntur, Andhra Pradesh', harvestDate: '2023-11-15' },
  { id: 'p2', name: 'Guntur Red Chilli', category: 'Spices', price: 180, unit: 'kg', stock: 500, farmerId: 'u1', farmerName: 'Ramesh Farmer', status: 'Active', certifications: ['FSSAI'], images: ['https://images.unsplash.com/photo-1596647466542-ed8c8d84a7e9?auto=format&fit=crop&q=80&w=400'], description: 'Spicy red chilli from Guntur.', location: 'Guntur, Andhra Pradesh', harvestDate: '2023-10-20' },
];

export const demoOrders = [
  { id: 'o1', buyerId: 'u2', farmerId: 'u1', products: [{id: 'p1', name: 'Organic Rice (Sona Masuri)', qty: 50, price: 65}], total: 3250, status: 'Confirmed', date: new Date().toISOString() }
];

export const demoOperators = [
  { id: 'u3', name: 'Drone Co', rating: 4.8, reviewCount: 24, licenseNo: 'DGCA-123', equipment: 'DJI Agras T20', zones: ['Andhra Pradesh'], services: ['Crop Health Imaging', 'Precision Spraying', 'Land Survey'], pricing: { 'Crop Health Imaging': 300, 'Precision Spraying': 500, 'Land Survey': 800 } }
];

export const demoBookings = [
  { id: 'b1', farmerId: 'u1', operatorId: 'u3', service: 'Crop Health Imaging', date: '2023-12-05', acres: 10, amount: 3000, status: 'Completed', fieldDetails: 'Main field near highway', notes: 'Moderate nitrogen deficiency found in north section.' }
];

export const demoModules = [
  { id: 'm1', title: 'Crop Processing', description: 'Techniques and equipment for processing', icon: 'PrecisionManufacturing' },
  { id: 'm2', title: 'Cold Chain & Storage', description: 'Zero-energy cool chambers, MAP packaging', icon: 'AcUnit' }
];

export const demoResources = [
  { id: 'r1', moduleId: 'm1', title: 'Drying Techniques for Spices', type: 'article', description: 'Learn the optimal sun drying methods.', url: '#' },
];

export const mockAgmarknetPrices = {
  'Rice': 52.50,
  'Tomato': 35.00,
  'Chilli': 150.00,
  'Turmeric': 110.00,
  'Cotton': 70.00,
  'Wheat': 28.00
};
