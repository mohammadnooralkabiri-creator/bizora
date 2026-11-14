
const navItems = [
  { key: 'dashboard', label: 'الرئيسية', icon: '⌂' },
  { key: 'orders', label: 'الطلبات', icon: '▤' },
  { key: 'products', label: 'المنتجات', icon: '◇' },
  { key: 'inventory', label: 'المخزون', icon: '▧' },
  { key: 'invoices', label: 'الفواتير', icon: '▧' },
  { key: 'profits', label: 'الأرباح', icon: '↗' },
  { key: 'reports', label: 'التقارير', icon: '▧' },
  { key: 'audit', label: 'السجل', icon: '☰' },
  { key: 'whatsapp', label: 'واتساب', icon: 'W' },
  { key: 'settings', label: 'الإعدادات', icon: '⚙' },
];

interface SidebarProps {
  active: string;
  setActive: (k: string) => void;
  orderCount: number;
  lowStockCount: number;
  onLogout: () => void;
  user: string;
}

export default function Sidebar({ active, setActive, orderCount, lowStockCount, onLogout, user }: SidebarProps) {
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
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? 'selected' : ''}`}
            onClick={() => setActive(item.key)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
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
          <div className="avatar">{user.charAt(0).toUpperCase()}</div>
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