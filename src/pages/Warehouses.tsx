import React, { useState } from 'react';
import { useStore } from '../store';

export default function Warehouses() {
  const { state, addWarehouse, deleteWarehouse } = useStore();
  const { warehouses } = state;
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addWarehouse({ name: name.trim(), location: location.trim() });
    setName('');
    setLocation('');
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>المستودعات</h1>
          <p>إدارة المستودعات والفروع</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>مستودع جديد</h3>
          <form onSubmit={submit} className="form">
            <label>اسم المستودع</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
            <label>الموقع</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} />
            <button type="submit" className="primary-btn full">إضافة</button>
          </form>
        </div>
        <div className="card">
          <h3>الإجمالي</h3>
          <strong>{warehouses.length}</strong>
          <p>مستودع</p>
        </div>
      </div>

      <div className="card">
        {warehouses.length === 0 ? (
          <p className="empty">لا توجد مستودعات</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>الاسم</th><th>الموقع</th><th>تاريخ</th><th>حذف</th></tr>
            </thead>
            <tbody>
              {warehouses.map((w) => (
                <tr key={w.id}>
                  <td>{w.name}</td>
                  <td>{w.location}</td>
                  <td>{new Date(w.createdAt).toLocaleDateString('ar')}</td>
                  <td><button className="small-btn danger" onClick={() => deleteWarehouse(w.id)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}