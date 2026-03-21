import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(__API_URL__ + '/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');
      localStorage.setItem('admin_exp', data.expiresAt);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login__card">
        <div className="adm-login__brand">LexAuthority</div>
        <h1 className="adm-login__title">Admin Panel</h1>

        {error && <p className="adm-error" role="alert" style={{ marginBottom: '1.25rem' }}>{error}</p>}

        <form onSubmit={handleSubmit} className="adm-form">
          <div className="adm-field">
            <label className="adm-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="adm-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="adm-field">
            <label className="adm-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="adm-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="adm-btn adm-btn--primary adm-btn--full" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
