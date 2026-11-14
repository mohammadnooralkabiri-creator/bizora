import React, { useState } from 'react';
import { useStore } from '../store';
import type { Role, User } from '../types';

const ROLE_LABELS: Record<Role, string> = {
  owner: 'مالك (كامل الصلاحيات)',
  admin: 'مدير نظام',
  viewer: 'رؤية فقط',
  finance: 'مسؤول المالية',
  warehouse: 'مستودع',
  orders: 'الطلبات',
  cashier: 'كاشير',
  employee: 'موظف',
};

const ROLE_OPTIONS: Role[] = ['viewer', 'finance', 'warehouse', 'orders', 'cashier', 'employee', 'admin'];

export default function Accounts() {
  const { state, addAccount, updateAccount, deleteAccount } = useStore();
  const { accounts, user } = state;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('viewer');
  const [editing, setEditing] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Role>('viewer');

  const isOwner = user?.role === 'owner' || user?.role === 'admin';

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (editing) {
      updateAccount(editing, { role: editRole });
      setEditing(null);
    } else {
      addAccount({ username: name.trim() || email.trim(), email: email.trim(), password: '', role });
      setEmail('');
      setName('');
      setRole('viewer');
    }
  };

  const startEdit = (a: User) => {
    setEditing(a.id);
    setEditRole(a.role);
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الحسابات والصلاحيات</h1>
          <p>إنشاء حسابات وتحديد صلاحيات كل مستخدم (للمالك)</p>
        </div>
      </div>

      {!isOwner && (
        <div className="alert-banner">⚠ هذه الصفحة مخصصة للمالك/المدير.</div>
      )}

      {isOwner && (
        <div className="card">
          <h3>{editing ? 'تعديل صلاحية حساب' : 'إنشاء حساب جديد'}</h3>
          <form onSubmit={submit} className="form">
            {!editing && (
              <>
                <label>البريد الإلكتروني</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>اسم العرض (اختياري)</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </>
            )}
            <label>الصلاحية</label>
            <select value={editing ? editRole : role} onChange={(e) => (editing ? setEditRole(e.target.value as Role) : setRole(e.target.value as Role))}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            <button type="submit" className="primary-btn full">{editing ? 'حفظ' : 'إنشاء حساب'}</button>
            {editing && <button type="button" className="secondary-btn full" onClick={() => setEditing(null)}>إلغاء</button>}
          </form>
        </div>
      )}

      <div className="card">
        <h3>الحسابات</h3>
        {accounts.length === 0 ? (
          <p className="empty">لا توجد حسابات</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>اسم المستخدم</th><th>الصلاحية</th><th>إجراءات</th></tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id}>
                  <td>{a.email} {a.id === user?.id && '(أنت)'}</td>
                  <td>{ROLE_LABELS[a.role] || a.role}</td>
                  <td className="actions-cell">
                    {isOwner && a.role !== 'owner' && (
                      <>
                        <button className="small-btn" onClick={() => startEdit(a)}>تعديل</button>
                        <button className="small-btn danger" onClick={() => deleteAccount(a.id)}>حذف</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}