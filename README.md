# E-Store 🛍️

A full-stack e-commerce platform with a customer-facing storefront, an admin dashboard, and a RESTful backend API.

---

## Features

### Customer Storefront
- Browse and filter product collections
- Product detail pages with image gallery
- Shopping cart and wishlist management
- Secure checkout with Stripe payment processing
- Order tracking and order history
- User authentication (register / login / JWT sessions)
- Email verification via Nodemailer
- Customer portal for account and address management
- Rewards and loyalty system
- Support / contact page

### Admin Dashboard
- Store management (products, categories, inventory)
- Order management and fulfilment tracking
- Growth analytics and reporting
- Admin module management

---

## Tech Stack

### Frontend (`/Frontend` & `/Admin`)
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| React Toastify | Toast notifications |

### Backend (`/Backend`)
| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Auth & authorisation |
| bcrypt / bcryptjs | Password hashing |
| Stripe | Payment processing |
| Cloudinary + Multer | Image upload & storage |
| Nodemailer | Transactional emails |
| Nodemon | Dev auto-restart |

---

## Project Structure

```
E-Store/
├── Backend/           # Express REST API
│   ├── Config/        # DB & Cloudinary connections
│   ├── controllers/   # Route handler logic
│   ├── middleware/     # Auth & validation middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API route definitions
│   └── server.js      # Entry point (port 4000)
├── Frontend/          # Customer-facing React app (Vite)
│   └── src/
│       ├── Components/
│       ├── Context/   # Global state (cart, auth, etc.)
│       ├── Pages/     # Route-level page components
│       └── assets/
├── Admin/             # Admin dashboard React app (Vite)
│   └── src/         # Legacy / reference code
```

---

## API Routes

| Prefix | Description |
|---|---|
| `/api/user` | Auth – register, login, profile |
| `/api/product` | Products – CRUD, listing, filtering |
| `/api/cart` | Cart – add, remove, update |
| `/api/order` | Orders – place, list, status |
| `/api/admin-module` | Admin module management |
| `/api/admin-store` | Admin store & inventory |
| `/api/admin-growth` | Analytics & growth metrics |
| `/api/customer` | Customer portal data |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm (recommended) or npm
- MongoDB instance (local or Atlas)
- Cloudinary account
- Stripe account

### Environment Variables

Create a `.env` file in `Backend/`:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Create a `.env` file in `Frontend/` and `Admin/`:

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Installation & Running

```bash
# Backend
cd Backend
pnpm install
pnpm run server       # dev (nodemon) — http://localhost:4000

# Frontend (customer storefront)
cd Frontend
pnpm install
pnpm run dev          # http://localhost:5173

# Admin dashboard
cd Admin
pnpm install
pnpm run dev          # http://localhost:5174
```

---

## Deployment

Both React apps are configured for deployment on **Vercel** (`vercel.json` included in each).  
The backend can be deployed to any Node.js host (Vercel, Railway, Render, etc.).

---

## License

ISC
