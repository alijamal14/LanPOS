
import React, { useState } from 'react';
import { usePOS } from '../contexts/POSContext';
import { Product } from '../types';
import PaymentModal from './PaymentModal';
import { TrashIcon } from './icons/Icons';

const CartItemRow: React.FC<{ item: { productId: string; quantity: number; unitPrice: number }, product?: Product }> = ({ item, product }) => {
    const { updateCartItemQuantity, removeFromCart } = usePOS();

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex-grow">
                <p className="font-semibold text-white">{product?.name || 'Loading...'}</p>
                <p className="text-sm text-gray-400">${item.unitPrice.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-3">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCartItemQuantity(item.productId, parseInt(e.target.value, 10))}
                    className="w-16 bg-gray-800 text-white rounded-md text-center border border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <p className="w-20 text-right font-semibold text-white">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.productId)} className="text-gray-500 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const Cart: React.FC = () => {
    const { cart, products, cartSubtotal, cartTax, cartTotal, clearCart } = usePOS();
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

    const getProductById = (id: string) => products.find(p => p.id === id);

    return (
        <div className="bg-gray-900 text-white flex flex-col h-full rounded-lg">
            <h2 className="text-2xl font-bold border-b border-gray-700 pb-3 mb-3">Cart</h2>
            
            {cart.items.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                    <p>Cart is empty</p>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto pr-2">
                    {cart.items.map(item => (
                        <CartItemRow key={item.productId} item={item} product={getProductById(item.productId)} />
                    ))}
                </div>
            )}
            
            <div className="border-t border-gray-700 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg text-gray-400">
                    <span>Tax</span>
                    <span>${cartTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-brand-secondary">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="mt-6 flex space-x-2">
                <button 
                    onClick={() => setPaymentModalOpen(true)}
                    disabled={cart.items.length === 0}
                    className="w-full bg-brand-primary text-white font-bold py-4 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Pay
                </button>
                 <button 
                    onClick={clearCart}
                    disabled={cart.items.length === 0}
                    className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Clear
                </button>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                totalAmount={cartTotal}
            />
        </div>
    );
};

export default Cart;
