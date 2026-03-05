import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Grid, Box, Typography, Button, Card, CardMedia,
  Avatar, Chip, Divider, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, AppBar, Toolbar, IconButton,
  CircularProgress, Rating
} from '@mui/material';
import {
  ArrowBack, Message, ShoppingCart, LocationOn, CalendarToday,
  LocalShipping, Inventory, Star
} from '@mui/icons-material';
import { productAPI, chatAPI, orderAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerDialog, setOfferDialog] = useState(false);
  const [orderDialog, setOrderDialog] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerQuantity, setOfferQuantity] = useState(1);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      setProduct(response.data.data.product);
      setOfferPrice(response.data.data.product.basePrice);
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleContactFarmer = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact farmer');
      navigate('/login');
      return;
    }

    try {
      const response = await chatAPI.create({
        productId: product._id,
        farmerId: product.farmer._id
      });
      navigate(`/chats/${response.data.data.chat._id}`);
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const handleMakeOffer = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to make an offer');
      navigate('/login');
      return;
    }

    try {
      const response = await chatAPI.create({
        productId: product._id,
        farmerId: product.farmer._id
      });

      const chatId = response.data.data.chat._id;

      await chatAPI.sendMessage(chatId, {
        text: `I'd like to buy ${offerQuantity} ${product.unit} at ₹${offerPrice}/${product.unit}`,
        type: 'offer',
        offerDetails: {
          price: offerPrice,
          quantity: offerQuantity
        }
      });

      toast.success('Offer sent to farmer!');
      navigate(`/chats/${chatId}`);
      setOfferDialog(false);
    } catch (error) {
      toast.error('Failed to send offer');
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    try {
      const response = await orderAPI.create({
        productId: product._id,
        farmerId: product.farmer._id,
        agreedPrice: product.basePrice,
        quantity: orderQuantity,
        deliveryMethod,
        paymentMethod: 'cod',
        deliveryAddress: deliveryMethod === 'delivery' ? user.profile.location : null
      });

      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.data.order._id}`);
      setOrderDialog(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Product Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                image={product.images[0] || 'https://via.placeholder.com/600x400'}
                alt={product.title}
                sx={{ height: 400, objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                  {product.title}
                </Typography>
                {product.organic && (
                  <Chip label="🌿 Organic" color="success" />
                )}
              </Box>

              <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                ₹{product.basePrice} / {product.unit}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              {/* Product Details */}
              <Box sx={{ my: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Inventory sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Available:</strong> {product.availableQuantity} {product.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Available Until:</strong> {new Date(product.availableTo).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalShipping sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>
                    <strong>Delivery:</strong> {product.deliveryOptions.delivery ? 'Available' : 'Pickup only'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Farmer Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Farmer Details
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={product.farmer.profile.avatar} sx={{ mr: 2 }} />
                  <Box>
                    <Typography fontWeight="medium">
                      {product.farmer.profile.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={product.farmer.rating} readOnly size="small" />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        ({product.farmer.totalRatings} reviews)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.location?.city}, {product.location?.state}
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              {user?.role !== 'farmer' && product.status === 'active' && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCart />}
                    onClick={() => setOrderDialog(true)}
                    disabled={product.availableQuantity === 0}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Message />}
                    onClick={handleContactFarmer}
                  >
                    Contact
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Order Dialog */}
      <Dialog open={orderDialog} onClose={() => setOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Place Order</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(Math.min(e.target.value, product.availableQuantity))}
            margin="normal"
            inputProps={{ min: 1, max: product.availableQuantity }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Max available: {product.availableQuantity} {product.unit}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Price per {product.unit}:</Typography>
              <Typography>₹{product.basePrice}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Quantity:</Typography>
              <Typography>{orderQuantity} {product.unit}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight="bold">Total:</Typography>
              <Typography fontWeight="bold" color="primary">
                ₹{(product.basePrice * orderQuantity).toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            Payment Method: Cash on Delivery
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePlaceOrder}>
            Confirm Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProductDetail;
