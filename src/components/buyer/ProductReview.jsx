import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Rating from '@mui/material/Rating'
import CheckCircle from '@mui/icons-material/CheckCircle'
import { useAuth } from '../../contexts/AuthContext'
import { useReviews } from '../../contexts/ReviewContext'
import { useToast } from '../../contexts/ToastContext'

const MAX_COMMENT = 400

const ProductReview = ({ productId, farmerId, onClose }) => {
  const { user } = useAuth()
  const { addReview, hasReviewed } = useReviews()
  const { showToast } = useToast()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!rating) return
    if (hasReviewed(productId, user.id)) {
      showToast('You have already reviewed this product', 'warning')
      onClose()
      return
    }
    addReview({
      productId,
      farmerId,
      buyerId: user.id,
      buyerName: user.name,
      rating,
      comment
    })
    setSubmitted(true)
  }

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        {submitted ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={4} gap={2}>
            <CheckCircle color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h6">Thank you for your review!</Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={3} pt={1}>
            <Box>
              <Typography variant="body2" gutterBottom>Your Rating</Typography>
              <Rating
                value={rating}
                onChange={(_, val) => setRating(val)}
                size="large"
              />
            </Box>
            <TextField
              label="Comment (optional)"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => {
                if (e.target.value.length <= MAX_COMMENT) setComment(e.target.value)
              }}
              helperText={`${comment.length}/${MAX_COMMENT} characters`}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {submitted ? (
          <Button onClick={onClose} variant="contained">Close</Button>
        ) : (
          <>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={!rating}>
              Submit Review
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ProductReview
