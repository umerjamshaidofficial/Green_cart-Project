const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Product name is required"] 
  },
  description: { 
    type: String,
    default: "Fresh and premium quality produce directly from GreenCart sellers." 
  },
  category: { 
    type: String, 
    required: [true, "Category is required"],
    default: "General"
  },
  price: { 
    type: Number, 
    required: [true, "Price is required"],
    // Automatically converts strings like "20" to numbers
    set: v => v === '' ? 0 : Number(v) 
  },
  offerPrice: { 
    type: Number,
    // Automatically converts strings like "25" to numbers
    set: v => v === '' ? 0 : Number(v)
  },
  image: { 
    type: String, 
    required: [true, "Product image is required"] 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);