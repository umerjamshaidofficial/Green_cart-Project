import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import successIllustration from '../assets/images/order_sucess.png';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely grab the orderId passed from Cart.jsx
  const { orderId } = location.state || {};

  // If someone tries to access this page directly without an order, redirect them
  useEffect(() => {
    if (!orderId) {
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        No order found. Redirecting to shop...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fd] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center border border-gray-100">
        
        <img src={successIllustration} alt="Success" className="w-48 mx-auto mb-6" />

        <h1 className="text-3xl font-black text-[#253D4E] mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 font-medium mb-8">
          Thank you for your purchase. Your order has been received and is now being processed.
        </p>

        {/* --- REFINED ORDER REFERENCE SECTION --- */}
        <div className="bg-[#f7f8fd] rounded-2xl p-5 mb-8 border border-gray-100 overflow-hidden">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold block mb-1">
            Order Reference
          </span>
          <span className="text-sm md:text-base font-mono font-bold text-[#253D4E] break-all">
            {orderId}
          </span>
        </div>

        <Link
          to="/"
          className="block w-full bg-[#3BB77E] text-white py-4 rounded-xl font-bold hover:bg-[#2e9163] transition-all shadow-lg shadow-green-100"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;