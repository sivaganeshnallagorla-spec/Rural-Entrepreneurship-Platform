import React, { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import FormHelperText from '@mui/material/FormHelperText'
import OutlinedInput from '@mui/material/OutlinedInput'
import Divider from '@mui/material/Divider'
import CloudUpload from '@mui/icons-material/CloudUpload'
import Inventory2 from '@mui/icons-material/Inventory2'
import LocalOffer from '@mui/icons-material/LocalOffer'
import VerifiedUser from '@mui/icons-material/VerifiedUser'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProducts } from '../../contexts/ProductContext'
import { useLanguage } from '../../contexts/LanguageContext'
import { useToast } from '../../contexts/ToastContext'

// ─── Indian-specific constants ────────────────────────────────────────────────

/**
 * Indian agricultural product categories aligned with APMC, FSSAI and eNAM.
 */
const INDIAN_CATEGORIES = [
  { value: 'kharif',     label: 'Kharif Crops (खरीफ)' },
  { value: 'rabi',       label: 'Rabi Crops (रबी)' },
  { value: 'spices',     label: 'Spices & Condiments (मसाले)' },
  { value: 'pulses',     label: 'Pulses & Legumes (दलहन)' },
  { value: 'oilseeds',   label: 'Oilseeds (तिलहन)' },
  { value: 'fruits',     label: 'Fruits (फल)' },
  { value: 'vegetables', label: 'Vegetables (सब्जियां)' },
  { value: 'processed',  label: 'Value-Added / Processed' },
  { value: 'organic',    label: 'Organic Produce (जैविक)' },
  { value: 'medicinal',  label: 'Medicinal Herbs & Plants' },
  { value: 'handloom',   label: 'Handloom & Craft' },
]

/**
 * Indian agricultural trading units including traditional measures.
 * MOQ and price are per the selected unit.
 */
const INDIAN_UNITS = [
  { value: 'kg',      label: 'Per kg (किलोग्राम)' },
  { value: 'quintal', label: 'Per Quintal (100 kg)' },
  { value: 'gram',    label: 'Per gram (ग्राम)' },
  { value: 'litre',   label: 'Per Litre (लीटर)' },
  { value: 'dozen',   label: 'Per Dozen (दर्जन)' },
  { value: 'piece',   label: 'Per Piece / नग' },
  { value: 'bundle',  label: 'Per Bundle / गट्ठर' },
]

/**
 * Certifications relevant to Indian agriculture.
 * Multi-select — farmers can hold more than one.
 */
const INDIAN_CERTIFICATIONS = [
  { value: 'fssai',     label: 'FSSAI Registered', desc: 'Food Safety & Standards Authority of India' },
  { value: 'india_organic', label: 'India Organic (NPOP)', desc: 'National Programme for Organic Production' },
  { value: 'pgs_india', label: 'PGS-India Organic', desc: 'Participatory Guarantee System — for small organic farmers' },
  { value: 'apeda',     label: 'APEDA Registered', desc: 'Agricultural & Processed Food Products Export Development Authority' },
  { value: 'gi_tagged', label: 'GI Tagged', desc: 'Geographical Indication — e.g., Alphonso Mango, Darjeeling Tea' },
]

/**
 * Suggested price ranges per category per kg (₹).
 * Used to display a market-trend hint to the farmer.
 */
const SUGGESTED_PRICES = {
  kharif:     { min: 18, max: 45 },
  rabi:       { min: 22, max: 55 },
  spices:     { min: 150, max: 600 },
  pulses:     { min: 55, max: 130 },
  oilseeds:   { min: 70, max: 180 },
  fruits:     { min: 30, max: 200 },
  vegetables: { min: 12, max: 80 },
  processed:  { min: 120, max: 400 },
  organic:    { min: 80, max: 300 },
  medicinal:  { min: 100, max: 500 },
  handloom:   { min: 200, max: 2000 },
}

// ─── Component ────────────────────────────────────────────────────────────────

