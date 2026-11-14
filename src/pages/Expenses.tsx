import React, { useState } from 'react';
import { useStore } from '../store';

export default function Expenses() {
  const { state, addTransaction } = useStore();
  const { transactions, settings } = state;
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');
  const list = transactions.filter((t) => t.type === 'expense');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    addTransaction({ type: 'expense', amount, reason: reason.trim() });
    setAmount(0);
    setReason('');
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>المصروفات</h1>
          <p>تسجيل ومراجعة المصروفات التشغيلية</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>مصروف جديد</h3>
          <form onSubmit={submit} className="form">
            <label>المبلغ</label>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <label>السبب</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} required />
            <button type="submit" className="primary-btn full">تسجيل مصروف</button>
          </form>
        </div>
        <div className="card">
          <h3>إجمالي المصروفات</h3>
          <strong>{list.reduce((s, t) => s + t.amount, 0).toFixed(2)} {settings.currency}</strong>
          <p>{list.length} عملية</p>
        </div>
      </div>

      <div className="card">
        {list.length === 0 ? (
          <p className="empty">لا توجد مصروفات</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>المبلغ</th><th>السبب</th><th>التاريخ</th></tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
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