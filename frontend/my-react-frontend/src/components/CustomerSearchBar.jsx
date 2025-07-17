// components/CustomerSearchBar.jsx
import React, { useState } from 'react';
import axios from 'axios';
//import './CustomerSearchBar.css';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CustomerSearchBar = ({ onResults }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const salespersonId = user?.salesperson_id;
  const role = user?.role;

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a name, email, or phone number');
      return;
    }

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await axios.get(`${BASE_URL}/api/customers/search`, {
        params: { query },
      });

      const filteredResults = role === 'manager'
        ? res.data
        : res.data.filter(
            (customer) => customer.id_of_salesperson?._id === salespersonId
          );

      onResults(filteredResults, hasSearched);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Something went wrong while searching');
      onResults([], hasSearched);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Αναζήτηση με όνομα, email ή τηλέφωνο"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ flexGrow: 1 }}
        />
        <button onClick={handleSearch} className="search-button">Αναζήτηση</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default CustomerSearchBar;
