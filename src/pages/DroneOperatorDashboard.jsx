import React from 'react'
import { Box, Container } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import DroneOverview from '../components/drone/DroneOverview'
import BookingManagement from '../components/drone/BookingManagement'
import SessionHistory from '../components/drone/SessionHistory'
import AvailabilityCalendar from '../components/drone/AvailabilityCalendar'
import NotificationsComponent from '../components/Notifications'
import Profile from '../components/farmer/Profile'

const DroneOperatorDashboard = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route index element={<DroneOverview />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="sessions" element={<SessionHistory />} />
          <Route path="availability" element={<AvailabilityCalendar />} />
          <Route path="notifications" element={<NotificationsComponent />} />
          <Route path="profile" element={<Profile role="drone_operator" />} />
          <Route path="*" element={<Navigate to="/drone-operator" replace />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default DroneOperatorDashboard
