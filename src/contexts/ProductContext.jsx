import React, { createContext, useState, useEffect, useContext } from 'react'

const ProductContext = createContext()

const DEFAULT_PRODUCTS = [
  {
    id: 'p1',
    farmerId: 'farmer1',
    farmerName: 'Rajesh Kumar',
    name: 'Organic Wheat Flour',
    category: 'Processed Foods',
    description: 'Stone-ground organic wheat flour from Punjab. Perfect for traditional Indian breads.',
    price: 150,
    unit: 'kg',
    stock: 100,
    location: 'Punjab, India',
    image: 'https://tiimg.tistatic.com/fp/0/008/609/organic-wheat-flour-809.jpg',
    certification: 'organic',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    farmerId: 'farmer1',
    farmerName: 'Rajesh Kumar',
    name: 'Handmade Jaggery',
    category: 'Processed Foods',
    description: 'Pure, unrefined jaggery made from sugarcane. Rich in minerals and nutrients.',
    price: 80,
    unit: 'kg',
    stock: 50,
    location: 'Punjab, India',
    image: '/api/placeholder/400/300',
    certification: 'organic',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    farmerId: 'farmer2',
    farmerName: 'Priya Sharma',
    name: 'Turmeric Powder',
    category: 'Spices',
    description: 'Sun-dried and hand-ground turmeric from Maharashtra. Potent flavor and color.',
    price: 200,
    unit: 'kg',
    stock: 75,
    location: 'Maharashtra, India',
    image: '/api/placeholder/400/300',
    certification: 'organic',
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'p4',
    farmerId: 'farmer2',
    farmerName: 'Priya Sharma',
    name: 'Cotton Bags',
    category: 'Eco-friendly Crafts',
    description: 'Handwoven cotton bags. Sustainable alternative to plastic.',
    price: 120,
    unit: 'piece',
    stock: 200,
    location: 'Maharashtra, India',
    image: '/api/placeholder/400/300',
    certification: 'eco-friendly',
    available: true,
    createdAt: new Date().toISOString()
  }
]

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('products')
    if (stored) {
      setProducts(JSON.parse(stored))
    } else {
      setProducts(DEFAULT_PRODUCTS)
      localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS))
    }
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products))
    }
  }, [products])

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      available: true
    }
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }

  const updateProduct = (id, updates) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const getProductsByFarmer = (farmerId) => {
    return products.filter(p => p.farmerId === farmerId)
  }

  const getProductById = (id) => {
    return products.find(p => p.id === id)
  }

  const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase()
    return products.filter(
      p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.location.toLowerCase().includes(lowerQuery)
    )
  }

  const filterProducts = (filters) => {
    return products.filter(p => {
      if (filters.category && p.category !== filters.category) return false
      if (filters.certification && p.certification !== filters.certification) return false
      if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false
      if (filters.minPrice && p.price < filters.minPrice) return false
      if (filters.maxPrice && p.price > filters.maxPrice) return false
      if (filters.available !== undefined && p.available !== filters.available) return false
      return true
    })
  }

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByFarmer,
    getProductById,
    searchProducts,
    filterProducts
  }

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export default ProductContext

