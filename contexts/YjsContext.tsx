import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { IndexeddbPersistence } from 'y-indexeddb';
import { MOCK_USERS, MOCK_CATEGORIES, MOCK_PRODUCTS } from '../data/mockData';
import { User, Category, Product, Order } from '../types';

interface YjsContextType {
  doc: Y.Doc | null;
  provider: WebrtcProvider | null;
  isSynced: boolean;
}

const YjsContext = createContext<YjsContextType | undefined>(undefined);

export const YjsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebrtcProvider | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const ydoc = new Y.Doc();
    // Note: We're using a public signaling server for demo purposes.
    // For a real LAN-only app, you'd host your own signaling server on the LAN.
    // See: https://github.com/yjs/y-webrtc#signaling
    const yprovider = new WebrtcProvider('lan-pos-sync-room', ydoc, {
        signaling: ['wss://signaling.yjs.dev'] 
    });
    const persistence = new IndexeddbPersistence('lan-pos-db', ydoc);

    persistence.whenSynced.then(() => {
      console.log('IndexedDB synced!');
      // Seed data if the document is new/empty
      if (ydoc.getArray<User>('users').length === 0) {
        ydoc.transact(() => {
          const users = ydoc.getArray('users');
          MOCK_USERS.forEach(user => users.push([user]));
          
          const categories = ydoc.getArray('categories');
          MOCK_CATEGORIES.forEach(cat => categories.push([cat]));

          const products = ydoc.getArray('products');
          MOCK_PRODUCTS.forEach(prod => {
              const yProd = new Y.Map<any>();
              Object.entries(prod).forEach(([key, value]) => {
                  yProd.set(key, value);
              });
              products.push([yProd]);
          });
          
          // Initialize empty orders array
          ydoc.getArray<Order>('orders');
        });
        console.log('Initial data seeded into Y.Doc');
      }
      setIsSynced(true);
    });

    setDoc(ydoc);
    setProvider(yprovider);

    return () => {
      yprovider.disconnect();
      ydoc.destroy();
    };
  }, []);

  return (
    <YjsContext.Provider value={{ doc, provider, isSynced }}>
      {isSynced ? children : <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading and syncing data...</div>}
    </YjsContext.Provider>
  );
};

export const useYjs = (): YjsContextType => {
  const context = useContext(YjsContext);
  if (!context) {
    throw new Error('useYjs must be used within a YjsProvider');
  }
  return context;
};
