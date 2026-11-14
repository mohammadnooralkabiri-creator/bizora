import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';
import type { Product } from '../types';

export default function Products() {
  const { state, addProduct, updateProduct, deleteProduct } = useStore();
  const { products, settings } = state;
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', category: '', price: 0, cost: 0, quantity: 0, minStock: 10 });

  const reset = () => { setForm({ name: '', category: '', price: 0, cost: 0, quantity: 0, minStock: 10 }); setEditing(null); };

  const filtered = products.filter((p) =>
    !search || p.name.includes(search) || p.category.includes(search)
  );

  const openEdit = (p: Product) => {
    setEditing(p.id);
    setForm({ name: p.name, category: p.category, price: p.price, cost: p.cost, quantity: p.quantity, minStock: p.minStock });
    setOpen(true);
  };

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\\r?\\n/).filter(Boolean);
      lines.forEach((line, idx) => {
        if (idx === 0 && /name/i.test(line)) return; // header
        const cols = line.split(',').map((c) => c.trim());
        if (cols.length < 2) return;
        addProduct({
          name: cols[0] || 'منتج',
          category: cols[1] || '',
          price: Number(cols[2]) || 0,
          cost: Number(cols[3]) || 0,
          quantity: Number(cols[4]) || 0,
          minStock: Number(cols[5]) || 10,
        });
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateProduct(editing, form);
    } else {
      addProduct(form);
    }
    reset();
    setOpen(false);
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>المنتجات</h1>
          <p>إدارة منتجاتك وأسعارك</p>
        </div>
        <div className="header-actions">
          <label className="secondary-btn" style={{ cursor: 'pointer' }}>
            استيراد CSV
            <input type="file" accept=".csv" onChange={importCSV} style={{ display: 'none' }} />
          </label>
          <button className="primary-btn" onClick={() => { reset(); setOpen(true); }}>+ منتج جديد</button>
        </div>
      </div>

      <div className="card">
        <input className="search-input" placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 12 }} />
        {filtered.length === 0 ? (
          <p className="empty">لا توجد منتجات</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>الفئة</th>
                <th>سعر البيع</th>
                <th>التكلفة</th>
                <th>الكمية</th>
                <th>الربح/وحدة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className={p.quantity <= settings.lowStockThreshold ? 'low-stock-row' : ''}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price.toFixed(2)}</td>
                  <td>{p.cost.toFixed(2)}</td>
                  <td>{p.quantity} {p.quantity <= settings.lowStockThreshold && '⚠'}</td>
                  <td>{(p.price - p.cost).toFixed(2)}</td>
                  <td className="actions-cell">
                    <button className="small-btn" onClick={() => openEdit(p)}>تعديل</button>
                    <button className="small-btn danger" onClick={() => deleteProduct(p.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} title={editing ? 'تعديل منتج' : 'منتج جديد'} onClose={() => { setOpen(false); reset(); }}>
        <form onSubmit={submit} className="form">
          <label>اسم المنتج</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label>الفئة</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <label>سعر البيع</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <label>التكلفة</label>
          <input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} />
          <label>الكمية</label>
          <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
          <label>حد التنبيه (مخزون منخفض)</label>
          <input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })} />
          <button type="submit" className="primary-btn full">حفظ</button>
        </form>
      </Modal>
    </div>
  );
}