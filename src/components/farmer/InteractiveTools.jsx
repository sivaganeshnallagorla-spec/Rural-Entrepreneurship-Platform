import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia
} from '@mui/material'
import {
  Calculate,
  AttachMoney,
  TrendingUp,
  Analytics,
  School
} from '@mui/icons-material'
import PricingCalculator from './PricingCalculator'
import ProfitEstimator from './ProfitEstimator'

const InteractiveTools = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tools = [
    {
      id: 'pricing',
      name: 'Pricing Calculator',
      description: 'Calculate the selling price for your processed products from raw crop prices',
      icon: <Calculate />,
      color: '#2e7d32',
      component: <PricingCalculator />
    },
    {
      id: 'profit',
      name: 'Profit Estimator',
      description: 'Calculate profit margins from material and labor costs',
      icon: <AttachMoney />,
      color: '#ff9800',
      component: <ProfitEstimator />
    }
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <Analytics sx={{ mr: 2, verticalAlign: 'middle', fontSize: '2rem' }} />
          Interactive Tools
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Use these powerful calculators to make informed business decisions. Calculate prices, estimate profits, and optimize your operations.
        </Typography>
      </Box>

      {/* Tool Cards Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {tools.map((tool, index) => (
          <Grid item xs={12} sm={6} key={tool.id}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                borderTop: `4px solid ${tool.color}`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
              onClick={() => setActiveTab(index)}
            >
              <CardContent>
                <Box sx={{ color: tool.color, mb: 2, fontSize: '3rem' }}>
                  {tool.icon}
                </Box>
                <Typography variant="h5" gutterBottom>
                  {tool.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {tool.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for Tools */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 72,
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          {tools.map((tool) => (
            <Tab
              key={tool.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: tool.color }}>{tool.icon}</Box>
                  {tool.name}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tool Content */}
      <Box sx={{ mt: 3 }}>
        {tools.map((tool, index) => (
          <Box key={tool.id} hidden={activeTab !== index}>
            {tool.component}
          </Box>
        ))}
      </Box>

      {/* Quick Tips */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom>
          <School sx={{ mr: 1, verticalAlign: 'middle' }} />
          Tips for Using These Tools
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              💡 Pricing Calculator Tips:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Enter accurate processing yield percentages for realistic calculations</li>
              <li>Include all overhead costs (utilities, rent, etc.) for accurate pricing</li>
              <li>Consider market competition when setting profit margins</li>
              <li>Review and adjust calculations based on seasonal variations</li>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              💡 Profit Estimator Tips:
            </Typography>
            <Typography variant="body2" component="ul" sx={{ pl: 2 }}>
              <li>Track all costs including hidden expenses (storage, transportation)</li>
              <li>Calculate break-even quantity before starting production</li>
              <li>Monitor profit margins regularly to ensure sustainability</li>
              <li>Use the tool to compare different pricing strategies</li>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default InteractiveTools

