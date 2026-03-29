# Project Implementation Task List

_Last updated: 2026-03-29_

## 1. Core State & Data Layer
- [x] Create `src/contexts/DroneContext.jsx` (DaaS / booking state)
- [x] Create `src/contexts/PricingContext.jsx` (pricing & ROI-related state)
- [x] Update `src/App.jsx` to include new providers (`DroneProvider`, `PricingProvider`, etc.)
- [x] Contexts integrate with existing LocalStorage-backed flows (`OrderContext`, `ProductContext`, etc.); seed/demo data where applicable

## 2. Shared Components & Utilities
- [x] Implement `src/utils/qrGenerator.js` (QR / origin trace helpers; uses `qrcode.react` where wired in UI)
- [x] Implement `src/utils/invoice.js` (`jspdf` & `jspdf-autotable`)
- [x] Implement `src/utils/shippingCalculator.js` (`estimateShipping`, `calculateShipping`, `getShippingMethods`, etc.)
- [x] Update `Navbar.jsx` — role-based navigation, theme toggle, language selector (`availableLanguages`), fixed role URL segments (e.g. `drone-operator`)

## 3. Farmer Dashboard Enhancements
- [x] Implement `ServicesHub.jsx` (grid navigation for lifecycle stages)
- [x] Stage flows via `StageService.jsx` (single routed component for stage paths; not 11 separate files)
- [x] Implement `DaaSMarketplace.jsx` (drone booking UI)
- [x] Implement `PricingTools.jsx` / related `PricingCalculator.jsx`, `InteractiveTools.jsx` (pricing & tools area)

## 4. Buyer Dashboard Implementation
- [x] `BuyerOverview.jsx`
- [x] Product discovery via `BrowseProducts.jsx` (route: `/buyer/browse`; navbar label `marketplace`)
- [x] `Cart.jsx` and order placement via `ProductDetails.jsx` + `OrderContext` (checkout-style flow; no separate `Checkout.jsx`)
- [x] `BuyerOrders.jsx`; invoices via `utils/invoice.js` where triggered from order flows

## 5. Drone Operator Dashboard Implementation
- [x] `DroneOverview.jsx`
- [x] Reuse `Profile.jsx` with `role="drone_operator"`
- [x] `BookingManagement.jsx`
- [x] `SessionHistory.jsx` (flight logs from completed bookings)
- [x] `AvailabilityCalendar.jsx` (operator availability dates in LocalStorage)
- [x] Demo login: **drone / drone123** (user id `op1` matches operator listings)

## 6. Admin Dashboard Expansion
- [x] `AdminOverview.jsx`
- [x] `UserManagement.jsx`
- [x] `ProductModeration.jsx`
- [x] `OrderManagement.jsx`
- [x] `DroneManagement.jsx` (route `/admin/drones`)
- [x] `Analytics.jsx` (Recharts)
- [x] `KnowledgeManagement.jsx` + `AddEditKnowledgeModule.jsx`

## 7. Public Pages
- [x] `ProductOriginPage.jsx`

## 8. Final Polish & Integration
- [x] Light UI transitions (`src/index.css`: root fade-in, card/paper/button transitions)
- [x] Navbar i18n sweep (`translations.js`: `marketplace`, `nav_tools`, `flight_logs`, `availability`, `drone_admin`, etc.)
- [x] Verify production build (`npm run build`)
- [x] Buyer marketplace button → `/buyer/browse`
- [x] Deployment notes (`DEPLOY.md`)

## Recently fixed (engineering)
- Shipping utilities exported for `ProductDetails.jsx` (avoid broken buyer bundle).
- `LanguageContext` exposes `availableLanguages` (fixes blank screens after login in `Navbar`).
- Navbar uses hyphenated role path segments for URLs (e.g. drone operator).
