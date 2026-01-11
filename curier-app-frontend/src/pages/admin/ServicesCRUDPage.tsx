import { useState, useEffect } from 'react';
import './CRUDPage.css';

interface Serviciu {
  id?: number;
  nume: string;
  descriere: string;
  pretBaza: number;
  pretPerKg: number;
  timpLivrare: string;
  activ: boolean;
}

const INITIAL_SERVICIU: Serviciu = {
  nume: '',
  descriere: '',
  pretBaza: 0,
  pretPerKg: 0,
  timpLivrare: '',
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
          { id: 1, nume: 'Standard', descriere: 'Livrare în 2-3 zile lucrătoare', pretBaza: 15, pretPerKg: 2, timpLivrare: '2-3 zile', activ: true },
          { id: 2, nume: 'Express', descriere: 'Livrare în 24 ore', pretBaza: 25, pretPerKg: 3, timpLivrare: '24 ore', activ: true },
          { id: 3, nume: 'Same Day', descriere: 'Livrare în aceeași zi', pretBaza: 45, pretPerKg: 5, timpLivrare: 'Aceeași zi', activ: true },
          { id: 4, nume: 'Economy', descriere: 'Livrare în 5-7 zile', pretBaza: 10, pretPerKg: 1.5, timpLivrare: '5-7 zile', activ: false },
        ]);
      }
    } catch (error) {
      console.error('Eroare la încărcare servicii:', error);
      // Date demo pentru fallback
      setServicii([
        { id: 1, nume: 'Standard', descriere: 'Livrare în 2-3 zile lucrătoare', pretBaza: 15, pretPerKg: 2, timpLivrare: '2-3 zile', activ: true },
        { id: 2, nume: 'Express', descriere: 'Livrare în 24 ore', pretBaza: 25, pretPerKg: 3, timpLivrare: '24 ore', activ: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredServicii = servicii.filter(s => {
    const matchSearch = searchTerm === '' || 
      s.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      ? `http://localhost:8081/api/admin/servicii/${selectedServiciu?.id}`
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
          s.id === selectedServiciu.id ? { ...formData, id: selectedServiciu.id } : s
        ));
      } else {
        setServicii(prev => [...prev, { ...formData, id: Date.now() }]);
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
        setServicii(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Eroare la ștergere:', error);
      setServicii(prev => prev.filter(s => s.id !== id));
    } finally {
      setDeleteConfirm(null);
    }
  };

  const toggleActiv = async (serviciu: Serviciu) => {
    try {
      await fetch(`http://localhost:8081/api/admin/servicii/${serviciu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...serviciu, activ: !serviciu.activ })
      });
      fetchServicii();
    } catch (error) {
      // Actualizare locală
      setServicii(prev => prev.map(s => 
        s.id === serviciu.id ? { ...s, activ: !s.activ } : s
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
            key={serviciu.id} 
            className={`service-card ${!serviciu.activ ? 'inactive' : ''}`}
          >
            <div className="card-header">
              <div className="card-title">
                <h3>{serviciu.nume}</h3>
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
                  onClick={() => setDeleteConfirm(serviciu.id!)}
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
                <span className="detail-value">{serviciu.timpLivrare}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">💰 Preț bază</span>
                <span className="detail-value price">{serviciu.pretBaza} RON</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">⚖️ Preț/kg</span>
                <span className="detail-value">{serviciu.pretPerKg} RON</span>
              </div>
            </div>

            {/* Delete Confirmation */}
            {deleteConfirm === serviciu.id && (
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
                      onClick={() => handleDelete(serviciu.id!)}
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
                    name="nume"
                    value={formData.nume}
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
                    name="pretPerKg"
                    value={formData.pretPerKg}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Timp Livrare *</label>
                  <input
                    type="text"
                    name="timpLivrare"
                    value={formData.timpLivrare}
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
