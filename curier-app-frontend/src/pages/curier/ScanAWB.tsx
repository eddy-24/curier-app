import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScanAWB.css';

interface ColetDetails {
  idColet: number;
  codAwb: string;
  status: string;
  greutate: number;
  tipServiciu: string;
  pretDeclarat: number;
  expeditor?: {
    oras: string;
    strada: string;
    numar: string;
    numeClient: string;
    telefon: string;
  };
  destinatar?: {
    oras: string;
    strada: string;
    numar: string;
    numeClient: string;
    telefon: string;
  };
  tracking?: Array<{
    status: string;
    locatie: string;
    descriere: string;
    dataEvent: string;
  }>;
}

const ScanAWB = () => {
  const navigate = useNavigate();
  const [awbInput, setAwbInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [colet, setColet] = useState<ColetDetails | null>(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!awbInput.trim()) {
      setError('Introdu codul AWB');
      return;
    }

    setLoading(true);
    setError('');
    setColet(null);

    try {
      const response = await fetch(`http://localhost:8081/api/curier/scan/${awbInput.trim()}`);
      if (response.ok) {
        const data = await response.json();
        setColet(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Colet negăsit');
      }
    } catch (err) {
      setError('Eroare la căutare. Verifică conexiunea.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      'in_asteptare': { label: 'În așteptare', class: 'waiting' },
      'ridicat': { label: 'Ridicat', class: 'picked' },
      'in_tranzit': { label: 'În tranzit', class: 'transit' },
      'in_livrare': { label: 'În livrare', class: 'delivering' },
      'livrat': { label: 'Livrat', class: 'delivered' },
      'respins': { label: 'Respins', class: 'rejected' },
      'returnat': { label: 'Returnat', class: 'returned' }
    };
    return statusMap[status] || { label: status, class: '' };
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="scan-page">
      <header className="page-header">
        <h1>
          <span>📷</span>
          Scanează AWB
        </h1>
      </header>

      <div className="scan-input-section">
        <div className="input-container">
          <input
            type="text"
            placeholder="Introdu codul AWB... (ex: AWBF253EFDC)"
            value={awbInput}
            onChange={(e) => setAwbInput(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            className="awb-input"
            autoFocus
          />
          <button 
            onClick={handleScan} 
            className="scan-btn"
            disabled={loading}
          >
            {loading ? '⏳' : '🔍'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>

      {colet && (
        <div className="colet-details">
          <div className="details-header">
            <div className="awb-display">
              <span className="label">AWB</span>
              <span className="value">{colet.codAwb}</span>
            </div>
            <span className={`status-badge ${getStatusInfo(colet.status).class}`}>
              {getStatusInfo(colet.status).label}
            </span>
          </div>

          <div className="details-section">
            <h3>📦 Detalii colet</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Greutate</span>
                <span className="value">{colet.greutate} kg</span>
              </div>
              <div className="info-item">
                <span className="label">Serviciu</span>
                <span className="value">{colet.tipServiciu}</span>
              </div>
              {colet.pretDeclarat > 0 && (
                <div className="info-item ramburs">
                  <span className="label">💰 Ramburs</span>
                  <span className="value">{colet.pretDeclarat.toFixed(2)} RON</span>
                </div>
              )}
            </div>
          </div>

          {colet.expeditor && (
            <div className="details-section">
              <h3>📤 Expeditor</h3>
              <p className="address">{colet.expeditor.oras}, {colet.expeditor.strada} {colet.expeditor.numar}</p>
              <p className="name">{colet.expeditor.numeClient}</p>
              <button className="call-btn" onClick={() => handleCall(colet.expeditor!.telefon)}>
                📞 {colet.expeditor.telefon}
              </button>
            </div>
          )}

          {colet.destinatar && (
            <div className="details-section">
              <h3>📥 Destinatar</h3>
              <p className="address">{colet.destinatar.oras}, {colet.destinatar.strada} {colet.destinatar.numar}</p>
              <p className="name">{colet.destinatar.numeClient}</p>
              <button className="call-btn" onClick={() => handleCall(colet.destinatar!.telefon)}>
                📞 {colet.destinatar.telefon}
              </button>
            </div>
          )}

          {colet.tracking && colet.tracking.length > 0 && (
            <div className="details-section tracking">
              <h3>📍 Istoric tracking</h3>
              <div className="tracking-list">
                {colet.tracking.map((event, index) => (
                  <div key={index} className="tracking-item">
                    <div className="tracking-dot"></div>
                    <div className="tracking-content">
                      <span className="tracking-status">{getStatusInfo(event.status).label}</span>
                      <span className="tracking-desc">{event.descriere}</span>
                      <span className="tracking-date">
                        {new Date(event.dataEvent).toLocaleString('ro-RO')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            {(colet.status === 'in_asteptare') && (
              <button 
                className="action-btn pickup"
                onClick={() => navigate(`/curier/colet/${colet.idColet}?action=pickup`)}
              >
                📦 Ridică colet
              </button>
            )}
            {(colet.status === 'in_tranzit' || colet.status === 'in_livrare') && (
              <button 
                className="action-btn deliver"
                onClick={() => navigate(`/curier/colet/${colet.idColet}?action=deliver`)}
              >
                ✅ Livrează colet
              </button>
            )}
            {colet.status !== 'livrat' && colet.status !== 'returnat' && (
              <button 
                className="action-btn update"
                onClick={() => navigate(`/curier/colet/${colet.idColet}`)}
              >
                ✏️ Actualizează status
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanAWB;
