const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Models
const Product = require('./models/product'); 
const Order = require('./models/Order');     

const app = express();

// --- 1. SCHEMAS & MODELS ---

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: mongoose.Schema.Types.Mixed, default: "" } 
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: String }, 
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 }
    }
  ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);

// --- 2. MIDDLEWARE ---
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// --- 3. DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ GreenCart Database Connected!"))
  .catch((err) => console.log("❌ Connection Error:", err));

// --- 4. AUTH & USER ROUTES ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ fullName, email, password });
    await newUser.save();
    res.status(201).json({ id: newUser._id, fullName: newUser.fullName, email: newUser.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ id: user._id, fullName: user.fullName, email: user.email, address: user.address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/users/:id/address', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { address: req.body.address }, 
      { new: true }
    );
    res.json({ message: "Address updated", address: updatedUser.address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 5. CART ROUTES ---

app.get('/api/cart/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) cart = await Cart.create({ userId: req.params.userId, items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/cart/add', async (req, res) => {
  const { userId, product } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    const pId = String(product.id || product._id); 

    if (cart) {
      const itemIndex = cart.items.findIndex(p => p.productId === pId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ 
          productId: pId, 
          name: product.name, 
          price: product.price, 
          image: product.image, 
          quantity: 1 
        });
      }
      await cart.save();
    } else {
      cart = await Cart.create({ 
        userId, 
        items: [{ productId: pId, name: product.name, price: product.price, image: product.image, quantity: 1 }] 
      });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/cart/remove', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId !== productId);
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/cart/:userId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 6. PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADDED: Route to get a single product by ID for the Details Page
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID format or Server Error" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ 
      category: { $regex: new RegExp("^" + req.params.categoryName + "$", "i") } 
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 7. ORDER ROUTES ---

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.log("Order Save Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 8. SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 GreenCart Server running on port ${PORT}`));