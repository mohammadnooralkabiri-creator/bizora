import { useState } from 'react';
import { useStore } from './store';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import Profits from './pages/Profits';
import Reports from './pages/Reports';
import AuditLog from './pages/AuditLog';
import WhatsApp from './pages/WhatsApp';
import Settings from './pages/Settings';
import POS from './pages/POS';
import Finance from './pages/Finance';
import Withdrawals from './pages/Withdrawals';
import Expenses from './pages/Expenses';
import Notifications from './pages/Notifications';
import Employees from './pages/Employees';
import Warehouses from './pages/Warehouses';
import Integrations from './pages/Integrations';
import Stores from './pages/Stores';
import './App.css';

const pages: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  orders: Orders,
  products: Products,
  inventory: Inventory,
  invoices: Invoices,
  profits: Profits,
  reports: Reports,
  audit: AuditLog,
  whatsapp: WhatsApp,
  settings: Settings,
  pos: POS,
  finance: Finance,
  withdrawals: Withdrawals,
  expenses: Expenses,
  notifications: Notifications,
  employees: Employees,
  warehouses: Warehouses,
  integrations: Integrations,
  stores: Stores,
};

function App() {
  const { state, logout } = useStore();
  const [active, setActive] = useState('dashboard');

  if (!state.user) {
    return <Login onLogin={() => setActive('dashboard')} />;
  }

  const Page = pages[active] || Dashboard;
  const pendingOrders = state.orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = state.products.filter((p) => p.quantity <= state.settings.lowStockThreshold).length;

  return (
    <div className="app" dir="rtl">
      <Sidebar
        active={active}
        setActive={setActive}
        orderCount={pendingOrders}
        lowStockCount={lowStockCount}
        onLogout={logout}
        user={state.user.username}
      />
      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">مساحة العمل <span>/</span> {activeLabel(active)}</div>
          <div className="top-actions">
            {lowStockCount > 0 && <span className="top-alert">⚠ {lowStockCount}</span>}
            <div className="top-avatar">{state.user.username.charAt(0).toUpperCase()}</div>
          </div>
        </header>
        <section className="content">
          <Page />
          <footer>© 2026 BIZORA. جميع الحقوق محفوظة.</footer>
        </section>
      </main>
    </div>
  );
}

function activeLabel(k: string) {
  const map: Record<string, string> = {
    dashboard: 'الرئيسية',
    orders: 'الطلبات',
    products: 'المنتجات',
    inventory: 'المخزون',
    invoices: 'الفواتير',
    profits: 'الأرباح',
    reports: 'التقارير',
    audit: 'السجل',
    whatsapp: 'واتساب',
    settings: 'الإعدادات',
    pos: 'نقطة البيع',
    finance: 'المالية',
    withdrawals: 'السحوبات',
    expenses: 'المصروفات',
    notifications: 'الإشعارات',
    employees: 'الموظفون',
    warehouses: 'المستودعات',
    integrations: 'التكاملات',
    stores: 'المتاجر',
  };
  return map[k] || k;
}

export default App;