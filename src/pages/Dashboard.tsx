import { useStore } from '../store';
import type { Order } from '../types';

export default function Dashboard() {
  const { state } = useStore();
  const { products, orders, transactions, budget, settings } = state;

  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const revenue = deliveredOrders.reduce((s, o) => s + o.total, 0);
  const cost = deliveredOrders.reduce((s, o) => s + o.cost, 0);
  const grossProfit = revenue - cost;
  const taxPaid = transactions.filter((t) => t.type === 'tax').reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter(t => t.type === 'withdrawal' || t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = grossProfit - taxPaid - withdrawals;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStock = products.filter((p) => p.quantity <= settings.lowStockThreshold);

  const recentOrders = orders.slice(0, 5);

  const currency = settings.currency;

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>لوحة التحكم</h1>
          <p>ملخص نشاط مشروعك</p>
        </div>
        <span className="period">محدث تلقائياً</span>
      </div>

      {lowStock.length > 0 && (
        <div className="alert-banner">
          ⚠ تنبيه: {lowStock.length} منتج بمخزون منخفض (≤{settings.lowStockThreshold})
          <ul>
            {lowStock.map((p) => (
              <li key={p.id}>{p.name}: بقي {p.quantity} علبة/وحدة</li>
            ))}
          </ul>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top"><span>إجمالي المبيعات</span><i>↗</i></div>
          <strong>{revenue.toFixed(2)} <small>{currency}</small></strong>
          <p>{deliveredOrders.length} طلب تم تسليمه</p>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>صافي الأرباح</span><i>٪</i></div>
          <strong>{netProfit.toFixed(2)} <small>{currency}</small></strong>
          <p>بعد الضرائب والسحوبات</p>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>الطلبات</span><i>▤</i></div>
          <strong>{orders.length}</strong>
          <p>{pendingOrders} قيد الانتظار</p>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>المنتجات</span><i>◇</i></div>
          <strong>{products.length}</strong>
          <p>{lowStock.length} بمخزون منخفض</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>الأرباح</h3>
          <div className="metric-row"><span>الإيرادات</span><strong>{revenue.toFixed(2)}</strong></div>
          <div className="metric-row"><span>التكلفة</span><strong>{cost.toFixed(2)}</strong></div>
          <div className="metric-row"><span>الربح الإجمالي</span><strong>{grossProfit.toFixed(2)}</strong></div>
          <div className="metric-row"><span>الضرائب</span><strong>{taxPaid.toFixed(2)}</strong></div>
          <div className="metric-row"><span>السحوبات/المصروفات</span><strong>{withdrawals.toFixed(2)}</strong></div>
          <div className="metric-row total"><span>صافي الربح</span><strong>{netProfit.toFixed(2)}</strong></div>
        </div>

        <div className="card">
          <h3>الميزانية</h3>
          <div className="metric-row"><span>إجمالي الميزانية</span><strong>{budget.total.toFixed(2)}</strong></div>
          <div className="metric-row"><span>المصروف</span><strong>{budget.spent.toFixed(2)}</strong></div>
          <div className="metric-row total"><span>المتبقي</span><strong>{(budget.total - budget.spent).toFixed(2)}</strong></div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${budget.total > 0 ? Math.min(100, (budget.spent / budget.total) * 100) : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>آخر الطلبات</h3>
        {recentOrders.length === 0 ? (
          <p className="empty">لا توجد طلبات بعد</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>العميل</th>
                <th>المجموع</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o: Order) => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 6)}</td>
                  <td>{o.customerName}</td>
                  <td>{o.total.toFixed(2)} {currency}</td>
                  <td><span className={`status status-${o.status}`}>{statusLabel(o.status)}</span></td>
                  <td>{new Date(o.createdAt).toLocaleString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function statusLabel(s: string) {
  if (s === 'pending') return 'قيد الانتظار';
  if (s === 'delivered') return 'تم التسليم';
  if (s === 'cancelled') return 'ملغى';
  return s;
}