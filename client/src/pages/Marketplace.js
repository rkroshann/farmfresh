import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Button, TextField, Select, MenuItem, FormControl,
  InputLabel, Box, Chip, InputAdornment, IconButton, AppBar,
  Toolbar, Avatar, Menu, MenuItem as MenuItemMui, Drawer, List,
  ListItem, ListItemIcon, ListItemText, Switch, FormControlLabel,
  CircularProgress, Alert, Badge
} from '@mui/material';
import {
  Search, FilterList, ShoppingCart, Chat, Person, Logout,
  Menu as MenuIcon, Dashboard, Receipt, Star, LocationOn,
  AddShoppingCart
} from '@mui/icons-material';
import { productAPI } from '../services/api';
import useStore from '../store/useStore';
import toast from 'react-hot-toast';
import CartDrawer from '../components/CartDrawer';

function Marketplace() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, filters, setFilters } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      if (filters.organic) params.organic = true;

      const response = await productAPI.getAll(params);
      setProducts(response.data.data.products);
    } catch (error) {
      // Fallback to static products when API is unavailable
      let filtered = [...staticProducts];
      if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
      if (filters.minPrice) filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
      if (filters.maxPrice) filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
      if (filters.search) filtered = filtered.filter(p => (p.name || p.title).toLowerCase().includes(filters.search.toLowerCase()));
      if (filters.organic) filtered = filtered.filter(p => p.organic);
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setCartCount(getCartCount());
    toast.success(`${product.name || product.title} added to cart! 🛒`);
    setIsCartOpen(true); // Open drawer on add
  };

  const handleFilterChange = (field, value) => {
    setFilters({ [field]: value });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa' }}>
      {/* App Bar */}
      <AppBar position="sticky" sx={{ background: '#fff', color: '#333', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, color: '#2e7d32', letterSpacing: -0.5 }}>
            🌾 FarmFresh
          </Typography>

          {/* Cart Icon — opens drawer */}
          <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
            <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={() => navigate('/chats')}>
                <Chat />
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate('/orders')}>
                <Receipt />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#2e7d32' }}>
                  {user?.profile?.name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItemMui onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                  <Person sx={{ mr: 1 }} /> Profile
                </MenuItemMui>
                <MenuItemMui onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItemMui>
              </Menu>
            </>
          ) : (
            <Button variant="outlined" color="primary" onClick={() => navigate('/login')} sx={{ ml: 2, borderRadius: 2 }}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
            Menu
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem button onClick={() => { navigate('/marketplace'); setDrawerOpen(false); }}>
              <ListItemIcon><ShoppingCart color="primary" /></ListItemIcon>
              <ListItemText primary="Marketplace" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>
            <ListItem button onClick={() => { setIsCartOpen(true); setDrawerOpen(false); }}>
              <ListItemIcon>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCart color="primary" />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="My Cart" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItem>

            {isAuthenticated && (
              <>
                <Divider sx={{ my: 2 }} />
                {user?.role === 'farmer' && (
                  <ListItem button onClick={() => { navigate('/farmer/dashboard'); setDrawerOpen(false); }}>
                    <ListItemIcon><Dashboard color="primary" /></ListItemIcon>
                    <ListItemText primary="Farmer Dashboard" primaryTypographyProps={{ fontWeight: 600 }} />
                  </ListItem>
                )}
                <ListItem button onClick={() => { navigate('/chats'); setDrawerOpen(false); }}>
                  <ListItemIcon><Chat color="primary" /></ListItemIcon>
                  <ListItemText primary="Messages" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItem>
                <ListItem button onClick={() => { navigate('/orders'); setDrawerOpen(false); }}>
                  <ListItemIcon><Receipt color="primary" /></ListItemIcon>
                  <ListItemText primary="My Orders" primaryTypographyProps={{ fontWeight: 600 }} />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 4 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Refine Results
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Produce</MenuItem>
              <MenuItem value="vegetables">🥕 Vegetables</MenuItem>
              <MenuItem value="fruits">🍎 Fruits</MenuItem>
              <MenuItem value="grains">🌾 Grains</MenuItem>
              <MenuItem value="dairy">🥛 Dairy</MenuItem>
              <MenuItem value="herbs">🌿 Herbs</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Price Range</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Min ₹"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Max ₹"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={filters.organic}
                onChange={(e) => handleFilterChange('organic', e.target.checked)}
                color="success"
              />
            }
            label="Organic Certified Only"
            sx={{ mt: 4, bgcolor: '#f1f8e9', p: 1, borderRadius: 2, mr: 0, width: '100%' }}
          />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        {/* Banner Section */}
        {!filters.search && !filters.category && (
          <Box
            sx={{
              mb: 6,
              p: 6,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #1b5e20, #4caf50)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(46, 125, 50, 0.2)'
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip label="Fresh from the farm" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 'bold', mb: 2 }} />
              <Typography variant="h3" fontWeight="900" gutterBottom>Harvest of the Week</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 500 }}>
                Get 100% organic produce delivered straight from our fields to your kitchen.
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ bgcolor: '#fff', color: '#2e7d32', fontWeight: 'bold', borderRadius: 3, '&:hover': { bgcolor: '#f0f0f0' } }}
              >
                Shop Now
              </Button>
            </Box>
            <Box component="span" sx={{ position: 'absolute', right: -40, bottom: -40, fontSize: 300, opacity: 0.1 }}>🥕</Box>
          </Box>
        )}

        {/* Search and Filter Bar */}
        <Box sx={{ mb: 5, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search for vegetables, fruits or dairy..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: 4, bgcolor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }
            }}
          />
          <Button
            variant="contained"
            disableElevation
            startIcon={<FilterList />}
            onClick={() => setFilterDrawerOpen(true)}
            sx={{ borderRadius: 4, px: 4, fontWeight: 'bold' }}
          >
            Filters
          </Button>
        </Box>

        {/* Seasonal / Featured Section */}
        {!loading && products.length > 0 && !filters.search && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">Fresh Today ☀️</Typography>
              <Typography color="primary" fontWeight="bold" sx={{ cursor: 'pointer' }}>View All</Typography>
            </Box>
            <Grid container spacing={3}>
              {products.slice(0, 3).map((product) => (
                <Grid item xs={12} sm={4} key={`featured-${product._id || product.id}`}>
                  <Card sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={(product.images && product.images[0]) || product.image || 'https://via.placeholder.com/300x200?text=Fresh+Produce'}
                    />
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      <Chip label="Seasonal" size="small" sx={{ bgcolor: '#ff9800', color: '#fff', fontWeight: 'bold' }} />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography fontWeight="bold">{product.name || product.title}</Typography>
                      <Typography color="primary" fontWeight="bold">₹{product.price || product.basePrice}/{product.unit}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Divider sx={{ mb: 6 }} />

        {/* Products Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {filters.category ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}` : 'All Products'}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            No products found matching your search. Try broadening your criteria!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product._id || product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    borderRadius: 4,
                    border: '1px solid #eee',
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 30px rgba(0,0,0,0.08)',
                      borderColor: 'transparent'
                    }
                  }}
                  onClick={() => (product._id || product.id) ? handleProductClick(product._id || product.id) : null}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.name || product.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {product.organic && (
                        <Chip label="Organic" size="small" sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 'bold', fontSize: 10 }} />
                      )}
                      {index % 3 === 0 && (
                        <Chip label="Fresh Today" size="small" sx={{ bgcolor: '#e91e63', color: '#fff', fontWeight: 'bold', fontSize: 10 }} />
                      )}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="800" noWrap sx={{ mb: 0.5 }}>
                      {product.name || product.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: 40,
                      fontSize: '0.85rem'
                    }}>
                      {product.description || 'Freshly harvested produce directly from our farm partners.'}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 900, lineHeight: 1 }}>
                          ₹{product.price || product.basePrice}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          per {product.unit}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={(e) => handleAddToCart(e, product)}
                        sx={{
                          bgcolor: '#e8f5e9',
                          color: '#2e7d32',
                          '&:hover': { bgcolor: '#2e7d32', color: '#fff' }
                        }}
                      >
                        <AddShoppingCart />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Cart Drawer Extension */}
      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Footer Branding */}
      <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#fff', borderTop: '1px solid #eee' }}>
        <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>🌾 FarmFresh Marketplace</Typography>
        <Typography variant="body2" color="text.secondary">Direct from farm to your kitchen table.</Typography>
      </Box>
    </Box>
  );
}

export default Marketplace;
