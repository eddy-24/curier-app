import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/utilizatori/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          parola: password,
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        
        // Salvăm datele utilizatorului în localStorage
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('rol', userData.rol);
        localStorage.setItem('nume', userData.nume);
        localStorage.setItem('prenume', userData.prenume);
        localStorage.setItem('email', userData.email || '');
        localStorage.setItem('telefon', userData.telefon || '');
        
        // Redirecționăm în funcție de rol
        switch (userData.rol) {
          case 'client':
            navigate('/client/dashboard');
            break;
          case 'operator':
            navigate('/operator/dashboard');
            break;
          case 'curier':
            navigate('/curier/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        const errorText = await response.text();
        setError(errorText || 'Login failed');
      }
    } catch (err) {
      setError('Eroare de conexiune la server');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/beak-logo.png" alt="BEAK Logo" className="login-logo" />
        <h1>BEAK</h1>
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Introdu username-ul"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Parola</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introdu parola"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Se încarcă...' : 'Login'}
          </button>
        </form>

        <div className="register-prompt">
          <p>Nu ai încă un cont?</p>
          <Link to="/register" className="register-link">
            ✨ Creează cont gratuit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
