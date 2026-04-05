import api from '../utils/api';
import { APP_CONFIG } from '../config/app';
import { secureStorage } from '../utils/secureStorage';

/**
 * Product Service handles all product related API calls.
 * Toggles between demo mode (localStorage) and real API calls.
 */
export const productService = {
  getAll: async () => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = secureStorage.get('products') || [];
          resolve({ data: products });
        }, 500);
      });
    }
    
    // Real API Call
    return api.get('/products');
  },

  getById: async (id) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = secureStorage.get('products') || [];
          const product = products.find((p) => p.id === id);
          if (product) resolve({ data: product });
          else throw new Error('Product not found');
        }, 500);
      });
    }
    
    // Real API Call
    return api.get(`/products/${id}`);
  },

  create: async (productData) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = secureStorage.get('products') || [];
          const newProduct = {
            ...productData,
            id: `p${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          products.push(newProduct);
          secureStorage.set('products', products);
          resolve({ data: newProduct });
        }, 500);
      });
    }
    
    // Real API Call
    return api.post('/products', productData);
  },

  update: async (id, updates) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = secureStorage.get('products') || [];
          const index = products.findIndex((p) => p.id === id);
          if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            secureStorage.set('products', products);
            resolve({ data: products[index] });
          } else {
            throw new Error('Product not found');
          }
        }, 500);
      });
    }
    
    // Real API Call
    return api.patch(`/products/${id}`, updates);
  },

  delete: async (id) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = secureStorage.get('products') || [];
          const filtered = products.filter((p) => p.id !== id);
          secureStorage.set('products', filtered);
          resolve({ success: true });
        }, 500);
      });
    }
    
    // Real API Call
    return api.delete(`/products/${id}`);
  },

  getByFarmerId: async (farmerId) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const products = secureStorage.get('products') || [];
          const filtered = products.filter((p) => p.farmerId === farmerId);
          resolve({ data: filtered });
        }, 500);
      });
    }
    
    // Real API Call
    return api.get(`/products/farmer/${farmerId}`);
  }
};
