const express = require('express');
const router = express.Router();
const store = require('../store');
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');

const populateProductAndUsers = (order, fields = {}) => {
  const result = { ...order };

  const product = store.products.find(p => p._id === order.product);
  if (product) {
    result.product = { _id: product._id, title: product.title, images: product.images, category: product.category, unit: product.unit };
  }

  const buyer = store.users.find(u => u._id === order.buyer);
  if (buyer) {
    result.buyer = { _id: buyer._id, profile: buyer.profile };
  }

  const farmer = store.users.find(u => u._id === order.farmer);
  if (farmer) {
    result.farmer = { _id: farmer._id, profile: farmer.profile };
  }

  return result;
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Buyer)
router.post('/', auth, async (req, res) => {
  try {
    const { productId, farmerId, agreedPrice, quantity, deliveryMethod, deliveryAddress, paymentMethod = 'cod', notes } = req.body;

    const productIndex = store.products.findIndex(p => p._id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = store.products[productIndex];

    if (product.availableQuantity < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.availableQuantity} ${product.unit} available` });
    }

    const deliveryFee = deliveryMethod === 'delivery' ? product.deliveryOptions.deliveryFee : 0;
    const totalAmount = (agreedPrice * quantity) + deliveryFee;

    const newOrder = {
      _id: uuidv4(),
      product: productId,
      buyer: req.userId,
      farmer: farmerId,
      agreedPrice: Number(agreedPrice),
      quantity: Number(quantity),
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
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.orders.push(newOrder);

    store.products[productIndex].availableQuantity -= quantity;
    if (store.products[productIndex].availableQuantity <= 0) {
      store.products[productIndex].status = 'sold_out';
    }

    const populatedOrder = populateProductAndUsers(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order: populatedOrder }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;

    let filtered = store.orders.filter(o => {
      if (req.user.role === 'buyer') {
        return o.buyer === req.userId;
      } else {
        return o.farmer === req.userId;
      }
    });

    if (status) {
      filtered = filtered.filter(o => o.status === status);
    }

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const orders = filtered.map(o => populateProductAndUsers(o));

    res.json({ success: true, data: { orders } });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = store.orders.find(o => o._id === req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyer !== req.userId && order.farmer !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const populatedOrder = populateProductAndUsers(order);

    res.json({ success: true, data: { order: populatedOrder } });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Farmer or Buyer)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;

    const orderIndex = store.orders.findIndex(o => o._id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = store.orders[orderIndex];

    const isFarmer = order.farmer === req.userId;
    const isBuyer = order.buyer === req.userId;

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const farmerStatuses = ['confirmed', 'preparing', 'in_transit'];
    const buyerStatuses = ['delivered'];

    if (isFarmer && !farmerStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update' });
    }

    if (isBuyer && !buyerStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update' });
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

    order.updatedAt = new Date();

    res.json({
      success: true,
      message: 'Order status updated',
      data: { order }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const orderIndex = store.orders.findIndex(o => o._id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = store.orders[orderIndex];

    if (order.buyer !== req.userId && order.farmer !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel delivered order' });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;

    order.trackingUpdates.push({
      status: 'cancelled',
      note: `Order cancelled: ${reason}`,
      timestamp: new Date()
    });

    order.updatedAt = new Date();

    const productIndex = store.products.findIndex(p => p._id === order.product);
    if (productIndex !== -1) {
      store.products[productIndex].availableQuantity += order.quantity;
    }

    res.json({
      success: true,
      message: 'Order cancelled',
      data: { order }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
