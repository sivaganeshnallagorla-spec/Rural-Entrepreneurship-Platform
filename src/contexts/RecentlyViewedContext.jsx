import React, { createContext, useState, useEffect, useContext } from 'react'
import { secureStorage } from '../utils/secureStorage'

const RecentlyViewedContext = createContext()

const MAX_RECENT_ITEMS = 10

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([])

  useEffect(() => {
    const stored = secureStorage.get('recentlyViewed')
    if (stored) {
      setRecentlyViewed(stored)
    }
  }, [])

  useEffect(() => {
    secureStorage.set('recentlyViewed', recentlyViewed)
  }, [recentlyViewed])

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p.id !== product.id)
      // Add to beginning and limit to MAX_RECENT_ITEMS
      return [{ ...product, viewedAt: new Date().toISOString() }, ...filtered].slice(0, MAX_RECENT_ITEMS)
    })
  }

  const clearRecentlyViewed = () => {
    setRecentlyViewed([])
  }

  const value = {
    recentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed
  }

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext)
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider')
  }
  return context
}

export default RecentlyViewedContext

