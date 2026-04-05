import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Notifications from '@mui/icons-material/Notifications'
import Delete from '@mui/icons-material/Delete'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useLanguage } from '../contexts/LanguageContext'

const NotificationsComponent = () => {
  const { user } = useAuth()
  const {
    getNotificationsByUser,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications()
  const { t } = useLanguage()
  const notifications = getNotificationsByUser(user?.id)

  const unreadNotifications = notifications.filter(n => !n.read)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <CheckCircle color="primary" />
      default:
        return <Notifications color="action" />
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Notifications
        </Typography>
        {unreadNotifications.length > 0 && (
          <Chip
            label={`${unreadNotifications.length} unread`}
            color="primary"
            onDelete={markAllAsRead}
            deleteIcon={<CheckCircle />}
          />
        )}
      </Box>

      {notifications.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No notifications
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'transparent' : '#f5f5f5',
                    '&:hover': { bgcolor: '#e0e0e0' }
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                  <Box>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => markAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteNotification(notification.id)}
                      title="Delete"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  )
}

export default NotificationsComponent

