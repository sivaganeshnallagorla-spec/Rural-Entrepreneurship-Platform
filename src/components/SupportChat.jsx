import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  Avatar,
  Fade,
  InputAdornment
} from '@mui/material'
import {
  Chat as ChatIcon,
  Close,
  Send,
  SmartToy
} from '@mui/icons-material'

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Rural Entrepreneurship Assistant. How can I help you today?", isBot: true }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage = { text: inputValue, isBot: false }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Mock bot response
    setTimeout(() => {
      let botText = "That's a great question! Let me check that for you."
      if (inputValue.toLowerCase().includes('order')) botText = "You can track your orders in the 'Orders' section of your dashboard."
      if (inputValue.toLowerCase().includes('price')) botText = "Mandi prices are updated daily in the 'Mandi Price Feed' on the Farmer Dashboard."
      if (inputValue.toLowerCase().includes('drone')) botText = "You can book drone operators via the 'Drone Marketplace' section."
      
      setMessages(prev => [...prev, { text: botText, isBot: true }])
    }, 1000)
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="support"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          boxShadow: '0 8px 32px rgba(46, 125, 50, 0.4)',
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.1) rotate(5deg)' }
        }}
      >
        {isOpen ? <Close /> : <ChatIcon />}
      </Fab>

      <Fade in={isOpen}>
        <Paper
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 320,
            height: 450,
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 32, height: 32 }}>
              <SmartToy fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="700">AI Support</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Online • Ready to help</Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {messages.map((msg, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.isBot ? 'flex-start' : 'flex-end',
                    p: 0
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '85%',
                      p: 1.5,
                      px: 2,
                      borderRadius: 3,
                      borderBottomLeftRadius: msg.isBot ? 0 : 3,
                      borderBottomRightRadius: msg.isBot ? 3 : 0,
                      bgcolor: msg.isBot ? 'white' : 'primary.main',
                      color: msg.isBot ? 'text.primary' : 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: msg.isBot ? '1px solid #eee' : 'none'
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Footer */}
          <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" size="small" onClick={handleSend}>
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3 }
              }}
            />
          </Box>
        </Paper>
      </Fade>
    </>
  )
}

export default SupportChat
