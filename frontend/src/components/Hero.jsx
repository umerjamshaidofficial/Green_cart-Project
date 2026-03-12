import React from 'react';
import { Link } from 'react-router-dom';
import bannerBg from '../assets/images/main_banner_bg.png';

const Hero = () => {
  return (
    <section className="px-6 py-2"> {/* Reduced vertical padding */}
      <div 
        // Reduced height from 450px to 350px for a more balanced look
        className="max-w-[1400px] mx-auto h-[350px] rounded-[30px] bg-cover bg-center flex items-center px-12 lg:px-20"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="max-w-lg">
          {/* Adjusted font sizes for the new height */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#253D4E] leading-tight mb-6">
            Freshness You Can Trust, <br /> 
            <span className="text-gray-600 font-medium text-2xl md:text-3xl">Savings You will Love!</span>
          </h1>
          
          <div className="flex items-center gap-4">
            <Link to="/all-products">
              <button className="bg-[#3BB77E] text-white px-8 py-3 rounded-full font-bold text-base hover:bg-[#2da16d] transition-all shadow-md">
                Shop now
              </button>
            </Link>

            <Link to="/all-products">
              <button className="text-[#253D4E] font-bold text-base flex items-center gap-2 hover:translate-x-1 transition-transform">
                Explore deals <span>→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;