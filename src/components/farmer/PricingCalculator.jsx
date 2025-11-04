import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  InputAdornment
} from '@mui/material'
import {
  Calculate,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material'

const PricingCalculator = () => {
  const [inputs, setInputs] = useState({
    rawCropPrice: '',
    rawCropQuantity: '',
    rawCropUnit: 'kg',
    processingYield: '', // Percentage of raw material that becomes final product
    processingCost: '', // Cost per unit of processing
    laborCost: '',
    packagingCost: '',
    overheadCost: '', // Other costs (utilities, etc.)
    profitMargin: '' // Desired profit margin percentage
  })

  const [results, setResults] = useState(null)

  const handleChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
    setResults(null)
  }

  const calculatePrice = () => {
    const rawCropPrice = parseFloat(inputs.rawCropPrice) || 0
    const rawCropQuantity = parseFloat(inputs.rawCropQuantity) || 0
    const processingYield = parseFloat(inputs.processingYield) || 100
    const processingCost = parseFloat(inputs.processingCost) || 0
    const laborCost = parseFloat(inputs.laborCost) || 0
    const packagingCost = parseFloat(inputs.packagingCost) || 0
    const overheadCost = parseFloat(inputs.overheadCost) || 0
    const profitMargin = parseFloat(inputs.profitMargin) || 0

    if (rawCropPrice <= 0 || rawCropQuantity <= 0) {
      alert('Please enter valid raw crop price and quantity')
      return
    }

    // Calculate total cost of raw material
    const totalRawCost = rawCropPrice * rawCropQuantity

    // Calculate output quantity (after processing)
    const outputQuantity = (rawCropQuantity * processingYield) / 100

    // Calculate total processing costs
    const totalProcessingCost = processingCost * outputQuantity
    const totalLaborCost = laborCost
    const totalPackagingCost = packagingCost * outputQuantity
    const totalOverheadCost = overheadCost

    // Total cost
    const totalCost = totalRawCost + totalProcessingCost + totalLaborCost + totalPackagingCost + totalOverheadCost

    // Cost per unit of output
    const costPerUnit = outputQuantity > 0 ? totalCost / outputQuantity : 0

    // Calculate price with profit margin
    const priceWithProfit = costPerUnit * (1 + profitMargin / 100)

    // Calculate profit per unit
    const profitPerUnit = priceWithProfit - costPerUnit

    // Calculate total profit
    const totalProfit = profitPerUnit * outputQuantity

    setResults({
      totalRawCost,
      outputQuantity,
      totalProcessingCost,
      totalLaborCost,
      totalPackagingCost,
      totalOverheadCost,
      totalCost,
      costPerUnit,
      priceWithProfit,
      profitPerUnit,
      totalProfit
    })
  }

  const resetCalculator = () => {
    setInputs({
      rawCropPrice: '',
      rawCropQuantity: '',
      rawCropUnit: 'kg',
      processingYield: '',
      processingCost: '',
      laborCost: '',
      packagingCost: '',
      overheadCost: '',
      profitMargin: ''
    })
    setResults(null)
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <Calculate sx={{ mr: 1, verticalAlign: 'middle' }} />
        Pricing Calculator
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Calculate the selling price for your processed products from raw crop prices
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Input Details
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Raw Crop Price (₹/unit)"
                  type="number"
                  value={inputs.rawCropPrice}
                  onChange={(e) => handleChange('rawCropPrice', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Raw Crop Quantity"
                  type="number"
                  value={inputs.rawCropQuantity}
                  onChange={(e) => handleChange('rawCropQuantity', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  value={inputs.rawCropUnit}
                  onChange={(e) => handleChange('rawCropUnit', e.target.value)}
                  placeholder="kg, liter, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Processing Yield (%)"
                  type="number"
                  value={inputs.processingYield}
                  onChange={(e) => handleChange('processingYield', e.target.value)}
                  helperText="Percentage of raw material that becomes final product (e.g., 70% means 70kg output from 100kg input)"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Processing Cost (₹/output unit)"
                  type="number"
                  value={inputs.processingCost}
                  onChange={(e) => handleChange('processingCost', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Labor Cost (₹)"
                  type="number"
                  value={inputs.laborCost}
                  onChange={(e) => handleChange('laborCost', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Packaging Cost (₹/unit)"
                  type="number"
                  value={inputs.packagingCost}
                  onChange={(e) => handleChange('packagingCost', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Overhead Cost (₹)"
                  type="number"
                  value={inputs.overheadCost}
                  onChange={(e) => handleChange('overheadCost', e.target.value)}
                  helperText="Utilities, rent, etc."
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Desired Profit Margin (%)"
                  type="number"
                  value={inputs.profitMargin}
                  onChange={(e) => handleChange('profitMargin', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={calculatePrice}
                    startIcon={<Calculate />}
                  >
                    Calculate Price
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={resetCalculator}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {results ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Calculation Results
              </Typography>

              <Card sx={{ mt: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Cost Breakdown
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Raw Material Cost:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{results.totalRawCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Processing Cost:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{results.totalProcessingCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Labor Cost:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{results.totalLaborCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Packaging Cost:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{results.totalPackagingCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Overhead Cost:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{results.totalOverheadCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1" fontWeight="bold">
                      Total Cost:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      ₹{results.totalCost.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2, bgcolor: '#e8f5e9' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Output & Pricing
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Output Quantity:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {results.outputQuantity.toFixed(2)} {inputs.rawCropUnit}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Cost per Unit:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{results.costPerUnit.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">
                      Recommended Selling Price:
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{results.priceWithProfit.toFixed(2)}/{inputs.rawCropUnit}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: '#fff3e0' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Profit Analysis
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Profit per Unit:</Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      <TrendingUp sx={{ verticalAlign: 'middle', fontSize: '1rem' }} />
                      {' '}₹{results.profitPerUnit.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6">
                      Total Profit:
                    </Typography>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      ₹{results.totalProfit.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <Typography variant="body1" color="textSecondary">
                Enter values and click "Calculate Price" to see results
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default PricingCalculator

