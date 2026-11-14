export type OrderStatus = 'pending' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number; // selling price
  cost: number; // cost price
  quantity: number;
  minStock: number;
  createdAt: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  cost: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  cost: number;
  profit: number;
  notes: string;
  createdAt: number;
  deliveredAt?: number;
}

export interface Invoice {
  id: string;
  orderId?: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;
  paid: boolean;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'expense' | 'tax' | 'sale';
  amount: number;
  reason: string;
  createdAt: number;
}

export interface Budget {
  total: number;
  spent: number;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  details: string;
  user: string;
  createdAt: number;
}

export interface Settings {
  taxRate: number; // percent
  lowStockThreshold: number;
  whatsappGroupLink: string;
  currency: string;
  businessName: string;
  phone?: string;
  email?: string;
  instagram?: string;
  snapchat?: string;
  tiktok?: string;
  website?: string;
  discord?: string;
  facebook?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  createdAt: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  username: string;
  createdAt: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  qty: number;
  reason: string;
  createdAt: number;
}

export type Role =
  | 'owner'
  | 'admin'
  | 'viewer'
  | 'finance'
  | 'warehouse'
  | 'orders'
  | 'cashier'
  | 'employee';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  createdAt?: number;
}

export interface AppState {
  user: User | null;
  accounts: User[];
  products: Product[];
  orders: Order[];
  invoices: Invoice[];
  transactions: Transaction[];
  budget: Budget;
  logs: AuditLog[];
  settings: Settings;
  warehouses: Warehouse[];
  employees: Employee[];
  stockMovements: StockMovement[];
}