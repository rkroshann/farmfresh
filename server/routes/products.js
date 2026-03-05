const express = require('express');
const router = express.Router();
const store = require('../store');
const { v4: uuidv4 } = require('uuid');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Helper to populate farmer
const populateFarmer = (product, fields = []) => {
  const farmer = store.users.find(u => u._id === product.farmer);
  if (!farmer) return product;

  const populated = { ...product };
  populated.farmer = { _id: farmer._id };

  if (fields.includes('profile.name')) populated.farmer.profile = { ...populated.farmer.profile, name: farmer.profile.name };
  if (fields.includes('profile.location')) populated.farmer.profile = { ...populated.farmer.profile, location: farmer.profile.location };
  if (fields.includes('profile.avatar')) populated.farmer.profile = { ...populated.farmer.profile, avatar: farmer.profile.avatar };
  if (fields.includes('profile.phone')) populated.farmer.profile = { ...populated.farmer.profile, phone: farmer.profile.phone };
  if (fields.includes('rating')) populated.farmer.rating = farmer.rating;
  if (fields.includes('totalRatings')) populated.farmer.totalRatings = farmer.totalRatings;

  return populated;
};

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category, minPrice, maxPrice, search, organic,
      status = 'active', sort = '-createdAt', page = 1, limit = 12
    } = req.query;

    let filtered = store.products.filter(p => p.status === status);

    if (category) filtered = filtered.filter(p => p.category === category);
    if (organic !== undefined) filtered = filtered.filter(p => p.organic === (organic === 'true'));
    if (minPrice) filtered = filtered.filter(p => p.basePrice >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.basePrice <= Number(maxPrice));

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (sort === '-createdAt') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'createdAt') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    const count = filtered.length;

    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    const products = paginated.map(p => populateFarmer(p, ['profile.name', 'profile.location', 'profile.avatar', 'rating']));

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        total: count
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const productIndex = store.products.findIndex(p => p._id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    store.products[productIndex].views += 1;

    const product = populateFarmer(store.products[productIndex], [
      'profile.name', 'profile.location', 'profile.avatar', 'profile.phone', 'rating', 'totalRatings'
    ]);

    res.json({ success: true, data: { product } });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Farmer only)
router.post('/', [auth, requireRole('farmer')], upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, category, basePrice, quantity, unit, availableFrom, availableTo, deliveryOptions, location, organic } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const newProduct = {
      _id: uuidv4(),
      farmer: req.userId,
      title,
      description,
      category,
      images,
      basePrice: Number(basePrice),
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
      unit,
      availableFrom: availableFrom || new Date(),
      availableTo,
      deliveryOptions: deliveryOptions ? JSON.parse(deliveryOptions) : {},
      location: location ? JSON.parse(location) : req.user.profile.location,
      organic: organic === 'true',
      status: 'active',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: newProduct }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Farmer only - own products)
router.put('/:id', [auth, requireRole('farmer')], upload.array('images', 5), async (req, res) => {
  try {
    const productIndex = store.products.findIndex(p => p._id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = store.products[productIndex];

    if (product.farmer !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const allowedUpdates = ['title', 'description', 'category', 'basePrice', 'quantity', 'unit', 'availableTo', 'organic', 'status'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = field === 'basePrice' || field === 'quantity' ? Number(req.body[field]) : req.body[field];
      }
    });

    if (req.body.deliveryOptions) {
      product.deliveryOptions = JSON.parse(req.body.deliveryOptions);
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    if (req.body.quantity) {
      const diff = Number(req.body.quantity) - product.quantity;
      product.availableQuantity += diff;
    }

    if (product.availableQuantity <= 0) {
      product.status = 'sold_out';
    }

    product.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Farmer only - own products)
router.delete('/:id', [auth, requireRole('farmer')], async (req, res) => {
  try {
    const productIndex = store.products.findIndex(p => p._id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (store.products[productIndex].farmer !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    store.products.splice(productIndex, 1);

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/products/farmer/:farmerId
// @desc    Get products by farmer
// @access  Public
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = store.products
      .filter(p => p.farmer === req.params.farmerId && p.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: { products } });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
