import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

const ExportSubsidyInfo = () => {
  const subsidies = [
    {
      name: 'APEDA Export Subsidy',
      description: 'Financial assistance for agri-exporters.',
      link: 'https://apeda.gov.in/apedawebsite/'
    },
    {
      name: 'SFAC Support',
      description: 'Schemes for Farmer Producer Organizations.',
      link: 'https://sfacindia.com/'
    },
    {
      name: 'State-Level Agri-Export Schemes',
      description: 'Various state-specific export promotion schemes.',
      link: 'https://agriexport.gov.in/'
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Export Subsidy and Scheme Information
      </Typography>
      <List>
        {subsidies.map((subsidy, index) => (
          <ListItem key={index} alignItems="flex-start" disablePadding>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {subsidy.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {subsidy.description}
              </Typography>
              <Button
                variant="outlined"
                href={subsidy.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ExportSubsidyInfo;