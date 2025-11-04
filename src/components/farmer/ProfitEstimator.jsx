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
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import {
  Calculate,
  TrendingUp,
  AttachMoney
} from '@mui/icons-material'

const ProfitEstimator = () => {
  const [inputs, setInputs] = useState({
    materialCost: '',
    laborCost: '',
    packagingCost: '',
    overheadCost: '',
    marketingCost: '',
    sellingPrice: '',
    quantity: '',
    unit: 'kg'
  })

  const [results, setResults] = useState(null)

  const handleChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }))
    setResults(null)
  }

  const calculateProfit = () => {
    const materialCost = parseFloat(inputs.materialCost) || 0
    const laborCost = parseFloat(inputs.laborCost) || 0
    const packagingCost = parseFloat(inputs.packagingCost) || 0
    const overheadCost = parseFloat(inputs.overheadCost) || 0
    const marketingCost = parseFloat(inputs.marketingCost) || 0
    const sellingPrice = parseFloat(inputs.sellingPrice) || 0
    const quantity = parseFloat(inputs.quantity) || 0

    if (sellingPrice <= 0 || quantity <= 0) {
      alert('Please enter valid selling price and quantity')
      return
    }

    // Calculate total costs
    const totalMaterialCost = materialCost * quantity
    const totalLaborCost = laborCost
    const totalPackagingCost = packagingCost * quantity
    const totalOverheadCost = overheadCost
    const totalMarketingCost = marketingCost

    const totalCost = totalMaterialCost + totalLaborCost + totalPackagingCost + totalOverheadCost + totalMarketingCost

    // Calculate revenue
    const totalRevenue = sellingPrice * quantity

    // Calculate profit
    const totalProfit = totalRevenue - totalCost

    // Calculate profit margin percentage
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    // Calculate cost per unit
    const costPerUnit = quantity > 0 ? totalCost / quantity : 0

    // Calculate profit per unit
    const profitPerUnit = sellingPrice - costPerUnit

    // Calculate break-even quantity
    const breakEvenQuantity = costPerUnit > 0 ? totalCost / sellingPrice : 0

    setResults({
      totalMaterialCost,
      totalLaborCost,
      totalPackagingCost,
      totalOverheadCost,
      totalMarketingCost,
      totalCost,
      totalRevenue,
      totalProfit,
      profitMargin,
      costPerUnit,
      profitPerUnit,
      breakEvenQuantity,
      quantity
    })
  }

  const resetCalculator = () => {
    setInputs({
      materialCost: '',
      laborCost: '',
      packagingCost: '',
      overheadCost: '',
      marketingCost: '',
      sellingPrice: '',
      quantity: '',
      unit: 'kg'
    })
    setResults(null)
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
        Profit Estimator
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Calculate profit margins from material and labor costs
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Cost Inputs
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Material Cost (₹/unit)"
                  type="number"
                  value={inputs.materialCost}
                  onChange={(e) => handleChange('materialCost', e.target.value)}
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
                  label="Marketing Cost (₹)"
                  type="number"
                  value={inputs.marketingCost}
                  onChange={(e) => handleChange('marketingCost', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Divider sx={{ my: 2, width: '100%' }} />

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Sales Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Selling Price (₹/unit)"
                  type="number"
                  value={inputs.sellingPrice}
                  onChange={(e) => handleChange('sellingPrice', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={inputs.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Unit"
                  value={inputs.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  placeholder="kg, piece, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={calculateProfit}
                    startIcon={<Calculate />}
                  >
                    Calculate Profit
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
                Profit Analysis
              </Typography>

              <Card sx={{ mt: 2, mb: 2, bgcolor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Cost Breakdown
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell>Material Cost</TableCell>
                          <TableCell align="right">₹{results.totalMaterialCost.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Labor Cost</TableCell>
                          <TableCell align="right">₹{results.totalLaborCost.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Packaging Cost</TableCell>
                          <TableCell align="right">₹{results.totalPackagingCost.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Overhead Cost</TableCell>
                          <TableCell align="right">₹{results.totalOverheadCost.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Marketing Cost</TableCell>
                          <TableCell align="right">₹{results.totalMarketingCost.toFixed(2)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><strong>Total Cost</strong></TableCell>
                          <TableCell align="right">
                            <strong>₹{results.totalCost.toFixed(2)}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2, bgcolor: '#e8f5e9' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Revenue & Profit
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
                    <Typography variant="body1">Total Revenue:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₹{results.totalRevenue.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1">Total Cost:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₹{results.totalCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6">
                      Total Profit:
                    </Typography>
                    <Typography
                      variant="h6"
                      color={results.totalProfit >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="bold"
                    >
                      <TrendingUp sx={{ verticalAlign: 'middle', fontSize: '1.2rem' }} />
                      {' '}₹{results.totalProfit.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">Profit Margin:</Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color={results.profitMargin >= 0 ? 'success.main' : 'error.main'}
                    >
                      {results.profitMargin.toFixed(2)}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ bgcolor: '#fff3e0' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Per Unit Analysis
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1} mt={2}>
                    <Typography variant="body2">Selling Price per Unit:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{inputs.sellingPrice}/{inputs.unit}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Cost per Unit:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      ₹{results.costPerUnit.toFixed(2)}/{inputs.unit}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body1">Profit per Unit:</Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color={results.profitPerUnit >= 0 ? 'success.main' : 'error.main'}
                    >
                      ₹{results.profitPerUnit.toFixed(2)}/{inputs.unit}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">Break-even Quantity:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {results.breakEvenQuantity.toFixed(2)} {inputs.unit}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f5f5f5' }}>
              <Typography variant="body1" color="textSecondary">
                Enter values and click "Calculate Profit" to see results
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProfitEstimator

