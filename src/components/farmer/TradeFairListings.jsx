import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

const TradeFairListings = () => {
  const tradeFairs = [
    {
      name: 'Anuga Food Fair',
      date: 'October 5-9, 2026',
      location: 'Cologne, Germany',
      link: 'https://www.anuga.com/'
    },
    {
      name: 'SIAL Paris',
      date: 'October 19-23, 2026',
      location: 'Paris, France',
      link: 'https://www.sialparis.com/'
    },
    {
      name: 'Agri Asia',
      date: 'September 1-3, 2026',
      location: 'Gandhinagar, India',
      link: 'https://www.agriasia.in/'
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Global Trade Fair Listings
      </Typography>
      <List>
        {tradeFairs.map((fair, index) => (
          <ListItem key={index} alignItems="flex-start" disablePadding>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {fair.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Date: {fair.date}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Location: {fair.location}
              </Typography>
              <Button
                variant="outlined"
                href={fair.link}
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

export default TradeFairListings;