import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import WifiOff from '@mui/icons-material/WifiOff'
import Info from '@mui/icons-material/Info'
import { APP_CONFIG } from '../../config/app'

const SystemBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !APP_CONFIG.isDemo) return null;

  return (
    <Box sx={{ width: '100%', position: 'sticky', top: 0, zIndex: 2000 }}>
      {isOffline && (
        <Box
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            py: 0.75,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          <WifiOff fontSize="small" />
          <Typography variant="body2" fontWeight="600">
            You are currently offline. Some features may be limited.
          </Typography>
        </Box>
      )}
      
      {APP_CONFIG.isDemo && !isOffline && (
        <Box
          sx={{
            bgcolor: 'warning.main',
            color: 'white',
            py: 0.5,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            opacity: 0.95
          }}
        >
          <Info fontSize="small" />
          <Typography variant="caption" fontWeight="500" sx={{ letterSpacing: 0.5 }}>
            DEMO MODE: Data is stored locally and will be cleared on refresh.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SystemBanner;
