import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleReset = this.handleReset.bind(this)
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset() {
    localStorage.clear()
    window.location.href = '/login'
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          gap={2}
          px={4}
        >
          <Typography variant="h5">Something went wrong</Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            {this.state.error?.message}
          </Typography>
          <Button variant="contained" color="error" onClick={this.handleReset}>
            Clear app data and restart
          </Button>
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
