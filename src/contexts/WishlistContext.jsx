import React, { createContext, useState, useEffect, useContext } from 'react'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      try {
        setWishlist(JSON.parse(stored))
      } catch (e) {
        setWishlist([])
      }
    }
  }, [])

  useEffect(() => {
    if (wishlist.length >= 0) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    }
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) return prev
      return [...prev, { ...product, addedAt: new Date().toISOString() }]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export default WishlistContext

