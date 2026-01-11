import { useState, useEffect, useMemo } from 'react';
import AssignCourierDialog from './AssignCourierDialog';
import '../admin/AdminLayout.css';
import './ShipmentsQueuePage.css';

interface Adresa {
  idAdresa: number;
  oras: string;
  judet: string;
  strada: string;
  numar: string;
  codPostal: string;
}

interface Colet {
  idColet: number;
  codAwb: string;
  statusColet: string;
  tipServiciu: string;
  greutateKg: number;
  volumM3: number;
  ramburs: number;
  dataCreare: string;
  adresaExpeditor: Adresa | null;
  adresaDestinatar: Adresa | null;
  curier?: {
    idUtilizator: number;
    nume: string;
    prenume: string;
    telefon?: string;
  } | null;
}

interface Filters {
  status: string;
  oras: string;
  dataStart: string;
  dataEnd: string;
  tipServiciu: string;
  cautare: string;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Toate statusurile' },
  { value: 'in_asteptare', label: 'În așteptare' },
  { value: 'preluat', label: 'Preluat' },
  { value: 'in_tranzit', label: 'În tranzit' },
  { value: 'in_livrare', label: 'În livrare' },
  { value: 'livrat', label: 'Livrat' },
  { value: 'returnat', label: 'Returnat' },
  { value: 'anulat', label: 'Anulat' },
];

const SERVICIU_OPTIONS = [
  { value: '', label: 'Toate serviciile' },
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'same_day', label: 'Same Day' },
  { value: 'economy', label: 'Economy' },
];

const STATUS_COLORS: Record<string, string> = {
  'in_asteptare': '#f0ad4e',
  'preluat': '#5bc0de',
  'in_tranzit': '#337ab7',
  'in_livrare': '#9b59b6',
  'livrat': '#5cb85c',
  'returnat': '#d9534f',
  'anulat': '#777',
};

