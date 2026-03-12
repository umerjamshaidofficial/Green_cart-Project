import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
// Import the high-definition SVG image
import add_address_image from '../assets/images/add_address_image.svg';

const AddAddress = () => {
  const navigate = useNavigate();
  
  // Use saveAddress for MongoDB synchronization
  const { saveAddress } = useCart(); 

  // Local state to manage form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  // Loading state to handle the database delay
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // We must await the database update before moving to the next page
      // This ensures when the Cart page loads, it fetches the fresh address from MongoDB
      await saveAddress(formData); 
      setLoading(false);
      navigate('/cart'); 
    } catch (error) {
      console.error("Database save failed:", error);
      setLoading(false);
      alert("Failed to save address. Please check your connection.");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-4 bg-white">
      <h1 className="text-2xl font-normal text-[#253D4E] mb-6">
        Add Shipping <span className="text-[#3BB77E] font-bold">Address</span>
      </h1>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Left Side: Address Form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-1/2 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full border border-gray-100 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
              onChange={handleChange}
              required
            />
          </div>
          
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="street"
            placeholder="Street"
            className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="zipCode"
              placeholder="Zip code"
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-[#3BB77E] text-sm"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-bold text-base transition-all uppercase mt-2 flex justify-center items-center ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3BB77E] hover:bg-[#2e9163]'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Address'}
          </button>
        </form>

        {/* Right Side: Shipping Illustration */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative">
             <img 
              src={add_address_image} 
              alt="Shipping Illustration" 
              className="max-w-full h-[300px] object-contain" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;