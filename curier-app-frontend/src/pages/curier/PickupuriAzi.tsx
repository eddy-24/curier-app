import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PickupuriAzi.css';

interface Pickup {
  idColet: number;
  codAwb: string;
  status: string;
  greutate: number;
  tipServiciu: string;
  adresaPickup: string;
  detaliiAdresa: string;
  numeExpeditor: string;
  telefonExpeditor: string;
  modalitatePlata?: string;
  sumaDePlata?: number;
}

const PickupuriAzi = () => {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchPickups(parseInt(userId));
    }
  }, []);

  const fetchPickups = async (curierId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/curier/${curierId}/pickups`);
      if (response.ok) {
        const data = await response.json();
        setPickups(data);
      }
    } catch (error) {
      console.error('Error fetching pickups:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_asteptare':
        return <span className="status-badge waiting">În așteptare</span>;
      case 'preluat_curier':
        return <span className="status-badge assigned">📋 Asignat</span>;
      case 'asteptare_plata':
        return <span className="status-badge payment">💰 Așteaptă plata</span>;
      case 'ridicat':
        return <span className="status-badge picked">Ridicat</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const handleIncasarePlata = async (coletId: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    if (!confirm('Confirmă că ai încasat plata de la expeditor?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/curier/${userId}/colet/${coletId}/incaseaza-plata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        alert('Plata a fost încasată! Acum poți prelua coletul.');
        // Reîncarcă lista
        fetchPickups(parseInt(userId));
      } else {
        alert('Eroare la încasarea plății');
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare de conexiune');
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (address: string) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="pickups-page loading">
        <div className="loader"></div>
        <p>Se încarcă pickup-urile...</p>
      </div>
    );
  }

  return (
    <div className="pickups-page">
      <header className="page-header">
        <h1>📦 Pickup-uri azi</h1>
        <span className="count-badge">{pickups.length}</span>
      </header>

      {pickups.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>Niciun pickup</h3>
          <p>Nu ai colete de ridicat astăzi</p>
        </div>
      ) : (
        <div className="pickups-list">
          {pickups.map((pickup) => (
            <div key={pickup.idColet} className="pickup-card">
              <div className="card-header">
                <span className="awb-code">{pickup.codAwb}</span>
                {getStatusBadge(pickup.status)}
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="icon">📍</span>
                  <span className="text">{pickup.adresaPickup}</span>
                </div>
                
                {pickup.detaliiAdresa && (
                  <div className="info-row details">
                    <span className="icon">📝</span>
                    <span className="text">{pickup.detaliiAdresa}</span>
                  </div>
                )}
                
                <div className="info-row">
                  <span className="icon">👤</span>
                  <span className="text">{pickup.numeExpeditor}</span>
                </div>
                
                <div className="info-row">
                  <span className="icon">⚖️</span>
                  <span className="text">{pickup.greutate} kg • {pickup.tipServiciu}</span>
                </div>

                {/* Afișăm suma de încasat dacă este plată cash */}
                {pickup.status === 'asteptare_plata' && pickup.sumaDePlata && (
                  <div className="info-row payment-info">
                    <span className="icon">💰</span>
                    <span className="text highlight">De încasat: {pickup.sumaDePlata.toFixed(2)} RON</span>
                  </div>
                )}
              </div>
              
              <div className="card-actions">
                <button 
                  className="action-btn call"
                  onClick={() => handleCall(pickup.telefonExpeditor)}
                >
                  📞 Sună
                </button>
                <button 
                  className="action-btn navigate"
                  onClick={() => handleNavigate(pickup.adresaPickup)}
                >
                  🗺️ Navighează
                </button>
                
                {/* Dacă coletul așteaptă plata, arată butonul de încasare */}
                {pickup.status === 'asteptare_plata' ? (
                  <button 
                    className="action-btn payment-action"
                    onClick={() => handleIncasarePlata(pickup.idColet)}
                  >
                    💰 Încasează {pickup.sumaDePlata?.toFixed(2)} RON
                  </button>
                ) : (
                  <button 
                    className="action-btn pickup-action"
                    onClick={() => navigate(`/curier/colet/${pickup.idColet}?action=pickup`)}
                  >
                    📦 Ridică
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupuriAzi;
