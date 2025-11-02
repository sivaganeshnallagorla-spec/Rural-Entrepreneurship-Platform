import React, { createContext, useState, useEffect, useContext } from 'react'

const AuthContext = createContext()

// Predefined credentials
const PREDEFINED_USERS = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Platform Admin',
    email: 'admin@ruralplatform.in'
  },
  {
    id: 'farmer1',
    username: 'farmer',
    password: 'farmer123',
    role: 'farmer',
    name: 'Rajesh Kumar',
    email: 'rajesh@farm.in',
    location: 'Punjab, India',
    phone: '+91 9876543210'
  },
  {
    id: 'farmer2',
    username: 'farmer2',
    password: 'farmer123',
    role: 'farmer',
    name: 'Priya Sharma',
    email: 'priya@farm.in',
    location: 'Maharashtra, India',
    phone: '+91 9876543211'
  },
  {
    id: 'buyer1',
    username: 'buyer',
    password: 'buyer123',
    role: 'buyer',
    name: 'Global Food Co.',
    email: 'contact@globalfood.com',
    location: 'New Delhi, India'
  },
  {
    id: 'buyer2',
    username: 'buyer2',
    password: 'buyer123',
    role: 'buyer',
    name: 'Organic Market',
    email: 'info@organicmarket.in',
    location: 'Bangalore, India'
  }
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get all registered users from localStorage
  const getRegisteredUsers = () => {
    const stored = localStorage.getItem('registeredUsers')
    return stored ? JSON.parse(stored) : []
  }

  // Save registered users to localStorage
  const saveRegisteredUsers = (users) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users))
  }

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    // Check predefined users first
    let foundUser = PREDEFINED_USERS.find(
      u => u.username === username && u.password === password
    )

    // If not found, check registered users
    if (!foundUser) {
      const registeredUsers = getRegisteredUsers()
      foundUser = registeredUsers.find(
        u => u.username === username && u.password === password
      )
    }
    
    if (foundUser) {
      const userData = { ...foundUser }
      delete userData.password // Don't store password
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    
    return { success: false, error: 'Invalid username or password' }
  }

  const register = (formData) => {
    const registeredUsers = getRegisteredUsers()
    
    // Check if username already exists
    if (PREDEFINED_USERS.some(u => u.username === formData.username)) {
      return { success: false, error: 'Username already exists' }
    }
    
    if (registeredUsers.some(u => u.username === formData.username)) {
      return { success: false, error: 'Username already exists' }
    }

    // Check if email already exists
    if (PREDEFINED_USERS.some(u => u.email === formData.email)) {
      return { success: false, error: 'Email already registered' }
    }
    
    if (registeredUsers.some(u => u.email === formData.email)) {
      return { success: false, error: 'Email already registered' }
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      profilePicture: formData.profilePicture || '',
      location: `${formData.address.city}, ${formData.address.state}, ${formData.address.country}`,
      createdAt: new Date().toISOString()
    }

    // Add to registered users
    registeredUsers.push(newUser)
    saveRegisteredUsers(registeredUsers)

    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    // Don't remove products and orders on logout
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))

    // Also update in registered users if it's a registered user
    const registeredUsers = getRegisteredUsers()
    const userIndex = registeredUsers.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updates }
      saveRegisteredUsers(registeredUsers)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    predefinedUsers: PREDEFINED_USERS
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

