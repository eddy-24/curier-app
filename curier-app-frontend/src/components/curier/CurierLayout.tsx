import { Outlet } from 'react-router-dom';
import CurierNavbar from './CurierNavbar';
import './CurierLayout.css';

interface CurierLayoutProps {
  onLogout: () => void;
}

const CurierLayout = ({ onLogout }: CurierLayoutProps) => {
  return (
    <div className="curier-layout">
      <main className="curier-content">
        <Outlet />
      </main>
      <CurierNavbar onLogout={onLogout} />
    </div>
  );
};

export default CurierLayout;
