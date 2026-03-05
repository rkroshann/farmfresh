const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { orderId, rating, comment, aspects } = req.body;

    // Verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ 
        success: false, 
        message: 'Can only review delivered orders' 
      });
    }

    // Check if user is part of this order
    const isBuyer = order.buyer.toString() === req.userId.toString();
    const isFarmer = order.farmer.toString() === req.userId.toString();

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ 
      order: orderId, 
      reviewer: req.userId 
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this order' 
      });
    }

    // Create review
    const review = new Review({
      order: orderId,
      reviewer: req.userId,
      reviewee: isBuyer ? order.farmer : order.buyer,
      reviewerRole: req.user.role,
      rating,
      comment,
      aspects: aspects || {}
    });

    await review.save();

    // Update reviewee's rating
    const reviewee = await User.findById(review.reviewee);
    const totalRating = (reviewee.rating * reviewee.totalRatings) + rating;
    reviewee.totalRatings += 1;
    reviewee.rating = totalRating / reviewee.totalRatings;
    await reviewee.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'profile.name profile.avatar')
      .populate('order', 'product')
      .sort('-createdAt')
      .limit(20);

    res.json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/reviews/check/:orderId
// @desc    Check if user has reviewed order
// @access  Private
router.get('/check/:orderId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({ 
      order: req.params.orderId, 
      reviewer: req.userId 
    });

    res.json({
      success: true,
      data: { hasReviewed: !!review }
    });
  } catch (error) {
    console.error('Check review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
