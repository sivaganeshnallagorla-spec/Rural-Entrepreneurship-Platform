import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const StatCard = ({ title, value, icon, color }) => (
  <Card className="glass" sx={{ border: `1px solid ${color}33`, position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ 
      position: 'absolute', 
      top: -10, 
      right: -10, 
      opacity: 0.1, 
      fontSize: 100, 
      color: color,
      transform: 'rotate(15deg)'
    }}>
      {icon}
    </Box>
    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="800" sx={{ color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
        <Box sx={{ 
          color, 
          fontSize: 40, 
          bgcolor: `${color}15`, 
          p: 1.5, 
          borderRadius: 3, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: `0 8px 16px ${color}20`
        }}>
          {React.cloneElement(icon, { fontSize: 'inherit' })}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

export default StatCard
