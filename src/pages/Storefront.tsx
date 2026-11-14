import React, { useState } from 'react';
import { useStore } from '../store';
import Modal from '../components/Modal';
import { MessageCircle, Gamepad2, Camera, Aperture, Music, Users2, Globe, Phone, Mail } from 'lucide-react';

export default function Storefront({ onAdminLogin }: { onAdminLogin: () => void }) {
  const { state, addOrder, addInvoice } = useStore();
  const { products, settings } = state;
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    const matchSearch = !search || p.name.includes(search) || p.category.includes(search);
    const matchCat = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId);
      if (existing) return prev.map((c) => (c.productId === productId ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { productId, qty: 1 }];
    });
  };

  const removeItem = (productId: string) => setCart((prev) => prev.filter((c) => c.productId !== productId));

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, qty } : c)));
  };

  const total = cart.reduce((s, c) => {
    const p = products.find((x) => x.id === c.productId);
    return s + (p ? p.price * c.qty : 0);
  }, 0);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || cart.length === 0) return;
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
    setSuccess(`تم إنشاء الطلب #${order.id.slice(0, 6)} — سنتواصل معك عبر ${phone || 'الرقم المحفوظ'}`);
  };

  const contacts = [
    { label: 'واتساب', href: settings.whatsappGroupLink, Icon: MessageCircle },
    { label: 'Discord', href: settings.discord, Icon: Gamepad2 },
    { label: 'Instagram', href: settings.instagram, Icon: Camera },
    { label: 'Snapchat', href: settings.snapchat, Icon: Aperture },
    { label: 'TikTok', href: settings.tiktok, Icon: Music },
    { label: 'Facebook', href: settings.facebook, Icon: Users2 },
    { label: 'الموقع', href: settings.website, Icon: Globe },
    { label: 'الهاتف', href: settings.phone ? `tel:${settings.phone}` : '', Icon: Phone },
    { label: 'البريد', href: settings.email ? `mailto:${settings.email}` : '', Icon: Mail },
  ].filter((x) => x.href && x.href.trim());

  return (
    <div className="storefront" dir="rtl">
      <header className="store-header">
        <div className="store-brand">
          <div className="brand-icon">B</div>
          <div>
            <h1>{settings.businessName}</h1>
            <span>متجرك — كل ما تحتاجه في مكان واحد</span>
          </div>
        </div>
        <div className="store-header-actions">
          <button className="store-cart-btn" onClick={() => setCheckoutOpen(true)} disabled={cart.length === 0}>
            🛒 السلة
            {cartCount > 0 && <span className="store-cart-count">{cartCount}</span>}
          </button>
          <button className="store-admin-btn" onClick={onAdminLogin}>دخول الإدارة</button>
        </div>
      </header>

      {success && <div className="store-success">{success}</div>}

      <section className="store-hero">
        <h2>مرحباً بك في {settings.businessName}</h2>
        <p>تصفح المنتجات، أضف إلى السلة، وأرسل طلبك. سنتواصل معك قريباً.</p>
      </section>

      <section className="store-toolbar">
        <input
          className="store-search"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="store-categories">
          <button
            className={`store-cat ${category === 'all' ? 'active' : ''}`}
            onClick={() => setCategory('all')}
          >
            الكل
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`store-cat ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="store-products">
        {filteredProducts.length === 0 ? (
          <div className="store-empty">مافي منتجات متاحة</div>
        ) : (
          <div className="store-grid">
            {filteredProducts.map((p) => (
              <article className="store-product" key={p.id}>
                <div className="store-product-image">{p.name.charAt(0)}</div>
                <div className="store-product-body">
                  <h3>{p.name}</h3>
                  <p className="store-product-cat">{p.category || 'عام'}</p>
                  <div className="store-product-meta">
                    <strong>{p.price.toFixed(2)} {settings.currency}</strong>
                    <span className={`store-stock ${p.quantity <= settings.lowStockThreshold ? 'low' : ''}`}>
                      {p.quantity <= 0 ? 'نفد' : `متبقي ${p.quantity}`}
                    </span>
                  </div>
                  <button
                    className="store-add-btn"
                    disabled={p.quantity <= 0}
                    onClick={() => addToCart(p.id)}
                  >
                    {p.quantity <= 0 ? 'نفد المخزون' : 'أضف للسلة'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {contacts.length > 0 && (
        <section className="store-contacts">
          <h3>تواصل معنا</h3>
          <div className="store-contacts-grid">
            {contacts.map((c) => (
              <a key={c.label} className="store-contact" href={c.href} target="_blank" rel="noreferrer">
                <span className="store-contact-icon"><c.Icon size={18} /></span>
                <span>{c.label}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <footer className="store-footer">
        © {new Date().getFullYear()} {settings.businessName}. جميع الحقوق محفوظة.
      </footer>

      <Modal open={checkoutOpen} title="إتمام الطلب" onClose={() => setCheckoutOpen(false)}>
        {cart.length === 0 ? (
          <p className="empty">السلة فارغة</p>
        ) : (
          <form onSubmit={submitOrder} className="form">
            <div className="store-cart-list">
              {cart.map((c) => {
                const p = products.find((x) => x.id === c.productId);
                return (
                  <div className="store-cart-row" key={c.productId}>
                    <span>{p?.name}</span>
                    <div className="store-cart-qty">
                      <button type="button" onClick={() => updateQty(c.productId, c.qty - 1)}>−</button>
                      <span>{c.qty}</span>
                      <button type="button" onClick={() => updateQty(c.productId, c.qty + 1)}>+</button>
                    </div>
                    <span>{((p?.price || 0) * c.qty).toFixed(2)}</span>
                    <button type="button" className="small-btn danger" onClick={() => removeItem(c.productId)}>×</button>
                  </div>
                );
              })}
            </div>
            <div className="store-cart-total">المجموع: {total.toFixed(2)} {settings.currency}</div>
            <label>الاسم</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            <label>رقم الهاتف (إجباري)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971..." required />
            <label>العنوان (إجباري)</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} required />
            <button type="submit" className="primary-btn full">تأكيد الطلب</button>
          </form>
        )}
      </Modal>
    </div>
  );
}