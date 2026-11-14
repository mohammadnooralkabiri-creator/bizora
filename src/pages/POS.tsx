import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';

export default function POS() {
  const { state, addOrder, addInvoice } = useStore();
  const { products, settings } = state;
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [productId, setProductId] = useState(products[0]?.id || '');
  const [qty, setQty] = useState(1);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('عميل POS');

  const addToCart = () => {
    if (!productId) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) {
        return prev.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { productId, qty }];
    });
    setQty(1);
  };

  const removeItem = (id: string) => setCart(cart.filter((c) => c.productId !== id));

  const total = cart.reduce((s, c) => {
    const p = products.find((x) => x.id === c.productId);
    return s + (p ? p.price * c.qty : 0);
  }, 0);

  const checkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const orderItems = cart.map((c) => {
      const p = products.find((x) => x.id === c.productId)!;
      return { productId: p.id, productName: p.name, qty: c.qty, price: p.price, cost: p.cost };
    });
    const order = addOrder({ customerName: customerName || 'عميل POS', phone: '', items: orderItems, status: 'delivered', notes: 'بيع نقطة بيع' });
    addInvoice({
      orderId: order.id,
      customerName: order.customerName,
      items: order.items.map((i) => ({ name: i.productName, qty: i.qty, price: i.price })),
      subtotal: order.total,
      taxRate: settings.taxRate,
      paid: true,
    });
    setCart([]);
    setOpenCheckout(false);
    setCustomerName('عميل POS');
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>نقطة البيع (POS)</h1>
          <p>بيع سريع وإصدار فاتورة</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>إضافة منتج</h3>
          <div className="form">
            <label>المنتج</label>
            <select value={productId} onChange={(e) => setProductId(e.target.value)}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} (مخزون {p.quantity})</option>
              ))}
            </select>
            <label>الكمية</label>
            <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            <button className="primary-btn full" onClick={addToCart}>+ إضافة للسلة</button>
          </div>
        </div>

        <div className="card">
          <h3>السلة</h3>
          {cart.length === 0 ? (
            <p className="empty">السلة فارغة</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>المنتج</th><th>الكمية</th><th>المجموع</th><th></th></tr>
              </thead>
              <tbody>
                {cart.map((c) => {
                  const p = products.find((x) => x.id === c.productId);
                  return (
                    <tr key={c.productId}>
                      <td>{p?.name}</td>
                      <td>{c.qty}</td>
                      <td>{((p?.price || 0) * c.qty).toFixed(2)}</td>
                      <td><button className="small-btn danger" onClick={() => removeItem(c.productId)}>×</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="total-line">المجموع: {total.toFixed(2)} {settings.currency}</div>
          <button className="primary-btn full" disabled={cart.length === 0} onClick={() => setOpenCheckout(true)}>إتمام البيع</button>
        </div>
      </div>

      <Modal open={openCheckout} title="إتمام البيع" onClose={() => setOpenCheckout(false)}>
        <form onSubmit={checkout} className="form">
          <label>اسم العميل</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <div className="total-line">المجموع: {total.toFixed(2)} {settings.currency}</div>
          <button type="submit" className="primary-btn full">تأكيد ودفع</button>
        </form>
      </Modal>
    </div>
  );
}