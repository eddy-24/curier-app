import { useEffect, useState } from 'react';
import './RambursPage.css';

interface RambursItem {
  idColet: number;
  codAwb: string;
  suma: number;
  status: string;
  destinatar?: string;
  expeditor?: string;
  tip?: string; // 'ramburs' sau 'plata_pickup'
}

interface RambursData {
  neincasate: RambursItem[];
  incasate: RambursItem[];
  totalNeincasat: number;
  totalIncasat: number;
}

const RambursPage = () => {
  const [data, setData] = useState<RambursData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'neincasate' | 'incasate'>('neincasate');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchRamburs(parseInt(userId));
    }
  }, []);

  const fetchRamburs = async (curierId: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/curier/${curierId}/ramburs`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching ramburs:', error);
    } finally {
      setLoading(false);
    }
  };

  const incaseazaRamburs = async (coletId: number, suma: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Nu sunteți autentificat!');
      return;
    }

    if (!confirm(`Confirmați încasarea rambursului de ${suma.toFixed(2)} RON?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/curier/${userId}/ramburs/${coletId}/incaseaza`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        await response.json();
        alert(`Ramburs de ${suma.toFixed(2)} RON încasat cu succes!`);
        // Reîncarcă datele
        fetchRamburs(parseInt(userId));
      } else {
        throw new Error('Eroare la încasarea rambursului');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Eroare la încasarea rambursului!');
    }
  };

  if (loading) {
    return (
      <div className="ramburs-page loading">
        <div className="loader"></div>
        <p>Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="ramburs-page">
      <header className="page-header">
        <h1>💰 Ramburs</h1>
      </header>

      <div className="totals-section">
        <div className="total-card pending">
          <span className="total-label">De încasat</span>
          <span className="total-value">{data?.totalNeincasat?.toFixed(2) || '0.00'} RON</span>
          <span className="total-count">{data?.neincasate?.length || 0} colete</span>
        </div>
        <div className="total-card collected">
          <span className="total-label">Încasat</span>
          <span className="total-value">{data?.totalIncasat?.toFixed(2) || '0.00'} RON</span>
          <span className="total-count">{data?.incasate?.length || 0} colete</span>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'neincasate' ? 'active' : ''}`}
          onClick={() => setActiveTab('neincasate')}
        >
          De încasat ({data?.neincasate?.length || 0})
        </button>
        <button 
          className={`tab ${activeTab === 'incasate' ? 'active' : ''}`}
          onClick={() => setActiveTab('incasate')}
        >
          Încasate ({data?.incasate?.length || 0})
        </button>
      </div>

      <div className="ramburs-list">
        {activeTab === 'neincasate' ? (
          data?.neincasate?.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✅</span>
              <h3>Totul încasat!</h3>
              <p>Nu ai rambursuri de încasat</p>
            </div>
          ) : (
            data?.neincasate?.map(item => (
              <div key={`${item.idColet}-${item.tip}`} className={`ramburs-item pending ${item.tip}`}>
                <div className="item-header">
                  <span className="awb">{item.codAwb}</span>
                  <div className="item-actions">
                    <span className="suma">{item.suma?.toFixed(2)} RON</span>
                    {item.tip === 'ramburs' && (
                      <button 
                        className="collect-button"
                        onClick={() => incaseazaRamburs(item.idColet, item.suma)}
                      >
                        Încasează
                      </button>
                    )}
                  </div>
                </div>
                {item.destinatar && (
                  <p className="destinatar">📍 {item.destinatar}</p>
                )}
                {item.expeditor && (
                  <p className="destinatar">📦 {item.expeditor}</p>
                )}
                <div className="item-badges">
                  <span className={`type-badge ${item.tip}`}>
                    {item.tip === 'plata_pickup' ? '💳 Plată pickup' : '💰 Ramburs'}
                  </span>
                  <span className="status-badge">{item.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))
          )
        ) : (
          data?.incasate?.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <h3>Niciun ramburs încasat</h3>
              <p>Nu ai încasat rambursuri astăzi</p>
            </div>
          ) : (
            data?.incasate?.map(item => (
              <div key={`${item.idColet}-${item.tip}`} className={`ramburs-item collected ${item.tip}`}>
                <div className="item-header">
                  <span className="awb">{item.codAwb}</span>
                  <span className="suma">{item.suma?.toFixed(2)} RON</span>
                </div>
                <div className="item-badges">
                  <span className={`type-badge ${item.tip}`}>
                    {item.tip === 'plata_pickup' ? '💳 Plată pickup' : '💰 Ramburs'}
                  </span>
                  <span className="collected-badge">✅ Încasat</span>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default RambursPage;
