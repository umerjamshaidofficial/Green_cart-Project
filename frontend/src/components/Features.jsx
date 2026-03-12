import React from 'react';

// Exact imports from your src/assets/images folder
import deliveryIcon from '../assets/images/delivery_truck_icon.svg';
import freshIcon from '../assets/images/leaf_icon.svg';
import priceIcon from '../assets/images/coin_icon.svg';
import trustIcon from '../assets/images/trust_icon.svg';
// Import the new combined illustration image
import featuresIllustration from '../assets/images/feature_img_1.png';

const Features = () => {
  const featuresList = [
    {
      title: "Fastest Delivery",
      desc: "Groceries delivered in under 30 minutes.",
      icon: deliveryIcon
    },
    {
      title: "Freshness Guaranteed",
      desc: "Fresh produce straight from the source.",
      icon: freshIcon
    },
    {
      title: "Affordable Prices",
      desc: "Quality groceries at unbeatable prices.",
      icon: priceIcon
    },
    {
      title: "Trusted by Thousands",
      desc: "Loved by 10,000+ happy customers.",
      icon: trustIcon
    }
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-20 bg-[#F7FFF9] rounded-[40px] my-10 border border-green-50">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: New Complete Illustration */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center relative">
          {/* We use aspect-square to keep the container shape correct */}
          <div className="w-full max-w-[500px] aspect-square flex items-center justify-center">
            <img 
              src={featuresIllustration} 
              alt="Freshness you can trust illustration" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Right Side: Features Content (Kept as is) */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold text-[#253D4E] mb-12 leading-tight">
            Why We Are the Best?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featuresList.map((f, i) => (
              <div key={i} className="flex items-start gap-5 group">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#3BB77E] transition-all duration-300 border border-gray-50">
                  <img 
                    src={f.icon} 
                    alt={f.title} 
                    className="w-7 h-7 group-hover:brightness-0 group-hover:invert transition-all" 
                  />
                </div>
                <div>
                  <h3 className="font-bold text-[#253D4E] text-xl mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;