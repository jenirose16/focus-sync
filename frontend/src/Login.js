import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Temporarily bypass authentication for demo
    onLogin({ username: 'Demo User', email, totalXP: 1200 });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="glass-card" style={{ padding: '2rem', width: '300px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login to FocusSync</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
            required
          />
          <button type="submit" style={{ width: '100%', padding: '0.5rem', background: '#00d4aa', border: 'none', color: 'white', borderRadius: '4px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;