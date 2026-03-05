const express = require('express');
const router = express.Router();
const store = require('../store');
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { orderId, rating, comment, aspects } = req.body;

    const order = store.orders.find(o => o._id === orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Can only review delivered orders' });
    }

    const isBuyer = order.buyer === req.userId;
    const isFarmer = order.farmer === req.userId;

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const existingReview = store.reviews.find(r => r.order === orderId && r.reviewer === req.userId);

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this order' });
    }

    const review = {
      _id: uuidv4(),
      order: orderId,
      reviewer: req.userId,
      reviewee: isBuyer ? order.farmer : order.buyer,
      reviewerRole: req.user.role,
      rating: Number(rating),
      comment,
      aspects: aspects || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.reviews.push(review);

    const revieweeIndex = store.users.findIndex(u => u._id === review.reviewee);
    if (revieweeIndex !== -1) {
      const reviewee = store.users[revieweeIndex];
      const totalRating = (reviewee.rating * reviewee.totalRatings) + Number(rating);
      reviewee.totalRatings += 1;
      reviewee.rating = totalRating / reviewee.totalRatings;
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = store.reviews
      .filter(r => r.reviewee === req.params.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20)
      .map(r => {
        const populated = { ...r };
        const reviewer = store.users.find(u => u._id === r.reviewer);
        if (reviewer) populated.reviewer = { _id: reviewer._id, profile: reviewer.profile };
        const order = store.orders.find(o => o._id === r.order);
        if (order) populated.order = { _id: order._id, product: order.product };
        return populated;
      });

    res.json({ success: true, data: { reviews } });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/reviews/check/:orderId
// @desc    Check if user has reviewed order
// @access  Private
router.get('/check/:orderId', auth, async (req, res) => {
  try {
    const review = store.reviews.find(r => r.order === req.params.orderId && r.reviewer === req.userId);

    res.json({ success: true, data: { hasReviewed: !!review } });
  } catch (error) {
    console.error('Check review error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
