import React, { createContext, useState, useEffect, useContext } from 'react'

const OrderContext = createContext()

const DEFAULT_ORDERS = []

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('orders')
    if (stored) {
      setOrders(JSON.parse(stored))
    } else {
      setOrders(DEFAULT_ORDERS)
      localStorage.setItem('orders', JSON.stringify(DEFAULT_ORDERS))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  const createOrder = (orderData) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setOrders(prev => [...prev, newOrder])
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

