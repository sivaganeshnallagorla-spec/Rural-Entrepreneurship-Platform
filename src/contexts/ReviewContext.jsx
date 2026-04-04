import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { secureStorage } from '../utils/secureStorage'

const ReviewContext = createContext()

const STORAGE_KEY = 'platform_reviews'

const loadReviews = () => {
  return secureStorage.get(STORAGE_KEY) || []
}

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(loadReviews)

  useEffect(() => {
    secureStorage.set(STORAGE_KEY, reviews)
  }, [reviews])

  const addReview = useCallback((reviewData) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      ...reviewData,
      createdAt: new Date().toISOString()
    }
    setReviews((prev) => [...prev, newReview])
    return newReview
  }, [])

  const getReviewsByProduct = useCallback((productId) => {
    return reviews.filter((r) => r.productId === productId)
  }, [reviews])

  const getAverageRating = useCallback((productId) => {
    const productReviews = reviews.filter((r) => r.productId === productId)
    if (productReviews.length === 0) return 0
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / productReviews.length) * 10) / 10
  }, [reviews])

  const hasReviewed = useCallback((productId, buyerId) => {
    return reviews.some((r) => r.productId === productId && r.buyerId === buyerId)
  }, [reviews])

  const getAverageFarmerRating = useCallback((farmerId) => {
    const farmerReviews = reviews.filter((r) => r.farmerId === farmerId)
    if (farmerReviews.length === 0) return 0
    const sum = farmerReviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / farmerReviews.length) * 10) / 10
  }, [reviews])

  return (
    <ReviewContext.Provider value={{
      reviews,
      addReview,
      getReviewsByProduct,
      getAverageRating,
      hasReviewed,
      getAverageFarmerRating
    }}>
      {children}
    </ReviewContext.Provider>
  )
}

export const useReviews = () => {
  const ctx = useContext(ReviewContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewProvider')
  return ctx
}

export default ReviewContext
