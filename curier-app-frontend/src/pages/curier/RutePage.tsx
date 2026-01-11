import { useState, useEffect, useRef } from 'react';
import { searchOrase } from '../../data/orase-romania';
import type { OrasData } from '../../data/orase-romania';
import './RutePage.css';

interface Ruta {
  idRuta: number;
  orasOrigine: string;
  orasDestinatie: string;
  judetOrigine: string;
  judetDestinatie: string;
  prioritate: number;
  descriere: string;
  activa: boolean;
}

// Componenta Autocomplete pentru Oraș
function OrasAutocomplete({ 
  value, 
  onChange, 
  onJudetChange,
  placeholder,
  required 
}: { 
  value: string; 
  onChange: (val: string) => void;
  onJudetChange: (val: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  const [suggestions, setSuggestions] = useState<OrasData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);
    
    if (val.length >= 2) {
      const results = searchOrase(val);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (oras: OrasData) => {
    setInputValue(oras.oras);
    onChange(oras.oras);
    onJudetChange(oras.judet);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={e => handleInputChange(e.target.value)}
        onFocus={() => {
          if (inputValue.length >= 2) {
            const results = searchOrase(inputValue);
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
          }
        }}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((oras, idx) => (
            <li 
              key={idx} 
              onClick={() => handleSelect(oras)}
              className="suggestion-item"
            >
              <span className="suggestion-city">{oras.oras}</span>
              <span className="suggestion-judet">{oras.judet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RutePage() {
  const [rute, setRute] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRuta, setEditingRuta] = useState<Ruta | null>(null);
  const [formData, setFormData] = useState({
    orasOrigine: '',
    orasDestinatie: '',
    judetOrigine: '',
    judetDestinatie: '',
    prioritate: 0,
    descriere: '',
    activa: true
  });

  const curierId = localStorage.getItem('userId');

  useEffect(() => {
    fetchRute();
  }, []);

  const fetchRute = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/curier/${curierId}/rute`);
      if (response.ok) {
        const data = await response.json();
        setRute(data);
      }
    } catch (error) {
      console.error('Eroare la încărcarea rutelor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ruta?: Ruta) => {
    if (ruta) {
      setEditingRuta(ruta);
      setFormData({
        orasOrigine: ruta.orasOrigine || '',
        orasDestinatie: ruta.orasDestinatie || '',
        judetOrigine: ruta.judetOrigine || '',
        judetDestinatie: ruta.judetDestinatie || '',
        prioritate: ruta.prioritate || 0,
        descriere: ruta.descriere || '',
        activa: ruta.activa
      });
    } else {
      setEditingRuta(null);
      setFormData({
        orasOrigine: '',
        orasDestinatie: '',
        judetOrigine: '',
        judetDestinatie: '',
        prioritate: 0,
        descriere: '',
        activa: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRuta(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingRuta 
        ? `http://localhost:8081/api/curier/${curierId}/rute/${editingRuta.idRuta}`
        : `http://localhost:8081/api/curier/${curierId}/rute`;
      
      const method = editingRuta ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        handleCloseModal();
        fetchRute();
      }
    } catch (error) {
      console.error('Eroare la salvarea rutei:', error);
    }
  };

  const handleDelete = async (rutaId: number) => {
    if (!confirm('Sigur doriți să ștergeți această rută?')) return;
    
    try {
      const response = await fetch(
        `http://localhost:8081/api/curier/${curierId}/rute/${rutaId}`,
        { method: 'DELETE' }
      );
      
      if (response.ok) {
        fetchRute();
      }
    } catch (error) {
      console.error('Eroare la ștergerea rutei:', error);
    }
  };

  const handleToggle = async (rutaId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/curier/${curierId}/rute/${rutaId}/toggle`,
        { method: 'PATCH' }
      );
      
      if (response.ok) {
        fetchRute();
      }
    } catch (error) {
      console.error('Eroare la actualizarea rutei:', error);
    }
  };

  if (loading) {
    return (
      <div className="rute-page">
        <div className="loading-spinner">Se încarcă...</div>
      </div>
    );
  }

  return (
    <div className="rute-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🗺️ Rutele Mele</h1>
          <p className="subtitle">Gestionează rutele pe care le acoperi</p>
        </div>
        <button className="btn-add-ruta" onClick={() => handleOpenModal()}>
          ➕ Adaugă Rută
        </button>
      </div>

      {rute.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>Nu ai nicio rută configurată</h3>
          <p>Adaugă rute pentru a primi comenzi din zonele tale</p>
          <button className="btn-add-ruta" onClick={() => handleOpenModal()}>
            ➕ Adaugă Prima Rută
          </button>
        </div>
      ) : (
        <div className="rute-grid">
          {rute.map(ruta => (
            <div key={ruta.idRuta} className={`ruta-card ${!ruta.activa ? 'inactive' : ''}`}>
              <div className="ruta-header">
                <div className="ruta-route">
                  <span className="city origin">{ruta.orasOrigine}</span>
                  <span className="arrow">→</span>
                  <span className="city destination">{ruta.orasDestinatie}</span>
                </div>
                <div className={`ruta-status ${ruta.activa ? 'active' : 'inactive'}`}>
                  {ruta.activa ? '✓ Activă' : '✗ Inactivă'}
                </div>
              </div>
              
              <div className="ruta-details">
                <div className="detail-row">
                  <span className="label">Județ origine:</span>
                  <span className="value">{ruta.judetOrigine || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Județ destinație:</span>
                  <span className="value">{ruta.judetDestinatie || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Prioritate:</span>
                  <span className="value priority">{ruta.prioritate}</span>
                </div>
                {ruta.descriere && (
                  <div className="detail-row">
                    <span className="label">Descriere:</span>
                    <span className="value">{ruta.descriere}</span>
                  </div>
                )}
              </div>
              
              <div className="ruta-actions">
                <button 
                  className="btn-toggle" 
                  onClick={() => handleToggle(ruta.idRuta)}
                  title={ruta.activa ? 'Dezactivează' : 'Activează'}
                >
                  {ruta.activa ? '⏸️' : '▶️'}
                </button>
                <button 
                  className="btn-edit" 
                  onClick={() => handleOpenModal(ruta)}
                  title="Editează"
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => handleDelete(ruta.idRuta)}
                  title="Șterge"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Adaugă/Editează Rută */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRuta ? '✏️ Editează Ruta' : '➕ Adaugă Rută Nouă'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group autocomplete-group">
                  <label>Oraș Origine *</label>
                  <OrasAutocomplete
                    value={formData.orasOrigine}
                    onChange={(val) => setFormData({...formData, orasOrigine: val})}
                    onJudetChange={(val) => setFormData({...formData, judetOrigine: val})}
                    placeholder="Caută oraș..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Județ Origine</label>
                  <input
                    type="text"
                    value={formData.judetOrigine}
                    onChange={e => setFormData({...formData, judetOrigine: e.target.value})}
                    placeholder="Se completează automat"
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group autocomplete-group">
                  <label>Oraș Destinație *</label>
                  <OrasAutocomplete
                    value={formData.orasDestinatie}
                    onChange={(val) => setFormData({...formData, orasDestinatie: val})}
                    onJudetChange={(val) => setFormData({...formData, judetDestinatie: val})}
                    placeholder="Caută oraș..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Județ Destinație</label>
                  <input
                    type="text"
                    value={formData.judetDestinatie}
                    onChange={e => setFormData({...formData, judetDestinatie: e.target.value})}
                    placeholder="Se completează automat"
                    readOnly
                    className="readonly-input"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Prioritate</label>
                  <input
                    type="number"
                    value={formData.prioritate}
                    onChange={e => setFormData({...formData, prioritate: parseInt(e.target.value) || 0})}
                    min="0"
                    max="10"
                  />
                  <span className="help-text">0 = cea mai mică, 10 = cea mai mare</span>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.activa}
                      onChange={e => setFormData({...formData, activa: e.target.checked})}
                    />
                    Rută activă
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Descriere (opțional)</label>
                <textarea
                  value={formData.descriere}
                  onChange={e => setFormData({...formData, descriere: e.target.value})}
                  placeholder="Notițe despre această rută..."
                  rows={3}
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Anulează
                </button>
                <button type="submit" className="btn-save">
                  {editingRuta ? 'Salvează Modificările' : 'Adaugă Ruta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
