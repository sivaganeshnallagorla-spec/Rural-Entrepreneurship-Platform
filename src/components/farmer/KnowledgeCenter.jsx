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
  Divider
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
  AttachMoney
} from '@mui/icons-material'
import { useLanguage } from '../../contexts/LanguageContext'
import { useKnowledge } from '../../contexts/KnowledgeContext'
import { useNavigate } from 'react-router-dom'

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

const KnowledgeCenter = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { categories, getResourcesByCategory } = useKnowledge()
  const [activeTab, setActiveTab] = useState(0)

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

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <School sx={{ mr: 2, verticalAlign: 'middle', fontSize: '2rem' }} />
          Knowledge Center
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

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
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

      {categories.map((category, index) => (
        <Box key={category.id} hidden={activeTab !== index}>
          <Grid container spacing={3}>
            {getResourcesByCategory(category.id)?.map((resource, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box sx={{ color: category.color, mr: 1 }}>
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
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {resource.content}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {resource.topics.map((topic, topicIdx) => (
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
                    <Button size="small" color="primary">
                      {resource.type === 'video' ? 'Watch Video' : 'Read Article'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

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

      <Paper sx={{ p: 3, mt: 4, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" gutterBottom>
          💡 Government Schemes
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Description color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="PM Kisan Scheme"
              secondary="Direct income support for farmers. ₹6,000 per year in three installments."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Description color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="National Agriculture Market (e-NAM)"
              secondary="Integrated online trading platform for agricultural commodities."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Description color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Pradhan Mantri Kisan Sampada Yojana"
              secondary="Scheme for creation of modern infrastructure for food processing."
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Description color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Organic Farming Scheme"
              secondary="Financial assistance for organic farming and certification."
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}

export default KnowledgeCenter

