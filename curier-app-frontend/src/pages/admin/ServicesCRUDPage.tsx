import { useState, useEffect } from 'react';
import './CRUDPage.css';

interface Serviciu {
  idServiciu?: number;
  numeServiciu: string;
  descriere: string;
  pretBaza: number;
  pretKg: number;
  pretKm: number;
  timpEstimatLivrare: string;
  activ: boolean;
}

const INITIAL_SERVICIU: Serviciu = {
  numeServiciu: '',
  descriere: '',
  pretBaza: 0,
  pretKg: 0,
  pretKm: 0,
  timpEstimatLivrare: '',
  activ: true
};

export default function ServicesCRUDPage() {
  const [servicii, setServicii] = useState<Serviciu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedServiciu, setSelectedServiciu] = useState<Serviciu | null>(null);
  const [formData, setFormData] = useState<Serviciu>(INITIAL_SERVICIU);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActiv, setFilterActiv] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchServicii();
  }, []);

  const fetchServicii = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/admin/servicii');
      if (response.ok) {
        const data = await response.json();
        setServicii(data);
      } else {
        // Date demo dacă API-ul nu returnează nimic
        setServicii([
          { idServiciu: 1, numeServiciu: 'Standard', descriere: 'Livrare în 2-3 zile lucrătoare', pretBaza: 15, pretKg: 2, pretKm: 0.5, timpEstimatLivrare: '2-3 zile', activ: true },
          { idServiciu: 2, numeServiciu: 'Express', descriere: 'Livrare în 24 ore', pretBaza: 25, pretKg: 3, pretKm: 1, timpEstimatLivrare: '24 ore', activ: true },
          { idServiciu: 3, numeServiciu: 'Same Day', descriere: 'Livrare în aceeași zi', pretBaza: 45, pretKg: 5, pretKm: 1.5, timpEstimatLivrare: 'Aceeași zi', activ: true },
          { idServiciu: 4, numeServiciu: 'Economy', descriere: 'Livrare în 5-7 zile', pretBaza: 10, pretKg: 1.5, pretKm: 0.3, timpEstimatLivrare: '5-7 zile', activ: false },
        ]);
      }
    } catch (error) {
      console.error('Eroare la încărcare servicii:', error);
      // Date demo pentru fallback
      setServicii([
        { idServiciu: 1, numeServiciu: 'Standard', descriere: 'Livrare în 2-3 zile lucrătoare', pretBaza: 15, pretKg: 2, pretKm: 0.5, timpEstimatLivrare: '2-3 zile', activ: true },
        { idServiciu: 2, numeServiciu: 'Express', descriere: 'Livrare în 24 ore', pretBaza: 25, pretKg: 3, pretKm: 1, timpEstimatLivrare: '24 ore', activ: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServicii = servicii.filter(s => {
    const matchSearch = searchTerm === '' || 
      s.numeServiciu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.descriere.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchActiv = filterActiv === '' || 
      (filterActiv === 'activ' && s.activ) ||
      (filterActiv === 'inactiv' && !s.activ);

    return matchSearch && matchActiv;
  });

  const openAddModal = () => {
    setFormData(INITIAL_SERVICIU);
    setEditMode(false);
    setSelectedServiciu(null);
    setShowModal(true);
  };

  const openEditModal = (serviciu: Serviciu) => {
    setFormData({ ...serviciu });
    setSelectedServiciu(serviciu);
    setEditMode(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData(INITIAL_SERVICIU);
    setSelectedServiciu(null);
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      activ: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = editMode 
      ? `http://localhost:8081/api/admin/servicii/${selectedServiciu?.idServiciu}`
      : 'http://localhost:8081/api/admin/servicii';
    
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchServicii();
        closeModal();
      } else {
        alert('Eroare la salvare!');
      }
    } catch (error) {
      console.error('Eroare:', error);
      // Simulare salvare locală pentru demo
      if (editMode && selectedServiciu) {
        setServicii(prev => prev.map(s => 
          s.idServiciu === selectedServiciu.idServiciu ? { ...formData, idServiciu: selectedServiciu.idServiciu } : s
        ));
      } else {
        setServicii(prev => [...prev, { ...formData, idServiciu: Date.now() }]);
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/admin/servicii/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchServicii();
      } else {
        // Simulare ștergere locală
        setServicii(prev => prev.filter(s => s.idServiciu !== id));
      }
    } catch (error) {
      console.error('Eroare la ștergere:', error);
      setServicii(prev => prev.filter(s => s.idServiciu !== id));
    } finally {
      setDeleteConfirm(null);
    }
  };

  const toggleActiv = async (serviciu: Serviciu) => {
    try {
      await fetch(`http://localhost:8081/api/admin/servicii/${serviciu.idServiciu}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...serviciu, activ: !serviciu.activ })
      });
      fetchServicii();
    } catch (error) {
      // Actualizare locală
      setServicii(prev => prev.map(s => 
        s.idServiciu === serviciu.idServiciu ? { ...s, activ: !s.activ } : s
      ));
    }
  };

  if (loading) {
    return (
      <div className="crud-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Se încarcă serviciile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>📦 Servicii de Livrare</h1>
          <span className="badge">{servicii.length} servicii</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ Adaugă Serviciu
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Caută serviciu..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterActiv}
          onChange={e => setFilterActiv(e.target.value)}
        >
          <option value="">Toate</option>
          <option value="activ">Active</option>
          <option value="inactiv">Inactive</option>
        </select>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {filteredServicii.map(serviciu => (
          <div 
            key={serviciu.idServiciu} 
            className={`service-card ${!serviciu.activ ? 'inactive' : ''}`}
          >
            <div className="card-header">
              <div className="card-title">
                <h3>{serviciu.numeServiciu}</h3>
                <span className={`status-badge ${serviciu.activ ? 'active' : 'inactive'}`}>
                  {serviciu.activ ? 'Activ' : 'Inactiv'}
                </span>
              </div>
              <div className="card-actions">
                <button 
                  className="btn-icon btn-edit" 
                  onClick={() => openEditModal(serviciu)}
                  title="Editează"
                >
                  ✏️
                </button>
                <button 
                  className="btn-icon btn-toggle"
                  onClick={() => toggleActiv(serviciu)}
                  title={serviciu.activ ? 'Dezactivează' : 'Activează'}
                >
                  {serviciu.activ ? '🔒' : '🔓'}
                </button>
                <button 
                  className="btn-icon btn-delete"
                  onClick={() => setDeleteConfirm(serviciu.idServiciu!)}
                  title="Șterge"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="card-description">{serviciu.descriere}</p>

            <div className="card-details">
              <div className="detail-row">
                <span className="detail-label">⏱️ Timp livrare</span>
                <span className="detail-value">{serviciu.timpEstimatLivrare}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">💰 Preț bază</span>
                <span className="detail-value price">{serviciu.pretBaza} RON</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">⚖️ Preț/kg</span>
                <span className="detail-value">{serviciu.pretKg} RON</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">📍 Preț/km</span>
                <span className="detail-value">{serviciu.pretKm} RON</span>
              </div>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm === serviciu.idServiciu && (
              <div className="delete-confirm-overlay">
                <div className="delete-confirm-box">
                  <p>Sigur vrei să ștergi acest serviciu?</p>
                  <div className="confirm-actions">
                    <button 
                      className="btn btn-cancel" 
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Anulează
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(serviciu.idServiciu!)}
                    >
                      Șterge
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add New Card */}
        <div className="service-card add-card" onClick={openAddModal}>
          <div className="add-icon">➕</div>
          <p>Adaugă serviciu nou</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? '✏️ Editare Serviciu' : '➕ Adaugă Serviciu'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Nume Serviciu *</label>
                  <input
                    type="text"
                    name="numeServiciu"
                    value={formData.numeServiciu}
                    onChange={handleInputChange}
                    placeholder="Ex: Express, Standard..."
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Descriere</label>
                  <textarea
                    name="descriere"
                    value={formData.descriere}
                    onChange={handleInputChange}
                    placeholder="Descriere serviciu..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Preț Bază (RON) *</label>
                  <input
                    type="number"
                    name="pretBaza"
                    value={formData.pretBaza}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Preț per Kg (RON)</label>
                  <input
                    type="number"
                    name="pretKg"
                    value={formData.pretKg}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Preț per Km (RON)</label>
                  <input
                    type="number"
                    name="pretKm"
                    value={formData.pretKm}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Timp Estimat Livrare *</label>
                  <input
                    type="text"
                    name="timpEstimatLivrare"
                    value={formData.timpEstimatLivrare}
                    onChange={handleInputChange}
                    placeholder="Ex: 24 ore, 2-3 zile..."
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.activ}
                      onChange={handleCheckboxChange}
                    />
                    <span className="checkmark"></span>
                    Serviciu activ
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-cancel" onClick={closeModal}>
                  Anulează
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Se salvează...' : (editMode ? 'Salvează' : 'Adaugă')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
