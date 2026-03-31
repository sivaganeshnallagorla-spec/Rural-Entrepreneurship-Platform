import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { Timeline, TrendingUp, Info } from '@mui/icons-material';

const DemandForecasting = () => {
  const [product, setProduct] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = () => {
    setLoading(true);
    // Simulate API call for demo purposes
    setTimeout(() => {
      const demoForecast = {
        demand: Math.floor(Math.random() * 5000) + 1000,
        trend: 'Upward (Strong Market Interest)',
        confidence: '94%',
        suggestedNextBatch: 'October 15th'
      };
      setForecast(demoForecast);
      setLoading(false);
    }, 1500);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Timeline color="primary" /> Demand Forecasting
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Predict future market trends for your products using our AI-driven historical analysis.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Select or Type Product"
              placeholder="e.g. Organic Turmeric"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={fetchForecast}
              disabled={loading || !product}
              startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
            >
              {loading ? 'Analyzing...' : 'Generate Forecast'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {forecast ? (
            <Card sx={{ height: '100%', bgcolor: 'rgba(33, 150, 243, 0.02)', border: '1px solid var(--glass-border)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Forecast Results for "{product}"</Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon><TrendingUp color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Market Trend" 
                      secondary={forecast.trend} 
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Predicted Demand (next 30 days)" 
                      secondary={`${forecast.demand.toLocaleString()} units`}
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="AI Confidence Level" 
                      secondary={forecast.confidence}
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info color="primary" /></ListItemIcon>
                    <ListItemText 
                      primary="Peak Demand Season Starting" 
                      secondary={forecast.suggestedNextBatch}
                      primaryTypographyProps={{ fontWeight: 700 }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          ) : (
            <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#f5f5f5', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary">
                Select a product to view AI-powered demand forecasts.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DemandForecasting;