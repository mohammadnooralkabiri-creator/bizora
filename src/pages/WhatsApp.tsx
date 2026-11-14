import { useState } from 'react';
import { useStore } from '../store';

export default function WhatsApp() {
  const { state, updateSettings } = useStore();
  const { settings } = state;
  const [link, setLink] = useState(settings.whatsappGroupLink);

  const save = () => updateSettings({ whatsappGroupLink: link });

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>واتساب</h1>
          <p>رابط دخول قروب الواتس</p>
        </div>
      </div>

      <div className="card">
        <h3>رابط قروب الواتساب</h3>
        <p className="muted">شارك هذا الرابط مع فريقك/عملائك للانضمام إلى القروب.</p>
        <div className="form">
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://chat.whatsapp.com/..." />
          <button className="primary-btn" onClick={save}>حفظ</button>
        </div>
        <a className="wa-big-btn" href={settings.whatsappGroupLink} target="_blank" rel="noreferrer">
          💬 فتح قروب الواتساب
        </a>
      </div>
    </div>
  );
}