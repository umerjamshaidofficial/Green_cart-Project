import React from 'react';
import { Link } from 'react-router-dom'; // Added for navigation
import { useCart } from '../context/CartContext'; // Added for cart logic

// Exact imports for Best Sellers from your folder
import potatoImg from '../assets/images/potato_image_1.png';
import tomatoImg from '../assets/images/tomato_image.png';
import carrotImg from '../assets/images/carrot_image.png';
import spinachImg from '../assets/images/spinach_image_1.png';
import onionImg from '../assets/images/onion_image_1.png';

const products = [
  { id: 1, name: 'Potato', price: 5, oldPrice: 10, category: 'Vegetables', image: potatoImg },
  { id: 2, name: 'Tomato', price: 10, oldPrice: 15, category: 'Vegetables', image: tomatoImg },
  { id: 15, name: 'Carrot', price: 10, oldPrice: 15, category: 'Vegetables', image: carrotImg },
  { id: 16, name: 'Spinach', price: 15, oldPrice: 20, category: 'Vegetables', image: spinachImg },
  { id: 17, name: 'Onion ', price: 20, oldPrice: 25, category: 'Vegetables', image: onionImg },
];

const BestSellers = () => {
  const { addToCart } = useCart(); // Use the cart hook

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-[#253D4E] mb-8 text-center md:text-left">Best Sellers</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {products.map((item, index) => (
          <div key={index} className="border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 bg-white group">
            {/* Wrap image and name in Link to navigate to details */}
            <Link to={`/product/${item.id}`}>
              <div className="h-40 bg-[#f7f8fd] rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                 <img 
                   src={item.image} 
                   alt={item.name} 
                   className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-300" 
                 />
              </div>
              
              <p className="text-xs text-gray-400 mb-1">{item.category}</p>
              <h3 className="font-bold text-[#253D4E] mb-2 hover:text-[#3BB77E] transition-colors">{item.name}</h3>
            </Link>
            
            <div className="flex text-yellow-400 text-xs mb-3">
              ★★★★ <span className="text-gray-300 ml-1">★ (4)</span>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-baseline gap-2">
                <span className="text-[#3BB77E] font-bold text-lg">${item.price}</span>
                <span className="text-gray-400 line-through text-sm">${item.oldPrice}</span>
              </div>
              <button 
                onClick={() => addToCart(item)} // This updates the Navbar cart icon immediately
                className="bg-[#DEF9EC] text-[#3BB77E] px-4 py-2 rounded-md font-bold text-sm hover:bg-[#3BB77E] hover:text-white transition-all active:scale-95"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;