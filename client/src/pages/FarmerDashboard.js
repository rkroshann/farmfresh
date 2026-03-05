import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, Typography, Button, Box,
  AppBar, Toolbar, IconButton, Paper, Alert
} from '@mui/material';
import { ArrowBack, Add } from '@mui/icons-material';
import { productAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getByFarmer(user.id || user._id);
      setProducts(response.data.data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/marketplace')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            Farmer Dashboard
          </Typography>
          <Button color="inherit" startIcon={<Add />} onClick={() => navigate('/farmer/create-listing')}>
            New Listing
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{products.length}</Typography>
                <Typography>Total Products</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">
                  {products.filter(p => p.status === 'active').length}
                </Typography>
                <Typography>Active Listings</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">
                  {products.reduce((sum, p) => sum + (p.views || 0), 0)}
                </Typography>
                <Typography>Total Views</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            My Products
          </Typography>
          {products.length === 0 ? (
            <Alert severity="info">
              No products yet. Create your first listing to get started!
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {products.map(product => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" noWrap>{product.title}</Typography>
                      <Typography color="text.secondary">
                        ₹{product.basePrice}/{product.unit}
                      </Typography>
                      <Typography variant="body2">
                        Available: {product.availableQuantity} {product.unit}
                      </Typography>
                      <Button 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default FarmerDashboard;
