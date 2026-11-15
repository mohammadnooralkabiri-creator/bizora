
import { t, type Lang } from '../i18n';

const navItems = [
  { key: 'dashboard', label: 'الرئيسية', icon: '⌂' },
  { key: 'pos', label: 'نقطة البيع', icon: '▤' },
  { key: 'orders', label: 'الطلبات', icon: '▤' },
  { key: 'products', label: 'المنتجات', icon: '◇' },
  { key: 'inventory', label: 'المخزون', icon: '▧' },
  { key: 'warehouses', label: 'المستودعات', icon: '▧' },
  { key: 'invoices', label: 'الفواتير', icon: '▧' },
  { key: 'finance', label: 'المالية', icon: '↗' },
  { key: 'profits', label: 'الأرباح', icon: '↗' },
  { key: 'withdrawals', label: 'السحوبات', icon: '↗' },
  { key: 'expenses', label: 'المصروفات', icon: '▧' },
  { key: 'reports', label: 'التقارير', icon: '▧' },
  { key: 'notifications', label: 'الإشعارات', icon: '!' },
  { key: 'employees', label: 'الموظفون', icon: '☰' },
  { key: 'stores', label: 'المتاجر', icon: '▧' },
  { key: 'integrations', label: 'التكاملات', icon: '▧' },
  { key: 'audit', label: 'السجل', icon: '☰' },
  { key: 'links', label: 'روابط', icon: '🔗' },
  { key: 'settings', label: 'الإعدادات', icon: '⚙' },
  { key: 'accounts', label: 'الحسابات', icon: '☰' },
];

interface SidebarProps {
  active: string;
  setActive: (k: string) => void;
  orderCount: number;
  lowStockCount: number;
  onLogout: () => void;
  user: string;
  avatar?: string;
  role?: string;
  lang?: Lang;
}

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

export default function Sidebar({ active, setActive, orderCount, lowStockCount, onLogout, user, avatar, role = 'employee', lang = 'ar' }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">B</div>
        <div>
          <h2>BIZORA</h2>
          <span>BUSINESS PLATFORM</span>
        </div>
      </div>

      <div className="workspace">
        <span className="workspace-dot" />
        مساحة عملي
        <span className="arrow">⌄</span>
      </div>

      <p className="side-label">القائمة الرئيسية</p>
      <nav>
        {navItems.filter((item) => (ROLE_PAGES[role] || ['dashboard']).includes(item.key)).map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? 'selected' : ''}`}
            onClick={() => setActive(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {t(lang, item.key)}
            {item.key === 'orders' && orderCount > 0 && <span className="nav-count">{orderCount}</span>}
            {item.key === 'inventory' && lowStockCount > 0 && <span className="nav-count alert">{lowStockCount}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">?</div>
          <strong>تحتاج مساعدة؟</strong>
          <p>نحن هنا لمساعدتك في إدارة مشروعك.</p>
        </div>
        <div className="profile">
          {avatar ? <img className="avatar" src={avatar} alt="avatar" style={{ objectFit: 'cover' }} /> : <div className="avatar">{user.charAt(0).toUpperCase()}</div>}
          <div>
            <strong>{user}</strong>
            <span>الحساب</span>
          </div>
          <button className="profile-menu" onClick={onLogout} title="خروج">↩</button>
        </div>
      </div>
    </aside>
  );
}