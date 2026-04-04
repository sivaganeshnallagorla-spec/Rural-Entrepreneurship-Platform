import React, { createContext, useState, useEffect, useContext } from 'react'
import { secureStorage } from '../utils/secureStorage'

const OrderContext = createContext()

const DEFAULT_ORDERS = []

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    const stored = secureStorage.get('orders')
    if (stored) setOrders(stored)
    
    const storedCart = secureStorage.get('cart')
    if (storedCart) setCart(storedCart)
  }, [])

  useEffect(() => {
    secureStorage.set('orders', orders)
  }, [orders])

  useEffect(() => {
    secureStorage.set('cart', cart)
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setOrders(prev => [...prev, newOrder])
    clearCart(); // Clear cart after order
    return newOrder
  }

  const updateOrder = (id, updates) => {
    setOrders(prev =>
      prev.map(o =>
        o.id === id
          ? { ...o, ...updates, updatedAt: new Date().toISOString() }
          : o
      )
    )
  }

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  const getOrdersByBuyer = (buyerId) => {
    return orders.filter(o => o.buyerId === buyerId)
  }

  const getOrdersByFarmer = (farmerId) => {
    return orders.filter(o => o.farmerId === farmerId)
  }

  const getOrderById = (id) => {
    return orders.find(o => o.id === id)
  }

  const value = {
    orders,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByBuyer,
    getOrdersByFarmer,
    getOrderById
  }

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}

export default OrderContext

