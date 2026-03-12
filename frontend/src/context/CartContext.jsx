import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(true);

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      return null;
    }
  };

  // --- FIX 1: RE-FETCH ON USER CHANGE ---
  // This effect now watches for changes in the 'user' ID to sync data
  useEffect(() => {
    const syncUserData = async () => {
      const user = getUser();
      
      // If no user is logged in, RESET everything to empty
      if (!user || !user.id) {
        setCartItems([]);
        setShippingAddress("");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Sync Cart from MongoDB
        const cartRes = await fetch(`/api/cart/${user.id}`);
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setCartItems(cartData.items || []);
        }

        // Sync Address: Prioritize the user object in localStorage 
        setShippingAddress(user.address || "");
      } catch (err) {
        console.error("Failed to sync with MongoDB:", err);
      } finally {
        setLoading(false);
      }
    };

    syncUserData();
    
    // Optional: Listen for storage changes (helps if login happens in another tab)
    const handleStorageChange = () => syncUserData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
    
  }, []); // Note: If you have a Login function that doesn't refresh the page, 
          // you should pass the user/token here as a dependency.

  // --- 2. ADD TO CART ---
  const addToCart = async (product) => {
    const user = getUser();
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, product })
      });
      
      const updatedCart = await response.json();
      if (response.ok) {
        setCartItems(updatedCart.items);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // --- 3. REMOVE FROM CART ---
  const removeFromCart = async (productId) => {
    const user = getUser();
    if (!user) return;

    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId })
      });
      
      const updatedCart = await response.json();
      if (response.ok) {
        setCartItems(updatedCart.items);
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // --- 4. SAVE & DELETE ADDRESS ---
  const saveAddress = async (newAddress) => {
    const user = getUser();
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newAddress })
      });
      
      if (response.ok) {
        setShippingAddress(newAddress);
        const updatedUser = { ...user, address: newAddress };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true; 
      }
    } catch (err) {
      console.error("Error updating address:", err);
      throw err;
    }
  };

  // --- 5. CLEAR CART ---
  const clearCart = async () => {
    const user = getUser();
    if (!user) {
      // If called during logout, just clear the UI state
      setCartItems([]);
      setShippingAddress("");
      return;
    };

    try {
      const response = await fetch(`/api/cart/${user.id}`, { method: 'DELETE' });
      if (response.ok) {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  // --- MATH CALCULATIONS ---
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || item.qty || 1)), 0);
  const tax = subtotal * 0.02; 
  const totalAmount = subtotal + tax;
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || item.qty || 0), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        subtotal, 
        tax, 
        totalAmount, 
        cartCount,
        shippingAddress, 
        saveAddress,
        clearCart,
        loading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);