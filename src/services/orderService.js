import api from '../utils/api';
import { APP_CONFIG } from '../config/app';
import { secureStorage } from '../utils/secureStorage';

/**
 * Order Service handles all order related API calls.
 * Toggles between demo mode (localStorage) and real API calls.
 */
export const orderService = {
  create: async (orderData) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const orders = secureStorage.get('orders') || [];
          const newOrder = {
            id: `order-${Date.now()}`,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          orders.push(newOrder);
          secureStorage.set('orders', orders);
          resolve({ data: newOrder });
        }, 500);
      });
    }
    
    // Real API Call
    return api.post('/orders', orderData);
  },

  getAll: async () => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const orders = secureStorage.get('orders') || [];
          resolve({ data: orders });
        }, 500);
      });
    }
    
    // Real API Call
    return api.get('/orders');
  },

  getById: async (id) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const orders = secureStorage.get('orders') || [];
          const order = orders.find((o) => o.id === id);
          if (order) resolve({ data: order });
          else throw new Error('Order not found');
        }, 500);
      });
    }
    
    // Real API Call
    return api.get(`/orders/${id}`);
  },

  updateStatus: async (id, status) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const orders = secureStorage.get('orders') || [];
          const index = orders.findIndex((o) => o.id === id);
          if (index !== -1) {
            orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
            secureStorage.set('orders', orders);
            resolve({ data: orders[index] });
          } else {
            throw new Error('Order not found');
          }
        }, 500);
      });
    }
    
    // Real API Call
    return api.patch(`/orders/${id}/status`, { status });
  },

  getByUserId: async (userId, role) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const orders = secureStorage.get('orders') || [];
          const filtered = orders.filter((o) => (role === 'farmer' ? o.farmerId === userId : o.buyerId === userId));
          resolve({ data: filtered });
        }, 500);
      });
    }
    
    // Real API Call
    const endpoint = role === 'farmer' ? `/orders/farmer/${userId}` : `/orders/buyer/${userId}`;
    return api.get(endpoint);
  }
};
