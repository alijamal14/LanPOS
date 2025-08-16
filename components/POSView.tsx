
import React from 'react';
import ProductGrid from './ProductGrid';
import Cart from './Cart';

const POSView: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-full">
      <div className="md:col-span-2 bg-gray-800 p-4 overflow-y-auto">
        <ProductGrid />
      </div>
      <div className="md:col-span-1 bg-gray-900 p-4">
        <Cart />
      </div>
    </div>
  );
};

export default POSView;
