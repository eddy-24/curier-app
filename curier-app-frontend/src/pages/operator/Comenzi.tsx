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
  const [showProblem, setShowProblem] = useState(false);
  const [problemText, setProblemText] = useState('');
  const [problemLoading, setProblemLoading] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelText, setCancelText] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [dateLoading, setDateLoading] = useState(false);
  const handleChangeDate = async (comandaId: number, dataLivrare: string) => {
    try {
      setDateLoading(true);
      const res = await fetch(`http://localhost:8081/api/operator/comenzi/${comandaId}/data-livrare`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataLivrare })
      });
      if (res.ok) {
        fetchComenzi();
        setShowModal(false);
        setShowDate(false);
        setNewDate('');
      }
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setDateLoading(false);
    }
  };

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

  const handleStatusChange = async (comandaId: number, newStatus: string, motiv?: string) => {
    try {
      if (newStatus === 'problema') setProblemLoading(true);
      if (newStatus === 'anulata') setCancelLoading(true);
      const res = await fetch(`http://localhost:8081/api/operator/comenzi/${comandaId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(motiv ? { status: newStatus, motiv } : { status: newStatus })
      });

      if (res.ok) {
        fetchComenzi();
        setShowModal(false);
        setShowProblem(false);
        setProblemText('');
        setShowCancel(false);
        setCancelText('');
      }
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setProblemLoading(false);
      setCancelLoading(false);
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
                        Gestionează
                      </button>
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
                      {getStatusLabel(colet.statusColet)}
                    </span>
                    <a href={`/operator/colete?search=${colet.codAwb}`} className="btn-link">
                      Vezi
                    </a>
                  </div>
                ))}
              </div>

              <div className="detail-section">
                <h3>Schimbă status sau dată livrare</h3>
                <div className="status-buttons" style={{ flexWrap: 'wrap', gap: 8 }}>
                  {['noua', 'in_procesare', 'finalizata', 'problema', 'anulata'].map((s) => {
                    if (s === 'problema') {
                      return (
                        <button
                          key={s}
                          className={`status-btn ${s} ${selectedComanda.statusComanda === s ? 'current' : ''}`}
                          onClick={() => setShowProblem(true)}
                          disabled={selectedComanda.statusComanda === s}
                        >
                          Raportează problemă
                        </button>
                      );
                    } else if (s === 'anulata') {
                      return (
                        <button
                          key={s}
                          className={`status-btn ${s} ${selectedComanda.statusComanda === s ? 'current' : ''}`}
                          onClick={() => setShowCancel(true)}
                          disabled={selectedComanda.statusComanda === s}
                        >
                          Anulează comandă
                        </button>
                      );
                    } else {
                      return (
                        <button
                          key={s}
                          className={`status-btn ${s} ${selectedComanda.statusComanda === s ? 'current' : ''}`}
                          onClick={() => handleStatusChange(selectedComanda.idComanda, s)}
                          disabled={selectedComanda.statusComanda === s}
                        >
                          {getStatusLabel(s)}
                        </button>
                      );
                    }
                  })}
                  <button
                    className="status-btn date"
                    style={{ background: '#e0e0ff', color: '#222', border: '1px solid #b3b3ff' }}
                    onClick={() => setShowDate(true)}
                  >
                    Schimbă data livrare
                  </button>
                </div>
                                {showDate && (
                                  <div className="problem-modal">
                                    <h4>Schimbă data de livrare</h4>
                                    <input
                                      type="date"
                                      value={newDate}
                                      onChange={e => setNewDate(e.target.value)}
                                      min={new Date().toISOString().split('T')[0]}
                                      style={{ width: '100%', marginBottom: 8 }}
                                    />
                                    <div style={{ display: 'flex', gap: 8 }}>
                                      <button
                                        className="btn-primary"
                                        disabled={!newDate || dateLoading}
                                        onClick={() => handleChangeDate(selectedComanda.idComanda, newDate)}
                                      >
                                        Confirmă
                                      </button>
                                      <button className="btn-secondary" onClick={() => setShowDate(false)} disabled={dateLoading}>
                                        Renunță
                                      </button>
                                    </div>
                                  </div>
                                )}
                {showProblem && (
                  <div className="problem-modal">
                    <h4>Descrie problema</h4>
                    <textarea
                      value={problemText}
                      onChange={e => setProblemText(e.target.value)}
                      placeholder="Descrie problema comenzii..."
                      rows={3}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        className="btn-primary"
                        disabled={!problemText.trim() || problemLoading}
                        onClick={() => handleStatusChange(selectedComanda.idComanda, 'problema', problemText)}
                      >
                        Trimite
                      </button>
                      <button className="btn-secondary" onClick={() => setShowProblem(false)} disabled={problemLoading}>
                        Renunță
                      </button>
                    </div>
                  </div>
                )}
                {showCancel && (
                  <div className="problem-modal">
                    <h4>Motiv anulare comandă</h4>
                    <textarea
                      value={cancelText}
                      onChange={e => setCancelText(e.target.value)}
                      placeholder="Motivul anulării..."
                      rows={3}
                      style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button
                        className="btn-danger"
                        disabled={!cancelText.trim() || cancelLoading}
                        onClick={() => handleStatusChange(selectedComanda.idComanda, 'anulata', cancelText)}
                      >
                        Confirmă anularea
                      </button>
                      <button className="btn-secondary" onClick={() => setShowCancel(false)} disabled={cancelLoading}>
                        Renunță
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
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
