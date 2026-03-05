# 📱 Mobile App Conversion Guide

## Converting Your Web App to Mobile App Using Capacitor

### Why Capacitor?
- ✅ Uses your existing React codebase
- ✅ No need to learn React Native
- ✅ Access native device features (camera, GPS, etc.)
- ✅ Publish to App Store and Google Play
- ✅ Still works as website

### Step-by-Step Conversion

## 1. Install Capacitor

```bash
cd client

# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Initialize Capacitor
npx cap init

# You'll be asked:
# App name: FarmFresh Marketplace
# Package ID: com.farmfresh.app (can be anything)
# Web dir: build
```

## 2. Build Your Web App

```bash
# Build production version
npm run build

# This creates the 'build' folder
```

## 3. Add Mobile Platforms

```bash
# Add Android
npx cap add android

# Add iOS (Mac only)
npx cap add ios
```

## 4. Configure capacitor.config.json

Edit `client/capacitor.config.json`:

```json
{
  "appId": "com.farmfresh.app",
  "appName": "FarmFresh",
  "webDir": "build",
  "bundledWebRuntime": false,
  "server": {
    "url": "https://your-backend-url.railway.app",
    "cleartext": true
  }
}
```

## 5. Update API URL for Production

Edit `client/.env.production`:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app/api
```

## 6. Sync and Build

```bash
# Rebuild web app
npm run build

# Sync to native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode (Mac only)
npx cap open ios
```

## 7. Android Development

### Prerequisites
- Install [Android Studio](https://developer.android.com/studio)
- Install Java JDK 11+

### Steps
1. Open project in Android Studio
2. Wait for Gradle sync
3. Connect Android device or start emulator
4. Click Run ▶️ button
5. App installs and runs!

### Generate APK
1. In Android Studio: Build → Build Bundle(s)/APK(s) → Build APK
2. APK saved in: `android/app/build/outputs/apk/debug/`

### Generate Release APK
1. Build → Generate Signed Bundle/APK
2. Create keystore (first time)
3. APK ready for Play Store

## 8. iOS Development (Mac Only)

### Prerequisites
- macOS computer
- Xcode 14+
- Apple Developer Account ($99/year)

### Steps
1. Open project in Xcode
2. Select Team (Apple Developer Account)
3. Connect iPhone or use Simulator
4. Click Run ▶️ button

### Publish to App Store
1. Archive build in Xcode
2. Upload to App Store Connect
3. Fill app information
4. Submit for review

---

# 🌐 Deployment Guide

## Deploy Backend to Railway

### 1. Prepare Backend

```bash
cd server

# Add start script to package.json (should already be there)
# "scripts": {
#   "start": "node server.js"
# }
```

### 2. Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Select `server` folder
7. Add Environment Variables:
   - `MONGODB_URI` → Your MongoDB Atlas connection
   - `JWT_SECRET` → Random long string
   - `CLIENT_URL` → Your Vercel URL (add after deploying frontend)
   - `NODE_ENV` → production
8. Deploy!

Copy the deployment URL (e.g., `farmfresh-api.railway.app`)

## Deploy Frontend to Vercel

### 1. Prepare Frontend

```bash
cd client

# Update .env.production
echo "REACT_APP_API_URL=https://your-railway-url.railway.app/api" > .env.production
```

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - Framework: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Environment Variables:
   - `REACT_APP_API_URL` → `https://your-railway-url.railway.app/api`
7. Deploy!

Your app is live at `your-app.vercel.app`

### 3. Update Backend CORS

Go back to Railway → Environment Variables → Update:
- `CLIENT_URL` → `https://your-app.vercel.app`

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
2. Create Free Cluster (M0)
3. Database Access:
   - Create user with password
4. Network Access:
   - Add IP: `0.0.0.0/0` (allow from anywhere)
5. Connect → Application:
   - Copy connection string
   - Replace `<password>` with your password
6. Use in Railway environment variables

---

# 🎨 Customization Guide

## Change App Name

### Web
- Edit `client/public/index.html` → `<title>`
- Edit `client/public/manifest.json` → `name`

### Mobile
- Edit `client/capacitor.config.json` → `appName`
- Rebuild and sync

## Change App Icon

### Web
1. Replace `client/public/favicon.ico`
2. Replace `client/public/logo192.png`
3. Replace `client/public/logo512.png`

### Mobile
1. Create icon 1024x1024px
2. Use [App Icon Generator](https://appicon.co/)
3. Replace files in:
   - Android: `android/app/src/main/res/`
   - iOS: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

## Change Theme Colors

Edit `client/src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Your color
    },
    secondary: {
      main: '#4ECDC4', // Your color
    },
  },
});
```

## Add Google Maps

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Install package:
```bash
npm install @react-google-maps/api
```
4. Use in location picker

## Add Payment Gateway (Stripe)

```bash
# Backend
npm install stripe

# Frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

Follow [Stripe Docs](https://stripe.com/docs/payments/quickstart)

## Add Push Notifications

```bash
# Install Firebase
npm install firebase

# Add to capacitor
npm install @capacitor/push-notifications
```

Configure Firebase Cloud Messaging

---

# 📊 Analytics & Monitoring

## Add Google Analytics

```bash
npm install react-ga4
```

```javascript
// src/index.js
import ReactGA from 'react-ga4';
ReactGA.initialize('YOUR-GA-ID');
```

## Add Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```javascript
// src/index.js
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "YOUR-DSN" });
```

---

# 🧪 Testing

## Test Before Deployment

```bash
# Frontend
cd client
npm run build
npx serve -s build

# Backend
cd server
NODE_ENV=production npm start
```

## Test Mobile App

```bash
# Android
npx cap run android

# iOS
npx cap run ios
```

---

# ✅ Pre-Launch Checklist

- [ ] All environment variables set correctly
- [ ] MongoDB Atlas configured
- [ ] CORS URLs updated
- [ ] App tested on mobile browsers
- [ ] Images optimized
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] 404 page works
- [ ] Security: API keys not exposed
- [ ] Performance: Lazy loading added
- [ ] SEO: Meta tags added
- [ ] Privacy policy page (if collecting data)
- [ ] Terms of service page

---

# 🚀 Going Live

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Test thoroughly
4. Share with beta testers
5. Fix bugs
6. Build mobile apps
7. Submit to app stores
8. Launch! 🎉

---

# 💡 Tips

- **Start Simple**: Launch web version first
- **Test Locally**: Always test before deploying
- **Use Git**: Commit often, deploy from main branch
- **Monitor Logs**: Check Railway logs for errors
- **Backup Database**: Export MongoDB regularly
- **Update Dependencies**: Keep packages updated
- **User Feedback**: Add feedback form
- **Analytics**: Track user behavior
- **Security**: Use HTTPS everywhere
- **Performance**: Optimize images, lazy load

---

Good luck with your app! 🌾📱
