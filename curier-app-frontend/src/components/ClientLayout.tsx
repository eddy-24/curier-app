import type { ReactNode } from 'react';
import ClientNavbar from './ClientNavbar';
import './ClientLayout.css';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="client-layout">
      <ClientNavbar />
      <main className="client-main">
        {children}
      </main>
    </div>
  );
}
