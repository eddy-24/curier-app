import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './ColetUpdate.css';

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
}

const ColetUpdate = () => {
  const { coletId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const action = searchParams.get('action'); // 'pickup' or 'deliver'
  
  const [colet, setColet] = useState<ColetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [selectedStatus, setSelectedStatus] = useState('');
  const [locatie, setLocatie] = useState('');
  const [nota, setNota] = useState('');
  const [rambursIncasat, setRambursIncasat] = useState(false);
  const [motivRespingere, setMotivRespingere] = useState('');
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    fetchColet();
  }, [coletId]);

  useEffect(() => {
    // Set default status based on action
    if (action === 'pickup') {
      setSelectedStatus('ridicat');
    } else if (action === 'deliver') {
      setSelectedStatus('livrat');
    }
  }, [action]);

  const fetchColet = async () => {
    try {
      // Search for colet by ID via scan endpoint workaround
      const response = await fetch(`http://localhost:8081/api/curier/scan/AWB-SEARCH-${coletId}`);
      if (!response.ok) {
        // Try direct colet fetch if scan fails
        setLoading(false);
        return;
      }
      const data = await response.json();
      setColet(data);
    } catch (error) {
      console.error('Error fetching colet:', error);
    } finally {
      setLoading(false);
    }
  };

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    initCanvas();
    setHasSignature(false);
  };

  const getSignatureData = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return null;
    return canvas.toDataURL('image/png');
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !coletId) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:8081/api/curier/colet/${coletId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curierId: parseInt(userId),
          status: selectedStatus,
          locatie: locatie,
          semnatura: getSignatureData(),
          rambursIncasat: rambursIncasat,
          motivRespingere: motivRespingere,
          nota: nota
        })
      });
      
      if (response.ok) {
        // Show success and navigate back
        navigate(-1);
      } else {
        alert('Eroare la actualizare');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Eroare la actualizare');
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = action === 'pickup' 
    ? [
        { value: 'ridicat', label: '📦 Ridicat', desc: 'Coletul a fost preluat de la expeditor' }
      ]
    : action === 'deliver'
    ? [
        { value: 'livrat', label: '✅ Livrat', desc: 'Coletul a fost livrat cu succes' },
        { value: 'respins', label: '❌ Respins', desc: 'Destinatarul a refuzat coletul' }
      ]
    : [
        { value: 'ridicat', label: '📦 Ridicat', desc: 'Coletul a fost preluat' },
        { value: 'in_tranzit', label: '🚛 În tranzit', desc: 'Coletul este în drum' },
        { value: 'in_livrare', label: '🚚 În livrare', desc: 'Coletul este în curs de livrare' },
        { value: 'livrat', label: '✅ Livrat', desc: 'Coletul a fost livrat' },
        { value: 'respins', label: '❌ Respins', desc: 'Destinatarul a refuzat' },
        { value: 'returnat', label: '↩️ Returnat', desc: 'Coletul se returnează' }
      ];

  if (loading) {
    return (
      <div className="colet-update loading">
        <div className="loader"></div>
        <p>Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="colet-update">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>
          {action === 'pickup' ? '📦 Ridică colet' : 
           action === 'deliver' ? '✅ Livrează colet' : 
           '✏️ Actualizare status'}
        </h1>
      </header>

      {colet && (
        <div className="colet-summary">
          <span className="awb">{colet.codAwb}</span>
          <span className="info">{colet.greutate} kg • {colet.tipServiciu}</span>
        </div>
      )}

      <div className="update-form">
        <div className="form-section">
          <h3>Status nou</h3>
          <div className="status-options">
            {statusOptions.map(opt => (
              <label 
                key={opt.value} 
                className={`status-option ${selectedStatus === opt.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt.value}
                  checked={selectedStatus === opt.value}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                />
                <span className="option-label">{opt.label}</span>
                <span className="option-desc">{opt.desc}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label className="input-label">📍 Locație</label>
          <input
            type="text"
            value={locatie}
            onChange={(e) => setLocatie(e.target.value)}
            placeholder="Ex: București, Sector 1"
            className="text-input"
          />
        </div>

        {selectedStatus === 'respins' && (
          <div className="form-section">
            <label className="input-label">❌ Motiv respingere</label>
            <select 
              value={motivRespingere} 
              onChange={(e) => setMotivRespingere(e.target.value)}
              className="select-input"
            >
              <option value="">Selectează motivul</option>
              <option value="destinatar_absent">Destinatar absent</option>
              <option value="adresa_gresita">Adresă greșită</option>
              <option value="refuz_plata">Refuz plată ramburs</option>
              <option value="colet_deteriorat">Colet deteriorat</option>
              <option value="alte_motive">Alte motive</option>
            </select>
          </div>
        )}

        {selectedStatus === 'livrat' && colet?.pretDeclarat && colet.pretDeclarat > 0 && (
          <div className="form-section ramburs-section">
            <div className="ramburs-header">
              <h3>💰 Ramburs</h3>
              <span className="ramburs-amount">{colet.pretDeclarat.toFixed(2)} RON</span>
            </div>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rambursIncasat}
                onChange={(e) => setRambursIncasat(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span>Ramburs încasat</span>
            </label>
          </div>
        )}

        {selectedStatus === 'livrat' && (
          <div className="form-section">
            <h3>✍️ Semnătură destinatar</h3>
            <div className="signature-container">
              <canvas
                ref={canvasRef}
                width={300}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <button className="clear-btn" onClick={clearSignature}>
                🗑️ Șterge
              </button>
            </div>
            <p className="signature-hint">Semnează cu degetul sau mouse-ul</p>
          </div>
        )}

        <div className="form-section">
          <label className="input-label">📝 Notă (opțional)</label>
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Adaugă o notă..."
            className="textarea-input"
            rows={3}
          />
        </div>

        <button 
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting || !selectedStatus}
        >
          {submitting ? 'Se salvează...' : 'Confirmă actualizare'}
        </button>
      </div>
    </div>
  );
};

export default ColetUpdate;
