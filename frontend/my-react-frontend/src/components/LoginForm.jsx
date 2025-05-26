import React, { useState } from 'react';
import { login } from '../api/auth';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(username);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit">Log In</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default LoginForm;
