/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppState, Product, Order, Invoice, Transaction, Budget, Settings, OrderStatus } from './types';

const STORAGE_KEY = 'bizora_state_v1';

const defaultSettings: Settings = {
  taxRate: 5,
  lowStockThreshold: 10,
  whatsappGroupLink: 'https://chat.whatsapp.com/your-group-link',
  currency: 'AED',
  businessName: 'BIZORA',
};

const initialState: AppState = {
  user: null,
  products: [],
  orders: [],
  invoices: [],
  transactions: [],
  budget: { total: 0, spent: 0 },
  logs: [],
  settings: defaultSettings,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AppState;
    return { ...initialState, ...parsed, settings: { ...defaultSettings, ...parsed.settings } };
  } catch {
    return initialState;
  }
}

function saveState(s: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface StoreContextValue {
  state: AppState;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (o: Omit<Order, 'id' | 'createdAt' | 'total' | 'cost' | 'profit'> & { items: Order['items'] }) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  addInvoice: (inv: Omit<Invoice, 'id' | 'createdAt' | 'tax' | 'total'>) => Invoice;
  toggleInvoicePaid: (id: string) => void;
  deleteInvoice: (id: string) => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  deleteTransaction: (id: string) => void;
  setBudget: (b: Budget) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  log: (action: string, entity: string, details: string) => void;
  clearAll: () => void;
  seedDemo: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const log = useCallback((action: string, entity: string, details: string) => {
    setState((prev) => ({
      ...prev,
      logs: [
        { id: uid(), action, entity, details, user: prev.user?.username || 'system', createdAt: Date.now() },
        ...prev.logs,
      ].slice(0, 500),
    }));
  }, []);

  const login = useCallback((username: string, password: string) => {
    // stored user check
    const stored = loadState().user;
    if (stored && stored.username === username && stored.password === password) {
      setState((prev) => ({ ...prev, user: stored }));
      return true;
    }
    // allow default admin/admin
    if (username === 'admin' && password === 'admin') {
      const u = { username, password };
      setState((prev) => ({ ...prev, user: u }));
      // persist user
      const s = loadState();
      saveState({ ...s, user: u });
      return true;
    }
    return false;
  }, []);

  const register = useCallback((username: string, password: string) => {
    const u = { username, password };
    setState((prev) => ({ ...prev, user: u }));
    const s = loadState();
    saveState({ ...s, user: u });
    return true;
  }, []);

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, user: null }));
    const s = loadState();
    saveState({ ...s, user: null });
  }, []);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'createdAt'>) => {
    const prod: Product = { ...p, id: uid(), createdAt: Date.now() };
    setState((prev) => ({ ...prev, products: [prod, ...prev.products] }));
    log('create', 'product', `أُضيف منتج: ${prod.name} (الكمية ${prod.quantity})`);
    return prod;
  }, [log]);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
    log('update', 'product', `تم تحديث المنتج ${id}`);
  }, [log]);

  const deleteProduct = useCallback((id: string) => {
    setState((prev) => {
      const prod = prev.products.find((p) => p.id === id);
      log('delete', 'product', `تم حذف المنتج ${prod?.name || id}`);
      return { ...prev, products: prev.products.filter((p) => p.id !== id) };
    });
  }, [log]);

  const addOrder = useCallback((o: Omit<Order, 'id' | 'createdAt' | 'total' | 'cost' | 'profit'> & { items: Order['items'] }) => {
    const total = o.items.reduce((s, it) => s + it.qty * it.price, 0);
    const cost = o.items.reduce((s, it) => s + it.qty * it.cost, 0);
    const profit = total - cost;
    const order: Order = { ...o, id: uid(), createdAt: Date.now(), total, cost, profit };
    setState((prev) => {
      // decrement stock
      const products = prev.products.map((p) => {
        const item = order.items.find((i) => i.productId === p.id);
        if (item) return { ...p, quantity: Math.max(0, p.quantity - item.qty) };
        return p;
      });
      return { ...prev, orders: [order, ...prev.orders], products };
    });
    log('create', 'order', `طلب جديد #${order.id.slice(0, 6)} - ${order.customerName} - ${total}`);
    // transaction for sale if delivered? keep pending
    return order;
  }, [log]);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setState((prev) => {
      const order = prev.orders.find((o) => o.id === id);
      if (!order) return prev;
      let transactions = prev.transactions;
      let products = prev.products;
      if (status === 'delivered' && order.status !== 'delivered') {
        // add sale transaction
        transactions = [
          { id: uid(), type: 'sale', amount: order.total, reason: `مبيعات طلب #${order.id.slice(0, 6)}`, createdAt: Date.now() },
          ...transactions,
        ];
        // budget spent? no
      }
      if (status === 'cancelled' && order.status !== 'cancelled' && order.status !== 'delivered') {
        // restock
        products = products.map((p) => {
          const item = order.items.find((i) => i.productId === p.id);
          if (item) return { ...p, quantity: p.quantity + item.qty };
          return p;
        });
      }
      const orders = prev.orders.map((o) =>
        o.id === id ? { ...o, status, deliveredAt: status === 'delivered' ? Date.now() : o.deliveredAt } : o
      );
      return { ...prev, orders, transactions, products };
    });
    log('update', 'order', `تم تغيير حالة الطلب ${id} إلى ${status}`);
  }, [log]);

  const deleteOrder = useCallback((id: string) => {
    setState((prev) => ({ ...prev, orders: prev.orders.filter((o) => o.id !== id) }));
    log('delete', 'order', `تم حذف الطلب ${id}`);
  }, [log]);

  const addInvoice = useCallback((inv: Omit<Invoice, 'id' | 'createdAt' | 'tax' | 'total'>) => {
    const taxRate = inv.taxRate;
    const tax = (inv.subtotal * taxRate) / 100;
    const total = inv.subtotal + tax;
    const invoice: Invoice = { ...inv, id: uid(), createdAt: Date.now(), tax, total };
    setState((prev) => ({ ...prev, invoices: [invoice, ...prev.invoices] }));
    log('create', 'invoice', `فاتورة #${invoice.id.slice(0, 6)} - ${total}`);
    // tax transaction
    setState((prev) => ({
      ...prev,
      transactions: [{ id: uid(), type: 'tax', amount: tax, reason: `ضريبة فاتورة #${invoice.id.slice(0, 6)}`, createdAt: Date.now() }, ...prev.transactions],
    }));
    return invoice;
  }, [log]);

  const toggleInvoicePaid = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      invoices: prev.invoices.map((inv) => (inv.id === id ? { ...inv, paid: !inv.paid } : inv)),
    }));
    log('update', 'invoice', `تم تغيير حالة الدفع للفاتورة ${id}`);
  }, [log]);

  const deleteInvoice = useCallback((id: string) => {
    setState((prev) => ({ ...prev, invoices: prev.invoices.filter((i) => i.id !== id) }));
    log('delete', 'invoice', `تم حذف الفاتورة ${id}`);
  }, [log]);

  const addTransaction = useCallback((t: Omit<Transaction, 'id' | 'createdAt'>) => {
    const tr: Transaction = { ...t, id: uid(), createdAt: Date.now() };
    setState((prev) => {
      let budget = prev.budget;
      if (t.type === 'withdrawal' || t.type === 'expense') {
        budget = { ...budget, spent: budget.spent + t.amount };
      }
      if (t.type === 'deposit') {
        budget = { ...budget, total: budget.total + t.amount };
      }
      return { ...prev, transactions: [tr, ...prev.transactions], budget };
    });
    log('create', 'transaction', `${t.type} ${t.amount} - ${t.reason}`);
    return tr;
  }, [log]);

  const deleteTransaction = useCallback((id: string) => {
    setState((prev) => ({ ...prev, transactions: prev.transactions.filter((t) => t.id !== id) }));
    log('delete', 'transaction', `تم حذف المعاملة ${id}`);
  }, [log]);

  const setBudget = useCallback((b: Budget) => {
    setState((prev) => ({ ...prev, budget: b }));
    log('update', 'budget', `تم تحديث الميزانية: ${b.total}`);
  }, [log]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
    log('update', 'settings', `تم تحديث الإعدادات`);
  }, [log]);

  const clearAll = useCallback(() => {
    setState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const seedDemo = useCallback(() => {
    const now = Date.now();
    const products: Product[] = [
      { id: uid(), name: 'علبة ماء', category: 'مشروبات', price: 2, cost: 1, quantity: 8, minStock: 10, createdAt: now },
      { id: uid(), name: 'شوكولاتة', category: 'حلويات', price: 3, cost: 1.5, quantity: 25, minStock: 10, createdAt: now },
      { id: uid(), name: 'شيبس', category: 'مقرمشات', price: 1.5, cost: 0.8, quantity: 40, minStock: 10, createdAt: now },
    ];
    const orders: Order[] = [];
    const invoices: Invoice[] = [];
    const transactions: Transaction[] = [
      { id: uid(), type: 'deposit', amount: 500, reason: 'رأس مال ابتدائي', createdAt: now },
    ];
    const budget: Budget = { total: 500, spent: 0 };
    setState((prev) => ({
      ...prev,
      products,
      orders,
      invoices,
      transactions,
      budget,
      logs: [{ id: uid(), action: 'seed', entity: 'demo', details: 'تم تحميل بيانات تجريبية', user: 'system', createdAt: now }, ...prev.logs],
    }));
  }, []);

  const value: StoreContextValue = {
    state,
    login,
    register,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    addInvoice,
    toggleInvoicePaid,
    deleteInvoice,
    addTransaction,
    deleteTransaction,
    setBudget,
    updateSettings,
    log,
    clearAll,
    seedDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}