const AddProduct = () => {
  const { user } = useAuth()
  const { addProduct } = useProducts()
  const { t } = useLanguage()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    moq: '',               // Minimum Order Quantity
    harvestDate: '',       // FSSAI mandatory for packaged food
    bestBefore: '',        // FSSAI mandatory for packaged food
    certifications: [],    // multi-select
    location: user?.location || '',
    image: '',
  })

  const [productImage, setProductImage] = useState(null)
  const [errors, setErrors] = useState({})

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const getSuggestedPrice = () => {
    const range = SUGGESTED_PRICES[formData.category]
    if (!range) return null
    const factor = {
      quintal: 100,
      gram: 0.001,
      litre: 0.92,
      dozen: 0.4,
      piece: 0.3,
      bundle: 2,
    }[formData.unit] || 1
    return { min: Math.round(range.min * factor), max: Math.round(range.max * factor) }
  }

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Product name is required'
    if (!formData.category) errs.category = 'Category is required'
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      errs.price = 'Enter a valid price'
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
      errs.stock = 'Enter valid stock quantity'
    // FSSAI: packaged food (processed / organic / spices) must have harvest & best-before
    const requiresFSSAI = ['processed', 'organic', 'spices'].includes(formData.category)
    if (requiresFSSAI && !formData.harvestDate) errs.harvestDate = 'Required by FSSAI for this category'
    if (requiresFSSAI && !formData.bestBefore) errs.bestBefore = 'Required by FSSAI for this category'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleCertChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({
      ...prev,
      certifications: typeof value === 'string' ? value.split(',') : value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setProductImage(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) {
      showToast('Please fix the highlighted errors before submitting.', 'error')
      return
    }

    const product = {
      ...formData,
      farmerId: user.id,
      farmerName: user.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      moq: formData.moq ? parseInt(formData.moq) : 1,
      available: parseInt(formData.stock) > 0,
      image: productImage || formData.image,
    }

    addProduct(product)
    showToast('Product listed successfully!', 'success')
    navigate('/farmer/products')
  }

  const requiresFSSAI = ['processed', 'organic', 'spices'].includes(formData.category)
  const suggestedPrice = getSuggestedPrice()

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Inventory2 sx={{ color: 'primary.main', fontSize: 32 }} />
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {t('addProduct') || 'List New Product'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill all required fields. FSSAI-mandatory fields are marked for packaged food categories.
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, mt: 1 }} elevation={2}>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>

            {/* ── Section: Basic Info ── */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalOffer fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>Basic Information</Typography>
              </Box>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth required
                label="Product Name (उत्पाद का नाम)"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name || 'Enter the product name clearly (e.g., "Basmati Rice", "Red Chilli Powder")'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category (श्रेणी)</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category (श्रेणी)"
                >
                  {INDIAN_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth required multiline rows={3}
                label="Description (विवरण)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                helperText="Describe variety, quality grade, growing method, region of origin, etc."
              />
            </Grid>

            {/* ── Section: Pricing & Stock ── */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
                <LocalOffer fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>Pricing, Unit & Stock</Typography>
              </Box>
              <Divider />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Unit (इकाई)</InputLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  label="Unit (इकाई)"
                >
                  {INDIAN_UNITS.map((u) => (
                    <MenuItem key={u.value} value={u.value}>
                      {u.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>The unit buyers will order in</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth required
                label={`Price per ${formData.unit} (₹)`}
                name="price"
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
              />
              {suggestedPrice && formData.category && (
                <Alert severity="info" icon={<InfoOutlined fontSize="small" />} sx={{ mt: 1, py: 0.5 }}>
                  Market range: ₹{suggestedPrice.min}–₹{suggestedPrice.max} per {formData.unit}
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth required
                label={`Available Stock (${formData.unit}s)`}
                name="stock"
                type="number"
                inputProps={{ min: 0 }}
                value={formData.stock}
                onChange={handleChange}
                error={!!errors.stock}
                helperText={errors.stock || 'Total quantity available to sell'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={`Minimum Order Quantity — MOQ (${formData.unit}s)`}
                name="moq"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.moq}
                onChange={handleChange}
                helperText="Minimum quantity a buyer must order. Important for bulk buyers, restaurants & exporters."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location / Mandi"
                name="location"
                value={formData.location}
                onChange={handleChange}
                helperText="Village, Taluk, or nearest APMC Mandi (e.g., Nashik Mandi, AP)"
              />
            </Grid>

            {/* ── Section: FSSAI Mandatory Dates ── */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
                <VerifiedUser fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  FSSAI Dates
                  {requiresFSSAI && (
                    <Chip label="Required for this category" color="warning" size="small" sx={{ ml: 1, fontWeight: 600 }} />
                  )}
                </Typography>
              </Box>
              <Divider />
              {requiresFSSAI && (
                <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>
                  <strong>FSSAI Rule 2011</strong> — Packaged food, spices & organic products must display
                  Harvest/Manufacturing date and Best Before/Expiry date as per Food Safety & Standards Act.
                </Alert>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required={requiresFSSAI}
                label="Harvest Date / Manufacturing Date"
                name="harvestDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.harvestDate}
                onChange={handleChange}
                error={!!errors.harvestDate}
                helperText={errors.harvestDate || 'Date of harvest or production (FSSAI mandatory for packaged goods)'}
                inputProps={{ max: new Date().toISOString().split('T')[0] }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required={requiresFSSAI}
                label="Best Before / Expiry Date"
                name="bestBefore"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.bestBefore}
                onChange={handleChange}
                error={!!errors.bestBefore}
                helperText={errors.bestBefore || 'Shelf life end date (FSSAI mandatory for packaged goods)'}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>

            {/* ── Section: Certifications ── */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
                <VerifiedUser fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>Certifications (प्रमाणीकरण)</Typography>
              </Box>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select All Applicable Certifications</InputLabel>
                <Select
                  multiple
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleCertChange}
                  input={<OutlinedInput label="Select All Applicable Certifications" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((val) => {
                        const cert = INDIAN_CERTIFICATIONS.find(c => c.value === val)
                        return <Chip key={val} label={cert?.label || val} size="small" color="primary" variant="outlined" />
                      })}
                    </Box>
                  )}
                >
                  {INDIAN_CERTIFICATIONS.map((cert) => (
                    <MenuItem key={cert.value} value={cert.value}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{cert.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{cert.desc}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Certified products attract premium buyers and exporters. Select all that apply.
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* ── Section: Image ── */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
                <CloudUpload fontSize="small" color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  {t('upload_image') || 'Product Image (उत्पाद की फोटो)'}
                </Typography>
              </Box>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUpload />}
                onClick={() => fileInputRef.current?.click()}
                sx={{ mr: 2, mb: 1 }}
              >
                Choose File
              </Button>
              {productImage && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">Preview:</Typography>
                  <img
                    src={productImage}
                    alt="Product Preview"
                    loading="lazy"
                    style={{ display: 'block', width: '200px', height: 'auto', marginTop: 4, borderRadius: 8 }}
                  />
                </Box>
              )}
              <TextField
                fullWidth
                label="Or paste image URL"
                name="image"
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                helperText="Enter a URL if you don't have a file to upload"
                sx={{ mt: 2 }}
              />
              {formData.image && !formData.image.startsWith('data:') && (
                <img
                  src={formData.image}
                  alt="preview"
                  loading="lazy"
                  style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, marginTop: 8, display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
            </Grid>

            {/* ── Actions ── */}
            <Grid item xs={12}>
              <Box display="flex" gap={2} justifyContent="flex-end" sx={{ pt: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/farmer/products')}
                >
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button type="submit" variant="contained" size="large" sx={{ px: 4 }}>
                  {t('save') || 'List Product'}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  )
}

export default AddProduct
