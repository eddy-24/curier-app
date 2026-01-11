import { useState, useEffect } from 'react';
import './Curieri.css';

interface Ruta {
  idRuta: number;
  orasOrigine: string;
  orasDestinatie: string;
  activa: boolean;
}

interface ColetAsignat {
  idColet: number;
  codAwb: string;
  tipServiciu: string;
  status: string;
  adresaDestinatar: {
    oras: string;
    adresa: string;
  };
}

interface Curier {
  id: number;
  username: string;
  nume: string;
  prenume: string;
  telefon: string;
  email: string;
  rute?: Ruta[];
  coleteAsignate?: ColetAsignat[];
  numarColeteAsignate?: number;
}

interface ColetNeasignat {
  idColet: number;
  codAwb: string;
  tipServiciu: string;
  adresaDestinatar: {
    oras: string;
  };
}

export default function Curieri() {
  const [curieri, setCurieri] = useState<Curier[]>([]);
  const [coleteNeasignate, setColeteNeasignate] = useState<ColetNeasignat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurier, setSelectedCurier] = useState<Curier | null>(null);
  const [curierDetails, setCurierDetails] = useState<{ rute: Ruta[]; colete: ColetAsignat[] } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [curieriRes, coleteRes] = await Promise.all([
        fetch('http://localhost:8081/api/operator/curieri'),
        fetch('http://localhost:8081/api/operator/colete/neasignate')
      ]);

      if (curieriRes.ok) {
        const data = await curieriRes.json();
        setCurieri(data);
      }

      if (coleteRes.ok) {
        const data = await coleteRes.json();
        setColeteNeasignate(data);
      }
    } catch (error) {
      console.error('Eroare:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAsigneazaColet = async (coletId: number, curierId: number) => {
    try {
      const res = await fetch(`http://localhost:8081/api/operator/colete/${coletId}/asigneaza-curier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curierId })
      });

      if (res.ok) {
        fetchData();
        // Dacă modalul este deschis și există selectedCurier, refă detaliile
        if (showModal && selectedCurier) {
          openCurierDetails(selectedCurier);
        }
        alert('Colet asignat cu succes!');
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const openCurierDetails = async (curier: Curier) => {
    setSelectedCurier(curier);
    setShowModal(true);
    setLoadingDetails(true);
    setCurierDetails(null);

    try {
      // Fetch rute și colete asignate în paralel
      const [ruteRes, coleteRes] = await Promise.all([
        fetch(`http://localhost:8081/api/operator/curieri/${curier.id}/rute`),
        fetch(`http://localhost:8081/api/operator/colete?curierId=${curier.id}`)
      ]);

      const rute = ruteRes.ok ? await ruteRes.json() : [];
      const colete = coleteRes.ok ? await coleteRes.json() : [];

      setCurierDetails({ rute, colete });
    } catch (error) {
      console.error('Eroare la încărcarea detaliilor:', error);
      setCurierDetails({ rute: [], colete: [] });
    } finally {
      setLoadingDetails(false);
    }
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="curieri-page">
      <header className="page-header">
        <div className="header-left">
          <h1>🚚 Curieri</h1>
          <span className="header-badge">{curieri.length} disponibili</span>
        </div>
      </header>

      {/* Curieri Cards */}
      <section className="curieri-section">
        <div className="curieri-grid">
          {curieri.map((curier) => (
            <div 
              key={curier.id} 
              className="curier-card"
              onClick={() => openCurierDetails(curier)}
            >
              <div className="curier-card-header">
                <div className="curier-avatar">
                  {curier.prenume?.charAt(0)}{curier.nume?.charAt(0)}
                </div>
                <div className="curier-name-info">
                  <h3>{curier.prenume} {curier.nume}</h3>
                  <span className="curier-username">@{curier.username}</span>
                </div>
              </div>
              <div className="curier-card-body">
                <div className="curier-detail">
                  <span className="detail-icon">📞</span>
                  <span>{curier.telefon || 'N/A'}</span>
                </div>
                <div className="curier-detail">
                  <span className="detail-icon">✉️</span>
                  <span>{curier.email || 'N/A'}</span>
                </div>
              </div>
              <button className="btn-view-details">
                Vezi detalii
                <span className="btn-arrow">→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Colete neasignate */}
      <section className="colete-neasignate-section">
        <div className="section-header">
          <h2>📦 Colete de asignat</h2>
          <span className="count-badge">{coleteNeasignate.length}</span>
        </div>
        
        {coleteNeasignate.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <p>Toate coletele sunt asignate!</p>
          </div>
        ) : (
          <div className="colete-neasignate-grid">
            {coleteNeasignate.map((colet) => (
              <div key={colet.idColet} className="colet-neasignat-card">
                <div className="colet-card-header">
                  <span className="colet-awb">{colet.codAwb}</span>
                  <span className={`service-badge ${colet.tipServiciu?.toLowerCase()}`}>
                    {colet.tipServiciu}
                  </span>
                </div>
                <div className="colet-destination">
                  <span className="dest-icon">📍</span>
                  <span className="dest-city">{colet.adresaDestinatar?.oras || 'N/A'}</span>
                </div>
                <select 
                  className="curier-select"
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAsigneazaColet(colet.idColet, parseInt(e.target.value));
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">Selectează curier...</option>
                  {curieri.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.prenume} {c.nume}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal Detalii Curier */}
      {showModal && selectedCurier && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👷 {selectedCurier.prenume} {selectedCurier.nume}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              {/* Info curier */}
              <div className="curier-profile-section">
                <div className="profile-card">
                  <div className="profile-avatar-large">
                    {selectedCurier.prenume?.charAt(0)}{selectedCurier.nume?.charAt(0)}
                  </div>
                  <div className="profile-details">
                    <p><span className="label">Username:</span> @{selectedCurier.username}</p>
                    <p><span className="label">Telefon:</span> {selectedCurier.telefon || 'N/A'}</p>
                    <p><span className="label">Email:</span> {selectedCurier.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {loadingDetails ? (
                <div className="loading-details">Se încarcă detaliile...</div>
              ) : curierDetails && (
                <div className="curier-details-grid">
                  {/* Rute */}
                  <div className="details-section">
                    <h3>🛣️ Rute disponibile ({curierDetails.rute.length})</h3>
                    {curierDetails.rute.length === 0 ? (
                      <p className="empty-message">Nu are rute definite</p>
                    ) : (
                      <div className="rute-list">
                        {curierDetails.rute.map((ruta) => (
                          <div key={ruta.idRuta} className="ruta-item">
                            <span className="ruta-origin">{ruta.orasOrigine}</span>
                            <span className="ruta-arrow">→</span>
                            <span className="ruta-dest">{ruta.orasDestinatie}</span>
                            {ruta.activa && <span className="ruta-status active">Activ</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Colete asignate */}
                  <div className="details-section">
                    <h3>📦 Colete asignate ({curierDetails.colete.length})</h3>
                    {curierDetails.colete.length === 0 ? (
                      <p className="empty-message">Nu are colete asignate</p>
                    ) : (
                      <div className="colete-asignate-list">
                        {curierDetails.colete.map((colet) => (
                          <div key={colet.idColet} className="colet-asignat-item">
                            <div className="colet-main">
                              <span className="colet-awb-badge">{colet.codAwb}</span>
                              <span className={`colet-status status-${colet.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                {colet.status}
                              </span>
                            </div>
                            <div className="colet-dest-info">
                              <span className="dest-city">📍 {colet.adresaDestinatar?.oras || 'N/A'}</span>
                              <span className="dest-address">{colet.adresaDestinatar?.adresa || ''}</span>
                            </div>
                            <span className="colet-service-tag">{colet.tipServiciu}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Secțiune asignare colet nou */}
              <div className="assign-section">
                <h3>➕ Asignează colet nou</h3>
                {coleteNeasignate.length === 0 ? (
                  <p className="no-colete">Nu există colete disponibile pentru asignare.</p>
                ) : (
                  <div className="colete-to-assign">
                    {coleteNeasignate.slice(0, 5).map((colet) => (
                      <div key={colet.idColet} className="assign-item">
                        <span className="assign-awb">{colet.codAwb}</span>
                        <span className="assign-dest">→ {colet.adresaDestinatar?.oras}</span>
                        <button 
                          className="btn-assign"
                          onClick={() => {
                            handleAsigneazaColet(colet.idColet, selectedCurier.id);
                            openCurierDetails(selectedCurier); // Refresh details
                          }}
                        >
                          Asignează
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
