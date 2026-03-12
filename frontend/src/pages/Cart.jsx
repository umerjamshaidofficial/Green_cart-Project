import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  
  const { 
    cartItems, 
    removeFromCart, 
    subtotal, 
    tax, 
    totalAmount, 
    shippingAddress, 
    saveAddress, 
    clearCart 
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // --- HANDLES DATABASE ADDRESS DELETION ---
  const handleDeleteAddress = async () => {
    try {
      await saveAddress(""); // Clears the address field in MongoDB
      setStatusMsg({ type: 'success', text: 'Address removed from your profile.' });
    } catch (error) {
      setStatusMsg({ type: 'error', text: 'Failed to remove address.' });
    }
  };

  // --- MONGODB ORDER PLACEMENT ---
  const handlePlaceOrder = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    
    if (!loggedInUser) {
      setStatusMsg({ type: 'error', text: 'Please login to place an order!' });
      return;
    }

    if (!shippingAddress) {
      setStatusMsg({ type: 'error', text: 'Please add a shipping address before placing your order!' });
      return;
    }

    setIsProcessing(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const finalTotal = (Number(totalAmount) || 0).toFixed(1);

      // Prepare the order object to match Order.js schema exactly
      const newOrder = {
        customerName: loggedInUser.fullName, 
        email: loggedInUser.email,          
        phone: typeof shippingAddress === 'object' ? shippingAddress.phone : "N/A",
        address: typeof shippingAddress === 'object' 
          ? `${shippingAddress.firstName} ${shippingAddress.lastName}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}` 
          : shippingAddress,                
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity || item.qty,
          image: item.image
        })), 
        totalAmount: Number(finalTotal),    
        paymentMethod: paymentMethod,       
        status: "Pending"
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save order');
      }

      // Capture the saved order from the backend to get the real MongoDB ID
      const savedOrder = await response.json();

      // Success logic
      await clearCart(); 
      setIsProcessing(false);
      
      // Pass the real database _id to the success page
      navigate('/order-success', { state: { orderId: savedOrder._id } });
        
    } catch (error) {
      console.error("Order processing error:", error);
      setIsProcessing(false);
      setStatusMsg({ type: 'error', text: `Backend Error: ${error.message}` });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#253D4E] mb-1">Shopping Cart</h1>
        <p className="text-gray-500 text-sm font-medium">
          Showing <span className="text-[#3BB77E] font-bold">{cartItems.length} items</span> in your cart
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-[#f7f8fd] rounded-3xl border border-dashed border-gray-200">
          <h2 className="text-xl font-bold text-[#253D4E] mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some fresh products to get started!</p>
          <Link 
            to="/all-products" 
            className="bg-[#3BB77E] text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all inline-block"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          <div className="w-full lg:w-[68%] bg-white">
            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f7f8fd] text-[#253D4E] font-bold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3 text-center">Qty</th>
                    <th className="px-5 py-3">Subtotal</th>
                    <th className="px-5 py-3 text-center">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr key={item.productId || item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-contain border border-gray-100 rounded-xl bg-white" />
                          <h3 className="font-bold text-[#253D4E] text-sm md:text-base">{item.name}</h3>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-[#253D4E] text-sm">${item.price}</td>
                      <td className="px-5 py-4 text-center font-bold text-gray-500 text-sm">{item.quantity || item.qty}</td>
                      <td className="px-5 py-4 font-bold text-[#3BB77E] text-sm">${(item.price * (item.quantity || item.qty)).toFixed(1)}</td>
                      <td className="px-5 py-4 text-center">
                        <button 
                          onClick={() => removeFromCart(item.productId || item.id)} 
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 text-xs"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <Link to="/all-products" className="inline-flex items-center gap-2 text-[#3BB77E] font-bold text-sm hover:translate-x-[-4px] transition-transform">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          <aside className="w-full lg:w-[32%] lg:sticky lg:top-24">
            
            {statusMsg.text && (
              <div className={`mb-4 p-4 rounded-xl text-xs font-bold flex justify-between items-center animate-pulse ${
                statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
              }`}>
                <span>{statusMsg.text}</span>
                <button onClick={() => setStatusMsg({ type: '', text: '' })} className="ml-2 font-black">✕</button>
              </div>
            )}

            <div className="bg-[#f7f8fd] border border-[#BCE3C9] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#253D4E] mb-6 border-b border-gray-200 pb-3">
                Order Summary
              </h2>

              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#253D4E] opacity-60">
                    Address
                  </span>
                  <div className="flex gap-3">
                    {shippingAddress && (
                      <button 
                        onClick={handleDeleteAddress}
                        className="text-red-500 font-bold text-[11px] hover:underline"
                      >
                        Delete
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/add-address')}
                      className="text-[#3BB77E] font-bold text-[11px] hover:underline"
                    >
                      {shippingAddress ? 'Change' : 'Add address'}
                    </button>
                  </div>
                </div>

                {shippingAddress ? (
                  <div className="text-[11px] bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                    {typeof shippingAddress === 'object' ? (
                      <>
                        <p className="font-bold text-[#253D4E] mb-1">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                        <p className="text-gray-600">{shippingAddress.street}</p>
                        <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                        <p className="text-[#3BB77E] font-bold mt-1">{shippingAddress.phone}</p>
                      </>
                    ) : (
                      <p className="text-gray-600 font-medium">{shippingAddress}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-xs font-medium bg-white px-3 py-4 rounded-xl border border-gray-100 text-gray-400 italic text-center">
                    No address found
                  </div>
                )}
              </div>

              <div className="mb-6">
                <span className="block text-[10px] font-black uppercase tracking-widest text-[#253D4E] opacity-60 mb-1.5">
                  Payment Method
                </span>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-[#253D4E] font-bold bg-white text-xs shadow-sm focus:border-[#3BB77E] cursor-pointer"
                >
                  <option value="Cash On Delivery">Cash On Delivery</option>
                  <option value="Credit/Debit Card">Credit/Debit Card</option>
                  <option value="Online Wallet">Online Wallet</option>
                </select>
              </div>

              <hr className="border-gray-200 mb-5" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-gray-500 text-xs font-bold">
                  <span>Price</span>
                  <span className="text-[#253D4E]">${(Number(subtotal) || 0).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-xs font-bold">
                  <span>Tax (2%)</span>
                  <span className="text-[#253D4E]">${(Number(tax) || 0).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                  <span className="text-lg font-bold text-[#253D4E]">Total:</span>
                  <span className="text-xl font-black text-[#3BB77E]">
                    ${(Number(totalAmount) || 0).toFixed(1)}
                  </span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-black text-base transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-3 ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#3BB77E] text-white hover:bg-[#2e9163]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;