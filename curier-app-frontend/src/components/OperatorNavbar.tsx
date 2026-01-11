import { useNavigate, useLocation } from 'react-router-dom';
import './OperatorNavbar.css';

export default function OperatorNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Operator';
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
    <nav className="operator-navbar">
      <div className="navbar-brand">
        <a href="/operator/dashboard"><img src="/beak-logo.png" alt="BEAK" className="navbar-logo" /> BEAK <span className="badge-operator">Operator</span></a>
      </div>

      <div className="navbar-menu">
        <a href="/operator/dashboard" className={`nav-link ${isActive('/operator/dashboard')}`}>
          Dashboard
        </a>
        <a href="/operator/comenzi" className={`nav-link ${isActive('/operator/comenzi')}`}>
          Comenzi
        </a>
        <a href="/operator/colete" className={`nav-link ${isActive('/operator/colete')}`}>
          Colete
        </a>
        <a href="/operator/shipments" className={`nav-link ${isActive('/operator/shipments')}`}>
          Coadă Colete
        </a>
        <a href="/operator/curieri" className={`nav-link ${isActive('/operator/curieri')}`}>
          Curieri
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
