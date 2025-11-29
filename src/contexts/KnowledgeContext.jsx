import React, { createContext, useState, useEffect, useContext } from 'react'

const KnowledgeContext = createContext()

// Default categories with icons (we'll store icon names as strings)
const DEFAULT_CATEGORIES = [
  {
    id: 'crop-processing',
    name: 'Crop Processing',
    iconName: 'LocalFlorist',
    color: '#2e7d32'
  },
  {
    id: 'packaging',
    name: 'Packaging',
    iconName: 'Inventory',
    color: '#ff9800'
  },
  {
    id: 'branding',
    name: 'Branding & Marketing',
    iconName: 'Business',
    color: '#9c27b0'
  },
  {
    id: 'digital-skills',
    name: 'Digital Skills',
    iconName: 'Public',
    color: '#2196f3'
  },
  {
    id: 'business-skills',
    name: 'Business Skills',
    iconName: 'AccountBalance',
    color: '#f44336'
  },
  {
    id: 'exporter-guide',
    name: 'Exporter Guide',
    iconName: 'Description',
    color: '#795548'
  }
]

// Default learning resources
const DEFAULT_RESOURCES = {
  'crop-processing': [
    {
      id: 'r1',
      title: 'Turning Tomatoes into Ketchup',
      type: 'article',
      content: 'Learn step-by-step process of making ketchup from fresh tomatoes. Includes recipes, preservation techniques, and quality standards.',
      topics: ['Recipe', 'Processing', 'Preservation', 'Quality Control']
    },
    {
      id: 'r2',
      title: 'Turmeric to Powder Conversion',
      type: 'video',
      content: 'Video tutorial on cleaning, drying, and grinding turmeric into fine powder. Best practices for maintaining color and potency.',
      topics: ['Cleaning', 'Drying', 'Grinding', 'Storage']
    },
    {
      id: 'r3',
      title: 'Making Jaggery from Sugarcane',
      type: 'article',
      content: 'Complete guide to traditional jaggery making. Includes modern techniques for improved quality and shelf life.',
      topics: ['Juice Extraction', 'Boiling', 'Molding', 'Packaging']
    },
    {
      id: 'r4',
      title: 'Spice Processing Techniques',
      type: 'video',
      content: 'Learn how to process various spices while maintaining flavor and aroma. Includes grinding, blending, and packaging methods.',
      topics: ['Grinding', 'Blending', 'Aroma Preservation']
    }
  ],
  'packaging': [
    {
      id: 'r5',
      title: 'Label Design & Requirements',
      type: 'article',
      content: 'Essential information that must be on food labels. FSSAI guidelines, nutritional information, and best design practices.',
      topics: ['FSSAI Guidelines', 'Label Design', 'Legal Requirements']
    },
    {
      id: 'r6',
      title: 'Hygiene Standards for Food Packaging',
      type: 'article',
      content: 'Food safety standards, hygiene protocols, and best practices for packaging food products. Preventing contamination.',
      topics: ['Hygiene', 'Food Safety', 'Contamination Prevention']
    },
    {
      id: 'r7',
      title: 'Shelf Life & Preservation',
      type: 'video',
      content: 'How to extend product shelf life through proper packaging. Understanding expiration dates and storage requirements.',
      topics: ['Shelf Life', 'Preservation', 'Storage', 'Expiration']
    },
    {
      id: 'r8',
      title: 'Eco-friendly Packaging Options',
      type: 'article',
      content: 'Sustainable packaging materials and methods. Biodegradable options and their impact on product quality.',
      topics: ['Sustainability', 'Biodegradable', 'Eco-friendly']
    }
  ],
  'branding': [
    {
      id: 'r9',
      title: 'Creating Your Brand Logo',
      type: 'article',
      content: 'Step-by-step guide to designing a memorable logo. Simple tools and techniques for farmers without design experience.',
      topics: ['Logo Design', 'Brand Identity', 'Visual Elements']
    },
    {
      id: 'r10',
      title: 'Storytelling for Your Products',
      type: 'video',
      content: 'How to tell compelling stories about your products. Connecting with buyers through authentic narratives.',
      topics: ['Storytelling', 'Marketing', 'Customer Connection']
    },
    {
      id: 'r11',
      title: 'Packaging Design Tips',
      type: 'article',
      content: 'Making your products stand out on shelves. Color psychology, typography, and visual appeal in packaging.',
      topics: ['Design', 'Visual Appeal', 'Color Psychology']
    },
    {
      id: 'r12',
      title: 'Social Media Marketing Basics',
      type: 'video',
      content: 'Using social media to promote your products. Creating posts, engaging with customers, and building online presence.',
      topics: ['Social Media', 'Marketing', 'Online Presence']
    }
  ],
  'digital-skills': [
    {
      id: 'r13',
      title: 'WhatsApp Business Setup',
      type: 'video',
      content: 'Complete guide to setting up WhatsApp Business for your farm. Managing orders, customer communication, and catalog.',
      topics: ['WhatsApp Business', 'Customer Communication', 'Order Management']
    },
    {
      id: 'r14',
      title: 'UPI Payments for Farmers',
      type: 'article',
      content: 'How to accept UPI payments. Setting up payment links, QR codes, and managing transactions securely.',
      topics: ['UPI', 'Digital Payments', 'QR Codes']
    },
    {
      id: 'r15',
      title: 'Online Ordering Systems',
      type: 'video',
      content: 'Using platforms like this one to manage orders. Creating product listings and tracking sales.',
      topics: ['Online Platforms', 'Order Management', 'Product Listings']
    },
    {
      id: 'r16',
      title: 'Digital Marketing Basics',
      type: 'article',
      content: 'Introduction to digital marketing for farmers. Email marketing, social media, and online advertising basics.',
      topics: ['Digital Marketing', 'Email', 'Advertising']
    }
  ],
  'business-skills': [
    {
      id: 'r17',
      title: 'Pricing Your Products',
      type: 'article',
      content: 'How to calculate fair prices for your products. Understanding costs, profit margins, and market pricing.',
      topics: ['Pricing Strategy', 'Cost Calculation', 'Profit Margins']
    },
    {
      id: 'r18',
      title: 'Profit Calculation Methods',
      type: 'video',
      content: 'Simple formulas for calculating profit. Understanding revenue, costs, and net profit for your business.',
      topics: ['Profit', 'Revenue', 'Costs', 'Calculations']
    },
    {
      id: 'r19',
      title: 'Creating a Cost Sheet',
      type: 'article',
      content: 'Step-by-step guide to creating a cost sheet. Tracking raw materials, labor, overhead, and packaging costs.',
      topics: ['Cost Sheet', 'Expense Tracking', 'Financial Planning']
    },
    {
      id: 'r20',
      title: 'Inventory Management',
      type: 'video',
      content: 'Best practices for managing inventory. Tracking stock, preventing waste, and optimizing storage.',
      topics: ['Inventory', 'Stock Management', 'Storage']
    }
  ],
  'exporter-guide': [
    {
      id: 'r21',
      title: 'APEDA Registration Process',
      type: 'article',
      content: 'Complete guide to APEDA (Agricultural and Processed Food Products Export Development Authority) registration. Required documents and procedures.',
      topics: ['APEDA', 'Export Registration', 'Documentation']
    },
    {
      id: 'r22',
      title: 'FSSAI Certification',
      type: 'video',
      content: 'How to obtain FSSAI license for food products. Understanding different license types and application process.',
      topics: ['FSSAI', 'Food License', 'Certification']
    },
    {
      id: 'r23',
      title: 'Organic Certification Guide',
      type: 'article',
      content: 'Process of getting organic certification. NPOP standards, inspection requirements, and maintaining certification.',
      topics: ['Organic', 'NPOP', 'Certification', 'Standards']
    },
    {
      id: 'r24',
      title: 'Export Documentation',
      type: 'article',
      content: 'Essential documents for exporting agricultural products. Shipping documents, certificates, and compliance requirements.',
      topics: ['Export', 'Documentation', 'Compliance']
    }
  ]
}

