import { useStore } from '../store';

export default function Links() {
  const { state } = useStore();
  const { settings } = state;

  const items = [
    { label: 'واتساب', href: settings.whatsappGroupLink, icon: '💬' },
    { label: 'Discord', href: settings.discord, icon: '🎮' },
    { label: 'Instagram', href: settings.instagram, icon: '📸' },
    { label: 'Snapchat', href: settings.snapchat, icon: '👻' },
    { label: 'TikTok', href: settings.tiktok, icon: '🎵' },
    { label: 'Facebook', href: settings.facebook, icon: '📘' },
    { label: 'الموقع', href: settings.website, icon: '🌐' },
    { label: 'الهاتف', href: settings.phone ? `tel:${settings.phone}` : '', icon: '📞' },
    { label: 'البريد', href: settings.email ? `mailto:${settings.email}` : '', icon: '✉️' },
  ].filter((x) => x.href && x.href.trim());

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>روابط التواصل</h1>
          <p>جميع منصات التواصل (تظهر عند إضافة رابط)</p>
        </div>
      </div>
      <div className="card">
        {items.length === 0 ? (
          <p className="empty">مافي</p>
        ) : (
          <div className="links-grid">
            {items.map((it) => (
              <a key={it.label} className="wa-big-btn" href={it.href} target="_blank" rel="noreferrer">
                {it.icon} {it.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}