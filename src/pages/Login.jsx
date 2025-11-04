import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent
} from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { useLanguage } from '../contexts/LanguageContext'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    const result = login(username, password)
    
    if (result.success) {
      showToast('Login successful', 'success')
      const role = result.user.role
      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'farmer') {
        navigate('/farmer')
      } else if (role === 'buyer') {
        navigate('/buyer')
      }
    } else {
      setError(result.error)
      showToast(result.error, 'error')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            🌾 Rural Entrepreneurship Platform
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary">
            Empowering Farmers, Connecting Markets
          </Typography>

          <Box sx={{ mt: 4, mb: 3 }}>
            <Card variant="outlined" sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Predefined Credentials:
                </Typography>
                <Typography variant="body2" component="div">
                  <strong>Admin:</strong> admin / admin123<br />
                  <strong>Farmer:</strong> farmer / farmer123<br />
                  <strong>Buyer:</strong> buyer / buyer123
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label={t('username')}
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label={t('password')}
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {t('login')}
            </Button>
          </form>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Sign up here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login

