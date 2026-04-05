import React, { useState } from 'react';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Inventory from '@mui/icons-material/Inventory'
import OpenInNew from '@mui/icons-material/OpenInNew'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import Search from '@mui/icons-material/Search'
import Favorite from '@mui/icons-material/Favorite'
import Calculate from '@mui/icons-material/Calculate'
import Bolt from '@mui/icons-material/Bolt'
import AgroProcessingCatalog from './AgroProcessingCatalog';
import EquipmentComparisonTool from './EquipmentComparisonTool';
import EnergyEfficiencyCalculator from './EnergyEfficiencyCalculator';

const EquipmentMarketplace = () => {
  const [search, setSearch] = useState('');

  const equipmentList = [
    {
      id: 1,
      name: 'Tractor Model X-2000',
      description: 'High-power efficient tractor for 50+ acres. State-of-the-art fuel injection.',
      price: '₹15,00,000',
      tags: ['Tractor', 'High-Power'],
      image: 'https://images.unsplash.com/photo-1594142103437-020fd4d5b7a1?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 2,
      name: 'Seed Drill Pro Max',
      description: 'Precision seed drill with digital depth control for uniform planting.',
      price: '₹85,000',
      tags: ['Planting', 'Digital Control'],
      image: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 3,
      name: 'Rice Mill 500S',
      description: 'Compact industrial rice mill for small-scale community processing.',
      price: '₹2,50,000',
      tags: ['Processing', 'Rice'],
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const filteredEquipment = equipmentList.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ mb: 6, p: 4, bgcolor: 'primary.dark', color: 'white', borderRadius: 4 }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1 }}>
          🚜 Equipment Marketplace
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
          Empower your farm with world-class technology and agro-processing tools.
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="700">Explore New Arrivals</Typography>
        <TextField
          size="small"
          placeholder="Search by model or feature..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 350, bgcolor: 'background.paper', borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Grid container spacing={4} sx={{ mb: 8 }}>
        {filteredEquipment.map((equipment) => (
          <Grid item xs={12} sm={6} md={4} key={equipment.id}>
            <Card className="glass" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ height: 200, overflow: 'hidden' }}>
                <img 
                  src={equipment.image} 
                  alt={equipment.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight="700" gutterBottom>
                  {equipment.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph sx={{ minHeight: 40 }}>
                  {equipment.description}
                </Typography>
                <Typography variant="h5" color="primary.main" fontWeight="800">
                  {equipment.price}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {equipment.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', color: 'primary.dark', fontWeight: 600 }} />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => window.open('#', '_blank', 'noopener,noreferrer')}
                >
                  Buy Now
                </Button>
                <IconButton color="primary">
                  <Favorite />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filteredEquipment.length === 0 && (
          <Grid item xs={12}>
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
              <Typography variant="h5" color="textSecondary">
                🔍 No equipment found matching your criteria.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 8 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Typography variant="h5" fontWeight="800" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Inventory color="primary" /> Agro Processing Technology Catalog
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Comprehensive directory of small-to-large-scale processing machinery required for every value-addition stage.
          </Typography>
          <AgroProcessingCatalog />
        </Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ position: 'sticky', top: 100 }}>
            <Paper className="glass" sx={{ p: 4, mb: 4, border: '1px solid rgba(46, 125, 50, 0.2)' }}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate color="primary" /> Cost Comparison
              </Typography>
              <EquipmentComparisonTool />
            </Paper>

            <Paper className="glass" sx={{ p: 4, border: '1px solid rgba(46, 125, 50, 0.2)' }}>
              <Typography variant="h6" fontWeight="700" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bolt color="warning" /> Energy Efficiency
              </Typography>
              <EnergyEfficiencyCalculator />
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 8, p: 4, bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 4, border: '2px dashed #2e7d32' }}>
        <Typography variant="h5" fontWeight="800" color="primary.dark" gutterBottom>
          🚀 Equip your operation at every lifecycle stage
        </Typography>
        <Typography variant="body1">
          From **Seeding** and **Soil Testing** to **Vacuum Packaging** and **Cold Storage Logistics**, find guaranteed machinery to scale your rural enterprise globally.
        </Typography>
      </Paper>
    </Box>
  );
};

export default EquipmentMarketplace;