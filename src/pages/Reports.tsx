import { useEffect, useState } from 'react';
import { useStore } from '../store';

export default function Reports() {
  const { state } = useStore();
  const { products, orders, transactions, budget, settings, logs } = state;
  const [now, setNow] = useState(() => Date.now());
  const [lastRefresh, setLastRefresh] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    const r = setInterval(() => setLastRefresh(Date.now()), 60000);
    return () => { clearInterval(t); clearInterval(r); };
  }, []);

  const delivered = orders.filter((o) => o.status === 'delivered');
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const cost = delivered.reduce((s, o) => s + o.cost, 0);
  const grossProfit = revenue - cost;
  const taxTotal = transactions.filter((t) => t.type === 'tax').reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter(t => t.type === 'withdrawal' || t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit = grossProfit - taxTotal - withdrawals;
  const pending = orders.filter((o) => o.status === 'pending').length;
  const lowStock = products.filter((p) => p.quantity <= settings.lowStockThreshold);

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>التقارير</h1>
          <p>تقارير مباشرة على مدار الدقيقة</p>
        </div>
        <div className="live-clock">
          <span className="live-dot" /> {new Date(now).toLocaleTimeString('ar')}
          <small>آخر تحديث: {new Date(lastRefresh).toLocaleTimeString('ar')}</small>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-card">
          <h4>المبيعات</h4>
          <strong>{revenue.toFixed(2)} {settings.currency}</strong>
          <span>{delivered.length} طلب مُسلّم · {pending} قيد الانتظار</span>
        </div>
        <div className="report-card">
          <h4>صافي الربح</h4>
          <strong>{netProfit.toFixed(2)} {settings.currency}</strong>
          <span>إجمالي {grossProfit.toFixed(2)} - ضرائب {taxTotal.toFixed(2)} - سحوبات {withdrawals.toFixed(2)}</span>
        </div>
        <div className="report-card">
          <h4>الميزانية المتبقية</h4>
          <strong>{(budget.total - budget.spent).toFixed(2)} {settings.currency}</strong>
          <span>من {budget.total.toFixed(2)}</span>
        </div>
        <div className="report-card">
          <h4>المخزون منخفض</h4>
          <strong>{lowStock.length}</strong>
          <span>منتج ≤ {settings.lowStockThreshold}</span>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>ملخص مالي</h3>
          <div className="metric-row"><span>الإيرادات</span><strong>{revenue.toFixed(2)}</strong></div>
          <div className="metric-row"><span>التكلفة</span><strong>{cost.toFixed(2)}</strong></div>
          <div className="metric-row"><span>الربح الإجمالي</span><strong>{grossProfit.toFixed(2)}</strong></div>
          <div className="metric-row"><span>الضرائب</span><strong>{taxTotal.toFixed(2)}</strong></div>
          <div className="metric-row"><span>السحوبات</span><strong>{withdrawals.toFixed(2)}</strong></div>
          <div className="metric-row total"><span>صافي الربح</span><strong>{netProfit.toFixed(2)}</strong></div>
        </div>
        <div className="card">
          <h3>تنبيهات المخزون</h3>
          {lowStock.length === 0 ? (
            <p className="empty">لا توجد تنبيهات</p>
          ) : (
            <ul className="alert-list">
              {lowStock.map((p) => (
                <li key={p.id}>⚠ {p.name}: بقي {p.quantity} (الحد {settings.lowStockThreshold})</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card">
        <h3>آخر 10 أحداث (السجل)</h3>
        {logs.length === 0 ? (
          <p className="empty">لا توجد أحداث</p>
        ) : (
          <ul className="log-list">
            {logs.slice(0, 10).map((l) => (
              <li key={l.id}>
                <span className="log-time">{new Date(l.createdAt).toLocaleTimeString('ar')}</span>
                <strong>{l.action}</strong> · {l.entity} · {l.details}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}