import { useState, useEffect } from 'react';
import './Adrese.css';

interface Adresa {
  idAdresa: number;
  strada: string;
  numar: string;
  bloc?: string;
  scara?: string;
  apartament?: string;
  oras: string;
  judet: string;
  codPostal: string;
  tara: string;
  persoanaContact?: string;
  telefonContact?: string;
}

const emptyAdresa: Omit<Adresa, 'idAdresa'> = {
  strada: '',
  numar: '',
  bloc: '',
  scara: '',
  apartament: '',
  oras: '',
  judet: '',
  codPostal: '',
  tara: 'România',
  persoanaContact: '',
  telefonContact: ''
};

export default function Adrese() {
  const [adrese, setAdrese] = useState<Adresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAdresa, setEditingAdresa] = useState<Adresa | null>(null);
  const [formData, setFormData] = useState(emptyAdresa);
  const [saving, setSaving] = useState(false);

  const clientId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    fetchAdrese();
  }, []);

  const fetchAdrese = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/client/${clientId}/adrese`);
      if (res.ok) {
        const data = await res.json();
        setAdrese(data);
      }
    } catch (error) {
      console.error('Eroare la încărcarea adreselor:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAdresa(null);
    setFormData(emptyAdresa);
    setShowModal(true);
  };

  const openEditModal = (adresa: Adresa) => {
    setEditingAdresa(adresa);
    setFormData({
      strada: adresa.strada,
      numar: adresa.numar,
      bloc: adresa.bloc || '',
      scara: adresa.scara || '',
      apartament: adresa.apartament || '',
      oras: adresa.oras,
      judet: adresa.judet,
      codPostal: adresa.codPostal,
      tara: adresa.tara,
      persoanaContact: adresa.persoanaContact || '',
      telefonContact: adresa.telefonContact || ''
    });
    setShowModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingAdresa
        ? `http://localhost:8081/api/client/${clientId}/adrese/${editingAdresa.idAdresa}`
        : `http://localhost:8081/api/client/${clientId}/adrese`;

      const method = editingAdresa ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        fetchAdrese();
      } else {
        alert('Eroare la salvarea adresei');
      }
    } catch (error) {
      console.error('Eroare:', error);
      alert('Eroare la salvarea adresei');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (idAdresa: number) => {
    if (!window.confirm('Sigur vrei să ștergi această adresă?')) return;

    try {
      const res = await fetch(
        `http://localhost:8081/api/client/${clientId}/adrese/${idAdresa}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        fetchAdrese();
      } else {
        alert('Eroare la ștergerea adresei');
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const formatAdresa = (a: Adresa) => {
    let addr = `${a.strada} ${a.numar}`;
    if (a.bloc) addr += `, Bl. ${a.bloc}`;
    if (a.scara) addr += `, Sc. ${a.scara}`;
    if (a.apartament) addr += `, Ap. ${a.apartament}`;
    return addr;
  };

  if (loading) {
    return <div className="loading">Se încarcă...</div>;
  }

  return (
    <div className="adrese-page">
      <header className="page-header">
        <div className="header-row">
          <h1>Adresele mele</h1>
          <button className="btn-add" onClick={openAddModal}>
            + Adaugă adresă
          </button>
        </div>
      </header>

      {/* Adrese List */}
      {adrese.length === 0 ? (
        <div className="empty-state">
          <p>Nu ai nicio adresă salvată.</p>
          <button className="btn-primary" onClick={openAddModal}>
            Adaugă prima adresă
          </button>
        </div>
      ) : (
        <div className="adrese-grid">
          {adrese.map((adresa) => (
            <div key={adresa.idAdresa} className="adresa-card">
              <div className="adresa-content">
                <div className="adresa-main">
                  <h3>{formatAdresa(adresa)}</h3>
                  <p className="adresa-location">
                    {adresa.oras}, {adresa.judet}
                  </p>
                  <p className="adresa-postal">
                    {adresa.codPostal}, {adresa.tara}
                  </p>
                </div>

                {(adresa.persoanăContact || adresa.telefonContact) && (
                  <div className="adresa-contact">
                    {adresa.persoanăContact && (
                      <p className="contact-name">👤 {adresa.persoanăContact}</p>
                    )}
                    {adresa.telefonContact && (
                      <p className="contact-phone">📞 {adresa.telefonContact}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="adresa-actions">
                <button 
                  className="btn-edit" 
                  onClick={() => openEditModal(adresa)}
                >
                  Editează
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(adresa.idAdresa)}
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAdresa ? 'Editează adresa' : 'Adaugă adresă nouă'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Strada *</label>
                  <input
                    type="text"
                    name="strada"
                    value={formData.strada}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Număr *</label>
                  <input
                    type="text"
                    name="numar"
                    value={formData.numar}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bloc</label>
                  <input
                    type="text"
                    name="bloc"
                    value={formData.bloc}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Scara</label>
                  <input
                    type="text"
                    name="scara"
                    value={formData.scara}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Apartament</label>
                  <input
                    type="text"
                    name="apartament"
                    value={formData.apartament}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Oraș *</label>
                  <input
                    type="text"
                    name="oras"
                    value={formData.oras}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Județ *</label>
                  <input
                    type="text"
                    name="judet"
                    value={formData.judet}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cod Poștal *</label>
                  <input
                    type="text"
                    name="codPostal"
                    value={formData.codPostal}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Țara</label>
                  <input
                    type="text"
                    name="tara"
                    value={formData.tara}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full separator">
                  <span>Contact (opțional)</span>
                </div>

                <div className="form-group">
                  <label>Persoană contact</label>
                  <input
                    type="text"
                    name="persoanaContact"
                    value={formData.persoanaContact}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Telefon contact</label>
                  <input
                    type="tel"
                    name="telefonContact"
                    value={formData.telefonContact}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Anulează
                </button>
                <button 
                  type="submit" 
                  className="btn-save"
                  disabled={saving}
                >
                  {saving ? 'Se salvează...' : (editingAdresa ? 'Salvează' : 'Adaugă')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
