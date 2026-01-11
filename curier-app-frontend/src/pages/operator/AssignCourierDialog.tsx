import { useState, useEffect } from 'react';
import './AssignCourierDialog.css';

interface Ruta {
  origine: string;
  destinatie: string;
}

interface Curier {
  id: number;
  idUtilizator?: number;
  username: string;
  nume: string;
  prenume: string;
  telefon: string;
  email: string;
  rute?: Ruta[];
  areRutaCompatibila?: boolean;
  coleteAsignate?: number;
  status?: 'disponibil' | 'ocupat' | 'offline';
}

interface Colet {
  idColet: number;
  codAwb: string;
  adresaExpeditor?: {
    oras: string;
    judet: string;
  } | null;
  adresaDestinatar?: {
    oras: string;
    judet: string;
  } | null;
}

interface AssignCourierDialogProps {
  colet: Colet | null;
  selectedCount: number;
  onAssign: (curierId: number) => void;
  onClose: () => void;
}

export default function AssignCourierDialog({ 
  colet, 
  selectedCount, 
  onAssign, 
  onClose 
}: AssignCourierDialogProps) {
  const [curieri, setCurieri] = useState<Curier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurier, setSelectedCurier] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyCompatible, setShowOnlyCompatible] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const destinatieOras = colet?.adresaDestinatar?.oras || '';
  const destinatieJudet = colet?.adresaDestinatar?.judet || '';

  useEffect(() => {
    fetchCurieri();
  }, [colet]);

  const fetchCurieri = async () => {
    try {
      // Construim URL cu parametri de destinație
      let url = 'http://localhost:8081/api/operator/curieri';
      if (destinatieOras) {
        url += `?orasDestinatie=${encodeURIComponent(destinatieOras)}`;
        if (destinatieJudet) {
          url += `&judetDestinatie=${encodeURIComponent(destinatieJudet)}`;
        }
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const curieriWithStats = data.map((c: Curier) => ({
          ...c,
          id: c.id || c.idUtilizator,
          coleteAsignate: Math.floor(Math.random() * 15),
          status: c.areRutaCompatibila ? 'disponibil' : 'ocupat'
        }));
        
        // Sortăm: curieri cu rută compatibilă primii
        curieriWithStats.sort((a: Curier, b: Curier) => {
          if (a.areRutaCompatibila && !b.areRutaCompatibila) return -1;
          if (!a.areRutaCompatibila && b.areRutaCompatibila) return 1;
          return 0;
        });
        
        setCurieri(curieriWithStats);
      }
    } catch (error) {
      console.error('Eroare la încărcare curieri:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCurieri = curieri.filter(c => {
    const matchSearch = searchTerm === '' || 
      c.nume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prenume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrare după compatibilitate rută
    const matchCompatibil = !showOnlyCompatible || c.areRutaCompatibila !== false;

    return matchSearch && matchCompatibil;
  });

  const curieriCompatibili = curieri.filter(c => c.areRutaCompatibila).length;
  const curieriTotal = curieri.length;

  const handleAssign = async () => {
    if (!selectedCurier) return;
    
    setAssigning(true);
    try {
      await onAssign(selectedCurier);
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (curier: Curier) => {
    if (curier.areRutaCompatibila) return '#28a745'; // verde - are rută
    return '#ffc107'; // galben - nu are rută
  };

  const getStatusLabel = (curier: Curier) => {
    if (curier.areRutaCompatibila) return 'Are rută';
    return 'Fără rută directă';
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="dialog-header">
          <div className="dialog-title">
            <span className="dialog-icon">🚚</span>
            <div>
              <h2>Asignare Curier</h2>
              <p className="dialog-subtitle">
                {colet 
                  ? <>Colet: <code>{colet.codAwb}</code></>
                  : <>{selectedCount} colete selectate</>
                }
              </p>
            </div>
          </div>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>

        {/* Info box pentru colet */}
        {colet && colet.adresaDestinatar && (
          <div className="colet-info-box">
            <div className="info-item">
              <span className="info-label">📍 Destinație</span>
              <span className="info-value">
                {colet.adresaDestinatar.oras}, {colet.adresaDestinatar.judet}
              </span>
            </div>
            <div className="info-item" style={{ marginTop: '0.5rem' }}>
              <span className="info-label">✅ Curieri disponibili</span>
              <span className="info-value">
                {curieriCompatibili} din {curieriTotal} au rută către {colet.adresaDestinatar.oras}
              </span>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="dialog-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Caută curier după nume..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          {destinatieOras && (
            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={showOnlyCompatible}
                onChange={e => setShowOnlyCompatible(e.target.checked)}
              />
              <span>Afișează doar curierii cu rută către {destinatieOras}</span>
            </label>
          )}
        </div>

        {/* Curieri List */}
        <div className="curieri-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Se încarcă curierii...</p>
            </div>
          ) : filteredCurieri.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>Nu s-au găsit curieri {showOnlyCompatible && destinatieOras ? `cu rută către ${destinatieOras}` : ''}</p>
              {showOnlyCompatible && destinatieOras && (
                <button 
                  className="btn btn-link" 
                  onClick={() => setShowOnlyCompatible(false)}
                >
                  Afișează toți curierii
                </button>
              )}
            </div>
          ) : (
            filteredCurieri.map(curier => (
              <div 
                key={curier.id}
                className={`curier-card ${selectedCurier === curier.id ? 'selected' : ''} ${curier.status === 'offline' ? 'offline' : ''}`}
                onClick={() => curier.status !== 'offline' && setSelectedCurier(curier.id)}
              >
                <div className="curier-avatar" style={{
                  background: curier.areRutaCompatibila 
                    ? 'linear-gradient(135deg, #10B981, #059669)' 
                    : 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                }}>
                  {curier.nume?.charAt(0)}{curier.prenume?.charAt(0)}
                </div>
                
                <div className="curier-info">
                  <div className="curier-name">
                    {curier.nume} {curier.prenume}
                    {curier.areRutaCompatibila && (
                      <span className="ruta-badge">✓ Are rută</span>
                    )}
                  </div>
                  <div className="curier-details">
                    <span className="detail-item">
                      📞 {curier.telefon || 'N/A'}
                    </span>
                  </div>
                  {curier.rute && curier.rute.length > 0 && (
                    <div className="curier-rute">
                      {curier.rute.slice(0, 3).map((ruta, idx) => (
                        <span key={idx} className="ruta-tag">
                          {ruta.origine} → {ruta.destinatie}
                        </span>
                      ))}
                      {curier.rute.length > 3 && (
                        <span className="ruta-tag more">+{curier.rute.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="curier-stats">
                  <div className="stat-badge">
                    <span className="stat-value">{curier.coleteAsignate || 0}</span>
                    <span className="stat-label">colete</span>
                  </div>
                </div>

                <div className="curier-select-indicator">
                  {selectedCurier === curier.id && (
                    <span className="check-icon">✓</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <button className="btn btn-cancel" onClick={onClose}>
            Anulează
          </button>
          <button 
            className="btn btn-assign"
            onClick={handleAssign}
            disabled={!selectedCurier || assigning}
          >
            {assigning ? (
              <>
                <span className="btn-spinner"></span>
                Se asignează...
              </>
            ) : (
              <>
                🚚 Asignează {selectedCount > 1 ? `(${selectedCount} colete)` : 'Colet'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
