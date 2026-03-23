import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, Typography, Button, Box,
  AppBar, Toolbar, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Avatar,
  CircularProgress, Alert
} from '@mui/material';
import { ArrowBack, Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { productAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';

function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useStore();

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, soldOut: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all products then filter by logged-in farmer
      const response = await productAPI.getAll({ limit: 100, status: 'active' });
      const allActive = response.data.data.products || [];

      // Also try to get sold-out by calling without status filter
      // Since the public API only returns active, we filter what we can.
      // We identify our own products by farmer._id or farmer (string)
      const farmerId = user?.id || user?._id;

      const mine = allActive.filter((p) => {
        const pFarmer = p.farmer;
        if (!pFarmer) return false;
        // farmer can be a populated object or a plain string ID
        if (typeof pFarmer === 'object') return pFarmer._id === farmerId;
        return pFarmer === farmerId;
      });

      setProducts(mine);
      setStats({
        total: mine.length,
        active: mine.filter((p) => p.status === 'active').length,
        soldOut: mine.filter((p) => p.availableQuantity === 0 || p.status === 'sold_out').length,
      });
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        toast.success('Product deleted');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
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
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/farmer/create-listing')}
          >
            New Listing
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{stats.total}</Typography>
                <Typography>Total Products</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{stats.active}</Typography>
                <Typography>Active Listings</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h3">{stats.soldOut}</Typography>
                <Typography>Sold Out</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Products Table */}
        <Paper>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">My Products</Typography>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {!loading && error && (
            <Box sx={{ p: 3 }}>
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={fetchProducts}>
                    Retry
                  </Button>
                }
              >
                {error}
              </Alert>
            </Box>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary">
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Click "New Listing" to add your first product.
              </Typography>
            </Box>
          )}

          {/* Products Table */}
          {!loading && !error && products.length > 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Available</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={product.images?.[0]}
                            variant="rounded"
                            sx={{ mr: 2, width: 50, height: 50 }}
                          />
                          <div>
                            <Typography fontWeight="medium">{product.title}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.category}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>

                      <TableCell>₹{product.basePrice}/{product.unit}</TableCell>

                      <TableCell>
                        {product.availableQuantity} {product.unit}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={product.status === 'sold_out' ? 'Sold Out' : product.status}
                          size="small"
                          color={
                            product.status === 'active'
                              ? 'success'
                              : product.status === 'sold_out'
                              ? 'error'
                              : 'default'
                          }
                        />
                      </TableCell>

                      <TableCell>{product.views ?? 0}</TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          title="View"
                          onClick={() => navigate(`/products/${product._id}`)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Edit"
                          onClick={() =>
                            navigate(`/farmer/edit-listing/${product._id}`)
                          }
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          title="Delete"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default FarmerDashboard;
