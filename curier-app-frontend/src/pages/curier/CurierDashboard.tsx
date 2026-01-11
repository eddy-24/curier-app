import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CurierDashboard.css';

interface DashboardStats {
  pickupuriAzi: number;
  livrariAzi: number;
  livrateAzi: number;
  totalColete: number;
  rambursDeIncasat: number;
  rambursIncasatAzi: number;
  sumaDeIncasatPickup: number;
}

const CurierDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Citim datele din localStorage - salvate individual
    const userId = localStorage.getItem('userId');
    const nume = localStorage.getItem('nume');
    const prenume = localStorage.getItem('prenume');
    
    console.log('localStorage data:', { userId, nume, prenume });
    
    if (userId && nume && prenume) {
      setUserName(`${prenume} ${nume}`);
      fetchDashboard(parseInt(userId));
    } else {
      console.log('Missing user data in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchDashboard = async (curierId: number) => {
    try {
      console.log('Fetching dashboard for curierId:', curierId);
      const response = await fetch(`http://localhost:8081/api/curier/${curierId}/dashboard`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data:', data);
        setStats(data);
      } else {
        console.error('Response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="curier-dashboard loading">
        <div className="loader"></div>
        <p>Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="curier-dashboard">
      <header className="dashboard-header">
        <h1>Bună, {userName}! 👋</h1>
        <p className="date-today">{new Date().toLocaleDateString('ro-RO', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card pickup" onClick={() => navigate('/curier/pickups')}>
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.pickupuriAzi || 0}</span>
            <span className="stat-label">Pickup-uri</span>
          </div>
        </div>

        <div className="stat-card delivery" onClick={() => navigate('/curier/livrari')}>
          <div className="stat-icon">🚚</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.livrariAzi || 0}</span>
            <span className="stat-label">De livrat</span>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.livrateAzi || 0}</span>
            <span className="stat-label">Livrate azi</span>
          </div>
        </div>

        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalColete || 0}</span>
            <span className="stat-label">Total colete</span>
          </div>
        </div>
      </div>

      <div className="ramburs-section" onClick={() => navigate('/curier/ramburs')}>
        <h2>💰 De încasat</h2>
        <div className="ramburs-cards">
          <div className="ramburs-card pickup-cash">
            <span className="ramburs-label">Plată pickup-uri</span>
            <span className="ramburs-value">{stats?.sumaDeIncasatPickup?.toFixed(2) || '0.00'} RON</span>
          </div>
          <div className="ramburs-card collected">
            <span className="ramburs-label">Încasat azi</span>
            <span className="ramburs-value">{stats?.rambursIncasatAzi?.toFixed(2) || '0.00'} RON</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurierDashboard;
