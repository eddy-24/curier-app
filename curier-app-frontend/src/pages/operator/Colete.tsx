import { useState, useEffect } from 'react';
import './Colete.css';

interface Colet {
  idColet: number;
  codAwb: string;
  statusColet: string;
  tipServiciu: string;
  greutateKg: number;
  volumM3: number;
  ramburs: number;
  adresaExpeditor: {
    oras: string;
    strada: string;
    numar: string;
  };
  adresaDestinatar: {
    oras: string;
    strada: string;
    numar: string;
  };
  comanda: {
    idComanda: number;
    statusComanda: string;
  };
}

interface Curier {
  id: number;
  username: string;
  nume: string;
  prenume: string;
  telefon: string;
}

export default function Colete() {
  const [colete, setColete] = useState<Colet[]>([]);
  const [curieri, setCurieri] = useState<Curier[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('toate');
  const [selectedColet, setSelectedColet] = useState<Colet | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAsignareModal, setShowAsignareModal] = useState(false);

  useEffect(() => {
    fetchColete();
    fetchCurieri();
  }, [filter]);

  const fetchColete = async () => {
    try {
      const url = filter === 'toate'
        ? 'http://localhost:8081/api/operator/colete'
        : `http://localhost:8081/api/operator/colete?status=${filter}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setColete(data);
      }
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurieri = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/operator/curieri');
      if (res.ok) {
        const data = await res.json();
        setCurieri(data);
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const handleStatusChange = async (coletId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8081/api/operator/colete/${coletId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusColet: newStatus })
      });

      if (res.ok) {
        fetchColete();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const handleAsignareCurier = async (curierId: number) => {
    if (!selectedColet) return;

    try {
      const res = await fetch(`http://localhost:8081/api/operator/colete/${selectedColet.idColet}/asigneaza-curier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curierId })
      });

      if (res.ok) {
        fetchColete();
        setShowAsignareModal(false);
        setShowModal(false);
        alert('Curier asignat cu succes!');
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const handleRaportIncident = async (tip: string) => {
    if (!selectedColet) return;

    const descriere = prompt(`Descriere ${tip}:`);
    if (!descriere) return;

    try {
      const res = await fetch(`http://localhost:8081/api/operator/colete/${selectedColet.idColet}/incident`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tip, descriere })
      });

      if (res.ok) {
        fetchColete();
        setShowModal(false);
        alert('Incident raportat cu succes!');
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inregistrat': return 'status-new';
      case 'preluat_curier': return 'status-pickup';
      case 'in_tranzit': return 'status-transit';
      case 'in_livrare': return 'status-delivery';
      case 'livrat': return 'status-delivered';
      case 'returnat': return 'status-returned';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'inregistrat': return 'Înregistrat';
      case 'preluat_curier': return 'Preluat curier';
      case 'in_tranzit': return 'În tranzit';
      case 'in_livrare': return 'În livrare';
      case 'livrat': return 'Livrat';
      case 'returnat': return 'Returnat';
      default: return status;
    }
  };

  const openDetails = (colet: Colet) => {
    setSelectedColet(colet);
    setShowModal(true);
  };

  const openAsignare = () => {
    setShowAsignareModal(true);
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="colete-page">
      <header className="page-header">
        <h1>Gestionare Colete</h1>
        <p className="subtitle">Total: {colete.length} colete</p>
      </header>

      {/* Filters */}
      <div className="filters">
        {['toate', 'inregistrat', 'preluat_curier', 'in_tranzit', 'in_livrare', 'livrat', 'returnat'].map((s) => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'toate' ? 'Toate' : getStatusLabel(s)}
          </button>
        ))}
      </div>

      {/* Colete Grid */}
      {colete.length === 0 ? (
        <div className="empty-state">
          <p>Nu există colete {filter !== 'toate' ? `cu statusul "${getStatusLabel(filter)}"` : ''}.</p>
        </div>
      ) : (
        <div className="colete-grid">
          {colete.map((colet) => (
            <div key={colet.idColet} className="colet-card" onClick={() => openDetails(colet)}>
              <div className="colet-header">
                <span className="colet-awb">{colet.codAwb}</span>
                <span className={`status-badge ${getStatusColor(colet.statusColet)}`}>
                  {getStatusLabel(colet.statusColet)}
                </span>
              </div>

              <div className="colet-route">
                <div className="route-point">
                  <span className="route-icon">📤</span>
                  <span>{colet.adresaExpeditor?.oras || 'N/A'}</span>
                </div>
                <span className="route-arrow">→</span>
                <div className="route-point">
                  <span className="route-icon">📥</span>
                  <span>{colet.adresaDestinatar?.oras || 'N/A'}</span>
                </div>
              </div>

              <div className="colet-info">
                <span className="info-item">📦 {colet.greutateKg} kg</span>
                <span className="info-item">🚚 {colet.tipServiciu}</span>
                {colet.ramburs > 0 && (
                  <span className="info-item ramburs">💰 {colet.ramburs} RON</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detalii Colet */}
      {showModal && selectedColet && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Colet: {selectedColet.codAwb}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <div className="detail-section">
                  <h3>📤 Expeditor</h3>
                  <p>
                    {selectedColet.adresaExpeditor?.strada} {selectedColet.adresaExpeditor?.numar}<br />
                    {selectedColet.adresaExpeditor?.oras}
                  </p>
                </div>
                <div className="detail-section">
                  <h3>📥 Destinatar</h3>
                  <p>
                    {selectedColet.adresaDestinatar?.strada} {selectedColet.adresaDestinatar?.numar}<br />
                    {selectedColet.adresaDestinatar?.oras}
                  </p>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <label>Greutate</label>
                  <p>{selectedColet.greutateKg} kg</p>
                </div>
                <div className="detail-item">
                  <label>Volum</label>
                  <p>{selectedColet.volumM3} m³</p>
                </div>
                <div className="detail-item">
                  <label>Serviciu</label>
                  <p>{selectedColet.tipServiciu}</p>
                </div>
                <div className="detail-item">
                  <label>Ramburs</label>
                  <p>{selectedColet.ramburs || 0} RON</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Schimbă status</h3>
                <div className="status-buttons">
                  {['inregistrat', 'preluat_curier', 'in_tranzit', 'in_livrare', 'livrat', 'returnat'].map((s) => (
                    <button
                      key={s}
                      className={`status-btn ${selectedColet.statusColet === s ? 'current' : ''}`}
                      onClick={() => handleStatusChange(selectedColet.idColet, s)}
                      disabled={selectedColet.statusColet === s}
                    >
                      {getStatusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="action-section">
                <button className="btn-action primary" onClick={openAsignare}>
                  👷 Asignează curier
                </button>
                <a href={`/operator/colete/${selectedColet.idColet}/awb`} className="btn-action">
                  📄 Generează AWB
                </a>
                <button className="btn-action warning" onClick={() => handleRaportIncident('incident')}>
                  ⚠️ Raportează incident
                </button>
                <button className="btn-action danger" onClick={() => handleRaportIncident('reclamatie')}>
                  🚨 Reclamație
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Asignare Curier */}
      {showAsignareModal && (
        <div className="modal-overlay" onClick={() => setShowAsignareModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Asignează curier</h2>
              <button className="modal-close" onClick={() => setShowAsignareModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <p className="modal-subtitle">Selectează un curier pentru coletul {selectedColet?.codAwb}</p>

              <div className="curieri-list">
                {curieri.map((curier) => (
                  <div
                    key={curier.id}
                    className="curier-item"
                    onClick={() => handleAsignareCurier(curier.id)}
                  >
                    <div className="curier-avatar">👷</div>
                    <div className="curier-info">
                      <span className="curier-name">{curier.prenume} {curier.nume}</span>
                      <span className="curier-contact">{curier.telefon}</span>
                    </div>
                    <button className="btn-select">Selectează</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
