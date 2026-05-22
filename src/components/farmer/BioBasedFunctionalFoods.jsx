import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const BioBasedFunctionalFoods = () => {
  const categories = [
    {
      name: 'Natural Dyes',
      description: 'Derived from plants and minerals, used in textiles and food.',
      marketDemand: 'High',
      regulatoryNotes: 'Ensure compliance with food safety standards.',
    },
    {
      name: 'Herbal Extracts',
      description: 'Used in cosmetics, medicines, and supplements.',
      marketDemand: 'Medium',
      regulatoryNotes: 'Check for export restrictions.',
    },
    {
      name: 'Cold-Pressed Oils',
      description: 'High-quality oils for culinary and cosmetic use.',
      marketDemand: 'High',
      regulatoryNotes: 'Label nutritional content accurately.',
    },
    {
      name: 'Nutraceuticals',
      description: 'Food products with health benefits.',
      marketDemand: 'Growing',
      regulatoryNotes: 'Adhere to health claims regulations.',
    },
    {
      name: 'Fortified Foods',
      description: 'Foods enriched with vitamins and minerals.',
      marketDemand: 'High',
      regulatoryNotes: 'Follow fortification guidelines.',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Bio-based & Functional Foods
      </Typography>
      <List>
        {categories.map((category, index) => (
          <ListItem key={index} alignItems="flex-start" disablePadding>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {category.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {category.description}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Market Demand: {category.marketDemand}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Regulatory Notes: {category.regulatoryNotes}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BioBasedFunctionalFoods;