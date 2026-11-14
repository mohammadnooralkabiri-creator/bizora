import React, { useState } from 'react';
import { useStore } from '../store';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { login, register } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    if (mode === 'login') {
      const ok = login(username.trim(), password);
      if (ok) onLogin();
      else setError('بيانات الدخول غير صحيحة (جرب admin / admin)');
    } else {
      register(username.trim(), password);
      onLogin();
    }
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">B</div>
          <h1>bizora</h1>
          <p>منصة إدارة المشاريع الصغيرة</p>
        </div>
        <form onSubmit={submit} className="login-form">
          <h2>{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
          <label>اسم المستخدم</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" />
          <label>كلمة المرور</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn">
            {mode === 'login' ? 'دخول' : 'تسجيل'}
          </button>
          <button type="button" className="login-switch" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'ليس لديك حساب؟ سجّل الآن' : 'لديك حساب؟ سجّل دخول'}
          </button>
        </form>
        <p className="login-hint">الدخول الافتراضي: admin / admin</p>
      </div>
    </div>
  );
}