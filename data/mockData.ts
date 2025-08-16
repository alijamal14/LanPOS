
import { User, Product, Category, UserRole } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alice (Cashier)', role: UserRole.CASHIER, pin: '1234' },
  { id: 'user-2', name: 'Bob (Manager)', role: UserRole.MANAGER, pin: '5678' },
  { id: 'user-3', name: 'Charlie (Admin)', role: UserRole.ADMIN, pin: '9012' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Beverages' },
  { id: 'cat-2', name: 'Snacks' },
  { id: 'cat-3', name: 'Bakery' },
  { id: 'cat-4', name: 'Dairy' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Espresso', price: 2.50, categoryId: 'cat-1', sku: 'BEV001', stock: 100, imageUrl: 'https://picsum.photos/id/225/400/400' },
  { id: 'prod-2', name: 'Latte', price: 3.50, categoryId: 'cat-1', sku: 'BEV002', stock: 100, imageUrl: 'https://picsum.photos/id/280/400/400' },
  { id: 'prod-3', name: 'Croissant', price: 2.75, categoryId: 'cat-3', sku: 'BAK001', stock: 50, imageUrl: 'https://picsum.photos/id/366/400/400' },
  { id: 'prod-4', name: 'Muffin', price: 2.25, categoryId: 'cat-3', sku: 'BAK002', stock: 60, imageUrl: 'https://picsum.photos/id/431/400/400' },
  { id: 'prod-5', name: 'Potato Chips', price: 1.50, categoryId: 'cat-2', sku: 'SNK001', stock: 200, imageUrl: 'https://picsum.photos/id/102/400/400' },
  { id: 'prod-6', name: 'Chocolate Bar', price: 1.75, categoryId: 'cat-2', sku: 'SNK002', stock: 150, imageUrl: 'https://picsum.photos/id/355/400/400' },
  { id: 'prod-7', name: 'Milk (1L)', price: 1.99, categoryId: 'cat-4', sku: 'DRY001', stock: 40, imageUrl: 'https://picsum.photos/id/60/400/400' },
  { id: 'prod-8', name: 'Yogurt', price: 1.20, categoryId: 'cat-4', sku: 'DRY002', stock: 75, imageUrl: 'https://picsum.photos/id/685/400/400' },
  { id: 'prod-9', name: 'Iced Tea', price: 2.25, categoryId: 'cat-1', sku: 'BEV003', stock: 90, imageUrl: 'https://picsum.photos/id/1060/400/400' },
  { id: 'prod-10', name: 'Pretzels', price: 1.80, categoryId: 'cat-2', sku: 'SNK003', stock: 120, imageUrl: 'https://picsum.photos/id/1070/400/400' },
  { id: 'prod-11', name: 'Bagel', price: 2.00, categoryId: 'cat-3', sku: 'BAK003', stock: 45, imageUrl: 'https://picsum.photos/id/212/400/400' },
  { id: 'prod-12', name: 'Cheese Slices', price: 3.50, categoryId: 'cat-4', sku: 'DRY003', stock: 30, imageUrl: 'https://picsum.photos/id/312/400/400' },
];
