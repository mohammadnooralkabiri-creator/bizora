import { useState, useEffect } from 'react';
import { useStore } from './store';
import { t } from './i18n';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Storefront from './pages/Storefront';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Invoices from './pages/Invoices';
import Profits from './pages/Profits';
import Reports from './pages/Reports';
import AuditLog from './pages/AuditLog';
import WhatsApp from './pages/WhatsApp';
import Links from './pages/Links';
import Settings from './pages/Settings';
import Accounts from './pages/Accounts';
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
  links: Links,
  settings: Settings,
  accounts: Accounts,
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

const ROLE_PAGES: Record<string, string[]> = {
  owner: ['dashboard','pos','orders','products','inventory','warehouses','invoices','finance','profits','withdrawals','expenses','reports','notifications','employees','stores','integrations','audit','links','settings','accounts'],
  admin: ['dashboard','pos','orders','products','inventory','warehouses','invoices','finance','profits','withdrawals','expenses','reports','notifications','employees','stores','integrations','audit','links','settings','accounts'],
  viewer: ['dashboard','reports','notifications','audit'],
  finance: ['dashboard','finance','profits','withdrawals','expenses','invoices','reports','notifications','audit'],
  warehouse: ['dashboard','products','inventory','warehouses','reports','notifications'],
  orders: ['dashboard','orders','pos','invoices','reports','notifications'],
  cashier: ['dashboard','pos','orders','invoices'],
  employee: ['dashboard','orders','products','inventory','reports','notifications'],
};

function App() {
  const { state, logout } = useStore();
  const [active, setActive] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  const theme = state.settings.theme || 'light';
  const lang = state.settings.language || 'ar';
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [theme, lang]);

  if (!state.user && !showLogin) {
    return <Storefront onAdminLogin={() => setShowLogin(true)} />;
  }

  if (!state.user) {
    return <Login onLogin={() => { setShowLogin(false); setActive('dashboard'); }} />;
  }

  const user = state.user;

  const role = user.role || 'employee';
  const allowed = ROLE_PAGES[role] || ['dashboard'];
  const safeActive = allowed.includes(active) ? active : 'dashboard';

  const Page = pages[safeActive] || Dashboard;
  const pendingOrders = state.orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = state.products.filter((p) => p.quantity <= state.settings.lowStockThreshold).length;

  return (
    <div className="app" dir="rtl">
      <Sidebar
        active={safeActive}
        setActive={setActive}
        orderCount={pendingOrders}
        lowStockCount={lowStockCount}
        onLogout={logout}
        user={user.username}
        role={role}
        lang={lang}
      />
      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">{t(lang, 'workspace')} <span>/</span> {t(lang, safeActive)}</div>
          <div className="top-actions">
            {lowStockCount > 0 && <span className="top-alert">⚠ {lowStockCount}</span>}
            <div className="top-avatar">{user.username.charAt(0).toUpperCase()}</div>
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


export default App;