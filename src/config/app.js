export const APP_CONFIG = {
  appName: 'KisanMart',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  isDemo: import.meta.env.VITE_APP_DEMO_MODE === 'true' || !import.meta.env.VITE_API_BASE_URL,
  isProduction: import.meta.env.PROD,
};
