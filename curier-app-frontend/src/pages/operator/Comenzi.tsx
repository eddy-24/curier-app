import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Comenzi.css';

interface Colet {
  idColet: number;
  codAwb: string;
  statusColet: string;
  tipServiciu: string;
}

interface Comanda {
  idComanda: number;
  dataCreare: string;
  statusComanda: string;
  modalitatePlata: string;
  client: {
    idUtilizator: number;
    username: string;
    nume: string;
    prenume: string;
  };
  colete: Colet[];
}

export default function Comenzi() {
  const [searchParams] = useSearchParams();
  const [comenzi, setComenzi] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(searchParams.get('status') || 'toate');
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchComenzi();
  }, [filter]);

  const fetchComenzi = async () => {
    try {
      const url = filter === 'toate'
        ? 'http://localhost:8081/api/operator/comenzi'
        : `http://localhost:8081/api/operator/comenzi?status=${filter}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setComenzi(data);
      }
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (comandaId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8081/api/operator/comenzi/${comandaId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchComenzi();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'noua': return 'status-new';
      case 'in_procesare': return 'status-processing';
      case 'finalizata': return 'status-completed';
      case 'problema': return 'status-problem';
      case 'anulata': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'noua': return 'Nouă';
      case 'in_procesare': return 'În procesare';
      case 'finalizata': return 'Finalizată';
      case 'problema': return 'Problemă';
      case 'anulata': return 'Anulată';
      default: return status;
    }
  };

  const openDetails = (comanda: Comanda) => {
    setSelectedComanda(comanda);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="comenzi-page">
      <header className="page-header">
        <h1>Gestionare Comenzi</h1>
        <p className="subtitle">Total: {comenzi.length} comenzi</p>
      </header>

      {/* Filters */}
      <div className="filters">
        {['toate', 'noua', 'in_procesare', 'problema', 'finalizata', 'anulata'].map((s) => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? 'active' : ''} ${s}`}
            onClick={() => setFilter(s)}
          >
            {s === 'toate' ? 'Toate' : getStatusLabel(s)}
          </button>
        ))}
      </div>

      {/* Comenzi Table */}
      {comenzi.length === 0 ? (
        <div className="empty-state">
          <p>Nu există comenzi {filter !== 'toate' ? `cu statusul "${getStatusLabel(filter)}"` : ''}.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="comenzi-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Client</th>
                <th>Colete</th>
                <th>Plată</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {comenzi.map((comanda) => (
                <tr key={comanda.idComanda}>
                  <td><strong>#{comanda.idComanda}</strong></td>
                  <td>{new Date(comanda.dataCreare).toLocaleDateString('ro-RO')}</td>
                  <td>
                    {comanda.client?.prenume} {comanda.client?.nume}
                    <br />
                    <small>@{comanda.client?.username}</small>
                  </td>
                  <td>
                    <span className="colete-count">{comanda.colete?.length || 0}</span>
                  </td>
                  <td>{comanda.modalitatePlata}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(comanda.statusComanda)}`}>
                      {getStatusLabel(comanda.statusComanda)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view" onClick={() => openDetails(comanda)}>
                        Detalii
                      </button>
                      <a href={`/operator/comenzi/${comanda.idComanda}/edit`} className="btn-edit">
                        Editează
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detalii */}
      {showModal && selectedComanda && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Comandă #{selectedComanda.idComanda}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Informații generale</h3>
                <div className="detail-grid">
                  <div>
                    <label>Data creării</label>
                    <p>{new Date(selectedComanda.dataCreare).toLocaleString('ro-RO')}</p>
                  </div>
                  <div>
                    <label>Client</label>
                    <p>{selectedComanda.client?.prenume} {selectedComanda.client?.nume}</p>
                  </div>
                  <div>
                    <label>Modalitate plată</label>
                    <p>{selectedComanda.modalitatePlata}</p>
                  </div>
                  <div>
                    <label>Status</label>
                    <span className={`status-badge ${getStatusColor(selectedComanda.statusComanda)}`}>
                      {getStatusLabel(selectedComanda.statusComanda)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Colete ({selectedComanda.colete?.length || 0})</h3>
                {selectedComanda.colete?.map((colet) => (
                  <div key={colet.idColet} className="colet-item">
                    <span className="colet-awb">{colet.codAwb}</span>
                    <span className="colet-service">{colet.tipServiciu}</span>
                    <span className={`status-badge small ${getStatusColor(colet.statusColet)}`}>
                      {colet.statusColet}
                    </span>
                    <a href={`/operator/colete/${colet.idColet}`} className="btn-link">
                      Vezi
                    </a>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <h3>Schimbă status</h3>
                <div className="status-buttons">
                  {['noua', 'in_procesare', 'finalizata', 'problema', 'anulata'].map((s) => (
                    <button
                      key={s}
                      className={`status-btn ${s} ${selectedComanda.statusComanda === s ? 'current' : ''}`}
                      onClick={() => handleStatusChange(selectedComanda.idComanda, s)}
                      disabled={selectedComanda.statusComanda === s}
                    >
                      {getStatusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a href={`/operator/comenzi/${selectedComanda.idComanda}/factura`} className="btn-secondary">
                📄 Factură
              </a>
              <button className="btn-primary" onClick={() => setShowModal(false)}>
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
