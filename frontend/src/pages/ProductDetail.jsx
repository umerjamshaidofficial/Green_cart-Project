import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Product Image Imports
import potatoImg from '../assets/images/potato_image_1.png';
import tomatoImg from '../assets/images/tomato_image.png';
import appleImg from '../assets/images/apple_image.png';
import milkImg from '../assets/images/amul_milk_image.png';
import cokeImg from '../assets/images/coca_cola_image.png';
import riceImg from '../assets/images/basmati_rice_image.png';
import breadImg from '../assets/images/brown_bread_image.png';
import noodlesImg from '../assets/images/maggi_image.png';
import orangeImg from '../assets/images/orange_image.png'; 
import paneerImg from '../assets/images/paneer_image.png';
import spriteImg from '../assets/images/sprite_image_1.png';
import flourImg from '../assets/images/wheat_flour_image.png';
import croissantImg from '../assets/images/butter_croissant_image.png';
import soupImg from '../assets/images/knorr_soup_image.png';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticProducts = [
    { id: 1, name: 'Potato 500g', price: 35, oldPrice: 40, category: 'Vegetables', image: potatoImg, desc: 'Fresh and organic, rich in carbohydrates, ideal for curries and fries.' },
    { id: 2, name: 'Tomato 1 kg', price: 28, oldPrice: 30, category: 'Vegetables', image: tomatoImg, desc: 'Juicy red tomatoes perfect for salads and sauces.' },
    { id: 3, name: 'Apple 1 kg', price: 90, oldPrice: 100, category: 'Fruits', image: appleImg, desc: 'Crispy and sweet red apples from the best orchards.' },
    { id: 9, name: 'Orange 1 kg', price: 75, oldPrice: 80, category: 'Fruits', image: orangeImg, desc: 'Sweet and tangy citrus fruits, high in Vitamin C.' },
    { id: 4, name: 'Amul Milk 1L', price: 55, oldPrice: 60, category: 'Dairy', image: milkImg, desc: 'Pure and pasteurized dairy milk.' },
    { id: 10, name: 'Paneer 200g', price: 85, oldPrice: 90, category: 'Dairy', image: paneerImg, desc: 'Fresh and soft premium quality paneer.' },
    { id: 5, name: 'Coca-Cola 1.5L', price: 75, oldPrice: 80, category: 'Drinks', image: cokeImg, desc: 'Refreshing carbonated soft drink.' },
    { id: 11, name: 'Sprite 1.5L', price: 70, oldPrice: 75, category: 'Drinks', image: spriteImg, desc: 'Clear, lemon and lime-flavored soft drink.' },
    { id: 6, name: 'Basmati Rice 5kg', price: 520, oldPrice: 550, category: 'Grains', image: riceImg, desc: 'Long-grain aromatic basmati rice.' },
    { id: 12, name: 'Wheat Flour 5kg', price: 230, oldPrice: 250, category: 'Grains', image: flourImg, desc: 'Pure whole wheat flour for soft rotis.' },
    { id: 7, name: 'Brown Bread 400g', price: 35, oldPrice: 40, category: 'Bakery', image: breadImg, desc: 'Healthy whole wheat brown bread.' },
    { id: 13, name: 'Butter Croissant', price: 45, oldPrice: 50, category: 'Bakery', image: croissantImg, desc: 'Flaky and buttery fresh-baked croissants.' },
    { id: 8, name: 'Maggi Noodles 280g', price: 50, oldPrice: 55, category: 'Instant', image: noodlesImg, desc: 'Classic 2-minute instant noodles.' },
    { id: 14, name: 'Knorr Cup Soup', price: 30, oldPrice: 35, category: 'Instant', image: soupImg, desc: 'Healthy and delicious instant vegetable soup.' },
  ];

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        // 1. Try fetching from MongoDB
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          
          // Fetch related from DB
          const relatedRes = await fetch(`http://localhost:5000/api/products/category/${data.category}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            // Filter out current product
            setRelatedProducts(relatedData.filter(p => (p._id || p.id) !== id).slice(0, 5));
          }
        } else {
          // 2. Fallback to static if 404
          handleFallback();
        }
      } catch (error) {
        console.error("Fetch error:", error);
        handleFallback();
      } finally {
        setLoading(false);
      }
    };

    const handleFallback = () => {
      const foundStatic = staticProducts.find((p) => p.id == id);
      if (foundStatic) {
        setProduct(foundStatic);
        const relatedStatic = staticProducts
          .filter(p => p.category === foundStatic.category && p.id != foundStatic.id)
          .slice(0, 5);
        setRelatedProducts(relatedStatic);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleCartAction = (item, redirectToCart = false) => {
    // Normalize ID to prevent BSON or reference errors
    const normalizedItem = {
      ...item,
      id: item._id || item.id 
    };

    addToCart(normalizedItem); 
    if (redirectToCart) {
      setTimeout(() => navigate('/cart'), 10);
    }
  };

  if (loading) return <div className="text-center py-20 font-medium text-[#3BB77E]">Loading product details...</div>;
  if (!product) return <div className="text-center py-20 font-medium">Product not found!</div>;

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-8 bg-white">
      {/* Breadcrumbs */}
      <div className="text-[13px] text-gray-400 mb-6 flex items-center gap-1">
        <Link to="/" className="hover:text-[#3BB77E]">Home</Link> / 
        <Link to="/all-products" className="hover:text-[#3BB77E]">Products</Link> / 
        <span className="text-[#3BB77E]">{product.category}</span> / <span>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="flex flex-col md:flex-row gap-10 items-start mb-16">
        <div className="w-full md:w-5/12 border border-gray-100 rounded-[24px] p-8 flex items-center justify-center bg-white shadow-sm aspect-square">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain" 
          />
        </div>

        <div className="w-full md:w-7/12">
          <h1 className="text-4xl font-bold text-[#253D4E] mb-2">{product.name}</h1>
          <div className="flex text-yellow-400 text-xs mb-6 items-center">
            ★★★★☆ <span className="text-gray-400 ml-2">(4)</span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-gray-400 line-through text-base">
                MRP: ${product.oldPrice || (parseFloat(product.price) + 10)}
              </span>
              <span className="text-3xl font-bold text-[#3BB77E]">MRP: ${product.price}</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">(inclusive of all taxes)</p>
          </div>

          <div className="mb-8 bg-[#f8f9fd] p-6 rounded-2xl border border-gray-50">
            <h4 className="font-bold text-[#253D4E] mb-3 text-lg">ABOUT PRODUCT</h4>
            <ul className="text-gray-500 space-y-2 list-disc ml-5 text-sm leading-relaxed">
              <li>Fresh and organic produce directly sourced.</li>
              <li>Rich in nutrients and premium quality.</li>
              <li>{product.desc || product.description || "Fresh and premium quality produce directly from GreenCart sellers."}</li>
            </ul>
          </div>

          <div className="flex gap-3 max-w-md">
            <button 
              onClick={() => handleCartAction(product)}
              className="flex-1 border border-[#3BB77E] text-[#3BB77E] py-3 rounded-xl font-semibold text-sm hover:bg-[#3BB77E] hover:text-white transition-all active:scale-95"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => handleCartAction(product, true)}
              className="flex-1 bg-[#3BB77E] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2e9163] transition-all active:scale-95"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-50 mb-12" />

      {/* Related Products Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#253D4E] mb-8">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {relatedProducts.map((item) => (
            <div key={item._id || item.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all bg-white group">
              <Link to={`/product/${item._id || item.id}`}>
                <div className="h-32 flex items-center justify-center mb-3">
                  <img src={item.image} alt={item.name} className="h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <p className="text-[10px] uppercase font-semibold text-gray-400 mb-1">{item.category}</p>
                <h3 className="font-bold text-[#253D4E] text-sm group-hover:text-[#3BB77E] truncate">{item.name}</h3>
              </Link>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[#3BB77E] font-bold">${item.price}</span>
                <button 
                  onClick={() => handleCartAction(item)}
                  className="bg-[#DEF9EC] text-[#3BB77E] px-3 py-1 rounded-lg font-bold text-[10px] hover:bg-[#3BB77E] hover:text-white"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link to="/all-products">
            <button className="border border-[#3BB77E] text-[#3BB77E] px-8 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#3BB77E] hover:text-white transition-all">
              See more
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;