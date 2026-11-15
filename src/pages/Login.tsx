import React, { useState } from 'react';
import { useStore } from '../store';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { state, login, addAccount } = useStore();
  const { accounts, settings } = state;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const isSetup = accounts.length === 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    if (isSetup) {
      addAccount({ username: username.trim(), email: `${username.trim()}@bizora.com`, password, role: 'owner' });
      const ok = login(username.trim(), password);
      if (ok) onLogin();
      else setError('فشل إنشاء الحساب');
      return;
    }
    const ok = login(username.trim(), password);
    if (ok) onLogin();
    else setError('بيانات الدخول غير صحيحة');
  };

  const discord = settings.discord || 'https://discord.gg/';

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">B</div>
          <h1>bizora</h1>
          <p>منصة إدارة المشاريع الصغيرة</p>
        </div>
        <form onSubmit={submit} className="login-form">
          <h2>{isSetup ? 'إعداد الحساب الأول (مالك)' : 'تسجيل الدخول'}</h2>
          <label>اسم المستخدم</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          <label>كلمة المرور</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          {error && <div className="login-error">{error}</div>}
          {info && <div className="login-hint">{info}</div>}
          <button type="submit" className="login-btn">
            {isSetup ? 'إنشاء ودخول' : 'دخول'}
          </button>
          {!isSetup && (
            <>
              <button type="button" className="login-switch" onClick={() => setInfo('حاليا يمكنك الطلب لا أكثر. هذه الواجهة إدارية لا يمكنك الدخول.')}>
                إنشاء حساب
              </button>
              <a className="login-switch" href={discord} target="_blank" rel="noreferrer">
                لا تملك حساب؟ اطلب حساب عبر Discord (تكت)
              </a>
            </>
          )}
        </form>
      </div>
    </div>
  );
}