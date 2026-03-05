const express = require('express');
const router = express.Router();
const store = require('../store');
const { v4: uuidv4 } = require('uuid');
const { auth } = require('../middleware/auth');

const populateChat = (chat) => {
  const result = { ...chat };

  result.participants = chat.participants.map(pid => {
    const user = store.users.find(u => u._id === pid);
    return user ? { _id: user._id, profile: user.profile, role: user.role } : null;
  }).filter(Boolean);

  const product = store.products.find(p => p._id === chat.product);
  if (product) {
    result.product = { _id: product._id, title: product.title, images: product.images, basePrice: product.basePrice, status: product.status, farmer: product.farmer };
  }

  return result;
};

// @route   POST /api/chats
// @desc    Create or get existing chat
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, farmerId } = req.body;

    const product = store.products.find(p => p._id === productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let chat = store.chats.find(c =>
      c.product === productId &&
      c.participants.includes(req.userId) &&
      c.participants.includes(farmerId)
    );

    if (chat) {
      return res.json({ success: true, data: { chat: populateChat(chat) } });
    }

    chat = {
      _id: uuidv4(),
      participants: [req.userId, farmerId],
      product: productId,
      messages: [{
        _id: uuidv4(),
        sender: req.userId,
        text: 'Hi! I am interested in this product.',
        type: 'system',
        timestamp: new Date(),
        read: false
      }],
      lastMessage: 'Hi! I am interested in this product.',
      lastMessageAt: new Date(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    store.chats.push(chat);

    res.status(201).json({ success: true, data: { chat: populateChat(chat) } });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/chats
// @desc    Get user's chats
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const chats = store.chats
      .filter(c => c.participants.includes(req.userId) && c.status === 'active')
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      .map(c => populateChat(c));

    res.json({ success: true, data: { chats } });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/chats/:id
// @desc    Get single chat with messages
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const chatIndex = store.chats.findIndex(c => c._id === req.params.id);

    if (chatIndex === -1) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const chat = store.chats[chatIndex];

    if (!chat.participants.includes(req.userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this chat' });
    }

    chat.messages.forEach(msg => {
      if (msg.sender !== req.userId) {
        msg.read = true;
      }
    });

    chat.updatedAt = new Date();

    res.json({ success: true, data: { chat: populateChat(chat) } });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/chats/:id/messages
// @desc    Send message
// @access  Private
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { text, type = 'text', offerDetails } = req.body;

    const chatIndex = store.chats.findIndex(c => c._id === req.params.id);

    if (chatIndex === -1) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const chat = store.chats[chatIndex];

    if (!chat.participants.includes(req.userId)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const message = {
      _id: uuidv4(),
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
    chat.updatedAt = new Date();

    res.json({ success: true, data: { message } });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/chats/:chatId/offers/:messageId
// @desc    Accept or reject offer
// @access  Private
router.put('/:chatId/offers/:messageId', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'

    const chatIndex = store.chats.findIndex(c => c._id === req.params.chatId);

    if (chatIndex === -1) {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    const chat = store.chats[chatIndex];
    const message = chat.messages.find(m => m._id === req.params.messageId);

    if (!message || message.type !== 'offer') {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    message.offerDetails.status = status;

    chat.messages.push({
      _id: uuidv4(),
      sender: req.userId,
      text: status === 'accepted' ? `Offer of ₹${message.offerDetails.price} accepted` : 'Offer rejected',
      type: 'system',
      timestamp: new Date(),
      read: false
    });

    chat.lastMessage = status === 'accepted' ? `Offer accepted: ₹${message.offerDetails.price}` : 'Offer rejected';
    chat.lastMessageAt = new Date();
    chat.updatedAt = new Date();

    res.json({ success: true, data: { chat: populateChat(chat) } });
  } catch (error) {
    console.error('Update offer error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
