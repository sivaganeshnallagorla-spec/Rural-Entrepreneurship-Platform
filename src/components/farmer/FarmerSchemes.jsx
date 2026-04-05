import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import AccountBalance from '@mui/icons-material/AccountBalance'
import Verified from '@mui/icons-material/Verified'

const SCHEMES = [
  {
    id: 1,
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Income support to all landholding farmer families.',
    benefits: '₹6,000 per year in three equal installments.',
    eligibility: 'All landholding farmers subject to specific exclusion criteria.',
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 2,
    title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    description: 'Crop insurance scheme mitigating financial losses against unpredictable nature.',
    benefits: 'Comprehensive insurance cover against failure of the crop.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops.',
    link: 'https://pmfby.gov.in/'
  },
  {
    id: 3,
    title: 'Kisan Credit Card (KCC)',
    description: 'Adequate and timely credit support from the banking system.',
    benefits: 'Short term loans for agriculture and allied activities.',
    eligibility: 'Individual/Joint borrowers who are owner cultivators.',
    link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card'
  },
  {
    id: 4,
    title: 'Soil Health Card Scheme',
    description: 'Fosters soil health management and informs farmers about nutrient status.',
    benefits: 'Customized recommendations on appropriate dosage of nutrients for improving crop yields.',
    eligibility: 'All farmers in India.',
    link: 'https://soilhealth.dac.gov.in/'
  }
]

const FarmerSchemes = () => {
  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 1, color: '#2e7d32' }}>
        Government Schemes for Farmers
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Discover and apply for financial assistance, insurance, and support programs.
      </Typography>

      <Grid container spacing={3}>
        {SCHEMES.map((scheme) => (
          <Grid item xs={12} md={6} key={scheme.id}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalance sx={{ color: '#1976d2', mr: 2, fontSize: 32 }} />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {scheme.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {scheme.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Benefits:</Typography>
                  <Typography variant="body2">{scheme.benefits}</Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Eligibility:</Typography>
                  <Typography variant="body2">{scheme.eligibility}</Typography>
                </Box>
                
                <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label="Active Scheme" color="success" size="small" />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    href={scheme.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default FarmerSchemes
