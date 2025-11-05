import React, { createContext, useState, useContext } from 'react'

const ComparisonContext = createContext()

const MAX_COMPARE_ITEMS = 3

export const ComparisonProvider = ({ children }) => {
  const [comparisonItems, setComparisonItems] = useState([])

  const addToComparison = (product) => {
    setComparisonItems(prev => {
      if (prev.find(p => p.id === product.id)) return prev
      if (prev.length >= MAX_COMPARE_ITEMS) {
        // Remove oldest and add new
        return [product, ...prev.slice(0, MAX_COMPARE_ITEMS - 1)]
      }
      return [...prev, product]
    })
  }

  const removeFromComparison = (productId) => {
    setComparisonItems(prev => prev.filter(p => p.id !== productId))
  }

  const isInComparison = (productId) => {
    return comparisonItems.some(p => p.id === productId)
  }

  const clearComparison = () => {
    setComparisonItems([])
  }

  const value = {
    comparisonItems,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
    canAddMore: comparisonItems.length < MAX_COMPARE_ITEMS
  }

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  )
}

export const useComparison = () => {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}

export default ComparisonContext

