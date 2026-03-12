import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Fixed: Added missing import

const MyOrders = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user data from local storage
  const userJson = localStorage.getItem('user');
  const loggedInUser = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    const fetchUserOrders = async () => {
      // Check for user email to fetch history
      if (!loggedInUser || !loggedInUser.email) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetching by email as it is a reliable unique identifier
        const response = await fetch(`http://localhost:5000/api/orders/user/${loggedInUser.email}`);
        const data = await response.json();
        
        if (response.ok) {
          setUserOrders(data);
        }
      } catch (error) {
        console.error("Error fetching MongoDB orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserOrders();
  }, [loggedInUser?.email]);

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-[#253D4E] uppercase tracking-tight">My Orders</h1>
        <Link to="/all-products" className="text-sm font-bold text-[#3BB77E] hover:underline">
          Back to Shop
        </Link>
      </div>
      
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-[#3BB77E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 font-bold">Loading your order history...</p>
          </div>
        ) : userOrders.length > 0 ? (
          userOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Header Info */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div className="max-w-[200px]">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Order Reference</span>
                  <span className="font-mono text-xs font-bold text-[#253D4E] break-all bg-gray-50 px-2 py-1 rounded">
                    {order._id}
                  </span>
                </div>
                
                <div className="text-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Date</span>
                  <span className="font-bold text-[#253D4E]">
                    {new Date(order.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="text-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Status</span>
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    order.status === 'Fulfilled' || order.status === 'Delivered'
                      ? 'bg-[#DEF9EC] text-[#3BB77E]' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status || 'Pending'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Total Paid</span>
                  <span className="font-black text-[#3BB77E] text-2xl">${order.totalAmount?.toFixed(1)}</span>
                </div>
              </div>

              {/* Products List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-[#f7f8fd] p-4 rounded-2xl border border-gray-50">
                    <img src={item.image} alt="" className="w-12 h-12 object-contain bg-white rounded-xl p-1 shadow-sm" />
                    <div>
                      <h4 className="font-bold text-[#253D4E] text-sm">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 font-bold">
                        {item.quantity || item.qty} × <span className="text-[#3BB77E]">${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Information */}
              {order.address && (
                <div className="pt-6 border-t border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Delivery Address</span>
                  <div className="text-[12px] text-gray-600 font-medium leading-relaxed bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <p className="font-bold text-[#253D4E] mb-1">{order.customerName}</p>
                    <p className="max-w-md">{order.address}</p>
                    <p className="text-[#3BB77E] font-bold mt-2">{order.phone}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold mb-4">You haven't placed any orders yet.</p>
            <Link 
              to="/all-products" 
              className="bg-[#3BB77E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#2e9163] transition-all inline-block shadow-lg shadow-green-100"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;