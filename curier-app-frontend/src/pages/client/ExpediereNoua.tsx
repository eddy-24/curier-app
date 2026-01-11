import { useState, useEffect } from 'react';
import './ExpediereNoua.css';

interface Adresa {
  idAdresa: number;
  oras: string;
  strada: string;
  numar: string;
  bloc?: string;
  scara?: string;
  apartament?: string;
  judet?: string;
  codPostal: string;
  tara?: string;
  persoanaContact?: string;
  telefonContact?: string;
  detaliiSuplimentare?: string;
}

// Dimensiuni colet predefinite
const DIMENSIUNI_COLET = [
  { id: 'small', nume: 'Small', dimensiuni: '30 x 20 x 10 cm', maxKg: 2, pret: 11.50, icon: '📦' },
  { id: 'medium', nume: 'Medium', dimensiuni: '40 x 30 x 20 cm', maxKg: 5, pret: 17.00, icon: '📦' },
  { id: 'large', nume: 'Large', dimensiuni: '60 x 40 x 30 cm', maxKg: 15, pret: 22.50, icon: '📦' },
  { id: 'xlarge', nume: 'Extra Large', dimensiuni: '80 x 60 x 40 cm', maxKg: 30, pret: 28.00, icon: '📦' },
  { id: 'custom', nume: 'Personalizat', dimensiuni: 'Alege dimensiunile', maxKg: 50, pret: 15.00, icon: '📐' }
];

// Tipuri de conținut
const TIPURI_CONTINUT = [
  { id: 'standard', nume: 'Standard', descriere: 'Obiecte rezistente', icon: '📦' },
  { id: 'fragil', nume: 'Fragil', descriere: 'Manipulare cu atenție', icon: '⚠️', extraPret: 5.00 },
  { id: 'documente', nume: 'Documente', descriere: 'Acte, hârtii', icon: '📄' },
  { id: 'electronice', nume: 'Electronice', descriere: 'Dispozitive electronice', icon: '💻', extraPret: 3.00 }
];

// Servicii suplimentare
const SERVICII_EXTRA = [
  { id: 'ramburs', nume: 'Ramburs la livrare', descriere: 'Încasare numerar la destinatar', pret: 7.50 },
  { id: 'asigurare', nume: 'Asigurare colet', descriere: 'Asigurare până la 1000 RON', pret: 14.00 },
  { id: 'fragil', nume: 'Manipulare fragilă', descriere: 'Atenție specială la transport', pret: 5.00 }
];

const PASI = [
  { id: 1, nume: 'Detalii colet' },
  { id: 2, nume: 'Expeditor' },
  { id: 3, nume: 'Destinatar' },
  { id: 4, nume: 'Servicii extra' },
  { id: 5, nume: 'Confirmare' }
];

