
export enum UserRole {
  CASHIER = 'cashier',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  pin: string; // In a real app, this would be a hashed password
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  sku: string;
  imageUrl?: string;
  stock: number;
}

export interface Inventory {
  productId: string;
  quantity: number;
  lastUpdated: string; // ISO 8601 date string
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  items: CartItem[];
  discount: number; // as a percentage
  taxRate: number; // as a percentage
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
}

export interface Payment {
  method: PaymentMethod;
  amount: number;
  transactionId?: string;
}

export interface Order {
  id: string;
  cart: Cart;
  total: number;
  payments: Payment[];
  customerId?: string;
  userId: string;
  createdAt: string; // ISO 8601 date string
}

export interface Shift {
  id: string;
  userId: string;
  start: string; // ISO 8601 date string
  end?: string; // ISO 8601 date string
  startCash: number;
  endCash?: number;
}

export interface AuditEvent {
  id: string;
  type: string;
  userId: string;
  timestamp: string; // ISO 8601 date string
  details: Record<string, any>;
}
