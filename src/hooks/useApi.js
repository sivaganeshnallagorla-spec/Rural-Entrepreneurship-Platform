import { useState, useCallback } from 'react';
import api from '../api/axios';
import { useToast } from '../contexts/ToastContext';

export function useApi(fallbackFn = null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast?.() || { showError: console.error };

  const request = useCallback(
    async (config, fallbackData = null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api(config);
        setLoading(false);
        return response.data;
      } catch (err) {
        setLoading(false);
        const errMsg = err.response?.data?.message || err.message || 'API Error';
        setError(errMsg);
        console.warn(`API call failed: ${config.url}, falling back to local data if available. Error:`, errMsg);
        
        if (fallbackFn || fallbackData !== null) {
          // Attempting to resolve via local data as specified
          return fallbackFn ? fallbackFn() : fallbackData;
        } else {
          toast.showError?.(errMsg + " (No fallback available)");
          throw err;
        }
      }
    },
    [toast, fallbackFn]
  );

  return { request, loading, error };
}
