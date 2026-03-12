import React, { useState, useEffect } from 'react';

const SellerProductList = () => {
  const [products, setProducts] = useState([]);

  // Load only products added by the seller
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('allProducts')) || [];
    setProducts(savedProducts);
  }, []);

  // --- Toggle Stock Status ---
  const toggleStock = (productId) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, inStock: !p.inStock }; // Switches true/false
      }
      return p;
    });
    updateStorage(updatedProducts);
  };

  // --- Remove Product from Inventory ---
  const deleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      const updatedProducts = products.filter(p => p.id !== productId);
      updateStorage(updatedProducts);
    }
  };

  // Helper to sync state and LocalStorage
  const updateStorage = (newProducts) => {
    setProducts(newProducts);
    localStorage.setItem('allProducts', JSON.stringify(newProducts));
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#253D4E]">Inventory Management</h2>
        <span className="text-sm font-medium text-gray-500">
          Total Products: <span className="text-[#3BB77E]">{products.length}</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
              <th className="pb-4 font-black">Product</th>
              <th className="pb-4 font-black">Category</th>
              <th className="pb-4 font-black">Price</th>
              <th className="pb-4 font-black">Status</th>
              <th className="pb-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr key={product.id} className="group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} className="w-10 h-10 object-contain bg-[#f7f8fd] rounded-lg" alt="" />
                    <span className="font-bold text-[#253D4E] text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-500 font-medium">{product.category}</td>
                <td className="py-4 font-bold text-[#253D4E] text-sm">${product.price}</td>
                <td className="py-4">
                  <button 
                    onClick={() => toggleStock(product.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                      product.inStock 
                        ? 'bg-[#DEF9EC] text-[#3BB77E]' 
                        : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {product.inStock ? '● In Stock' : '○ Out of Stock'}
                  </button>
                </td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <span className="text-lg">🗑</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-10 text-gray-400 italic text-sm">
            No products in your inventory yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProductList;