import { useState, useEffect } from 'react';
import '../admin/AdminLayout.css';
import './ClientDashboard.css';

interface DashboardStats {
  totalExpedieri: number;
  inCurs: number;
  livrate: number;
  totalFacturi: number;
}

interface Expediere {
  idComanda: number;
  dataCreare: string;
  statusComanda: string;
  modalitatePlata: string;
  colete: Array<{
    idColet: number;
    codAwb: string;
    statusColet: string;
    tipServiciu: string;
  }>;
}

export default function ClientDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [expedieri, setExpedieri] = useState<Expediere[]>([]);
  const [loading, setLoading] = useState(true);

  const clientId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, expedieriRes] = await Promise.all([
        fetch(`http://localhost:8081/api/client/${clientId}/dashboard`),
        fetch(`http://localhost:8081/api/client/${clientId}/expedieri/recente`)
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (expedieriRes.ok) {
        const expedieriData = await expedieriRes.json();
        setExpedieri(expedieriData);
      }
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'noua': return 'status-new';
      case 'in_procesare': return 'status-processing';
      case 'finalizata': return 'status-completed';
      case 'anulata': return 'status-cancelled';
      case 'anulat': return 'status-cancelled';
      case 'in_asteptare': return 'status-processing';
      case 'asteptare_plata': return 'status-new';
      case 'in_tranzit': return 'status-processing';
      case 'in_livrare': return 'status-processing';
      case 'livrat': return 'status-completed';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'noua': return 'Nouă';
      case 'in_procesare': return 'În procesare';
      case 'finalizata': return 'Finalizată';
      case 'anulata': return 'Anulată';
      case 'anulat': return 'Anulată';
      case 'in_asteptare': return 'În așteptare';
      case 'asteptare_plata': return 'Așteaptă plata';
      case 'in_tranzit': return 'În tranzit';
      case 'in_livrare': return 'În livrare';
      case 'livrat': return 'Livrat';
      default: return status;
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Se încarcă...</div>;
  }

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <header className="dashboard-hero">
        <div className="hero-content">
          <h1>Dashboard Client</h1>
          <p className="hero-subtitle">Gestionează expedierile tale rapid și eficient</p>
        </div>
        <a href="/client/expediere-noua" className="btn-cta">
          <span className="btn-icon">+</span>
          Expediere nouă
        </a>
      </header>

      {/* KPI Cards */}
      <section className="kpi-section">
        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{stats?.totalExpedieri || 0}</span>
            <span className="kpi-label">Total Expedieri</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{stats?.inCurs || 0}</span>
            <span className="kpi-label">În Curs</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{stats?.livrate || 0}</span>
            <span className="kpi-label">Livrate</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon-purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-value">{stats?.totalFacturi?.toFixed(2) || '0.00'}</span>
            <span className="kpi-label">RON Facturat</span>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2 className="section-title">Acțiuni Rapide</h2>
        <div className="quick-actions-grid">
          <a href="/client/expediere-noua" className="quick-action-card">
            <div className="action-icon action-icon-orange">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <span className="action-label">Expediere Nouă</span>
          </a>

          <a href="/client/tracking" className="quick-action-card">
            <div className="action-icon action-icon-cyan">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <span className="action-label">Tracking AWB</span>
          </a>

          <a href="/client/facturi" className="quick-action-card">
            <div className="action-icon action-icon-purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <span className="action-label">Facturi</span>
          </a>

          <a href="/client/adrese" className="quick-action-card">
            <div className="action-icon action-icon-pink">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <span className="action-label">Adrese</span>
          </a>
        </div>
      </section>

      {/* Recent Shipments Table */}
      <section className="data-table-container" style={{ marginTop: 0 }}>
        <div className="table-header">
          <h2>Expedieri Recente</h2>
        </div>
        {expedieri.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-icon">📦</div>
            <p>Nu ai expedieri încă.</p>
            <a href="/client/expediere-noua" className="btn-cta">
              Creează prima expediere
            </a>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>AWB</th>
                <th>Serviciu</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {expedieri.map((exp) => (
                <tr key={exp.idComanda}>
                  <td><strong>#{exp.idComanda}</strong></td>
                  <td>{new Date(exp.dataCreare).toLocaleDateString('ro-RO')}</td>
                  <td><code style={{ background: 'rgba(148, 163, 184, 0.2)', padding: '4px 8px', borderRadius: '4px', color: '#94A3B8', fontSize: '12px' }}>{exp.colete?.map(c => c.codAwb).join(', ') || '-'}</code></td>
                  <td>{exp.colete?.[0]?.tipServiciu || '-'}</td>
                  <td>
                    <span className={`badge ${getStatusColor(exp.colete?.[0]?.statusColet || exp.statusComanda)}`}>
                      {getStatusLabel(exp.colete?.[0]?.statusColet || exp.statusComanda)}
                    </span>
                  </td>
                  <td>
                    <a href={`/client/tracking/${exp.colete?.[0]?.codAwb}`} className="btn-action btn-edit-action" style={{ display: 'inline-flex', textDecoration: 'none' }} title="Tracking">
                      🔍
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
