import React from 'react';
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CardActionArea from '@mui/material/CardActionArea'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import { useNavigate } from 'react-router-dom';
import Grass from '@mui/icons-material/Grass'
import WaterDrop from '@mui/icons-material/WaterDrop'
import BugReport from '@mui/icons-material/BugReport'
import Science from '@mui/icons-material/Science'
import Agriculture from '@mui/icons-material/Agriculture'
import MonitorHeart from '@mui/icons-material/MonitorHeart'
import AccountBalance from '@mui/icons-material/AccountBalance'
import Storefront from '@mui/icons-material/Storefront'
import LocalShipping from '@mui/icons-material/LocalShipping'
import CurrencyExchange from '@mui/icons-material/CurrencyExchange'

const stages = [
  { id: 1, title: 'Pre-farming Advice', icon: <Science />, color: '#4caf50', path: 'stage1' },
  { id: 2, title: 'Seed Selection', icon: <Grass />, color: '#8bc34a', path: 'stage2' },
  { id: 3, title: 'Soil Preparation', icon: <Agriculture />, color: '#795548', path: 'stage3' },
  { id: 4, title: 'Irrigation Mgmt', icon: <WaterDrop />, color: '#2196f3', path: 'stage4' },
  { id: 5, title: 'Pest Control', icon: <BugReport />, color: '#f44336', path: 'stage5' },
  { id: 6, title: 'Crop Health Mon.', icon: <MonitorHeart />, color: '#9c27b0', path: 'stage6' },
  { id: 7, title: 'Nutrient Mgmt', icon: <Science />, color: '#009688', path: 'stage7' },
  { id: 8, title: 'Harvesting Help', icon: <Agriculture />, color: '#ff9800', path: 'stage8' },
  { id: 9, title: 'Market Linkage', icon: <Storefront />, color: '#ffc107', path: 'stage9' },
  { id: 10, title: 'Logistics/Storage', icon: <LocalShipping />, color: '#607d8b', path: 'stage10' },
  { id: 11, title: 'Mkt Finance/Insurance', icon: <CurrencyExchange />, color: '#e91e63', path: 'stage11' },
  { id: 'DaaS', title: 'Drone Booking', icon: <Science />, color: '#03a9f4', absolutePath: '/farmer/drone-booking' }
];

const ServicesHub = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Agricultural Lifecycle Services
      </Typography>
      <Grid container spacing={3}>
        {stages.map((stage) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={stage.id}>
            <Card 
              elevation={2} 
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
              }}
            >
              <CardActionArea 
                onClick={() => navigate(stage.absolutePath || `/farmer/services/${stage.path}`)}
                sx={{ height: '100%', p: 1 }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: stage.color, 
                      width: 56, 
                      height: 56, 
                      mx: 'auto', 
                      mb: 2,
                      boxShadow: 3
                    }}
                  >
                    {stage.icon}
                  </Avatar>
                  <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    {stage.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ServicesHub;
