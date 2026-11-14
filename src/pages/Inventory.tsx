import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';

export default function Inventory() {
  const { state, updateProduct, addStockMovement } = useStore();
  const { products, settings, stockMovements } = state;
  const [restockId, setRestockId] = useState<string | null>(null);
  const [qty, setQty] = useState(0);
  const [mvOpen, setMvOpen] = useState(false);
  const [mv, setMv] = useState({ productId: products[0]?.id || '', type: 'in' as 'in' | 'out' | 'transfer' | 'adjustment', qty: 0, reason: '' });

  const submitMv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mv.productId) return;
    addStockMovement({ productId: mv.productId, type: mv.type, qty: mv.qty, reason: mv.reason });
    setMvOpen(false);
    setMv({ productId: products[0]?.id || '', type: 'in', qty: 0, reason: '' });
  };

  const lowStock = products.filter((p) => p.quantity <= settings.lowStockThreshold);

  const doRestock = () => {
    if (!restockId) return;
    const p = products.find((x) => x.id === restockId);
    if (!p) return;
    updateProduct(restockId, { quantity: p.quantity + qty });
    setRestockId(null); setQty(0);
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>المخزون</h1>
          <p>مراقبة المخزون والتنبيهات</p>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="alert-banner">
          ⚠ تنبيه مخزون منخفض: {lowStock.length} منتج
          <ul>
            {lowStock.map((p) => (
              <li key={p.id}>{p.name}: بقي {p.quantity} (الحد {settings.lowStockThreshold})</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <h3>المنتجات (جميعها)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>الكمية</th>
              <th>الحد</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.quantity <= settings.lowStockThreshold ? 'low-stock-row' : ''}>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.minStock}</td>
                <td>
                  {p.quantity <= settings.lowStockThreshold ? (
                    <span className="status status-cancelled">منخفض</span>
                  ) : (
                    <span className="status status-delivered">جيد</span>
                  )}
                </td>
                <td>
                  <button className="small-btn" onClick={() => { setRestockId(p.id); setQty(0); }}>إعادة تعبئة</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="empty">لا توجد منتجات</p>}
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 12 }}>
          <h3>حركات المخزون</h3>
          <button className="primary-btn" onClick={() => setMvOpen(true)}>+ حركة جديدة</button>
        </div>
        {stockMovements.length === 0 ? (
          <p className="empty">لا توجد حركات</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>المنتج</th><th>النوع</th><th>الكمية</th><th>السبب</th><th>التاريخ</th></tr>
            </thead>
            <tbody>
              {stockMovements.slice(0, 20).map((m) => (
                <tr key={m.id}>
                  <td>{m.productName}</td>
                  <td>{m.type}</td>
                  <td>{m.qty}</td>
                  <td>{m.reason}</td>
                  <td>{new Date(m.createdAt).toLocaleString('ar')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={mvOpen} title="حركة مخزون" onClose={() => setMvOpen(false)}>
        <form onSubmit={submitMv} className="form">
          <label>المنتج</label>
          <select value={mv.productId} onChange={(e) => setMv({ ...mv, productId: e.target.value })}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <label>النوع</label>
          <select value={mv.type} onChange={(e) => setMv({ ...mv, type: e.target.value as 'in' | 'out' | 'transfer' | 'adjustment' })}>
            <option value="in">استلام</option>
            <option value="out">صرف</option>
            <option value="transfer">تحويل</option>
            <option value="adjustment">تسوية</option>
          </select>
          <label>الكمية</label>
          <input type="number" value={mv.qty} onChange={(e) => setMv({ ...mv, qty: Number(e.target.value) })} />
          <label>السبب</label>
          <input value={mv.reason} onChange={(e) => setMv({ ...mv, reason: e.target.value })} />
          <button type="submit" className="primary-btn full">حفظ</button>
        </form>
      </Modal>

      <Modal open={!!restockId} title="إعادة تعبئة المخزون" onClose={() => setRestockId(null)}>
        <div className="form">
          <label>الكمية المضافة</label>
          <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} min={1} />
          <button className="primary-btn full" onClick={doRestock}>تأكيد</button>
        </div>
      </Modal>
    </div>
  );
}