import { useState, useEffect } from 'react';
import './AdminLayout.css';

interface Serviciu {
  idServiciu: number;
  numeServiciu: string;
  descriere: string;
  pretBaza: number;
  pretKg: number;
  pretKm: number;
  timpLivrare: string;
  activ: boolean;
}

interface Tarif {
  idTarif: number;
  numeZona: string;
  pretMinim: number;
  pretKg: number;
  pretKm: number;
  activ: boolean;
}

const SERVICII_DEFAULT: Serviciu[] = [
  { idServiciu: 1, numeServiciu: 'Standard', descriere: 'Livrare în 2-3 zile lucrătoare', pretBaza: 15, pretKg: 2, pretKm: 0.5, timpLivrare: '2-3 zile', activ: true },
  { idServiciu: 2, numeServiciu: 'Express', descriere: 'Livrare în 24 ore', pretBaza: 25, pretKg: 3, pretKm: 1, timpLivrare: '24 ore', activ: true },
  { idServiciu: 3, numeServiciu: 'Same Day', descriere: 'Livrare în aceeași zi', pretBaza: 45, pretKg: 5, pretKm: 1.5, timpLivrare: 'Aceeași zi', activ: true },
  { idServiciu: 4, numeServiciu: 'Economy', descriere: 'Livrare în 5-7 zile', pretBaza: 10, pretKg: 1.5, pretKm: 0.3, timpLivrare: '5-7 zile', activ: false },
];

const TARIFE_DEFAULT: Tarif[] = [
  { idTarif: 1, numeZona: 'București', pretMinim: 12, pretKg: 1.5, pretKm: 0.4, activ: true },
  { idTarif: 2, numeZona: 'Urban', pretMinim: 15, pretKg: 2, pretKm: 0.5, activ: true },
  { idTarif: 3, numeZona: 'Rural', pretMinim: 20, pretKg: 2.5, pretKm: 0.8, activ: true },
  { idTarif: 4, numeZona: 'Greu accesibil', pretMinim: 30, pretKg: 3, pretKm: 1.2, activ: true },
];

