import { useNavigate, useLocation } from 'react-router-dom';
import './CurierNavbar.css';

export default function CurierNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Curier';
  const nume = localStorage.getItem('nume') || '';
  const prenume = localStorage.getItem('prenume') || '';

  const displayName = nume && prenume ? `${prenume} ${nume}` : username;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/') ? 'active' : '';
  };

  return (
    <nav className="curier-navbar">
      <div className="navbar-brand">
        <a href="/curier/dashboard"><img src="/beak-logo.png" alt="BEAK" className="navbar-logo" /> BEAK <span className="badge-curier">Curier</span></a>
      </div>

      <div className="navbar-menu">
        <a href="/curier/dashboard" className={`nav-link ${isActive('/curier/dashboard')}`}>
          📊 Dashboard
        </a>
        <a href="/curier/pickups" className={`nav-link ${isActive('/curier/pickups')}`}>
          📦 Pickup-uri
        </a>
        <a href="/curier/livrari" className={`nav-link ${isActive('/curier/livrari')}`}>
          🚚 Livrări
        </a>
        <a href="/curier/scan" className={`nav-link ${isActive('/curier/scan')}`}>
          📷 Scanează AWB
        </a>
        <a href="/curier/ramburs" className={`nav-link ${isActive('/curier/ramburs')}`}>
          💰 Ramburs
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
