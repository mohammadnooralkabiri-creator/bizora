import { useStore } from '../store';

export default function Integrations() {
  const { state } = useStore();
  const { settings } = state;
  const items = [
    { name: 'Shopify', status: 'غير متصل' },
    { name: 'WooCommerce', status: 'غير متصل' },
    { name: 'سلة', status: 'غير متصل' },
    { name: 'زد', status: 'غير متصل' },
    { name: 'Stripe', status: 'غير متصل' },
    { name: 'POS داخلي', status: 'تجريبي' },
  ];

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>التكاملات</h1>
          <p>ربط المتاجر وبوابات الدفع</p>
        </div>
      </div>
      <div className="card">
        <p className="muted">ربط {settings.businessName} مع المنصات (قيد التطوير).</p>
        <table className="table">
          <thead>
            <tr><th>المنصة</th><th>الحالة</th><th>إجراء</th></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.name}>
                <td>{it.name}</td>
                <td><span className="status status-pending">{it.status}</span></td>
                <td><button className="small-btn" disabled>ربط</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}