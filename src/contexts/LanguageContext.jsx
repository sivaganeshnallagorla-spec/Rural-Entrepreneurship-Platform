import React, { createContext, useState, useEffect, useContext } from 'react'

const translations = {
  en: {
    login: 'Login',
    username: 'Username',
    password: 'Password',
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    logout: 'Logout',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    price: 'Price',
    stock: 'Stock',
    category: 'Category',
    location: 'Location',
    search: 'Search',
    filter: 'Filter',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    status: 'Status',
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    users: 'Users',
    analytics: 'Analytics',
    reports: 'Reports'
  },
  hi: {
    login: 'लॉगिन',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    welcome: 'स्वागत है',
    dashboard: 'डैशबोर्ड',
    products: 'उत्पाद',
    orders: 'ऑर्डर',
    logout: 'लॉगआउट',
    addProduct: 'उत्पाद जोड़ें',
    editProduct: 'उत्पाद संपादित करें',
    deleteProduct: 'उत्पाद हटाएं',
    price: 'मूल्य',
    stock: 'स्टॉक',
    category: 'श्रेणी',
    location: 'स्थान',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    addToCart: 'कार्ट में जोड़ें',
    viewDetails: 'विवरण देखें',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    status: 'स्थिति',
    pending: 'लंबित',
    confirmed: 'पुष्ट',
    shipped: 'भेजा गया',
    delivered: 'पहुंचाया गया',
    cancelled: 'रद्द',
    users: 'उपयोगकर्ता',
    analytics: 'विश्लेषण',
    reports: 'रिपोर्ट'
  },
  te: {
    login: 'ప్రవేశించండి',
    username: 'వినియోగదారు పేరు',
    password: 'పాస్‌వర్డ్',
    welcome: 'స్వాగతం',
    dashboard: 'డాష్‌బోర్డ్',
    products: 'ఉత్పత్తులు',
    orders: 'ఆర్డర్లు',
    logout: 'లాగ్అవుట్',
    addProduct: 'ఉత్పత్తి జోడించండి',
    editProduct: 'ఉత్పత్తిని సవరించండి',
    deleteProduct: 'ఉత్పత్తిని తొలగించండి',
    price: 'ధర',
    stock: 'స్టాక్',
    category: 'వర్గం',
    location: 'స్థానం',
    search: 'శోధించండి',
    filter: 'ఫిల్టర్',
    addToCart: 'కార్ట్‌కు జోడించండి',
    viewDetails: 'వివరాలు చూడండి',
    submit: 'సమర్పించండి',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    edit: 'సవరించండి',
    delete: 'తొలగించండి',
    status: 'స్థితి',
    pending: 'పెండింగ్',
    confirmed: 'నిర్ధారించబడింది',
    shipped: 'రవాణా చేయబడింది',
    delivered: 'పంపిణీ చేయబడింది',
    cancelled: 'రద్దు చేయబడింది',
    users: 'వినియోగదారులు',
    analytics: 'విశ్లేషణ',
    reports: 'రిపోర్టులు'
  },
  ta: {
    login: 'உள்நுழைய',
    username: 'பயனர் பெயர்',
    password: 'கடவுச்சொல்',
    welcome: 'வரவேற்பு',
    dashboard: 'டாஷ்போர்டு',
    products: 'உற்பத்திகள்',
    orders: 'ஆர்டர்கள்',
    logout: 'வெளியேற',
    addProduct: 'உற்பத்தி சேர்',
    editProduct: 'உற்பத்தியை திருத்த',
    deleteProduct: 'உற்பத்தியை நீக்க',
    price: 'விலை',
    stock: 'பங்கு',
    category: 'வகை',
    location: 'இடம்',
    search: 'தேடு',
    filter: 'வடிகட்டு',
    addToCart: 'கார்ட்டில் சேர்',
    viewDetails: 'விவரங்களைப் பார்',
    submit: 'சமர்ப்பிக்க',
    cancel: 'ரத்து செய்',
    save: 'சேமி',
    edit: 'திருத்த',
    delete: 'நீக்க',
    status: 'நிலை',
    pending: 'நிலுவையில்',
    confirmed: 'உறுதிப்படுத்தப்பட்டது',
    shipped: 'அனுப்பப்பட்டது',
    delivered: 'வழங்கப்பட்டது',
    cancelled: 'ரத்து செய்யப்பட்டது',
    users: 'பயனர்கள்',
    analytics: 'பகுப்பாய்வு',
    reports: 'அறிக்கைகள்'
  }
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const stored = localStorage.getItem('language')
    if (stored) {
      setLanguage(stored)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  const value = {
    language,
    setLanguage,
    t,
    availableLanguages: ['en', 'hi', 'te', 'ta']
  }

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext

