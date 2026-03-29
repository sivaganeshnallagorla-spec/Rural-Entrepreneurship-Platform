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
  stage4: {
    title: 'Crop Monitoring',
    desc: 'Monitor crop health, detect pests early, and track growth stages.',
    actions: ['Book Drone Survey', 'View Soil Health Report', 'Log Observation'],
    resources: ['Pest Identification Guide', 'Growth Stage Calendar', 'Drone Imagery Samples']
  },
  stage5: {
    title: 'Harvesting',
    desc: 'Plan optimal harvest timing and choose the right harvesting methods.',
    actions: ['Check Market Price', 'Schedule Labour', 'Log Harvest Data'],
    resources: ['Harvest Readiness Checklist', 'Post-Harvest Loss Reduction Tips']
  },
  stage6: {
    title: 'Post-Harvest Handling',
    desc: 'Reduce losses with proper grading, cleaning, and sorting techniques.',
    actions: ['Download Grading Standards', 'Find Processing Unit'],
    resources: ['FSSAI Food Safety Guidelines', 'Grading & Sorting Video']
  },
  stage7: {
    title: 'Storage',
    desc: 'Use zero-energy cool chambers and proper storage to extend shelf life.',
    actions: ['Find Nearby Cold Storage', 'Calculate Storage Cost'],
    resources: ['Zero-Energy Cool Chamber Guide', 'Warehouse Receipt Scheme Info']
  },
  stage8: {
    title: 'Processing & Value Addition',
    desc: 'Transform raw crops into value-added products to multiply income.',
    actions: ['Explore Processing Recipes', 'Find Equipment Suppliers'],
    resources: ['Value Addition Handbook', 'FSSAI License Process', 'Packaging Guidelines']
  },
  stage9: {
    title: 'Packaging & Branding',
    desc: 'Design attractive packaging and build a brand that buyers trust.',
    actions: ['Generate QR Label', 'Browse Packaging Suppliers'],
    resources: ['Branding for Rural Entrepreneurs', 'Label Design Templates', 'Eco-Packaging Options']
  },
  stage10: {
    title: 'Market Linkage',
    desc: 'Connect directly with buyers, exporters, and government procurement.',
    actions: ['List Product on Platform', 'Browse Buyer Directory', 'Register for e-NAM'],
    resources: ['e-NAM Registration Guide', 'Export Documentation Checklist']
  },
  stage11: {
    title: 'Market Finance & Insurance',
    desc: 'Access crop insurance, Kisan Credit Card, and micro-financing options.',
    actions: ['Apply for KCC', 'Check PM-FASAL Bima', 'Find MFI Partner'],
    resources: ['PMFBY Scheme Details', 'KCC Application Process', 'SHG Loan Options']
  }
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
