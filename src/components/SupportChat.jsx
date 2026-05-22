import React, { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Avatar from '@mui/material/Avatar'
import Fade from '@mui/material/Fade'
import InputAdornment from '@mui/material/InputAdornment'
import ChatIcon from '@mui/icons-material/Chat'
import Close from '@mui/icons-material/Close'
import Send from '@mui/icons-material/Send'
import SmartToy from '@mui/icons-material/SmartToy'

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Rural Entrepreneurship Assistant. How can I help you today?", isBot: true }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = { text: inputValue, isBot: false }
    const currentInput = inputValue
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    setIsLoading(true)
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are a helpful support assistant for KisanMart, a rural entrepreneurship platform for Indian farmers and buyers. Answer concisely in 1-2 sentences. User question: ${currentInput}`
            }
          ]
        })
      })
      const data = await response.json()
      const botText = data.content?.[0]?.text || "I'm here to help! Please try again."
      setMessages(prev => [...prev, { text: botText, isBot: true }])
    } catch {
      setMessages(prev => [...prev, { text: "I'm having trouble connecting. Please try again shortly.", isBot: true }])
    } finally {
      setIsLoading(false)
    }
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
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" size="small" onClick={handleSend} disabled={isLoading}>
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
