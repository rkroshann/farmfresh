import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box,
  AppBar, Toolbar, IconButton, Grid, MenuItem, Switch,
  FormControlLabel, InputAdornment, Alert
} from '@mui/material';
import { ArrowBack, CloudUpload, Save } from '@mui/icons-material';
import { productAPI } from '../services/api';
import toast from 'react-hot-toast';

function CreateListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'vegetables',
    basePrice: '',
    quantity: '',
    unit: 'kg',
    availableTo: '',
    organic: false,
    deliveryPickup: true,
    deliveryDelivery: false,
    deliveryRadius: '10',
    deliveryFee: '0'
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      const product = response.data.data.product;
      setFormData({
        title: product.title,
        description: product.description,
        category: product.category,
        basePrice: product.basePrice,
        quantity: product.quantity,
        unit: product.unit,
        availableTo: product.availableTo.split('T')[0],
        organic: product.organic,
        deliveryPickup: product.deliveryOptions.pickup,
        deliveryDelivery: product.deliveryOptions.delivery,
        deliveryRadius: product.deliveryOptions.deliveryRadius,
        deliveryFee: product.deliveryOptions.deliveryFee
      });
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/farmer/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key.startsWith('delivery')) {
          return;
        }
        formDataToSend.append(key, formData[key]);
      });

      const deliveryOptions = {
        pickup: formData.deliveryPickup,
        delivery: formData.deliveryDelivery,
        deliveryRadius: formData.deliveryRadius,
        deliveryFee: formData.deliveryFee
      };
      formDataToSend.append('deliveryOptions', JSON.stringify(deliveryOptions));

      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      if (isEditing) {
        await productAPI.update(id, formDataToSend);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(formDataToSend);
        toast.success('Product listed successfully');
      }

      navigate('/farmer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/farmer/dashboard')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {isEditing ? 'Edit Listing' : 'Create New Listing'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>
              Product Details
            </Typography>

            <TextField
              fullWidth
              label="Product Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="vegetables">Vegetables</MenuItem>
                  <MenuItem value="fruits">Fruits</MenuItem>
                  <MenuItem value="grains">Grains</MenuItem>
                  <MenuItem value="dairy">Dairy</MenuItem>
                  <MenuItem value="herbs">Herbs</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="kg">Kilogram (kg)</MenuItem>
                  <MenuItem value="g">Gram (g)</MenuItem>
                  <MenuItem value="dozen">Dozen</MenuItem>
                  <MenuItem value="bunch">Bunch</MenuItem>
                  <MenuItem value="piece">Piece</MenuItem>
                  <MenuItem value="liter">Liter</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Base Price"
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Available Until"
                  name="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.organic}
                  onChange={handleChange}
                  name="organic"
                />
              }
              label="Organic Product"
              sx={{ mt: 2 }}
            />

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Delivery Options
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.deliveryPickup}
                  onChange={handleChange}
                  name="deliveryPickup"
                />
              }
              label="Pickup Available"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.deliveryDelivery}
                  onChange={handleChange}
                  name="deliveryDelivery"
                />
              }
              label="Home Delivery Available"
            />

            {formData.deliveryDelivery && (
               <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Delivery Radius (km)"
                    name="deliveryRadius"
                    type="number"
                    value={formData.deliveryRadius}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Delivery Fee (₹)"
                    name="deliveryFee"
                    type="number"
                    value={formData.deliveryFee}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            )}

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Product Images
            </Typography>

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Upload Images (Max 5)
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {images.length > 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {images.length} image(s) selected
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={<Save />}
              sx={{ mt: 4 }}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Listing'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreateListing;
