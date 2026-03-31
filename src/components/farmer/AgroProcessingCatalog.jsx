import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import { Inventory } from '@mui/icons-material';

const AgroProcessingCatalog = () => {
  const [equipmentList, setEquipmentList] = useState([]);

  useEffect(() => {
    // Fetch or initialize the catalog data
    const fetchData = async () => {
      const data = [
        { name: 'Dryer', costRange: '₹500-₹1000', energyRating: 'A+', suitableCrops: 'Grains, Fruits' },
        { name: 'Oil Expeller', costRange: '₹800-₹1500', energyRating: 'A', suitableCrops: 'Oilseeds' },
        { name: 'Flour Mill', costRange: '₹1000-₹2000', energyRating: 'B+', suitableCrops: 'Wheat, Corn' },
      ];
      setEquipmentList(data);
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Agro Processing Equipment Catalog
      </Typography>
      <Grid container spacing={3}>
        {equipmentList.map((equipment, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: '4px solid #4caf50',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  <Inventory />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {equipment.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Cost Range: ₹{equipment.costRange}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Energy Rating: {equipment.energyRating}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Suitable Crops: {equipment.suitableCrops}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AgroProcessingCatalog;