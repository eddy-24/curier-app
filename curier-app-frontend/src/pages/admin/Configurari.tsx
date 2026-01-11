import { useState } from 'react';
import './AdminLayout.css';

interface StatusColet {
  id: number;
  cod: string;
  nume: string;
  descriere: string;
  culoare: string;
  activ: boolean;
}

interface MotivEsec {
  id: number;
  cod: string;
  descriere: string;
  necesitaDetalii: boolean;
  activ: boolean;
}

interface Depozit {
  id: number;
  nume: string;
  adresa: string;
  oras: string;
  judet: string;
  capacitate: number;
  activ: boolean;
}

const STATUSURI_DEFAULT: StatusColet[] = [
  { id: 1, cod: 'in_asteptare', nume: 'În așteptare', descriere: 'Coletul așteaptă preluarea', culoare: '#94a3b8', activ: true },
  { id: 2, cod: 'preluat', nume: 'Preluat', descriere: 'Coletul a fost preluat de curier', culoare: '#3b82f6', activ: true },
  { id: 3, cod: 'in_tranzit', nume: 'În tranzit', descriere: 'Coletul este în drum spre destinație', culoare: '#f59e0b', activ: true },
  { id: 4, cod: 'in_livrare', nume: 'În livrare', descriere: 'Coletul este în curs de livrare', culoare: '#8b5cf6', activ: true },
  { id: 5, cod: 'livrat', nume: 'Livrat', descriere: 'Coletul a fost livrat cu succes', culoare: '#22c55e', activ: true },
  { id: 6, cod: 'returnat', nume: 'Returnat', descriere: 'Coletul a fost returnat', culoare: '#ef4444', activ: true },
  { id: 7, cod: 'esuat', nume: 'Livrare eșuată', descriere: 'Livrarea nu a putut fi efectuată', culoare: '#dc2626', activ: true },
];

const MOTIVE_ESEC_DEFAULT: MotivEsec[] = [
  { id: 1, cod: 'destinatar_absent', descriere: 'Destinatar absent', necesitaDetalii: false, activ: true },
  { id: 2, cod: 'adresa_gresita', descriere: 'Adresă greșită sau incompletă', necesitaDetalii: true, activ: true },
  { id: 3, cod: 'refuzat', descriere: 'Colet refuzat de destinatar', necesitaDetalii: true, activ: true },
  { id: 4, cod: 'nu_raspunde', descriere: 'Destinatar nu răspunde la telefon', necesitaDetalii: false, activ: true },
  { id: 5, cod: 'acces_imposibil', descriere: 'Acces imposibil la adresă', necesitaDetalii: true, activ: true },
  { id: 6, cod: 'colet_deteriorat', descriere: 'Colet deteriorat', necesitaDetalii: true, activ: true },
  { id: 7, cod: 'probleme_plata', descriere: 'Probleme la plata ramburs', necesitaDetalii: true, activ: true },
];

const DEPOZITE_DEFAULT: Depozit[] = [
  { id: 1, nume: 'Depozit Central București', adresa: 'Str. Logisticii nr. 1', oras: 'București', judet: 'București', capacitate: 5000, activ: true },
  { id: 2, nume: 'Depozit Cluj', adresa: 'Str. Transporturilor nr. 25', oras: 'Cluj-Napoca', judet: 'Cluj', capacitate: 2000, activ: true },
  { id: 3, nume: 'Depozit Timișoara', adresa: 'Calea Buziaș nr. 100', oras: 'Timișoara', judet: 'Timiș', capacitate: 1500, activ: true },
  { id: 4, nume: 'Depozit Constanța', adresa: 'Port Zona Liberă', oras: 'Constanța', judet: 'Constanța', capacitate: 3000, activ: false },
];

type TabType = 'statusuri' | 'motive' | 'depozite';

