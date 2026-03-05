const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agreedPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  deliveryAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending_payment', 'paid', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled', 'refunded'],
    default: 'pending_payment'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi', 'wallet'],
    default: 'cod'
  },
  paymentId: {
    type: String,
    default: ''
  },
  trackingUpdates: [{
    status: String,
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  expectedDeliveryDate: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for queries
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ farmer: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
