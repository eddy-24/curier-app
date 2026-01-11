import { NavLink, useNavigate } from 'react-router-dom';
import './CurierNavbar.css';

interface CurierNavbarProps {
  onLogout: () => void;
}

const CurierNavbar = ({ onLogout }: CurierNavbarProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  return (
    <nav className="curier-navbar">
      <NavLink to="/curier/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">📊</span>
        <span className="nav-label">Acasă</span>
      </NavLink>
      
      <NavLink to="/curier/pickups" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">📦</span>
        <span className="nav-label">Pickup</span>
      </NavLink>
      
      <NavLink to="/curier/livrari" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">🚚</span>
        <span className="nav-label">Livrări</span>
      </NavLink>
      
      <NavLink to="/curier/scan" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">📷</span>
        <span className="nav-label">Scan</span>
      </NavLink>
      
      <NavLink to="/curier/ramburs" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <span className="nav-icon">💰</span>
        <span className="nav-label">Ramburs</span>
      </NavLink>
      
      <button onClick={handleLogout} className="nav-item logout-btn">
        <span className="nav-icon">🚪</span>
        <span className="nav-label">Ieșire</span>
      </button>
    </nav>
  );
};

export default CurierNavbar;
