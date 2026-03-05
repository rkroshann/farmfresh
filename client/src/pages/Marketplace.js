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
import staticProducts from '../data/products';
import { addToCart, getCartCount } from '../utils/cartManager';

function Marketplace() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, filters, setFilters } = useStore();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());

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
      if (filters.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
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
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🌾 FarmFresh
          </Typography>

          {/* Cart Icon — always visible */}
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartCount} color="secondary">
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
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
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
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Menu
          </Typography>
          <List>
            <ListItem button onClick={() => { navigate('/marketplace'); setDrawerOpen(false); }}>
              <ListItemIcon><ShoppingCart /></ListItemIcon>
              <ListItemText primary="Marketplace" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/cart'); setDrawerOpen(false); }}>
              <ListItemIcon>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </ListItemIcon>
              <ListItemText primary="My Cart" />
            </ListItem>

            {isAuthenticated && (
              <>
                {user?.role === 'farmer' && (
                  <ListItem button onClick={() => { navigate('/farmer/dashboard'); setDrawerOpen(false); }}>
                    <ListItemIcon><Dashboard /></ListItemIcon>
                    <ListItemText primary="My Dashboard" />
                  </ListItem>
                )}
                <ListItem button onClick={() => { navigate('/chats'); setDrawerOpen(false); }}>
                  <ListItemIcon><Chat /></ListItemIcon>
                  <ListItemText primary="Messages" />
                </ListItem>
                <ListItem button onClick={() => { navigate('/orders'); setDrawerOpen(false); }}>
                  <ListItemIcon><Receipt /></ListItemIcon>
                  <ListItemText primary="Orders" />
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
        <Box sx={{ width: 300, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="vegetables">Vegetables</MenuItem>
              <MenuItem value="fruits">Fruits</MenuItem>
              <MenuItem value="grains">Grains</MenuItem>
              <MenuItem value="dairy">Dairy</MenuItem>
              <MenuItem value="herbs">Herbs</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Min Price (₹)"
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Max Price (₹)"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Switch
                checked={filters.organic}
                onChange={(e) => handleFilterChange('organic', e.target.checked)}
              />
            }
            label="Organic Only"
            sx={{ mt: 2 }}
          />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Search and Filter Bar */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search produce..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setFilterDrawerOpen(true)}
          >
            Filters
          </Button>
        </Box>

        {/* Products Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info">
            No products found. Try adjusting your filters.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id || product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
                    }
                  }}
                  onClick={() => product._id ? handleProductClick(product._id) : null}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name || product.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="div" noWrap>
                        {product.name || product.title}
                      </Typography>
                      {product.organic && (
                        <Chip label="Organic" size="small" color="success" />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {(product.description || '').substring(0, 80)}{product.description && product.description.length > 80 ? '...' : ''}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        {(typeof product.location === 'string' ? product.location : product.location?.city) || product.farmer?.profile?.location?.city || 'Location not set'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        src={product.farmer?.profile?.avatar}
                        sx={{ width: 24, height: 24, mr: 1, bgcolor: '#4caf50', fontSize: 14 }}
                      >
                        {(typeof product.farmer === 'string' ? product.farmer : product.farmer?.profile?.name)?.[0]?.toUpperCase()}
                      </Avatar>
                      <Typography variant="caption">
                        {typeof product.farmer === 'string' ? product.farmer : product.farmer?.profile?.name}
                      </Typography>
                      {product.farmer?.rating > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                          <Star fontSize="small" sx={{ color: 'gold', fontSize: 16 }} />
                          <Typography variant="caption" sx={{ ml: 0.25 }}>
                            {product.farmer.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ₹{product.price || product.basePrice}/{product.unit}
                      </Typography>
                      {product.availableQuantity && (
                        <Chip
                          label={`${product.availableQuantity} ${product.unit}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>

                  {/* Add to Cart Button */}
                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<AddShoppingCart />}
                      onClick={(e) => handleAddToCart(e, product)}
                      sx={{
                        borderRadius: 2,
                        py: 1,
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #4caf50, #388e3c)',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #388e3c, #2e7d32)',
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
                        }
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Marketplace;
