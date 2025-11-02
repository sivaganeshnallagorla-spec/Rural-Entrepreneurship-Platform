# 🌾 Rural Entrepreneurship Platform

A comprehensive web application that empowers farmers in rural India to transform raw crops into value-added products. The platform promotes rural entrepreneurship, connects farmers with global buyers, and leverages technology to improve income, sustainability, and community development.

## 🚀 Features

### 🔑 Authentication
- **Predefined Credentials**: Simple authentication with predefined usernames and passwords for Admin, Farmer, and Buyer roles
- **Role-based Access Control**: Each user type sees only relevant features
- **Future Ready**: Architecture supports future integration with Aadhaar/UPI/Email

### 👨‍💼 Admin Capabilities
- **User Management**: Add, edit, or deactivate farmer and buyer accounts
- **Transaction Oversight**: Monitor all orders, payments, and disputes
- **Content Moderation**: Approve/reject product listings, ensure compliance
- **Analytics & Reports**: Generate insights on sales, farmer participation, and buyer trends with charts
- **Platform Maintenance**: Manage categories, tags, and featured products

### 🚜 Farmer Capabilities
- **Product Listings**: Add raw and value-added products with images, descriptions, and pricing
- **Inventory Management**: Update stock levels, mark items as available/unavailable
- **Order Management**: View incoming orders, confirm or reject requests, update delivery status
- **Buyer Interaction**: In-app messaging for negotiation and queries
- **Entrepreneurship Support**: Access training modules on food processing, branding, and packaging
- **Impact Storytelling**: Upload photos/videos to showcase product origin and rural entrepreneurship journey

### 🛒 Buyer Capabilities
- **Product Browsing**: Search and filter by category, price, location, or certification (organic, fair trade)
- **Order Placement**: Add to cart, place orders, and track delivery status
- **Feedback System**: Rate farmers, leave reviews, and suggest improvements
- **Subscriptions**: Option to subscribe to monthly/seasonal product boxes
- **Global Access**: Discover unique rural products and support local producers
- **Impact Transparency**: View farmer profiles and see how purchases support rural livelihoods

### 🌍 Additional Features
- **Multi-language Support**: English + Hindi, Telugu, Tamil
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Notifications System**: Real-time alerts for orders, messages, and platform updates
- **Local Storage**: Data persistence across sessions
- **Analytics Dashboard**: Charts and graphs for insights

## 🛠️ Tech Stack

- **React 18** - Modern React with Hooks
- **React Router 6** - Client-side routing
- **Material UI (MUI)** - Rich, responsive UI components
- **Context API** - Global state management
- **Local Storage** - Data persistence
- **Recharts** - Analytics and data visualization
- **Axios** - HTTP client (ready for API integration)
- **Vite** - Fast build tool and dev server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FEDFW
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Predefined Credentials

### Admin
- **Username**: `admin`
- **Password**: `admin123`

### Farmer
- **Username**: `farmer`
- **Password**: `farmer123`

- **Username**: `farmer2`
- **Password**: `farmer123`

### Buyer
- **Username**: `buyer`
- **Password**: `buyer123`

- **Username**: `buyer2`
- **Password**: `buyer123`

## 📁 Project Structure

```
FEDFW/
├── src/
│   ├── components/          # Reusable components
│   │   ├── admin/           # Admin-specific components
│   │   ├── farmer/          # Farmer-specific components
│   │   ├── buyer/           # Buyer-specific components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   └── ProtectedRoute.jsx
│   ├── contexts/            # Context API for state management
│   │   ├── AuthContext.jsx
│   │   ├── ProductContext.jsx
│   │   ├── OrderContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── LanguageContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── FarmerDashboard.jsx
│   │   └── BuyerDashboard.jsx
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Component Design

The application follows a modular, reusable component architecture:
- **Atomic Design**: Components are organized by role and functionality
- **Reusable Components**: Navbar, Cards, Forms, Tables
- **Context-based State**: Centralized state management with Context API
- **Custom Hooks**: Reusable logic extraction with custom hooks

## 📊 State Management

The application uses **Context API** for global state management:
- **AuthContext**: User authentication and session
- **ProductContext**: Product data and operations
- **OrderContext**: Order management
- **NotificationContext**: Notifications system
- **LanguageContext**: Multi-language support

## 🧭 Routing

React Router is configured with protected routes:
- `/login` - Authentication page
- `/admin/*` - Admin dashboard and features
- `/farmer/*` - Farmer dashboard and features
- `/buyer/*` - Buyer dashboard and features

## 💾 Data Persistence

All data is persisted using **Local Storage**:
- User session data
- Products database
- Orders history
- Notifications
- Language preference

## 🌐 Deployment

### Build the application
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts

### Deploy to GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://username.github.io/FEDFW",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run `npm run deploy`

## ✨ Advanced Features

1. **Custom Hooks**: `useLocalStorage`, `useDebounce` for reusable logic
2. **Analytics Dashboard**: Charts and graphs using Recharts
3. **Multi-language Support**: 4 languages (English, Hindi, Telugu, Tamil)
4. **Real-time Notifications**: Notification system with unread counts
5. **Responsive Design**: Mobile-first approach with Material UI
6. **Advanced Filtering**: Search and filter products by multiple criteria
7. **Role-based Navigation**: Dynamic navigation based on user role

## 🔮 Future Enhancements

- Backend API integration
- Aadhaar/UPI authentication
- Payment gateway integration
- Real-time messaging
- Image upload functionality
- QR code traceability
- Micro-credit and insurance integration
- AI-driven pricing suggestions

## 📝 License

This project is part of a frontend development framework assignment.

## 👨‍💻 Development

Built with ❤️ for empowering rural entrepreneurship in India.

---

**Note**: This is a frontend-only application using Local Storage for data persistence. For production use, integrate with a backend API.

"# Rural-Entrepreneurship-Platform" 
