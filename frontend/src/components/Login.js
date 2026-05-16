import React, { useState } from 'react';

const BASE_URL = "http://localhost:5000";

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (isSignUp && username.trim().length === 0) {
      setError('Please choose a username');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isSignUp ? '/api/register' : '/api/login';
      const body = isSignUp ? { username, email, password } : { email, password };
      console.log("Attempting login at Port 5000...");
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        localStorage.setItem('focussyncToken', data.token);
        localStorage.setItem('focussyncUser', JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        console.error('Auth error response:', data);
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Network error details:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--background, #020617)' }}>
      <div className="glass-card" style={{ padding: '2rem', width: '340px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--text-primary, #f8fafc)' }}>
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>

        {error && (
          <div style={{
            color: '#ff6b6b',
            background: 'rgba(255, 107, 107, 0.12)',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.92rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={toggleButtonStyle}
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Create one'}
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  background: 'rgba(15, 23, 42, 0.75)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#e2e8f0',
  borderRadius: '10px',
  outline: 'none'
};

const buttonStyle = {
  width: '100%',
  padding: '0.95rem',
  background: 'linear-gradient(135deg, #10b981, #059669)',
  border: 'none',
  color: 'white',
  borderRadius: '10px',
  fontWeight: '700',
  cursor: 'pointer'
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#60a5fa',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '0.95rem'
};

export default Login;