export default function ServiciiTarife() {
  const [activeTab, setActiveTab] = useState<'servicii' | 'tarife'>('servicii');
  const [servicii, setServicii] = useState<Serviciu[]>(SERVICII_DEFAULT);
  const [tarife, setTarife] = useState<Tarif[]>(TARIFE_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Serviciu | Tarif | null>(null);

  const [formServiciu, setFormServiciu] = useState({
    numeServiciu: '',
    descriere: '',
    pretBaza: 0,
    pretKg: 0,
    pretKm: 0,
    timpLivrare: '',
    activ: true
  });

  const [formTarif, setFormTarif] = useState({
    numeZona: '',
    pretMinim: 0,
    pretKg: 0,
    pretKm: 0,
    activ: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [serviciiRes, tarifeRes] = await Promise.all([
        fetch('http://localhost:8081/api/admin/servicii'),
        fetch('http://localhost:8081/api/admin/tarife')
      ]);

      if (serviciiRes.ok) {
        const data = await serviciiRes.json();
        if (data.length > 0) setServicii(data);
      }
      if (tarifeRes.ok) {
        const data = await tarifeRes.json();
        if (data.length > 0) setTarife(data);
      }
    } catch (error) {
      console.error('Eroare la încărcarea datelor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitServiciu = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && selectedItem) {
      setServicii(servicii.map(s => 
        s.idServiciu === (selectedItem as Serviciu).idServiciu 
          ? { ...s, ...formServiciu }
          : s
      ));
    } else {
      const newServiciu: Serviciu = {
        idServiciu: Math.max(...servicii.map(s => s.idServiciu)) + 1,
        ...formServiciu
      };
      setServicii([...servicii, newServiciu]);
    }
    closeModal();
  };

  const handleSubmitTarif = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editMode && selectedItem) {
      setTarife(tarife.map(t => 
        t.idTarif === (selectedItem as Tarif).idTarif 
          ? { ...t, ...formTarif }
          : t
      ));
    } else {
      const newTarif: Tarif = {
        idTarif: Math.max(...tarife.map(t => t.idTarif)) + 1,
        ...formTarif
      };
      setTarife([...tarife, newTarif]);
    }
    closeModal();
  };

  const toggleServiciuActiv = (id: number) => {
    setServicii(servicii.map(s => 
      s.idServiciu === id ? { ...s, activ: !s.activ } : s
    ));
  };

  const toggleTarifActiv = (id: number) => {
    setTarife(tarife.map(t => 
      t.idTarif === id ? { ...t, activ: !t.activ } : t
    ));
  };

  const openAddModal = () => {
    setEditMode(false);
    setSelectedItem(null);
    if (activeTab === 'servicii') {
      setFormServiciu({
        numeServiciu: '',
        descriere: '',
        pretBaza: 0,
        pretKg: 0,
        pretKm: 0,
        timpLivrare: '',
        activ: true
      });
    } else {
      setFormTarif({
        numeZona: '',
        pretMinim: 0,
        pretKg: 0,
        pretKm: 0,
        activ: true
      });
    }
    setShowModal(true);
  };

  const openEditServiciu = (serviciu: Serviciu) => {
    setEditMode(true);
    setSelectedItem(serviciu);
    setFormServiciu({
      numeServiciu: serviciu.numeServiciu,
      descriere: serviciu.descriere,
      pretBaza: serviciu.pretBaza,
      pretKg: serviciu.pretKg,
      pretKm: serviciu.pretKm,
      timpLivrare: serviciu.timpLivrare,
      activ: serviciu.activ
    });
    setShowModal(true);
  };

  const openEditTarif = (tarif: Tarif) => {
    setEditMode(true);
    setSelectedItem(tarif);
    setFormTarif({
      numeZona: tarif.numeZona,
      pretMinim: tarif.pretMinim,
      pretKg: tarif.pretKg,
      pretKm: tarif.pretKm,
      activ: tarif.activ
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const deleteServiciu = (id: number) => {
    if (confirm('Sigur vrei să ștergi acest serviciu?')) {
      setServicii(servicii.filter(s => s.idServiciu !== id));
    }
  };

  const deleteTarif = (id: number) => {
    if (confirm('Sigur vrei să ștergi acest tarif?')) {
      setTarife(tarife.filter(t => t.idTarif !== id));
    }
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="servicii-tarife-page">
      <div className="page-header">
        <div>
          <h1>Servicii & Tarife</h1>
          <p>Configurează serviciile de livrare și tarifele asociate</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={openAddModal}>
            + Adaugă {activeTab === 'servicii' ? 'serviciu' : 'tarif'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'servicii' ? 'active' : ''}`}
          onClick={() => setActiveTab('servicii')}
        >
          📦 Servicii
        </button>
        <button 
          className={`tab ${activeTab === 'tarife' ? 'active' : ''}`}
          onClick={() => setActiveTab('tarife')}
        >
          💰 Tarife pe zone
        </button>
      </div>

      {/* Servicii Tab */}
      {activeTab === 'servicii' && (
        <div className="data-table-container">
          <div className="table-header">
            <h2>Servicii disponibile</h2>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Serviciu</th>
                <th>Descriere</th>
                <th>Preț bază</th>
                <th>Preț/kg</th>
                <th>Preț/km</th>
                <th>Timp livrare</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {servicii.map(serviciu => (
                <tr key={serviciu.idServiciu}>
                  <td><strong>{serviciu.numeServiciu}</strong></td>
                  <td>{serviciu.descriere}</td>
                  <td>{serviciu.pretBaza.toFixed(2)} RON</td>
                  <td>{serviciu.pretKg.toFixed(2)} RON</td>
                  <td>{serviciu.pretKm.toFixed(2)} RON</td>
                  <td>{serviciu.timpLivrare}</td>
                  <td>
                    <span className={`badge ${serviciu.activ ? 'badge-active' : 'badge-inactive'}`}>
                      {serviciu.activ ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-edit" onClick={() => openEditServiciu(serviciu)}>
                        ✏️
                      </button>
                      <button 
                        className={serviciu.activ ? 'btn-danger' : 'btn-success'}
                        onClick={() => toggleServiciuActiv(serviciu.idServiciu)}
                      >
                        {serviciu.activ ? '⏸️' : '▶️'}
                      </button>
                      <button className="btn-danger" onClick={() => deleteServiciu(serviciu.idServiciu)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tarife Tab */}
      {activeTab === 'tarife' && (
        <div className="data-table-container">
          <div className="table-header">
            <h2>Tarife pe zone geografice</h2>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Zonă</th>
                <th>Preț minim</th>
                <th>Preț/kg</th>
                <th>Preț/km</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {tarife.map(tarif => (
                <tr key={tarif.idTarif}>
                  <td><strong>{tarif.numeZona}</strong></td>
                  <td>{tarif.pretMinim.toFixed(2)} RON</td>
                  <td>{tarif.pretKg.toFixed(2)} RON</td>
                  <td>{tarif.pretKm.toFixed(2)} RON</td>
                  <td>
                    <span className={`badge ${tarif.activ ? 'badge-active' : 'badge-inactive'}`}>
                      {tarif.activ ? 'Activ' : 'Inactiv'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-edit" onClick={() => openEditTarif(tarif)}>
                        ✏️
                      </button>
                      <button 
                        className={tarif.activ ? 'btn-danger' : 'btn-success'}
                        onClick={() => toggleTarifActiv(tarif.idTarif)}
                      >
                        {tarif.activ ? '⏸️' : '▶️'}
                      </button>
                      <button className="btn-danger" onClick={() => deleteTarif(tarif.idTarif)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Serviciu */}
      {showModal && activeTab === 'servicii' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Editează serviciu' : 'Adaugă serviciu nou'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmitServiciu}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nume serviciu *</label>
                  <input
                    type="text"
                    value={formServiciu.numeServiciu}
                    onChange={e => setFormServiciu({...formServiciu, numeServiciu: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descriere</label>
                  <textarea
                    value={formServiciu.descriere}
                    onChange={e => setFormServiciu({...formServiciu, descriere: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preț bază (RON) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formServiciu.pretBaza}
                      onChange={e => setFormServiciu({...formServiciu, pretBaza: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Timp livrare</label>
                    <input
                      type="text"
                      value={formServiciu.timpLivrare}
                      onChange={e => setFormServiciu({...formServiciu, timpLivrare: e.target.value})}
                      placeholder="ex: 2-3 zile"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preț per kg (RON)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formServiciu.pretKg}
                      onChange={e => setFormServiciu({...formServiciu, pretKg: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preț per km (RON)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formServiciu.pretKm}
                      onChange={e => setFormServiciu({...formServiciu, pretKm: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Anulează
                </button>
                <button type="submit" className="btn-primary">
                  {editMode ? 'Salvează' : 'Adaugă'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tarif */}
      {showModal && activeTab === 'tarife' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editMode ? 'Editează tarif' : 'Adaugă tarif nou'}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={handleSubmitTarif}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nume zonă *</label>
                  <input
                    type="text"
                    value={formTarif.numeZona}
                    onChange={e => setFormTarif({...formTarif, numeZona: e.target.value})}
                    required
                    placeholder="ex: București, Urban, Rural"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preț minim (RON) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formTarif.pretMinim}
                      onChange={e => setFormTarif({...formTarif, pretMinim: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Preț per kg (RON)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formTarif.pretKg}
                      onChange={e => setFormTarif({...formTarif, pretKg: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Preț per km (RON)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formTarif.pretKm}
                    onChange={e => setFormTarif({...formTarif, pretKm: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Anulează
                </button>
                <button type="submit" className="btn-primary">
                  {editMode ? 'Salvează' : 'Adaugă'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
