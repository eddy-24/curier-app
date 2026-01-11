import { useState, useEffect } from 'react';
import './AdminLayout.css';

interface KPIData {
  // Comenzi
  totalComenzi: number;
  comenziFinalizate: number;
  comenziAnulate: number;
  rataSucces: number;
  
  // Colete
  totalColete: number;
  coleteLivrate: number;
  coleteReturnat: number;
  coleteEsuat: number;
  
  // Timp
  timpMediuLivrare: number; // ore
  livrareLaTimp: number; // %
  
  // Financiar
  venituriLuna: number;
  venituriAnPrecedent: number;
  crestere: number; // %
  
  // Curieri
  curieriActivi: number;
  coletePeCurier: number;
}

interface RaportLunar {
  luna: string;
  comenzi: number;
  venituri: number;
  coleteLivrate: number;
}

const MONTHS = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function RapoarteKPI() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [raportLunar, setRaportLunar] = useState<RaportLunar[]>([]);
  const [loading, setLoading] = useState(true);
  const [perioadaSelectata, setPerioadaSelectata] = useState('luna');
  const [anSelectat, setAnSelectat] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchKPIData();
  }, [perioadaSelectata, anSelectat]);

  const fetchKPIData = async () => {
    setLoading(true);
    try {
      const [kpiRes, raportRes] = await Promise.all([
        fetch(`http://localhost:8081/api/admin/rapoarte/kpi?perioada=${perioadaSelectata}`),
        fetch(`http://localhost:8081/api/admin/rapoarte/lunar?an=${anSelectat}`)
      ]);

      if (kpiRes.ok) {
        const data = await kpiRes.json();
        setKpiData({
          totalComenzi: data.totalComenzi || 0,
          comenziFinalizate: data.comenziFinalizate || 0,
          comenziAnulate: data.comenziAnulate || 0,
          rataSucces: data.rataSucces || 0,
          totalColete: data.totalColete || 0,
          coleteLivrate: data.coleteLivrate || 0,
          coleteReturnat: data.coleteReturnat || 0,
          coleteEsuat: data.coleteEsuat || 0,
          timpMediuLivrare: data.timpMediuLivrare || 0,
          livrareLaTimp: data.livrareLaTimp || 0,
          venituriLuna: data.venituriLuna || 0,
          venituriAnPrecedent: data.venituriAnPrecedent || 0,
          crestere: data.crestere || 0,
          curieriActivi: data.curieriActivi || 0,
          coletePeCurier: data.coletePeCurier || 0
        });
      } else {
        // Afișăm zerouri dacă nu sunt date
        setKpiData({
          totalComenzi: 0,
          comenziFinalizate: 0,
          comenziAnulate: 0,
          rataSucces: 0,
          totalColete: 0,
          coleteLivrate: 0,
          coleteReturnat: 0,
          coleteEsuat: 0,
          timpMediuLivrare: 0,
          livrareLaTimp: 0,
          venituriLuna: 0,
          venituriAnPrecedent: 0,
          crestere: 0,
          curieriActivi: 0,
          coletePeCurier: 0
        });
      }

      if (raportRes.ok) {
        const data = await raportRes.json();
        setRaportLunar(data.map((r: { luna: string; comenzi: number; venituri: number; coleteLivrate: number }) => ({
          luna: r.luna,
          comenzi: r.comenzi || 0,
          venituri: Number(r.venituri) || 0,
          coleteLivrate: r.coleteLivrate || 0
        })));
      } else {
        // Date goale pentru fiecare lună
        setRaportLunar(MONTHS.map((luna) => ({
          luna,
          comenzi: 0,
          venituri: 0,
          coleteLivrate: 0
        })));
      }
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
      // Setăm date goale în caz de eroare
      setKpiData({
        totalComenzi: 0,
        comenziFinalizate: 0,
        comenziAnulate: 0,
        rataSucces: 0,
        totalColete: 0,
        coleteLivrate: 0,
        coleteReturnat: 0,
        coleteEsuat: 0,
        timpMediuLivrare: 0,
        livrareLaTimp: 0,
        venituriLuna: 0,
        venituriAnPrecedent: 0,
        crestere: 0,
        curieriActivi: 0,
        coletePeCurier: 0
      });
      setRaportLunar(MONTHS.map((luna) => ({
        luna,
        comenzi: 0,
        venituri: 0,
        coleteLivrate: 0
      })));
    } finally {
      setLoading(false);
    }
  };

  const exportRaport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`http://localhost:8081/api/admin/rapoarte/export?perioada=${perioadaSelectata}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `raport_kpi_${perioadaSelectata}.${format === 'csv' ? 'csv' : 'pdf'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Eroare la exportul raportului');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Eroare la exportul raportului');
    }
  };

  if (loading) {
    return <div className="loading">Se încarcă rapoartele...</div>;
  }

  return (
    <div className="rapoarte-kpi-page">
      <div className="page-header">
        <div>
          <h1>Rapoarte KPI</h1>
          <p>Analizează performanța sistemului de livrări</p>
        </div>
        <div className="header-actions">
          <select 
            className="filter-select"
            value={perioadaSelectata}
            onChange={e => setPerioadaSelectata(e.target.value)}
          >
            <option value="saptamana">Ultima săptămână</option>
            <option value="luna">Ultima lună</option>
            <option value="trimestru">Ultimul trimestru</option>
            <option value="an">Ultimul an</option>
          </select>
          <button className="btn-secondary" onClick={() => exportRaport('csv')}>
            📊 Export CSV
          </button>
          <button className="btn-primary" onClick={() => exportRaport('pdf')}>
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* KPI Cards - Comenzi */}
      <h2 style={{ marginBottom: '16px', color: '#1e293b' }}>📦 Comenzi & Colete</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.totalComenzi || 0}</span>
            <span className="stat-label">Total comenzi</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.comenziFinalizate || 0}</span>
            <span className="stat-label">Finalizate</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">❌</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.comenziAnulate || 0}</span>
            <span className="stat-label">Anulate</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📈</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.rataSucces?.toFixed(1) || 0}%</span>
            <span className="stat-label">Rată succes</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - Livrare */}
      <h2 style={{ marginBottom: '16px', color: '#1e293b', marginTop: '32px' }}>🚚 Performanță Livrare</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📦</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.totalColete || 0}</span>
            <span className="stat-label">Total colete</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.coleteLivrate || 0}</span>
            <span className="stat-label">Livrate cu succes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏱️</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.timpMediuLivrare || 0}h</span>
            <span className="stat-label">Timp mediu livrare</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">⏰</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.livrareLaTimp?.toFixed(1) || 0}%</span>
            <span className="stat-label">Livrare la timp</span>
          </div>
        </div>
      </div>

      {/* KPI Cards - Financiar */}
      <h2 style={{ marginBottom: '16px', color: '#1e293b', marginTop: '32px' }}>💰 Performanță Financiară</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">💵</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.venituriLuna?.toFixed(2) || '0.00'} RON</span>
            <span className="stat-label">Venituri luna curentă</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">📊</div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: (kpiData?.crestere || 0) >= 0 ? '#22c55e' : '#ef4444' }}>
              {(kpiData?.crestere || 0) >= 0 ? '↑' : '↓'} {Math.abs(kpiData?.crestere || 0).toFixed(1)}%
            </span>
            <span className="stat-label">Creștere vs. an trecut</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🚴</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.curieriActivi || 0}</span>
            <span className="stat-label">Curieri activi</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📦</div>
          <div className="stat-info">
            <span className="stat-value">{kpiData?.coletePeCurier || 0}</span>
            <span className="stat-label">Colete/curier (medie)</span>
          </div>
        </div>
      </div>

      {/* Grafic lunar */}
      <div className="data-table-container" style={{ marginTop: '32px' }}>
        <div className="table-header">
          <h2>📈 Evoluție lunară {anSelectat}</h2>
          <div className="table-filters">
            <select 
              className="filter-select"
              value={anSelectat}
              onChange={e => setAnSelectat(parseInt(e.target.value))}
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>
        </div>

        {/* Barchart simplificat */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', marginBottom: '16px' }}>
            {raportLunar.map((raport, index) => {
              const maxVenituri = Math.max(...raportLunar.map(r => r.venituri));
              const height = (raport.venituri / maxVenituri) * 180;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    style={{ 
                      width: '100%', 
                      height: `${height}px`, 
                      background: 'linear-gradient(180deg, #3b82f6, #2563eb)',
                      borderRadius: '6px 6px 0 0',
                      minHeight: '20px'
                    }}
                    title={`${raport.luna}: ${raport.venituri.toFixed(0)} RON`}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {raportLunar.map((raport, index) => (
              <div key={index} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
                {raport.luna}
              </div>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Luna</th>
              <th>Comenzi</th>
              <th>Colete livrate</th>
              <th>Venituri</th>
              <th>Medie/comandă</th>
            </tr>
          </thead>
          <tbody>
            {raportLunar.map((raport, index) => (
              <tr key={index}>
                <td><strong>{raport.luna}</strong></td>
                <td>{raport.comenzi}</td>
                <td>{raport.coleteLivrate}</td>
                <td>{raport.venituri.toFixed(2)} RON</td>
                <td>{(raport.venituri / raport.comenzi).toFixed(2)} RON</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: 'rgba(15, 23, 42, 0.5)', fontWeight: 600 }}>
              <td>TOTAL</td>
              <td>{raportLunar.reduce((sum, r) => sum + r.comenzi, 0)}</td>
              <td>{raportLunar.reduce((sum, r) => sum + r.coleteLivrate, 0)}</td>
              <td>{raportLunar.reduce((sum, r) => sum + r.venituri, 0).toFixed(2)} RON</td>
              <td>-</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Status colete */}
      <div className="data-table-container" style={{ marginTop: '32px' }}>
        <div className="table-header">
          <h2>📊 Distribuție status colete</h2>
        </div>
        <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#4ADE80' }}>
              {((kpiData?.coleteLivrate || 0) / (kpiData?.totalColete || 1) * 100).toFixed(1)}%
            </div>
            <div style={{ color: '#4ADE80', marginTop: '8px' }}>Livrate</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(249, 115, 22, 0.15)', borderRadius: '12px', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#FB923C' }}>
              {((kpiData?.coleteReturnat || 0) / (kpiData?.totalColete || 1) * 100).toFixed(1)}%
            </div>
            <div style={{ color: '#FB923C', marginTop: '8px' }}>Returnate</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#F87171' }}>
              {((kpiData?.coleteEsuat || 0) / (kpiData?.totalColete || 1) * 100).toFixed(1)}%
            </div>
            <div style={{ color: '#F87171', marginTop: '8px' }}>Eșuate</div>
          </div>
          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#60A5FA' }}>
              {(100 - ((kpiData?.coleteLivrate || 0) + (kpiData?.coleteReturnat || 0) + (kpiData?.coleteEsuat || 0)) / (kpiData?.totalColete || 1) * 100).toFixed(1)}%
            </div>
            <div style={{ color: '#60A5FA', marginTop: '8px' }}>În curs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
