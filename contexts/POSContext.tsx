
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react';
import { Product, Cart, CartItem, Order, Payment } from '../types';
import { useAuth } from './AuthContext';
import { useYjs } from './YjsContext';
import { useYjsArray } from '../hooks/useYjs';
import * as Y from 'yjs';

interface POSContextType {
  products: Product[];
  cart: Cart;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (payments: Payment[]) => Order | null;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

const TAX_RATE = 0.08; // 8%

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { doc } = useYjs();
  const products = useYjsArray<Product>('products');
  const [cart, setCart] = useState<Cart>({ items: [], discount: 0, taxRate: TAX_RATE });

  const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);

  const addToCart = useCallback((productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.productId === productId);
      const product = getProductById(productId);
      if (!product) return prevCart;

      if (existingItem) {
        // Increase quantity
        const newItems = prevCart.items.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { ...prevCart, items: newItems };
      } else {
        // Add new item
        const newItem: CartItem = { productId, quantity: 1, unitPrice: product.price };
        return { ...prevCart, items: [...prevCart.items, newItem] };
      }
    });
  }, [getProductById]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.filter(item => item.productId !== productId)
    }));
  }, []);
  
  const updateCartItemQuantity = useCallback((productId: string, quantity: number) => {
    if(quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => ({
      ...prevCart,
      items: prevCart.items.map(item =>
        item.productId === productId ? { ...item, quantity: quantity } : item
      )
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({ items: [], discount: 0, taxRate: TAX_RATE });
  }, []);
  
  const cartSubtotal = useMemo(() => {
    return cart.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  }, [cart.items]);

  const cartTax = useMemo(() => {
    return cartSubtotal * cart.taxRate;
  }, [cartSubtotal, cart.taxRate]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartTax;
  }, [cartSubtotal, cartTax]);

  const createOrder = useCallback((payments: Payment[]): Order | null => {
    if (!user || !doc) {
      console.error("Cannot create order without a logged-in user or Yjs doc.");
      return null;
    }
    
    // In a real app, use a CRDT-safe unique ID generator
    const orderId = `order-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newOrder: Order = {
      id: orderId,
      cart: { ...cart },
      total: cartTotal,
      payments,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    
    // Persist order and update inventory within a Yjs transaction for data consistency
    doc.transact(() => {
        const yOrders = doc.getArray('orders') as Y.Array<Order>;
        yOrders.push([newOrder]);

        const yProducts = doc.getArray('products') as Y.Array<Y.Map<any>>;
        newOrder.cart.items.forEach(item => {
            const productIndex = yProducts.toArray().findIndex(p => p.get('id') === item.productId);
            if(productIndex !== -1) {
                const yProduct = yProducts.get(productIndex);
                const currentStock = yProduct.get('stock') as number;
                yProduct.set('stock', currentStock - item.quantity);
            }
        });
    });

    console.log("New Order Created and Synced:", newOrder);

    clearCart();
    return newOrder;
  }, [cart, cartTotal, user, doc, clearCart, products]);

  const value = {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    createOrder,
    cartSubtotal,
    cartTax,
    cartTotal,
  };

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};

export const usePOS = (): POSContextType => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
