import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Auth = () => {
  // 1. CHANGE THIS TO YOUR ACTUAL RENDER URL
  const BASE_URL = "https://your-backend-name.onrender.com"; 

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    // 2. Updated to use BASE_URL
    const endpoint = isLogin 
      ? `${BASE_URL}/api/auth/login` 
      : `${BASE_URL}/api/auth/signup`;
    
    try {
      // --- ADMIN BYPASS LOGIC ---
      if (isLogin && formData.email === "admin@greencart.com" && formData.password === "admin123") {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isSeller', 'true'); 
        localStorage.setItem('user', JSON.stringify({ 
          id: "admin_root",
          email: formData.email, 
          fullName: "Admin",
          address: "" 
        }));
        
        window.location.href = '/seller-dashboard'; 
        return;
      }

      // --- API FETCH CALL ---
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (!isLogin) {
        setStatusMsg({ type: 'success', text: "Account created! Please login now." });
        setIsLogin(true);
        setFormData({ ...formData, password: '', fullName: '' });
      } else {
        localStorage.setItem('isLoggedIn', 'true');
        
        // Use the actual email from DB response for the seller check
        const isSeller = data.email === "admin@greencart.com";
        localStorage.setItem('isSeller', isSeller ? 'true' : 'false'); 
        
        localStorage.setItem('user', JSON.stringify({
          id: data.id || data._id, 
          email: data.email,
          fullName: data.fullName,
          address: data.address || "" 
        }));
        
        window.location.href = isSeller ? '/seller-dashboard' : '/'; 
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fd] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#253D4E] mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-500 font-medium">
            {isLogin ? 'Login to manage your orders' : 'Join our premium community'}
          </p>
        </div>

        {statusMsg.text && (
          <div className={`mb-6 p-4 rounded-xl text-xs font-bold flex justify-between items-center animate-fade-in ${
            statusMsg.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
          }`}>
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg({ type: '', text: '' })} className="ml-2 font-black">✕</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
              <input 
                name="fullName"
                type="text" 
                placeholder="Full Name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-[#f7f8fd] border border-gray-100 rounded-xl outline-none focus:border-[#3BB77E] transition-all font-medium text-[#253D4E]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="example@gmail.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-[#f7f8fd] border border-gray-100 rounded-xl outline-none focus:border-[#3BB77E] transition-all font-medium text-[#253D4E]"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-[#f7f8fd] border border-gray-100 rounded-xl outline-none focus:border-[#3BB77E] transition-all font-medium text-[#253D4E]"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#3BB77E] text-white py-4 rounded-xl font-black text-base hover:bg-[#2e9163] transition-all shadow-lg shadow-green-100 mt-4"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-gray-500 font-bold text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setStatusMsg({ type: '', text: '' });
              }}
              className="text-[#3BB77E] ml-2 hover:underline focus:outline-none"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-gray-400 font-medium hover:text-[#253D4E]">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
