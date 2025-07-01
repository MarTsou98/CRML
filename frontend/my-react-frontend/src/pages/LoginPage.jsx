import React, { useState, useContext } from 'react';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');  // NEW
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Pass both username and password now
      const data = await login(username, password);
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/DashBoard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}> {/* NEW */}
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
