
import React, { useState } from 'react';
import * as Y from 'yjs';
import { useYjs } from '../contexts/YjsContext';
import { useYjsArray } from '../hooks/useYjs';
import { Category, Product } from '../types';

export const ProductForm: React.FC = () => {
    const { doc } = useYjs();
    const categories = useYjsArray<Category>('categories');

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
    const [sku, setSku] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!doc || !name || !price || !stock || !categoryId || !sku) {
            alert('Please fill out all fields.');
            return;
        }

        const newProductData: Omit<Product, 'id'> = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            categoryId,
            sku,
            imageUrl: `https://picsum.photos/seed/${sku}/400/400`
        };

        const yProducts = doc.getArray('products') as Y.Array<Y.Map<any>>;
        const newId = `prod-${new Date().getTime()}`;
        
        const yProd = new Y.Map<any>();
        yProd.set('id', newId);
        Object.entries(newProductData).forEach(([key, value]) => {
            yProd.set(key, value);
        });
        
        yProducts.push([yProd]);

        // Reset form
        setName('');
        setPrice('');
        setStock('');
        setSku('');
        if (categories.length > 0) setCategoryId(categories[0].id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg">
            <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-300">Product Name</label>
                <input type="text" id="product-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-white" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-300">Price</label>
                    <input type="number" id="product-price" value={price} onChange={e => setPrice(e.target.value)} step="0.01" className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-white" required />
                </div>
                <div>
                    <label htmlFor="product-stock" className="block text-sm font-medium text-gray-300">Stock</label>
                    <input type="number" id="product-stock" value={stock} onChange={e => setStock(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-white" required/>
                </div>
            </div>
             <div>
                <label htmlFor="product-sku" className="block text-sm font-medium text-gray-300">SKU</label>
                <input type="text" id="product-sku" value={sku} onChange={e => setSku(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-white" required/>
            </div>
            <div>
                <label htmlFor="product-category" className="block text-sm font-medium text-gray-300">Category</label>
                <select id="product-category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary text-white" required>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit" className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-indigo-500 transition-colors">
                Add Product
            </button>
        </form>
    );
};
