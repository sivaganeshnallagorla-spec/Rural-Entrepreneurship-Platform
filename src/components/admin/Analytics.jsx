import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent
} from '@mui/material'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useProducts } from '../../contexts/ProductContext'
import { useOrders } from '../../contexts/OrderContext'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

const Analytics = () => {
  const { products } = useProducts()
  const { orders } = useOrders()
  const [categoryData, setCategoryData] = useState([])
  const [orderStatusData, setOrderStatusData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])

  useEffect(() => {
    // Category distribution
    const categoryMap = {}
    products.forEach(p => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1
    })
    setCategoryData(
      Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
    )

    // Order status distribution
    const statusMap = {}
    orders.forEach(o => {
      statusMap[o.status] = (statusMap[o.status] || 0) + 1
    })
    setOrderStatusData(
      Object.entries(statusMap).map(([name, value]) => ({ name, value }))
    )

    // Monthly sales (simulated)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    setMonthlyData(
      months.map(month => ({
        month,
        revenue: Math.floor(Math.random() * 50000) + 10000
      }))
    )
  }, [products, orders])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics & Reports
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 4 }}>
        Platform insights and trends
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Products by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Orders by Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Analytics

