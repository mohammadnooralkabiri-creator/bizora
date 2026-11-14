import { useStore } from '../store';

export default function Notifications() {
  const { state } = useStore();
  const { products, orders, transactions, settings } = state;

  const alerts: { id: string; level: string; text: string }[] = [];

  products
    .filter((p) => p.quantity <= settings.lowStockThreshold)
    .forEach((p) => alerts.push({ id: 'low-' + p.id, level: 'warning', text: `مخزون منخفض: ${p.name} — بقي ${p.quantity}` }));

  products
    .filter((p) => p.quantity === 0)
    .forEach((p) => alerts.push({ id: 'out-' + p.id, level: 'danger', text: `نفاد مخزون: ${p.name}` }));

  transactions
    .filter((t) => t.type === 'withdrawal' && (t.reason.includes('غير مذكور') || !t.reason.trim()))
    .forEach((t) => alerts.push({ id: 'wd-' + t.id, level: 'warning', text: `سحب ${t.amount.toFixed(2)} ${settings.currency} — سبب غير مذكور، يحتاج مراجعة` }));

  orders
    .filter((o) => o.status === 'pending')
    .forEach((o) => alerts.push({ id: 'po-' + o.id, level: 'info', text: `طلب قيد الانتظار #${o.id.slice(0, 6)} — ${o.customerName}` }));

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الإشعارات</h1>
          <p>تنبيهات وحالات تحتاج مراجعة</p>
        </div>
      </div>

      <div className="card">
        {alerts.length === 0 ? (
          <p className="empty">لا توجد إشعارات</p>
        ) : (
          <ul className="alert-list">
            {alerts.map((a) => (
              <li key={a.id}>
                <span className={`status status-${a.level === 'danger' ? 'cancelled' : a.level === 'warning' ? 'pending' : 'delivered'}`}>{a.level}</span>
                {a.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}