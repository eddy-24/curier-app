import { useState, useEffect } from 'react';
import './CRUDPage.css';

interface Vehicul {
  idVehicul?: number;
  numarInmatriculare: string;
  marca: string;
  model: string;
  tipVehicul: string;
  capacitateKg: number;
  capacitateVolumM3: number;
  statusVehicul: string;
}

const TIPURI_VEHICUL = [
  { value: 'scuter', label: 'Scuter 🛵', color: '#3498db' },
  { value: 'duba', label: 'Dubă 🚐', color: '#27ae60' },
  { value: 'camion', label: 'Camion 🚛', color: '#e67e22' },
];

const STATUSURI = [
  { value: 'activ', label: 'Activ', color: '#27ae60' },
  { value: 'mentenanta', label: 'Mentenanță', color: '#f39c12' },
  { value: 'inactiv', label: 'Inactiv', color: '#95a5a6' },
];

const INITIAL_VEHICUL: Vehicul = {
  numarInmatriculare: '',
  marca: '',
  model: '',
  tipVehicul: 'duba',
  capacitateKg: 0,
  capacitateVolumM3: 0,
  statusVehicul: 'activ'
};

export default function VehiculeCRUDPage() {
  const [vehicule, setVehicule] = useState<Vehicul[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Vehicul>(INITIAL_VEHICUL);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTip, setFilterTip] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchVehicule();
  }, []);

  const fetchVehicule = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/admin/vehicule');
      if (response.ok) {
        const data = await response.json();
        setVehicule(data);
      }
    } catch (error) {
      console.error('Eroare la încărcare vehicule:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicule = vehicule.filter(v => {
    const matchSearch = searchTerm === '' || 
      v.numarInmatriculare?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTip = filterTip === '' || v.tipVehicul === filterTip;
    const matchStatus = filterStatus === '' || v.statusVehicul === filterStatus;
    
    return matchSearch && matchTip && matchStatus;
  });

  const handleAdd = () => {
    setEditMode(false);
    setFormData(INITIAL_VEHICUL);
    setShowModal(true);
  };

  const handleEdit = (vehicul: Vehicul) => {
    setEditMode(true);
    setFormData(vehicul);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editMode && formData.idVehicul
        ? `http://localhost:8081/api/admin/vehicule/${formData.idVehicul}`
        : 'http://localhost:8081/api/admin/vehicule';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchVehicule();
        setShowModal(false);
        setFormData(INITIAL_VEHICUL);
      }
    } catch (error) {
      console.error('Eroare la salvare:', error);
      alert('Eroare la salvare vehicul');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sigur doriți să ștergeți acest vehicul?')) return;

    try {
      const response = await fetch(`http://localhost:8081/api/admin/vehicule/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchVehicule();
      }
    } catch (error) {
      console.error('Eroare la ștergere:', error);
    }
  };

  const getTipIcon = (tip: string) => {
    const found = TIPURI_VEHICUL.find(t => t.value === tip);
    return found ? found.label : tip;
  };

  const getStatusBadge = (status: string) => {
    const found = STATUSURI.find(s => s.value === status);
    return (
      <span className="status-badge" style={{ backgroundColor: found?.color || '#95a5a6', color: '#fff' }}>
        {found?.label || status}
      </span>
    );
  };

  return (
    <div className="crud-page">
      <div className="crud-header" style={{ marginBottom: '24px' }}>
        <h2>🚗 Gestionare Vehicule</h2>
        <button className="btn-primary" onClick={handleAdd}>
          ➕ Adaugă Vehicul
        </button>
      </div>

      <div className="search-filters" style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="🔍 Caută după număr, marcă sau model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ minWidth: '300px' }}
        />
        
        <select value={filterTip} onChange={(e) => setFilterTip(e.target.value)} className="form-control">
          <option value="">Toate tipurile</option>
          {TIPURI_VEHICUL.map(tip => (
            <option key={tip.value} value={tip.value}>{tip.label}</option>
          ))}
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-control">
          <option value="">Toate statusurile</option>
          {STATUSURI.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Se încarcă...</div>
      ) : (
        <div className="crud-table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Nr. Înmatriculare</th>
                <th>Marcă & Model</th>
                <th>Tip</th>
                <th>Capacitate</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicule.map(vehicul => (
                <tr key={vehicul.idVehicul}>
                  <td><strong>{vehicul.numarInmatriculare}</strong></td>
                  <td>{vehicul.marca} {vehicul.model}</td>
                  <td>{getTipIcon(vehicul.tipVehicul)}</td>
                  <td>
                    {vehicul.capacitateKg} kg<br/>
                    <small>{vehicul.capacitateVolumM3} m³</small>
                  </td>
                  <td>{getStatusBadge(vehicul.statusVehicul)}</td>
                  <td className="actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(vehicul)}
                      title="Editează"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(vehicul.idVehicul!)}
                      title="Șterge"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVehicule.length === 0 && (
                <tr>
                  <td colSpan={6} style={{textAlign: 'center', padding: '40px'}}>
                    Nu există vehicule înregistrate
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editMode ? '✏️ Editare Vehicul' : '➕ Adăugare Vehicul'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="crud-form">
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Număr Înmatriculare <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.numarInmatriculare}
                    onChange={(e) => setFormData({...formData, numarInmatriculare: e.target.value})}
                    placeholder="B-123-ABC"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Marcă <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    placeholder="Mercedes"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Model <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="Sprinter"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tip Vehicul <span className="required">*</span></label>
                  <select
                    className="form-control"
                    value={formData.tipVehicul}
                    onChange={(e) => setFormData({...formData, tipVehicul: e.target.value})}
                    required
                  >
                    {TIPURI_VEHICUL.map(tip => (
                      <option key={tip.value} value={tip.value}>{tip.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status <span className="required">*</span></label>
                  <select
                    className="form-control"
                    value={formData.statusVehicul}
                    onChange={(e) => setFormData({...formData, statusVehicul: e.target.value})}
                    required
                  >
                    {STATUSURI.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacitate (kg) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.capacitateKg}
                    onChange={(e) => setFormData({...formData, capacitateKg: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Capacitate Volum (m³) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.capacitateVolumM3}
                    onChange={(e) => setFormData({...formData, capacitateVolumM3: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Anulează
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Se salvează...' : editMode ? 'Actualizează' : 'Adaugă'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
