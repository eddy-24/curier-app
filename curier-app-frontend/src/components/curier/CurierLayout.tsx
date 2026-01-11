import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import CurierNavbar from './CurierNavbar';
import './CurierLayout.css';

export default function CurierLayout() {
  return (
    <div className="curier-layout">
      <CurierNavbar />
      <main className="curier-main">
        <Outlet />
      </main>
    </div>
  );
}
