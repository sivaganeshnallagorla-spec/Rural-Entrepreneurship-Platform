# Backend Implementation TODO List

This document tracks the tasks required to fully implement the Python FastAPI backend and integrate it with the existing React frontend for the Rural Entrepreneurship Platform.

## Phase 1: Core Setup & Authentication 
- [x] Initial FastAPI project structure and `requirements.txt`.
- [x] Setup SQLite database and SQLModel configuration (`db.py`).
- [x] Create `Product` model, schemas, and basic CRUD routes.
- [x] Create `User` model, schemas, and JWT authentication utilities.
- [ ] Connect `auth.py` to `main.py` router.
- [ ] Add route protection (e.g., `get_current_user` dependency) for product creation.
- [ ] Test Auth endpoints (Register, Login).

## Phase 2: E-Commerce & Ordering
- [ ] Create `Order` and `OrderItem` models to track purchases.
- [ ] Create Order routes (Checkout, Order History for Buyer, Orders for Farmer).
- [ ] Implement `Review` model and routes for the Product Review System.
- [ ] Add filtering and pagination to Product lists (based on frontend needs).

## Phase 3: Drone Operator & Services
- [ ] Create `DroneService` or `OperatorProfile` model.
- [ ] Create `Booking` model to handle Farmer-to-Drone Operator requests.
- [ ] Build Booking routes (Create request, Accept/Reject, Dashboard states).

## Phase 4: Messaging System
- [ ] Create `MessageThread` and `Message` models.
- [ ] Build REST endpoints for messaging history.
- [ ] Setup WebSockets in FastAPI for real-time chat updates a seamless Farmer-Buyer communication experience.

## Phase 5: Frontend API Integration
- [ ] Refactor `AuthContext.jsx` to bridge `/api/auth/login` and `/api/auth/register` instead of `localStorage`.
- [ ] Map `ProductContext.jsx` to fetch from `/api/products` and send `Authorization` tokens.
- [ ] Map `OrderContext.jsx` and new systems to the Axios API.
- [ ] Update CORS origins to confirm they match the running Vite local server correctly.

## Phase 6: Polish & Deployment (Optional)
- [ ] Seed database script with Demo test data (Agmarknet datasets, demo users).
- [ ] Set up migrations with Alembic (if schema changes grow).
- [ ] Deployment plan (e.g., Render/Railway) and environment variable management.
