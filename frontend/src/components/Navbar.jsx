import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import logo from '../assets/images/logo.svg'; 
import searchIcon from '../assets/images/search_icon.svg';
import cartIcon from '../assets/images/nav_cart_icon.svg';

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { cartCount, clearCart } = useCart(); // Added clearCart from context
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // --- UPDATED LOGOUT LOGIC ---
  const handleLogout = () => {
    // 1. Clear the login status
    localStorage.removeItem('isLoggedIn');
    
    // 2. Clear the user object (This stops the address leak!)
    localStorage.removeItem('user');
    
    // 3. Optional: Clear the cart state in context immediately
    // If your clearCart function also resets shippingAddress, call it here
    if (clearCart) clearCart();

    // 4. Redirect to login
    navigate('/login');
    
    // 5. Force a reload (The "Nuclear Option" to ensure all states are wiped)
    window.location.reload();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      navigate('/all-products');
    }
  };

  return (
    <nav className="w-full bg-white py-4 border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link to="/">
            <img src={logo} alt="GreenCart" className="h-10 cursor-pointer" />
          </Link>
        </div>
        
        {/* Center: Navigation & Search */}
        <div className="hidden lg:flex items-center flex-1 justify-center gap-10">
          <ul className="flex items-center gap-8 text-[#253D4E] font-bold list-none">
            <li>
              <Link to="/" className="hover:text-[#3BB77E] cursor-pointer transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/all-products" className="hover:text-[#3BB77E] cursor-pointer transition-colors">
                All Product
              </Link>
            </li>
          </ul>

          <div className="flex items-center bg-[#f3f3f3] border border-[#BCE3C9] rounded-lg px-4 py-1 w-full max-w-sm ml-4">
            <input 
              type="text" 
              placeholder="Search products" 
              className="bg-transparent border-none outline-none w-full py-2 text-sm text-gray-700"
              value={searchTerm}
              onChange={handleSearchChange} 
            />
            <img src={searchIcon} alt="search" className="w-4 opacity-40" />
          </div>
        </div>

        {/* Right: Cart & Login/Profile */}
        <div className="flex items-center gap-8">
          <Link to="/cart" className="relative cursor-pointer">
             <img src={cartIcon} alt="cart" className="h-8" />
             <span className="absolute -top-2 -right-2 bg-[#3BB77E] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
               {cartCount || 0}
             </span>
          </Link>
          
          {!isLoggedIn ? (
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#3BB77E] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all"
            >
              Login
            </button>
          ) : (
            <div className="relative group py-2">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-transparent group-hover:border-[#3BB77E] transition-all">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                  alt="Profile" 
                  className="w-8 h-8 opacity-70"
                />
              </div>

              <div className="absolute right-0 top-full w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <Link 
                  to="/my-orders" 
                  className="block px-6 py-3 text-[#253D4E] font-bold text-sm hover:bg-[#f7f8fd] hover:text-[#3BB77E] transition-colors"
                >
                  My Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-3 text-[#253D4E] font-bold text-sm hover:bg-red-50 hover:text-red-500 transition-colors border-t border-gray-50 mt-1"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;