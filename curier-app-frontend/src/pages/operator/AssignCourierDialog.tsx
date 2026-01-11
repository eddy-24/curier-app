import { useState, useEffect } from 'react';
import './AssignCourierDialog.css';

interface Curier {
  idUtilizator: number;
  username: string;
  nume: string;
  prenume: string;
  telefon: string;
  email: string;
  coleteAsignate?: number;
  zonaCurent?: string;
  status?: 'disponibil' | 'ocupat' | 'offline';
}

interface Colet {
  idColet: number;
  codAwb: string;
  adresaDestinatar?: {
    oras: string;
    judet: string;
  } | null;
}

interface AssignCourierDialogProps {
  colet: Colet | null; // null pentru asignare multiplă
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
  const [filterZona, setFilterZona] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchCurieri();
  }, []);

  const fetchCurieri = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/operator/curieri');
      if (res.ok) {
        const data = await res.json();
        // Adăugăm date mock pentru demo
        const curieriWithStats = data.map((c: Curier, index: number) => ({
          ...c,
          coleteAsignate: Math.floor(Math.random() * 15),
          zonaCurent: ['București', 'Cluj', 'Timișoara', 'Iași', 'Brașov'][index % 5],
          status: ['disponibil', 'disponibil', 'ocupat', 'disponibil', 'offline'][index % 5] as Curier['status']
        }));
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
    
    const matchZona = filterZona === '' || c.zonaCurent === filterZona;
    const matchStatus = filterStatus === '' || c.status === filterStatus;

    return matchSearch && matchZona && matchStatus;
  });

  const zone = [...new Set(curieri.map(c => c.zonaCurent).filter(Boolean))];

  const handleAssign = async () => {
    if (!selectedCurier) return;
    
    setAssigning(true);
    try {
      await onAssign(selectedCurier);
    } finally {
      setAssigning(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'disponibil': return '#28a745';
      case 'ocupat': return '#ffc107';
      case 'offline': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    switch (status) {
      case 'disponibil': return 'Disponibil';
      case 'ocupat': return 'Ocupat';
      case 'offline': return 'Offline';
      default: return 'Necunoscut';
    }
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

          <div className="filter-selects">
            <select 
              value={filterZona}
              onChange={e => setFilterZona(e.target.value)}
            >
              <option value="">Toate zonele</option>
              {zone.map(z => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">Toate statusurile</option>
              <option value="disponibil">Disponibil</option>
              <option value="ocupat">Ocupat</option>
              <option value="offline">Offline</option>
            </select>
          </div>
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
              <p>Nu s-au găsit curieri</p>
            </div>
          ) : (
            filteredCurieri.map(curier => (
              <div 
                key={curier.idUtilizator}
                className={`curier-card ${selectedCurier === curier.idUtilizator ? 'selected' : ''} ${curier.status === 'offline' ? 'offline' : ''}`}
                onClick={() => curier.status !== 'offline' && setSelectedCurier(curier.idUtilizator)}
              >
                <div className="curier-avatar">
                  {curier.nume?.charAt(0)}{curier.prenume?.charAt(0)}
                </div>
                
                <div className="curier-info">
                  <div className="curier-name">
                    {curier.nume} {curier.prenume}
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(curier.status) }}
                      title={getStatusLabel(curier.status)}
                    ></span>
                  </div>
                  <div className="curier-details">
                    <span className="detail-item">
                      📞 {curier.telefon || 'N/A'}
                    </span>
                    <span className="detail-item">
                      📍 {curier.zonaCurent || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="curier-stats">
                  <div className="stat-badge">
                    <span className="stat-value">{curier.coleteAsignate || 0}</span>
                    <span className="stat-label">colete</span>
                  </div>
                </div>

                <div className="curier-select-indicator">
                  {selectedCurier === curier.idUtilizator && (
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
