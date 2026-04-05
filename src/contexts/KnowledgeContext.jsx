import React, { createContext, useState, useEffect, useContext } from 'react'
import { secureStorage } from '../utils/secureStorage'

const KnowledgeContext = createContext()

// Default categories with icons (we'll store icon names as strings)
const DEFAULT_CATEGORIES = [
  {
    id: 'govt-schemes',
    name: 'Government Schemes',
    iconName: 'Description',
    color: '#1a237e'
  },
  {
    id: 'mandi-prices',
    name: 'Mandi Prices & Market Access',
    iconName: 'AttachMoney',
    color: '#2e7d32'
  },
  {
    id: 'processing',
    name: 'Post-Harvest & Value Addition',
    iconName: 'LocalFlorist',
    color: '#f57c00'
  },
  {
    id: 'digital-skills',
    name: 'Digital Skills for Farmers',
    iconName: 'Public',
    color: '#0288d1'
  },
  {
    id: 'fpo-support',
    name: 'FPO & Cooperative Support',
    iconName: 'Business',
    color: '#7b1fa2'
  }
]

// Default learning resources
const DEFAULT_RESOURCES = {
  'govt-schemes': [
    {
      id: 'g1',
      title: 'PM-KISAN Nidhi Yojna',
      type: 'article',
      content: 'Under this scheme, all landholding farmer families are provided with financial benefit of Rs.6000 per year per family. Use our FPO management tool to check eligibility.',
      topics: ['Financial Aid', 'Direct Benefit Transfer', 'Central Scheme']
    },
    {
      id: 'g2',
      title: 'National Agriculture Market (e-NAM)',
      type: 'video',
      content: 'How to register on e-NAM to sell your produce across India. Get competitive prices through transparent bidding.',
      topics: ['Market Access', 'Online Selling', 'e-Governance']
    }
  ],
  'mandi-prices': [
    {
      id: 'm1',
      title: 'Understanding Mandi Rates',
      type: 'article',
      content: 'Learn how mandi rates are determined and how to check live prices across different markets in your state.',
      topics: ['Price Trends', 'Market Analysis', 'Mandi Board']
    },
    {
      id: 'm2',
      title: 'MSP (Minimum Support Price) Guide',
      type: 'video',
      content: 'Comprehensive guide to current MSP for various crops as announced by the Government of India for the current season.',
      topics: ['MSP', 'Government Procurement', 'Fair Price']
    }
  ],
  'processing': [
    {
      id: 'p1',
      title: 'Cold Chain Setup for Perishables',
      type: 'article',
      content: 'Best practices for storing fresh fruits and vegetables. Reducing post-harvest losses by up to 30%.',
      topics: ['Post-Harvest', 'Cold Storage', 'Loss Prevention']
    }
  ],
  'digital-skills': [
    {
      id: 'd1',
      title: 'Digital Payments & UPI for Farmers',
      type: 'video',
      content: 'Learn how to use BHIM-UPI, PhonePe, and Google Pay to accept payments directly from buyers securely.',
      topics: ['UPI', 'Digital Literacy', 'Financial Security']
    },
    {
      id: 'd2',
      title: 'Selling on WhatsApp Business',
      type: 'article',
      content: 'Reach local buyers better by setting up a professional WhatsApp Business catalog for your farm produce.',
      topics: ['WhatsApp Marketing', 'Direct Sales', 'Small Business']
    }
  ],
  'fpo-support': [
    {
      id: 'f1',
      title: 'FPO Formation Step-by-Step',
      type: 'article',
      content: 'Formation of Farmer Producer Organizations (FPOs). Benefits, member registration, and compliance.',
      topics: ['FPO', 'Collectives', 'Market Leverage']
    }
  ]
}

export const KnowledgeProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [resources, setResources] = useState({})

  useEffect(() => {
    const storedCategories = secureStorage.get('knowledgeCategories')
    const storedResources = secureStorage.get('knowledgeResources')

    if (storedCategories && storedResources) {
      setCategories(storedCategories)
      setResources(storedResources)
    } else {
      setCategories(DEFAULT_CATEGORIES)
      setResources(DEFAULT_RESOURCES)
      secureStorage.set('knowledgeCategories', DEFAULT_CATEGORIES)
      secureStorage.set('knowledgeResources', DEFAULT_RESOURCES)
    }
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      secureStorage.set('knowledgeCategories', categories)
    }
  }, [categories])

  useEffect(() => {
    if (resources && Object.keys(resources).length > 0) {
      secureStorage.set('knowledgeResources', resources)
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

