import { useState } from 'react';
import { useStore } from '../store';

export default function AuditLog() {
  const { state } = useStore();
  const { logs } = state;
  const [filter, setFilter] = useState('');

  const filtered = logs.filter((l) =>
    !filter || l.action.includes(filter) || l.entity.includes(filter) || l.details.includes(filter)
  );

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>السجل (Log)</h1>
          <p>تتبع كل شيء من البداية (من 0)</p>
        </div>
        <input className="search-input" placeholder="بحث..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <p className="empty">لا توجد سجلات</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>الوقت</th>
                <th>الإجراء</th>
                <th>الكيان</th>
                <th>التفاصيل</th>
                <th>المستخدم</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td>{new Date(l.createdAt).toLocaleString('ar')}</td>
                  <td>{l.action}</td>
                  <td>{l.entity}</td>
                  <td>{l.details}</td>
                  <td>{l.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}