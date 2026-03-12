import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.svg';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Logo & Contact */}
        <div>
          <img src={logo} alt="GreenCart" className="h-10 mb-6" />
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Awesome grocery store website template
          </p>
          <div className="space-y-3">
            <p className="text-sm text-[#253D4E] flex gap-2">
              <span className="text-[#3BB77E] font-bold">Address:</span> 5171 W Campbell Ave
            </p>
            <p className="text-sm text-[#253D4E] flex gap-2">
              <span className="text-[#3BB77E] font-bold">Call Us:</span> (+91) - 540-025-1245
            </p>
            <p className="text-sm text-[#253D4E] flex gap-2">
              <span className="text-[#3BB77E] font-bold">Email:</span> sale@GreenCart.com
            </p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-xl font-bold text-[#253D4E] mb-6">Company</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li className="hover:text-[#3BB77E] cursor-pointer">About Us</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">Delivery Information</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">Privacy Policy</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* Column 3: Account */}
        <div>
          <h4 className="text-xl font-bold text-[#253D4E] mb-6">Account</h4>
          <ul className="space-y-3 text-gray-500 text-sm">
            <li className="hover:text-[#3BB77E] cursor-pointer">Sign In</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">View Cart</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">My Wishlist</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">Track My Order</li>
            <li className="hover:text-[#3BB77E] cursor-pointer">Help Ticket</li>
          </ul>
        </div>

        {/* Column 4: Social Media Icons */}
        <div>
          <h4 className="text-xl font-bold text-[#253D4E] mb-6">Follow Us</h4>
          <div className="flex gap-4">
            {/* Facebook */}
            <a href="#" className="w-10 h-10 rounded-full bg-[#f2f3f8] flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all duration-300 shadow-sm">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* Twitter / X */}
            <a href="#" className="w-10 h-10 rounded-full bg-[#f2f3f8] flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-all duration-300 shadow-sm">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="#" className="w-10 h-10 rounded-full bg-[#f2f3f8] flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 shadow-sm">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 11.001-4.125 2.062 2.062 0 010 4.125zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto px-6 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-xs">© 2026, GreenCart - All rights reserved</p>
        <div className="flex gap-4">
            <img src="https://nest-frontend-v6.netlify.app/assets/imgs/theme/payment-method.png" alt="Payment Methods" className="h-8 opacity-80" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;