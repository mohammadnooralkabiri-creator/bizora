import { useState } from 'react';
import { useStore } from '../store';
import type { Settings } from '../types';
import { MessageCircle, Gamepad2, Camera, Aperture, Music, Users2, Globe, Phone, Mail, Edit2, Save } from 'lucide-react';

const PLATFORMS = [
  { key: 'whatsappGroupLink', label: 'واتساب', Icon: MessageCircle, placeholder: 'https://chat.whatsapp.com/...' },
  { key: 'discord', label: 'Discord', Icon: Gamepad2, placeholder: 'https://discord.gg/...' },
  { key: 'instagram', label: 'Instagram', Icon: Camera, placeholder: 'https://instagram.com/...' },
  { key: 'snapchat', label: 'Snapchat', Icon: Aperture, placeholder: 'https://snapchat.com/...' },
  { key: 'tiktok', label: 'TikTok', Icon: Music, placeholder: 'https://tiktok.com/...' },
  { key: 'facebook', label: 'Facebook', Icon: Users2, placeholder: 'https://facebook.com/...' },
  { key: 'website', label: 'الموقع', Icon: Globe, placeholder: 'https://...' },
  { key: 'phone', label: 'الهاتف', Icon: Phone, placeholder: '+971...' },
  { key: 'email', label: 'البريد', Icon: Mail, placeholder: 'name@example.com' },
] as const;

export default function Links() {
  const { state, updateSettings } = useStore();
  const { settings, user } = state;
  const isOwner = user?.role === 'owner' || user?.role === 'admin';

  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const d: Record<string, string> = {};
    PLATFORMS.forEach((p) => {
      d[p.key] = ((settings as unknown) as Record<string, string | undefined>)[p.key] || '';
    });
    return d;
  });
  const [editing, setEditing] = useState<string | null>(null);

  const save = (key: string) => {
    updateSettings({ [key]: drafts[key] } as Partial<Settings>);
    setEditing(null);
  };

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>روابط التواصل</h1>
          <p>إدارة روابط جميع المنصات (تظهر عند إضافة رابط)</p>
        </div>
      </div>

      <div className="links-manage">
        {PLATFORMS.map((p) => {
          const value = ((settings as unknown) as Record<string, string | undefined>)[p.key] || '';
          const Icon = p.Icon;
          return (
            <div className="link-row" key={p.key}>
              <div className="link-row-head">
                <Icon size={18} />
                <strong>{p.label}</strong>
                {value && (
                  <a className="link-open" href={p.key === 'phone' ? `tel:${value}` : p.key === 'email' ? `mailto:${value}` : value} target="_blank" rel="noreferrer">
                    فتح
                  </a>
                )}
              </div>
              {editing === p.key ? (
                <div className="link-edit">
                  <input
                    value={drafts[p.key] || ''}
                    onChange={(e) => setDrafts({ ...drafts, [p.key]: e.target.value })}
                    placeholder={p.placeholder}
                  />
                  <button className="small-btn" onClick={() => save(p.key)}><Save size={14} /> حفظ</button>
                  <button className="small-btn danger" onClick={() => setEditing(null)}>إلغاء</button>
                </div>
              ) : (
                <div className="link-view">
                  <span className={value ? 'link-value' : 'link-empty'}>{value || 'مافي'}</span>
                  {isOwner && (
                    <button className="small-btn" onClick={() => setEditing(p.key)}><Edit2 size={14} /> تعديل</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}