export const KnowledgeProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [resources, setResources] = useState({})

  useEffect(() => {
    const storedCategories = localStorage.getItem('knowledgeCategories')
    const storedResources = localStorage.getItem('knowledgeResources')

    if (storedCategories && storedResources) {
      setCategories(JSON.parse(storedCategories))
      setResources(JSON.parse(storedResources))
    } else {
      setCategories(DEFAULT_CATEGORIES)
      setResources(DEFAULT_RESOURCES)
      localStorage.setItem('knowledgeCategories', JSON.stringify(DEFAULT_CATEGORIES))
      localStorage.setItem('knowledgeResources', JSON.stringify(DEFAULT_RESOURCES))
    }
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('knowledgeCategories', JSON.stringify(categories))
    }
  }, [categories])

  useEffect(() => {
    if (Object.keys(resources).length > 0) {
      localStorage.setItem('knowledgeResources', JSON.stringify(resources))
    }
  }, [resources])

  // Category management
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: category.id || `cat-${Date.now()}`,
      iconName: category.iconName || 'Description'
    }
    setCategories(prev => [...prev, newCategory])
    // Initialize empty resources array for new category
    setResources(prev => ({
      ...prev,
      [newCategory.id]: []
    }))
    return newCategory
  }

  const updateCategory = (id, updates) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    )
  }

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
    setResources(prev => {
      const newResources = { ...prev }
      delete newResources[id]
      return newResources
    })
  }

  const getCategoryById = (id) => {
    return categories.find(cat => cat.id === id)
  }

  // Resource management
  const addResource = (categoryId, resource) => {
    const newResource = {
      ...resource,
      id: resource.id || `res-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    }
    setResources(prev => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] || []), newResource]
    }))
    return newResource
  }

  const updateResource = (categoryId, resourceId, updates) => {
    setResources(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).map(res =>
        res.id === resourceId ? { ...res, ...updates } : res
      )
    }))
  }

  const deleteResource = (categoryId, resourceId) => {
    setResources(prev => ({
      ...prev,
      [categoryId]: (prev[categoryId] || []).filter(res => res.id !== resourceId)
    }))
  }

  const getResourceById = (categoryId, resourceId) => {
    return resources[categoryId]?.find(res => res.id === resourceId)
  }

  const getResourcesByCategory = (categoryId) => {
    return resources[categoryId] || []
  }

  const value = {
    categories,
    resources,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    addResource,
    updateResource,
    deleteResource,
    getResourceById,
    getResourcesByCategory
  }

  return (
    <KnowledgeContext.Provider value={value}>
      {children}
    </KnowledgeContext.Provider>
  )
}

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext)
  if (!context) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider')
  }
  return context
}

export default KnowledgeContext

