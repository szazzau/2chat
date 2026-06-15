import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);

      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Quick login helpers
  const quickLogin = (email, password) => {
    setFormData({ username: '', email, password });
    setTimeout(() => handleSubmit({ preventDefault: () => {} }), 0);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💬 2chat</h1>
        <p className="subtitle">Connect. Chat. Network.</p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required={isRegister}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <button 
          className="toggle-btn"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? 'Already have account? Login' : 'Need account? Register'}
        </button>

        <hr />

        <div className="quick-login">
          <p>Quick Demo Login:</p>
          <button 
            type="button"
            className="demo-btn"
            onClick={() => quickLogin('alice@example.com', 'demo123')}
          >
            Alice
          </button>
          <button 
            type="button"
            className="demo-btn"
            onClick={() => quickLogin('bob@example.com', 'demo123')}
          >
            Bob
          </button>
          <button 
            type="button"
            className="demo-btn"
            onClick={() => quickLogin('charlie@example.com', 'demo123')}
          >
            Charlie
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
