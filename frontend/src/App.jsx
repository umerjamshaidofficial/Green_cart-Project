import React, { useEffect, useState } from 'react'; // Added useState
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// Ensure this path is 100% correct relative to App.jsx
import { CartProvider } from './context/CartContext'; 
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllProducts from './pages/AllProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress'; // Import added to resolve the routing error
import OrderSuccess from './pages/OrderSuccess'; // Added import for the success page
import Auth from './pages/Auth'; // Added import for Login/Signup page
import MyOrders from './pages/MyOrders'; // NEW: Added import for the orders history page
import Footer from './components/Footer';
// --- NEW: IMPORT SELLER DASHBOARD ---
import SellerDashboard from './pages/SellerDashboard';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- NEW: CONDITIONAL LAYOUT COMPONENT ---
const AppContent = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  
  // Define paths where you DON'T want the Navbar and Footer to show
  // Added '/seller-dashboard' to this check to support the seller interface layout
  const hideNavAndFooter = 
    location.pathname === '/order-success' || 
    location.pathname === '/login' || 
    location.pathname === '/seller-dashboard';

  return (
    <>
      <ScrollToTop />
      
      {/* Only show Navbar if not on success, login, or seller dashboard page */}
      {!hideNavAndFooter && (
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Combined AllProducts into one route and passed the searchTerm prop */}
        <Route path="/all-products" element={<AllProducts searchTerm={searchTerm} />} />
        
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        
        {/* New route for Login/Signup */}
        <Route path="/login" element={<Auth />} />

        {/* NEW: Route for the My Orders history page seen in profile dropdown */}
        <Route path="/my-orders" element={<MyOrders />} />

        {/* --- NEW: ROUTE FOR SELLER DASHBOARD --- */}
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
      </Routes>

      {/* Only show Footer if not on success, login, or seller dashboard page */}
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

function App() {
  // --- ADDED SEARCH STATE ---
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <CartProvider>
      <Router>
        <AppContent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </Router>
    </CartProvider>
  );
}

export default App;