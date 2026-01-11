import type { ReactNode } from 'react';
import OperatorNavbar from './OperatorNavbar';
import './OperatorLayout.css';

interface OperatorLayoutProps {
  children: ReactNode;
}

export default function OperatorLayout({ children }: OperatorLayoutProps) {
  return (
    <div className="operator-layout">
      <OperatorNavbar />
      <main className="operator-main">
        {children}
      </main>
    </div>
  );
}
