import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Divider from '@mui/material/Divider'
import Search from '@mui/icons-material/Search'
import Edit from '@mui/icons-material/Edit'
import Delete from '@mui/icons-material/Delete'
import Add from '@mui/icons-material/Add'
import School from '@mui/icons-material/School'
import LocalFlorist from '@mui/icons-material/LocalFlorist'
import Inventory from '@mui/icons-material/Inventory'
import AccountBalance from '@mui/icons-material/AccountBalance'
import Business from '@mui/icons-material/Business'
import Public from '@mui/icons-material/Public'
import Description from '@mui/icons-material/Description'
import LinkIcon from '@mui/icons-material/Link'
import OpenInNew from '@mui/icons-material/OpenInNew'
import { useKnowledge } from '../../contexts/KnowledgeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import AddEditKnowledgeModule from './AddEditKnowledgeModule'

// Icon mapping
const iconMap = {
  LocalFlorist: LocalFlorist,
  Inventory: Inventory,
  Business: Business,
  Public: Public,
  AccountBalance: AccountBalance,
  Description: Description,
  School: School
}

const KnowledgeManagement = () => {
  const {
    categories,
    resources,
    deleteCategory,
    deleteResource,
    getResourcesByCategory
  } = useKnowledge()
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(null) // 'category' or 'resource'
  const [editItem, setEditItem] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleEditCategory = (category) => {
    setEditMode('category')
    setEditItem(category)
    setEditDialogOpen(true)
  }

  const handleEditResource = (categoryId, resource) => {
    setEditMode('resource')
    setEditItem({ ...resource, categoryId })
    setEditDialogOpen(true)
  }

  const handleAddCategory = () => {
    setEditMode('category')
    setEditItem(null)
    setEditDialogOpen(true)
  }

  const handleAddResource = (categoryId) => {
    setEditMode('resource')
    setEditItem({ categoryId })
    setEditDialogOpen(true)
  }

  const handleDeleteCategory = (category) => {
    setItemToDelete({ type: 'category', item: category })
    setDeleteDialogOpen(true)
  }

  const handleDeleteResource = (categoryId, resource) => {
    setItemToDelete({ type: 'resource', item: resource, categoryId })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete.type === 'category') {
      deleteCategory(itemToDelete.item.id)
    } else {
      deleteResource(itemToDelete.categoryId, itemToDelete.item.id)
    }
    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || Description
    return <IconComponent />
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Skill Center Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage categories and learning resources for the Skill Center
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All Categories" />
        {filteredCategories.map((category) => (
          <Tab key={category.id} label={category.name} />
        ))}
      </Tabs>

      {activeTab === 0 ? (
        <Grid container spacing={3}>
          {filteredCategories.map((category) => {
            const categoryResources = getResourcesByCategory(category.id)
            return (
              <Grid item xs={12} md={6} lg={4} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: `4px solid ${category.color}`
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: category.color }}>
                          {getIconComponent(category.iconName)}
                        </Box>
                        <Typography variant="h6">{category.name}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {categoryResources.length} resource{categoryResources.length !== 1 ? 's' : ''}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Chip
                        label={category.iconName}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={categoryResources.length} 
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => handleAddResource(category.id)}
                    >
                      Add Resource
                    </Button>
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <Box>
          {filteredCategories[activeTab - 1] && (() => {
            const category = filteredCategories[activeTab - 1]
            const categoryResources = getResourcesByCategory(category.id)
            return (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">
                    {category.name} Resources
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => handleAddResource(category.id)}
                  >
                    Add Resource
                  </Button>
                </Box>
                <Grid container spacing={3}>
                  {categoryResources.map((resource) => (
                    <Grid item xs={12} md={6} key={resource.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Box>
                              <Chip
                                label={resource.type === 'video' ? 'Video' : 'Article'}
                                size="small"
                                color={resource.type === 'video' ? 'primary' : 'default'}
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="h6" gutterBottom>
                                {resource.title}
                              </Typography>
                              {resource.content && (
                                <Typography variant="body2" color="textSecondary" paragraph>
                                  {resource.content}
                                </Typography>
                              )}
                              {resource.url && (
                                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LinkIcon fontSize="small" color="primary" />
                                  <Typography 
                                    variant="caption" 
                                    color="primary" 
                                    sx={{ 
                                      wordBreak: 'break-all',
                                      textDecoration: 'underline',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                                  >
                                    {resource.url.length > 60 ? `${resource.url.substring(0, 60)}...` : resource.url}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {resource.topics?.map((topic, idx) => (
                              <Chip
                                key={idx}
                                label={topic}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </CardContent>
                        <CardActions>
                          {resource.url && (
                            <Button
                              size="small"
                              startIcon={<OpenInNew />}
                              onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                            >
                              Open Link
                            </Button>
                          )}
                          <Button
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEditResource(category.id, resource)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteResource(category.id, resource)}
                          >
                            Delete
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                  {categoryResources.length === 0 && (
                    <Grid item xs={12}>
                      <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                          No resources in this category yet. Click "Add Resource" to get started.
                        </Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )
          })()}
        </Box>
      )}

      {/* Edit/Add Dialog */}
      <AddEditKnowledgeModule
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setEditItem(null)
          setEditMode(null)
        }}
        mode={editMode}
        item={editItem}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>
              {itemToDelete?.type === 'category'
                ? itemToDelete.item.name
                : itemToDelete?.item.title}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default KnowledgeManagement

