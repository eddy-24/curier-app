import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      // Dacă nu există username în localStorage, redirectăm la login
      navigate('/');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>🚚 Curier App</h1>
        </div>
        <div className="nav-user">
          <span>Bine ai venit, <strong>{username}</strong>!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Dashboard</h2>
          <p>Bine ai venit în aplicația de curierat! 🎉</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Comenzi</h3>
            <p className="card-number">12</p>
            <p className="card-description">Comenzi active</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🚚</div>
            <h3>Livrări</h3>
            <p className="card-number">8</p>
            <p className="card-description">În curs de livrare</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">✅</div>
            <h3>Finalizate</h3>
            <p className="card-number">45</p>
            <p className="card-description">Comenzi finalizate</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Clienți</h3>
            <p className="card-number">23</p>
            <p className="card-description">Clienți activi</p>
          </div>
        </div>

        <div className="info-section">
          <h3>🚀 Funcționalități viitoare:</h3>
          <ul>
            <li>Gestionare comenzi</li>
            <li>Tracking colete în timp real</li>
            <li>Rapoarte și statistici</li>
            <li>Gestionare utilizatori</li>
            <li>Notificări automate</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
