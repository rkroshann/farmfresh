import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './contexts/SocketContext';
import useStore from './store/useStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import FarmerDashboard from './pages/FarmerDashboard';
import CreateListing from './pages/CreateListing';
import ChatLayout from './pages/ChatLayout';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import CartPage from './pages/CartPage';
import LandingPage from './pages/LandingPage';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c'
    },
    secondary: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00'
    },
    background: {
      default: '#f5f5f5'
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    }
  }
});

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useStore();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'farmer' ? '/farmer/dashboard' : '/marketplace'} replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <SocketProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Buyer Routes */}
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Routes */}
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chats/:id"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Farmer Only Routes */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute requiredRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/create-listing"
              element={
                <ProtectedRoute requiredRole="farmer">
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/edit-listing/:id"
              element={
                <ProtectedRoute requiredRole="farmer">
                  <CreateListing />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/marketplace" replace />} />
          </Routes>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
            }}
          />
        </SocketProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
