const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'other']
  },
  images: [{
    type: String
  }],
  basePrice: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  availableQuantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'dozen', 'bunch', 'piece', 'liter']
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  availableTo: {
    type: Date,
    required: true
  },
  deliveryOptions: {
    pickup: {
      type: Boolean,
      default: true
    },
    delivery: {
      type: Boolean,
      default: false
    },
    deliveryRadius: {
      type: Number,
      default: 10
    },
    deliveryFee: {
      type: Number,
      default: 0
    }
  },
  location: {
    address: String,
    city: String,
    state: String,
    lat: Number,
    lng: Number
  },
  status: {
    type: String,
    enum: ['active', 'sold_out', 'archived'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  organic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Update status based on available quantity
productSchema.pre('save', function(next) {
  if (this.availableQuantity <= 0) {
    this.status = 'sold_out';
  }
  next();
});

// Create index for search
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
