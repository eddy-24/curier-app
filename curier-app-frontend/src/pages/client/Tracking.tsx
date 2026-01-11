import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Tracking.css';

interface TrackingEvent {
  idEvent: number;
  status: string;
  locatie: string;
  descriere: string;
  dataEvent: string;
}

interface Colet {
  idColet: number;
  codAwb: string;
  statusColet: string;
  tipServiciu: string;
  greutateKg: number;
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
}

export default function Tracking() {
  const { codAwb } = useParams<{ codAwb?: string }>();
  const [awb, setAwb] = useState(codAwb || '');
  const [colet, setColet] = useState<Colet | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (codAwb) {
      searchAwb(codAwb);
    }
  }, [codAwb]);

  const searchAwb = async (awbCode: string) => {
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`http://localhost:8081/api/client/tracking/${awbCode}`);
      
      if (res.ok) {
        const data = await res.json();
        setColet(data.colet);
        setEvents(data.events || []);
      } else if (res.status === 404) {
        setError('Coletul nu a fost găsit');
        setColet(null);
        setEvents([]);
      } else {
        setError('Eroare la căutare');
      }
    } catch (err) {
      console.error('Eroare:', err);
      setError('Eroare de conexiune');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!awb.trim()) return;
    searchAwb(awb.trim());
  };

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase().includes('livrat')) return '✅';
    if (status.toLowerCase().includes('tranzit')) return '🚚';
    if (status.toLowerCase().includes('preluat')) return '📦';
    if (status.toLowerCase().includes('plasată') || status.toLowerCase().includes('inregistrat')) return '📝';
    return '📍';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="tracking-page">
      <header className="page-header">
        <h1>Tracking expediere</h1>
      </header>

      {/* Search Form */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            placeholder="Introdu codul AWB..."
            className="search-input"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Se caută...' : 'Caută'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/* Results */}
      {colet && (
        <div className="tracking-results">
          {/* Colet Info */}
          <div className="colet-info">
            <div className="info-header">
              <h2>AWB: {colet.codAwb}</h2>
              <span className={`status-badge status-${colet.statusColet.replace('_', '-')}`}>
                {colet.statusColet.replace('_', ' ')}
              </span>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Serviciu</span>
                <span className="info-value">{colet.tipServiciu}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Greutate</span>
                <span className="info-value">{colet.greutateKg} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">De la</span>
                <span className="info-value">
                  {colet.adresaExpeditor?.oras}, {colet.adresaExpeditor?.strada} {colet.adresaExpeditor?.numar}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Către</span>
                <span className="info-value">
                  {colet.adresaDestinatar?.oras}, {colet.adresaDestinatar?.strada} {colet.adresaDestinatar?.numar}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-section">
            <h3>Istoric expediere</h3>
            
            {events.length === 0 ? (
              <p className="no-events">Nu există evenimente încă.</p>
            ) : (
              <div className="timeline">
                {events.map((event, index) => (
                  <div 
                    key={event.idEvent} 
                    className={`timeline-item ${index === events.length - 1 ? 'latest' : ''}`}
                  >
                    <div className="timeline-marker">
                      <span className="marker-icon">{getStatusIcon(event.status)}</span>
                      {index < events.length - 1 && <div className="marker-line"></div>}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-status">{event.status}</span>
                        <span className="timeline-date">{formatDate(event.dataEvent)}</span>
                      </div>
                      <p className="timeline-location">📍 {event.locatie}</p>
                      {event.descriere && (
                        <p className="timeline-description">{event.descriere}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No results */}
      {searched && !loading && !colet && !error && (
        <div className="no-results">
          <p>Nu s-au găsit rezultate pentru "{awb}"</p>
        </div>
      )}
    </div>
  );
}
