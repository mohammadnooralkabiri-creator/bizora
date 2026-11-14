import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';

export default function Invoices() {
  const { state, addInvoice, toggleInvoicePaid, deleteInvoice } = useStore();
  const { invoices, settings } = state;
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [items, setItems] = useState<{ name: string; qty: number; price: number }[]>([]);
  const [newItem, setNewItem] = useState({ name: '', qty: 1, price: 0 });

  const addItem = () => {
    if (!newItem.name) return;
    setItems([...items, { ...newItem }]);
    setNewItem({ name: '', qty: 1, price: 0 });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = items.reduce((s, i) => s + i.qty * i.price, 0) || subtotal;
    addInvoice({ customerName, items, subtotal: sub, taxRate: settings.taxRate, paid: false });
    setCustomerName(''); setSubtotal(0); setItems([]); setOpen(false);
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الفواتير</h1>
          <p>إنشاء وإدارة الفواتير</p>
        </div>
        <button className="primary-btn" onClick={() => setOpen(true)}>+ فاتورة جديدة</button>
      </div>

      <div className="card">
        {invoices.length === 0 ? (
          <p className="empty">لا توجد فواتير</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>العميل</th>
                <th>المجموع الفرعي</th>
                <th>الضريبة</th>
                <th>الإجمالي</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id.slice(0, 6)}</td>
                  <td>{inv.customerName}</td>
                  <td>{inv.subtotal.toFixed(2)}</td>
                  <td>{inv.tax.toFixed(2)}</td>
                  <td>{inv.total.toFixed(2)} {settings.currency}</td>
                  <td>
                    <button className={`small-btn ${inv.paid ? 'success' : ''}`} onClick={() => toggleInvoicePaid(inv.id)}>
                      {inv.paid ? 'مدفوعة' : 'غير مدفوعة'}
                    </button>
                  </td>
                  <td>
                    <button className="small-btn danger" onClick={() => deleteInvoice(inv.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} title="فاتورة جديدة" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="form">
          <label>اسم العميل</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          <div className="items-header">
            <strong>البنود</strong>
          </div>
          <div className="item-row">
            <input placeholder="اسم المنتج" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            <input type="number" min={1} value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })} />
            <input type="number" step="0.01" placeholder="سعر" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} />
            <button type="button" className="small-btn" onClick={addItem}>+</button>
          </div>
          {items.map((it, i) => (
            <div key={i} className="item-line">{it.name} × {it.qty} = {(it.qty * it.price).toFixed(2)}</div>
          ))}
          <div className="total-line">المجموع الفرعي: {items.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)}</div>
          <button type="submit" className="primary-btn full">حفظ الفاتورة</button>
        </form>
      </Modal>
    </div>
  );
}