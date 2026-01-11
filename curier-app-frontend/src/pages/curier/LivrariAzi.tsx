import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LivrariAzi.css';

interface Livrare {
  idColet: number;
  codAwb: string;
  status: string;
  greutate: number;
  tipServiciu: string;
  pretDeclarat: number;
  areRamburs: boolean;
  adresaLivrare: string;
  detaliiAdresa: string;
  numeDestinatar: string;
  telefonDestinatar: string;
}

const LivrariAzi = () => {
  const navigate = useNavigate();
  const [livrari, setLivrari] = useState<Livrare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchLivrari(parseInt(userId));
    }
  }, []);

  const fetchLivrari = async (curierId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/curier/${curierId}/livrari`);
      if (response.ok) {
        const data = await response.json();
        setLivrari(data);
      }
    } catch (error) {
      console.error('Error fetching livrari:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_tranzit':
        return <span className="status-badge transit">În tranzit</span>;
      case 'in_livrare':
        return <span className="status-badge delivering">În livrare</span>;
      default:
        return <span className="status-badge">{status}</span>;
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
      <div className="livrari-page loading">
        <div className="loader"></div>
        <p>Se încarcă livrările...</p>
      </div>
    );
  }

  return (
    <div className="livrari-page">
      <header className="page-header">
        <h1>🚚 Livrări azi</h1>
        <span className="count-badge">{livrari.length}</span>
      </header>

      {livrari.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>Nicio livrare</h3>
          <p>Nu ai colete de livrat astăzi</p>
        </div>
      ) : (
        <div className="livrari-list">
          {livrari.map((livrare) => (
            <div key={livrare.idColet} className="livrare-card">
              <div className="card-header">
                <div className="header-left">
                  <span className="awb-code">{livrare.codAwb}</span>
                  {livrare.areRamburs && (
                    <span className="ramburs-badge">💰 {livrare.pretDeclarat?.toFixed(2)} RON</span>
                  )}
                </div>
                {getStatusBadge(livrare.status)}
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="icon">📍</span>
                  <span className="text">{livrare.adresaLivrare}</span>
                </div>
                
                {livrare.detaliiAdresa && (
                  <div className="info-row details">
                    <span className="icon">📝</span>
                    <span className="text">{livrare.detaliiAdresa}</span>
                  </div>
                )}
                
                <div className="info-row">
                  <span className="icon">👤</span>
                  <span className="text">{livrare.numeDestinatar}</span>
                </div>
                
                <div className="info-row">
                  <span className="icon">⚖️</span>
                  <span className="text">{livrare.greutate} kg • {livrare.tipServiciu}</span>
                </div>
              </div>
              
              <div className="card-actions">
                <button 
                  className="action-btn call"
                  onClick={() => handleCall(livrare.telefonDestinatar)}
                >
                  📞 Sună
                </button>
                <button 
                  className="action-btn navigate"
                  onClick={() => handleNavigate(livrare.adresaLivrare)}
                >
                  🗺️ Navighează
                </button>
                <button 
                  className="action-btn deliver-action"
                  onClick={() => navigate(`/curier/colet/${livrare.idColet}?action=deliver`)}
                >
                  ✅ Livrează
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LivrariAzi;
