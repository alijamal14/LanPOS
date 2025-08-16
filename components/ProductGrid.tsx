
import React, { useState } from 'react';
import { usePOS } from '../contexts/POSContext';
import { Product } from '../types';
import { MagnifyingGlassIcon } from './icons/Icons';

const ProductCard: React.FC<{ product: Product; onAddToCart: (id: string) => void }> = ({ product, onAddToCart }) => {
    return (
      <div 
        onClick={() => onAddToCart(product.id)}
        className="bg-gray-700 rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 flex flex-col"
      >
        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover"/>
        <div className="p-4 flex flex-col flex-grow justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{product.name}</h3>
              <p className="text-sm text-gray-400">Stock: {product.stock}</p>
            </div>
            <p className="text-xl font-bold text-brand-secondary mt-2">${product.price.toFixed(2)}</p>
        </div>
      </div>
    );
};


const ProductGrid: React.FC = () => {
  const { products, addToCart } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </span>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
        />
      </div>
      <div className="flex-grow overflow-y-auto pr-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
