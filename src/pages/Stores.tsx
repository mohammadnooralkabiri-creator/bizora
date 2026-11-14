import { useStore } from '../store';

export default function Stores() {
  const { state } = useStore();
  const { settings } = state;

  return (
    <div className="page" dir="rtl">
      <div className="page-header">
        <div>
          <h1>المتاجر والفروع</h1>
          <p>إدارة متاجر {settings.businessName}</p>
        </div>
      </div>
      <div className="card">
        <p className="muted">إدارة متعددة المتاجر قيد التطوير. المتجر الرئيسي: {settings.businessName}.</p>
        <div className="metric-row"><span>العملة</span><strong>{settings.currency}</strong></div>
        <div className="metric-row"><span>نسبة الضريبة</span><strong>{settings.taxRate}%</strong></div>
      </div>
    </div>
  );
}