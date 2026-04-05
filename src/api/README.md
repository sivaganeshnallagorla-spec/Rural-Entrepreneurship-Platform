# API Contract Specification

This document outlines the expected API endpoints for the Rural Entrepreneurship Platform.
The frontend uses a centralized service layer that can switch between **Demo Mode** (using `secureStorage`) and **Real API Mode** (Axios) based on the `APP_CONFIG.isDemo` flag.

## Base URL
The default base URL is set to `http://localhost:8000/api/v1` but is configurable via `VITE_API_BASE_URL`.

---

## Authentication Service (`/auth`)

### 1. Login
- **Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "password"
  }
  ```
- **Response Shape**:
  ```json
  {
    "token": "string (JWT)",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "admin | farmer | buyer | drone_operator",
      "name": "string",
      "location": "string"
    }
  }
  ```

### 2. Register
- **Endpoint**: `POST /auth/register`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "hashed_password",
    "email": "string",
    "role": "farmer | buyer",
    "name": "string",
    "phone": "string",
    "address": {
      "city": "string",
      "state": "string",
      "country": "string"
    }
  }
  ```

---

## Product Service (`/products`)

### 1. Get All Products
- **Endpoint**: `GET /products`
- **Response Shape**: `Array<Product>`

### 2. Get Product By ID
- **Endpoint**: `GET /products/:id`
- **Response Shape**: `Product`

### 3. Create Product
- **Endpoint**: `POST /products`
- **Request Body**: `Partial<Product>`
- **Auth Required**: Yes (Bearer Token, Farmer Role)

### 4. Update Product
- **Endpoint**: `PATCH /products/:id`
- **Request Body**: `Partial<Product>`
- **Auth Required**: Yes

### 5. Get Products by Farmer
- **Endpoint**: `GET /products/farmer/:farmerId`
- **Response Shape**: `Array<Product>`

---

## Order Service (`/orders`)

### 1. Create Order
- **Endpoint**: `POST /orders`
- **Request Body**:
  ```json
  {
    "buyerId": "string",
    "items": [
      { "productId": "string", "quantity": "number", "price": "number" }
    ],
    "totalPrice": "number",
    "shippingAddress": "string",
    "paymentMethod": "string"
  }
  ```

### 2. Get Orders for User
- **Buyer**: `GET /orders/buyer/:userId`
- **Farmer**: `GET /orders/farmer/:userId`
- **Response Shape**: `Array<Order>`

### 3. Update Order Status
- **Endpoint**: `PATCH /orders/:id/status`
- **Request Body**:
  ```json
  {
    "status": "pending | processing | shipped | delivered | cancelled"
  }
  ```

---

## Common Objects

### Product Object
```json
{
  "id": "string",
  "farmerId": "string",
  "farmerName": "string",
  "name": "string",
  "category": "string",
  "description": "string",
  "price": "number",
  "unit": "string",
  "stock": "number",
  "location": "string",
  "image": "string (URL)",
  "certification": "string",
  "available": "boolean",
  "createdAt": "ISOString"
}
```

### Order Object
```json
{
  "id": "string",
  "buyerId": "string",
  "farmerId": "string",
  "items": [],
  "totalPrice": "number",
  "status": "string",
  "createdAt": "ISOString",
  "updatedAt": "ISOString"
}
```
