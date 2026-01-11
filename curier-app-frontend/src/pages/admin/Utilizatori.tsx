import { useState, useEffect } from 'react';
import './AdminLayout.css';

interface Utilizator {
  idUtilizator: number;
  username: string;
  nume: string;
  prenume: string;
  email: string;
  telefon: string;
  rol: string;
  activ?: boolean;
}

const ROLURI = [
  { value: 'client', label: 'Client', badge: 'badge-client' },
  { value: 'operator', label: 'Operator', badge: 'badge-operator' },
  { value: 'curier', label: 'Curier', badge: 'badge-curier' },
  { value: 'sofer', label: 'Șofer', badge: 'badge-sofer' },
  { value: 'admin', label: 'Admin', badge: 'badge-admin' },
];

export default function Utilizatori() {
  const [utilizatori, setUtilizatori] = useState<Utilizator[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtruRol, setFiltruRol] = useState('');
  const [cautare, setCautare] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Utilizator | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    parola: '',
    nume: '',
    prenume: '',
    email: '',
    telefon: '',
    rol: 'client'
  });

  useEffect(() => {
    fetchUtilizatori();
  }, []);

  const fetchUtilizatori = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/admin/utilizatori');
      if (response.ok) {
        const data = await response.json();
        setUtilizatori(data);
      }
    } catch (error) {
      console.error('Eroare la încărcarea utilizatorilor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editMode 
      ? `http://localhost:8081/api/admin/utilizatori/${selectedUser?.idUtilizator}`
      : 'http://localhost:8081/api/admin/utilizatori';
    
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchUtilizatori();
        closeModal();
      } else {
        alert('Eroare la salvare!');
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sigur vrei să ștergi acest utilizator?')) return;

    try {
      const response = await fetch(`http://localhost:8081/api/admin/utilizatori/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchUtilizatori();
      }
    } catch (error) {
      console.error('Eroare la ștergere:', error);
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      username: '',
      parola: '',
      nume: '',
      prenume: '',
      email: '',
      telefon: '',
      rol: 'client'
    });
    setShowModal(true);
  };

  const openEditModal = (user: Utilizator) => {
    setEditMode(true);
    setSelectedUser(user);
    setFormData({
      username: user.username,
      parola: '',
      nume: user.nume || '',
      prenume: user.prenume || '',
      email: user.email || '',
      telefon: user.telefon || '',
      rol: user.rol
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getRolBadge = (rol: string) => {
    const rolData = ROLURI.find(r => r.value === rol);
    return rolData ? rolData.badge : 'badge-client';
  };

  const getRolLabel = (rol: string) => {
    const rolData = ROLURI.find(r => r.value === rol);
    return rolData ? rolData.label : rol;
  };

  const filteredUtilizatori = utilizatori.filter(u => {
    const matchRol = !filtruRol || u.rol === filtruRol;
    const matchCautare = !cautare || 
      u.username.toLowerCase().includes(cautare.toLowerCase()) ||
      u.nume?.toLowerCase().includes(cautare.toLowerCase()) ||
      u.prenume?.toLowerCase().includes(cautare.toLowerCase()) ||
      u.email?.toLowerCase().includes(cautare.toLowerCase());
    return matchRol && matchCautare;
  });

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="utilizatori-page">
      <div className="page-header">
        <div>
          <h1>Utilizatori</h1>
          <p>Gestionează utilizatorii și rolurile din sistem</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAddModal}>
            + Adaugă utilizator
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <span className="stat-value">{utilizatori.length}</span>
            <span className="stat-label">Total utilizatori</span>
          </div>
        </div>
        {ROLURI.map(rol => (
          <div className="stat-card" key={rol.value}>
            <div className="stat-info">
              <span className="stat-value">
                {utilizatori.filter(u => u.rol === rol.value).length}
              </span>
              <span className="stat-label">{rol.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabel */}
      <div className="data-table-container">
        <div className="table-header">
          <h2>Lista utilizatori</h2>
          <div className="table-filters">
            <select 
              className="filter-select"
              value={filtruRol}
              onChange={e => setFiltruRol(e.target.value)}
            >
              <option value="">Toate rolurile</option>
              {ROLURI.map(rol => (
                <option key={rol.value} value={rol.value}>{rol.label}</option>
              ))}
            </select>
            <input
              type="text"
              className="filter-input"
              placeholder="🔍 Caută utilizator..."
              value={cautare}
              onChange={e => setCautare(e.target.value)}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Nume complet</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Rol</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredUtilizatori.map(user => (
              <tr key={user.idUtilizator}>
                <td>#{user.idUtilizator}</td>
                <td><strong>{user.username}</strong></td>
                <td>{user.prenume} {user.nume}</td>
                <td>{user.email || '-'}</td>
                <td>{user.telefon || '-'}</td>
                <td>
                  <span className={`badge ${getRolBadge(user.rol)}`}>
                    {getRolLabel(user.rol)}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-action btn-edit-action" onClick={() => openEditModal(user)} title="Editează">
                      ✏️
                    </button>
                    <button className="btn-action btn-delete-action" onClick={() => handleDelete(user.idUtilizator)} title="Șterge">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUtilizatori.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <h3>Niciun utilizator găsit</h3>
            <p>Modifică filtrele sau adaugă un utilizator nou.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Editează utilizator' : 'Adaugă utilizator nou'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Username *</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      required
                      disabled={editMode}
                    />
                  </div>
                  <div className="form-group">
                    <label>{editMode ? 'Parolă nouă' : 'Parolă *'}</label>
                    <input
                      type="password"
                      value={formData.parola}
                      onChange={e => setFormData({...formData, parola: e.target.value})}
                      required={!editMode}
                      placeholder={editMode ? 'Lasă gol pentru a păstra' : ''}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Prenume</label>
                    <input
                      type="text"
                      value={formData.prenume}
                      onChange={e => setFormData({...formData, prenume: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Nume</label>
                    <input
                      type="text"
                      value={formData.nume}
                      onChange={e => setFormData({...formData, nume: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefon</label>
                    <input
                      type="tel"
                      value={formData.telefon}
                      onChange={e => setFormData({...formData, telefon: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Rol *</label>
                  <select
                    value={formData.rol}
                    onChange={e => setFormData({...formData, rol: e.target.value})}
                    required
                  >
                    {ROLURI.map(rol => (
                      <option key={rol.value} value={rol.value}>{rol.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Anulează
                </button>
                <button type="submit" className="btn-primary">
                  {editMode ? 'Salvează modificările' : 'Adaugă utilizator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
