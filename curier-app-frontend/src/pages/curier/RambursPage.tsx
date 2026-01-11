import { useEffect, useState } from 'react';
import './RambursPage.css';

interface RambursItem {
  idColet: number;
  codAwb: string;
  suma: number;
  status: string;
  destinatar?: string;
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
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      fetchRamburs(user.idUtilizator);
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
              <div key={item.idColet} className="ramburs-item pending">
                <div className="item-header">
                  <span className="awb">{item.codAwb}</span>
                  <span className="suma">{item.suma?.toFixed(2)} RON</span>
                </div>
                {item.destinatar && (
                  <p className="destinatar">📍 {item.destinatar}</p>
                )}
                <span className="status-badge">{item.status.replace('_', ' ')}</span>
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
              <div key={item.idColet} className="ramburs-item collected">
                <div className="item-header">
                  <span className="awb">{item.codAwb}</span>
                  <span className="suma">{item.suma?.toFixed(2)} RON</span>
                </div>
                <span className="collected-badge">✅ Încasat</span>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default RambursPage;
