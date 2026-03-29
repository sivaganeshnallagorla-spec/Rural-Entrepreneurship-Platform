You are working on a React 18 + MUI 5 + Vite frontend project called 
"Rural Entrepreneurship Platform". The project is already cloned and 
running. The full source is at the root. Below is a complete list of 
everything that needs to be fixed, modified, and implemented. Work 
through each item in order. Do not skip any item.

════════════════════════════════════════════════════════════
TECH STACK (do not change these)
════════════════════════════════════════════════════════════
- React 18, React Router 6, MUI v5
- Context API + localStorage (no backend, no Redux)
- Vite build tool
- Recharts for charts
- qrcode.react for QR codes
- jsPDF + jspdf-autotable for invoices
- No TypeScript — plain .jsx/.js only

════════════════════════════════════════════════════════════
SECTION 1 — SECURITY FIXES
════════════════════════════════════════════════════════════

TASK 1.1 — Hash passwords before storing in localStorage
File: src/contexts/AuthContext.jsx

The register() function currently stores { password: formData.password }
as plain text in localStorage key 'registeredUsers'. Fix this:

1. Create a helper function hashPassword(plaintext) that uses the Web
   Crypto API to return a hex SHA-256 hash:

   async function hashPassword(plaintext) {
     const encoder = new TextEncoder();
     const data = encoder.encode(plaintext);
     const hashBuffer = await crypto.subtle.digest('SHA-256', data);
     const hashArray = Array.from(new Uint8Array(hashBuffer));
     return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   }

2. In register(), make it async. Before saving, hash the password:
   const passwordHash = await hashPassword(formData.password);
   Store passwordHash instead of password in the newUser object.
   Do NOT store the plain password at all.

3. In login(), when checking registeredUsers, hash the input password
   before comparing:
   const inputHash = await hashPassword(password);
   Match against u.passwordHash instead of u.password.

4. The PREDEFINED_USERS array stays as-is (plain text is acceptable for
   hardcoded demo credentials — just document it with a comment).

TASK 1.2 — Add .env.example file
Create a file called .env.example in the project root with:

   # Copy to .env and fill in values
   VITE_API_BASE_URL=http://localhost:8000/api

Also update README.md to include a "Setup" step: "Copy .env.example 
to .env before running npm run dev."

════════════════════════════════════════════════════════════
SECTION 2 — BUG FIXES IN EXISTING CODE
════════════════════════════════════════════════════════════

TASK 2.1 — Fix broken default product images
File: src/contexts/ProductContext.jsx

Replace the three broken /api/placeholder/400/300 image URLs with real
working Unsplash URLs:

  product p2 (Handmade Jaggery):
    image: 'https://images.unsplash.com/photo-1607920592519-bab4a0618ee2?auto=format&fit=crop&w=400&q=80'

  product p3 (Turmeric Powder):
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80'

  product p4 (Cotton Bags):
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80'

TASK 2.2 — Fix Cart checkout: assign farmerId and add payment step
File: src/components/buyer/Cart.jsx

PROBLEM: handleCheckout() creates an order with no farmerId, so farmers
never see these orders in FarmerOrders (which filters by o.farmerId).
Also: no payment method or shipping selection.

FIX — Rewrite the Cart component:

1. Add local state:
   const [step, setStep] = useState('cart'); // 'cart' | 'checkout'
   const [selectedPayment, setSelectedPayment] = useState('upi');
   const [selectedShipping, setSelectedShipping] = useState('standard');

2. Import PaymentMethods from '../PaymentMethods'
   Import { getShippingMethods } from '../../utils/shippingCalculator'

3. When the user clicks "Proceed to Checkout", set step to 'checkout'
   and show a second screen inside the same Dialog with:
   - A shipping method selector (radio group) using getShippingMethods()
     to get the list. Show name, estimated days, and cost for each.
   - The <PaymentMethods> component for payment selection.
   - A "Place Order" button that calls handleCheckout().
   - A "Back" button that sets step back to 'cart'.

4. In handleCheckout(), group cart items by farmerId and create one
   order per unique farmer:

   const farmerGroups = {};
   cart.forEach(item => {
     const fid = item.farmerId || 'unknown';
     if (!farmerGroups[fid]) farmerGroups[fid] = [];
     farmerGroups[fid].push(item);
   });

   Object.entries(farmerGroups).forEach(([farmerId, items]) => {
     const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
     createOrder({
       buyerId: user.id,
       buyerName: user.name,
       farmerId,
       items,
       total: subtotal + shippingCost,
       shippingMethod: selectedShipping,
       paymentMethod: selectedPayment,
       status: 'pending'
     });
   });

   Call clearCart() and onClose() after.

5. Show the total including shipping cost in the summary.

TASK 2.3 — Fix AdminOverview: count registered users dynamically
File: src/components/admin/AdminOverview.jsx

Replace the hardcoded:
   const totalUsers = 5 // Predefined users

With:
   const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
   const totalUsers = 6 + registeredUsers.length;
   // 6 = admin + farmer + farmer2 + buyer + buyer2 + drone operator

TASK 2.4 — Extract shared StatCard component
Currently StatCard is copy-pasted inside FarmerOverview, BuyerOverview,
and AdminOverview.

1. Create src/components/shared/StatCard.jsx:

   import React from 'react'
   import { Card, CardContent, Box, Typography } from '@mui/material'

   const StatCard = ({ title, value, icon, color }) => (
     <Card>
       <CardContent>
         <Box display="flex" justifyContent="space-between" alignItems="center">
           <Box>
             <Typography color="textSecondary" gutterBottom variant="body2">
               {title}
             </Typography>
             <Typography variant="h4">{value}</Typography>
           </Box>
           <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
         </Box>
       </CardContent>
     </Card>
   )

   export default StatCard

2. Remove the local StatCard definition from FarmerOverview.jsx,
   BuyerOverview.jsx, and AdminOverview.jsx and import from
   '../../components/shared/StatCard' (or '../shared/StatCard').

TASK 2.5 — Complete StageService: add content for stages 4–11
File: src/components/farmer/StageService.jsx

Add the following entries to the stageContent object so stages 4–11
no longer fall through to "Feature coming soon":

  stage4: {
    title: 'Crop Monitoring',
    desc: 'Monitor crop health, detect pests early, and track growth stages.',
    actions: ['Book Drone Survey', 'View Soil Health Report', 'Log Observation'],
    resources: ['Pest Identification Guide', 'Growth Stage Calendar', 'Drone Imagery Samples']
  },
  stage5: {
    title: 'Harvesting',
    desc: 'Plan optimal harvest timing and choose the right harvesting methods.',
    actions: ['Check Market Price', 'Schedule Labour', 'Log Harvest Data'],
    resources: ['Harvest Readiness Checklist', 'Post-Harvest Loss Reduction Tips']
  },
  stage6: {
    title: 'Post-Harvest Handling',
    desc: 'Reduce losses with proper grading, cleaning, and sorting techniques.',
    actions: ['Download Grading Standards', 'Find Processing Unit'],
    resources: ['FSSAI Food Safety Guidelines', 'Grading & Sorting Video']
  },
  stage7: {
    title: 'Storage',
    desc: 'Use zero-energy cool chambers and proper storage to extend shelf life.',
    actions: ['Find Nearby Cold Storage', 'Calculate Storage Cost'],
    resources: ['Zero-Energy Cool Chamber Guide', 'Warehouse Receipt Scheme Info']
  },
  stage8: {
    title: 'Processing & Value Addition',
    desc: 'Transform raw crops into value-added products to multiply income.',
    actions: ['Explore Processing Recipes', 'Find Equipment Suppliers'],
    resources: ['Value Addition Handbook', 'FSSAI License Process', 'Packaging Guidelines']
  },
  stage9: {
    title: 'Packaging & Branding',
    desc: 'Design attractive packaging and build a brand that buyers trust.',
    actions: ['Generate QR Label', 'Browse Packaging Suppliers'],
    resources: ['Branding for Rural Entrepreneurs', 'Label Design Templates', 'Eco-Packaging Options']
  },
  stage10: {
    title: 'Market Linkage',
    desc: 'Connect directly with buyers, exporters, and government procurement.',
    actions: ['List Product on Platform', 'Browse Buyer Directory', 'Register for e-NAM'],
    resources: ['e-NAM Registration Guide', 'Export Documentation Checklist']
  },
  stage11: {
    title: 'Market Finance & Insurance',
    desc: 'Access crop insurance, Kisan Credit Card, and micro-financing options.',
    actions: ['Apply for KCC', 'Check PM-FASAL Bima', 'Find MFI Partner'],
    resources: ['PMFBY Scheme Details', 'KCC Application Process', 'SHG Loan Options']
  }

TASK 2.6 — Wire demoData.js into PricingContext
File: src/contexts/PricingContext.jsx

Import mockAgmarknetPrices from '../api/demoData' and merge them into
initialPricingData so the pricing tools have richer crop coverage
(Rice, Tomato, Chilli, Turmeric, Cotton, Wheat with their Agmarknet
prices alongside the existing trend/history data).

TASK 2.7 — Add code splitting with React.lazy
File: src/App.jsx

Replace the static dashboard imports:
  import AdminDashboard from './pages/AdminDashboard'
  import FarmerDashboard from './pages/FarmerDashboard'
  import BuyerDashboard from './pages/BuyerDashboard'
  import DroneOperatorDashboard from './pages/DroneOperatorDashboard'

With lazy imports:
  const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'))
  const FarmerDashboard = React.lazy(() => import('./pages/FarmerDashboard'))
  const BuyerDashboard = React.lazy(() => import('./pages/BuyerDashboard'))
  const DroneOperatorDashboard = React.lazy(() => import('./pages/DroneOperatorDashboard'))

Wrap the <Routes> block in:
  <React.Suspense fallback={
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  }>
    ...existing routes...
  </React.Suspense>

Import CircularProgress from '@mui/material'.

════════════════════════════════════════════════════════════
SECTION 3 — NEW FEATURES TO IMPLEMENT
════════════════════════════════════════════════════════════

TASK 3.1 — Image upload (FileReader / base64) in all product forms
Files: 
  src/components/farmer/AddProduct.jsx
  src/components/farmer/EditProduct.jsx
  src/pages/SignUp.jsx
  src/components/farmer/Profile.jsx
  src/components/buyer/Profile.jsx

Replace the text URL input for images with a proper file picker:

1. Add an <input type="file" accept="image/*" style={{ display:'none' }}
   ref={fileInputRef} onChange={handleImageUpload} />
   and a visible Button that calls fileInputRef.current.click().

2. Implement handleImageUpload:
   const handleImageUpload = (e) => {
     const file = e.target.files[0];
     if (!file) return;
     if (file.size > 512000) {
       showToast('Image must be under 500 KB', 'error');
       return;
     }
     const reader = new FileReader();
     reader.onload = (ev) => {
       setFormData(prev => ({ ...prev, image: ev.target.result }));
     };
     reader.readAsDataURL(file);
   };

3. Show a live preview: if formData.image is set, render
   <img src={formData.image} alt="preview"
        style={{ width: 120, height: 90, objectFit: 'cover',
                 borderRadius: 8, marginTop: 8 }} />

4. Keep the URL text input as a fallback option below the file picker
   (some users may want to paste a URL). Label it "Or paste image URL".

TASK 3.2 — Render QR code in ProductDetails and ProductList
Files:
  src/components/buyer/ProductDetails.jsx
  src/components/farmer/ProductList.jsx

In ProductDetails.jsx:
1. Import QRCode from 'qrcode.react'
2. Import { generateOriginUrl } from '../../utils/qrGenerator'
3. Add a section below the product description:
   <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'divider',
              borderRadius: 2, display: 'inline-block', textAlign: 'center' }}>
     <Typography variant="caption" display="block" gutterBottom>
       Scan to verify origin
     </Typography>
     <QRCode value={generateOriginUrl(product.id)} size={120} />
     <Typography variant="caption" display="block" sx={{ mt: 1 }}>
       Product ID: {product.id}
     </Typography>
   </Box>

In ProductList.jsx (farmer view):
1. Add a QR icon button per product row/card.
2. On click, open a MUI Dialog showing the QR code and a link to
   the origin page: generateOriginUrl(product.id).

TASK 3.3 — Error Boundary component
File: src/components/ErrorBoundary.jsx (create new)

