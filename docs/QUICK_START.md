# 🚀 Quick Start Guide - FarmFresh Marketplace

## For Complete Beginners - Step by Step

### Step 1: Install Prerequisites (One-time setup)

#### Install Node.js
1. Go to https://nodejs.org
2. Download "LTS" version (v18 or v20)
3. Run installer and follow instructions
4. Verify installation:
```bash
node --version
npm --version
```

#### Install MongoDB

**Option A: Use MongoDB Atlas (Recommended - Cloud, Free)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string (looks like: mongodb+srv://username:password@...)
6. Save it for later

**Option B: Install Locally**
- Windows: https://www.mongodb.com/try/download/community
- Mac: `brew tap mongodb/brew && brew install mongodb-community`
- Linux: `sudo apt-get install mongodb`

### Step 2: Setup the Project

```bash
# Navigate to project
cd farmfresh-marketplace

# Setup Backend
cd server
npm install
cp .env.example .env

# Edit .env file (use notepad, nano, or vim)
# Replace MONGODB_URI with your Atlas connection string or use:
# MONGODB_URI=mongodb://localhost:27017/farmfresh

# Setup Frontend  
cd ../client
npm install
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### Step 3: Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Wait until you see: ✅ MongoDB connected successfully

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Browser opens automatically at http://localhost:3000

### Step 4: Create Test Accounts

1. Click "Register"
2. Create Farmer account:
   - Name: "John Farm"
   - Email: farmer@test.com
   - Password: test123
   - Role: Farmer

3. Logout and create Buyer account:
   - Name: "Jane Buyer"
   - Email: buyer@test.com
   - Password: test123
   - Role: Buyer

### Step 5: Test the App

**As Farmer:**
1. Login as farmer@test.com
2. Click "Dashboard" → "New Listing"
3. Create product:
   - Title: Fresh Tomatoes
   - Category: Vegetables
   - Price: 40
   - Quantity: 100
   - Unit: kg
4. Submit

**As Buyer:**
1. Logout and login as buyer@test.com
2. Browse marketplace - see tomatoes
3. Click product → "Contact Farmer"
4. Send message!

## Common Issues

### "Port 5000 already in use"
Kill the process:
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### "MongoDB connection failed"
- Check if MongoDB is running (if local)
- Check if connection string is correct in .env
- Try MongoDB Atlas instead

### "npm install fails"
Clear cache and retry:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### "Can't connect to backend"
- Ensure backend is running (Terminal 1)
- Check REACT_APP_API_URL in client/.env
- Check CORS settings in server/.env

## Next Steps

1. Read COMPLETE_PAGES_CODE.md for remaining pages
2. Add full ChatRoom, OrderList functionality
3. Deploy to Railway + Vercel (see README.md)
4. Convert to mobile app with Capacitor

## Getting Help

- Check console for errors (F12 in browser)
- Review README.md for detailed docs
- Check Network tab for API errors
- Verify .env files are correct

Happy coding! 🌾
