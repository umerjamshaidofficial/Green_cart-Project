import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const AllProducts = ({ searchTerm }) => {
  const { addToCart } = useCart();
  const location = useLocation(); // Hook to detect URL changes
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Featured');
  const [allStoreProducts, setAllStoreProducts] = useState([]);

  // 1. Sync state with URL Query Parameters (from Category Icons)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get('category');
    
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('All');
    }
  }, [location.search]); // Re-runs when user clicks a home page category

  // 2. Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        const formattedProducts = data.map(p => ({
          id: p._id, 
          name: p.name,
          price: parseFloat(p.price) || 0,
          oldPrice: p.offerPrice ? parseFloat(p.offerPrice) : (parseFloat(p.price) + 10),
          category: (p.category === 'Fruit' || p.category === 'Fruits') ? 'Fruits' : p.category,
          image: p.image,
          inStock: p.inStock !== undefined ? p.inStock : true 
        }));

        setAllStoreProducts(formattedProducts);
      } catch (err) {
        console.error("Error fetching products from MongoDB:", err);
      }
    };

    fetchProducts();
  }, []);

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Drinks', 'Grains', 'Bakery', 'Instant'];

  // 3. Filter Logic (Category + Search)
  const filteredProducts = allStoreProducts.filter(p => {
    const normalizedPCategory = (p.category === 'Fruit' || p.category === 'Fruits') ? 'Fruits' : p.category;
    const matchesCategory = selectedCategory === 'All' || normalizedPCategory === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes((searchTerm || "").toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 4. Sort Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10 bg-white items-start">
      
      {/* Sidebar Filter */}
      <aside className="w-full lg:w-1/4 sticky top-28 h-fit">
        <div className="border border-gray-100 rounded-3xl p-8 shadow-sm bg-[#f7f8fd]">
          <h3 className="text-2xl font-bold text-[#253D4E] mb-8 border-b border-gray-200 pb-4">Category</h3>
          <ul className="space-y-3">
            {categories.map((cat) => (
              <li 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`cursor-pointer flex items-center justify-between p-4 rounded-xl transition-all font-semibold ${
                  selectedCategory === cat 
                  ? 'bg-white text-[#3BB77E] shadow-md border border-[#BCE3C9]' 
                  : 'text-[#253D4E] hover:bg-white hover:text-[#3BB77E]'
                }`}
              >
                {cat}
                <span className="bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded-full">
                  {cat === 'All' 
                    ? allStoreProducts.length 
                    : allStoreProducts.filter(p => ((p.category === 'Fruit' || p.category === 'Fruits') ? 'Fruits' : p.category) === cat).length
                  }
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <p className="text-gray-500 text-lg font-medium">
            Showing <span className="text-[#3BB77E] font-bold">{sortedProducts.length}</span> items!
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-400">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-xl px-6 py-3 outline-none text-[#253D4E] font-bold bg-white shadow-sm focus:border-[#3BB77E]"
            >
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {sortedProducts.map((item) => (
            <div key={item.id} className={`border border-gray-100 rounded-3xl p-5 hover:shadow-2xl transition-all duration-300 bg-white group border-hover border-[#BCE3C9] ${!item.inStock ? 'opacity-75' : ''}`}>
              <Link to={`/product/${item.id}`}>
                <div className="relative h-44 bg-[#f7f8fd] rounded-2xl mb-5 flex items-center justify-center overflow-hidden cursor-pointer">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className={`w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500 ${!item.inStock ? 'grayscale' : ''}`} 
                  />
                  {!item.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase shadow-lg">
                      Sold Out
                    </div>
                  )}
                </div>
              </Link>

              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">{item.category}</p>
              
              <Link to={`/product/${item.id}`}>
                <h3 className="font-extrabold text-[#253D4E] mb-3 text-lg group-hover:text-[#3BB77E] transition-colors line-clamp-1 cursor-pointer">
                  {item.name}
                </h3>
              </Link>
              
              <div className="flex text-yellow-400 text-xs mb-4 gap-1">
                ★★★★☆ <span className="text-gray-400 ml-1 font-bold">(4.0)</span>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex flex-col">
                  <span className="text-[#3BB77E] font-black text-xl">${item.price}</span>
                  <span className="text-gray-400 line-through text-sm font-bold">${item.oldPrice}</span>
                </div>
                
                <button 
                  disabled={!item.inStock}
                  onClick={() => addToCart(item)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all shadow-sm active:scale-95 
                    ${item.inStock 
                      ? 'bg-[#DEF9EC] text-[#3BB77E] hover:bg-[#3BB77E] hover:text-white' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {item.inStock ? <><span className="text-xl">+</span> Add</> : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-400">No products found in this category.</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllProducts;