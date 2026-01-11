import { useState, useEffect } from 'react';
import './OperatorDashboard.css';

interface DashboardStats {
  comenziNoi: number;
  comenziInLucru: number;
  comenziProbleme: number;
  comenziFinalizate: number;
  totalComenzi: number;
  coleteInTranzit: number;
  coleteLivrate: number;
  totalColete: number;
  curieriDisponibili: number;
}

export default function OperatorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/operator/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="operator-dashboard">
      <header className="page-header">
        <h1>Dashboard Operator</h1>
        <p className="subtitle">Gestionează comenzi, colete și curieri</p>
      </header>

      {/* Stats Cards */}
      <section className="stats-section">
        <h2>Comenzi</h2>
        <div className="stats-grid">
          <a href="/operator/comenzi?status=noua" className="stat-card new">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.comenziNoi || 0}</span>
              <span className="stat-label">Comenzi noi</span>
            </div>
          </a>

          <a href="/operator/comenzi?status=in_procesare" className="stat-card processing">
            <div className="stat-icon">⚙️</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.comenziInLucru || 0}</span>
              <span className="stat-label">În lucru</span>
            </div>
          </a>

          <a href="/operator/comenzi?status=problema" className="stat-card problem">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.comenziProbleme || 0}</span>
              <span className="stat-label">Probleme</span>
            </div>
          </a>

          <a href="/operator/comenzi?status=finalizata" className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.comenziFinalizate || 0}</span>
              <span className="stat-label">Finalizate</span>
            </div>
          </a>
        </div>
      </section>

      <section className="stats-section">
        <h2>Colete & Curieri</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.totalColete || 0}</span>
              <span className="stat-label">Total colete</span>
            </div>
          </div>

          <div className="stat-card transit">
            <div className="stat-icon">🚚</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.coleteInTranzit || 0}</span>
              <span className="stat-label">În tranzit</span>
            </div>
          </div>

          <div className="stat-card delivered">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.coleteLivrate || 0}</span>
              <span className="stat-label">Livrate</span>
            </div>
          </div>

          <a href="/operator/curieri" className="stat-card courier">
            <div className="stat-icon">👷</div>
            <div className="stat-info">
              <span className="stat-value">{stats?.curieriDisponibili || 0}</span>
              <span className="stat-label">Curieri</span>
            </div>
          </a>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="stats-section">
        <h2>Acțiuni rapide</h2>
        <div className="actions-grid">
          <a href="/operator/comenzi" className="action-card">
            <span className="action-icon">📋</span>
            <span>Vezi comenzi</span>
          </a>
          <a href="/operator/colete" className="action-card">
            <span className="action-icon">📦</span>
            <span>Gestionează colete</span>
          </a>
          <a href="/operator/curieri" className="action-card">
            <span className="action-icon">👷</span>
            <span>Asignează curieri</span>
          </a>
          <a href="/operator/comenzi?status=problema" className="action-card problem">
            <span className="action-icon">⚠️</span>
            <span>Rezolvă probleme</span>
          </a>
        </div>
      </section>
    </div>
  );
}
