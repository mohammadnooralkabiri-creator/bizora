import { useStore } from '../store';
import { MessageCircle, Gamepad2, Camera, Aperture, Music, Users2, Globe, Phone, Mail } from 'lucide-react';

export default function Links() {
  const { state } = useStore();
  const { settings } = state;

  const items = [
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
              <a key={it.label} className="wa-big-btn links-item" href={it.href} target="_blank" rel="noreferrer">
                <it.Icon size={18} /> {it.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}