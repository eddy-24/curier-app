import { useState, useEffect } from 'react';
import './Facturi.css';

interface Factura {
  idFactura: number;
  serieNumar: string;
  sumaTotala: number;
  dataEmitere: string;
  dataScadenta: string;
  statusPlata: string;
  comanda: {
    idComanda: number;
    dataCreare: string;
  };
}

export default function Facturi() {
  const [facturi, setFacturi] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('toate');

  const clientId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    fetchFacturi();
  }, []);

  const fetchFacturi = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/client/${clientId}/facturi`);
      if (res.ok) {
        const data = await res.json();
        setFacturi(data);
      }
    } catch (error) {
      console.error('Eroare la încărcarea facturilor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achitat': return 'status-paid';
      case 'neachitat': return 'status-unpaid';
      case 'partial_achitat': return 'status-partial';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'achitat': return 'Achitat';
      case 'neachitat': return 'Neachitat';
      case 'partial_achitat': return 'Parțial achitat';
      default: return status;
    }
  };

  const filteredFacturi = facturi.filter(f => {
    if (filter === 'toate') return true;
    return f.statusPlata === filter;
  });

  const totalNeachitat = facturi
    .filter(f => f.statusPlata === 'neachitat')
    .reduce((sum, f) => sum + f.sumaTotala, 0);

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="facturi-page">
      <header className="page-header">
        <h1>Facturi și plăți</h1>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Total facturi</span>
          <span className="summary-value">{facturi.length}</span>
        </div>
        <div className="summary-card warning">
          <span className="summary-label">De plătit</span>
          <span className="summary-value">{totalNeachitat.toFixed(2)} RON</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'toate' ? 'active' : ''}`}
          onClick={() => setFilter('toate')}
        >
          Toate
        </button>
        <button 
          className={`filter-btn ${filter === 'neachitat' ? 'active' : ''}`}
          onClick={() => setFilter('neachitat')}
        >
          Neachitate
        </button>
        <button 
          className={`filter-btn ${filter === 'achitat' ? 'active' : ''}`}
          onClick={() => setFilter('achitat')}
        >
          Achitate
        </button>
      </div>

      {/* Facturi List */}
      {filteredFacturi.length === 0 ? (
        <div className="empty-state">
          <p>Nu ai facturi {filter !== 'toate' ? `${getStatusLabel(filter).toLowerCase()}e` : ''}.</p>
        </div>
      ) : (
        <div className="facturi-list">
          {filteredFacturi.map((factura) => (
            <div key={factura.idFactura} className="factura-card">
              <div className="factura-header">
                <div className="factura-info">
                  <h3>{factura.serieNumar || 'N/A'}</h3>
                  <span className="factura-date">
                    Emisă: {factura.dataEmitere ? new Date(factura.dataEmitere).toLocaleDateString('ro-RO') : '-'}
                  </span>
                </div>
                <span className={`status-badge ${getStatusColor(factura.statusPlata)}`}>
                  {getStatusLabel(factura.statusPlata)}
                </span>
              </div>

              <div className="factura-details">
                <div className="detail-item">
                  <span className="detail-label">Comandă</span>
                  <span className="detail-value">#{factura.comanda?.idComanda || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Scadență</span>
                  <span className="detail-value">
                    {factura.dataScadenta ? new Date(factura.dataScadenta).toLocaleDateString('ro-RO') : '-'}
                  </span>
                </div>
                <div className="detail-item total">
                  <span className="detail-label">Total</span>
                  <span className="detail-value">{(factura.sumaTotala ?? 0).toFixed(2)} RON</span>
                </div>
              </div>

              <div className="factura-actions">
                <button className="btn-link">Descarcă PDF</button>
                {factura.statusPlata === 'neachitat' && (
                  <button className="btn-pay">Plătește acum</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
