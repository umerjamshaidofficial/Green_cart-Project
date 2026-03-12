import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

// Exact imports from your src/assets/images folder
import vegImg from '../assets/images/organic_vegitable_image.png';
import fruitImg from '../assets/images/fresh_fruits_image.png';
import drinkImg from '../assets/images/coca_cola_image.png';
import foodImg from '../assets/images/maggi_image.png';
import dairyImg from '../assets/images/dairy_product_image.png';
import bakeryImg from '../assets/images/bakery_image.png';
import cerealImg from '../assets/images/grain_image.png';

const categories = [
  // 'query' property added to match your database/static product categories
  { name: 'Organic veggies', query: 'Vegetables', image: vegImg, color: 'bg-[#F2FCE4]' },
  { name: 'Fresh Fruits', query: 'Fruits', image: fruitImg, color: 'bg-[#FFF3FF]' },
  { name: 'Cold Drinks', query: 'Drinks', image: drinkImg, color: 'bg-[#F2FCE4]' },
  { name: 'Instant Food', query: 'Instant', image: foodImg, color: 'bg-[#FEEFEA]' },
  { name: 'Dairy Products', query: 'Dairy', image: dairyImg, color: 'bg-[#FFFCEB]' },
  { name: 'Bakery & Breads', query: 'Bakery', image: bakeryImg, color: 'bg-[#FFF3EB]' },
  { name: 'Grains & Cereals', query: 'Grains', image: cerealImg, color: 'bg-[#F2FCE4]' },
];

const Categories = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="flex flex-wrap justify-center gap-10">
        {categories.map((cat, index) => (
          /* Wrap the entire item in a Link to redirect with the category filter */
          <Link 
            key={index} 
            to={`/all-products?category=${cat.query}`} 
            className="flex flex-col items-center gap-4 cursor-pointer group no-underline"
          >
            <div className={`w-28 h-28 rounded-full ${cat.color} flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-2`}>
              <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain" />
            </div>
            <span className="font-bold text-[#253D4E] text-[15px] group-hover:text-[#3BB77E] transition-colors text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;