import React, { useState } from 'react';
import { useStore } from '../store';

export default function Employees() {
  const { state, addEmployee, deleteEmployee } = useStore();
  const { employees } = state;
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
  const [username, setUsername] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addEmployee({ name: name.trim(), role, username: username.trim() || name.trim() });
    setName('');
    setUsername('');
  };

  const roleLabel = (r: string) => {
    if (r === 'owner') return 'مالك';
    if (r === 'admin') return 'مدير';
    if (r === 'finance') return 'مالية';
    if (r === 'cashier') return 'كاشير';
    if (r === 'warehouse') return 'مستودع';
    return 'موظف';
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الموظفون</h1>
          <p>إدارة الفريق والأدوار</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>موظف جديد</h3>
          <form onSubmit={submit} className="form">
            <label>الاسم</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
            <label>اسم المستخدم</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>الدور</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="owner">مالك</option>
              <option value="admin">مدير</option>
              <option value="finance">مالية</option>
              <option value="cashier">كاشير</option>
              <option value="warehouse">مستودع</option>
              <option value="employee">موظف</option>
            </select>
            <button type="submit" className="primary-btn full">إضافة</button>
          </form>
        </div>
        <div className="card">
          <h3>الإجمالي</h3>
          <strong>{employees.length}</strong>
          <p>موظف</p>
        </div>
      </div>

      <div className="card">
        {employees.length === 0 ? (
          <p className="empty">لا يوجد موظفون</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>الاسم</th><th>اسم المستخدم</th><th>الدور</th><th>حذف</th></tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.username}</td>
                  <td>{roleLabel(e.role)}</td>
                  <td><button className="small-btn danger" onClick={() => deleteEmployee(e.id)}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}