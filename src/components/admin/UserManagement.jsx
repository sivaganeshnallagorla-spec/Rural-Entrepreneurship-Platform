import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Edit from '@mui/icons-material/Edit'
import Block from '@mui/icons-material/Block'
import CheckCircle from '@mui/icons-material/CheckCircle'
import Search from '@mui/icons-material/Search'
import PersonAdd from '@mui/icons-material/PersonAdd'
import FilterList from '@mui/icons-material/FilterList'
import ContactPhone from '@mui/icons-material/ContactPhone'
import Mail from '@mui/icons-material/Mail'
import FmdGood from '@mui/icons-material/FmdGood'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const UserManagement = () => {
  const { predefinedUsers } = useAuth()
  const { t } = useLanguage()
  const [users] = useState(predefinedUsers || [])
  const [search, setSearch] = useState('')

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'error'
      case 'farmer': return 'success'
      case 'buyer': return 'info'
      case 'drone': return 'secondary'
      default: return 'default'
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1.5px', mb: 1 }}>
            User Accounts
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Review and manage platform roles, permissions, and account statuses.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              sx: { borderRadius: 2, bgcolor: 'white' }
            }}
          />
          <Button variant="outlined" startIcon={<FilterList />} sx={{ borderRadius: 2 }}>Filters</Button>
          <Button variant="contained" startIcon={<PersonAdd />} sx={{ borderRadius: 2 }}>Create Account</Button>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid var(--glass-border)', borderRadius: 4, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, py: 2 }}>User Identity</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact Details</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Platform Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Account Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Management</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 800 }}>
                      {user.name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700">{user.name}</Typography>
                      <Typography variant="caption" color="textSecondary">@{user.username}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Mail sx={{ fontSize: '0.85rem', opacity: 0.5 }} />
                      <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ContactPhone sx={{ fontSize: '0.85rem', opacity: 0.5 }} />
                      <Typography variant="caption" color="textSecondary">+91 9876543210</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role?.toUpperCase()}
                    color={getRoleColor(user.role)}
                    size="small"
                    sx={{ fontWeight: 900, fontSize: '0.65rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FmdGood sx={{ fontSize: '1rem', color: 'error.light' }} />
                    <Typography variant="body2">{user.location || 'Maharashtra, India'}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label="VERIFIED"
                    color="success"
                    variant="outlined"
                    size="small"
                    icon={<CheckCircle sx={{ fontSize: '1rem !important' }} />}
                    sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Permissions">
                    <IconButton size="small" sx={{ mr: 1, color: 'primary.main' }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Suspend Account">
                    <IconButton size="small" color="error">
                      <Block fontSize="small" />
                    </IconButton>
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

export default UserManagement
