import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const nume = localStorage.getItem('nume') || 'Admin';
  const prenume = localStorage.getItem('prenume') || '';

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users-crud', label: 'Utilizatori' },
    { path: '/admin/vehicule-crud', label: 'Vehicule' },
    { path: '/admin/services-crud', label: 'Servicii' },
    { path: '/admin/rapoarte', label: 'Rapoarte KPI' },
    { path: '/admin/configurari', label: 'Configurări' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <img src="/beak-logo.png" alt="BEAK" className="sidebar-logo" />
            <span className="logo-text">BEAK</span>
          </div>
          <span className="admin-badge">ADMIN</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{prenume.charAt(0) || 'A'}{nume.charAt(0) || 'D'}</div>
            <div className="user-details">
              <span className="user-name">{prenume} {nume}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Deconectare
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
