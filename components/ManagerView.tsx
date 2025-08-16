import React from 'react';
import { useYjsArray } from '../hooks/useYjs';
import { Product } from '../types';
import { ProductForm } from './ProductForm';

const ProductListItem: React.FC<{product: Product}> = ({ product }) => (
    <li className="flex justify-between items-center p-3 bg-gray-800 rounded">
        <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-400">SKU: {product.sku}</p>
        </div>
        <div className="text-right">
             <p className="font-mono">${product.price.toFixed(2)}</p>
             <p className="text-sm text-gray-400">Stock: {product.stock}</p>
        </div>
    </li>
);


const ManagerView: React.FC = () => {
    const products = useYjsArray<Product>('products');

  return (
    <div className="p-8 text-white h-full overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6">Manager Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold mb-4 text-brand-secondary">Add New Product</h2>
              <ProductForm />
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-brand-secondary">Live Inventory</h2>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg h-[70vh] flex flex-col">
                {products.length > 0 ? (
                    <ul className="space-y-3 overflow-y-auto pr-2">
                        {[...products].sort((a, b) => a.name.localeCompare(b.name)).map(p => <ProductListItem key={p.id} product={p}/>)}
                    </ul>
                ) : (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-gray-500">No products found. Add one to get started.</p>
                    </div>
                )}
            </div>
          </div>

      </div>

    </div>
  );
};

export default ManagerView;
