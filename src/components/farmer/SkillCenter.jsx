import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  TextField
} from '@mui/material'
import {
  ExpandMore,
  School,
  LocalFlorist,
  Inventory,
  AccountBalance,
  Business,
  Public,
  Description,
  VideoLibrary,
  Article,
  Calculate,
  AttachMoney,
  OpenInNew,
  Link as LinkIcon
} from '@mui/icons-material'
import { useLanguage } from '../../contexts/LanguageContext'
import { useKnowledge } from '../../contexts/KnowledgeContext'
import { useNavigate } from 'react-router-dom'
import AgroProcessingCatalog from './AgroProcessingCatalog'
import EquipmentComparisonTool from './EquipmentComparisonTool'
import EnergyEfficiencyCalculator from './EnergyEfficiencyCalculator'
import QRTraceabilitySystem from './QRTraceabilitySystem'
import QualityGradingModule from './QualityGradingModule'
import CertificationManagement from './CertificationManagement'
import LabTestUploads from './LabTestUploads'
import MandiPriceFeed from './MandiPriceFeed'
import PackagingCostCalculator from './PackagingCostCalculator'
import StorageConditionMonitor from './StorageConditionMonitor'
import PostHarvestLossTracker from './PostHarvestLossTracker'
import ValueAdditionWorkflow from './ValueAdditionWorkflow'
import BioBasedFunctionalFoods from './BioBasedFunctionalFoods';
import SupplyChainDashboard from './SupplyChainDashboard';
import ExportDocuments from './ExportDocuments';
import ComplianceTracker from './ComplianceTracker';
import DemandForecasting from './DemandForecasting';
import FPOManagement from './FPOManagement';
import ExportSubsidyInfo from './ExportSubsidyInfo';
import TradeFairListings from './TradeFairListings';
import { demoModules } from '../../api/demoData';

// Icon mapping
const iconMap = {
  LocalFlorist: LocalFlorist,
  Inventory: Inventory,
  Business: Business,
  Public: Public,
  AccountBalance: AccountBalance,
  Description: Description,
  School: School
}

const SkillCenter = () => {

  const { t } = useLanguage()
  const navigate = useNavigate()
  const { categories, getResourcesByCategory } = useKnowledge()
  const [activeTab, setActiveTab] = useState(0)
  const [search, setSearch] = useState('')

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || Description
    return <IconComponent />
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const getResourceIcon = (type) => {
    return type === 'video' ? <VideoLibrary /> : <Article />
  }

  // Filter resources by search
  const filteredResources = (categoryId) => {
    const resources = getResourcesByCategory(categoryId)
    if (!search.trim()) return resources
    return resources.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.content && r.content.toLowerCase().includes(search.toLowerCase())) ||
      (r.topics && r.topics.some(topic => topic.toLowerCase().includes(search.toLowerCase())))
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <School sx={{ mr: 2, verticalAlign: 'middle', fontSize: '2rem' }} />
          Skill Center
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Learn skills to grow your business. Access free resources on farming techniques, value-addition, branding, and more.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          🧠 Core Modules
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  height: '100%',
                  borderTop: `4px solid ${category.color}`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ color: category.color, mb: 1 }}>
                    {getIconComponent(category.iconName)}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {category.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        📚 Learning Resources
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flex: 1, borderBottom: 1, borderColor: 'divider' }}
        >
          {categories.map((category) => (
            <Tab
              key={category.id}
              label={category.name}
              icon={getIconComponent(category.iconName)}
              iconPosition="start"
            />
          ))}
        </Tabs>
        <TextField
          size="small"
          placeholder="Search resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
        />
      </Box>

      <Box>
        <Grid container spacing={3}>
          {filteredResources(categories[activeTab]?.id).map((resource, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderLeft: `4px solid ${categories[activeTab]?.color}` }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{ color: categories[activeTab]?.color, mr: 1 }}>
                      {getResourceIcon(resource.type)}
                    </Box>
                    <Chip
                      label={resource.type === 'video' ? 'Video' : 'Article'}
                      size="small"
                      color={resource.type === 'video' ? 'primary' : 'default'}
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {resource.title}
                  </Typography>
                  {resource.content && (
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {resource.content}
                    </Typography>
                  )}
                  {resource.url && (
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinkIcon fontSize="small" color="primary" />
                      <Typography 
                        variant="caption" 
                        color="primary" 
                        sx={{ 
                          wordBreak: 'break-all',
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                      >
                        {resource.url.length > 50 ? `${resource.url.substring(0, 50)}...` : resource.url}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {resource.topics?.map((topic, topicIdx) => (
                      <Chip
                        key={topicIdx}
                        label={topic}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  {resource.url ? (
                    <Button 
                      size="small" 
                      color="primary"
                      endIcon={<OpenInNew />}
                      onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                    >
                      {resource.type === 'video' ? 'Watch Video' : 'Read Article'}
                    </Button>
                  ) : (
                    <Button size="small" color="primary" disabled>
                      {resource.type === 'video' ? 'Watch Video' : 'Read Article'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
          {filteredResources(categories[activeTab]?.id).length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  No resources found for this category.
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Paper sx={{ p: 3, mb: 4, bgcolor: '#e8f5e9', border: '2px solid #4caf50' }}>
        <Typography variant="h5" gutterBottom>
          📊 Interactive Tools
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Access powerful calculators to help you make informed business decisions. Calculate prices, estimate profits, and optimize your operations.
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Calculate />}
            onClick={() => navigate('/farmer/tools')}
            sx={{ mr: 2 }}
          >
            Open Interactive Tools
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/farmer/tools')}
          >
            View All Tools
          </Button>
        </Box>
      </Paper>

      {/* Render modules dynamically based on active tab */}
      {activeTab === 0 && (
        <>
          {/* Moved to Equipment Marketplace */}
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fffde7' }}>
            <Typography variant="h6" gutterBottom>
              🛠️ Tool Relocation
            </Typography>
            <Typography variant="body2" color="textSecondary">
              The Technology Catalog and Equipment tools have been moved to the <strong>Equipment Marketplace</strong> for a better buying experience.
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }} 
              onClick={() => navigate('/farmer/equipment-marketplace')}
            >
              Go to Equipment Marketplace
            </Button>
          </Paper>
        </>
      )}

      {activeTab === 1 && (
        <>
          <h2>QR/Batch Traceability System</h2>
          <QRTraceabilitySystem />

          <h2>Quality Grading Module</h2>
          <QualityGradingModule />

          <h2>Certification Management</h2>
          <CertificationManagement />
        </>
      )}

      {activeTab === 2 && (
        <>
          <h2>Lab Test Result Uploads</h2>
          <LabTestUploads />

          <h2>Mandi/Wholesale Price Feed</h2>
          <MandiPriceFeed />

          <h2>Packaging Cost Calculator</h2>
          <PackagingCostCalculator />
        </>
      )}

      {activeTab === 3 && (
        <>
          <h2>Storage Condition Monitor</h2>
          <StorageConditionMonitor />

          <h2>Post-Harvest Loss Tracker</h2>
          <PostHarvestLossTracker />

          <h2>Value Addition Workflow</h2>
          <ValueAdditionWorkflow />
        </>
      )}

      {activeTab === 4 && (
        <>
          <h2>Bio-based & Functional Foods</h2>
          <BioBasedFunctionalFoods />

          <h2>Supply Chain Transparency Dashboard</h2>
          <SupplyChainDashboard />

          <div className="knowledge-center-section">
            <ExportDocuments />
          </div>
        </>
      )}

      {activeTab === 5 && (
        <>
          <div className="knowledge-center-section">
            <ComplianceTracker />
          </div>

          <div className="knowledge-center-section">
            <DemandForecasting />
          </div>

          <div className="knowledge-center-section">
            <FPOManagement />
          </div>

          <div className="knowledge-center-section">
            <ExportSubsidyInfo />
          </div>

          <div className="knowledge-center-section">
            <TradeFairListings />
          </div>
        </>
      )}
    </Box>
  )
}

export default SkillCenter

