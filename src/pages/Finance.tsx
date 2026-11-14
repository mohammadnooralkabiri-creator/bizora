import { useStore } from '../store';

export default function Finance() {
  const { state } = useStore();
  const { orders, transactions, budget, settings } = state;

  const delivered = orders.filter((o) => o.status === 'delivered');
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const cost = delivered.reduce((s, o) => s + o.cost, 0);
  const grossProfit = revenue - cost;
  const tax = transactions.filter((t) => t.type === 'tax').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter((t) => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0);
  const netProfit = grossProfit - tax - expenses - withdrawals;

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>المالية</h1>
          <p>ملخص مالي وحركات</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-top"><span>الإيرادات</span><i>↗</i></div><strong>{revenue.toFixed(2)} <small>{settings.currency}</small></strong></div>
        <div className="stat-card"><div className="stat-top"><span>التكلفة</span><i>▧</i></div><strong>{cost.toFixed(2)} <small>{settings.currency}</small></strong></div>
        <div className="stat-card"><div className="stat-top"><span>الربح الإجمالي</span><i>٪</i></div><strong>{grossProfit.toFixed(2)} <small>{settings.currency}</small></strong></div>
        <div className="stat-card"><div className="stat-top"><span>صافي الربح</span><i>↗</i></div><strong>{netProfit.toFixed(2)} <small>{settings.currency}</small></strong></div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>تفصيل</h3>
          <div className="metric-row"><span>الإيرادات</span><strong>{revenue.toFixed(2)}</strong></div>
          <div className="metric-row"><span>التكلفة</span><strong>{cost.toFixed(2)}</strong></div>
          <div className="metric-row"><span>الضرائب</span><strong>{tax.toFixed(2)}</strong></div>
          <div className="metric-row"><span>المصروفات</span><strong>{expenses.toFixed(2)}</strong></div>
          <div className="metric-row"><span>السحوبات</span><strong>{withdrawals.toFixed(2)}</strong></div>
          <div className="metric-row total"><span>صافي الربح</span><strong>{netProfit.toFixed(2)}</strong></div>
        </div>
        <div className="card">
          <h3>الميزانية</h3>
          <div className="metric-row"><span>إجمالي</span><strong>{budget.total.toFixed(2)}</strong></div>
          <div className="metric-row"><span>المصروف</span><strong>{budget.spent.toFixed(2)}</strong></div>
          <div className="metric-row total"><span>المتبقي</span><strong>{(budget.total - budget.spent).toFixed(2)}</strong></div>
        </div>
      </div>

      <div className="card">
        <h3>آخر الحركات</h3>
        {transactions.length === 0 ? (
          <p className="empty">لا توجد حركات</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>النوع</th><th>المبلغ</th><th>السبب</th><th>التاريخ</th></tr>
            </thead>
            <tbody>
              {transactions.slice(0, 20).map((t) => (
                <tr key={t.id}>
                  <td>{t.type}</td>
                  <td>{t.amount.toFixed(2)} {settings.currency}</td>
                  <td>{t.reason}</td>
                  <td>{new Date(t.createdAt).toLocaleString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}