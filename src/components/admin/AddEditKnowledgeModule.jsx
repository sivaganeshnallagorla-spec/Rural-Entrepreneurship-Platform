import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  IconButton
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { useKnowledge } from '../../contexts/KnowledgeContext'

// Available icon options
const ICON_OPTIONS = [
  { value: 'LocalFlorist', label: 'Local Florist' },
  { value: 'Inventory', label: 'Inventory' },
  { value: 'Business', label: 'Business' },
  { value: 'Public', label: 'Public' },
  { value: 'AccountBalance', label: 'Account Balance' },
  { value: 'Description', label: 'Description' },
  { value: 'School', label: 'School' }
]

const AddEditKnowledgeModule = ({ open, onClose, mode, item }) => {
  const {
    categories,
    addCategory,
    updateCategory,
    addResource,
    updateResource
  } = useKnowledge()

  const isEdit = !!item && (mode === 'category' ? item.id : item.id)
  const isCategory = mode === 'category'

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    iconName: 'Description',
    color: '#795548'
  })

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    type: 'article',
    content: '',
    url: '',
    topics: [],
    categoryId: ''
  })
  const [topicInput, setTopicInput] = useState('')

  useEffect(() => {
    if (isCategory) {
      if (item) {
        setCategoryForm({
          name: item.name || '',
          iconName: item.iconName || 'Description',
          color: item.color || '#795548'
        })
      } else {
        setCategoryForm({
          name: '',
          iconName: 'Description',
          color: '#795548'
        })
      }
    } else {
      if (item) {
        setResourceForm({
          title: item.title || '',
          type: item.type || 'article',
          content: item.content || '',
          url: item.url || '',
          topics: item.topics || [],
          categoryId: item.categoryId || ''
        })
      } else {
        setResourceForm({
          title: '',
          type: 'article',
          content: '',
          url: '',
          topics: [],
          categoryId: item?.categoryId || ''
        })
      }
      setTopicInput('')
    }
  }, [item, mode, isCategory])

  const handleCategoryChange = (field, value) => {
    setCategoryForm(prev => ({ ...prev, [field]: value }))
  }

  const handleResourceChange = (field, value) => {
    setResourceForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTopic = () => {
    if (topicInput.trim()) {
      setResourceForm(prev => ({
        ...prev,
        topics: [...prev.topics, topicInput.trim()]
      }))
      setTopicInput('')
    }
  }

  const handleRemoveTopic = (index) => {
    setResourceForm(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = () => {
    if (isCategory) {
      if (isEdit) {
        updateCategory(item.id, categoryForm)
      } else {
        addCategory(categoryForm)
      }
    } else {
      if (isEdit) {
        updateResource(resourceForm.categoryId, item.id, {
          title: resourceForm.title,
          type: resourceForm.type,
          content: resourceForm.content,
          url: resourceForm.url,
          topics: resourceForm.topics
        })
      } else {
        addResource(resourceForm.categoryId, {
          title: resourceForm.title,
          type: resourceForm.type,
          content: resourceForm.content,
          url: resourceForm.url,
          topics: resourceForm.topics
        })
      }
    }
    onClose()
  }

  const isCategoryFormValid = categoryForm.name.trim() !== ''
  const isResourceFormValid =
    resourceForm.title.trim() !== '' &&
    resourceForm.categoryId !== '' &&
    resourceForm.topics.length > 0 &&
    (resourceForm.content.trim() !== '' || resourceForm.url.trim() !== '')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? 'Edit' : 'Add'} {isCategory ? 'Category' : 'Resource'}
      </DialogTitle>
      <DialogContent>
        {isCategory ? (
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category Name"
                  value={categoryForm.name}
                  onChange={(e) => handleCategoryChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Icon</InputLabel>
                  <Select
                    value={categoryForm.iconName}
                    label="Icon"
                    onChange={(e) => handleCategoryChange('iconName', e.target.value)}
                  >
                    {ICON_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => handleCategoryChange('color', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={resourceForm.categoryId}
                    label="Category"
                    onChange={(e) => handleResourceChange('categoryId', e.target.value)}
                    required
                    disabled={isEdit}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={resourceForm.title}
                  onChange={(e) => handleResourceChange('title', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={resourceForm.type}
                    label="Type"
                    onChange={(e) => handleResourceChange('type', e.target.value)}
                  >
                    <MenuItem value="article">Article</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL (YouTube, Blog, Article, etc.)"
                  value={resourceForm.url}
                  onChange={(e) => handleResourceChange('url', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://example.com/article"
                  helperText="Add a link to external content (YouTube videos, blog posts, articles, etc.)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description/Content"
                  value={resourceForm.content}
                  onChange={(e) => handleResourceChange('content', e.target.value)}
                  multiline
                  rows={4}
                  helperText="Description of the resource (optional if URL is provided)"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Topics
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  {resourceForm.topics.map((topic, index) => (
                    <Chip
                      key={index}
                      label={topic}
                      onDelete={() => handleRemoveTopic(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add topic"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTopic()
                      }
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton color="primary" onClick={handleAddTopic}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                  Press Enter or click + to add a topic
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCategory ? !isCategoryFormValid : !isResourceFormValid}
        >
          {isEdit ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditKnowledgeModule

