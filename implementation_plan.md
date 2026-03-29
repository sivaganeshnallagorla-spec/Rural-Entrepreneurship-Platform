# Rural Entrepreneurship Platform - Project Update Plan

This plan outlines the final implementation phase to complete the production-ready frontend. We will move away from placeholder components to a fully functional, role-based dashboard system using LocalStorage as a mock backend.

## User Review Required

> [!IMPORTANT]
> **LocalStorage Mock Service**: Since there are no live backend APIs, I will implement a robust LocalStorage service that mimics database persistence. This allows for a full demonstration of CRUD actions (adding products, booking drones, placing orders) that persist across refreshes.

> [!CAUTION]
> **Routing Structure**: I will be updating the `App.jsx` routing to support nested routes for all four roles (Farmer, Buyer, Drone Operator, Admin). This might replace some existing sub-routes to align with the new unified structure.

## Proposed Changes

### 1. Core State & Data Layer
- **[NEW] `DroneContext`**: Manage drone operator listings, booking states, and session logs.
- **[NEW] `PricingContext`**: State management for AI-suggested prices and ROI calculators.
- **[MODIFY] `App.jsx`**: Wrap the component tree with new providers.

### 2. Utilities & Shared Logic
- **[NEW] `src/utils/qrGenerator.js`**: Logic to generate QR codes for each product.
- **[NEW] `src/utils/invoice.js`**: Logic to generate PDF invoices using `jsPDF`.
- **[NEW] `src/utils/shippingCalculator.js`**: Logic to estimate delivery costs based on distance/weight.

### 3. Role-Based Dashboards (Execution)

#### Farmer Dashboard
- **`ServicesHub.jsx`**: A central hub to navigate through the 11 agricultural lifecycle stages.
- **`Stage-Specific Components`**: Individual views for "Pre-farming Advice", "Crop Monitoring", "Market Linkage", etc.
- **`DaaSMarketplace.jsx`**: Interfaces for farmers to search and book drone services.

#### Buyer Dashboard
- **`Marketplace.jsx`**: Advanced filtering for products by category, rating, and location.
- **`Cart & Checkout`**: Full cart logic and a simulated payment/order placement flow.
- **`OrderDetail.jsx`**: View order status and download PDF invoices.

#### Drone Operator Dashboard [NEW]
- **`DroneOverview.jsx`**: Stats for bookings, earnings, and flight hours.
- **`BookingManagement.jsx`**: Accept/Reject booking requests from farmers.
- **`AvailabilityCalendar.jsx`**: Set available slots for service.

#### Admin Dashboard
- **`User/Product Management`**: Full CRUD oversight for the platform.
- **`AnalyticsDashboard.jsx`**: Visual graphs (Recharts) for platform stats.

### 4. Public & Marketing Pages
- **[NEW] `ProductOriginPage.jsx`**: A public-facing page that displays a product's supply chain history (traced via QR code).

---

## Open Questions

- Should we include a "Demo Mode" toggle that auto-populates the LocalStorage with sample data?
- For the 11 stages of agricultural lifecycle, should we implement a "Progress Tracker" UI as well?

## Verification Plan

### Automated Tests
- `npm run build`: Ensure no linting or build errors.
- Visual check via browser agent for role routing.

### Manual Verification
- Log in as Farmer -> Book Drone -> Check Drone Operator Dashboard for request.
- Add Product -> View QR -> Navigate to Origin Page.
- Purchase Product as Buyer -> Generate Invoice.
