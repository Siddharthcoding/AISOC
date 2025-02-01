// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Update handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.post('http://localhost:5000/login', credentials, {
            withCredentials: true
        });
        const authCheck = await axios.get('http://localhost:5000/check-auth', {
            withCredentials: true
        });
        setRemaining(authCheck.data.remaining);
        navigate('/');
        } catch (err) {
        setError('Invalid email or password');
        }
    };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to UwU Generator! 🐱</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-submit-btn">Login</button>
          <button 
            type="button" 
            className="guest-continue-btn"
            onClick={() => navigate('/')}
          >
            Continue as Guest
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
