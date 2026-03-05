const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Buyer)
router.post('/', auth, async (req, res) => {
  try {
    const {
      productId,
      farmerId,
      agreedPrice,
      quantity,
      deliveryMethod,
      deliveryAddress,
      paymentMethod = 'cod',
      notes
    } = req.body;

    // Verify product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check availability
    if (product.availableQuantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Only ${product.availableQuantity} ${product.unit} available` 
      });
    }

    // Calculate total
    const deliveryFee = deliveryMethod === 'delivery' ? product.deliveryOptions.deliveryFee : 0;
    const totalAmount = (agreedPrice * quantity) + deliveryFee;

    // Create order
    const order = new Order({
      product: productId,
      buyer: req.userId,
      farmer: farmerId,
      agreedPrice,
      quantity,
      totalAmount,
      deliveryMethod,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : null,
      deliveryFee,
      paymentMethod,
      notes,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending_payment',
      trackingUpdates: [{
        status: 'Order Placed',
        note: 'Your order has been placed successfully',
        timestamp: new Date()
      }]
    });

    await order.save();

    // Update product quantity
    product.availableQuantity -= quantity;
    await product.save();

    await order.populate('product', 'title images');
    await order.populate('farmer', 'profile.name profile.phone');
    await order.populate('buyer', 'profile.name profile.phone');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;

    const query = {};
    
    // Filter by role
    if (req.user.role === 'buyer') {
      query.buyer = req.userId;
    } else {
      query.farmer = req.userId;
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('product', 'title images category')
      .populate('buyer', 'profile.name profile.phone profile.avatar')
      .populate('farmer', 'profile.name profile.phone profile.avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'title images category unit')
      .populate('buyer', 'profile.name profile.phone profile.avatar')
      .populate('farmer', 'profile.name profile.phone profile.avatar profile.location');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check authorization
    if (order.buyer._id.toString() !== req.userId.toString() && 
        order.farmer._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Farmer or Buyer)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Only farmer can update to preparing/in_transit
    // Only buyer can update to delivered
    const isFarmer = order.farmer.toString() === req.userId.toString();
    const isBuyer = order.buyer.toString() === req.userId.toString();

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Validate status transitions
    const farmerStatuses = ['confirmed', 'preparing', 'in_transit'];
    const buyerStatuses = ['delivered'];

    if (isFarmer && !farmerStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status update' 
      });
    }

    if (isBuyer && !buyerStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status update' 
      });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    order.trackingUpdates.push({
      status,
      note: note || `Order status updated to ${status}`,
      timestamp: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check authorization
    if (order.buyer.toString() !== req.userId.toString() && 
        order.farmer.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Can't cancel if already delivered
    if (order.status === 'delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel delivered order' 
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;

    order.trackingUpdates.push({
      status: 'cancelled',
      note: `Order cancelled: ${reason}`,
      timestamp: new Date()
    });

    await order.save();

    // Restore product quantity
    const product = await Product.findById(order.product);
    if (product) {
      product.availableQuantity += order.quantity;
      await product.save();
    }

    res.json({
      success: true,
      message: 'Order cancelled',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
