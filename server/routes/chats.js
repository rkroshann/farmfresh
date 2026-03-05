const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// @route   POST /api/chats
// @desc    Create or get existing chat
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, farmerId } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      product: productId,
      participants: { $all: [req.userId, farmerId] }
    }).populate('participants', 'profile.name profile.avatar role')
      .populate('product', 'title images basePrice');

    if (chat) {
      return res.json({
        success: true,
        data: { chat }
      });
    }

    // Create new chat
    chat = new Chat({
      participants: [req.userId, farmerId],
      product: productId,
      messages: [{
        sender: req.userId,
        text: 'Hi! I am interested in this product.',
        type: 'system'
      }],
      lastMessage: 'Hi! I am interested in this product.',
      lastMessageAt: new Date()
    });

    await chat.save();

    await chat.populate('participants', 'profile.name profile.avatar role');
    await chat.populate('product', 'title images basePrice');

    res.status(201).json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/chats
// @desc    Get user's chats
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId,
      status: 'active'
    })
      .populate('participants', 'profile.name profile.avatar role')
      .populate('product', 'title images basePrice status')
      .sort('-lastMessageAt');

    res.json({
      success: true,
      data: { chats }
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/chats/:id
// @desc    Get single chat with messages
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'profile.name profile.avatar role')
      .populate('product', 'title images basePrice farmer');

    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found' 
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.userId.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this chat' 
      });
    }

    // Mark messages as read
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.userId.toString()) {
        msg.read = true;
      }
    });

    await chat.save();

    res.json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/chats/:id/messages
// @desc    Send message
// @access  Private
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { text, type = 'text', offerDetails } = req.body;

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found' 
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.userId.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    const message = {
      sender: req.userId,
      text,
      type,
      offerDetails: type === 'offer' ? offerDetails : undefined,
      timestamp: new Date(),
      read: false
    };

    chat.messages.push(message);
    chat.lastMessage = text;
    chat.lastMessageAt = new Date();

    await chat.save();

    res.json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/chats/:chatId/offers/:messageId
// @desc    Accept or reject offer
// @access  Private
router.put('/:chatId/offers/:messageId', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ 
        success: false, 
        message: 'Chat not found' 
      });
    }

    const message = chat.messages.id(req.params.messageId);

    if (!message || message.type !== 'offer') {
      return res.status(404).json({ 
        success: false, 
        message: 'Offer not found' 
      });
    }

    message.offerDetails.status = status;

    // Add system message
    chat.messages.push({
      sender: req.userId,
      text: status === 'accepted' 
        ? `Offer of ₹${message.offerDetails.price} accepted` 
        : 'Offer rejected',
      type: 'system',
      timestamp: new Date()
    });

    chat.lastMessage = status === 'accepted' 
      ? `Offer accepted: ₹${message.offerDetails.price}` 
      : 'Offer rejected';
    chat.lastMessageAt = new Date();

    await chat.save();

    res.json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