export default function Configurari() {
  const [activeTab, setActiveTab] = useState<TabType>('statusuri');
  const [statusuri, setStatusuri] = useState<StatusColet[]>(STATUSURI_DEFAULT);
  const [motiveEsec, setMotiveEsec] = useState<MotivEsec[]>(MOTIVE_ESEC_DEFAULT);
  const [depozite, setDepozite] = useState<Depozit[]>(DEPOZITE_DEFAULT);
  
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states
  const [formStatus, setFormStatus] = useState({ cod: '', nume: '', descriere: '', culoare: '#3b82f6', activ: true });
  const [formMotiv, setFormMotiv] = useState({ cod: '', descriere: '', necesitaDetalii: false, activ: true });
  const [formDepozit, setFormDepozit] = useState({ nume: '', adresa: '', oras: '', judet: '', capacitate: 0, activ: true });

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    if (activeTab === 'statusuri') {
      setFormStatus({ cod: '', nume: '', descriere: '', culoare: '#3b82f6', activ: true });
    } else if (activeTab === 'motive') {
      setFormMotiv({ cod: '', descriere: '', necesitaDetalii: false, activ: true });
    } else {
      setFormDepozit({ nume: '', adresa: '', oras: '', judet: '', capacitate: 0, activ: true });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // Status handlers
  const handleSubmitStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && selectedItem) {
      setStatusuri(statusuri.map(s => s.id === selectedItem.id ? { ...s, ...formStatus } : s));
    } else {
      setStatusuri([...statusuri, { id: Date.now(), ...formStatus }]);
    }
    closeModal();
  };

  const editStatus = (status: StatusColet) => {
    setEditMode(true);
    setSelectedItem(status);
    setFormStatus({ cod: status.cod, nume: status.nume, descriere: status.descriere, culoare: status.culoare, activ: status.activ });
    setShowModal(true);
  };

  const toggleStatusActiv = (id: number) => {
    setStatusuri(statusuri.map(s => s.id === id ? { ...s, activ: !s.activ } : s));
  };

  const deleteStatus = (id: number) => {
    if (confirm('Sigur vrei să ștergi acest status?')) {
      setStatusuri(statusuri.filter(s => s.id !== id));
    }
  };

  // Motiv handlers
  const handleSubmitMotiv = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && selectedItem) {
      setMotiveEsec(motiveEsec.map(m => m.id === selectedItem.id ? { ...m, ...formMotiv } : m));
    } else {
      setMotiveEsec([...motiveEsec, { id: Date.now(), ...formMotiv }]);
    }
    closeModal();
  };

  const editMotiv = (motiv: MotivEsec) => {
    setEditMode(true);
    setSelectedItem(motiv);
    setFormMotiv({ cod: motiv.cod, descriere: motiv.descriere, necesitaDetalii: motiv.necesitaDetalii, activ: motiv.activ });
    setShowModal(true);
  };

  const toggleMotivActiv = (id: number) => {
    setMotiveEsec(motiveEsec.map(m => m.id === id ? { ...m, activ: !m.activ } : m));
  };

  const deleteMotiv = (id: number) => {
    if (confirm('Sigur vrei să ștergi acest motiv?')) {
      setMotiveEsec(motiveEsec.filter(m => m.id !== id));
    }
  };

  // Depozit handlers
  const handleSubmitDepozit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && selectedItem) {
      setDepozite(depozite.map(d => d.id === selectedItem.id ? { ...d, ...formDepozit } : d));
    } else {
      setDepozite([...depozite, { id: Date.now(), ...formDepozit }]);
    }
    closeModal();
  };

  const editDepozit = (depozit: Depozit) => {
    setEditMode(true);
    setSelectedItem(depozit);
    setFormDepozit({ 
      nume: depozit.nume, 
      adresa: depozit.adresa, 
      oras: depozit.oras, 
      judet: depozit.judet, 
      capacitate: depozit.capacitate, 
      activ: depozit.activ 
    });
    setShowModal(true);
  };

  const toggleDepozitActiv = (id: number) => {
    setDepozite(depozite.map(d => d.id === id ? { ...d, activ: !d.activ } : d));
  };

  const deleteDepozit = (id: number) => {
    if (confirm('Sigur vrei să ștergi acest depozit?')) {
      setDepozite(depozite.filter(d => d.id !== id));
    }
  };

  return (
    <div className="configurari-page">
      <div className="page-header">
        <div>
          <h1>Configurări Sistem</h1>
          <p>Gestionează statusuri, motive eșec și depozite</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAddModal}>
            + Adaugă {activeTab === 'statusuri' ? 'status' : activeTab === 'motive' ? 'motiv' : 'depozit'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'statusuri' ? 'active' : ''}`}
          onClick={() => setActiveTab('statusuri')}
        >
          🏷️ Statusuri colete
        </button>
        <button 
          className={`tab ${activeTab === 'motive' ? 'active' : ''}`}
          onClick={() => setActiveTab('motive')}
        >
          ❌ Motive eșec
        </button>
        <button 
          className={`tab ${activeTab === 'depozite' ? 'active' : ''}`}
          onClick={() => setActiveTab('depozite')}
        >
          🏭 Depozite
        </button>
      </div>

      {/* Statusuri Tab */}
      {activeTab === 'statusuri' && (
        <div className="data-table-container">
          <div className="table-header">
            <h2>Statusuri colete ({statusuri.length})</h2>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Culoare</th>
                <th>Cod</th>
                <th>Nume</th>
                <th>Descriere</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {statusuri.map(status => (
                <tr key={status.id}>
                  <td>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '6px', 
                      background: status.culoare 
                    }} />
                  </td>
                  <td><code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{status.cod}</code></td>
                  <td><strong>{status.nume}</strong></td>
                  <td>{status.descriere}</td>
                  <td>
                    <span className={`badge ${status.activ ? 'badge-active' : 'badge-inactive'}`}>
                      {status.activ ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-edit" onClick={() => editStatus(status)}>✏️</button>
                      <button 
                        className={status.activ ? 'btn-danger' : 'btn-success'}
                        onClick={() => toggleStatusActiv(status.id)}
                      >
                        {status.activ ? '⏸️' : '▶️'}
                      </button>
                      <button className="btn-danger" onClick={() => deleteStatus(status.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Motive Tab */}
      {activeTab === 'motive' && (
        <div className="data-table-container">
          <div className="table-header">
            <h2>Motive eșec livrare ({motiveEsec.length})</h2>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Cod</th>
                <th>Descriere</th>
                <th>Necesită detalii</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {motiveEsec.map(motiv => (
                <tr key={motiv.id}>
                  <td><code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{motiv.cod}</code></td>
                  <td><strong>{motiv.descriere}</strong></td>
                  <td>
                    <span className={`badge ${motiv.necesitaDetalii ? 'badge-curier' : 'badge-inactive'}`}>
                      {motiv.necesitaDetalii ? 'Da' : 'Nu'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${motiv.activ ? 'badge-active' : 'badge-inactive'}`}>
                      {motiv.activ ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-edit" onClick={() => editMotiv(motiv)}>✏️</button>
                      <button 
                        className={motiv.activ ? 'btn-danger' : 'btn-success'}
                        onClick={() => toggleMotivActiv(motiv.id)}
                      >
                        {motiv.activ ? '⏸️' : '▶️'}
                      </button>
                      <button className="btn-danger" onClick={() => deleteMotiv(motiv.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Depozite Tab */}
      {activeTab === 'depozite' && (
        <div className="data-table-container">
          <div className="table-header">
            <h2>Depozite ({depozite.length})</h2>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Nume</th>
                <th>Adresă</th>
                <th>Oraș</th>
                <th>Județ</th>
                <th>Capacitate</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {depozite.map(depozit => (
                <tr key={depozit.id}>
                  <td><strong>{depozit.nume}</strong></td>
                  <td>{depozit.adresa}</td>
                  <td>{depozit.oras}</td>
                  <td>{depozit.judet}</td>
                  <td>{depozit.capacitate} colete</td>
                  <td>
                    <span className={`badge ${depozit.activ ? 'badge-active' : 'badge-inactive'}`}>
                      {depozit.activ ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-edit" onClick={() => editDepozit(depozit)}>✏️</button>
                      <button 
                        className={depozit.activ ? 'btn-danger' : 'btn-success'}
                        onClick={() => toggleDepozitActiv(depozit.id)}
                      >
                        {depozit.activ ? '⏸️' : '▶️'}
                      </button>
                      <button className="btn-danger" onClick={() => deleteDepozit(depozit.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Status */}
      {showModal && activeTab === 'statusuri' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Editează status' : 'Adaugă status nou'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmitStatus}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Cod *</label>
                    <input
                      type="text"
                      value={formStatus.cod}
                      onChange={e => setFormStatus({...formStatus, cod: e.target.value})}
                      required
                      placeholder="ex: in_livrare"
                    />
                  </div>
                  <div className="form-group">
                    <label>Culoare</label>
                    <input
                      type="color"
                      value={formStatus.culoare}
                      onChange={e => setFormStatus({...formStatus, culoare: e.target.value})}
                      style={{ height: '42px' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Nume afișat *</label>
                  <input
                    type="text"
                    value={formStatus.nume}
                    onChange={e => setFormStatus({...formStatus, nume: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descriere</label>
                  <textarea
                    value={formStatus.descriere}
                    onChange={e => setFormStatus({...formStatus, descriere: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Anulează</button>
                <button type="submit" className="btn-primary">{editMode ? 'Salvează' : 'Adaugă'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Motiv */}
      {showModal && activeTab === 'motive' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Editează motiv' : 'Adaugă motiv nou'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmitMotiv}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Cod *</label>
                  <input
                    type="text"
                    value={formMotiv.cod}
                    onChange={e => setFormMotiv({...formMotiv, cod: e.target.value})}
                    required
                    placeholder="ex: destinatar_absent"
                  />
                </div>

                <div className="form-group">
                  <label>Descriere *</label>
                  <input
                    type="text"
                    value={formMotiv.descriere}
                    onChange={e => setFormMotiv({...formMotiv, descriere: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formMotiv.necesitaDetalii}
                      onChange={e => setFormMotiv({...formMotiv, necesitaDetalii: e.target.checked})}
                      style={{ width: '20px', height: '20px' }}
                    />
                    Necesită detalii suplimentare de la curier
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Anulează</button>
                <button type="submit" className="btn-primary">{editMode ? 'Salvează' : 'Adaugă'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Depozit */}
      {showModal && activeTab === 'depozite' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Editează depozit' : 'Adaugă depozit nou'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmitDepozit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nume depozit *</label>
                  <input
                    type="text"
                    value={formDepozit.nume}
                    onChange={e => setFormDepozit({...formDepozit, nume: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Adresă *</label>
                  <input
                    type="text"
                    value={formDepozit.adresa}
                    onChange={e => setFormDepozit({...formDepozit, adresa: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Oraș *</label>
                    <input
                      type="text"
                      value={formDepozit.oras}
                      onChange={e => setFormDepozit({...formDepozit, oras: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Județ *</label>
                    <input
                      type="text"
                      value={formDepozit.judet}
                      onChange={e => setFormDepozit({...formDepozit, judet: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Capacitate (nr. colete)</label>
                  <input
                    type="number"
                    value={formDepozit.capacitate}
                    onChange={e => setFormDepozit({...formDepozit, capacitate: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>Anulează</button>
                <button type="submit" className="btn-primary">{editMode ? 'Salvează' : 'Adaugă'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
