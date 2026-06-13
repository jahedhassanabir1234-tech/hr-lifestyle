# HR-Lifestyle - E-Commerce Platform

Full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Upload)

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router v6
- Axios

---

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
```bash
cd HR-Lifestyle/backend
npm install
# Create .env file with your MongoDB URI and JWT secret
node seed.js    # Seed sample data (optional)
npm run dev     # Start on port 5000
```

### Frontend Setup
```bash
cd HR-Lifestyle/frontend
npm install
npm run dev     # Start on port 5173
```

---

## Test Accounts

| Role    | Email                    | Password |
|---------|--------------------------|----------|
| Admin   | admin@hrlifestyle.com    | admin123 |
| User    | user@hrlifestyle.com     | user123  |

---

## API Documentation

### Auth APIs

| Method | Endpoint              | Description          | Auth Required |
|--------|-----------------------|----------------------|---------------|
| POST   | /api/auth/register    | Register new user    | No            |
| POST   | /api/auth/login       | Login user           | No            |
| GET    | /api/auth/profile     | Get user profile     | Yes           |
| PUT    | /api/auth/profile     | Update user profile  | Yes           |
| GET    | /api/auth/users       | Get all users (Admin)| Yes (Admin)   |

**Register Body:**
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456",
  "phone": "+8801712345678"
}
```

**Login Response:**
```json
{
  "_id": "...",
  "name": "John",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

---

### Product APIs

| Method | Endpoint                  | Description           | Auth Required |
|--------|---------------------------|-----------------------|---------------|
| GET    | /api/products             | Get all products      | No            |
| GET    | /api/products/featured    | Get featured products | No            |
| GET    | /api/products/:slug       | Get product by slug   | No            |
| POST   | /api/products             | Create product (Admin)| Yes (Admin)   |
| PUT    | /api/products/:id         | Update product (Admin)| Yes (Admin)   |
| DELETE | /api/products/:id         | Delete product (Admin)| Yes (Admin)   |
| POST   | /api/products/:id/reviews | Add product review    | Yes           |

**Query Parameters (GET /api/products):**
- `page` - Page number (default: 1)
- `search` - Search by name
- `category` - Filter by category ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

**Create Product Body (FormData):**
- `name` - Product name
- `description` - Description
- `price` - Price
- `discountPrice` - Discount price (optional)
- `category` - Category ID
- `brand` - Brand name
- `stock` - Stock quantity
- `featured` - true/false
- `images` - File(s) (max 5)

---

### Category APIs

| Method | Endpoint                  | Description             | Auth Required |
|--------|---------------------------|-------------------------|---------------|
| GET    | /api/categories           | Get all categories      | No            |
| GET    | /api/categories/:slug     | Get category by slug    | No            |
| POST   | /api/categories           | Create category (Admin) | Yes (Admin)   |
| PUT    | /api/categories/:id       | Update category (Admin) | Yes (Admin)   |
| DELETE | /api/categories/:id       | Delete category (Admin) | Yes (Admin)   |

---

### Cart APIs (Auth Required)

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | /api/cart           | Get user cart        |
| POST   | /api/cart           | Add item to cart     |
| PUT    | /api/cart/:itemId   | Update item quantity |
| DELETE | /api/cart/:itemId   | Remove item from cart|
| DELETE | /api/cart           | Clear cart           |

**Add to Cart Body:**
```json
{
  "productId": "product_id_here",
  "quantity": 1
}
```

---

### Order APIs

| Method | Endpoint                  | Description           | Auth Required |
|--------|---------------------------|-----------------------|---------------|
| POST   | /api/orders               | Create new order      | Yes           |
| GET    | /api/orders/myorders      | Get user orders       | Yes           |
| GET    | /api/orders/:id           | Get order by ID       | Yes           |
| GET    | /api/orders               | Get all orders (Admin)| Yes (Admin)   |
| PUT    | /api/orders/:id/status    | Update order (Admin)  | Yes (Admin)   |
| GET    | /api/orders/stats         | Get dashboard stats   | Yes (Admin)   |

**Create Order Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Dhaka",
    "state": "Dhaka",
    "zipCode": "1000"
  },
  "paymentMethod": "cod"
}
```

**Payment Methods:** `cod`, `bkash`, `nagad`, `stripe`

---

## Frontend Pages

| Route              | Description           | Auth Required |
|--------------------|-----------------------|---------------|
| /                  | Home page             | No            |
| /products          | Product listing       | No            |
| /products/:slug    | Product detail        | No            |
| /cart              | Shopping cart         | Yes           |
| /checkout          | Checkout              | Yes           |
| /login             | Login                 | No            |
| /register          | Register              | No            |
| /profile           | User profile          | Yes           |
| /orders            | My orders             | Yes           |
| /admin             | Admin dashboard       | Yes (Admin)   |
| /admin/products    | Manage products       | Yes (Admin)   |
| /admin/orders      | Manage orders         | Yes (Admin)   |
| /admin/categories  | Manage categories     | Yes (Admin)   |

---

## Project Structure

```
HR-Lifestyle/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminCategories.jsx
│   │   │   │   ├── AdminOrders.jsx
│   │   │   │   ├── AdminProducts.jsx
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```