Create a class-based React error boundary:

  import React from 'react'
  import { Box, Typography, Button } from '@mui/material'

  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = { hasError: false, error: null }
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
          <Box display="flex" flexDirection="column" alignItems="center"
               justifyContent="center" minHeight="100vh" gap={2} px={4}>
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

Then in App.jsx, wrap the entire provider tree in:
  <ErrorBoundary>
    ... all providers and routes ...
  </ErrorBoundary>

TASK 3.4 — Farmer–Buyer Messaging System
Files to create:
  src/contexts/MessagingContext.jsx
  src/components/shared/Messaging.jsx
Files to modify:
  src/pages/FarmerDashboard.jsx
  src/pages/BuyerDashboard.jsx
  src/components/Navbar.jsx
  src/components/buyer/ProductDetails.jsx
  src/App.jsx

--- MessagingContext.jsx ---

Use localStorage key 'platform_messages'. Data structure:
  threads: [
    {
      id: 'farmerId-buyerId',  // composite key
      farmerId, farmerName,
      buyerId, buyerName,
      messages: [
        { id, senderId, senderName, text, timestamp, read: false }
      ],
      lastMessage, lastTimestamp
    }
  ]

Expose these functions from context:
  - getThreads(userId)         — returns threads where user is farmer or buyer
  - getThread(farmerId, buyerId) — get or create a thread
  - sendMessage(farmerId, buyerInfo, farmerInfo, text) — add msg to thread
  - markAsRead(threadId, userId) — mark all messages as read for this user
  - getUnreadCount(userId)      — count unread messages for notifications

--- Messaging.jsx component ---

Props: none (reads user from AuthContext)

