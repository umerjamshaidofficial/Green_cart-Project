import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('add-product');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const navigate = useNavigate();

  const notify = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('isSeller');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#fcfcfc] overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full sticky top-0">
        <div className="p-8">
          <h2 className="text-2xl font-black text-[#3BB77E]">GreenCart</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seller Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('add-product')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'add-product' ? 'bg-[#3BB77E] text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Add Product
          </button>
          <button 
            onClick={() => setActiveTab('product-list')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'product-list' ? 'bg-[#3BB77E] text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Product List
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === 'orders' ? 'bg-[#3BB77E] text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Orders List
          </button>
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button onClick={handleLogout} className="w-full text-left px-6 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all">
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto h-full">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-[#253D4E] capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-sm font-bold text-[#253D4E]">Hi, Admin</span>
              <span className="block text-[10px] font-bold text-[#3BB77E]">Store Manager</span>
            </div>
            <div className="w-10 h-10 bg-[#3BB77E] rounded-full"></div>
          </div>
        </header>

        {status.msg && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300 ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {status.type === 'success' ? '✓ ' : '✕ '}{status.msg}
          </div>
        )}

        {activeTab === 'add-product' && <AddProductForm notify={notify} />}
        {activeTab === 'product-list' && <ProductListSection notify={notify} />}
        {activeTab === 'orders' && <OrdersListSection notify={notify} />}
      </main>
    </div>
  );
};

// --- ADD PRODUCT SECTION ---
const AddProductForm = ({ notify }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: 'Vegetables', 
    price: '',
    offerPrice: '',
    image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData({ ...productData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productData.name || !productData.price || !productData.image) {
      notify('error', "Please provide a name, price, and image!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, inStock: true })
      });

      if (response.ok) {
        notify('success', "Product successfully saved to MongoDB.");
        setProductData({ name: '', description: '', category: 'Vegetables', price: '', offerPrice: '', image: null });
      }
    } catch (err) {
      notify('error', "Could not connect to the server.");
    }
  };

  return (
    <form onSubmit={handleAddProduct} className="max-w-4xl bg-white rounded-[32px] p-10 border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Product Image</label>
          <div className="relative aspect-square border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-[#3BB77E] cursor-pointer transition-all bg-[#fcfcfc] overflow-hidden">
            {productData.image ? (
              <img src={productData.image} alt="Preview" className="w-full h-full object-contain p-4" />
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-xl">+</div>
                <span className="text-[10px] font-bold text-gray-400">Click to Upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
            <input type="text" placeholder="e.g. Organic Tomato" value={productData.name} onChange={(e) => setProductData({...productData, name: e.target.value})} className="w-full px-6 py-4 bg-[#f7f8fd] border border-gray-100 rounded-2xl outline-none focus:border-[#3BB77E] font-medium" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Category Type</label>
            <select value={productData.category} onChange={(e) => setProductData({...productData, category: e.target.value})} className="w-full px-6 py-4 bg-[#f7f8fd] border border-gray-100 rounded-2xl outline-none focus:border-[#3BB77E] font-bold text-[#253D4E]">
              <option value="Vegetables">Vegetables</option>
              <option value="Fruit">Fruit</option>
              <option value="Bakery">Bakery</option>
              <option value="Instant">Instant</option>
              <option value="Dairy">Dairy</option>
              <option value="Grains">Grains</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Price ($)</label>
              <input type="number" placeholder="0.00" value={productData.price} onChange={(e) => setProductData({...productData, price: e.target.value})} className="w-full px-6 py-4 bg-[#f7f8fd] border border-gray-100 rounded-2xl outline-none focus:border-[#3BB77E]" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Offer Price ($)</label>
              <input type="number" placeholder="0.00" value={productData.offerPrice} onChange={(e) => setProductData({...productData, offerPrice: e.target.value})} className="w-full px-6 py-4 bg-[#f7f8fd] border border-gray-100 rounded-2xl outline-none focus:border-[#3BB77E]" />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#3BB77E] text-white py-5 rounded-2xl font-black text-lg hover:bg-[#2e9163] transition-all shadow-lg shadow-green-100">
            ADD TO STORE
          </button>
        </div>
      </div>
    </form>
  );
};

// --- PRODUCT LIST SECTION ---
const ProductListSection = ({ notify }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProducts(products.filter(p => p._id !== id));
        notify('error', 'Product removed from database.');
      }
    } catch (err) {
      notify('error', 'Failed to delete.');
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-[#fcfcfc] transition-colors">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <img src={product.image} alt="" className="w-12 h-12 object-contain bg-[#f7f8fd] rounded-xl p-1" />
                  <span className="font-bold text-[#253D4E] text-sm">{product.name}</span>
                </div>
              </td>
              <td className="px-8 py-5 text-gray-500 font-bold text-xs">{product.category}</td>
              <td className="px-8 py-5 font-black text-[#253D4E] text-sm">${product.price}</td>
              <td className="px-8 py-5 text-right">
                <button onClick={() => deleteProduct(product._id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- UPDATED ORDERS LIST SECTION (FOR MONGODB) ---
const OrdersListSection = ({ notify }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      if (response.ok) setOrders(data);
    } catch (err) {
      console.error("Order fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle order status (Pending <-> Fulfilled)
  const toggleOrderStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Fulfilled' : 'Pending';
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
        notify('success', `Order marked as ${newStatus}`);
      }
    } catch (err) {
      notify('error', 'Failed to update status.');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400 font-bold">Loading Orders...</div>;

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer Info</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Items</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Total Paid</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Method</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-[#fcfcfc] transition-colors">
              <td className="px-8 py-5">
                <p className="font-bold text-[#253D4E] text-sm">{order.customerName}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate max-w-[140px]">{order.address}</p>
              </td>
              <td className="px-8 py-5">
                <div className="space-y-1">
                  {order.items?.map((item, i) => (
                    <p key={i} className="text-[11px] text-gray-600 font-bold">
                      • {item.name} <span className="text-gray-400 font-medium">x{item.quantity}</span>
                    </p>
                  ))}
                </div>
              </td>
              <td className="px-8 py-5 font-black text-[#3BB77E] text-sm">${order.totalAmount?.toFixed(2)}</td>
              <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">
                {order.paymentMethod}
              </td>
              <td className="px-8 py-5 text-right">
                <button 
                  onClick={() => toggleOrderStatus(order._id, order.status)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all shadow-sm hover:scale-105 active:scale-95 ${
                    order.status === 'Fulfilled' 
                      ? 'bg-[#DEF9EC] text-[#3BB77E]' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {order.status || 'Pending'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <div className="p-20 text-center text-gray-400 font-bold italic">No orders found in the database.</div>}
    </div>
  );
};

export default SellerDashboard;