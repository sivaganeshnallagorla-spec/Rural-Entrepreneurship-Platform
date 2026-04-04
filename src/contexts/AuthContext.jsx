import React, { createContext, useState, useEffect, useContext } from 'react'
import { secureStorage } from '../utils/secureStorage'

const AuthContext = createContext()

// Helper: SHA-256 hash using Web Crypto API (for registered users only)
// PREDEFINED_USERS keep plain-text passwords for demo convenience
async function hashPassword(plaintext) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Predefined credentials from environment variables for security
const PREDEFINED_USERS = [
  {
    id: 'admin1',
    username: import.meta.env.VITE_DEMO_ADMIN_USER || 'admin',
    password: import.meta.env.VITE_DEMO_ADMIN_PASS || 'admin123',
    role: 'admin',
    name: 'Platform Admin',
    email: 'admin@ruralplatform.in'
  },
  {
    id: 'farmer1',
    username: import.meta.env.VITE_DEMO_FARMER_USER || 'farmer',
    password: import.meta.env.VITE_DEMO_FARMER_PASS || 'farmer123',
    role: 'farmer',
    name: 'Rajesh Kumar',
    email: 'rajesh@farm.in',
    location: 'Punjab, India',
    phone: '+91 9876543210'
  },
  {
    id: 'farmer2',
    username: 'farmer2',
    password: import.meta.env.VITE_DEMO_FARMER_PASS || 'farmer123',
    role: 'farmer',
    name: 'Priya Sharma',
    email: 'priya@farm.in',
    location: 'Maharashtra, India',
    phone: '+91 9876543211'
  },
  {
    id: 'buyer1',
    username: import.meta.env.VITE_DEMO_BUYER_USER || 'buyer',
    password: import.meta.env.VITE_DEMO_BUYER_PASS || 'buyer123',
    role: 'buyer',
    name: 'Global Food Co.',
    email: 'contact@globalfood.com',
    location: 'New Delhi, India'
  },
  {
    id: 'buyer2',
    username: 'buyer2',
    password: import.meta.env.VITE_DEMO_BUYER_PASS || 'buyer123',
    role: 'buyer',
    name: 'Organic Market',
    email: 'info@organicmarket.in',
    location: 'Bangalore, India'
  },
  {
    id: 'op1',
    username: import.meta.env.VITE_DEMO_DRONE_USER || 'drone',
    password: import.meta.env.VITE_DEMO_DRONE_PASS || 'drone123',
    role: 'drone_operator',
    name: 'SkyFarmer Operator',
    email: 'ops@skyfarmer.in',
    location: 'Pune Regional'
  }
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get all registered users from localStorage
  const getRegisteredUsers = () => {
    return secureStorage.get('registeredUsers') || []
  }

  // Save registered users to secureStorage
  const saveRegisteredUsers = (users) => {
    secureStorage.set('registeredUsers', users)
  }

  useEffect(() => {
    // Load user from session with expiry check
    const session = secureStorage.get('auth_session')
    if (session) {
      if (session.expiresAt && Date.now() > session.expiresAt) {
        logout()
      } else {
        setUser(session.user)
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    // Check predefined users first (plain-text comparison for demo accounts)
    let foundUser = PREDEFINED_USERS.find(
      u => u.username === username && u.password === password
    )

    // If not found, check registered users (hashed password comparison)
    if (!foundUser) {
      const registeredUsers = getRegisteredUsers()
      const inputHash = await hashPassword(password)
      foundUser = registeredUsers.find(
        u => u.username === username && u.passwordHash === inputHash
      )
    }
    
    if (foundUser) {
      const userData = { ...foundUser }
      delete userData.password // Don't store password
      delete userData.passwordHash // Don't keep hash in session
      setUser(userData)
      
      const session = {
        user: userData,
        role: userData.role,
        loginAt: Date.now(),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000 // 8 hours session
      }
      secureStorage.set('auth_session', session)
      return { success: true, user: userData }
    }
    
    return { success: false, error: 'Invalid username or password' }
  }

  const register = async (formData) => {
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

    // Password validation rule: 8+ chars, 1 uppercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      return { 
        success: false, 
        error: 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.' 
      }
    }

    // Hash password before storing — never store plain-text passwords
    const passwordHash = await hashPassword(formData.password)

    // Create new user (passwordHash stored, not plain password)
    const newUser = {
      id: `user-${Date.now()}`,
      username: formData.username,
      passwordHash,
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
    secureStorage.remove('auth_session')
    // Don't remove products and orders on logout
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    
    const session = secureStorage.get('auth_session')
    if (session) {
      session.user = updatedUser
      secureStorage.set('auth_session', session)
    }

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

