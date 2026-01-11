import { useNavigate, useLocation } from 'react-router-dom';
import './ClientNavbar.css';

export default function ClientNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Client';
  const nume = localStorage.getItem('nume') || '';
  const prenume = localStorage.getItem('prenume') || '';

  const displayName = nume && prenume ? `${prenume} ${nume}` : username;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="client-navbar">
      <div className="navbar-brand">
        <a href="/client/dashboard"><img src="/beak-logo.png" alt="BEAK" className="navbar-logo" /> BEAK</a>
      </div>

      <div className="navbar-menu">
        <a href="/client/dashboard" className={`nav-link ${isActive('/client/dashboard')}`}>
          Dashboard
        </a>
        <a href="/client/expediere-noua" className={`nav-link ${isActive('/client/expediere-noua')}`}>
          Expediere nouă
        </a>
        <a href="/client/tracking" className={`nav-link ${isActive('/client/tracking')}`}>
          Tracking
        </a>
        <a href="/client/facturi" className={`nav-link ${isActive('/client/facturi')}`}>
          Facturi
        </a>
        <a href="/client/adrese" className={`nav-link ${isActive('/client/adrese')}`}>
          Adrese
        </a>
      </div>

      <div className="navbar-user">
        <span className="user-name">👤 {displayName}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
