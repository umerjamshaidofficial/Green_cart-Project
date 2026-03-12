const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  items: [
    {
      // Added productId as a String to prevent BSON/Cast errors
      productId: { type: String, required: false }, 
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    default: 'Cash On Delivery' 
  },
  status: { 
    type: String, 
    default: 'Pending' 
  },
  // Switched to timestamps: true style or kept Date for compatibility
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Order', OrderSchema);