import api from '../utils/api';
import { APP_CONFIG } from '../config/app';
import { secureStorage } from '../utils/secureStorage';

/**
 * Authentication Service
 * Toggles between demo mode (localStorage) and real API calls.
 */
export const authService = {
  login: async (username, password) => {
    if (APP_CONFIG.isDemo) {
      // Simulate real async behavior
      return new Promise((resolve) => {
        setTimeout(() => {
          // Predefined users for demo mode
          const PREDEFINED_USERS = [
            { id: 'admin1', username: 'admin', password: 'admin123', role: 'admin', name: 'Platform Admin' },
            { id: 'farmer1', username: 'farmer', password: 'farmer123', role: 'farmer', name: 'Rajesh Kumar' },
            { id: 'buyer1', username: 'buyer', password: 'buyer123', role: 'buyer', name: 'Global Food Co.' },
            { id: 'op1', username: 'drone', password: 'drone123', role: 'drone_operator', name: 'SkyFarmer Operator' }
          ];
          
          let foundUser = PREDEFINED_USERS.find(
            u => u.username === username && u.password === password
          );

          if (!foundUser) {
            const registeredUsers = secureStorage.get('registeredUsers') || [];
            foundUser = registeredUsers.find(u => u.username === username);
          }

          if (foundUser) {
            const userData = { ...foundUser, token: 'demo-token-' + Date.now() };
            delete userData.password;
            resolve({ data: { user: userData, token: userData.token } });
          } else {
            const error = new Error('Invalid credentials');
            error.response = { status: 401 };
            throw error;
          }
        }, 1000);
      });
    }
    
    // Real API Call
    return api.post('/auth/login', { username, password });
  },

  register: async (userData) => {
    if (APP_CONFIG.isDemo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const registeredUsers = secureStorage.get('registeredUsers') || [];
          const newUser = {
            ...userData,
            id: `user-${Date.now()}`,
            createdAt: new Date().toISOString()
          };
          delete newUser.password;
          registeredUsers.push(newUser);
          secureStorage.set('registeredUsers', registeredUsers);
          resolve({ data: { user: newUser, token: 'demo-token-' + Date.now() } });
        }, 1000);
      });
    }
    
    // Real API Call
    return api.post('/auth/register', userData);
  },

  logout: async () => {
    if (APP_CONFIG.isDemo) {
      secureStorage.remove('auth_session');
      return Promise.resolve();
    }
    
    // Real API Call
    return api.post('/auth/logout');
  }
};
