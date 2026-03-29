import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Badge,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material'
import { Send, ArrowBack } from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { useMessaging } from '../../contexts/MessagingContext'
import { useSearchParams } from 'react-router-dom'

const Messaging = () => {
  const { user } = useAuth()
  const { getThreads, getThread, sendMessage, markAsRead } = useMessaging()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [search, setSearch] = useState('')
  const [selectedThread, setSelectedThread] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [showList, setShowList] = useState(true)
  const bottomRef = useRef(null)

  const threads = getThreads(user?.id)

  // Auto-open thread from query params (e.g. ?farmerId=X&farmerName=Y)
  useEffect(() => {
    const farmerId = searchParams.get('farmerId')
    const farmerName = searchParams.get('farmerName')
    if (farmerId && user) {
      const existing = getThread(farmerId, user.id)
      if (existing) {
        setSelectedThread(existing)
      } else {
        // Create a virtual thread so the user can start the conversation
        setSelectedThread({
          id: `${farmerId}-${user.id}`,
          farmerId,
          farmerName: farmerName || 'Farmer',
          buyerId: user.id,
          buyerName: user.name,
          messages: []
        })
      }
      if (isMobile) setShowList(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, user?.id])

  // Mark messages as read when thread opens
  useEffect(() => {
    if (selectedThread && user) {
      markAsRead(selectedThread.id, user.id)
    }
  }, [selectedThread, user, markAsRead])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedThread?.messages?.length])

  const getOtherParty = (thread) => {
    if (!user) return ''
    return user.role === 'farmer' ? thread.buyerName : thread.farmerName
  }

  const getUnreadForThread = (thread) => {
    return (thread.messages || []).filter(
      (m) => m.senderId !== user?.id && !m.read
    ).length
  }

  const filteredThreads = threads.filter((t) =>
    getOtherParty(t).toLowerCase().includes(search.toLowerCase())
  )

  const handleSend = () => {
    if (!messageText.trim() || !selectedThread) return
    const farmerId = selectedThread.farmerId
    const buyerInfo = { id: user.role === 'buyer' ? user.id : selectedThread.buyerId, name: user.role === 'buyer' ? user.name : selectedThread.buyerName }
    const farmerInfo = { id: selectedThread.farmerId, name: selectedThread.farmerName }

    // The senderId is the current user
    const overrideBuyerInfo = {
      id: user.id,
      name: user.name
    }
    sendMessage(farmerId, overrideBuyerInfo, farmerInfo, messageText.trim())
    setMessageText('')

    // Refresh selected thread from storage
    setTimeout(() => {
      const updated = getThread(selectedThread.farmerId, selectedThread.buyerId)
      if (updated) setSelectedThread({ ...updated })
    }, 50)
  }

  const handleSelectThread = (thread) => {
    setSelectedThread(thread)
    if (isMobile) setShowList(false)
  }

  const formatTime = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString()
  }

  // Refresh selected thread when threads update
  useEffect(() => {
    if (selectedThread) {
      const latest = threads.find((t) => t.id === selectedThread.id)
      if (latest) setSelectedThread(latest)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads.length, threads.map?.(t => t.messages?.length).join(',')])

  return (
    <Box sx={{ height: 'calc(100vh - 160px)', display: 'flex', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      {/* Thread list panel */}
      {(!isMobile || showList) && (
        <Box sx={{ width: isMobile ? '100%' : '30%', borderRight: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>Messages</Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {filteredThreads.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">No messages yet</Typography>
              </Box>
            ) : (
              filteredThreads.map((thread) => {
                const unread = getUnreadForThread(thread)
                const isSelected = selectedThread?.id === thread.id
                return (
                  <Box
                    key={thread.id}
                    onClick={() => handleSelectThread(thread)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      bgcolor: isSelected ? 'action.selected' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge badgeContent={unread} color="primary" invisible={unread === 0}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                          {getOtherParty(thread)[0]?.toUpperCase()}
                        </Avatar>
                      </Badge>
                      <Box flex={1} minWidth={0}>
                        <Typography
                          variant="body2"
                          fontWeight={unread > 0 ? 'bold' : 'normal'}
                          noWrap
                        >
                          {getOtherParty(thread)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" noWrap>
                          {thread.lastMessage || 'No messages yet'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        {thread.lastTimestamp ? formatDate(thread.lastTimestamp) : ''}
                      </Typography>
                    </Box>
                  </Box>
                )
              })
            )}
          </Box>
        </Box>
      )}

      {/* Chat panel */}
      {(!isMobile || !showList) && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedThread ? (
            <>
              {/* Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                {isMobile && (
                  <IconButton size="small" onClick={() => setShowList(true)}>
                    <ArrowBack />
                  </IconButton>
                )}
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getOtherParty(selectedThread)[0]?.toUpperCase()}
                </Avatar>
                <Typography variant="h6">{getOtherParty(selectedThread)}</Typography>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(selectedThread.messages || []).length === 0 ? (
                  <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
                    <Typography color="textSecondary">Start the conversation!</Typography>
                  </Box>
                ) : (
                  (selectedThread.messages || []).map((msg) => {
                    const isOwn = msg.senderId === user?.id
                    return (
                      <Box key={msg.id} display="flex" justifyContent={isOwn ? 'flex-end' : 'flex-start'}>
                        <Box>
                          <Paper
                            elevation={1}
                            sx={{
                              px: 2,
                              py: 1,
                              maxWidth: 360,
                              borderRadius: 2,
                              bgcolor: isOwn ? 'primary.main' : 'action.hover',
                              color: isOwn ? 'primary.contrastText' : 'text.primary'
                            }}
                          >
                            <Typography variant="body2">{msg.text}</Typography>
                          </Paper>
                          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.25, display: 'block', textAlign: isOwn ? 'right' : 'left' }}>
                            {formatTime(msg.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })
                )}
                <div ref={bottomRef} />
              </Box>

              {/* Input */}
              <Divider />
              <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type a message…"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                />
                <Button variant="contained" onClick={handleSend} disabled={!messageText.trim()} endIcon={<Send />}>
                  Send
                </Button>
              </Box>
            </>
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
              <Typography color="textSecondary">Select a conversation</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default Messaging
