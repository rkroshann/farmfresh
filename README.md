# 🌾 FarmFresh Marketplace - Complete Web Application

A full-stack marketplace connecting farmers with buyers for fresh produce, built with React, Node.js, Express, MongoDB, and Socket.io.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Converting to Mobile App](#converting-to-mobile-app)
- [Deployment](#deployment)

## ✨ Features

### For Buyers
- Browse fresh produce marketplace
- Search and filter products (category, price, organic)
- View detailed product information
- Real-time chat with farmers
- Make price offers and negotiate
- Place orders with COD payment
- Track order status
- Rate and review farmers

### For Farmers
- Create and manage product listings
- Upload multiple product images
- Receive and respond to buyer messages
- Accept/reject price offers
- Manage orders and update delivery status
- View earnings and order history

### General
- User authentication (JWT)
- Role-based access (Farmer/Buyer)
- Real-time messaging (Socket.io)
- Responsive design (Mobile-first)
- PWA-ready (Can be installed)

## 🛠 Tech Stack

### Frontend
- React 18
- Material-UI (MUI)
- Zustand (State Management)
- Axios (API calls)
- Socket.io Client (Real-time)
- React Router v6
- React Hot Toast (Notifications)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (WebSocket)
- Multer (File uploads)
- bcryptjs (Password hashing)

## 📦 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR use MongoDB Atlas (free cloud database)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### 1. Clone or Download the Project

```bash
# You already have the project in /home/claude/farmfresh-marketplace
cd /home/claude/farmfresh-marketplace
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your settings
nano .env
```

#### Configure .env file:

```env
# MongoDB - Choose ONE option:

# Option 1: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/farmfresh

# Option 2: MongoDB Atlas (Recommended for beginners)
# 1. Go to https://www.mongodb.com/cloud/atlas/register
# 2. Create free cluster
# 3. Get connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmfresh

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your_super_secret_key_min_32_characters_long

# Server Port
PORT=5000

# Frontend URL
CLIENT_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Open a new terminal
cd /home/claude/farmfresh-marketplace/client

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

## ▶️ Running the Application

### Start MongoDB (if using local)

```bash
# On Ubuntu/Linux
sudo systemctl start mongod

# On macOS
brew services start mongodb-community

# On Windows
# MongoDB should start automatically, or run:
# net start MongoDB
```

### Start Backend Server

```bash
cd server
npm run dev

# You should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000
```

### Start Frontend (in new terminal)

```bash
cd client
npm start

# Browser will open automatically at http://localhost:3000
```

## 🎯 Testing the Application

### 1. Register Users

1. Go to `http://localhost:3000/register`
2. Create a **Farmer** account
3. Create a **Buyer** account (use different email)

### 2. As Farmer

1. Login with farmer account
2. Click "Dashboard" → "Create Listing"
3. Fill in product details (tomatoes, ₹40/kg, etc.)
4. Upload images (optional if you set up image storage)
5. Submit listing

### 3. As Buyer

1. Logout and login with buyer account
2. Browse marketplace - you should see the farmer's product
3. Click product → "Contact Farmer"
4. Send messages in chat
5. Click "Buy Now" to place order

### 4. Test Real-time Chat

1. Keep both farmer and buyer accounts open in different browsers
2. Send messages - they should appear instantly!

## 📁 Project Structure

```
farmfresh-marketplace/
├── server/                 # Backend
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Chat.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/            # API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── chats.js
│   │   ├── orders.js
│   │   └── reviews.js
│   ├── middleware/        # Auth & upload
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/           # Uploaded images
│   ├── server.js          # Main server file
│   ├── .env              # Environment variables
│   └── package.json
│
└── client/                # Frontend
    ├── public/
    │   ├── index.html
    │   └── manifest.json  # PWA config
    ├── src/
    │   ├── components/    # Reusable components (create as needed)
    │   ├── pages/         # Main pages
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Marketplace.js
    │   │   ├── ProductDetail.js
    │   │   ├── FarmerDashboard.js
    │   │   ├── CreateListing.js
    │   │   ├── ChatList.js
    │   │   ├── ChatRoom.js
    │   │   ├── OrderList.js
    │   │   └── OrderDetail.js
    │   ├── services/      # API calls
    │   │   └── api.js
    │   ├── store/         # State management
    │   │   └── useStore.js
    │   ├── contexts/      # React contexts
    │   │   └── SocketContext.js
    │   ├── App.js         # Main app with routing
    │   ├── index.js       # Entry point
    │   └── index.css      # Global styles
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Farmer only)
- `PUT /api/products/:id` - Update product (Farmer only)
- `DELETE /api/products/:id` - Delete product (Farmer only)

### Chats
- `POST /api/chats` - Create/get chat
- `GET /api/chats` - Get user's chats
- `GET /api/chats/:id` - Get chat messages
- `POST /api/chats/:id/messages` - Send message
- `PUT /api/chats/:chatId/offers/:messageId` - Accept/reject offer

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews

## 📱 Converting to Mobile App

### Using Capacitor (Recommended)

```bash
# Install Capacitor
cd client
npm install @capacitor/core @capacitor/cli
npx cap init

# Build web app
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Open in Android Studio / Xcode
npx cap open android
npx cap open ios
```

### PWA Installation

The app is already PWA-ready! Users can:
1. Visit on mobile browser
2. Click "Add to Home Screen"
3. Use like a native app

## 🚀 Deployment

### Backend (Railway.app - Free)

1. Create account at [Railway.app](https://railway.app)
2. Connect GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Frontend (Vercel - Free)

1. Create account at [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set environment variable: `REACT_APP_API_URL=https://your-backend.railway.app/api`
4. Deploy automatically

### Database (MongoDB Atlas - Free)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Get connection string
4. Add to backend environment variables

## 🎨 Customization

### Change Colors

Edit `client/src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Change this to your color
    },
  },
});
```

### Add Logo

Replace text logo in AppBar with:

```javascript
<img src="/logo.png" alt="Logo" style={{ height: 40 }} />
```

## ⚠️ Common Issues & Solutions

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in server/.env
PORT=5001
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Or use MongoDB Atlas (cloud) instead
```

### CORS Errors

Ensure `CLIENT_URL` in server/.env matches your frontend URL.

## 📚 Learning Resources

- [React Docs](https://react.dev)
- [Material-UI](https://mui.com)
- [Express.js](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Socket.io](https://socket.io/docs/v4/)

## 🤝 Support

For help:
1. Check console for errors
2. Review this README
3. Check API responses in Network tab
4. Verify environment variables

## 📝 License

MIT License - Free for personal and commercial use

---

**Built with ❤️ for connecting farmers with buyers**
