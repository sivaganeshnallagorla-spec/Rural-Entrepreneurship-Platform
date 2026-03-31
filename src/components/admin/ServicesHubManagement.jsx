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
  Tooltip,
  Rating
} from '@mui/material'
import {
  Edit,
  Delete,
  Add,
  Search,
  Person,
  Star,
  FmdGood,
  Call,
  Verified,
  Work,
  Gavel,
  History,
  MoreVert
} from '@mui/icons-material'

const ServicesHubManagement = () => {
  const [search, setSearch] = useState('')
  
  // Demo data for services hub providers
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: 'SafeTrack Logistics',
      category: 'Cold Storage & Transport',
      location: 'Pune District',
      rating: 4.8,
      status: 'verified',
      contact: '+91 91234 56789',
      activeJobs: 12,
      joinedDate: 'Jan 2024'
    },
    {
      id: 2,
      name: 'Precision Lab Services',
      category: 'Soil & Produce Testing',
      location: 'Mumbai Suburbs',
      rating: 4.5,
      status: 'verified',
      contact: '+91 92234 56780',
      activeJobs: 5,
      joinedDate: 'Mar 2024'
    },
    {
      id: 3,
      name: 'Rural Skill Development FPO',
      category: 'Marketing & Skills',
      location: 'Nagpur Region',
      rating: 4.2,
      status: 'pending',
      contact: '+91 93234 56781',
      activeJobs: 0,
      joinedDate: 'Apr 2024'
    },
    {
      id: 4,
      name: 'AgroPro Drone Solutions',
      category: 'DaaS & Surveillance',
      location: 'Nashik Cluster',
      rating: 4.9,
      status: 'verified',
      contact: '+91 94234 56782',
      activeJobs: 24,
      joinedDate: 'Feb 2024'
    }
  ])

  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success'
      case 'pending': return 'warning'
      case 'suspended': return 'error'
      default: return 'default'
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', mb: 1 }}>
            Services Hub Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Review and manage all service providers including Logistics, Testing, and Consulting.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search service providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              sx: { borderRadius: 2, bgcolor: 'white' }
            }}
          />
          <Button variant="outlined" startIcon={<History />} sx={{ borderRadius: 2 }}>Audit Logs</Button>
          <Button variant="contained" startIcon={<Add />} sx={{ borderRadius: 2 }}>New Provider Profile</Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--glass-border)', borderRadius: 4, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>Provider Profile</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category & Location</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Performance</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Verification Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Active Projects</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Compliance Controls</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProviders.map((provider) => (
              <TableRow key={provider.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main', fontSize: '0.8rem', fontWeight: 800 }}>{provider.name[0]}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="800" sx={{ lineHeight: 1.1, mb: 0.5 }}>{provider.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.7 }}>
                        <Call sx={{ fontSize: '0.65rem' }} />
                        <Typography variant="caption">{provider.contact}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Work sx={{ fontSize: '0.85rem', color: 'primary.main' }} />
                      <Typography variant="caption" fontWeight="600">{provider.category}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FmdGood sx={{ fontSize: '0.85rem', color: 'error.main' }} />
                      <Typography variant="caption" color="textSecondary">{provider.location}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Rating value={provider.rating} readOnly size="small" precision={0.1} />
                    <Typography variant="caption" fontWeight="700">({provider.rating})</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={provider.status.toUpperCase()}
                    color={getStatusColor(provider.status)}
                    size="small"
                    variant={provider.status === 'verified' ? 'filled' : 'outlined'}
                    icon={provider.status === 'verified' ? <Verified sx={{ fontSize: '0.8rem !important' }} /> : <Gavel sx={{ fontSize: '0.8rem !important' }} />}
                    sx={{ fontWeight: 900, fontSize: '0.65rem' }}
                  />
                </TableCell>
                <TableCell>
                   <Typography variant="h6" fontWeight="900" color="primary.main">{provider.activeJobs}</Typography>
                   <Typography variant="caption" color="textSecondary">Live Tasks</Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title={provider.status === 'verified' ? "Monitor Compliance" : "Complete KYC Verification"}>
                    <Button 
                      size="small" 
                      variant={provider.status === 'verified' ? "outlined" : "contained"} 
                      color={provider.status === 'verified' ? "primary" : "warning"}
                      sx={{ borderRadius: 1.5, fontWeight: 700, fontSize: '0.7rem', mr: 1 }}
                    >
                      {provider.status === 'verified' ? "Compliance" : "Verify Profile"}
                    </Button>
                  </Tooltip>
                  <IconButton size="small"><MoreVert sx={{ fontSize: '1rem' }} /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ServicesHubManagement