const emptyAdresa = {
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

export default function ExpediereNoua() {
  const [step, setStep] = useState(1);
  const [adrese, setAdrese] = useState<Adresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [awbCodes, setAwbCodes] = useState<string[]>([]);
  
  const clientId = localStorage.getItem('userId') || '1';

  // Date formular
  const [dimensiuneSelectata, setDimensiuneSelectata] = useState('');
  const [greutateKg, setGreutateKg] = useState('');
  const [continutColet, setContinutColet] = useState('');
  const [tipContinut, setTipContinut] = useState('standard');
  
  // Dimensiuni personalizate
  const [lungimeCm, setLungimeCm] = useState('');
  const [latimeCm, setLatimeCm] = useState('');
  const [inaltimeCm, setInaltimeCm] = useState('');
  
  // Expeditor
  const [expeditorNume, setExpeditorNume] = useState('');
  const [expeditorTelefon, setExpeditorTelefon] = useState('');
  const [expeditorEmail, setExpeditorEmail] = useState('');
  const [expeditorAdresaId, setExpeditorAdresaId] = useState('');
  const [showExpeditorForm, setShowExpeditorForm] = useState(false);
  const [expeditorAdresaNoua, setExpeditorAdresaNoua] = useState(emptyAdresa);
  
  // Destinatar
  const [destinatarNume, setDestinatarNume] = useState('');
  const [destinatarTelefon, setDestinatarTelefon] = useState('');
  const [destinatarEmail, setDestinatarEmail] = useState('');
  const [destinatarAdresaId, setDestinatarAdresaId] = useState('');
  const [showDestinatarForm, setShowDestinatarForm] = useState(false);
  const [destinatarAdresaNoua, setDestinatarAdresaNoua] = useState(emptyAdresa);
  
  // Servicii extra
  const [serviciiSelectate, setServiciiSelectate] = useState<string[]>([]);
  
  // Plata
  const [modalitatePlata, setModalitatePlata] = useState('card');

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
    } catch (err) {
      console.error('Eroare la încărcarea adreselor:', err);
    }
  };

  const toggleServiciu = (serviciu: string) => {
    setServiciiSelectate(prev => 
      prev.includes(serviciu) 
        ? prev.filter(s => s !== serviciu)
        : [...prev, serviciu]
    );
  };

  const calculeazaCostTotal = () => {
    let total = 0;
    const dim = DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata);
    
    if (dim) {
      if (dim.id === 'custom') {
        // Calcul pret pentru dimensiuni personalizate
        const l = parseFloat(lungimeCm) || 0;
        const w = parseFloat(latimeCm) || 0;
        const h = parseFloat(inaltimeCm) || 0;
        const volumCm3 = l * w * h;
        // Preț bazat pe volum: 15 lei bază + 0.0001 lei/cm³
        total += 15 + (volumCm3 * 0.0001);
      } else {
        total += dim.pret;
      }
    }
    
    const greutate = parseFloat(greutateKg) || 0;
    if (dim && greutate > dim.maxKg) {
      total += (greutate - dim.maxKg) * 2;
    }
    
    // Adaugă costul tipului de conținut
    const tipCont = TIPURI_CONTINUT.find(t => t.id === tipContinut);
    if (tipCont && tipCont.extraPret) {
      total += tipCont.extraPret;
    }
    
    serviciiSelectate.forEach(sid => {
      const serv = SERVICII_EXTRA.find(s => s.id === sid);
      if (serv) total += serv.pret;
    });
    
    total += 8; // Taxă transport de bază
    return total;
  };

  const handleSaveExpeditorAdresa = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/client/${clientId}/adrese`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expeditorAdresaNoua)
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAdrese();
        setExpeditorAdresaId(data.adresa.idAdresa.toString());
        setShowExpeditorForm(false);
        setExpeditorAdresaNoua(emptyAdresa);
      }
    } catch (err) {
      console.error('Eroare:', err);
    }
  };

  const handleSaveDestinatarAdresa = async () => {
    try {
      const res = await fetch(`http://localhost:8081/api/client/${clientId}/adrese`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destinatarAdresaNoua)
      });
      if (res.ok) {
        const data = await res.json();
        await fetchAdrese();
        setDestinatarAdresaId(data.adresa.idAdresa.toString());
        setShowDestinatarForm(false);
        setDestinatarAdresaNoua(emptyAdresa);
      }
    } catch (err) {
      console.error('Eroare:', err);
    }
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!dimensiuneSelectata) {
        setError('Selectează dimensiunea coletului');
        return false;
      }
      if (dimensiuneSelectata === 'custom') {
        if (!lungimeCm || !latimeCm || !inaltimeCm) {
          setError('Completează toate dimensiunile personalizate');
          return false;
        }
        if (parseFloat(lungimeCm) <= 0 || parseFloat(latimeCm) <= 0 || parseFloat(inaltimeCm) <= 0) {
          setError('Dimensiunile trebuie să fie mai mari decât 0');
          return false;
        }
      }
    }
    if (step === 2) {
      if (!expeditorNume || !expeditorTelefon) {
        setError('Completează numele și telefonul expeditorului');
        return false;
      }
      if (!expeditorAdresaId) {
        setError('Selectează sau adaugă adresa expeditorului');
        return false;
      }
    }
    if (step === 3) {
      if (!destinatarNume || !destinatarTelefon) {
        setError('Completează numele și telefonul destinatarului');
        return false;
      }
      if (!destinatarAdresaId) {
        setError('Selectează sau adaugă adresa destinatarului');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const dim = DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata);
      const payload = {
        modalitatePlata,
        colete: [{
          greutateKg: parseFloat(greutateKg) || dim?.maxKg || 1,
          volumM3: 0.01,
          tipServiciu: dimensiuneSelectata === 'small' ? 'standard' : 'express',
          pretDeclarat: 0,
          idAdresaExpeditor: parseInt(expeditorAdresaId),
          idAdresaDestinatar: parseInt(destinatarAdresaId)
        }]
      };

      const res = await fetch(`http://localhost:8081/api/client/${clientId}/expedieri`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setAwbCodes(data.awbCodes || []);
        setSuccess(true);
        setStep(6);
      } else {
        setError(data.message || 'A apărut o eroare');
      }
    } catch (err) {
      setError('Eroare de conexiune');
    } finally {
      setLoading(false);
    }
  };

  const formatAdresa = (adresa: Adresa) => {
    let addr = `${adresa.oras}, ${adresa.strada} ${adresa.numar}`;
    if (adresa.bloc) addr += `, Bl. ${adresa.bloc}`;
    if (adresa.codPostal) addr += `, ${adresa.codPostal}`;
    return addr;
  };

  const getAdresaById = (id: string) => adrese.find(a => a.idAdresa.toString() === id);

  if (success) {
    return (
      <div className="expediere-container">
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h1>Comanda a fost plasată!</h1>
          {awbCodes.length > 0 && (
            <div className="awb-info">
              <h3>Codul AWB al coletului:</h3>
              {awbCodes.map((awb, index) => (
                <p key={index} className="awb-code">{awb}</p>
              ))}
            </div>
          )}
          <p>Vei primi un email de confirmare cu detaliile comenzii.</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => window.location.href = '/client/tracking'}>
              Urmărește coletul
            </button>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              Trimite alt colet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="expediere-container">
      {/* Header */}
      <div className="expediere-header">
        <h1>🚚 Trimite coletul</h1>
        <div className="progress-bar">
          {PASI.map((pas, index) => (
            <div key={pas.id} className="progress-item">
              <span className={`progress-text ${step === pas.id ? 'active' : ''} ${step > pas.id ? 'completed' : ''}`}>
                {pas.nume}
              </span>
              {index < PASI.length - 1 && <span className="progress-separator">›</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="expediere-content">
        <div className="expediere-main">
          {step > 1 && <button className="btn-back" onClick={prevStep}>← Înapoi</button>}
          {error && <div className="error-message">{error}</div>}

          {/* Step 1: Dimensiuni Colet */}
          {step === 1 && (
            <div className="step-content">
              <h2>Alege dimensiunea coletului</h2>
              <div className="dimensiuni-grid">
                {DIMENSIUNI_COLET.map(dim => (
                  <div 
                    key={dim.id}
                    className={`dimensiune-card ${dimensiuneSelectata === dim.id ? 'selected' : ''}`}
                    onClick={() => setDimensiuneSelectata(dim.id)}
                  >
                    <div className="dimensiune-radio">
                      <span className={`radio ${dimensiuneSelectata === dim.id ? 'checked' : ''}`}></span>
                    </div>
                    <div className="dimensiune-icon">{dim.icon}</div>
                    <h3>{dim.nume}</h3>
                    <p className="dimensiune-size">{dim.dimensiuni}</p>
                    <p className="dimensiune-weight">Max. {dim.maxKg} kg</p>
                    <p className="dimensiune-pret">{dim.id === 'custom' ? 'de la ' : ''}{dim.pret.toFixed(2)} lei</p>
                  </div>
                ))}
              </div>

              {/* Dimensiuni personalizate */}
              {dimensiuneSelectata === 'custom' && (
                <div className="form-section custom-dimensions">
                  <h3>📐 Introdu dimensiunile coletului</h3>
                  <div className="form-row three-cols">
                    <div className="form-group">
                      <label>Lungime (cm) *</label>
                      <input 
                        type="number" 
                        value={lungimeCm} 
                        onChange={(e) => setLungimeCm(e.target.value)} 
                        placeholder="Ex: 50" 
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Lățime (cm) *</label>
                      <input 
                        type="number" 
                        value={latimeCm} 
                        onChange={(e) => setLatimeCm(e.target.value)} 
                        placeholder="Ex: 30" 
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Înălțime (cm) *</label>
                      <input 
                        type="number" 
                        value={inaltimeCm} 
                        onChange={(e) => setInaltimeCm(e.target.value)} 
                        placeholder="Ex: 20" 
                        min="1"
                      />
                    </div>
                  </div>
                  {lungimeCm && latimeCm && inaltimeCm && (
                    <p className="dimension-preview">
                      Dimensiuni: <strong>{lungimeCm} x {latimeCm} x {inaltimeCm} cm</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Tip Conținut */}
              <div className="form-section">
                <h3>📋 Tip conținut colet</h3>
                <div className="continut-grid">
                  {TIPURI_CONTINUT.map(tip => (
                    <div 
                      key={tip.id}
                      className={`continut-card ${tipContinut === tip.id ? 'selected' : ''}`}
                      onClick={() => setTipContinut(tip.id)}
                    >
                      <span className={`radio ${tipContinut === tip.id ? 'checked' : ''}`}></span>
                      <span className="continut-icon">{tip.icon}</span>
                      <div className="continut-info">
                        <strong>{tip.nume}</strong>
                        <span>{tip.descriere}</span>
                      </div>
                      {tip.extraPret && <span className="continut-extra">+{tip.extraPret.toFixed(2)} lei</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Detalii suplimentare</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Greutate estimată (kg)</label>
                    <input type="number" value={greutateKg} onChange={(e) => setGreutateKg(e.target.value)} placeholder="Ex: 2.5" step="0.1" />
                  </div>
                  <div className="form-group">
                    <label>Descriere conținut</label>
                    <input type="text" value={continutColet} onChange={(e) => setContinutColet(e.target.value)} placeholder="Ex: Haine, cărți, etc..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Expeditor */}
          {step === 2 && (
            <div className="step-content">
              <h2>Datele expeditorului</h2>
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Prenume & Nume *</label>
                    <input type="text" value={expeditorNume} onChange={(e) => setExpeditorNume(e.target.value)} placeholder="Introdu numele complet" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefon *</label>
                    <div className="phone-input">
                      <span className="phone-prefix">🇷🇴 +40</span>
                      <input type="tel" value={expeditorTelefon} onChange={(e) => setExpeditorTelefon(e.target.value)} placeholder="7xxxxxxxx" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={expeditorEmail} onChange={(e) => setExpeditorEmail(e.target.value)} placeholder="email@exemplu.com" />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3>Adresa de ridicare</h3>
                {adrese.length > 0 && (
                  <div className="adrese-list">
                    {adrese.map(adresa => (
                      <div key={adresa.idAdresa} className={`adresa-option ${expeditorAdresaId === adresa.idAdresa.toString() ? 'selected' : ''}`} onClick={() => setExpeditorAdresaId(adresa.idAdresa.toString())}>
                        <span className={`radio ${expeditorAdresaId === adresa.idAdresa.toString() ? 'checked' : ''}`}></span>
                        <div className="adresa-info">
                          <strong>{adresa.oras}</strong>
                          <span>{adresa.strada} {adresa.numar}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="btn-add-address" onClick={() => setShowExpeditorForm(!showExpeditorForm)}>
                  {showExpeditorForm ? '− Anulează' : '+ Adaugă adresă nouă'}
                </button>
                {showExpeditorForm && (
                  <div className="address-form">
                    <div className="form-row">
                      <div className="form-group"><label>Oraș *</label><input type="text" value={expeditorAdresaNoua.oras} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, oras: e.target.value})} placeholder="București" /></div>
                      <div className="form-group"><label>Județ</label><input type="text" value={expeditorAdresaNoua.judet} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, judet: e.target.value})} placeholder="Sector 1" /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group flex-2"><label>Strada *</label><input type="text" value={expeditorAdresaNoua.strada} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, strada: e.target.value})} placeholder="Strada Exemplu" /></div>
                      <div className="form-group"><label>Nr. *</label><input type="text" value={expeditorAdresaNoua.numar} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, numar: e.target.value})} placeholder="10" /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>Bloc</label><input type="text" value={expeditorAdresaNoua.bloc} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, bloc: e.target.value})} placeholder="A1" /></div>
                      <div className="form-group"><label>Scara</label><input type="text" value={expeditorAdresaNoua.scara} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, scara: e.target.value})} placeholder="B" /></div>
                      <div className="form-group"><label>Apartament</label><input type="text" value={expeditorAdresaNoua.apartament} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, apartament: e.target.value})} placeholder="42" /></div>
                      <div className="form-group"><label>Cod Poștal</label><input type="text" value={expeditorAdresaNoua.codPostal} onChange={(e) => setExpeditorAdresaNoua({...expeditorAdresaNoua, codPostal: e.target.value})} placeholder="010101" /></div>
                    </div>
                    <button className="btn-save-address" onClick={handleSaveExpeditorAdresa}>Salvează adresa</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Destinatar */}
          {step === 3 && (
            <div className="step-content">
              <h2>Datele destinatarului</h2>
              <div className="form-section">
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Prenume & Nume *</label>
                    <input type="text" value={destinatarNume} onChange={(e) => setDestinatarNume(e.target.value)} placeholder="Introdu numele complet" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefon *</label>
                    <div className="phone-input">
                      <span className="phone-prefix">🇷🇴 +40</span>
                      <input type="tel" value={destinatarTelefon} onChange={(e) => setDestinatarTelefon(e.target.value)} placeholder="7xxxxxxxx" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={destinatarEmail} onChange={(e) => setDestinatarEmail(e.target.value)} placeholder="email@exemplu.com" />
                  </div>
                </div>
              </div>
              <div className="form-section">
                <h3>Adresa de livrare</h3>
                {adrese.length > 0 && (
                  <div className="adrese-list">
                    {adrese.map(adresa => (
                      <div key={adresa.idAdresa} className={`adresa-option ${destinatarAdresaId === adresa.idAdresa.toString() ? 'selected' : ''}`} onClick={() => setDestinatarAdresaId(adresa.idAdresa.toString())}>
                        <span className={`radio ${destinatarAdresaId === adresa.idAdresa.toString() ? 'checked' : ''}`}></span>
                        <div className="adresa-info">
                          <strong>{adresa.oras}</strong>
                          <span>{adresa.strada} {adresa.numar}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="btn-add-address" onClick={() => setShowDestinatarForm(!showDestinatarForm)}>
                  {showDestinatarForm ? '− Anulează' : '+ Adaugă adresă nouă'}
                </button>
                {showDestinatarForm && (
                  <div className="address-form">
                    <div className="form-row">
                      <div className="form-group"><label>Oraș *</label><input type="text" value={destinatarAdresaNoua.oras} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, oras: e.target.value})} placeholder="București" /></div>
                      <div className="form-group"><label>Județ</label><input type="text" value={destinatarAdresaNoua.judet} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, judet: e.target.value})} placeholder="Sector 1" /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group flex-2"><label>Strada *</label><input type="text" value={destinatarAdresaNoua.strada} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, strada: e.target.value})} placeholder="Strada Exemplu" /></div>
                      <div className="form-group"><label>Nr. *</label><input type="text" value={destinatarAdresaNoua.numar} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, numar: e.target.value})} placeholder="10" /></div>
                    </div>
                    <div className="form-row">
                      <div className="form-group"><label>Bloc</label><input type="text" value={destinatarAdresaNoua.bloc} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, bloc: e.target.value})} placeholder="A1" /></div>
                      <div className="form-group"><label>Scara</label><input type="text" value={destinatarAdresaNoua.scara} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, scara: e.target.value})} placeholder="B" /></div>
                      <div className="form-group"><label>Apartament</label><input type="text" value={destinatarAdresaNoua.apartament} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, apartament: e.target.value})} placeholder="42" /></div>
                      <div className="form-group"><label>Cod Poștal</label><input type="text" value={destinatarAdresaNoua.codPostal} onChange={(e) => setDestinatarAdresaNoua({...destinatarAdresaNoua, codPostal: e.target.value})} placeholder="010101" /></div>
                    </div>
                    <button className="btn-save-address" onClick={handleSaveDestinatarAdresa}>Salvează adresa</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Servicii Suplimentare */}
          {step === 4 && (
            <div className="step-content">
              <h2>Servicii suplimentare</h2>
              <p className="step-description">Alege serviciile extra de care ai nevoie</p>
              <div className="servicii-list">
                {SERVICII_EXTRA.map(serv => (
                  <div key={serv.id} className={`serviciu-card ${serviciiSelectate.includes(serv.id) ? 'selected' : ''}`} onClick={() => toggleServiciu(serv.id)}>
                    <div className="serviciu-info">
                      <h4>{serv.nume}</h4>
                      <p>{serv.descriere}</p>
                    </div>
                    <div className="serviciu-pret">{serv.pret.toFixed(2)} lei</div>
                    <button className={`serviciu-toggle ${serviciiSelectate.includes(serv.id) ? 'active' : ''}`}>
                      {serviciiSelectate.includes(serv.id) ? '✓' : '+'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Confirmare */}
          {step === 5 && (
            <div className="step-content">
              <h2>Confirmă detaliile expedierii</h2>
              <div className="confirmare-section">
                <div className="confirmare-row">
                  <div className="confirmare-label"><span className="dot orange"></span>DE LA</div>
                  <div className="confirmare-value">
                    <strong>{expeditorNume}</strong>
                    <span>+40{expeditorTelefon}</span>
                    {expeditorEmail && <span>{expeditorEmail}</span>}
                    <span className="adresa-text">{getAdresaById(expeditorAdresaId) && formatAdresa(getAdresaById(expeditorAdresaId)!)}</span>
                  </div>
                  <button className="btn-modifica" onClick={() => setStep(2)}>Modifică</button>
                </div>
                <div className="confirmare-row">
                  <div className="confirmare-label"><span className="dot green"></span>LA</div>
                  <div className="confirmare-value">
                    <strong>{destinatarNume}</strong>
                    <span>+40{destinatarTelefon}</span>
                    {destinatarEmail && <span>{destinatarEmail}</span>}
                    <span className="adresa-text">{getAdresaById(destinatarAdresaId) && formatAdresa(getAdresaById(destinatarAdresaId)!)}</span>
                  </div>
                  <button className="btn-modifica" onClick={() => setStep(3)}>Modifică</button>
                </div>
              </div>
              <div className="confirmare-section">
                <div className="confirmare-row">
                  <div className="confirmare-label">DETALII COLET</div>
                  <div className="confirmare-value">
                    <strong>{DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata)?.nume}</strong>
                    <span>{DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata)?.dimensiuni}</span>
                    {greutateKg && <span>Greutate: {greutateKg} kg</span>}
                  </div>
                  <div className="confirmare-cost">{DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata)?.pret.toFixed(2)} lei</div>
                  <button className="btn-modifica" onClick={() => setStep(1)}>Modifică</button>
                </div>
              </div>
              {serviciiSelectate.length > 0 && (
                <div className="confirmare-section">
                  <div className="confirmare-row">
                    <div className="confirmare-label">SERVICII EXTRA</div>
                    <div className="confirmare-value">
                      {serviciiSelectate.map(sid => <span key={sid}>{SERVICII_EXTRA.find(s => s.id === sid)?.nume}</span>)}
                    </div>
                    <button className="btn-modifica" onClick={() => setStep(4)}>Modifică</button>
                  </div>
                </div>
              )}
              <div className="confirmare-section">
                <div className="confirmare-row">
                  <div className="confirmare-label">METODA DE PLATĂ</div>
                  <div className="plata-options">
                    <label className={`plata-option ${modalitatePlata === 'card' ? 'selected' : ''}`}>
                      <input type="radio" name="plata" value="card" checked={modalitatePlata === 'card'} onChange={(e) => setModalitatePlata(e.target.value)} />
                      <span className="plata-icon">💳</span> Card bancar
                    </label>
                    <label className={`plata-option ${modalitatePlata === 'cash' ? 'selected' : ''}`}>
                      <input type="radio" name="plata" value="cash" checked={modalitatePlata === 'cash'} onChange={(e) => setModalitatePlata(e.target.value)} />
                      <span className="plata-icon">💵</span> Numerar la curier
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Sumar comandă */}
        <div className="expediere-sidebar">
          <div className="sumar-card">
            <h3>Sumarul comenzii</h3>
            {dimensiuneSelectata && (
              <div className="sumar-item">
                <div className="sumar-label">DIMENSIUNE COLET</div>
                <div className="sumar-row">
                  <div>
                    <strong>{DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata)?.nume}</strong>
                    {dimensiuneSelectata === 'custom' && lungimeCm && latimeCm && inaltimeCm ? (
                      <small>{lungimeCm} x {latimeCm} x {inaltimeCm} cm</small>
                    ) : (
                      <small>{DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata)?.dimensiuni}</small>
                    )}
                    <small>Max. {DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata)?.maxKg} kg</small>
                  </div>
                  <div className="sumar-pret">
                    {dimensiuneSelectata === 'custom' && lungimeCm && latimeCm && inaltimeCm
                      ? (15 + (parseFloat(lungimeCm) * parseFloat(latimeCm) * parseFloat(inaltimeCm) * 0.0001)).toFixed(2)
                      : DIMENSIUNI_COLET.find(d => d.id === dimensiuneSelectata)?.pret.toFixed(2)
                    } lei
                  </div>
                </div>
              </div>
            )}
            {tipContinut && (
              <div className="sumar-item">
                <div className="sumar-label">TIP CONȚINUT</div>
                <div className="sumar-row">
                  <div>
                    <strong>{TIPURI_CONTINUT.find(t => t.id === tipContinut)?.icon} {TIPURI_CONTINUT.find(t => t.id === tipContinut)?.nume}</strong>
                  </div>
                  {TIPURI_CONTINUT.find(t => t.id === tipContinut)?.extraPret && (
                    <div className="sumar-pret">+{TIPURI_CONTINUT.find(t => t.id === tipContinut)?.extraPret?.toFixed(2)} lei</div>
                  )}
                </div>
              </div>
            )}
            <div className="sumar-item">
              <div className="sumar-label">TAXĂ TRANSPORT</div>
              <div className="sumar-row">
                <div><strong>Livrare standard</strong>{expeditorAdresaId && <small>{getAdresaById(expeditorAdresaId)?.oras}</small>}</div>
                <div className="sumar-pret">8.00 lei</div>
              </div>
            </div>
            {serviciiSelectate.length > 0 && (
              <div className="sumar-item">
                <div className="sumar-label">SERVICII EXTRA</div>
                {serviciiSelectate.map(sid => {
                  const serv = SERVICII_EXTRA.find(s => s.id === sid);
                  return serv && <div key={sid} className="sumar-row"><span>{serv.nume}</span><span className="sumar-pret">{serv.pret.toFixed(2)} lei</span></div>;
                })}
              </div>
            )}
            <div className="sumar-total">
              <span>Cost total</span>
              <span className="total-pret">{calculeazaCostTotal().toFixed(2)} lei</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="expediere-footer">
        <div className="footer-cost">
          <span className="cost-label">COSTUL PÂNĂ ACUM</span>
          <span className="cost-value">{calculeazaCostTotal().toFixed(2)} lei</span>
        </div>
        {step < 5 ? (
          <button className="btn-continua" onClick={nextStep}>CONTINUĂ</button>
        ) : (
          <button className="btn-continua" onClick={handleSubmit} disabled={loading}>
            {loading ? 'SE PROCESEAZĂ...' : 'CONTINUĂ LA PLATĂ'}
          </button>
        )}
      </div>
    </div>
  );
}
