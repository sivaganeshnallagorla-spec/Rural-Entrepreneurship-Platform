import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Calculate from '@mui/icons-material/Calculate'
import AttachMoney from '@mui/icons-material/AttachMoney'
import TrendingUp from '@mui/icons-material/TrendingUp'
import Analytics from '@mui/icons-material/Analytics'
import School from '@mui/icons-material/School'
import Inventory from '@mui/icons-material/Inventory'
import Bolt from '@mui/icons-material/Bolt'
import AssignmentLate from '@mui/icons-material/AssignmentLate'
import Timeline from '@mui/icons-material/Timeline'
import PricingCalculator from './PricingCalculator'
import ProfitEstimator from './ProfitEstimator'
import PackagingCostCalculator from './PackagingCostCalculator'
import EnergyEfficiencyCalculator from './EnergyEfficiencyCalculator'
import PostHarvestLossTracker from './PostHarvestLossTracker'
import DemandForecasting from './DemandForecasting'

const InteractiveTools = () => {
  const [activeTab, setActiveTab] = useState(0)

  const tools = [
    {
      id: 'pricing',
      name: 'Pricing Calculator',
      description: 'Calculate product selling price from raw costs.',
      icon: <Calculate />,
      color: '#2e7d32',
      component: <PricingCalculator />
    },
    {
      id: 'profit',
      name: 'Profit Estimator',
      description: 'Calculate profit margins and break-even points.',
      icon: <AttachMoney />,
      color: '#ff9800',
      component: <ProfitEstimator />
    },
    {
      id: 'packaging',
      name: 'Packaging Cost',
      description: 'Compare packaging costs and export suitability.',
      icon: <Inventory />,
      color: '#2196f3',
      component: <PackagingCostCalculator />
    },
    {
      id: 'energy',
      name: 'Energy Efficiency',
      description: 'Estimate machinery energy costs per batch.',
      icon: <Bolt />,
      color: '#ffc107',
      component: <EnergyEfficiencyCalculator />
    },
    {
      id: 'loss',
      name: 'Loss Tracker',
      description: 'Reduce wastage across production stages.',
      icon: <AssignmentLate />,
      color: '#f44336',
      component: <PostHarvestLossTracker />
    },
    {
      id: 'demand',
      name: 'Demand Forecast',
      description: 'Predict market trends using AI analysis.',
      icon: <Timeline />,
      color: '#9c27b0',
      component: <DemandForecasting />
    }
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ mb: 6, p: 4, bgcolor: 'primary.dark', color: 'white', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight="800" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Analytics sx={{ fontSize: '3rem' }} /> Interactive Business Tools
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 800 }}>
            Empower your rural enterprise with data-driven decision making. Optimize pricing, reduce losses, and predict demand with our precision calculators.
          </Typography>
        </Box>
        <Analytics sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: '15rem', opacity: 0.1, color: 'white' }} />
      </Box>

      {/* Tool Grid Overview */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {tools.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={tool.id}>
            <Card
              className="glass"
              sx={{
                height: '100%',
                cursor: 'pointer',
                borderTop: `4px solid ${tool.color}`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 'var(--shadow-lg)',
                  borderColor: tool.color
                },
                bgcolor: activeTab === index ? 'rgba(46, 125, 50, 0.05)' : 'background.paper'
              }}
              onClick={() => setActiveTab(index)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ color: tool.color, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ fontSize: '2.5rem' }}>{tool.icon}</Box>
                  {activeTab === index && (
                    <Chip label="ACTIVE" size="small" sx={{ bgcolor: tool.color, color: 'white', fontWeight: 800 }} />
                  )}
                </Box>
                <Typography variant="h6" fontWeight="700" gutterBottom>
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

      {/* Tabs for Desktop / Precise Navigation */}
      <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 3,
              fontSize: '0.9rem',
              fontWeight: 600,
              minWidth: 160
            }
          }}
        >
          {tools.map((tool) => (
            <Tab
              key={tool.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: tool.color, display: 'flex' }}>{tool.icon}</Box>
                  {tool.name}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Tool Content Area */}
      <Box sx={{ mt: 2 }}>
        {tools.map((tool, index) => (
          <Box 
            key={tool.id} 
            hidden={activeTab !== index}
            sx={{ 
              animation: activeTab === index ? 'fadeIn 0.5s ease-out' : 'none'
            }}
          >
            {activeTab === index && (
              <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid var(--glass-border)' }}>
                {tool.component}
              </Paper>
            )}
          </Box>
        ))}
      </Box>

      {/* Quick Tips Footer */}
      <Paper sx={{ p: 4, mt: 8, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 4, border: '1px solid rgba(33, 150, 243, 0.2)' }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
          <School color="primary" /> Expert Business Tips
        </Typography>
        <Grid container spacing={4} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="700" color="primary" gutterBottom>
                💡 Strategic Pricing
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Don't just cover costs. Analyze **Demand Forecasts** and **Packaging Suitability** to position your product in premium segments. High-quality packaging often allows for a 20-30% higher profit margin in export markets.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
              <Typography variant="subtitle1" fontWeight="700" color="error" gutterBottom>
                📉 Minimizing Wastage
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Use the **Loss Tracker** weekly. Even a 5% reduction in storage loss can double your net profit over a season. Combine this with the **Energy efficiency calculator** to find the most cost-effective cold storage parameters.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default InteractiveTools

