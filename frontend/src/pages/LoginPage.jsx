import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('jwt', res.data.token);
      setAuthToken(res.data.token);
      navigate('/admin');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Invalid credentials';
      setError(message);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={submit} className="card" style={{ display: 'grid', gap: 10, width: 360 }}>
        <div className="page-title" style={{ margin: 0, textAlign: 'center' }}>Admin Login</div>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn primary" type="submit">Login</button>
        {error && <div style={{ color: '#ef4444' }}>{error}</div>}
      </form>
    </div>
  );
}


