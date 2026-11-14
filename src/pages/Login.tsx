import React, { useState } from 'react';
import { useStore } from '../store';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { state, loginByEmail } = useStore();
  const { accounts } = state;
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const acc = accounts.find((a) => a.email === email.trim() || a.username === email.trim());
    if (!acc) {
      setError('لا يوجد حساب بهذا البريد');
      return;
    }
    const c = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(c);
    setStep('code');
    setInfo(`تم إرسال كود التحقق إلى ${email} (تجريبي: ${c})`);
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code.trim() !== sentCode) {
      setError('كود التحقق غير صحيح');
      return;
    }
    const ok = loginByEmail(email.trim());
    if (ok) onLogin();
    else setError('فشل تسجيل الدخول');
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">B</div>
          <h1>bizora</h1>
          <p>منصة إدارة المشاريع الصغيرة</p>
        </div>
        <form onSubmit={step === 'email' ? sendCode : verify} className="login-form">
          <h2>{step === 'email' ? 'تسجيل الدخول بالبريد' : 'أدخل كود التحقق'}</h2>
          {step === 'email' ? (
            <>
              <label>البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@bizora.com" required />
            </>
          ) : (
            <>
              <label>كود التحقق (6 أرقام)</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" required />
              <button type="button" className="login-switch" onClick={() => setStep('email')}>تغيير البريد</button>
            </>
          )}
          {error && <div className="login-error">{error}</div>}
          {info && <div className="login-hint">{info}</div>}
          <button type="submit" className="login-btn">
            {step === 'email' ? 'إرسال الكود' : 'تحقق ودخول'}
          </button>
        </form>
        <p className="login-hint">الدخول الافتراضي: admin@bizora.com (كود يُرسل عند الطلب)</p>
      </div>
    </div>
  );
}