export default function ShipmentsQueuePage() {
  const [colete, setColete] = useState<Colet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColete, setSelectedColete] = useState<number[]>([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [coletForAssign, setColetForAssign] = useState<Colet | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'dataCreare',
    direction: 'desc'
  });

  const [filters, setFilters] = useState<Filters>({
    status: '',
    oras: '',
    dataStart: '',
    dataEnd: '',
    tipServiciu: '',
    cautare: ''
  });

  const [orase, setOrase] = useState<string[]>([]);

  // Funcție pentru printare AWB cu QR Code
  const printAWB = (colet: Colet) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const trackingUrl = `https://beak.ro/tracking/${colet.codAwb}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(trackingUrl)}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AWB ${colet.codAwb}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
          .awb-label { border: 3px solid #000; padding: 15px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
          .header-left { text-align: left; }
          .logo { font-size: 24px; font-weight: bold; }
          .awb-code { font-size: 22px; font-weight: bold; font-family: monospace; letter-spacing: 2px; margin-top: 5px; }
          .qr-code { width: 100px; height: 100px; }
          .section { margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #999; }
          .section-title { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #666; margin-bottom: 5px; }
          .section-content { font-size: 14px; }
          .row { display: flex; justify-content: space-between; gap: 10px; }
          .col { flex: 1; }
          .weight { font-size: 18px; font-weight: bold; text-align: center; padding: 8px; background: #f0f0f0; margin-top: 10px; border-radius: 4px; }
          .scan-info { text-align: center; font-size: 10px; color: #666; margin-top: 10px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="awb-label">
          <div class="header">
            <div class="header-left">
              <div class="logo">🐦 BEAK</div>
              <div class="awb-code">${colet.codAwb}</div>
            </div>
            <img src="${qrCodeUrl}" class="qr-code" alt="QR Code" />
          </div>
          <div class="section">
            <div class="section-title">📤 Expeditor</div>
            <div class="section-content">
              ${colet.adresaExpeditor?.strada || ''} ${colet.adresaExpeditor?.numar || ''}<br>
              ${colet.adresaExpeditor?.oras || ''}
            </div>
          </div>
          <div class="section">
            <div class="section-title">📥 Destinatar</div>
            <div class="section-content">
              ${colet.adresaDestinatar?.strada || ''} ${colet.adresaDestinatar?.numar || ''}<br>
              ${colet.adresaDestinatar?.oras || ''}
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="section-title">Greutate</div>
              <div class="weight">${colet.greutateKg} kg</div>
            </div>
            <div class="col">
              <div class="section-title">Serviciu</div>
              <div class="weight">${colet.tipServiciu?.toUpperCase() || 'STANDARD'}</div>
            </div>
          </div>
          ${colet.ramburs > 0 ? `
          <div class="weight" style="background: #ffeb3b; margin-top: 10px;">
            💰 RAMBURS: ${colet.ramburs} RON
          </div>
          ` : ''}
          <div class="scan-info">Scanează codul QR pentru tracking în timp real</div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); window.onafterprint = function() { window.close(); } }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  useEffect(() => {
    fetchColete();
  }, []);

  const fetchColete = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/operator/colete');
      if (res.ok) {
        const data = await res.json();
        setColete(data);
        
        // Extrage orașele unice pentru filtru
        const uniqueOrase = [...new Set(data.flatMap((c: Colet) => [
          c.adresaExpeditor?.oras,
          c.adresaDestinatar?.oras
        ].filter(Boolean)))] as string[];
        setOrase(uniqueOrase.sort());
      }
    } catch (error) {
      console.error('Eroare la încărcare colete:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrare și sortare colete
  const filteredAndSortedColete = useMemo(() => {
    let result = [...colete];

    // Aplicare filtre
    if (filters.status) {
      result = result.filter(c => c.statusColet === filters.status);
    }
    if (filters.oras) {
      result = result.filter(c => 
        c.adresaExpeditor?.oras === filters.oras || 
        c.adresaDestinatar?.oras === filters.oras
      );
    }
    if (filters.dataStart) {
      result = result.filter(c => new Date(c.dataCreare) >= new Date(filters.dataStart));
    }
    if (filters.dataEnd) {
      result = result.filter(c => new Date(c.dataCreare) <= new Date(filters.dataEnd));
    }
    if (filters.tipServiciu) {
      result = result.filter(c => c.tipServiciu === filters.tipServiciu);
    }
    if (filters.cautare) {
      const search = filters.cautare.toLowerCase();
      result = result.filter(c => 
        c.codAwb.toLowerCase().includes(search) ||
        c.adresaExpeditor?.oras?.toLowerCase().includes(search) ||
        c.adresaDestinatar?.oras?.toLowerCase().includes(search)
      );
    }

    // Sortare
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';

      switch (sortConfig.key) {
        case 'dataCreare':
          aVal = new Date(a.dataCreare).getTime();
          bVal = new Date(b.dataCreare).getTime();
          break;
        case 'codAwb':
          aVal = a.codAwb;
          bVal = b.codAwb;
          break;
        case 'oras':
          aVal = a.adresaDestinatar?.oras || '';
          bVal = b.adresaDestinatar?.oras || '';
          break;
        case 'status':
          aVal = a.statusColet;
          bVal = b.statusColet;
          break;
        case 'greutate':
          aVal = a.greutateKg;
          bVal = b.greutateKg;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [colete, filters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      oras: '',
      dataStart: '',
      dataEnd: '',
      tipServiciu: '',
      cautare: ''
    });
  };

  const handleSelectColet = (id: number) => {
    setSelectedColete(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedColete.length === filteredAndSortedColete.length) {
      setSelectedColete([]);
    } else {
      setSelectedColete(filteredAndSortedColete.map(c => c.idColet));
    }
  };

  const handleAssignSingle = (colet: Colet) => {
    setColetForAssign(colet);
    setShowAssignDialog(true);
  };

  const handleAssignSelected = () => {
    if (selectedColete.length === 0) return;
    setColetForAssign(null); // null = asignare multiplă
    setShowAssignDialog(true);
  };

  const handleAssignComplete = async (curierId: number) => {
    const coleteToAssign = coletForAssign 
      ? [coletForAssign.idColet]
      : selectedColete;

    try {
      const response = await fetch('http://localhost:8081/api/operator/colete/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coletIds: coleteToAssign,
          curierId: curierId
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Actualizează local în loc de fetch complet pentru a păstra poziția
        setColete(prev => prev.map(colet => {
          if (coleteToAssign.includes(colet.idColet)) {
            return {
              ...colet,
              statusColet: 'preluat',
              curier: result.curier
            };
          }
          return colet;
        }));
        setSelectedColete([]);
        setShowAssignDialog(false);
        setColetForAssign(null);
      } else {
        alert('Eroare la asignare!');
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la asignare!');
    }
  };

  const handleStatusChange = async (coletId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8081/api/operator/colete/${coletId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchColete();
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  if (loading) {
    return (
      <div className="shipments-queue-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Se încarcă coletele...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shipments-queue-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>📦 Coadă Colete</h1>
          <span className="badge badge-info">{filteredAndSortedColete.length} colete</span>
        </div>
        <div className="header-actions">
          {selectedColete.length > 0 && (
            <>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  selectedColete.forEach(id => {
                    const colet = colete.find(c => c.idColet === id);
                    if (colet) printAWB(colet);
                  });
                }}
                title="Printează AWB-urile selectate"
              >
                🖨️ Printează ({selectedColete.length})
              </button>
              <select
                className="bulk-status-select"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    selectedColete.forEach(id => handleStatusChange(id, e.target.value));
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Schimbă status...</option>
                {STATUS_OPTIONS.filter(s => s.value).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </>
          )}
          <button 
            className="btn btn-primary"
            onClick={handleAssignSelected}
            disabled={selectedColete.length === 0}
          >
            🚚 Asignează Curier ({selectedColete.length})
          </button>
          <button className="btn btn-secondary" onClick={fetchColete}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>🔍 Filtre</h3>
          {activeFiltersCount > 0 && (
            <button className="btn btn-link" onClick={clearFilters}>
              Șterge filtrele ({activeFiltersCount})
            </button>
          )}
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label>Căutare AWB</label>
            <input
              type="text"
              placeholder="Caută după AWB..."
              value={filters.cautare}
              onChange={e => handleFilterChange('cautare', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Oraș</label>
            <select
              value={filters.oras}
              onChange={e => handleFilterChange('oras', e.target.value)}
            >
              <option value="">Toate orașele</option>
              {orase.map(oras => (
                <option key={oras} value={oras}>{oras}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Tip Serviciu</label>
            <select
              value={filters.tipServiciu}
              onChange={e => handleFilterChange('tipServiciu', e.target.value)}
            >
              {SERVICIU_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Data de la</label>
            <input
              type="date"
              value={filters.dataStart}
              onChange={e => handleFilterChange('dataStart', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Data până la</label>
            <input
              type="date"
              value={filters.dataEnd}
              onChange={e => handleFilterChange('dataEnd', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="stats-quick">
        {STATUS_OPTIONS.filter(s => s.value).map(status => {
          const count = colete.filter(c => c.statusColet === status.value).length;
          return (
            <div 
              key={status.value}
              className={`stat-chip ${filters.status === status.value ? 'active' : ''}`}
              style={{ borderColor: STATUS_COLORS[status.value] }}
              onClick={() => handleFilterChange('status', filters.status === status.value ? '' : status.value)}
            >
              <span 
                className="stat-dot" 
                style={{ backgroundColor: STATUS_COLORS[status.value] }}
              ></span>
              <span className="stat-label">{status.label}</span>
              <span className="stat-count">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="th-checkbox">
                <input
                  type="checkbox"
                  checked={selectedColete.length === filteredAndSortedColete.length && filteredAndSortedColete.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="sortable" onClick={() => handleSort('codAwb')}>
                AWB {sortConfig.key === 'codAwb' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="sortable" onClick={() => handleSort('status')}>
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Tip Serviciu</th>
              <th className="sortable" onClick={() => handleSort('oras')}>
                Destinație {sortConfig.key === 'oras' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="sortable" onClick={() => handleSort('greutate')}>
                Greutate {sortConfig.key === 'greutate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Ramburs</th>
              <th className="sortable" onClick={() => handleSort('dataCreare')}>
                Data {sortConfig.key === 'dataCreare' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Curier</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedColete.length === 0 ? (
              <tr>
                <td colSpan={9} className="no-data">
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>Nu există colete care să corespundă filtrelor</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedColete.map(colet => (
                <tr 
                  key={colet.idColet} 
                  className={selectedColete.includes(colet.idColet) ? 'selected' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedColete.includes(colet.idColet)}
                      onChange={() => handleSelectColet(colet.idColet)}
                    />
                  </td>
                  <td className="awb-cell">
                    <code style={{ background: 'rgba(148, 163, 184, 0.2)', padding: '4px 8px', borderRadius: '4px', color: '#94A3B8', fontSize: '12px' }}>{colet.codAwb}</code>
                  </td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: STATUS_COLORS[colet.statusColet] || '#777' }}
                    >
                      {STATUS_OPTIONS.find(s => s.value === colet.statusColet)?.label || colet.statusColet}
                    </span>
                  </td>
                  <td>
                    <span className={`serviciu-badge ${colet.tipServiciu}`}>
                      {colet.tipServiciu}
                    </span>
                  </td>
                  <td className="adresa-cell">
                    <div className="adresa-destinatar">
                      <strong>{colet.adresaDestinatar?.oras || '-'}</strong>
                      <small>
                        {colet.adresaDestinatar?.strada} {colet.adresaDestinatar?.numar}
                      </small>
                    </div>
                  </td>
                  <td>{colet.greutateKg} kg</td>
                  <td className="ramburs-cell">
                    {colet.ramburs > 0 ? (
                      <span className="ramburs-badge">{colet.ramburs} RON</span>
                    ) : '-'}
                  </td>
                  <td className="date-cell">{formatDate(colet.dataCreare)}</td>
                  <td>
                    {colet.curier ? (
                      <span className="curier-assigned">
                        🚚 {colet.curier.prenume} {colet.curier.nume}
                      </span>
                    ) : (
                      <span className="curier-none">Neasignat</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="table-footer">
        <div className="selection-info">
          {selectedColete.length > 0 && (
            <span>{selectedColete.length} colete selectate</span>
          )}
        </div>
        <div className="total-info">
          Afișate {filteredAndSortedColete.length} din {colete.length} colete
        </div>
      </div>

      {/* Assign Courier Dialog */}
      {showAssignDialog && (
        <AssignCourierDialog
          colet={coletForAssign}
          selectedCount={coletForAssign ? 1 : selectedColete.length}
          onAssign={handleAssignComplete}
          onClose={() => {
            setShowAssignDialog(false);
            setColetForAssign(null);
          }}
        />
      )}
    </div>
  );
}
