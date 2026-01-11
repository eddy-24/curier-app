import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    parola: '',
    confirmaParola: '',
    nume: '',
    prenume: '',
    email: '',
    telefon: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validări
    if (formData.parola !== formData.confirmaParola) {
      setError('Parolele nu coincid!');
      return;
    }

    if (formData.parola.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere!');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Adresa de email nu este validă!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/utilizatori/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          parola: formData.parola,
          nume: formData.nume,
          prenume: formData.prenume,
          email: formData.email,
          telefon: formData.telefon,
          rol: 'client'
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Eroare la înregistrare');
      }
    } catch (err) {
      setError('Eroare de conexiune la server');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card">
          <img src="/beak-logo.png" alt="BEAK Logo" className="login-logo" />
          <h1>BEAK</h1>
          <div className="success-message">
            <span className="success-icon">✅</span>
            <h2>Cont creat cu succes!</h2>
            <p>Vei fi redirecționat către pagina de login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card register-card">
        <img src="/beak-logo.png" alt="BEAK Logo" className="login-logo" />
        <h1>BEAK</h1>
        <h2>Creează cont</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prenume">Prenume</label>
              <input
                type="text"
                id="prenume"
                name="prenume"
                value={formData.prenume}
                onChange={handleChange}
                placeholder="Prenumele tău"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="nume">Nume</label>
              <input
                type="text"
                id="nume"
                name="nume"
                value={formData.nume}
                onChange={handleChange}
                placeholder="Numele tău"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Alege un username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="adresa@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefon">Telefon</label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              placeholder="07xxxxxxxx"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="parola">Parolă</label>
              <input
                type="password"
                id="parola"
                name="parola"
                value={formData.parola}
                onChange={handleChange}
                placeholder="Minim 6 caractere"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmaParola">Confirmă parola</label>
              <input
                type="password"
                id="confirmaParola"
                name="confirmaParola"
                value={formData.confirmaParola}
                onChange={handleChange}
                placeholder="Repetă parola"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Se creează contul...' : '✨ Creează cont'}
          </button>
        </form>

        <div className="register-prompt">
          <p>Ai deja un cont?</p>
          <Link to="/login" className="register-link">
            🔑 Autentifică-te
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
