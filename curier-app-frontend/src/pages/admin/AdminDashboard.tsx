import { useState, useEffect } from 'react';
import './AdminLayout.css';

interface DashboardStats {
  totalUtilizatori: number;
  utilizatoriActivi: number;
  utilizatoriPeRoluri: {
    client?: number;
    curier?: number;
    operator?: number;
    admin?: number;
  };
  totalComenzi: number;
  comenziLunaCurenta: number;
  totalColete: number;
  coletePeStatusuri: {
    livrat?: number;
    in_tranzit?: number;
    in_asteptare?: number;
    [key: string]: number | undefined;
  };
}

interface Activity {
  tip: string;
  mesaj: string;
  data: string;
  detalii?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('http://localhost:8081/api/admin/dashboard/stats'),
        fetch('http://localhost:8081/api/admin/dashboard/activitate?limit=10')
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
      if (activityRes.ok) {
        const data = await activityRes.json();
        setRecentActivity(data);
      }
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getColeteLivrate = () => stats?.coletePeStatusuri?.livrat || 0;
  const getColeteInCurs = () => {
    const inTranzit = stats?.coletePeStatusuri?.in_tranzit || 0;
    const inAsteptare = stats?.coletePeStatusuri?.in_asteptare || 0;
    return inTranzit + inAsteptare;
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard Admin</h1>
          <p>Bun venit! Aici ai o privire de ansamblu asupra sistemului.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchDashboardData}>
            🔄 Reîmprospătează
          </button>
        </div>
      </div>

      {/* Statistici utilizatori */}
      <h2 style={{ marginBottom: '16px', color: '#F8FAFC' }}>👥 Utilizatori</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalUtilizatori || 0}</span>
            <span className="stat-label">Total utilizatori</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">👤</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.utilizatoriPeRoluri?.client || 0}</span>
            <span className="stat-label">Clienți</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🚴</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.utilizatoriPeRoluri?.curier || 0}</span>
            <span className="stat-label">Curieri</span>
          </div>
        </div>
      </div>

      {/* Statistici comenzi */}
      <h2 style={{ marginBottom: '16px', color: '#F8FAFC', marginTop: '32px' }}>📦 Comenzi & Colete</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalComenzi || 0}</span>
            <span className="stat-label">Total comenzi</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.totalColete || 0}</span>
            <span className="stat-label">Total colete</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🚚</div>
          <div className="stat-info">
            <span className="stat-value">{getColeteInCurs()}</span>
            <span className="stat-label">În procesare</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <span className="stat-value">{getColeteLivrate()}</span>
            <span className="stat-label">Livrate</span>
          </div>
        </div>
      </div>

      {/* Statistici luna curentă */}
      <h2 style={{ marginBottom: '16px', color: '#F8FAFC', marginTop: '32px' }}>📊 Luna curentă</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.comenziLunaCurenta || 0}</span>
            <span className="stat-label">Comenzi luna aceasta</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">👤</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.utilizatoriActivi || 0}</span>
            <span className="stat-label">Utilizatori activi</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">👷</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.utilizatoriPeRoluri?.operator || 0}</span>
            <span className="stat-label">Operatori</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🔐</div>
          <div className="stat-info">
            <span className="stat-value">{stats?.utilizatoriPeRoluri?.admin || 0}</span>
            <span className="stat-label">Administratori</span>
          </div>
        </div>
      </div>

      {/* Activitate recentă */}
      <div className="data-table-container" style={{ marginTop: '32px' }}>
        <div className="table-header">
          <h2>📋 Activitate recentă</h2>
        </div>
        {recentActivity.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>Nicio activitate recentă</h3>
            <p>Activitățile vor apărea aici pe măsură ce utilizatorii folosesc platforma.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tip</th>
                <th>Descriere</th>
                <th>Detalii</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td>
                    <span className={`badge ${activity.tip === 'comanda' ? 'badge-info' : 'badge-success'}`}>
                      {activity.tip === 'comanda' ? '📦 Comandă' : '👤 Utilizator'}
                    </span>
                  </td>
                  <td>{activity.mesaj}</td>
                  <td>{activity.detalii || '-'}</td>
                  <td>{activity.data ? new Date(activity.data).toLocaleString('ro-RO') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
