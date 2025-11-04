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
  Article
} from '@mui/icons-material'
import { useLanguage } from '../../contexts/LanguageContext'

const KnowledgeCenter = () => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(0)

  const categories = [
    {
      id: 'crop-processing',
      name: 'Crop Processing',
      icon: <LocalFlorist />,
      color: '#2e7d32'
    },
    {
      id: 'packaging',
      name: 'Packaging',
      icon: <Inventory />,
      color: '#ff9800'
    },
    {
      id: 'branding',
      name: 'Branding & Marketing',
      icon: <Business />,
      color: '#9c27b0'
    },
    {
      id: 'digital-skills',
      name: 'Digital Skills',
      icon: <Public />,
      color: '#2196f3'
    },
    {
      id: 'business-skills',
      name: 'Business Skills',
      icon: <AccountBalance />,
      color: '#f44336'
    },
    {
      id: 'exporter-guide',
      name: 'Exporter Guide',
      icon: <Description />,
      color: '#795548'
    }
  ]

  const learningResources = {
    'crop-processing': [
      {
        title: 'Turning Tomatoes into Ketchup',
        type: 'article',
        content: 'Learn step-by-step process of making ketchup from fresh tomatoes. Includes recipes, preservation techniques, and quality standards.',
        topics: ['Recipe', 'Processing', 'Preservation', 'Quality Control']
      },
      {
        title: 'Turmeric to Powder Conversion',
        type: 'video',
        content: 'Video tutorial on cleaning, drying, and grinding turmeric into fine powder. Best practices for maintaining color and potency.',
        topics: ['Cleaning', 'Drying', 'Grinding', 'Storage']
      },
      {
        title: 'Making Jaggery from Sugarcane',
        type: 'article',
        content: 'Complete guide to traditional jaggery making. Includes modern techniques for improved quality and shelf life.',
        topics: ['Juice Extraction', 'Boiling', 'Molding', 'Packaging']
      },
      {
        title: 'Spice Processing Techniques',
        type: 'video',
        content: 'Learn how to process various spices while maintaining flavor and aroma. Includes grinding, blending, and packaging methods.',
        topics: ['Grinding', 'Blending', 'Aroma Preservation']
      }
    ],
    'packaging': [
      {
        title: 'Label Design & Requirements',
        type: 'article',
        content: 'Essential information that must be on food labels. FSSAI guidelines, nutritional information, and best design practices.',
        topics: ['FSSAI Guidelines', 'Label Design', 'Legal Requirements']
      },
      {
        title: 'Hygiene Standards for Food Packaging',
        type: 'article',
        content: 'Food safety standards, hygiene protocols, and best practices for packaging food products. Preventing contamination.',
        topics: ['Hygiene', 'Food Safety', 'Contamination Prevention']
      },
      {
        title: 'Shelf Life & Preservation',
        type: 'video',
        content: 'How to extend product shelf life through proper packaging. Understanding expiration dates and storage requirements.',
        topics: ['Shelf Life', 'Preservation', 'Storage', 'Expiration']
      },
      {
        title: 'Eco-friendly Packaging Options',
        type: 'article',
        content: 'Sustainable packaging materials and methods. Biodegradable options and their impact on product quality.',
        topics: ['Sustainability', 'Biodegradable', 'Eco-friendly']
      }
    ],
    'branding': [
      {
        title: 'Creating Your Brand Logo',
        type: 'article',
        content: 'Step-by-step guide to designing a memorable logo. Simple tools and techniques for farmers without design experience.',
        topics: ['Logo Design', 'Brand Identity', 'Visual Elements']
      },
      {
        title: 'Storytelling for Your Products',
        type: 'video',
        content: 'How to tell compelling stories about your products. Connecting with buyers through authentic narratives.',
        topics: ['Storytelling', 'Marketing', 'Customer Connection']
      },
      {
        title: 'Packaging Design Tips',
        type: 'article',
        content: 'Making your products stand out on shelves. Color psychology, typography, and visual appeal in packaging.',
        topics: ['Design', 'Visual Appeal', 'Color Psychology']
      },
      {
        title: 'Social Media Marketing Basics',
        type: 'video',
        content: 'Using social media to promote your products. Creating posts, engaging with customers, and building online presence.',
        topics: ['Social Media', 'Marketing', 'Online Presence']
      }
    ],
    'digital-skills': [
      {
        title: 'WhatsApp Business Setup',
        type: 'video',
        content: 'Complete guide to setting up WhatsApp Business for your farm. Managing orders, customer communication, and catalog.',
        topics: ['WhatsApp Business', 'Customer Communication', 'Order Management']
      },
      {
        title: 'UPI Payments for Farmers',
        type: 'article',
        content: 'How to accept UPI payments. Setting up payment links, QR codes, and managing transactions securely.',
        topics: ['UPI', 'Digital Payments', 'QR Codes']
      },
      {
        title: 'Online Ordering Systems',
        type: 'video',
        content: 'Using platforms like this one to manage orders. Creating product listings and tracking sales.',
        topics: ['Online Platforms', 'Order Management', 'Product Listings']
      },
      {
        title: 'Digital Marketing Basics',
        type: 'article',
        content: 'Introduction to digital marketing for farmers. Email marketing, social media, and online advertising basics.',
        topics: ['Digital Marketing', 'Email', 'Advertising']
      }
    ],
    'business-skills': [
      {
        title: 'Pricing Your Products',
        type: 'article',
        content: 'How to calculate fair prices for your products. Understanding costs, profit margins, and market pricing.',
        topics: ['Pricing Strategy', 'Cost Calculation', 'Profit Margins']
      },
      {
        title: 'Profit Calculation Methods',
        type: 'video',
        content: 'Simple formulas for calculating profit. Understanding revenue, costs, and net profit for your business.',
        topics: ['Profit', 'Revenue', 'Costs', 'Calculations']
      },
      {
        title: 'Creating a Cost Sheet',
        type: 'article',
        content: 'Step-by-step guide to creating a cost sheet. Tracking raw materials, labor, overhead, and packaging costs.',
        topics: ['Cost Sheet', 'Expense Tracking', 'Financial Planning']
      },
      {
        title: 'Inventory Management',
        type: 'video',
        content: 'Best practices for managing inventory. Tracking stock, preventing waste, and optimizing storage.',
        topics: ['Inventory', 'Stock Management', 'Storage']
      }
    ],
    'exporter-guide': [
      {
        title: 'APEDA Registration Process',
        type: 'article',
        content: 'Complete guide to APEDA (Agricultural and Processed Food Products Export Development Authority) registration. Required documents and procedures.',
        topics: ['APEDA', 'Export Registration', 'Documentation']
      },
      {
        title: 'FSSAI Certification',
        type: 'video',
        content: 'How to obtain FSSAI license for food products. Understanding different license types and application process.',
        topics: ['FSSAI', 'Food License', 'Certification']
      },
      {
        title: 'Organic Certification Guide',
        type: 'article',
        content: 'Process of getting organic certification. NPOP standards, inspection requirements, and maintaining certification.',
        topics: ['Organic', 'NPOP', 'Certification', 'Standards']
      },
      {
        title: 'Export Documentation',
        type: 'article',
        content: 'Essential documents for exporting agricultural products. Shipping documents, certificates, and compliance requirements.',
        topics: ['Export', 'Documentation', 'Compliance']
      }
    ]
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
                    {category.icon}
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
            icon={category.icon}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {categories.map((category, index) => (
        <Box key={category.id} hidden={activeTab !== index}>
          <Grid container spacing={3}>
            {learningResources[category.id]?.map((resource, idx) => (
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