Layout:
  Left panel (30% width on desktop, full width on mobile):
    - List of conversation threads for the current user
    - Each row shows: other party's name, last message preview, timestamp
    - Unread threads are bold with a blue dot indicator
    - Search input to filter threads by name

  Right panel (70% width):
    - Selected thread's message history in chat bubble style
      (current user's messages right-aligned, other party left-aligned)
    - Timestamp under each bubble
    - Text input + Send button at the bottom
    - If no thread selected, show "Select a conversation"

Use MUI Paper, Box, Typography, TextField, Button, Avatar, Badge, Divider.
Make it mobile responsive (stack panels vertically below 600px).

--- Integration ---

In ProductDetails.jsx:
  Add a "Message Farmer" Button next to the "Add to Cart" button.
  On click: navigate to /buyer/messages?farmerId=X&farmerName=Y
  (pass query params so Messaging.jsx can auto-open the right thread)

In FarmerDashboard.jsx: add route <Route path="messages" element={<Messaging />} />
In BuyerDashboard.jsx:  add route <Route path="messages" element={<Messaging />} />

In App.jsx: wrap providers with <MessagingProvider>

In Navbar.jsx: show a Badge on a Messages icon button with
  getUnreadCount(user.id) — place it next to the Notifications icon.
  On click navigate to /{role}/messages.

In i18n/translations.js: add key 'messages': 'Messages' in all 4 languages.

TASK 3.5 — Product Review & Rating System
Files to create:
  src/contexts/ReviewContext.jsx
  src/components/buyer/ProductReview.jsx
Files to modify:
  src/components/buyer/BuyerOrders.jsx
  src/components/buyer/BrowseProducts.jsx
  src/components/buyer/ProductDetails.jsx
  src/components/farmer/FarmerOverview.jsx
  src/App.jsx

--- ReviewContext.jsx ---

localStorage key: 'platform_reviews'
Data structure:
  reviews: [
    {
      id, productId, farmerId, buyerId, buyerName,
      rating: 1–5, comment, createdAt
    }
  ]

Expose:
  - addReview(reviewData)          — add and save
  - getReviewsByProduct(productId) — array of reviews
  - getAverageRating(productId)    — number (1 decimal)
  - hasReviewed(productId, buyerId)— boolean (prevent duplicates)
  - getAverageFarmerRating(farmerId) — average across all farmer's products

--- ProductReview.jsx ---

Props: { productId, farmerId, onClose }

A MUI Dialog with:
  - Star rating selector (1–5) using MUI Rating component
  - Multi-line TextField for the comment (max 400 chars, show char count)
  - Submit button (disabled if no rating selected)
  - Success state: "Thank you for your review!" with a checkmark

--- Integration ---

In BuyerOrders.jsx:
  For orders with status 'delivered', show a "Write Review" button per item.
  Check hasReviewed(item.productId, user.id) — if already reviewed show
  "Reviewed ✓" chip instead.
  On click open <ProductReview productId={...} farmerId={...} />

In ProductDetails.jsx:
  Show average rating below the product name:
  <Rating value={getAverageRating(product.id)} precision={0.5} readOnly size="small" />
  <Typography variant="caption">({getReviewsByProduct(product.id).length} reviews)</Typography>

  Below the QR code section, show the last 3 reviews:
  For each review: star rating, comment, buyer name, date.

In BrowseProducts.jsx:
  Show a small Rating component (readOnly, size="small") on each product card.

In FarmerOverview.jsx:
  Add a stat card: "Avg Rating" showing getAverageFarmerRating(user.id)
  with a star icon.

In App.jsx: wrap with <ReviewProvider>

TASK 3.6 — Demo data seed button
File: src/components/admin/AdminOverview.jsx

Import demoProducts and demoOrders from '../../api/demoData'.

Add a "Load demo data" Button (outlined, color="secondary") in the
Quick Actions section.

On click, call a seedDemoData() function that:
1. Reads current products from ProductContext.
2. Appends demoProducts (from demoData.js) to the existing products list
   via addProduct() — skip any with duplicate names.
3. Creates a few demo orders via createOrder() from OrderContext.
4. Shows a success toast: "Demo data loaded successfully!"
5. Disables the button after clicking (use state flag).

════════════════════════════════════════════════════════════
SECTION 4 — TRANSLATION KEYS
════════════════════════════════════════════════════════════

File: src/i18n/translations.js

Add the following keys to ALL 4 language objects (en, hi, te, ta).
For hi/te/ta provide rough translations or use the English word if
translation is unclear — do not leave keys missing:

English additions:
  messages: 'Messages',
  write_review: 'Write Review',
  avg_rating: 'Avg Rating',
  no_messages: 'No messages yet',
  send: 'Send',
  load_demo_data: 'Load demo data',
  clear_data: 'Clear app data',
  subscribe: 'Subscribe',
  subscriptions: 'Subscriptions',
  upload_image: 'Upload Image',
  scan_qr: 'Scan to verify origin',
  checkout: 'Checkout',
  payment_method: 'Payment Method',
  shipping_method: 'Shipping Method'

════════════════════════════════════════════════════════════
SECTION 5 — FINAL CHECKLIST (verify before finishing)
════════════════════════════════════════════════════════════

After completing all tasks above, verify:

[ ] npm run build completes with 0 errors
[ ] The 1.35 MB bundle warning is gone (code splitting applied)
[ ] Log in as farmer / farmer123 — add a product with a file upload
[ ] Log in as buyer / buyer123 — add item to cart, go through checkout,
    select payment + shipping, place order
[ ] Log in as farmer / farmer123 — verify the order appears in FarmerOrders
[ ] On a product details page, verify the QR code is visible and the link
    to /product-origin/:id works
[ ] Log in as buyer — go to orders, mark one as delivered, write a review
[ ] Verify the review appears in ProductDetails for that product
[ ] Log in as buyer — click "Message Farmer" on a product page
[ ] Log in as farmer — see the message and reply
[ ] Log in as admin — click "Load demo data" and verify products appear
[ ] Log in as any user — verify no plain-text password in
    localStorage > registeredUsers (should see passwordHash field)
[ ] Check the browser console for any React errors or broken imports
[ ] Run npm run build one final time — confirm clean build

════════════════════════════════════════════════════════════
CONSTRAINTS
════════════════════════════════════════════════════════════

- Do NOT install any new npm packages. All libraries needed are already
  in package.json (qrcode.react, jspdf, recharts, axios, date-fns, MUI).
- Do NOT change the existing routing structure or role-based access pattern.
- Do NOT convert any file to TypeScript.
- Do NOT replace localStorage with any external service or API.
- Keep all new components consistent with existing MUI theming.
- All new context providers must be added to App.jsx's provider tree.
- Follow the existing file naming convention (PascalCase .jsx).
- Use the existing useToast() hook for all success/error feedback.
- Use the existing useLanguage() / t() hook for all user-facing strings.
