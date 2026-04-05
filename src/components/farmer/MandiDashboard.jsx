import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'

import TrendingUp from '@mui/icons-material/TrendingUp'
import TrendingDown from '@mui/icons-material/TrendingDown'
import Info from '@mui/icons-material/Info'
import CalendarToday from '@mui/icons-material/CalendarToday'
import LocationOn from '@mui/icons-material/LocationOn'

const PRICE_DATA = [
  { item: 'Wheat', mandi: 'Khanna, Punjab', price: 2125, trend: 'up', change: '+₹15' },
  { item: 'Basmati Rice', mandi: 'Karnal, Haryana', price: 3850, trend: 'up', change: '+₹40' },
  { item: 'Cotton', mandi: 'Rajkot, Gujarat', price: 7200, trend: 'down', change: '-₹120' },
  { item: 'Soybean', mandi: 'Indore, MP', price: 5400, trend: 'down', change: '-₹50' },
  { item: 'Turmeric', mandi: 'Erode, TN', price: 8900, trend: 'up', change: '+₹210' },
  { item: 'Potato', mandi: 'Agra, UP', price: 1050, trend: 'up', change: '+₹5' }
]

const MandiDashboard = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: 'primary.main' }}>
            Live Mandi Prices
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Daily market price feed from AGMARKNET and local trade hubs.
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Chip
            icon={<CalendarToday fontSize="small" />}
            label={`Last Updated: ${new Date().toLocaleDateString()}`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Market Highlights */}
        <Grid item xs={12} md={4}>
          <Card className="glass" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6" fontWeight="700">Highest Gainer</Typography>
              </Box>
              <Typography variant="h3" fontWeight="800" color="primary">Turmeric</Typography>
              <Typography variant="h5" color="success.main" fontWeight="600">+2.4% (₹8,900)</Typography>
              <Typography variant="caption" color="textSecondary">Erode Mandi, Tamil Nadu</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="glass" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Info color="info" />
                <Typography variant="h6" fontWeight="700">Market Sentiment</Typography>
              </Box>
              <Typography variant="h4" fontWeight="700" color="info.main">BULLISH</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>Wheat & Rice demand up</Typography>
                <LinearProgress variant="determinate" value={70} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card className="glass" sx={{ height: '100%', borderRadius: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn color="error" />
                <Typography variant="h6" fontWeight="700">Regional Alerts</Typography>
              </Box>
              <Typography variant="body1" color="error.main" fontWeight="600">Heavy rain in Gujarat</Typography>
              <Typography variant="body2" color="textSecondary">Expected impact on Cotton harvests in next 48 hours.</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Price Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper} className="glass" sx={{ borderRadius: 4, overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="700">Commodity</Typography></TableCell>
                  <TableCell><Typography fontWeight="700">Primary Mandi</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="700">Current Price (per Qtl)</Typography></TableCell>
                  <TableCell align="center"><Typography fontWeight="700">Trend</Typography></TableCell>
                  <TableCell align="right"><Typography fontWeight="700">Change</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {PRICE_DATA.map((row) => (
                  <TableRow key={row.item} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.item}</TableCell>
                    <TableCell>{row.mandi}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>₹{row.price.toLocaleString()}</TableCell>
                    <TableCell align="center">
                      {row.trend === 'up' ?
                        <TrendingUp sx={{ color: 'success.main' }} /> :
                        <TrendingDown sx={{ color: 'error.main' }} />
                      }
                    </TableCell>
                    <TableCell align="right">
                      <Typography color={row.trend === 'up' ? 'success.main' : 'error.main'} fontWeight="600">
                        {row.change}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default MandiDashboard
