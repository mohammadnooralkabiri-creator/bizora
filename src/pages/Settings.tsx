import { useState } from 'react';
import { useStore } from '../store';

export default function Settings() {
  const { state, updateSettings, clearAll, seedDemo } = useStore();
  const { settings } = state;
  const [form, setForm] = useState({ ...settings });

  const save = () => updateSettings(form);

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>الإعدادات</h1>
          <p>إعدادات المشروع</p>
        </div>
      </div>

      <div className="card">
        <h3>إعدادات عامة</h3>
        <div className="form">
          <label>اسم المشروع</label>
          <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          <label>العملة</label>
          <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
          <label>نسبة الضريبة (%)</label>
          <input type="number" step="0.01" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })} />
          <label>حد تنبيه المخزون</label>
          <input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })} />
          <label>رابط قروب الواتس</label>
          <input value={form.whatsappGroupLink} onChange={(e) => setForm({ ...form, whatsappGroupLink: e.target.value })} />
          <label>رقم الهاتف</label>
          <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <label>البريد الإلكتروني</label>
          <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label>Instagram</label>
          <input value={form.instagram || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          <label>Snapchat</label>
          <input value={form.snapchat || ''} onChange={(e) => setForm({ ...form, snapchat: e.target.value })} />
          <label>TikTok</label>
          <input value={form.tiktok || ''} onChange={(e) => setForm({ ...form, tiktok: e.target.value })} />
          <label>الموقع الإلكتروني</label>
          <input value={form.website || ''} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          <label>Discord (مجتمع)</label>
          <input value={form.discord || ''} onChange={(e) => setForm({ ...form, discord: e.target.value })} />
          <label>Facebook</label>
          <input value={form.facebook || ''} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          <button className="primary-btn" onClick={save}>حفظ الإعدادات</button>
        </div>
      </div>

      <div className="card">
        <h3>بيانات</h3>
        <div className="header-actions">
          <button className="secondary-btn" onClick={seedDemo}>تحميل بيانات تجريبية</button>
          <button className="danger-btn" onClick={() => { if (confirm('حذف جميع البيانات؟')) clearAll(); }}>حذف جميع البيانات</button>
        </div>
      </div>
    </div>
  );
}