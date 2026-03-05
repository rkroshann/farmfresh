const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      organic,
      status = 'active',
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = { status };

    if (category) query.category = category;
    if (organic) query.organic = organic === 'true';
    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('farmer', 'profile.name profile.location profile.avatar rating')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'profile.name profile.location profile.avatar profile.phone rating totalRatings');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Farmer only)
router.post('/', [auth, requireRole('farmer')], upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      basePrice,
      quantity,
      unit,
      availableFrom,
      availableTo,
      deliveryOptions,
      location,
      organic
    } = req.body;

    // Get uploaded file paths
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = new Product({
      farmer: req.userId,
      title,
      description,
      category,
      images,
      basePrice,
      quantity,
      availableQuantity: quantity,
      unit,
      availableFrom: availableFrom || Date.now(),
      availableTo,
      deliveryOptions: deliveryOptions ? JSON.parse(deliveryOptions) : {},
      location: location ? JSON.parse(location) : req.user.profile.location,
      organic: organic === 'true'
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Farmer only - own products)
router.put('/:id', [auth, requireRole('farmer')], upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check ownership
    if (product.farmer.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this product' 
      });
    }

    // Update fields
    const allowedUpdates = [
      'title', 'description', 'category', 'basePrice', 
      'quantity', 'unit', 'availableTo', 'organic', 'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.deliveryOptions) {
      product.deliveryOptions = JSON.parse(req.body.deliveryOptions);
    }

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    // Update available quantity
    if (req.body.quantity) {
      const diff = req.body.quantity - product.quantity;
      product.availableQuantity += diff;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Farmer only - own products)
router.delete('/:id', [auth, requireRole('farmer')], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check ownership
    if (product.farmer.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this product' 
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/products/farmer/:farmerId
// @desc    Get products by farmer
// @access  Public
router.get('/farmer/:farmerId', async (req, res) => {
  try {
    const products = await Product.find({ 
      farmer: req.params.farmerId,
      status: 'active'
    }).sort('-createdAt');

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
