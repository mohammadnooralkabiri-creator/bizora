import React from 'react';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.error(error); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="page" dir="rtl">
          <div className="alert-banner">حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.</div>
        </div>
      );
    }
    return this.props.children;
  }
}