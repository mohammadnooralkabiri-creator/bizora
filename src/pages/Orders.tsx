import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';
import type { Order, OrderStatus } from '../types';

export default function Orders() {
  const { state, addOrder, updateOrderStatus, deleteOrder, addInvoice } = useStore();
  const { products, orders, settings } = state;
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<{ productId: string; qty: number }[]>([]);

  const addItem = () => setItems([...items, { productId: products[0]?.id || '', qty: 1 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, patch: Partial<{ productId: string; qty: number }>) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    const orderItems = items
      .filter((it) => it.productId)
      .map((it) => {
        const p = products.find((x) => x.id === it.productId)!;
        return { productId: p.id, productName: p.name, qty: it.qty, price: p.price, cost: p.cost };
      });
    if (orderItems.length === 0) return;
    addOrder({ customerName, phone, items: orderItems, status: 'pending', notes });
    setCustomerName(''); setPhone(''); setNotes(''); setItems([]); setOpen(false);
  };

  const totalForItems = items.reduce((s, it) => {
    const p = products.find((x) => x.id === it.productId);
    return s + (p ? p.price * it.qty : 0);
  }, 0);

  const createInvoice = (o: Order) => {
    addInvoice({
      orderId: o.id,
      customerName: o.customerName,
      items: o.items.map((i: Order['items'][number]) => ({ name: i.productName, qty: i.qty, price: i.price })),
      subtotal: o.total,
      taxRate: settings.taxRate,
      paid: false,
    });
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الطلبات</h1>
          <p>استلام ومتابعة طلبات العملاء</p>
        </div>
        <button className="primary-btn" onClick={() => setOpen(true)}>+ طلب جديد</button>
      </div>

      <div className="card">
        {orders.length === 0 ? (
          <p className="empty">لا توجد طلبات</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>العميل</th>
                <th>الهاتف</th>
                <th>المجموع</th>
                <th>الربح</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 6)}</td>
                  <td>{o.customerName}</td>
                  <td>{o.phone}</td>
                  <td>{o.total.toFixed(2)} {settings.currency}</td>
                  <td>{o.profit.toFixed(2)}</td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className={`status-select status-${o.status}`}
                    >
                      <option value="pending">قيد الانتظار</option>
                      <option value="delivered">تم التسليم</option>
                      <option value="cancelled">ملغى</option>
                    </select>
                  </td>
                  <td className="actions-cell">
                    <button className="small-btn" onClick={() => createInvoice(o)}>فاتورة</button>
                    <button className="small-btn danger" onClick={() => deleteOrder(o.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} title="طلب جديد" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="form">
          <label>اسم العميل</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          <label>الهاتف</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
          <label>ملاحظات</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          <div className="items-header">
            <strong>المنتجات</strong>
            <button type="button" className="small-btn" onClick={addItem}>+ إضافة</button>
          </div>
          {items.map((it, i) => (
            <div className="item-row" key={i}>
              <select value={it.productId} onChange={(e) => updateItem(i, { productId: e.target.value })}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (مخزون {p.quantity})</option>
                ))}
              </select>
              <input type="number" min={1} value={it.qty} onChange={(e) => updateItem(i, { qty: Number(e.target.value) })} />
              <button type="button" className="small-btn danger" onClick={() => removeItem(i)}>×</button>
            </div>
          ))}
          <div className="total-line">المجموع: {totalForItems.toFixed(2)} {settings.currency}</div>
          <button type="submit" className="primary-btn full">حفظ الطلب</button>
        </form>
      </Modal>
    </div>
  );
}