import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Breadcrumbs, 
  Link,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  ArrowBack, 
  CheckCircle, 
  Info, 
  Launch 
} from '@mui/icons-material';

const stageContent = {
  stage1: {
    title: 'Pre-farming Advice',
    desc: 'Get expert advice on crop selection and seasonal planning.',
    actions: ['Consult AI Advisor', 'View Seasonal Calendar'],
    resources: ['Crop Suitability Report', 'Weather Forecast API']
  },
  stage2: {
    title: 'Seed Selection',
    desc: 'Verify seed quality and find certified dealers.',
    actions: ['Verify Seed Tag', 'Browse Seed Marketplace'],
    resources: ['Certified Seed Guidelines', 'Dealer Directory']
  },
  stage3: {
    title: 'Soil Preparation',
    desc: 'Optimize your soil health for maximum yield.',
    actions: ['Book Soil Test', 'Order Fertilizers'],
    resources: ['Soil Health Cards', 'Preparation Tips']
  },
  // ... can be expanded for all 11
};

const StageService = () => {
  const { stage } = useParams();
  const navigate = useNavigate();
  const content = stageContent[stage] || {
    title: `Stage: ${stage}`,
    desc: 'Feature coming soon to support your agricultural journey.',
    actions: ['Enquire Now'],
    resources: ['General Guidelines']
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link 
          component="button" 
          variant="body2" 
          onClick={() => navigate('/farmer/services')}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ArrowBack sx={{ mr: 0.5, fontSize: 'inherit' }} /> Services Hub
        </Link>
        <Typography color="text.primary" variant="body2">
          {content.title}
        </Typography>
      </Breadcrumbs>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4" gutterBottom color="primary.main" sx={{ fontWeight: 'bold' }}>
          {content.title}
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          {content.desc}
        </Typography>
        
        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {content.actions.map((action, i) => (
            <Button key={i} variant="contained" color="primary">
              {action}
            </Button>
          ))}
          <Button variant="outlined" startIcon={<Info />}>
            Learn More
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
          Recommended Resources
        </Typography>
        <List>
          {content.resources.map((res, i) => (
            <ListItem key={i} disablePadding sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={res} />
              <Button size="small" endIcon={<Launch />}>Open</Button>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default StageService;
