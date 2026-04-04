import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import FarmerOverview from '../components/farmer/FarmerOverview'
import ProductList from '../components/farmer/ProductList'
import AddProduct from '../components/farmer/AddProduct'
import EditProduct from '../components/farmer/EditProduct'
import FarmerOrders from '../components/farmer/FarmerOrders'
import NotificationsComponent from '../components/Notifications'
import Profile from '../components/farmer/Profile'
import SkillCenter from '../components/farmer/SkillCenter'
import InteractiveTools from '../components/farmer/InteractiveTools'
import ServicesHub from '../components/farmer/ServicesHub'
import StageService from '../components/farmer/StageService'
import DaaSMarketplace from '../components/farmer/DaaSMarketplace'
import PricingCalculator from '../components/farmer/PricingCalculator'
import Messaging from '../components/shared/Messaging'
import FarmerSchemes from '../components/farmer/FarmerSchemes'
import SkillModule from '../components/farmer/SkillModule'
import EquipmentMarketplace from '../components/farmer/EquipmentMarketplace'
import MandiDashboard from '../components/farmer/MandiDashboard'
import { Container, Box } from '@mui/material'

const FarmerDashboard = () => {
  const [progress, setProgress] = useState({
    profileCompleted: false,
    productAdded: false,
    bankDetailsSet: false,
  });

  const completeStep = (step) => {
    setProgress((prev) => ({
      ...prev,
      [step]: true,
    }));
  };

  const allStepsCompleted = Object.values(progress).every((step) => step);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route index element={<FarmerOverview />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="skill" element={<SkillCenter />} />
          <Route path="skill-module" element={<SkillModule />} />
          <Route path="tools" element={<InteractiveTools />} />
          <Route path="services" element={<ServicesHub />} />
          <Route path="services/:stage" element={<StageService />} />
          <Route path="drone-booking" element={<DaaSMarketplace />} />
          <Route path="pricing-calculator" element={<PricingCalculator />} />
          <Route path="notifications" element={<NotificationsComponent />} />
          <Route path="messages" element={<Messaging />} />
          <Route path="schemes" element={<FarmerSchemes />} />
          <Route path="equipment-marketplace" element={<EquipmentMarketplace />} />
          <Route path="mandi-prices" element={<MandiDashboard />} />
          <Route path="*" element={<Navigate to="/farmer" replace />} />
        </Routes>
      </Container>
      {!allStepsCompleted && (
        <div className="progress-card">
          <ul>
            {!progress.profileCompleted && (
              <li>
                <button onClick={() => completeStep('profileCompleted')}>
                  Complete your profile
                </button>
              </li>
            )}
            {!progress.productAdded && (
              <li>
                <button onClick={() => completeStep('productAdded')}>
                  Add your first product
                </button>
              </li>
            )}
            {!progress.bankDetailsSet && (
              <li>
                <button onClick={() => completeStep('bankDetailsSet')}>
                  Set up your bank details
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
      {allStepsCompleted && <p>Welcome! Your setup is complete.</p>}
    </Box>
  )
}

export default FarmerDashboard

