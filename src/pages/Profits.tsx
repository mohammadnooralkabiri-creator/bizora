import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';

export default function Profits() {
  const { state, addTransaction, deleteTransaction, setBudget } = useStore();
  const { orders, transactions, budget, settings } = state;
  const [open, setOpen] = useState(false);
  const [tForm, setTForm] = useState({ type: 'withdrawal' as 'withdrawal' | 'expense' | 'deposit' | 'tax', amount: 0, reason: '' });
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [bForm, setBForm] = useState({ total: budget.total, spent: budget.spent });

  const delivered = orders.filter((o) => o.status === 'delivered');
  const revenue = delivered.reduce((s, o) => s + o.total, 0);
  const cost = delivered.reduce((s, o) => s + o.cost, 0);
  const grossProfit = revenue - cost;
  const taxTotal = transactions.filter((t) => t.type === 'tax').reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter((t) => t.type === 'withdrawal' || t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const deposits = transactions.filter((t) => t.type === 'deposit').reduce((s, t) => s + t.amount, 0);
  const netProfit = grossProfit - taxTotal - withdrawals;

  const submitTx = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(tForm);
    setTForm({ type: 'withdrawal', amount: 0, reason: '' });
    setOpen(false);
  };

  const submitBudget = (e: React.FormEvent) => {
    e.preventDefault();
    setBudget(bForm);
    setBudgetOpen(false);
  };

  const typeLabel = (t: string) => {
    if (t === 'deposit') return 'إيداع';
    if (t === 'withdrawal') return 'سحب';
    if (t === 'expense') return 'مصروف';
    if (t === 'tax') return 'ضريبة';
    if (t === 'sale') return 'مبيعات';
    return t;
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الأرباح والميزانية</h1>
          <p>صافي الأرباح، الضرائب، السحوبات والأسباب</p>
        </div>
        <div className="header-actions">
          <button className="primary-btn" onClick={() => setOpen(true)}>+ معاملة</button>
          <button className="secondary-btn" onClick={() => { setBForm({ total: budget.total, spent: budget.spent }); setBudgetOpen(true); }}>الميزانية</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-top"><span>الإيرادات</span><i>↗</i></div>
          <strong>{revenue.toFixed(2)} <small>{settings.currency}</small></strong>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>الربح الإجمالي</span><i>٪</i></div>
          <strong>{grossProfit.toFixed(2)} <small>{settings.currency}</small></strong>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>الضرائب</span><i>▧</i></div>
          <strong>{taxTotal.toFixed(2)} <small>{settings.currency}</small></strong>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span>صافي الربح</span><i>↗</i></div>
          <strong>{netProfit.toFixed(2)} <small>{settings.currency}</small></strong>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>تفصيل الأرباح</h3>
          <div className="metric-row"><span>الإيرادات (مبيعات مُسلّمة)</span><strong>{revenue.toFixed(2)}</strong></div>
          <div className="metric-row"><span>التكلفة</span><strong>{cost.toFixed(2)}</strong></div>
          <div className="metric-row"><span>الربح الإجمالي</span><strong>{grossProfit.toFixed(2)}</strong></div>
          <div className="metric-row"><span>الضرائب</span><strong>-{taxTotal.toFixed(2)}</strong></div>
          <div className="metric-row"><span>السحوبات/المصروفات</span><strong>-{withdrawals.toFixed(2)}</strong></div>
          <div className="metric-row total"><span>صافي الربح</span><strong>{netProfit.toFixed(2)}</strong></div>
        </div>
        <div className="card">
          <h3>الميزانية</h3>
          <div className="metric-row"><span>إجمالي</span><strong>{budget.total.toFixed(2)}</strong></div>
          <div className="metric-row"><span>المصروف</span><strong>{budget.spent.toFixed(2)}</strong></div>
          <div className="metric-row total"><span>المتبقي</span><strong>{(budget.total - budget.spent).toFixed(2)}</strong></div>
          <div className="metric-row"><span>الإيداعات</span><strong>{deposits.toFixed(2)}</strong></div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${budget.total > 0 ? Math.min(100, (budget.spent / budget.total) * 100) : 0}%` }} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>سجل المعاملات (السبب)</h3>
        {transactions.length === 0 ? (
          <p className="empty">لا توجد معاملات</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>النوع</th>
                <th>المبلغ</th>
                <th>السبب</th>
                <th>التاريخ</th>
                <th>حذف</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td><span className={`status status-${t.type === 'deposit' || t.type === 'sale' ? 'delivered' : t.type === 'withdrawal' || t.type === 'expense' ? 'cancelled' : 'pending'}`}>{typeLabel(t.type)}</span></td>
                  <td>{t.amount.toFixed(2)} {settings.currency}</td>
                  <td>{t.reason}</td>
                  <td>{new Date(t.createdAt).toLocaleString('ar')}</td>
                  <td><button className="small-btn danger" onClick={() => deleteTransaction(t.id)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} title="معاملة جديدة" onClose={() => setOpen(false)}>
        <form onSubmit={submitTx} className="form">
          <label>النوع</label>
          <select value={tForm.type} onChange={(e) => setTForm({ ...tForm, type: e.target.value as 'withdrawal' | 'expense' | 'deposit' | 'tax' })}>
            <option value="withdrawal">سحب</option>
            <option value="expense">مصروف</option>
            <option value="deposit">إيداع</option>
            <option value="tax">ضريبة</option>
          </select>
          <label>المبلغ</label>
          <input type="number" step="0.01" value={tForm.amount} onChange={(e) => setTForm({ ...tForm, amount: Number(e.target.value) })} />
          <label>السبب</label>
          <input value={tForm.reason} onChange={(e) => setTForm({ ...tForm, reason: e.target.value })} required />
          <button type="submit" className="primary-btn full">حفظ</button>
        </form>
      </Modal>

      <Modal open={budgetOpen} title="تحديث الميزانية" onClose={() => setBudgetOpen(false)}>
        <form onSubmit={submitBudget} className="form">
          <label>إجمالي الميزانية</label>
          <input type="number" step="0.01" value={bForm.total} onChange={(e) => setBForm({ ...bForm, total: Number(e.target.value) })} />
          <label>المصروف</label>
          <input type="number" step="0.01" value={bForm.spent} onChange={(e) => setBForm({ ...bForm, spent: Number(e.target.value) })} />
          <button type="submit" className="primary-btn full">حفظ</button>
        </form>
      </Modal>
    </div>
  );
}