import { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';

export default function Inventory() {
  const { state, updateProduct } = useStore();
  const { products, settings } = state;
  const [restockId, setRestockId] = useState<string | null>(null);
  const [qty, setQty] = useState(0);

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