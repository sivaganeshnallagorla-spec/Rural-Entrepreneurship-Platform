import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment
} from '@mui/material';
import { Inventory, Calculate } from '@mui/icons-material';

const PackagingCostCalculator = () => {
  const [inputs, setInputs] = useState({
    productType: '',
    weight: '',
    quantity: '',
  });
  const [costEstimates, setCostEstimates] = useState(null);

  const packagingOptions = [
    { type: 'Jute Bags', costPerKg: 5, exportSuitability: 'Low', color: 'error' },
    { type: 'Vacuum Sealed', costPerKg: 10, exportSuitability: 'Medium', color: 'warning' },
    { type: 'Modified Atmosphere', costPerKg: 15, exportSuitability: 'High', color: 'success' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const calculateCosts = () => {
    const weight = Number(inputs.weight);
    const quantity = Number(inputs.quantity);
    
    if (weight <= 0 || quantity <= 0) {
      alert('Please enter valid weight and quantity');
      return;
    }

    const estimates = packagingOptions.map((option) => ({
      type: option.type,
      totalCost: weight * quantity * option.costPerKg,
      exportSuitability: option.exportSuitability,
      color: option.color
    }));
    setCostEstimates(estimates);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Inventory color="primary" /> Packaging Cost Calculator
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Compare different packaging methods and their costs based on your production volume.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="productType"
                  label="Product Type"
                  placeholder="e.g. Rice, Mango Pulp"
                  value={inputs.productType}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="weight"
                  label="Weight per Unit (kg)"
                  type="number"
                  value={inputs.weight}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Quantity"
                  type="number"
                  value={inputs.quantity}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={calculateCosts}
                  startIcon={<Calculate />}
                >
                  Estimate Costs
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {costEstimates ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Packaging Type</strong></TableCell>
                    <TableCell align="right"><strong>Cost per Kg</strong></TableCell>
                    <TableCell align="right"><strong>Total Cost (INR)</strong></TableCell>
                    <TableCell align="center"><strong>Export Suitability</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {costEstimates.map((estimate, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{estimate.type}</TableCell>
                      <TableCell align="right">₹{packagingOptions[index].costPerKg}</TableCell>
                      <TableCell align="right">₹{estimate.totalCost.toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={estimate.exportSuitability} 
                          color={estimate.color} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#f5f5f5', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                Enter your production details to see cost estimates
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PackagingCostCalculator;