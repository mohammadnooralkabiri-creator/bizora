import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';

export default function Storefront({ onAdminLogin }: { onAdminLogin: () => void }) {
  const { state, addOrder, addInvoice } = useStore();
  const { products, settings } = state;
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState('');

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) return prev.map((c) => (c.productId === productId ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { productId, qty: 1 }];
    });
  };

  const total = cart.reduce((s, c) => {
    const p = products.find((x) => x.id === c.productId);
    return s + (p ? p.price * c.qty : 0);
  }, 0);

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || cart.length === 0) return;
    const orderItems = cart.map((c) => {
      const p = products.find((x) => x.id === c.productId)!;
      return { productId: p.id, productName: p.name, qty: c.qty, price: p.price, cost: p.cost };
    });
    const order = addOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      items: orderItems,
      status: 'pending',
      notes: address.trim() ? `العنوان: ${address.trim()}` : '',
    });
    addInvoice({
      orderId: order.id,
      customerName: order.customerName,
      items: order.items.map((i) => ({ name: i.productName, qty: i.qty, price: i.price })),
      subtotal: order.total,
      taxRate: settings.taxRate,
      paid: false,
    });
    setCart([]);
    setCheckoutOpen(false);
    setCustomerName('');
    setPhone('');
    setAddress('');
    setSuccess(`تم إنشاء الطلب #${order.id.slice(0, 6)} وفاتورة تواصل: ${phone || '—'}`);
  };

  return (
    <div className="storefront" dir="rtl">
      <header className="store-header">
        <div className="brand"><div className="brand-icon">B</div><h1>{settings.businessName}</h1></div>
        <div className="store-actions">
          <button className="secondary-btn" onClick={() => setCheckoutOpen(true)} disabled={cart.length === 0}>
            السلة ({cart.reduce((s, c) => s + c.qty, 0)}) — {total.toFixed(2)} {settings.currency}
          </button>
          <button className="small-btn" onClick={onAdminLogin}>دخول الإدارة</button>
        </div>
      </header>

      {success && <div className="alert-banner">{success}</div>}

      <div className="store-contacts">
        {settings.whatsappGroupLink && (
          <a className="wa-big-btn" href={settings.whatsappGroupLink} target="_blank" rel="noreferrer">💬 واتساب</a>
        )}
        {settings.phone && (
          <a className="wa-big-btn" href={`tel:${settings.phone}`}>📞 {settings.phone}</a>
        )}
        {settings.email && (
          <a className="wa-big-btn" href={`mailto:${settings.email}`}>✉️ {settings.email}</a>
        )}
        {settings.instagram && (
          <a className="wa-big-btn" href={settings.instagram} target="_blank" rel="noreferrer">📸 Instagram</a>
        )}
        {settings.snapchat && (
          <a className="wa-big-btn" href={settings.snapchat} target="_blank" rel="noreferrer">👻 Snapchat</a>
        )}
        {settings.tiktok && (
          <a className="wa-big-btn" href={settings.tiktok} target="_blank" rel="noreferrer">🎵 TikTok</a>
        )}
        {settings.website && (
          <a className="wa-big-btn" href={settings.website} target="_blank" rel="noreferrer">🌐 الموقع</a>
        )}
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p className="empty">لا توجد منتجات متاحة</p>
        ) : (
          products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-emoji">{p.name.charAt(0)}</div>
              <h3>{p.name}</h3>
              <p className="muted">{p.category || 'عام'}</p>
              <strong>{p.price.toFixed(2)} {settings.currency}</strong>
              <p className="stock">المخزون: {p.quantity}</p>
              <button className="primary-btn full" disabled={p.quantity <= 0} onClick={() => addToCart(p.id)}>
                {p.quantity <= 0 ? 'نفد' : 'أضف للسلة'}
              </button>
            </div>
          ))
        )}
      </div>

      <Modal open={checkoutOpen} title="إتمام الطلب" onClose={() => setCheckoutOpen(false)}>
        <form onSubmit={submitOrder} className="form">
          <label>الاسم</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          <label>رقم الهاتف (اختياري)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971..." />
          <label>العنوان (اختياري)</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
          <div className="total-line">المجموع: {total.toFixed(2)} {settings.currency}</div>
          <button type="submit" className="primary-btn full">تأكيد الطلب</button>
        </form>
      </Modal>
    </div>
  );
}