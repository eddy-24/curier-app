import { useState, useEffect } from 'react';
import './CRUDPage.css';

interface Utilizator {
  idUtilizator?: number;
  username: string;
  parola?: string;
  parolaClar?: string; // Parola în clar pentru afișare
  nume: string;
  prenume: string;
  email: string;
  telefon: string;
  rol: string;
  activ: boolean;
}

const ROLURI = [
  { value: 'client', label: 'Client', icon: '👤', color: '#3498db' },
  { value: 'operator', label: 'Operator', icon: '📋', color: '#9b59b6' },
  { value: 'curier', label: 'Curier', icon: '🚚', color: '#27ae60' },
  { value: 'admin', label: 'Admin', icon: '⚙️', color: '#e74c3c' },
];

const INITIAL_USER: Utilizator = {
  username: '',
  parola: '',
  nume: '',
  prenume: '',
  email: '',
  telefon: '',
  rol: 'client',
  activ: true
};

export default function UsersCRUDPage() {
  const [utilizatori, setUtilizatori] = useState<Utilizator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Utilizator | null>(null);
  const [formData, setFormData] = useState<Utilizator>(INITIAL_USER);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [filterActiv, setFilterActiv] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'nume',
    direction: 'asc'
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
      console.error('Eroare la încărcare utilizatori:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedUsers = utilizatori
    .filter(u => {
      const matchSearch = searchTerm === '' || 
        u.nume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.prenume?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchRol = filterRol === '' || u.rol === filterRol;
      
      const matchActiv = filterActiv === '' || 
        (filterActiv === 'activ' && u.activ) ||
        (filterActiv === 'inactiv' && !u.activ);

      return matchSearch && matchRol && matchActiv;
    })
    .sort((a, b) => {
      let aVal = '';
      let bVal = '';

      switch (sortConfig.key) {
        case 'nume':
          aVal = `${a.nume} ${a.prenume}`.toLowerCase();
          bVal = `${b.nume} ${b.prenume}`.toLowerCase();
          break;
        case 'username':
          aVal = a.username.toLowerCase();
          bVal = b.username.toLowerCase();
          break;
        case 'rol':
          aVal = a.rol;
          bVal = b.rol;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const getRolInfo = (rol: string) => {
    return ROLURI.find(r => r.value === rol) || { label: rol, icon: '👤', color: '#6c757d' };
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const openAddModal = () => {
    setFormData(INITIAL_USER);
    setEditMode(false);
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (user: Utilizator) => {
    setFormData({ ...user, parola: '' });
    setSelectedUser(user);
    setEditMode(true);
    setShowModal(true);
  };

  const openRoleModal = (user: Utilizator) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowRoleModal(false);
    setFormData(INITIAL_USER);
    setSelectedUser(null);
    setEditMode(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, activ: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const dataToSend = { ...formData };
    if (editMode && !formData.parola) {
      delete dataToSend.parola;
    }

    const url = editMode 
      ? `http://localhost:8081/api/admin/utilizatori/${selectedUser?.idUtilizator}`
      : 'http://localhost:8081/api/admin/utilizatori';
    
    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update optimist: actualizează lista local
        if (editMode && selectedUser) {
          setUtilizatori(prev => prev.map(u => 
            u.idUtilizator === selectedUser.idUtilizator 
              ? { ...u, ...updatedUser, parolaClar: formData.parola || u.parolaClar }
              : u
          ));
        } else {
          // Pentru utilizator nou, adaugă la listă
          setUtilizatori(prev => [...prev, updatedUser]);
        }
        
        closeModal();
      } else {
        const errorText = await response.text();
        alert(`Eroare: ${errorText}`);
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la salvare!');
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:8081/api/admin/utilizatori/${selectedUser.idUtilizator}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...selectedUser, rol: newRole })
        }
      );

      if (response.ok) {
        fetchUtilizatori();
        closeModal();
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8081/api/admin/utilizatori/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Update optimist - elimină utilizatorul din listă
        setUtilizatori(prev => prev.filter(u => u.idUtilizator !== id));
        alert('Utilizator șters cu succes!');
      } else {
        const errorText = await response.text();
        alert(`Nu se poate șterge utilizatorul: ${errorText || 'Utilizatorul are date asociate (comenzi, adrese, etc.)'}`);
      }
    } catch (error) {
      console.error('Eroare la ștergere:', error);
      alert('Eroare la ștergerea utilizatorului. Verificați dacă utilizatorul nu are date asociate.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const toggleActiv = async (user: Utilizator) => {
    try {
      await fetch(`http://localhost:8081/api/admin/utilizatori/${user.idUtilizator}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, activ: !user.activ })
      });
      fetchUtilizatori();
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  // Stats per rol
  const statsPerRol = ROLURI.map(rol => ({
    ...rol,
    count: utilizatori.filter(u => u.rol === rol.value).length
  }));

  if (loading) {
    return (
      <div className="crud-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Se încarcă utilizatorii...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>👥 Gestionare Utilizatori</h1>
          <span className="badge">{utilizatori.length} utilizatori</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            ➕ Adaugă Utilizator
          </button>
        </div>
      </div>

      {/* Stats by Role */}
      <div className="role-stats">
        {statsPerRol.map(stat => (
          <div 
            key={stat.value}
            className={`role-stat-card ${filterRol === stat.value ? 'active' : ''}`}
            style={{ borderColor: stat.color }}
            onClick={() => setFilterRol(filterRol === stat.value ? '' : stat.value)}
          >
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-count">{stat.count}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Caută utilizator..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterRol}
          onChange={e => setFilterRol(e.target.value)}
        >
          <option value="">Toate rolurile</option>
          {ROLURI.map(rol => (
            <option key={rol.value} value={rol.value}>{rol.icon} {rol.label}</option>
          ))}
        </select>
        <select
          value={filterActiv}
          onChange={e => setFilterActiv(e.target.value)}
        >
          <option value="">Toți</option>
          <option value="activ">Activi</option>
          <option value="inactiv">Inactivi</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('username')}>
                Username {sortConfig.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="sortable" onClick={() => handleSort('nume')}>
                Nume Complet {sortConfig.key === 'nume' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Parolă</th>
              <th className="sortable" onClick={() => handleSort('rol')}>
                Rol {sortConfig.key === 'rol' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-data">
                  <div className="empty-state">
                    <span className="empty-icon">👥</span>
                    <p>Nu există utilizatori care să corespundă filtrelor</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAndSortedUsers.map(user => {
                const rolInfo = getRolInfo(user.rol);
                // Parolele default pentru fiecare rol
                const getDefaultPassword = (rol: string) => {
                  switch(rol) {
                    case 'client': return 'client123';
                    case 'curier': return 'curier123';
                    case 'operator': return 'operator123';
                    case 'admin': return 'admin123';
                    default: return 'pass123';
                  }
                };
                // Afișăm parolaClar dacă există, altfel parola default
                const displayPassword = user.parolaClar || getDefaultPassword(user.rol);
                return (
                  <tr key={user.idUtilizator} className={!user.activ ? 'inactive-row' : ''}>
                    <td>
                      <div className="user-cell">
                        <div 
                          className="user-avatar"
                          style={{ backgroundColor: rolInfo.color }}
                        >
                          {user.nume?.charAt(0)}{user.prenume?.charAt(0)}
                        </div>
                        <span className="username">{user.username}</span>
                      </div>
                    </td>
                    <td>
                      <strong>{user.nume} {user.prenume}</strong>
                    </td>
                    <td>{user.email || '-'}</td>
                    <td>{user.telefon || '-'}</td>
                    <td>
                      <code style={{ 
                        background: '#f0f0f0', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        color: '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        {displayPassword}
                      </code>
                    </td>
                    <td>
                      <button 
                        className="role-badge-btn"
                        style={{ backgroundColor: `${rolInfo.color}20`, color: rolInfo.color, borderColor: rolInfo.color }}
                        onClick={() => openRoleModal(user)}
                        title="Click pentru a schimba rolul"
                      >
                        {rolInfo.icon} {rolInfo.label}
                      </button>
                    </td>
                    <td>
                      <span className={`status-badge ${user.activ ? 'active' : 'inactive'}`}>
                        {user.activ ? '✓ Activ' : '✗ Inactiv'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-action btn-edit-action" 
                          onClick={() => openEditModal(user)}
                          title="Editează"
                        >
                          ✏️
                        </button>
                        <button 
                          className={`btn-action ${user.activ ? 'btn-pause-action' : 'btn-play-action'}`}
                          onClick={() => toggleActiv(user)}
                          title={user.activ ? 'Dezactivează' : 'Activează'}
                        >
                          {user.activ ? '⏸️' : '▶️'}
                        </button>
                        <button 
                          className="btn-action btn-delete-action"
                          onClick={() => setDeleteConfirm(user.idUtilizator!)}
                          title="Șterge"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Delete Confirmation */}
                      {deleteConfirm === user.idUtilizator && (
                        <div className="inline-confirm">
                          <span>Confirmi?</span>
                          <button 
                            className="btn-sm btn-danger"
                            onClick={() => handleDelete(user.idUtilizator!)}
                          >
                            Da
                          </button>
                          <button 
                            className="btn-sm btn-cancel"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            Nu
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? '✏️ Editare Utilizator' : '➕ Adaugă Utilizator'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username unic"
                    required
                    disabled={editMode}
                  />
                </div>

                <div className="form-group">
                  <label>{editMode ? 'Parolă Nouă' : 'Parolă *'}</label>
                  <input
                    type="password"
                    name="parola"
                    value={formData.parola || ''}
                    onChange={handleInputChange}
                    placeholder={editMode ? 'Lasă gol pentru a păstra' : 'Parolă'}
                    required={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>Nume *</label>
                  <input
                    type="text"
                    name="nume"
                    value={formData.nume}
                    onChange={handleInputChange}
                    placeholder="Nume de familie"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Prenume *</label>
                  <input
                    type="text"
                    name="prenume"
                    value={formData.prenume}
                    onChange={handleInputChange}
                    placeholder="Prenume"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemplu.com"
                  />
                </div>

                <div className="form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleInputChange}
                    placeholder="07XX XXX XXX"
                  />
                </div>

                <div className="form-group">
                  <label>Rol *</label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    required
                  >
                    {ROLURI.map(rol => (
                      <option key={rol.value} value={rol.value}>
                        {rol.icon} {rol.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.activ}
                      onChange={handleCheckboxChange}
                    />
                    <span className="checkmark"></span>
                    Utilizator activ
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

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content modal-small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔄 Schimbă Rol</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="role-change-content">
              <p className="current-user">
                <strong>{selectedUser.nume} {selectedUser.prenume}</strong>
                <span className="username">@{selectedUser.username}</span>
              </p>

              <p className="current-role-label">Rol curent:</p>
              <div 
                className="current-role-badge"
                style={{ 
                  backgroundColor: `${getRolInfo(selectedUser.rol).color}20`,
                  color: getRolInfo(selectedUser.rol).color,
                  borderColor: getRolInfo(selectedUser.rol).color
                }}
              >
                {getRolInfo(selectedUser.rol).icon} {getRolInfo(selectedUser.rol).label}
              </div>

              <p className="select-role-label">Selectează noul rol:</p>
              <div className="role-options">
                {ROLURI.map(rol => (
                  <button
                    key={rol.value}
                    className={`role-option ${selectedUser.rol === rol.value ? 'current' : ''}`}
                    style={{ 
                      borderColor: rol.color,
                      backgroundColor: selectedUser.rol === rol.value ? `${rol.color}20` : 'transparent'
                    }}
                    onClick={() => handleRoleChange(rol.value)}
                    disabled={selectedUser.rol === rol.value}
                  >
                    <span className="role-icon">{rol.icon}</span>
                    <span className="role-name">{rol.label}</span>
                    {selectedUser.rol === rol.value && <span className="current-indicator">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={closeModal}>
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
