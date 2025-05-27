import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" style={{ textDecoration: 'underline', color: '#007bff' }}>
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;
