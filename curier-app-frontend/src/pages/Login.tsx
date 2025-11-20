import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('http://localhost:8080/api/utilizatori/login', {
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
        // Salvăm username-ul în localStorage
        localStorage.setItem('username', username);
        // Navigăm către dashboard
        navigate('/dashboard');
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
        <h1>🚚 Curier App</h1>
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

        <div className="demo-credentials">
          <p><strong>Credențiale demo:</strong></p>
          <p>👤 client1 / pass123</p>
          <p>🚚 curier1 / pass123</p>
          <p>🔧 admin / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
