import { useState, useEffect } from 'react';
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
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'noua': return 'Nouă';
      case 'in_procesare': return 'În procesare';
      case 'finalizata': return 'Finalizată';
      case 'anulata': return 'Anulată';
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
      <section style={{ background: '#1E293B', borderRadius: '12px', padding: '1.5rem', border: '1px solid rgba(148, 163, 184, 0.08)' }}>
        <h2 className="section-title">Expedieri Recente</h2>
        {expedieri.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>Nu ai expedieri încă.</p>
            <a href="/client/expediere-noua" className="btn-cta">
              Creează prima expediere
            </a>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'transparent' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>Data</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>AWB</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>Serviciu</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', background: 'rgba(15, 23, 42, 0.5)' }}>Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {expedieri.map((exp) => (
                  <tr key={exp.idComanda} style={{ background: 'transparent' }}>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#A855F7', fontWeight: 600, borderBottom: '1px solid rgba(148, 163, 184, 0.06)' }}>#{exp.idComanda}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#E2E8F0', borderBottom: '1px solid rgba(148, 163, 184, 0.06)' }}>{new Date(exp.dataCreare).toLocaleDateString('ro-RO')}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'monospace', borderBottom: '1px solid rgba(148, 163, 184, 0.06)' }}>{exp.colete?.map(c => c.codAwb).join(', ') || '-'}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#E2E8F0', borderBottom: '1px solid rgba(148, 163, 184, 0.06)' }}>{exp.colete?.[0]?.tipServiciu || '-'}</td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(148, 163, 184, 0.06)' }}>
                      <span className={`status-pill ${getStatusColor(exp.statusComanda)}`}>
                        {getStatusLabel(exp.statusComanda)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(148, 163, 184, 0.06)' }}>
                      <a href={`/client/tracking/${exp.colete?.[0]?.codAwb}`} className="client-btn-tracking">
                        Tracking
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
