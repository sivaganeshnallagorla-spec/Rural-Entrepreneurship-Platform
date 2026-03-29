import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const MessagingContext = createContext()

const STORAGE_KEY = 'platform_messages'

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { threads: [] }
  } catch {
    return { threads: [] }
  }
}

const saveToStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const MessagingProvider = ({ children }) => {
  const [data, setData] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(data)
  }, [data])

  const getThreads = useCallback((userId) => {
    return data.threads.filter(
      (t) => t.farmerId === userId || t.buyerId === userId
    )
  }, [data.threads])

  const getThread = useCallback((farmerId, buyerId) => {
    const existing = data.threads.find(
      (t) => t.farmerId === farmerId && t.buyerId === buyerId
    )
    return existing || null
  }, [data.threads])

  const sendMessage = useCallback((farmerId, buyerInfo, farmerInfo, text) => {
    const threadId = `${farmerId}-${buyerInfo.id}`
    const now = new Date().toISOString()

    setData((prev) => {
      const threads = [...prev.threads]
      const idx = threads.findIndex((t) => t.id === threadId)
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId: buyerInfo.id || farmerId,
        senderName: buyerInfo.name || farmerInfo?.name || 'Unknown',
        text,
        timestamp: now,
        read: false
      }

      if (idx !== -1) {
        const updated = { ...threads[idx] }
        updated.messages = [...(updated.messages || []), newMsg]
        updated.lastMessage = text
        updated.lastTimestamp = now
        threads[idx] = updated
      } else {
        threads.push({
          id: threadId,
          farmerId,
          farmerName: farmerInfo?.name || 'Farmer',
          buyerId: buyerInfo.id,
          buyerName: buyerInfo.name || 'Buyer',
          messages: [newMsg],
          lastMessage: text,
          lastTimestamp: now
        })
      }

      return { ...prev, threads }
    })
  }, [])

  const markAsRead = useCallback((threadId, userId) => {
    setData((prev) => {
      const threads = prev.threads.map((t) => {
        if (t.id !== threadId) return t
        return {
          ...t,
          messages: t.messages.map((m) =>
            m.senderId !== userId ? { ...m, read: true } : m
          )
        }
      })
      return { ...prev, threads }
    })
  }, [])

  const getUnreadCount = useCallback((userId) => {
    let count = 0
    data.threads.forEach((t) => {
      if (t.farmerId === userId || t.buyerId === userId) {
        t.messages?.forEach((m) => {
          if (m.senderId !== userId && !m.read) count++
        })
      }
    })
    return count
  }, [data.threads])

  return (
    <MessagingContext.Provider value={{ getThreads, getThread, sendMessage, markAsRead, getUnreadCount }}>
      {children}
    </MessagingContext.Provider>
  )
}

export const useMessaging = () => {
  const ctx = useContext(MessagingContext)
  if (!ctx) throw new Error('useMessaging must be used within MessagingProvider')
  return ctx
}

export default MessagingContext
