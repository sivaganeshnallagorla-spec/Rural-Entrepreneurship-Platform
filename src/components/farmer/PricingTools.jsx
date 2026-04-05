import React, { useState } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import { usePricing } from '../../contexts/PricingContext';
import TrendingUp from '@mui/icons-material/TrendingUp'
import Calculate from '@mui/icons-material/Calculate'
import Insights from '@mui/icons-material/Insights'
import { fetchAIPricePrediction } from '../../api/anthropic';

const PricingTools = () => {
  const { pricingData, calculateROI, getPriceSuggestion } = usePricing();
  const [roiInputs, setRoiInputs] = useState({ cost: '', quantity: '', expectedPrice: '' });
  const [roiResult, setRoiResult] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);

  const handleRoiCalc = () => {
    const res = calculateROI({
      cost: parseFloat(roiInputs.cost),
      quantity: parseFloat(roiInputs.quantity),
      expectedPrice: parseFloat(roiInputs.expectedPrice)
    });
    setRoiResult(res);
  };

  const handleSuggest = (crop) => {
    setSelectedCrop(crop);
    setSuggestion(getPriceSuggestion(crop));
  };

  const handlePricePrediction = async () => {
    try {
      const response = await fetchAIPricePrediction({
        crop: selectedCrop,
        season: selectedSeason,
        region: selectedRegion,
      });
      setPredictedPrice(response.price);
    } catch (error) {
      console.error('Error fetching AI price prediction:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        AI Pricing & Decision Tools 🤖
      </Typography>

      <Grid container spacing={4}>
        {/* Price Suggestion Tool */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Insights sx={{ mr: 1, color: 'primary.main' }} /> AI Price Predictor
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Based on Agmarknet historical trends and market sentiment.
            </Typography>

            <TextField
              select
              fullWidth
              label="Select Your Crop"
              value={selectedCrop}
              onChange={(e) => handleSuggest(e.target.value)}
              sx={{ mb: 3 }}
            >
              {Object.keys(pricingData).map((crop) => (
                <MenuItem key={crop} value={crop}>{crop}</MenuItem>
              ))}
            </TextField>

            {suggestion && (
              <Box>
                <Alert icon={<TrendingUp />} severity={suggestion.trend === 'up' ? 'success' : 'info'} sx={{ mb: 2 }}>
                  Trend: <strong>{suggestion.trend.toUpperCase()}</strong>
                </Alert>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">Suggested Selling Price</Typography>
                    <Typography variant="h4" color="primary.main">INR {suggestion.suggested} <Typography component="span" variant="caption">/ {pricingData[selectedCrop].unit}</Typography></Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" display="block">Current Market: INR {suggestion.current}</Typography>
                  </CardContent>
                </Card>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handlePricePrediction}
            >
              Get AI Price Prediction
            </Button>

            {predictedPrice && (
              <Typography variant="h6" color="success.main">
                Predicted Price: INR {predictedPrice}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* ROI Calculator */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Calculate sx={{ mr: 1, color: 'secondary.main' }} /> ROI / Profit Calculator
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Calculate feasibility before you start your seasonal cycle.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Total Estimated Cost (INR)"
                type="number"
                fullWidth
                value={roiInputs.cost}
                onChange={(e) => setRoiInputs({ ...roiInputs, cost: e.target.value })}
              />
              <TextField
                label="Expected Yield (Quantity)"
                type="number"
                fullWidth
                value={roiInputs.quantity}
                onChange={(e) => setRoiInputs({ ...roiInputs, quantity: e.target.value })}
              />
              <TextField
                label="Expected Selling Price (INR)"
                type="number"
                fullWidth
                value={roiInputs.expectedPrice}
                onChange={(e) => setRoiInputs({ ...roiInputs, expectedPrice: e.target.value })}
              />
              <Button variant="contained" color="secondary" onClick={handleRoiCalc} disabled={!roiInputs.cost || !roiInputs.quantity}>
                Calculate ROI
              </Button>
            </Box>

            {roiResult && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption">Revenue</Typography>
                    <Typography variant="h6">INR {roiResult.revenue}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Net Profit</Typography>
                    <Typography variant="h6" color={roiResult.profit >= 0 ? 'success.main' : 'error.main'}>
                      INR {roiResult.profit}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption">Return on Investment (ROI)</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{roiResult.roi}%</Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingTools;
