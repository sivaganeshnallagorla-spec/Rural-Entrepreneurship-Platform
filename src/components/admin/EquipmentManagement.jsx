import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material'
import {
  Edit,
  Delete,
  Add,
  Search,
  Inventory,
  SettingsSuggest,
  Visibility,
  CheckCircle,
  Warning
} from '@mui/icons-material'

const EquipmentManagement = () => {
  const [search, setSearch] = useState('')
  
  // Demo data for equipment
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Tractor Model X-2000',
      category: 'Tractor',
      price: 1500000,
      stock: 5,
      status: 'active',
      manufacturer: 'Mahindra Tech',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Seed Drill Pro Max',
      category: 'Planting',
      price: 85000,
      stock: 12,
      status: 'active',
      manufacturer: 'AgroTools Inc',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Rice Mill 500S',
      category: 'Processing',
      price: 250000,
      stock: 3,
      status: 'low_stock',
      manufacturer: 'Rural Engineering',
      rating: 4.9
    },
    {
      id: 4,
      name: 'Solar Pump 5HP',
      category: 'Irrigation',
      price: 120000,
      stock: 0,
      status: 'out_of_stock',
      manufacturer: 'SunEnergy Agri',
      rating: 4.2
    }
  ])

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'low_stock': return 'warning'
      case 'out_of_stock': return 'error'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', mb: 1 }}>
            Equipment Marketplace Inventory
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage machinery listings, stock levels, and manufacturer relationships.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              sx: { borderRadius: 2, bgcolor: 'white' }
            }}
          />
          <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2 }}>Add Equipment</Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--glass-border)', borderRadius: 4, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Product Model</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Manufacturer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Stock Level</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Inventory Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Inventory Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(46, 125, 50, 0.1)', color: 'primary.main' }}>
                      <Inventory fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700">{item.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{item.category}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600">{item.manufacturer}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="800">₹{item.price.toLocaleString()}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="700">{item.stock}</Typography>
                    <Typography variant="caption" color="textSecondary">units</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.status.replace('_', ' ').toUpperCase()}
                    color={getStatusColor(item.status)}
                    size="small"
                    icon={item.status === 'active' ? <CheckCircle sx={{ fontSize: '0.8rem !important' }} /> : <Warning sx={{ fontSize: '0.8rem !important' }} />}
                    sx={{ fontWeight: 900, fontSize: '0.65rem' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="View Public Listing">
                    <IconButton size="small" sx={{ mr: 1 }}><Visibility fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Specifications">
                    <IconButton size="small" color="primary" sx={{ mr: 1 }}><Edit fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Item">
                    <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default EquipmentManagement
