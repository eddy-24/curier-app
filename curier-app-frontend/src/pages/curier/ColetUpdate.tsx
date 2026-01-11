import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import './ColetUpdate.css';

interface PickupInfo {
  idColet: number;
  codAwb: string;
  status: string;
  greutate: number;
  tipServiciu: string;
  adresaPickup: string;
  numeExpeditor: string;
  telefonExpeditor: string;
  modalitatePlata?: string;
  sumaDePlata?: number;
  statusPlata?: string;
}

const ColetUpdate = () => {
  const { coletId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const action = searchParams.get('action'); // 'pickup' or 'deliver'
  
  const [pickup, setPickup] = useState<PickupInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  // Pentru livrare
  const [rambursIncasat, setRambursIncasat] = useState(false);
  const [motivRespingere, setMotivRespingere] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchPickupInfo();
  }, [coletId]);

  useEffect(() => {
    if (action === 'deliver') {
      setSelectedStatus('livrat');
      initCanvas();
    }
  }, [action]);

  const fetchPickupInfo = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      // Fetch pickup info from pickups endpoint
      const response = await fetch(`http://localhost:8081/api/curier/${userId}/pickups`);
      if (response.ok) {
        const pickups = await response.json();
        const found = pickups.find((p: PickupInfo) => p.idColet === parseInt(coletId || '0'));
        if (found) {
          setPickup(found);
        }
      }
    } catch (error) {
      console.error('Error fetching pickup:', error);
    } finally {
      setLoading(false);
    }
  };

  // === PICKUP SIMPLU ===
  const handleConfirmPickup = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !coletId) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:8081/api/curier/colet/${coletId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curierId: parseInt(userId),
          status: 'in_tranzit',
          locatie: pickup?.adresaPickup || '',
          nota: 'Colet ridicat de la expeditor și în drum spre destinație'
        })
      });
      
      if (response.ok) {
        alert('✅ Colet ridicat cu succes!');
        navigate('/curier/pickups');
      } else {
        alert('Eroare la ridicare colet');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Eroare de conexiune');
    } finally {
      setSubmitting(false);
    }
  };

  // === LIVRARE ===
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

  const stopDrawing = () => setIsDrawing(false);
  const clearSignature = () => { initCanvas(); setHasSignature(false); };

  const handleConfirmDelivery = async () => {
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
          rambursIncasat,
          motivRespingere,
          semnatura: hasSignature ? canvasRef.current?.toDataURL('image/png') : null
        })
      });
      
      if (response.ok) {
        alert(selectedStatus === 'livrat' ? '✅ Colet livrat cu succes!' : '↩️ Colet marcat pentru retur');
        navigate('/curier/livrari');
      } else {
        alert('Eroare la actualizare');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Eroare de conexiune');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="colet-update loading">
        <div className="loader"></div>
        <p>Se încarcă...</p>
      </div>
    );
  }

  // === PAGINA DE PICKUP (SIMPLĂ) ===
  if (action === 'pickup') {
    return (
      <div className="colet-update">
        <header className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>←</button>
          <h1>📦 Confirmare Ridicare</h1>
        </header>

        {pickup && (
          <>
            <div className="pickup-card-large">
              <div className="awb-large">{pickup.codAwb}</div>
              
              <div className="pickup-details">
                <div className="detail-row">
                  <span className="icon">📍</span>
                  <span className="text">{pickup.adresaPickup}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">👤</span>
                  <span className="text">{pickup.numeExpeditor}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">📞</span>
                  <span className="text">{pickup.telefonExpeditor}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">⚖️</span>
                  <span className="text">{pickup.greutate} kg • {pickup.tipServiciu}</span>
                </div>
              </div>

              {/* Dacă e plată cash, arată suma */}
              {pickup.modalitatePlata === 'cash' && pickup.sumaDePlata && (
                <div className="payment-box">
                  <div className="payment-label">💰 Sumă de încasat de la expeditor:</div>
                  <div className="payment-amount">{pickup.sumaDePlata.toFixed(2)} RON</div>
                  <div className="payment-status">
                    {pickup.statusPlata === 'achitat' 
                      ? <span className="paid">✅ Plată încasată</span>
                      : <span className="unpaid">⚠️ Plată neîncasată</span>
                    }
                  </div>
                </div>
              )}
            </div>

            <div className="confirm-section">
              <p className="confirm-text">
                Confirmă că ai ridicat coletul de la expeditor
                {pickup.modalitatePlata === 'cash' && pickup.statusPlata !== 'achitat' && (
                  <strong> și ai încasat suma de {pickup.sumaDePlata?.toFixed(2)} RON</strong>
                )}
              </p>
              
              <button 
                className="confirm-btn pickup"
                onClick={handleConfirmPickup}
                disabled={submitting}
              >
                {submitting ? 'Se procesează...' : '✅ Confirm ridicarea coletului'}
              </button>
            </div>
          </>
        )}

        {!pickup && (
          <div className="empty-state">
            <p>Coletul nu a fost găsit în lista de pickup-uri</p>
            <button onClick={() => navigate(-1)}>← Înapoi</button>
          </div>
        )}
      </div>
    );
  }

  // === PAGINA DE LIVRARE ===
  return (
    <div className="colet-update">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h1>🚚 Confirmare Livrare</h1>
      </header>

      <div className="delivery-form">
        <div className="form-section">
          <h3>Status livrare</h3>
          <div className="status-options">
            <label className={`status-option ${selectedStatus === 'livrat' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="status"
                value="livrat"
                checked={selectedStatus === 'livrat'}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
              <span className="option-label">✅ Livrat</span>
              <span className="option-desc">Coletul a fost livrat cu succes</span>
            </label>
            <label className={`status-option problem ${selectedStatus === 'respins' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="status"
                value="respins"
                checked={selectedStatus === 'respins'}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
              <span className="option-label">❌ Respins</span>
              <span className="option-desc">Destinatarul a refuzat</span>
            </label>
          </div>
        </div>

        {selectedStatus === 'respins' && (
          <div className="form-section">
            <h3>Motiv respingere</h3>
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

        {selectedStatus === 'livrat' && (
          <div className="form-section ramburs-check">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rambursIncasat}
                onChange={(e) => setRambursIncasat(e.target.checked)}
              />
              <span>💰 Ramburs încasat</span>
            </label>
          </div>
        )}

        <button 
          className="confirm-btn delivery"
          onClick={handleConfirmDelivery}
          disabled={submitting || !selectedStatus}
        >
          {submitting ? 'Se procesează...' : 'Confirmă'}
        </button>
      </div>
    </div>
  );
};

export default ColetUpdate;
