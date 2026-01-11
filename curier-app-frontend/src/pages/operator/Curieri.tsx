import { useState, useEffect } from 'react';
import './Curieri.css';

interface Curier {
  id: number;
  username: string;
  nume: string;
  prenume: string;
  telefon: string;
  email: string;
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
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [curieriRes, coleteRes] = await Promise.all([
        fetch('http://localhost:8081/api/operator/curieri'),
        fetch('http://localhost:8081/api/operator/colete?status=inregistrat')
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
        alert('Colet asignat cu succes!');
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const openCurierDetails = (curier: Curier) => {
    setSelectedCurier(curier);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="curieri-page">
      <header className="page-header">
        <h1>Gestionare Curieri</h1>
        <p className="subtitle">{curieri.length} curieri disponibili</p>
      </header>

      <div className="page-layout">
        {/* Lista Curieri */}
        <section className="curieri-section">
          <h2>👷 Curieri</h2>
          <div className="curieri-grid">
            {curieri.map((curier) => (
              <div 
                key={curier.id} 
                className="curier-card"
                onClick={() => openCurierDetails(curier)}
              >
                <div className="curier-avatar">👷</div>
                <div className="curier-info">
                  <h3>{curier.prenume} {curier.nume}</h3>
                  <p className="curier-username">@{curier.username}</p>
                  <p className="curier-contact">📞 {curier.telefon || 'N/A'}</p>
                  <p className="curier-contact">✉️ {curier.email || 'N/A'}</p>
                </div>
                <div className="curier-actions">
                  <button className="btn-view">Vezi detalii</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Colete neasignate */}
        <section className="colete-section">
          <h2>📦 Colete de asignat ({coleteNeasignate.length})</h2>
          {coleteNeasignate.length === 0 ? (
            <div className="empty-state">
              <p>Nu există colete neasignate.</p>
            </div>
          ) : (
            <div className="colete-list">
              {coleteNeasignate.map((colet) => (
                <div key={colet.idColet} className="colet-item">
                  <div className="colet-info">
                    <span className="colet-awb">{colet.codAwb}</span>
                    <span className="colet-dest">→ {colet.adresaDestinatar?.oras || 'N/A'}</span>
                    <span className="colet-service">{colet.tipServiciu}</span>
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
                    <option value="">Asignează curier...</option>
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
      </div>

      {/* Modal Detalii Curier */}
      {showModal && selectedCurier && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Curier: {selectedCurier.prenume} {selectedCurier.nume}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="curier-profile">
                <div className="profile-avatar">👷</div>
                <div className="profile-info">
                  <p><strong>Username:</strong> @{selectedCurier.username}</p>
                  <p><strong>Telefon:</strong> {selectedCurier.telefon || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedCurier.email || 'N/A'}</p>
                </div>
              </div>

              <div className="assign-section">
                <h3>Asignează colet</h3>
                {coleteNeasignate.length === 0 ? (
                  <p className="no-colete">Nu există colete disponibile pentru asignare.</p>
                ) : (
                  <div className="colete-to-assign">
                    {coleteNeasignate.slice(0, 5).map((colet) => (
                      <div key={colet.idColet} className="assign-item">
                        <span>{colet.codAwb}</span>
                        <span className="dest">→ {colet.adresaDestinatar?.oras}</span>
                        <button 
                          className="btn-assign"
                          onClick={() => handleAsigneazaColet(colet.idColet, selectedCurier.id)}
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
